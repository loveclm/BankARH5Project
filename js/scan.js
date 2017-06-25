/**
 * Created by Cai on 6/20/2017.
 */
var apiKey = 'd9318ea05c'
var apiClientId = '46895';
var apiMode = 'single';
var apiScale = 480;
var apiIsAll = 'best';
var is_processing = false;

window.addEventListener('load',function(){
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;


    // scan dialog
    $('.scan').click(function(){
        show_scan_modal();
        $('#scan_capture_img').hide();
    })

    // scan dialog close button
    $('#scan_close_btn').click(function(){
        $('#scan_capture_img').hide();
        $('.scan_btn_wrap').hide();
        $('#lightbox').hide();
    });

    $("#frame").load(function(){
        var img = document.getElementById('frame');
        var width = img.width;
        var height = img.height;
        if (apiScale && height > apiScale) {
            value = apiScale / width;
            width = apiScale;
            height = height * value;
        }
        var can = document.getElementById("imgCanvas");
        can.setAttribute('width', width);
        can.setAttribute('height', height);

        var ctx = can.getContext("2d");
        ctx.drawImage(img, 0, 0,width, height);
        var dataURL = can.toDataURL("image/jpeg");

        var imageBase64 = dataURL.replace('data:image/jpeg;base64,', '');

        if (imageBase64 == null) {
            alert("Image data processing error.");
            return;
        } else {
            //Recognize.im API options.
            var apiOpt = {
                clientId: apiClientId,
                key: apiKey,
                mode: apiMode,
                allResults: apiIsAll,
                debug: true,
                onRecognitionSuccess: function(resp) {
                    if( resp.status == 0 ){
                        console.log(resp.objects);
                        var result = resp.objects[0];
                        result = result.id;
                        console.log(result);

                        if( result == 'h5ar_catch' ){
                            show_success_modal();
                            return;
                        }
                    }else{
                        cant_recog_show();
                    }
                },
                onRecognitionFailure: function(resp) {
                    cant_recog_show();
                    $('#canvas').hide();
                    is_processing = false;
                },
                onError: function(ajax) {
                    cant_recog_show();
                }
            }
            //Init Recognize.im API object and send request.
            var recognizeIm = new RecognizeIm(apiOpt);
            if( is_processing == false )
                recognizeIm.recognize(imageBase64);
            is_processing = true;
        }

    });

    // scan button
    $('#scan_btn').click(function(){
        var camera = document.getElementById('camera');
        var frame = document.getElementById('frame');

        $('#scan_before_img').hide();
        $('.scan_btn_wrap').hide();
        $('.recog_process').show();

        camera.addEventListener('change', function(e) {

            var file = e.target.files[0];
            frame.src = URL.createObjectURL(file);

            $('#scan_capture_img').attr('src', URL.createObjectURL(file));
            $('#scan_capture_img').show();
        });

        $('#camera').click();

    })

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
scan dialog functions
 ****************************************/
function show_scan_modal(){
    $('#lightbox').show();
    $('#scan_before_img').show();
    $('.scan_btn_wrap').show();
    $('.lightbox-content').css('margin-top', '15%');
    $('.lightbox-content').css('height', '67%');
}

function show_success_modal(){
    window.location = 'page6.html';
}

function cant_recog_show(){
    $('.videoWrapper').hide();
    $('#scan_capture_img').hide();
    $('.recog_process').hide();
    $('.cant_recog_wrap').show();
    recog_count = 0;
    is_processing = false;
    clearInterval(recog_timmer);
}
function cant_recog_hide(){
    $('.cant_recog_wrap').hide();
    $('#lightbox').hide();

}

var recog_timmer;

