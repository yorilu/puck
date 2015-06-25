define(["backbone", "config"], function (backbone, config) {
  /**
   * @description 占位符格式化
   * @param {String} str 需要替换的模板
   * @param {Object} params 参数
   * @param {Boolean} isEncode 是否编码
   * @eg demo("http://www.baidu.com?name={name}&age={age}&chanelid={chanelid}",{name:"demo",age:23,chanelid:100},false)
   * @return {String} str 返回结果 http://www.baidu.com?name=demo&age=23&chanelid=100
   */
  function formatByVal (str, params, isEncode) {
    if (typeof params == "object") {
      for (var key in params) {
        if (!_.has(params, key) || params[key] == "undefined" || params[key] == "null") {
          params[key] = "";
        }
        str = str.replace(new RegExp("\\{" + key + "\\}", "ig"), isEncode ? encodeURIComponent(params[key]) : params[key]);
      }
    }
    return str.replace(/\{\w*\}/ig, "");
  }
  
  var cache = {
  }
    
  var model = backbone.Model.extend({
    initialize: function (param) {
      this.options = {};
      _.extend(this.options, param)
    },
    sync: function (method, model, options){
      var url = options.url;
      var key = url + JSON.stringify(options.data);
      if(options.cache && typeof cache[key] !='undefined'){
        options.success(cache[key]);
        return;
      }

      options.contentType = "text/plain; charset=UTF-8";
        
      var params = _.extend({
        type : 'GET'
      }, options);
      
      if (!url)  {
        console.log("this syne have no url param.")
        return;
      }

      url = formatByVal(url, options.data);
      params.url = url;

      if (params.type.toLowerCase() === 'get') {
          params.data = null;
      } else {
          params.data = JSON.stringify(params.data);
       // params.data = params.data;
      }
      
      var _success = params.success;
      params.success = function (data){
        try{
          data = JSON.parse(data);
        }catch(e){};        
        
        /*
          TODO
          if(data.rc == 0){
            
          }else{
            params.error(info);
          }
        */
        
        if(options.cache){
          cache[key] = data;
        }
        
        _success(data);
      }
      
      var ajax = $.ajax(params);
      return ajax;
    },
    $get: function (options){
      options = options || {};
      var type = "GET";
      options.type = type;
      options = _.extend(this.options, options);
      return this.sync(type, this,options);
    },
    $post: function (options){
      options = options || {};
      var type = "POST"
      options.type = type;
      options = _.extend(this.options, options);
      return this.sync(type, this,options);
    }
  });

  return model;
});