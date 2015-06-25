/**
 * 首页赛事列表
 */

define(['backbone', 'text!../templates/gamelist.tpl.html',
    'puck', 'baseview', 'modelFactory', 'utils', 'scroller', 'videoPlayer'],
  function (backbone, tpl, puck, baseview, modelFactory, Util, Scroller, VideoPlayer) {


    var sDate = Util.Date,
      gamesModel = modelFactory.get('gamesModel');

    var view = baseview.extend({

      events: {
        'click .J_game': 'goNextPage'
      },

      dateTplFun: null,
      gameTplFun: null,
      //获取赛事列表请求参数
      getGamesParam: {
        clientId: 'h5',
        pageSize: '4',
        upDown: 'down',
        pageIndex: 1
      },

      livingGameIds: [],
      //定时刷新直播比分的定时器
      liveingGameTimer: null,

      //上一页的页码
      prePageIndex: 1,
      //下一页的页码
      nextPageIndex: 1,

      //播放器
      player: null,


      scroll: null,

      /**
       * 界面初次载入
       */
      onInit: function () {
        this.$el.html(tpl);
        this.todayStr = sDate.calDateByOffset(0) + " 00:00:00";
        this.getGamesParam.startDate = this.todayStr;
        this.els = {
          dateContainer: this.$el.find('#J_index_game_wapper'),
          dateListTpl: this.$el.find('#index_games_date_list_tpl'),
          gameListTpl: this.$el.find('#index_games_game_list_tpl')
        }

        this.dateTplFun = _.template(this.els.dateListTpl.html());
        this.gameTplFun = _.template(this.els.gameListTpl.html());

        this.player = new MediaElementPlayer("#js_main_video", {
          features: ['playpause', 'progress', 'current', 'fullscreen', 'titlebar']
        });

        var self = this;
        this.showLoading();
        //查询
        this.getGamesReq(this.getGamesParam, function (data) {
          var gameData = self.formattData(data.data);
          self.renderList(gameData);
        });

      },

      /**
       * 页面每次显示
       */
      onShow: function () {
        var self = this;
        this.liveingGameTimer = setInterval(function () {
          self.refreshGameScore();
        }, 60000)
        this.bindScroll()
      },

      /**
       * 页面每次隐藏
       */
      onHide: function () {
        clearInterval(this.liveingGameTimer);
        this.scroll.destroy();
      },

      /**
       * 刷新比赛比分
       */
      refreshGameScore: function () {
        if (this.livingGameIds.length > 0) {
          var param = _.clone(this.getGamesParam);
          param.pageIndex = 1;
          param.status = 1;
          this.getGamesReq(param, function (res) {
            var data = res.data;
            _.each(data, function (game, index) {
              var teamA = $('#' + game['id'] + '_' + game.homeTeamId + "_score"),
                teamB = $('#' + game['id'] + '_' + game.guestTeamId + "_score");
              teamA.html(game.teamAScore);
              teamB.html(game.teamBScore);
            });
          });
        }
      },

      /**
       * 送数据请求,q
       */
      getGamesReq: function (param, callback) {
        var self = this;
        gamesModel.$post({
          data: param,
          success: function (data) {
            self.hideLoading();
            if (data.length < 20) {
              self.scroll.destroy();
            } else {
              self.scroll.on();
            }
            callback.apply(self, [data]);
          }
        })
      },

      //渲染列表
      renderList: function (gameData) {
        this.renderDateList(gameData.dateMap);
        this.renderGameList(gameData.gameMap);
      },

      renderDateList:function(dateMap,dir){
        var html = this.dateTplFun({data: dateMap});
        var wrapper = this.els.dateContainer;
        if(wrapper.children().length>0){
          if(dir == 'up'){
            wrapper.prepend(html);
          }else{
            wrapper.append(html);
          }
        }else{
          wrapper.html(html);
        }
      },


      renderGameList:function(gameMap,dir){
        var self = this;
        _.each(gameMap, function (item, key) {
          var ul = self.$el.find('#J_index_games_ui_' + key);
          var gamesHtml = self.gameTplFun({
            data: item
          });
          if(ul.children().length>0){
            if(dir == 'up'){
              ul.prepend(gamesHtml);
            }else{
              ul.append(gamesHtml);
            }
          }else{
            ul.html(gamesHtml);
          }
        });
      },
      //将
      formattData: function (data) {
        var self = this,
        //gameMap 存放以日期为key的时间列表,如
        //{2015-02-24:[{},{}]}
          gameMap = {},
        //dateMap,存放的日期,如
        //{2015-02-24:"今天"}
          dateMap = {};
        _.each(data, function (item, key) {
          var date = item.startTime.substr(0, 10);

          if (!gameMap[date]) {
            gameMap[date] = [];
            dateMap[date] = Util.Trans.date(date);

          }
          //如果是以直播的比赛,记录比赛ID
          if (item.status == 1) {
            self.livingGameIds.push(item.id);
          }
          gameMap[date].push(item);
        })
        return {
          gameMap: gameMap,
          dateMap: dateMap
        }
      },


      /**
       *
       */
      goNextPage: function (e) {
        var dom = $(e.currentTarget),
          gameId = dom.data('gameid'),
          status = dom.data('status'),
          path = dom.data('path'),
          title = dom.data('title');

        if (status == '0') {
          //未开始
          puck.go('/game/' + gameId);
        } else if (status == '1') {
          //正在进行
          path = Util.Util.rtmp2m3u8(path);
          this.player.setSrc(path);
          this.player.setTitle(title);
          this.player.play();
          this.player.enterFullScreen();
        } else if (status == '2') {
          //已结束
          puck.go('/game/' + gameId);
        }
      },

      //获取下一页数据
      getNextPageData: function () {
        var self = this;
        this.nextPageIndex ++;
        this.getGamesParam.pageIndex = this.nextPageIndex;
        this.getGamesParam.upDown = 'down';
        this.getGamesReq(this.getGamesParam, function (res) {
          var gameData = self.formattData(res.data);
          var newDateMap = {};
          _.each(gameData.dateMap,function(item,key){
            var dateUI = $('#j_index_games_ui_'+key);
            //如果日期节点已存在,不再重新渲染
            if(dateUI.length ==0){
              newDateMap[key] = item;
            }
          })

          self.renderDateList(newDateMap);
          self.renderGameList(gameData.gameMap);
        })
      },

      //获取过去的比赛数据
      getPrePageData:function(){
        var self = this;
        this.prePageIndex ++;
        this.getGamesParam.pageIndex = this.prePageIndex;
        this.getGamesParam.upDown = 'up';
        this.getGamesReq(this.getGamesParam, function (res) {
          var gameData = self.formattData(res.data);
          var newDateMap = {};
          _.each(gameData.dateMap,function(item,key){
            var dateUI = $('#j_index_games_ui_'+key);
            //如果日期节点已存在,不再重新渲染
            if(dateUI.length ==0){
              newDateMap[key] = item;
            }
          })

          self.renderDateList(newDateMap,'up');
          self.renderGameList(gameData.gameMap,'up');
        })
      },

      //绑定滚动时间
      bindScroll: function (e) {
        var self = this;
        this.scroll = new Scroller(this.$el, {
          onScroll: function (forward, processing, finished) {
            processing(); //暂停滚动事件
            // forward  1:向下  -1:向上
            if (forward == -1) {
              self.getPrePageData();
            } else {
              self.getNextPageData();
            }

          }
        })
      }
    });

    return view;
  });