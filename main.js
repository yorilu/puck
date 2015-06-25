require.config({
  baseUrl: "/js/",
  paths: {
    'main': '../main',
    'backbone': 'libs/backbone',
    'zepto': 'libs/zepto',
    'zepto-extras': 'libs/zepto.extras',
    'underscore': 'libs/underscore',
    'text': 'libs/text',
    'iscroll': 'libs/iscroll',
    'touch': 'libs/zepto.touch',
    'callback': 'libs/zepto.callback',
    'deferred': 'libs/zepto.deferred',
    'fastclick': 'libs/fastclick',
    'videoPlayer': 'libs/videoplayer',
    'utils': 'utils/utils',
    'scroller': 'widget/scroller',
    'geolocation': 'widget/geolocation',
    'puck': 'puck',
    'workspace': 'workspace',
    'basemodel': 'base/basemodel',
    'baseview': 'base/baseview',
    'modelFactory': 'models/model.factory',
    'config': 'base/config'
  },
  shim: {
    'backbone': {
      exports: 'backbone'
    },
    'zepto': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'videoPlayer': ['zepto','zepto-extras']
  }
});

require(['backbone', 'workspace', 'puck', 'fastclick'], function(backbone, workspace, puck, fastclick) {
  $(function() {
    window.localStorage.removeItem('SMART_SELECTED_CITY');
    window.localStorage.removeItem('SMART_HIDE_MODE');
    //注册fastclick
    fastclick.attach(document.body);
    puck.init({
      workspace: workspace,
      viewUrl: 'views/',
      pushState: false
    });
  })
})