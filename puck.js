;define(['backbone', 'basemodel'], function (backbone, baseModel) {
  var modelFactory = {};
  
  var puck = {
    _cfg: {},
    _pages: {},
    historyQueue: [],
    init: function (param) {
      _.extend(this._cfg, param);
      this.createPage();
      this.initRouter();
    },
    go: function (pageName, data) {
      this.router.navigate(pageName, {trigger: true});
      
      //history.go(hash);
      this.pageData = data;
    },
    back: function (index) {
      this.pageData = null;
      history.back(index)
    },
    initRouter: function () {   
      var that = this;
      var map = this._cfg.workspace;
      var defaultPage = "";
      var routeHandler = function (argus) {
        var viewName = backbone.history.fragment;
        if (viewName.indexOf("/") != -1) {
          viewName = viewName.substr(0, viewName.indexOf("/"));
        }

        if (viewName == "") {
          viewName = defaultPage;
        }

        that.showView(viewName);
      }

      var proporty = {
        initialize: function () {
          //console.log("Route initialize");
        },
        routes: {}
      }

      for (var i in map) {
        var item = map[i];
        var r = "";
        if (item.route) {
          r = item.route;
        } else {
          r = i;
        }
        proporty.routes[r] = routeHandler
        if (item.default) {
          proporty.routes[""] = routeHandler;
          defaultPage = i;
        }
      }

      var base = backbone.Router.extend(proporty);
      var router = this.router =  new base();
      backbone.history.start({pushState : true});
    },
    createPage: function () {
      var ws = this._cfg.workspace;
      var container = $('<div class="parent-view">');
      for (var i in ws) {
        var page = $('<div class="view hidden J_View J_' + this.upcaseFirstWord(i) + '">');
        container.append(page);
      }

      $("body").append(container);
    },
    showView: function (viewName) {
      var that = this;
      var viewCig = this._cfg.workspace[viewName];
      if (this._pages[viewName]) {
        this._showView(viewName);
      } else {
        require([this._cfg.viewUrl + viewCig.view], function (pageview) {
          var pageview = new pageview({
            el: ".J_" + that.upcaseFirstWord(viewName)
          });
          pageview.onInit();
          that._pages[viewName] = pageview;
          that._showView(viewName);
        })
      }
    },
    _showView: function (viewName) {
      this._pages[viewName].onShow("", this.pageData);
      $(".J_View").hide();
      $(".J_" + this.upcaseFirstWord(viewName)).show();
    },
    initTabs: function (subviews, tabs, tabsContent) {
      var that = this;
      var views = {};
      var index = 0;
      $.each(tabs, function (index, item) {
        $(item).attr("data-index", index);
      })

      getOrCreate(0, function (view) {
        view.onShow();
      });

      function getOrCreate(index, cb) {
        if (views[index]) {
          cb(views[index]);
        } else {
          var url = that._cfg.viewUrl + subviews[index];
          require([url], function (view) {
            var _view = new view({
              el: tabsContent.eq(index)
            });
            views[index] = _view;
            _view.onInit();
            cb(_view);
          })
        }
      }

      function showView(index) {
        getOrCreate(index, function (view) {
          view.onShow();
          $(tabsContent).eq(index).show();
        });
      }

      $(tabs).on('click', function (event) {
        var $target = $(event.target);
        var index = parseInt($target.attr("data-index"));
        $(tabsContent).hide();
        showView(index);
      })

      return {
        show: function (index) {
          showView(index);
        }
      }
    },
    setBaseUrl: function (requestBaseUrl){
      this.requestBaseUrl = requestBaseUrl;
    },
    registerModel: function (name, option){
      option = option || {};
      var replace = option.url.split("-")[1].toLowerCase() + "." + option.url.split("-")[0].toLowerCase();
      var tempUrl = this.requestBaseUrl.replace("{{replace}}", replace);
      
      option.url = tempUrl + option.url;
      
      modelFactory[name] = new baseModel(option);
    },
    getModel: function (name){
      return modelFactory[name];
    },
    upcaseFirstWord: function (word) {
      return word.substr(0, 1).toUpperCase() + word.substr(1);
    }
  }

  return puck;
});