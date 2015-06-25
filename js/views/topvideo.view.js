/**
 * Created by anders on 15/6/15.
 */
define(['backbone', 'text!../templates/topvideo.tpl.html', 'puck', 'baseview', 'modelFactory', 'scroller', 'videoPlayer'],
  function(backbone, tpl, puck, baseview, modelFactory,  scroller) {

    var getTopNVideoModel = modelFactory.get("getTopNVideo");

    var listHelper = function(e) {
      this.self = e;
    }
    listHelper.prototype = {
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
          self.els.container.html(self.tplfun({
            data: data.data
          })).show();
          this.iscomplete = false;
        } else {
          //TODO no item
          self.els.container.html(self.els.notpl.html());
          this.iscomplete = true;
        }

      },
      addListRender: function(data) {
        var self = this.self;
        if (data && data.data && data.data.length > 0) {
          self.els.container.append(self.tplfun({
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
        'click .js_type li': 'selectType',
        'click .js_back': 'goBack',
        'click #js_container li': 'clickVideo'
      },
      clickVideo: function(e) {
        var $dom = $(e.currentTarget);
        var _path = $dom.attr('data-path'),
          _title = $dom.attr('data-title');
        if (_path) {
          this.player.setSrc(_path);
          this.player.setTitle(_title);
          this.player.play();
          this.player.enterFullScreen();
        }
      },
      goBack: function() {
        puck.back();
      },
      onInit: function() {
        this.listHelper = new listHelper(this);
        this.player = new MediaElementPlayer("#js_main_video", {
          features: ['playpause', 'progress', 'current', 'fullscreen', 'titlebar']
        });
      },
      onShow: function() {
        this.$el.html(tpl);
        this.els = {
          container: this.$el.find('#js_container'),
          tpl: this.$el.find('#topvideo_tpl'),
          notpl: this.$el.find('#no_topvideo_tpl')
        }

        this.tplfun = _.template(this.els.tpl.html());

        this.doRequest();
        this.bingScroll();
      },
      bingScroll: function() {
        var self = this;
        self.myScrollHandler = new scroller(this.$el, {
          onScroll: function(forward, processing, finished) { //必填 forward  1:向下  -1:向上
            if (forward == -1 || self.listHelper.iscomplete) {
              return;
            }
            processing(); //暂停滚动事件
            self.doRequest(true, function() {
              finished();
            });
          }
        })
      },

      selectType: function(e) {
        var $dom = $(e.currentTarget);
        if ($dom.find('a').hasClass('tm-leng')) {
          return;
        }
        $dom.parent().find('.tm-leng').removeClass('tm-leng');
        $dom.find('a').addClass('tm-leng');
        this.listHelper.sportType = $dom.attr('data-value');
        this.doRequest();
      },

      doRequest: function(isscroll, callback) {
        var self = this;
        if (isscroll) {
          this.listHelper.pageIndex += 1;
        } else {
          this.showLoading();
          this.listHelper.pageIndex = 1;
        }
        console.log(this.listHelper.pageIndex);
        getTopNVideoModel.$post({
          data: {
            clientId: 'h5',
            sportType: this.listHelper.sportType,
            pageSize: this.listHelper.pageSize,
            pageIndex: this.listHelper.pageIndex,
            level: '5'
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

      onHide: function() {
        this.myScrollHandler.destroy();
      }
    });

    return view;
  });
// CityID
// UserID
// ClientID
// SportType
// PageSize
// PageIndex
// Level