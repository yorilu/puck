define(['backbone', 'text!../templates/index.tpl.html', 'puck', 'baseview', 'modelFactory'],
  function(backbone, tpl, puck, baseview, modelFactory) {

    var view = baseview.extend({
      events: {
        'click .J_Tabs>div': 'selectTab'
      },
      onInit: function() {

      },
      selectTab: function(e) {
        var $dom = $(e.currentTarget);
        var _class = 'curent' + $dom.attr('data-num');
        if ($dom.hasClass(_class)) {
          return;
        }
        $dom.siblings().removeClass('curent').removeClass('curent2').removeClass('curent3');
        $dom.addClass(_class);
      },
      onShow: function(opt) {
        if (opt.referer == 'citylist' && opt.data=='selected') {
          if (this.$el.html() == '') {
            this.showLoading();
            this.$el.html(_.template(tpl));
            this.initTabs();
            this.hideLoading();
          }
          this.tabs.show(1, opt.data)
          return;
        }
        if (opt.referer&&this.$el.html() !='') {
          return;
        }
        this.showLoading();
        this.$el.html(_.template(tpl));
        this.initTabs();
        this.hideLoading();
      },
      initTabs: function() {
        this.tabs = puck.initTabs([
            ["recommand.view", "param"],
            "stadiumlist.view",
            "gamelist.view"
          ],
          this.$el.find(".J_Tabs a"),
          this.$el.find(".J_TabsContent div"),
          this
        )
      },

      onHide: function() {
        console.log('onhide');
      }
    });

    return view;
  });