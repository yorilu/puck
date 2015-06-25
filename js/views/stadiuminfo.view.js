/**
 * Created by anders on 15/6/18.
 */
define(['backbone','text!../templates/stadiuminfo.tpl.html', 'puck', 'baseview'], function (backbone, tpl, puck, baseview) {
  var view = baseview.extend({

    tplFun : null,

    events : {

    },

    onInit: function (){
     this.tplFun = _.template(tpl);
    },

    onShow: function (data){
      var html = this.tplFun(data.data);
      this.$el.html(html);
    },
    onHide: function (){

    }
  });

  return view;
});