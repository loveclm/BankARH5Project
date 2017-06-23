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
var check_camera = true;

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}


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
        $('.videoWrapper').show();
        $('#scan_capture_img').hide();
    })

    // scan dialog close button
    $('#scan_close_btn').click(function(){
        $('#scan_capture_img').hide();
        $('.scan_btn_wrap').hide();
        $('#lightbox').hide();
        clearInterval(recog_timmer);
        recog_count = 0;
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
                        //alert(result);
                        if( result == 'h5ar_catch' ){
                            show_success_modal();
                            return;
                        }
                    }else{
                        cant_recog_show();
                    }

                    //cant_recog_show();
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
        if(videoStatus == false || check_camera == false){
            var camera = document.getElementById('camera');
            var frame = document.getElementById('frame');
            camera.addEventListener('change', function(e) {
                var file = e.target.files[0];
                frame.src = URL.createObjectURL(file);
                $('#scan_capture_img').attr('src', URL.createObjectURL(file));
                $('#scan_capture_img').show();
                $('#scan_before_img').hide();
                $('.scan_btn_wrap').hide();
            });

            $('#camera').click();
        }
        else {
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
        }

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
    $('.camera-wrap').hide();
    $('.scan_btn_wrap').show();
    $('.lightbox-content').css('margin-top', '15%');
    $('.lightbox-content').css('height', '67%');
}

function show_success_modal(){
    window.location = 'page6.html';
}

function show_camera(){
    $('#scan_before_img').hide();
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
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia;// Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }


    var rearCameraId;

    if (navigator.mediaDevices === undefined ||
        navigator.mediaDevices.enumerateDevices === undefined) {
        //alert('这个浏览器不支持MediaStreamTrack。\n\n请使用360阅览器.');
        check_camera = false;
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
            //alert(JSON.stringify(err));
            check_camera = false;
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
    //alert('navigator.getUserMedia error: ' + error);
    check_camera = false;
}

function camera_enumerate(){
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia;

    var rearCameraId;

    if (navigator.mediaDevices === undefined ||
        navigator.mediaDevices.enumerateDevices === undefined) {
        //alert('这个浏览器不支持MediaStreamTrack。\n\n请使用360阅览器.');
        check_camera = false;
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
                //alert(err.name + ": " + err.message);
                check_camera = false;
            });
    }
}