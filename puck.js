;
define(['backbone', 'basemodel'], function(backbone, baseModel) {
  var modelFactory = {};

  var puck = window.puck = {
    _cfg: {}, // option 配置
    _pages: {}, // view缓存
    _lastView: null, // 上一次view
    _args: "", // 记录由routeHanler 传进的值
    historyQueue: [],
    init: function(param) {
      _.extend(this._cfg, param);
      this.createPage();
      this.initRouter(param);
    },
    go: function(pageName, data) {
      this.router.navigate(pageName, {
        trigger: true
      });
      this.pageData = data;
    },
    back: function(index, data) {
      this.pageData = data;
      history.back(index || -1);
    },
    //初始化路由
    initRouter: function(options) {
      var that = this;
      var map = this._cfg.workspace;
      var defaultPage = "";
      //所有路由触发后都会进入此方法
      var routeHandler = function(args) {
        that._args = args;
        //过滤掉 /后的参数 获取路由名称
        var viewName = backbone.history.fragment;
        if (viewName.indexOf("/") != -1) {
          viewName = viewName.substr(0, viewName.indexOf("/"));
        }
        //如果路由为空 设置默认路由
        if (viewName == "") {
          viewName = defaultPage;
        }

        that.showView(viewName);
      }

      var proporty = {
        initialize: function() {
          //console.log("Route initialize");
        },
        routes: {}
      }

      //枚举 workspace里的理由信息
      for (var i in map) {
        var item = map[i];
        var r = "";
        //如果有特殊路由 比如带参数的  route/:id
        if (item.route) {
          r = item.route;
        } else {
          r = i;
        }
        //配置路由到backbone
        proporty.routes[r] = routeHandler
        if (item.default) {
          proporty.routes[""] = routeHandler;
          //获取默认
          defaultPage = i;
        }
      }

      var base = backbone.Router.extend(proporty);
      //初始化
      var router = this.router = new base();
      //开始路由并且用 pushState 方式
      backbone.history.start({
        pushState: !!options.pushState
      });
      //backbone.history.start();
    },
    //创建view节点
    createPage: function() {
      var ws = this._cfg.workspace;
      //创建view根节点
      var container = $('<div class="parent-view">');
      for (var i in ws) {
        //创建view节点
        var page = $('<div class="view hidden J_PuckView J_Puck' + this.upcaseFirstWord(i) + '">');
        container.append(page);
      }

      $("body").append(container);
    },
    showView: function(viewName) {
      var that = this;
      var viewCig = this._cfg.workspace[viewName];
      //如果缓存里有 则取缓存
      if (this._pages[viewName]) {
        this._showView(viewName);
      } else {
        //如果没有 则require对应的view
        require([this._cfg.viewUrl + viewCig.view], function(pageview) {
          var pageview = new pageview({
            el: ".J_Puck" + that.upcaseFirstWord(viewName)
          });
          //创建完之后 直接调用oninit
          pageview.onInit();
          //设置viewname
          pageview.name = viewName;
          //缓存page
          that._pages[viewName] = pageview;
          that._showView(viewName);
        })
      }
    },
    _showView: function(viewName) {
      //触发onhide
      this._lastView && this._lastView.onHide();
      //当父类隐藏时也要触发子类的onHide
      this._lastView && this._lastView.currentSubView && this._lastView.currentSubView.onHide();
      //调用show方法 
      this._pages[viewName].onShow({
        referer: this._lastView ? this._lastView.name : "", // 来源page 比如 "index"
        data: this.pageData || null, // go 第二个参数数据 用户自己传的任意数据
        args: this._args // routeHandler 里面的数据 route/:id 里面的 id数据
      });
      //缓存最近的view
      this._lastView = this._pages[viewName];
      $(".J_PuckView").hide();
      $(".J_Puck" + this.upcaseFirstWord(viewName)).show();
    },
    /*
      subviews 子类view的名称
      tabs 触发切换的节点
      tabsContent 切换页面的节点
      parent 父类 view
    */
    initTabs: function(subviews, tabs, tabsContent, parent) {
      var that = this;
      var views = {};
      var index = 0;
      var _lastView = {};
      $.each(tabs, function(index, item) {
        $(item).attr("data-index", index);
      })
      $(tabsContent).hide();
      //默认show出第一个
      showView(0);

      function getOrCreate(index, cb) {
        if (views[index]) {
          cb(views[index]);
        } else {
          var item = subviews[index];
          var url;
          var data;
          var viewfile;
          if (_.isArray(item)) {
            viewfile = item[0];
            data = item[1];
          } else {
            viewfile = item;
          }
          url = that._cfg.viewUrl + viewfile;

          require([url], function(view) {
            var _view = new view({
              el: tabsContent.eq(index)
            });
            //$(tabsContent.eq(index)).addClass("J_PuckView");
            if (data) {
              _view.pageData = data;
            }
            _view.name = viewfile.split(".")[0];
            views[index] = _view;
            _view.onInit();
            cb(_view);
          })
        }
      }

      function showView(index, data) {
        getOrCreate(index, function(view) {
          _lastView.onHide && _lastView.onHide();
          view.onShow({
            referer: _lastView.name || "",
            data: data || view.pageData || null //优先显示 show的参数，其次初始化参数
          });
          $(tabsContent).hide();
          $(tabsContent).eq(index).show();
          parent.currentSubView = view; //把最近显示的subview绑到父类，当父类隐藏时也要触发子类的onHide
          _lastView = view;
        });
      }

      $(tabs).on('click', function(event) {
        var $target = $(event.target);
        var index = parseInt($target.attr("data-index"));
        //重复点击当前tab直接return--add by danny zou
        if ($(tabsContent[index]).css('display') != 'none') {
          return;
        }
        showView(index);
      })

      return {
        show: function(index, data) {
          showView(index, data);
        }
      }
    },
    //设置model 基础url
    setBaseUrl: function(requestBaseUrl) {
      this.requestBaseUrl = requestBaseUrl;
    },
    //注册model
    registerModel: function(name, option) {
      option = option || {};
      var replace = option.url.split("-")[1].toLowerCase() + "." + option.url.split("-")[0].toLowerCase();
      var tempUrl = this.requestBaseUrl.replace("{{replace}}", replace);

      option.url = tempUrl + option.url;

      modelFactory[name] = new baseModel(option);
    },
    getModel: function(name) {
      return modelFactory[name];
    },
    upcaseFirstWord: function(word) {
      return word.substr(0, 1).toUpperCase() + word.substr(1);
    },
    showLoading: function() {
      var loading = this.loading = $(".J_Puck_Loading");
      loading.show();
    },
    hideLoading: function() {
      this.loading.hide();
    }
  }

  return puck;
});