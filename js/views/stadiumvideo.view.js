/**
 * Created by anders on 15/6/18.
 */
define(['backbone', 'text!../templates/stadiumvideo.tpl.html', 'puck', 'baseview', 'modelFactory','videoPlayer'],
  function (backbone, tpl, puck, baseview, modelFactory,videoPlayer) {

    var model = modelFactory.get('getStadiumOverview');

    view = baseview.extend({

      events: {
        'click #filterBtn':'showSelectLayer',
        'click #closeBtn': 'closeSelectLayer',
        'click #j_stadium_info_select_ul': 'filterSearch',
        'click #j_stadium_video_wrapper' : 'playVideo'
      },

      firstEnter: true,
      sportTypes : [],

      reqParam : {
        clientId : 'h5'
      },

      player: null,

      onInit: function () {
        this.tplFun = _.template(tpl);

        this.player = new MediaElementPlayer("#js_main_video", {
          features: ['playpause', 'progress', 'current', 'fullscreen', 'titlebar']
        });
      },

      onShow: function (data) {
        //Tab 切换时,不每次加载
        if(!this.firstEnter){
          return ;
        }
        var dataBody = data.data;

        this.firstEnter = false;
        this.sportTypes = dataBody.sportType.split(',');
        this.reqParam.stadiumId = dataBody['id'];

        this.sendRequest(this.reqParam,this.render)
      },

      onHide: function () {

      },

      /**
       * 发送数据请求
       * @param param
       * @param callback
       */
      sendRequest:function(param,callback){
        var self = this;
        model.$post({
          data: param,
          success: function(data){
            var dBody = data.data;
            dBody.sportTypes = self.sportTypes;
            callback.apply(self,[dBody])
          },
          error: function(){

          }
        })
      },

      /**
       * 渲染视频列表
       * @param data
       */
      render:function(data){
        var html = this.tplFun(data);
        this.$el.html(html);

        this.els = {
          selectLayer : this.$el.find('#j_stadium_info_select_layer')
        }
      },

      /**
       * 显示筛选蒙层
       */
      showSelectLayer:function(){
        $('body').css('overflow','hidden');
        this.els.selectLayer.show();
      },

      /**
       * 关闭筛选蒙层
       */
      closeSelectLayer:function(){
        $('body').css('overflow','auto');
        this.els.selectLayer.hide();
      },

      /**
       * 类型过滤查询
       * @param e
       */
      filterSearch:function(e){
        var dom = $(e.target).parent().parent(),
          sportType = dom.data('sporttype');
        this.reqParam.sportType = sportType;

        this.sendRequest(this.reqParam,this.render);
      },

      /**
       * 播放视频
       * @param e
       */
      playVideo:function(e){
        var dom = $(e.target);
        var path = dom.data('path'),
          title = dom.data('title');
        if(path){
          this.player.setSrc(path);
          this.player.setTitle(title);
          this.player.play();
          this.player.enterFullScreen();
        }
      }

    });

    return view;
  });