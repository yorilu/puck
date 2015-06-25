define(["basemodel", "puck", "basemodel", "config"], function(basemodel, puck, basemodel, config) {

  var base_url = config.requestUrl;

  puck.setBaseUrl(base_url);

  puck.registerModel("indexModel", {
    url: "Cloud-Game-QueryGameData/getGame",
    cache: true
  })

  //查询赛事列表
  puck.registerModel("gamesModel", {
    url: "Cloud-Game-QueryGameData/getGames"
  })

  //查询赛事详情
  puck.registerModel("getGame", {
    url: "Cloud-Game-QueryGameData/getGame",
    cache: true
  });

  //查询赛事事件
  puck.registerModel("getGameEvent", {
    url: "Cloud-Game-QueryGameData/getGameEventDescrips",
    cache: true
  });

  puck.registerModel("getGameClips", {
    url: "Cloud-Video-ClipInfo/getGameClips",
    cache: true
  });
  //查询首页精彩视频
  puck.registerModel("getTopNVideo", {
    url: "Cloud-Video-ClipInfo/getTopNVideo"
  })

  //场馆列表
  puck.registerModel("getCityStadiumList", {
    url: "Cloud-MD-BaseData/getCityStadiumList"
  })

  //场馆详情
  puck.registerModel("getStadiumInfo", {
    url: "Cloud-MD-BaseData/getStadiumInfo"
  })

   //城市列表
  puck.registerModel("getCityList", {
    url: "Cloud-MD-BaseData/getCityList"
  })

  puck.registerModel('getStadiumOverview',{
    url: "Cloud-Video-ClipInfo/getStadiumOverview"
  })
  
  //赛事统计
  puck.registerModel('getBasketballStatistics',{
    url: "Cloud-Game-QueryGameData/getBasketballStatistics"
  })
  
  puck.registerModel('getNodeScores',{
    url: "Cloud-Game-QueryGameData/getNodeScores"
  })

    puck.registerModel('addFeedback',{
    url: "Cloud-User-CustomerService/addFeedback"
  })

  return {
    get: function(name) {
      return puck.getModel(name);
    }
  }
});