(function(e){e.extend(mejs.MepDefaults,{contextMenuItems:[{render:function(e){return typeof e.enterFullScreen=="undefined"?null:e.isFullScreen?mejs.i18n.t("Turn off Fullscreen"):mejs.i18n.t("Go Fullscreen")},click:function(e){e.isFullScreen?e.exitFullScreen():e.enterFullScreen()}},{render:function(e){return e.media.muted?mejs.i18n.t("Unmute"):mejs.i18n.t("Mute")},click:function(e){e.media.muted?e.setMuted(!1):e.setMuted(!0)}},{isSeparator:!0},{render:function(e){return mejs.i18n.t("Download Video")},click:function(e){window.location.href=e.media.currentSrc}}]}),e.extend(MediaElementPlayer.prototype,{buildcontextmenu:function(t,n,r,i){t.contextMenu=e('<div class="mejs-contextmenu"></div>').appendTo(e("body")).hide(),t.container.bind("contextmenu",function(e){if(t.isContextMenuEnabled)return e.preventDefault(),t.renderContextMenu(e.clientX-1,e.clientY-1),!1}),t.container.bind("click",function(){t.contextMenu.hide()}),t.contextMenu.bind("mouseleave",function(){t.startContextMenuTimer()})},cleancontextmenu:function(e){e.contextMenu.remove()},isContextMenuEnabled:!0,enableContextMenu:function(){this.isContextMenuEnabled=!0},disableContextMenu:function(){this.isContextMenuEnabled=!1},contextMenuTimeout:null,startContextMenuTimer:function(){var e=this;e.killContextMenuTimer(),e.contextMenuTimer=setTimeout(function(){e.hideContextMenu(),e.killContextMenuTimer()},750)},killContextMenuTimer:function(){var e=this.contextMenuTimer;e!=null&&(clearTimeout(e),delete e,e=null)},hideContextMenu:function(){this.contextMenu.hide()},renderContextMenu:function(t,n){var r=this,i="",s=r.options.contextMenuItems;for(var o=0,u=s.length;o<u;o++)if(s[o].isSeparator)i+='<div class="mejs-contextmenu-separator"></div>';else{var a=s[o].render(r);a!=null&&(i+='<div class="mejs-contextmenu-item" data-itemindex="'+o+'" id="element-'+Math.random()*1e6+'">'+a+"</div>")}r.contextMenu.empty().append(e(i)).css({top:n,left:t}).show(),r.contextMenu.find(".mejs-contextmenu-item").each(function(){var t=e(this),n=parseInt(t.data("itemindex"),10),i=r.options.contextMenuItems[n];typeof i.show!="undefined"&&i.show(t,r),t.click(function(){typeof i.click!="undefined"&&i.click(r),r.contextMenu.hide()})}),setTimeout(function(){r.killControlsTimer("rev3")},100)}})})(mejs.$)