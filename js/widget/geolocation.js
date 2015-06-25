/*
  eg:
  //先触发onPosComplete，再onComplete，任何环节出错返回onError
  geolocation.getCurrentPosition({
          onComplete: function(data) {//逆地址解析的callback
          },
          onPosComplete: function(lat,lng) {//经纬度的callback
          },
          onError: function(){
        }
      })
*/
define([], function() {

  var geo = window.navigator.geolocation;
  /**
   * 获取GPS经纬度
   * @param options
   * @returns {*}
   */
  var callback = {};
  var getGPSPosition = function(opt) {
    callback = {
      onPosComplete: (opt&&opt.onPosComplete)?opt.onPosComplete:null,
      onComplete: (opt&&opt.onComplete)?opt.onComplete:null,
      onError: (opt&&opt.onError)?opt.onError:null,
    }
    var opt = {
      enableHighAcuracy: true,
      timeout: 3000
    }
    var sucCb = function(data) {
      convBaiduPos(data.coords);
    }
    var errorCb = function(data) {
      callback.onError && callback.onError('定位失败');
    }
    geo.getCurrentPosition(sucCb, errorCb, opt);
  };
  /**
   * 将GPS坐标装换为百度坐标
   */
  var convBaiduPos = function(data, option) {
    var ak = 'vH2zoCtOoS5QCx1Wjtn2dG6C',
      url = 'http://api.map.baidu.com/geoconv/v1/';

    url = url + "?coords=" + data.longitude + "," + data.latitude +
      "&ak=" + ak + "&callback=?";
    $.ajax({
      type: 'get',
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        if (data.status == 0) {
          var poiont = data.result[0];
          var result = {
            longitude: poiont.x,
            latitude: poiont.y
          }
          callback.onPosComplete && callback.onPosComplete(result.latitude, result.longitude)
          baiduGeoCoding(result.latitude, result.longitude);
        } else {
         callback.onError && callback.onError('定位失败');
        }
      },
      error: function(xhr, type) {
        callback.onError && callback.onError('定位失败');
      }
    });
  }
  var baiduGeoCoding = function(lat, lng) {
        

    var ak = 'vH2zoCtOoS5QCx1Wjtn2dG6C',
      url = 'http://api.map.baidu.com/geocoder/v2/?';

    url = url + 'ak=' + ak + '&callback=renderReverse&location=' + lat + ',' + lng + '&output=json&pois=1';

    console.log(url);

    $.ajax({
      type: 'get',
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        callback.onComplete && callback.onComplete(data)
      },
      error: function(xhr, type) {
        callback.onError && callback.onError('地址解析失败');
      }
    });
  };

  var geoService = {
    getCurrentPosition: getGPSPosition
  }
  return geoService;
});