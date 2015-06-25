/**
 * Created by anders on 15/6/18.
 */
define(['backbone', 'text!../templates/stadium.tpl.html', 'puck',  'baseview', 'modelFactory'],
  function (backbone, tpl, puck, baseview, modelFactory) {

    var stadiumModel = modelFactory.get('getStadiumInfo');

    var view = baseview.extend({

      events: {
        'click .return': 'back',
        'click #j_stadium_tab': 'switchTab'
      },

      onInit: function () {
        this.tplFun = _.template(tpl)
      },

      //显示
      onShow: function (opt) {
        var param = {
          stadiumId: opt.args
        }, self = this;

        stadiumModel.$post({
          data: param,
          success: function (data) {
            self.render(data.data);
          },
          error: function (data) {

          }
        })
        this.showLoading();
        this.hideLoading();
      },

      initTabs: function (data) {
        this.tabs = puck.initTabs([
            ["stadiuminfo.view", data],
            ["stadiumvideo.view", data]
          ],
          this.$el.find("#j_stadium_tab a"),
          this.$el.find("#j_stadium_tab_content p"),
          this
        )
      },

      onHide: function () {

      },

      render: function (data) {
        var html = this.tplFun(data);
        this.$el.html(html);
        this.initTabs(data);
      },

      /**
       * 切换Tab
       * @param e
       */
      switchTab:function(e){
        var li = $(e.target).parent();
        //如果已选择,不做处理
        if(li.hasClass('plan-now')){
          return;
        }else{
          $('#j_stadium_tab').children().toggleClass('plan-now')
        }
      },

      /**
       * 回退
       */
      back: function () {
        puck.back();
      }


    });

    return view;
  });

