define(['backbone', 'text!../templates/stadiumlist.tpl.html', 'puck', 'baseview', 'modelFactory', 'utils', 'scroller', 'geolocation'],
  function(backbone, tpl, puck, baseview, modelFactory, Util, scroller, geolocation) {

    var getCityStadiumListModel = modelFactory.get("getCityStadiumList");

    var getCityListModel = modelFactory.get("getCityList");

    var listHelper = function(e) {
      this.self = e;
    }
    listHelper.prototype = {
      cityId: 2,
      sportType: '',
      pageSize: 20,
      pageIndex: 1,
      iscomplete: false,
      scrollAdapter: function(data, isScroll) {
        var self = this.self;
        if (data) {
          isScroll ? this.addListRender(data) : this.listRender(data);
        }
      },
      errorEvt: function() {
        var self = this.self;
        this.iscomplete = true;
        self.hideLoading();

      },
      listRender: function(data) {
        var self = this.self;
        window.scrollTo(0, 0);
        self.hideLoading();
        if (data && data.data && data.data.length > 0) {
          self.els.stadiumContainer.html(self.stadiumTplFun({
            data: data.data
          })).show();
          this.iscomplete = false;
        } else {
          //TODO no item
          self.els.stadiumContainer.html(self.els.noStadiumTpl.html());
          this.iscomplete = true;
        }

      },
      addListRender: function(data) {
        var self = this.self;
        if (data && data.data && data.data.length > 0) {
          self.els.stadiumContainer.append(self.stadiumTplFun({
            data: data.data
          })).show();
          this.iscomplete = false;
        } else {
          this.iscomplete = true;
          //TODO no item
        }
      }
    }

    var view = baseview.extend({
      events: {
        'click .js_type div': 'selectType',
        'click .js_stadiumlist_item': 'goStadiumDetail',
        'click .js_goCityList': 'goCityList'
      },
      requestStadiumList: function(isscroll, callback) {
        var self = this;
        if (isscroll) {
          this.listHelper.pageIndex += 1;
        } else {
          this.showLoading();
          this.listHelper.pageIndex = 1;
        }
        console.log(this.listHelper.pageIndex);
        getCityStadiumListModel.$post({
          data: {
            clientId: 'h5',
            cityId: this.listHelper.cityId,
            showAll: Util.Store.get('SMART_HIDE_MODE') ? "Y" : "N",
            sportType: this.listHelper.sportType,
            pageSize: this.listHelper.pageSize,
            pageIndex: this.listHelper.pageIndex,
          },
          success: function(res) {
            self.listHelper.scrollAdapter(res, isscroll);
            console.log(res);
            callback && callback();
          },
          error: function() {
            callback && callback();
          }
        });
      },
      selectType: function(e) {
        var $dom = $(e.currentTarget);
        if ($dom.hasClass('sta-seted')) {
          return;
        }
        $dom.siblings().removeClass('sta-seted');
        $dom.addClass('sta-seted');
        this.listHelper.sportType = $dom.attr('data-value');
        this.requestStadiumList();
      },
      bingScroll: function() {
        var self = this;
        self.myScrollHandler = new scroller(this.$el, {
          onScroll: function(forward, processing, finished) { //必填 forward  1:向下  -1:向上
            if (forward == -1 || self.listHelper.iscomplete) {
              return;
            }
            processing(); //暂停滚动事件
            self.requestStadiumList(true, function() {
              finished();
            });
          }
        })
      },

      goStadiumDetail: function(e) {
        var dom = $(e.currentTarget);
        var stadiumId = dom.data("stadiumid");
        puck.go('stadium/' + stadiumId);
      },

      goCityList: function(e) {
        puck.go('citylist');

      },

      doGeoService: function() {
        var self = this;
        geolocation.getCurrentPosition({
          onComplete: function(data) { //逆地址解析的callback
            var cityname = data.result.addressComponent.city.replace('市', '').replace('省', '').replace('县', '');
            console.log(data.result.addressComponent.city.replace('市', '').replace('省', '').replace('县', ''))
            self.requestCityList(cityname);
          }
        })
      },
      /**
       * 请求城市列表查看当前定位城市是否在支持的城市中
       */
      requestCityList: function(cityname) {
        var self = this;
        var c = {
          id: null,
          name: cityname
        };
        getCityListModel.$post({
          success: function(res) {
            if (res && res.data && res.data.length > 0) {
              for (var i = 0, len = res.data.length; i < len; i++) {
                if (res.data[i].name == cityname) {
                  c = {
                    id: res.data[i].id,
                    name: res.data[i].name
                  }
                  break;
                }
              }
            }
            Util.Store.set('LOCATION_CITY', c);
            //如果当前定位城市和现在城市不同，则提示是否切换
            if (c && c.id && c.id != self.listHelper.cityId) {
              if (confirm("系统定位您在" + c.name + "，是否切换？")) {
                self.listHelper.cityId = c.id;
                self.$el.find('.js_goCityList').html(c.name);
                Util.Store.set('SMART_SELECTED_CITY', c);
                self.requestStadiumList();
              }
            }
          },
          error: function() {}
        });
      },

      onInit: function() {
        this.notFirstEnter = true;
        this.listHelper = new listHelper(this);
        this.$el.html(tpl);
        this.els = {
          stadiumContainer: this.$el.find('#js_stadiumContainer'),
          stadiumTpl: this.$el.find('#stadium_tpl'),
          noStadiumTpl: this.$el.find('#no_stadium_tpl')
        }
        this.stadiumTplFun = _.template(this.els.stadiumTpl.html());
      },
      onShow: function(opt) {
        //如果不是首次进入并且不是从城市列表切换城市进入的话，直接return
        if (!this.notFirstEnter && (!opt || opt.data != 'selected')) {
          return;
        }
        //如果从城市列表切换城市进入，则tab默认回到全部
        if (opt && opt.data == 'selected') {
          this.listHelper.sportType = "";
          this.$el.find('.js_type div').removeClass('sta-seted');
          $(this.$el.find('.js_type div')[0]).addClass('sta-seted');
        }
        //如果localstorage中没有选中城市，则默认插一条北京作为默认选中
        if (!Util.Store.get('SMART_SELECTED_CITY')) {
          Util.Store.set('SMART_SELECTED_CITY', {
            id: 2,
            name: '北京'
          })
        }
        var store = Util.Store.get('SMART_SELECTED_CITY');
        this.listHelper.cityId = store && store.id ? store.id : 2;
        this.$el.find('.js_goCityList').html(store && store.name ? store.name : '北京');

        //第一次进入需要定位
        if (this.notFirstEnter) {
          this.doGeoService();
        }
        this.notFirstEnter = false;

        this.requestStadiumList();

        this.bingScroll();
      },
      onHide: function() {
        this.myScrollHandler.destroy();
      }

    });

    return view;
  });