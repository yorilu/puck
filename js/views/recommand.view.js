define(['backbone', 'text!../templates/recommand.tpl.html', 'puck', 'baseview', 'utils', 'modelFactory', 'callback', 'deferred', 'videoPlayer'],
  function(backbone, tpl, puck, baseview, Util, modelFactory, callback, deferred) {

    var sDate = Util.Date;

    var getGamesModel = modelFactory.get("gamesModel");
    var getTopNVideoModel = modelFactory.get("getTopNVideo");

    var view = baseview.extend({
      events: {
        'click #js_goTopVideo': 'goTopVideo',
        'click #js_goGames': 'goGames',
        'click .js_download': 'goDownload',
        'click .js_goFeedback': 'goFeedback',
        'click #js_videoContainer li': 'clickVideo',
        'click .js_game': 'goNextPage'
      },
      goTopVideo: function() {
        puck.go('topvideo');
      },
      goGames: function() {
        $('#js_gameTab').click();
      },
      goFeedback: function() {
        puck.go('feedback');
      },
      goDownload: function() {
        Util.downloadApp();
      },
      goNextPage: function(e) {
        var dom = $(e.currentTarget),
          gameId = dom.data('gameid'),
          status = dom.data('status'),
          path = dom.data('path'),
          title = dom.data('title');

        if (status == '0') {
          //未开始
          alert('比赛尚未开始,请稍后重试!');
        } else if (status == '1' || status == '4') {
          //正在进行
          path = Util.Util.rtmp2m3u8(path);
          this.player.setSrc(path);
          this.player.setTitle(title);
          this.player.play();
          this.player.enterFullScreen();
        } else if (status == '2' || status == '3') {
          //已结束
          puck.go('/game/' + gameId);
        }
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
      requestGames: function(type) {
        var self = this;
        self.now = Util.Date.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        var g1 = getGamesModel.$post({
          data: {
            clientId: 'h5',
            startDate: self.now,
            upDown: 'down',
            //status:0,
            pageSize: 2,
            pageIndex: 1
          },
          success: function() {}
        });
        var g2 = getGamesModel.$post({
          data: {
            clientId: 'h5',
            startDate: self.now,
            upDown: 'up',
            //status:0,
            pageSize: 2,
            pageIndex: 1
          },
          success: function() {}
        });
        $.when(g1, g2).done(function(d1, d2) {
          var _data1 = d1[0] && d1[0].code == 0 && d1[0].data && d1[0].data.length > 0 ? d1[0].data : [];
          var _data2 = d2[0] && d2[0].code == 0 && d2[0].data && d2[0].data.length > 0 ? d2[0].data : [];
          var _data_ = _data1.concat(_data2);
          if (_data_ && _data_.length > 0) {
            var ss_now = Util.Date.str2mm(self.now);
            for (var i = 0, len = _data_.length; i < len; i++) {
              var diff = Util.Date.str2mm(_data_[i].startTime) - ss_now;
              _data_[i].diff = diff < 0 ? (0 - diff) : diff;
            }
            function sortByStartTime(a, b) {
              return a.diff - b.diff;
            }
            var d=_data_.sort(sortByStartTime);
            self.els.gamesContainer.html(self.gameTplFun({
              data: d.slice(0,2)
            })).show();
          }
        })
      },
      requestVideos: function() {
        var self = this;
        getTopNVideoModel.$post({
          data: {
            clientId: 'h5',
            pageSize: 4,
            pageIndex: 1,
            level: '5'
          },
          success: function(res) {
            if (res && res.data) {
              self.els.videosContainer.html(self.videoTplFun({
                data: res.data
              })).show();
            }
            console.log(res);
          },
          error: function() {}
        });
      },
      onInit: function() {
        console.log("recommand init");
        this.$el.html(tpl);
        if (!Util.platform.os.isIOS && !Util.platform.os.isAndroid) {
          this.$el.find('.js_download').hide();
        }
        this.els = {
          gamesContainer: this.$el.find('#js_gameContainer'),
          videosContainer: this.$el.find('#js_videoContainer'),
          gamesTpl: this.$el.find('#games_tpl'),
          videosTpl: this.$el.find('#videos_tpl')

        }

        this.gameTplFun = _.template(this.els.gamesTpl.html());
        this.videoTplFun = _.template(this.els.videosTpl.html());
        this.player = new MediaElementPlayer("#js_main_video", {
          features: ['playpause', 'progress', 'current', 'fullscreen', 'titlebar']
        });
      },
      onShow: function() {
        console.log("recommand show");
        this.requestGames();
        this.requestVideos();

      },
      onHide: function() {

      }
    });

    return view;
  });