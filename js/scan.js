/**
 * Created by Cai on 6/20/2017.
 */
var cam_width, cam_height;
var hiar_account = '2805980246@qq.com';
var hiar_pass = 'Hiar1234567890';
var hiar_appkey = 't5Doe0mv7E';
var hiar_secret = 'a316856db2abeb70367c02d4b68b4ae2';
var token = '';
var recog_count = 0;

window.addEventListener('load',function(){
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    camera_enumerate();

    // scan dialog
    $('.scan').click(function(){
        show_scan_modal();
        turnon_camera();
    })

    // scan dialog close button
    $('#scan_close_btn').click(function(){
        $('#lightbox').hide();
        clearInterval(recog_timmer);
        recog_count = 0;
    });

    // scan button
    $('#scan_btn').click(function(){
        //capture_recognitioon();
        recog_timmer = setInterval( function(){
            recog_count++;
            if( recog_count > 2 ){
                clearInterval( recog_timmer );
                cant_recog_show();
            }
            capture_recognitioon();
        }, 4000 );
        show_camera();

        $('#scan_result').click(function(){
            show_success_modal();
        })
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
    $('#scan_after_img').hide();
    $('#scan_money_img').hide();
    $('.camera-wrap').hide();
    $('.scan_btn_wrap').show();
    $('.lightbox-content').css('margin-top', '15%');
    $('.lightbox-content').css('height', '67%');
}

function show_success_modal(){
    $('#scan_before_img').hide();
    $('#scan_after_img').show();
    $('#scan_money_img').show();
    $('#scan_money_img').css('animation', 'moneyeffect 3s');
    $('.camera-wrap').hide();
    $('.scan_btn_wrap').hide();
    $('.lightbox-content').css('margin-top', 0);
    $('.lightbox-content').css('height', '75%');
}

function show_camera(){
    $('#scan_before_img').hide();
    $('#scan_after_img').hide();
    $('#scan_money_img').hide();

    $('.camera-wrap').show();
    $('.scan_btn_wrap').hide();
}



var videoStatus = false;
var videoElement;
var camera_ids = new Array();
function turnon_camera(){
    video.classList.remove('hidden');

    videoElement = document.querySelector('video');

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var rearCameraId;

    if (navigator.mediaDevices === undefined ||
        navigator.mediaDevices.enumerateDevices === undefined) {
        alert('这个浏览器不支持MediaStreamTrack。\n\n请使用360阅览器.');
    } else {
        try{
            if( camera_ids.length > 0 ){
                rearCameraId = camera_ids[camera_ids.length-1];
                var constraints = {
                    video: {
                        optional: [{sourceId: rearCameraId}],
                        mandatory: {
                            maxWidth: 480,
                            maxHeight: 480,
                            minWidth: 480,
                            minHeight: 480
                        }
                    },
                    audio: false
                };
                navigator.getUserMedia(constraints, successCallback, errorCallback);
            }
        }
        catch(err){
            alert(JSON.stringify(err));
        }


    }
}

var recog_timmer;
function successCallback(stream) {
    videoStatus = true;
    window.stream = stream; // make stream available to console
    videoElement.src = window.URL.createObjectURL(stream);
    videoElement.play();
}

function errorCallback(error) {
    videoStatus = false;
    alert('navigator.getUserMedia error: ' + error);
}

function camera_enumerate(){
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var rearCameraId;

    if (navigator.mediaDevices === undefined ||
        navigator.mediaDevices.enumerateDevices === undefined) {
        alert('这个浏览器不支持MediaStreamTrack。\n\n请使用360阅览器.');
    } else {
        navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    if (device.kind == 'videoinput') {
                        camera_ids.push(device.deviceId);
                    }
                });
            })
            .catch(function(err) {
                alert(err.name + ": " + err.message);
            });
    }
}