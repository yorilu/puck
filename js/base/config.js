;define(['backbone'], function (backbone) {

  var config = {
    requestUrl: ""
  }
  
  var env = '',host = location.host;
  if (host == 'm.test1.smartcourt.cn') {
    //测试环境
    env = '.test1';
  } else if (host.indexOf('127.0')>-1 ||host.indexOf('172.16') > -1||host.indexOf('192.168') > -1|| host.indexOf('localhost')>-1) {
    //开发环境
    env = '.uat';
  }
  config.requestUrl = 'http://{{replace}}'+env+'.smartcourt.cn/';
  
  return config;
});