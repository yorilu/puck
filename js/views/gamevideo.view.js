/**
 * Created by anders on 15/6/17.
 */
define(['backbone', 'text!../templates/gamevideo.tpl.html', 'puck', 'baseview','modelFactory'],
  function (backbone, tpl, puck, baseview, modelFactory) {

    var model = modelFactory.get('getGameClips')

    var view = baseview.extend({
      events: {},

      firstEnter: true,

      reqParam: {
        clientId: 'h5'
      },

      onInit: function () {
        this.$el.html(tpl);
        this.els = {
          wrapper: this.$el.find('#j_game_video_wrapper'),
          tpl:this.$el.find('#j_game_video_li_tpl')
        };

        this.tplFun = _.template(this.els.tpl.html());
      },

      onShow: function (opt) {
        if(this.firstEnter){
          if(opt.data.status == 0){
            this.showNoData();
          }else{
            this.reqParam.gameId = opt.data["id"];
            this.sendReq(this.reqParam, this.render);
          }
        }
        this.firstEnter = false;
      },


      onHide: function () {

      },

      sendReq: function (param, callback) {
        var self = this;
        model.$post({
          data: param,
          success: function (res) {
            callback.apply(self, [res.data]);
          }
        })
      },

      render: function (data) {
        if(data.length == 0){
          this.showNoData();
        }else{
          var html = this.tplFun(data)
          this.els.wrapper.html(html);
        }
      },

      //显示无数据
      showNoData:function(){
        this.$el.find('.no-data').show();
      }

    });

    return view;
  });
