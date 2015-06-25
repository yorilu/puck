/**
 * Created by anders on 15/6/17.
 */
define(['backbone', 'text!../templates/gameevent.tpl.html', 'puck', 'baseview', 'modelFactory','utils','scroller'],
  function (backbone, tpl, puck, baseview, modelFactory,Util,Scroller) {

    var model = modelFactory.get('getGameEvent');


    var view = baseview.extend({
      events: {},

      reqParam : {
        pageIndex:1
      },

      periodTplFun:null,
      evtTplFun:null,
      endTplFun:null,

      gameData:{},

      firstShow : true,

      onInit: function () {
        this.$el.html(tpl);
        this.els = {
          wrapper : this.$el.find('#j_game_event_ul_wrapper'),
          periodTpl : this.$el.find('#j_game_event_period_tpl'),
          evtTpl : this.$el.find('#j_game_event_period_evts_tpl'),
          endTpl : this.$el.find('#j_game_event_period_end_tpl'),
          gameDesc: this.$el.find('#j_game_event_game_des')
        }
        this.periodTplFun = _.template(this.els.periodTpl.html());
        this.evtTplFun = _.template(this.els.evtTpl.html());
        this.endTplFun = _.template(this.els.endTpl.html());
      },

      //每次显示时执行
      onShow: function (opt) {
        var self = this;
        this.gameData = opt.data;
        this.reqParam.gameId = opt.data["id"];
        if(this.firstShow){

          if(this.gameData.status == '0'){
            this.showNoData();
          }else{
            this.sendReq(this.reqParam,function(data){
              if(data.length == 0){
                self.showNoData();
              }else{
                var periodData = self.getSection(data);
                self.renderPeriod(periodData);
              }

            });
          }
          this.els.gameDesc.html(this.gameData.startTime.substr(0,16) + " 比赛在 " + this.gameData.stadiumName +"举行");
        }
        //绑定滚动事件
        this.bindScroll();
        this.firstShow = false;
      },

      onHide: function () {
        if(this.myScrollHandler){
          this.myScrollHandler.destroy();
        }
      },

      /**
       * 绑定滚动事件
       */
      bindScroll:function(){
        var self = this;

        self.myScrollHandler = new Scroller(this.$el, {
          onScroll: function(forward, processing, finished) {
           // forward  1:向下  -1:向上
            if (forward == -1) {
              return;
            }
            processing(); //暂停滚动事件
            //请求参数
            self.reqParam.pageIndex++;
            self.sendReq(self.reqParam,function(data){
              self.appendNextPage(data);
              if(data.length < 20){
                self.myScrollHandler.destroy();
              }else{
                self.myScrollHandler.on();
              }
            })
          }
        })
      },

      sendReq:function(param,callback){
        var self = this;
        model.$post({
          data:param,
          success:function(res){
            callback.apply(self,[res.data]);
          }
        })
      },

      //渲染整个小节的比赛,
      renderPeriod:function(periodData){
        var self = this;
        var html = this.periodTplFun({data : periodData});
        //添加小节
        if(this.els.wrapper.children().length>0){
          this.els.wrapper.append(html);
        }else{
          this.els.wrapper.html(html);
        }
        //添加小节事件
        _.each(periodData,function(period,key){
          var periodDom = $('#j_game_event_period_wapper_'+key),
            liHtml = self.evtTplFun(period);
          periodDom.html(liHtml);
        })
      },

      appendNextPage:function(data){
        var periodData = this.getSection(data),
          self = this,
          newperiodData ={};
        _.each(periodData,function(period,key){
          var periodDom =  $('#j_game_event_period_wapper_'+key);
          //如果此小节已经被被显示了部分数据,直接将数据添加到小节中
          if(periodDom.length > 0){
            //显示事件内容
            if(period.events){
              periodDom.append(self.evtTplFun(period))
            }
            //显示小节结束
            if(period.start){
              period.end = period.start;
              periodDom.parent().after(self.endTplFun(period));
            }
          }else{
            newperiodData[key] = period;
          }
        })

        this.renderPeriod(newperiodData);
      },

      //从事件列表中,获取到小节数据
      getSection:function(data){
        var self = this,
        selectMap = {};
        _.each(data,function(item,index){
          var period = selectMap[item.competitionNode]||{};
          //playerATeamId为空,则认为是小节开始/结束事件
          if(!item.playerATeamId){
            if(!period['start']){
              period['start'] = item
            }else {
              period['end'] = item
            }
          }else{
            if(!period['events']){
              period['events'] = []
            }

            //判断是否为主队
            item.isHomeTeam =  item.playerATeamId == self.gameData.homeTeamId;
            item.time = Util.Date.ss2hhmmss(item.eventTime);
            period['events'].push(item)
          }

          selectMap[item.competitionNode] = period
        })

        return selectMap
      },

      //显示无数据
      showNoData:function(){
        this.$el.find('.no-data').show();
      }

    });

    return view;
  });