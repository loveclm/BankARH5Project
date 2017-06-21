/**
 * Created by Cai on 6/20/2017.
 */
var initRatio;
window.addEventListener('load',function(){
    resize();

    $('#scan').click(function(){
        $('#lightbox').show();
    })

    $('#scan_btn').click(function(){
        $(this).hide();
        $('#scan_before_img').hide();
        $('#scan_before_img').attr('src', 'images/page6-main.png');
        $('.lightbox-content').css('margin-top', 0);
        $('.lightbox-content').css('height', '75%');
        $('#scan_before_img').show();
        //$('.lightbox-content').css({margin_top: 0, height: 75%})
    })

    $('#low_btn').click(function(){
        $('#lightbox_low').show();
    })
    $('#lightbox_low_close').click(function(){
        $('#lightbox_low').hide();
    });
});

window.addEventListener('resize', function(event){
    resize();
});

function resize(){
    initRatio = getDevicePixelRatio();
    var ratio = getDevicePixelRatio()/initRatio;
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var scale = Math.min(width/640,height/1010) * ratio;

    width = 640*scale;

    console.log(width + ': ' + height);

    $('.container').css({width:width, height:height});
}

function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}

