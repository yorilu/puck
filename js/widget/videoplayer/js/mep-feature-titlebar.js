/**
 * Created by anders on 15/5/18.
 */
(function($) {

    $.extend(mejs.MepDefaults, {
        showtitleBar: true,

    });

    $.extend(MediaElementPlayer.prototype, {
        buildtitlebar : function(player, controls, layers, media) {
            if (!player.isVideo)
                return;

            var title = $('<div class="mejs-titlebar mejs-layer">' +
                '<span class="mejs-title-back"><i></i></span>'+
                    '<h2 class="mejs-title">马布里经常1V3<h2></div>')
                    .insertBefore(layers);

            $('.mejs-title-back').on('click',function(){
               window.history.back();
            });
        },

        setTitle:function(title){
            $('.mejs-title').html(title);
            document.title = title;
        }
    });


})(mejs.$);
