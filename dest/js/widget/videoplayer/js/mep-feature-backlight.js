(function(e){function t(t,n,s,o,a,f,l){t.empty();var c=document.createElement("canvas"),h=c.getContext("2d"),p=n.width,d=n.height,v,m=r(n,s,a,l,"top"),g=r(n,s,a,l,"bottom"),y=r(n,s,o,l,"left"),b=r(n,s,o,l,"right"),w=[],E=0;c.width=p+f+f,c.height=d+f+f,h.globalCompositeOperation="xor",w.push(i(m[m.length-1],b[0])),w.push(i(g[g.length-1],b[b.length-1])),w.push(i(g[0],y[y.length-1])),w.push(i(m[0],y[0])),E=1/m.length,gradient=s.createLinearGradient(f,f,p+f,f),gradient.addColorStop(0,"rgb("+u(w[3]).join(",")+")");for(var S=0,x=m.length;S<x;S++)gradient.addColorStop(S*E+E/2,"rgb("+u(m[S]).join(",")+")");gradient.addColorStop(1,"rgb("+u(w[0]).join(",")+")"),h.fillStyle=gradient,h.fillRect(f,0,p,f),gradient=s.createLinearGradient(f+p,f,f+p,f+d),gradient.addColorStop(0,"rgb("+u(w[0]).join(",")+")");for(var S=0,x=b.length;S<x;S++)gradient.addColorStop(S*E+E/2,"rgb("+u(b[S]).join(",")+")");gradient.addColorStop(1,"rgb("+u(w[1]).join(",")+")"),h.fillStyle=gradient,h.fillRect(f+p,f,f+p+f,d),gradient=s.createLinearGradient(f,f+d,f+p,f+d),gradient.addColorStop(0,"rgb("+u(w[2]).join(",")+")");for(var S=0,x=g.length;S<x;S++)gradient.addColorStop(S*E+E/2,"rgb("+u(g[S]).join(",")+")");gradient.addColorStop(1,"rgb("+u(w[1]).join(",")+")"),h.fillStyle=gradient,h.fillRect(f,f+d,p,f),gradient=s.createLinearGradient(f,f,f,f+d),gradient.addColorStop(0,"rgb("+u(w[3]).join(",")+")");for(var S=0,x=y.length;S<x;S++)gradient.addColorStop(S*E+E/2,"rgb("+u(y[S]).join(",")+")");gradient.addColorStop(1,"rgb("+u(w[2]).join(",")+")"),h.fillStyle=gradient,h.fillRect(0,f,f,d),h.fillStyle="rgb("+u(w[0]).join(",")+")",h.fillRect(p+f,0,f+p+f,f),h.fillStyle="rgb("+u(w[1]).join(",")+")",h.fillRect(p+f,f+d,f+p+f,f+d+f),h.fillStyle="rgb("+u(w[2]).join(",")+")",h.fillRect(0,f+d,f,f+d+f),h.fillStyle="rgb("+u(w[3]).join(",")+")",h.fillRect(0,0,f,f),e(c).css("position","absolute").css("top",-f).css("left",-f).appendTo(t)}function n(e,t){return t.addColorStop(0,"rgba("+e.join(",")+",0)"),t.addColorStop(1,"rgba("+e.join(",")+",1)"),t}function r(e,t,n,r,i){var s=e.width,u=e.height,a=i=="top"||i=="bottom"?r:Math.ceil(u/n),f=i=="top"||i=="bottom"?Math.ceil(s/n):r,l=[],c,h;if(i=="top"||i=="bottom")for(h=0;h<n;h++)try{c=t.getImageData(h*f,i=="top"?0:u-a,f,a),l.push(o(c.data))}catch(p){console.log(p)}else for(h=0;h<n;h++)try{c=t.getImageData(i=="right"?s-f:0,h*a,f,a),l.push(o(c.data))}catch(p){console.log(p)}return l}function i(e,t){var n=[(e[0]+t[0])/2,(e[1]+t[1])/2,(e[2]+t[2])/2];return n}function s(e,t,n){var r=[0,0,0],i=(n-t)/4;for(var s=t;s<=n;s+=4)r[0]+=e[s],r[1]+=e[s+1],r[2]+=e[s+2];return r[0]=Math.round(r[0]/i),r[1]=Math.round(r[1]/i),r[2]=Math.round(r[2]/i),r}function o(e){var t=[0,0,0],n=e.length;for(var r=0;r<n;r+=4)t[0]+=e[r],t[1]+=e[r+1],t[2]+=e[r+2];return t[0]=Math.round(t[0]/n),t[1]=Math.round(t[1]/n),t[2]=Math.round(t[2]/n),t}function u(e){return e=a(e),e[1]=Math.min(100,e[1]*1.2),e[2]=80,f(e)}function a(e){var t=e[0]/255,n=e[1]/255,r=e[2]/255,i,s,o,u,a,f,s;return i=Math.min(Math.min(t,n),r),s=Math.max(Math.max(t,n),r),o=t==i?n-r:n==i?r-t:t-n,u=t==i?3:n==i?5:1,a=Math.floor((u-o/(s-i))*60)%360,f=Math.floor((s-i)/s*100),s=Math.floor(s*100),[a,f,s]}function f(e){var t=e[0],n=e[1],r=e[2],i,s,o,u,a,n=n/100,r=r/100,t=t/360;if(n>0){t>=1&&(t=0),t=6*t;var f=t-Math.floor(t);o=Math.round(255*r*(1-n)),u=Math.round(255*r*(1-n*f)),a=Math.round(255*r*(1-n*(1-f))),r=Math.round(255*r);switch(Math.floor(t)){case 0:i=r,s=a,u=o;break;case 1:i=u,s=r,u=o;break;case 2:i=o,s=r,u=a;break;case 3:i=o,s=u,u=r;break;case 4:i=a,s=o,u=r;break;case 5:i=r,s=o,u=u}return[i||0,s||0,u||0]}return r=Math.round(r*255),[r,r,r]}e.extend(mejs.MepDefaults,{backlightBackground:[0,0,0],backlightHorizontalLights:5,backlightVerticalLights:5,backlightSize:50,backlightTimeout:200}),e.extend(MediaElementPlayer.prototype,{buildbacklight:function(r,i,s,o){function N(){p.drawImage(o,0,0,o.width,o.height),t(l,h,p,r.options.backlightVerticalLights,r.options.backlightHorizontalLights,r.options.backlightSize,30),v&&m&&(g=setTimeout(N,r.options.backlightTimeout))}if(!r.isVideo)return;var u=r.container.find(".mejs-mediaelement").parent(),a=e('<div class="mejs-border"></div>').prependTo(u).css("position","absolute").css("top","-10px").css("left","-10px").css("border","solid 10px #010101").width(r.width).height(r.height),f=e('<div class="mejs-backlight-glow"></div>').prependTo(u).css("position","absolute").css("display","none").css("top",0).css("left",0).width(r.width).height(r.height),l=e('<div class="mejs-backlight"></div>').prependTo(u).css("position","absolute").css("top",0).css("left",0).width(r.width).height(r.height),c,h=document.createElement("canvas"),p=h.getContext("2d"),d,v=!0,m=!0,g=null,y=document.createElement("canvas"),b=y.getContext("2d"),w=r.options.backlightSize,E=r.options.backlightBackground,S,x=r.width,T=r.height;h.width=x,h.height=T,y.width=x+w+w,y.height=T+w+w,S=n(E,b.createLinearGradient(w,w,w,0)),b.fillStyle=S,b.fillRect(w,w,x,-w),S=n(E,b.createRadialGradient(x+w,w,0,x+w,w,w)),b.fillStyle=S,b.fillRect(x+w,w,w,-w),S=n(E,b.createLinearGradient(x+w,w,x+w+w,w)),b.fillStyle=S,b.fillRect(x+w,w,w,T),S=n(E,b.createRadialGradient(x+w,T+w,0,x+w,T+w,w)),b.fillStyle=S,b.fillRect(x+w,T+w,w,w);var S=n(E,b.createLinearGradient(w,w+T,w,w+T+w));b.fillStyle=S,b.fillRect(w,w+T,x,w),S=n(E,b.createRadialGradient(w,T+w,0,w,T+w,w)),b.fillStyle=S,b.fillRect(0,T+w,w,w),S=n(E,b.createLinearGradient(w,w,0,w)),b.fillStyle=S,b.fillRect(w,w,-w,T),S=n(E,b.createRadialGradient(w,w,0,w,w,w)),b.fillStyle=S,b.fillRect(0,0,w,w),e(y).css("position","absolute").css("top",-w).css("left",-w).appendTo(f),e('<div class="mejs-backlight-button mejs-backlight-active"><span></span></div>').appendTo(i).click(function(){m?(delete g,g=null,l.hide(),f.hide(),e(this).removeClass("mejs-backlight-active").addClass("mejs-backlight-inactive")):(N(),l.show(),f.show(),e(this).removeClass("mejs-backlight-inactive").addClass("mejs-backlight-active")),m=!m}),o.addEventListener("play",function(){m&&(v=!0,N(),f.css("display",""))},!1),o.addEventListener("pause",function(){v=!1},!1),o.addEventListener("ended",function(){v=!1},!1)}})})(mejs.$)