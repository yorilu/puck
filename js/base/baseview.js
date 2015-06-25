define(['backbone','puck'], function (backbone, puck) {
  var view = backbone.View.extend({
    onInit: function (){/*abstract*/},
    onShow: function (){/*abstract*/},
    onHide: function (){/*abstract*/},
    show404: function (){
      //TODO
    },
    back: function (index){
      puck.back(index);
    },
    showLoading: function (){
      puck.showLoading();
    },
    hideLoading: function (){
      puck.hideLoading();
    },
    onScroll: function (){
      console.log("scrolling!");
    }
  });
  
  return view;
});