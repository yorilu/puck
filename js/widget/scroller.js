/*
  eg:
  var myScrollHandler = new scroller(this.$el.find(".J_Scroll"),{
    debounce: 1000,//非必填 最多X毫秒触发一次 默认500毫秒
    triggerHeight: 100, //非必填 默认 50像素
    onScroll: function (forward, on, off){  //必填 forward  1:向下  -1:向上
      console.log(forward)
      on();//暂停滚动事件
      model.$get({
        success: function (){
          off();//恢复滚动事件
        }
      })
    }
    
    myScrollHandler.destory();//注销滚动事件
  })
*/

define(["touch"],function (touch) {
  var scroller = function (el, option){
    this.$el= $(el);//监听节点
    this.option = option;//配置
    this.triggerHeight = option.triggerHeight || 50;//非必填 默认 50像素
    this.debounce = option.debounce || 500;//非必填 最多X毫秒触发一次 默认500毫秒
    this.canScroll = true;//全局控制标示
    return this.init();
  }
  
  scroller.prototype = {
    init: function (){
      var that = this;
      var o = this.option;
      var _onscroll = that.option.onScroll;
      that.option.onScroll = _.throttle(that.option.onScroll,this.debounce, true);
      
      var scrollEvent = function (event) {
        //向下滚动事件
        var _target = scrollerTarget == window?document.body:target;
        if (_target.scrollTop >= _target.scrollHeight - _target.offsetHeight - that.triggerHeight) {
          that._scroll(1);
        }
      }
      
      var swipeEvent = function (event){
        //向上滚动事件
        var _target = touchTarget;
        if(_target.scrollTop < that.triggerHeight){
          that._scroll(-1);
        }
      }
      
      var target = this.$el[0];
      var touchTarget = target;//默认hammer手势用target
      var scrollerTarget = window;//默认滚动用window
      //hammer 必须绑在实体dom节点上 如 body, div上，不能绑在document, window上
      if(target == document || target == window){
        touchTarget = document.body;
      }
      
      //如果当前节点没有overflow 或 overflow-y 则不能绑定，绑了也无法触发，所以绑定在window上
      if($(target).css("overflow") == 'scroll' || $(target).css("overflow-y") == 'scroll'){
        scrollerTarget = target;
      }
      
      
      $(scrollerTarget)
      .on("scroll", scrollEvent)
      
      $(touchTarget).on("swipe", swipeEvent)
      
      return {
        destroy: function (){
          //注销该事件
          $(scrollerTarget)
          .unbind("scroll",scrollEvent)
          
          $(touchTarget).unbind("swipe",swipeEvent)
        },
        on: function (){
          //开启滚动
          that.canScroll = true;
        },
        off: function (){
          //关闭滚动
          that.canScroll = false;
        }
      }
    },
    _scroll: function (forward){
      if(!this.canScroll){
        return;
      }
      var that = this;
      if(forward == 1){
        console.log("fire scroll bottom evnet");
      }else{
        console.log("fire scroll top evnet");
      }
      //触发真实事件
      that.option.onScroll(forward, function (){
        that.canScroll = false;
      },function (){
        that.canScroll = true;
      });
    }
  }
  
  return scroller;
});