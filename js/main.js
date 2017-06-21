/**
 * Created by Cai on 6/20/2017.
 */

window.addEventListener('load',function(){
    resize();

    // low button
    $('#low_btn').click(function(){
        $('#lightbox_low').show();
    })

    //low close button
    $('#lightbox_low_close').click(function(){
        $('#lightbox_low').hide();
    });
});


/*****************************************
 resize display
 ****************************************/
var initRatio;
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

    $('.container').css({width:width, height:height});
}

function getDevicePixelRatio() {
    if(window.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return screen.deviceXDPI / screen.logicalXDPI;
}

