define(["backbone","text!../templates/video.tpl.html","puck","baseview","utils","modelFactory"],function(e,t,n,r,i,s){Path=i.Path;var o=r.extend({videoInfo:null,tplFun:null,events:{"click .j_share_video_item":"playNewVideo"},onInit:function(){this.$el.html(t);var e=location.href;e=e.replace(/%and%/,"$"),this.videoInfo={videoUrl:Path.getUrlParam(e,"video_url"),gameName:decodeURI(Path.getUrlParam(e,"game_name")),videoName:decodeURI(Path.getUrlParam(e,"video_name")),sportType:Path.getUrlParam(e,"sport_type")},this.els={title:this.$el.find("#j_share_video_title"),player:this.$el.find("#j_share_video_player"),listWrap:this.$el.find("#j_share_video_list"),listTpl:this.$el.find("#j_share_video_list_tpl")},this.els.player.height($(".j_bg_img").height()),this.tplFun=_.template(this.els.listTpl.html())},onShow:function(){document.title=this.videoInfo.videoName,this.els.title.text(this.videoInfo.videoName),this.els.player.attr("src",this.videoInfo.videoUrl);var e=s.get("getTopNVideo"),t=this.videoInfo.sportType,n=this;e.$post({data:{clientId:"h5",sportType:t?t:"",cityId:1,pageSize:10,pageIndex:1,level:"5"},success:function(e){n.render(e.data)},error:function(){}})},onHide:function(){},render:function(e){var t=this.tplFun({data:e});this.els.listWrap.html(t)},playNewVideo:function(e){var t=$(e.currentTarget),n=t.data("src"),r=t.data("title");this.els.player.attr("src",n),document.title=r,this.els.player[0].play()}});return o})