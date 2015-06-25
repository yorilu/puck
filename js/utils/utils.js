/**
 * 首页赛事列表
 */

define([], function() {

  var ua = navigator.userAgent;


  var Util = {};

  /**
   * 日期处理函数
   * @type {{now: Function, calDateByOffset: Function, str2mm: Function, dateFormat: Function}}
   */
  Util.Date = {

    now: function() {
      return (new Date()).getTime();
    },

    /*
     * 在当前日期上计算偏移值
     */
    calDateByOffset: function(offset) {
      var date = new Date();
      date.setDate(date.getDate() + offset);
      return this.dateFormat(date, 'yyyy-MM-dd');
    },

    calDateInterval: function(dateStr1, dataStr2) {
      var date1 = this.str2mm(dateStr1),
        date2 = this.str2mm(dateStr2),
        ss = (date2 - date1) * 1000;
    },

    /**
     * 将秒数转为hh:mm:ss的字符串
     * @param min
     * @returns {*}
     */
    ss2hhmmss: function(seconds) {
      var s = Math.floor(seconds % 60),
        m = Math.floor(seconds / 60),
        h = 0;

      function addPre(v) {
        v = v + '';
        if (v.length == 0) {
          return '00'
        } else if (v.length == 1) {
          return '0' + v;
        } else {
          return v;
        }
      }
      if (m > 60) {
        h = m % 60;
        m = m / 60;
      }
      return addPre(h) + ':' + addPre(m) + ':' + addPre(s);
    },


    /**
     * 日期字符串转毫秒
     */
    str2mm: function(dateStr) {
      // ios 下的日期格式
      dateStr = dateStr.replace(/-/g, '/');
      return Date.parse(dateStr);
    },

        /**
     * 字符串转成日期类型
     */
    str2date: function(dateStr) {
      dateStr = dateStr.replace(/-/g, "/");
      return new Date(dateStr);
    },

    dateFormat: function(date, format) {
      var o = {
        "M+": date.getMonth() + 1,
        //month
        "d+": date.getDate(),
        //day
        "h+": date.getHours(),
        //hour
        "m+": date.getMinutes(),
        //minute
        "s+": date.getSeconds(),
        //second
        "q+": Math.floor((date.getMonth() + 3) / 3),
        //quarter
        "S": date.getMilliseconds() //millisecond
      }

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    }

  }


  Util.Trans = {

    /**
     * 日志字符串装换为今天/明天/yyyy-MM-dd格式
     * @param dateStr
     * @returns {string}
     */
    date: function(dateStr) {
      var dateStr = dateStr.substr(0, 10)
      if (dateStr == Util.Date.calDateByOffset(0)) {
        dateStr = '今天';
      } else if (dateStr == Util.Date.calDateByOffset(1)) {
        dateStr = '明天';
      }
      return dateStr;
    }
  };


  Util.Path = {

    /**
     * 截取URL参数
     * @method getUrlParam
     * @memberof cUtilPath
     * @param {url} url
     * @param {String} key 参数key名
     * @returns {String} value 参数值
     */
    getUrlParam: function(url, name) {
      var re = new RegExp("(\\?|&)" + name + "=([^&]+)(&|$)", "i"),
        m = url.match(re);
      return m ? m[2] : "";
    },

    /**
     * 解析URL参数为json对象
     * @method getUrlParams
     * @memberof cUtilPath
     * @static
     * @param {url} url
     * @returns {Json} object
     */
    getUrlParams: function(url) {
      var url = url.split('://');
      var searchReg = /([^&=?]+)=([^&]+)/g;
      var urlParams = {};
      var match, value, length, name;

      while (match = searchReg.exec(url[0])) {
        name = match[1];
        value = match[2];
        urlParams[name] = value;
      }

      if (url[1]) {
        var idx = 0;
        length = _.size(urlParams);
        _.each(urlParams, function(value, key) {
          if (++idx == length) {
            urlParams[key] += '://' + url[1];
          }
        });
      }
      return urlParams;
    }
  };

  Util.platform = {
    /**
     * 设备信息
     */
    os: {
      isAndroid: ua.indexOf('Android') > 0,
      isIOS: /iP(ad|hone|od)/.test(ua)
    },

    /**
     * 浏览器信息
     */

    browser: {
      QQ: ua.indexOf('MQQBrowser') > 0,
      UC: ua.indexOf('UCBrowser') > 0,
      MIUI: ua.indexOf('MiuiBrowser') > 0,
      WeiXin: ua.indexOf('MicroMessage') > 0,
      Chrome: !!window.chrome
    }
  };

  Util.Util = {
    //rtmp路径转m3u8格式
    rtmp2m3u8: function(url) {
      if (/^rtmp/.test(url)) {
        return url = url.replace(/^rtmp/, "http") + "/playlist.m3u8";
      } else {
        return url;
      }
    }
  };

  Util.downloadApp = function() {
    debugger;
    if (this.platform.os.isAndroid) {
      window.location.href = 'http://www.pgyer.com/YLj1';
    } else if (this.platform.os.isIOS) {
      window.location.href = 'http://www.pgyer.com/dpam';
    }
  };
  Util.Store = {
    storage: window.localStorage,

    set: function(key, value) {
      this.storage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
      var _value = this.storage.getItem(key);
      return JSON.parse(_value);
    }
  }

  return Util;
});