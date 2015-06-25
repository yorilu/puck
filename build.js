//�������  node r.js -o build.js
({ 
  appDir: '.',   //��Ŀ��Ŀ¼
  dir: 'dest/',  //���Ŀ¼��ȫ���ļ������Ҫ������ļ��У����û�л��Զ��½��ģ�
  
  baseUrl: './js/',   //�����appDir������Ҫ����js�ļ�����ʼ�ļ��У����������ļ�·���Ķ��嶼�ǻ������baseUrl��
  
  modules: [		
    {
      name: 'mini'
    }
      //Ҫ�Ż���ģ��
    	//˵���˾��Ǹ�ҳ�������ļ������baseUrl��·����Ҳ��ʡ�Ժ�׺��.js��
  ],
  
  fileExclusionRegExp: /^(r|build)\.js|.*\.scss|static|\.git$/,	//���ˣ�ƥ�䵽���ļ������ᱻ��������Ŀ¼ȥ
  
  optimizeCss: 'standard', 
  
  removeCombined: true,   //���Ϊtrue���������Ŀ¼��ɾ���Ѻϲ����ļ�
  
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
  paths: {	//���baseUrl��·��
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