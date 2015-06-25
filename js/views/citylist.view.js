/**
 * Created by anders on 15/6/15.
 */
define(['backbone', 'text!../templates/citylist.tpl.html', 'puck', 'modelFactory', 'utils'],
  function(backbone, tpl, puck, modelFactory, Util) {

    var getCityListModel = modelFactory.get("getCityList");

    var view = backbone.View.extend({
      events: {
        'click .js_back': 'goBack',
        'click #js_cityContainer li': 'selectCity',
        'click .js_location': 'selectCity'

      },

      goBack: function() {
        puck.back();
      },
      selectCity: function(e) {
        var $dom = $(e.currentTarget);
        var data = {
          id: $dom.attr('data-id'),
          name: $dom.attr('data-name')
        }
        this.$el.find('#js_cityContainer li').removeClass('check-cut');
        this.$el.find('.js_city_' + $dom.attr('data-id')).addClass('check-cut');

        Util.Store.set('SMART_SELECTED_CITY', data);
        puck.back(-1, 'selected');
      },
      /**
       * 请求城市列表
       */
      requestCityList: function() {
        var self = this;
        getCityListModel.$post({
          success: function(res) {
            if (res && res.data && res.data.length > 0) {
              var data = self.formatData(res.data);
              Util.Store.set('SMART_CITY_LIST', data);
            }
            self.renderHTML();
          },
          error: function() {
            self.renderHTML();
          }
        });
      },

      renderHTML: function() {
        var data = Util.Store.get('SMART_CITY_LIST');
        if (data && data.length > 0) {
          this.els.cityContainer.html(this.citylistTplFun({
            data: data
          })).show();
        }
        var locationstore = Util.Store.get('LOCATION_CITY');
        this.els.locationContainer.html(this.locationTplFun({
          data: locationstore
        })).show();
      },
      /**
       * 将城市返回的数据重新fotmat成模板数据
       */
      formatData: function(data) {
        var store = Util.Store.get('SMART_SELECTED_CITY'),
          _data = data,
          _key = new Array(),
          _list = [],
          d = [];
        var sid = store && store.id ? store.id : null;
        _.each(_data, function(e, i) {
          var _first = e.pinyin.substr(0, 1).toUpperCase();
          if ($.inArray(_first, _key) == -1) {
            _key.push(_first);
            _list[_first] = [];
          }
          if (sid && sid == e.id) {
            e.selected = true;
          }
          _list[_first].push(e);
        })
        _key.sort();
        _.each(_key, function(e, i) {
          d.push({
            key: e,
            value: _list[e]
          });
        })
        return d;
      },
      onInit: function() {
        this.$el.html(tpl);

        this.els = {
          cityContainer: this.$el.find('#js_cityContainer'),
          locationContainer: this.$el.find('#js_locationContainer'),
          citylistTpl: this.$el.find('#citylist_tpl'),
          locationTpl: this.$el.find('#location_tpl')
        }

        this.citylistTplFun = _.template(this.els.citylistTpl.html());
        this.locationTplFun = _.template(this.els.locationTpl.html());

        this.requestCityList()
      },
      onShow: function() {},
      onHide: function() {

      }
    });

    return view;
  });