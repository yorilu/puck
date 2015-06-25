//打包命令  node r.js -o build.js
({ 
  appDir: '.',   //项目根目录
  dir: 'dest/',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）
  
  baseUrl: './js/',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的
  
  modules: [		
    {
      name: 'mini'
    }
      //要优化的模块
    	//说白了就是各页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
  ],
  
  fileExclusionRegExp: /^(r|build)\.js|.*\.scss|static|\.git$/,	//过滤，匹配到的文件将不会被输出到输出目录去
  
  optimizeCss: 'standard', 
  
  removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件
  
  // Add angular modules that does not support AMD out of the box, put it in a shim
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
  },
  paths: {	//相对baseUrl的路径
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
  }
})