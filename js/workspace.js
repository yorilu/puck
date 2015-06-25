define(['backbone'], function(backbone) {

  var workspace = {
    //首页
    "index": {
      //route: "detail/:query",//带参数的路由前缀必须和 该key值相同, 如果不写默认路由是该key值
      view: "index.view",
      default: true
    },
    //精彩视频列表
    "topvideo": {
      view: "topvideo.view"
    },

    //场馆详情
    "stadium": {
      route: "stadium/:stadiumId",
      view: "stadium.view"
    },

    //视频详情, 暂供分享使用
    "video": {
      route: "video/:videoId",
      view: "video.view"
    },
    //赛事详情
    "game": {
      route: "game/:gameId",
      view: "game.view"
    },

    "gamestatistics": {
      view: "gamestatistics.view"
    },
    "coolvideo": {
      view: "coolvideo.view"
    },
    "citylist": {
      view: "citylist.view"
    },
    "feedback": {
      view: "feedback.view"
    }
    //"game": {
    //  route: "game/:gameId",
    //  view:"game.view"
    //}
  }

  return workspace;
});