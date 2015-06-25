/**
 * Created by anders on 15/6/15.
 */
define(['backbone', 'text!../templates/game.tpl.html', 'puck', 'modelFactory'],
  function(backbone, tpl, puck, modelFactory) {

    var model = modelFactory.get('getGame');

    var view = backbone.View.extend({

      events: {
        'click .return': 'back',
        'click .j_game_tab>li': 'switchTab'
      },

      tplFun: null,

      onInit: function() {
        this.tplFun = _.template(tpl);
      },

      onShow: function(opt) {
        var param = {
            gameId: opt.args
          },
          self = this;

        // this.showLoading();
        model.$post({
          data: param,
          success: function(res) {
            //self.hideLoading();
            self.render(res.data)
            self.initTabs(res.data);
          },
          error: function() {

          }
        });

      },

      onHide: function() {

      },

      render: function(data) {
        var html = this.tplFun(data);
        this.$el.html(html);
      },

      initTabs: function(data) {
        var views = [
          ["gamevideo.view", data]
        ];

        //只有已结束的篮球比赛,才显示统计和事件
        if (data.sportType == 'basketball') {
          views = [
            ["gameevent.view", data],
            ["gamevideo.view", data],
            ["gamestatistics.view", data]
          ];
        }

        this.tabs = puck.initTabs(views,
          this.$el.find(".j_game_tab a"),
          this.$el.find(".j_game_tab_content div"),
          this
        )
      },

      //回退
      back: function() {
        puck.back();
      },

      //切换tab
      switchTab: function(e) {
        var $dom = $(e.currentTarget),
          clazz = 'data-chat';
        if ($dom.hasClass(clazz)) {
          return;
        }
        $dom.siblings().removeClass(clazz);
        $dom.addClass(clazz);
      }
    });

    return view;
  });