(function(e){e.extend(mejs.MepDefaults,{sourcechooserText:"Source Chooser"}),e.extend(MediaElementPlayer.prototype,{buildsourcechooser:function(t,n,r,i){var s=this;t.sourcechooserButton=e('<div class="mejs-button mejs-sourcechooser-button"><button type="button" aria-controls="'+s.id+'" title="'+s.options.sourcechooserText+'" aria-label="'+s.options.sourcechooserText+'"></button>'+'<div class="mejs-sourcechooser-selector">'+"<ul>"+"</ul>"+"</div>"+"</div>").appendTo(n).hover(function(){e(this).find(".mejs-sourcechooser-selector").css("visibility","visible")},function(){e(this).find(".mejs-sourcechooser-selector").css("visibility","hidden")}).delegate("input[type=radio]","click",function(){var e=this.value;if(i.currentSrc!=e){var t=i.currentTime,n=i.paused;i.pause(),i.setSrc(e),i.addEventListener("loadedmetadata",function(e){i.currentTime=t},!0);var r=function(e){n||i.play(),i.removeEventListener("canplay",r)};i.addEventListener("canplay",r,!0),i.load()}});for(var o in this.node.children){var u=this.node.children[o];u.nodeName==="SOURCE"&&(i.canPlayType(u.type)=="probably"||i.canPlayType(u.type)=="maybe")&&t.addSourceButton(u.src,u.title,u.type,i.src==u.src)}},addSourceButton:function(t,n,r,i){var s=this;if(n===""||n==undefined)n=t;r=r.split("/")[1],s.sourcechooserButton.find("ul").append(e('<li><input type="radio" name="'+s.id+'_sourcechooser" id="'+s.id+"_sourcechooser_"+n+r+'" value="'+t+'" '+(i?'checked="checked"':"")+" />"+'<label for="'+s.id+"_sourcechooser_"+n+r+'">'+n+" ("+r+")</label>"+"</li>")),s.adjustSourcechooserBox()},adjustSourcechooserBox:function(){var e=this;e.sourcechooserButton.find(".mejs-sourcechooser-selector").height(e.sourcechooserButton.find(".mejs-sourcechooser-selector ul").outerHeight(!0))}})})(mejs.$)