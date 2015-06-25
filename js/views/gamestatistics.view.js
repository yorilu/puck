define(['backbone','text!../templates/gamestatistics.tpl.html', 'puck', 'baseview', 'scroller', 'modelFactory', 'callback','deferred'], 
function (backbone, tpl, puck, baseview, scroller, modelFactory,callback, deferred) {
  // puck.go("gamestatistics");
  
  var view = baseview.extend({
    events : {
      
    },
    onInit: function (){
      console.log("gamestatistics init");
      
    },
    onShow: function (param){
      var that = this;
      this.param = param;
      /*
      var param = this.param = {
        data:{
          id:"c94f4d2899d94b71b405"
        }
      }
      */
      this.showLoading();
      
      /*
      courtId: "3"
        createTime: "2015-06-19 10:52:20"
        endTime: "2015-06-19 10:54:21"
        gameGroupId: 0
        gameName: "0"
        gameType: "2v2"
        guestTeamId: "976af12fee0b8ce44340"
        guestTeamLogoId: "1"
        guestTeamLogoUrl: null
        guestTeamName: "mao003"
        hasDirector: 0
        homeTeamId: "816ab1284d7e4653628c"
        homeTeamLogoId: "1"
        homeTeamLogoUrl: null
        homeTeamName: "guo003"
        id: "c94f4d2899d94b71b405"
        isFavorite: 0
        livePullUrlHi: "rtmp://wsvideopull.smartcourt.cn/prod/7775a2461ae04df3bcec7feb73e3ba14"
        livePullUrlLow: "rtmp://wsvideopull.smartcourt.cn/prod/7775a2461ae04df3bcec7feb73e3ba14_290"
        livePushUrl: "rtmp://wsvideopush.smartcourt.cn/prod/7775a2461ae04df3bcec7feb73e3ba14"
        remark: ""
        scoreKeeperAccount: "admin"
        sportType: "basketball"
        stadiumId: "5180000001"
        stadiumName: "V5篮球馆"
        startTime: "2015-06-19 10:53:02"
        status: "3"
        teamAScore: "5"
        teamBScore: "3"

        */
      
      /*
       assist: 1
      backboard: 0
      blocking: 0
      efficiency: "5.9"
      fieldGoalPercentage: "1"
      foul: 0
      freeThrow: "0/0"
      freeThrowPercentage: "0"
      isFirst: 1
      playerId: "a45a29a617c087147ce9"
      playerName: "w"
      playerNumber: "6"
      score: 3
      steal: 0
      teamId: "816ab1284d7e4653628c"
      teamName: "guo003"
      threePointShot: "1/1"
      threePointShotPercentage: "1"
      turnover: 0
      twoPointShot: "0/0"
      */
      var stModel = modelFactory.get('getBasketballStatistics');
      var nsModel = modelFactory.get('getNodeScores');
      
      var ps1 = stModel.$post({
        data:{
          gameId: param.data.id
        },
        success: function (info){
          
        },
        error: function (){
          
        }
      })
      
      var ps2 = nsModel.$post({
        data:{
          gameId: param.data.id
        },
        success: function (info){
          
        },
        error: function (){
          
        }
      })
      
      $.when(ps1,ps2).done(function (d1,d2){
        that.hideLoading();
        var scor = d2[0].data;
        var args = that.param.data;
        var stat = {
          teamA:[],
          teamB:[]
        };
        var tempstat = d1[0].data;
        for(var i=0;i<tempstat.length;i++){
          var item = tempstat[i];
          if(item.teamId == args.homeTeamId){
            stat.teamA.push(item);
          }else{
            stat.teamB.push(item);
          }
        }
        var tpll = _.template(tpl);
        that.$el.html(tpll({
          stat: stat,
          scor: scor,
          args: args
        }));
        that.initEvent();
      })
      
      
    },
    initEvent: function (){
      var tables = this.$el.find(".J_FixTable");
      var that = this;
     
      _.each(tables,function (item, index){
        that.bindTableEvent(item);
      })
    },
    bindTableEvent: function (table){
      var $p = $(table);
      var $table = $p.find(".J_Table");
      var $left = $p.find(".J_Left");
      var $top = $p.find(".J_Top");
      $left.css("position","relative");
      $top.css("position","relative");
      $table.on("scroll", function (event){
        $left.css("top",-this.scrollTop);
        $top.css("left",-this.scrollLeft);
      })
    },
    onHide: function (){
      console.log(111)
    }
  });
  
  return view;
});