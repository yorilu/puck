define(['backbone','puck'], function (backbone, puck) {
  var view = backbone.View.extend({
    onInit: function (){/*abstract*/},
    onShow: function (){/*abstract*/},
    onHide: function (){/*abstract*/},
    show404: function (){
      //TODO
    },
    showLoading: function (){
      //TODO;
      console.log("show loading!");
    },
    hideLoading: function (){
      //TODO;
      console.log("hide loading!");
    },
    checkLogin: function (){
      //TODO
    }
  });
  
  return view;
});