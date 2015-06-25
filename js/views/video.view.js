/**
 * Created by anders on 15/6/17.
 */
/**
 * 精彩视频分享页面
 */
define(['backbone', 'text!../templates/video.tpl.html', 'puck', 'baseview', 'utils', 'modelFactory'],
  function (backbone, tpl, puck, baseview, Util, ModelFactory) {
    Path = Util.Path;
    var view = baseview.extend({

      videoInfo: null,

      tplFun :null,

      events: {
        'click .j_share_video_item':'playNewVideo'
      },

      onInit: function () {
        this.$el.html(tpl);
        var url = location.href;
        //为ios 转义
        url = url.replace(/%and%/,'$');

        this.videoInfo = {
          videoUrl: Path.getUrlParam(url, 'video_url'),
          gameName: decodeURI(Path.getUrlParam(url, 'game_name')),
          videoName: decodeURI(Path.getUrlParam(url, 'video_name')),
          sportType: Path.getUrlParam(url, 'sport_type')
        }

        this.els = {
          title: this.$el.find('#j_share_video_title'),
          player: this.$el.find('#j_share_video_player'),
          listWrap: this.$el.find('#j_share_video_list'),
          listTpl: this.$el.find('#j_share_video_list_tpl')
        }

        this.els.player.height($('.j_bg_img').height());


        this.tplFun = _.template(this.els.listTpl.html());
      },

      onShow: function () {
        document.title = this.videoInfo.videoName;
        this.els.title.text(this.videoInfo.videoName);
        this.els.player.attr('src', this.videoInfo.videoUrl);



        var topNModel = ModelFactory.get('getTopNVideo'),
          type = this.videoInfo.sportType,
          self = this;

        topNModel.$post({
          data: {
            clientId: 'h5',
            sportType: type ? type : '',
            cityId: 1,
            pageSize: 10,
            pageIndex: 1,
            level: '5'

          },
          success: function (data) {
            self.render(data.data);
          },
          error: function () {

          }
        })
      },


      onHide: function () {

      },

      render: function (list) {
        var html = this.tplFun({data:list});
        this.els.listWrap.html(html);
      },

      /**
       * 播放一个新视频
       */
      playNewVideo: function(e){
        var dom = $(e.currentTarget);
        var src = dom.data('src'), title = dom.data('title');
        this.els.player.attr('src',src);
        document.title = title;
        this.els.player[0].play();
      }
    });

    return view;
  });