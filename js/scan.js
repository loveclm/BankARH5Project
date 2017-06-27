/**
 * Created by Cai on 6/20/2017.
 */
//var apiKey = 'd9318ea05c'
//var apiClientId = '46895';

var canvas;
var video;

var apiMode = 'single';
var apiScale = 480;
var apiIsAll = 'best';
var is_processing = false;

var check_camera = true;
var is_closed = true;

if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

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
    canvas = document.querySelector('#canvas');
    video = document.querySelector('#video');

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
        $('.recog_process').hide();
    })

    // scan dialog close button
    $('#scan_close_btn').click(function(){
        $('#scan_capture_img').hide();
        $('.scan_btn_wrap').hide();
        $('#lightbox').hide();
        clearTimeout(recog_timmer);
        is_closed = true;
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
                        //console.log(resp.objects);
                        //var result = resp.objects[0];
                        //result = result.id;
                        //console.log(result);
                        //
                        //if( result == 'h5ar_catch' ){
                        //    show_success_modal();
                        //    //find_recog_show();
                        //    return;
                        //}

                        var is_catch = false;
                        var is_text = false;
                        for( var i=0; i<resp.objects.length; i++ ){
                            var result = resp.objects[i];
                            result = result.id;
                            if( result == 'h5ar_catch' ){
                                is_catch = true;
                                console.log('catch found');
                            }
                            if( result == 'h5ar_text' || result == 'h5ar_text1' ||
                                result == 'h5ar_text2' || result == 'h5ar_text3' ||
                                result == 'h5ar_text4' || result == 'h5ar_text5'){
                                is_text = true;
                                console.log('text found : ' + result);
                            }
                        }
                        console.log(result);

                        if( is_catch == true && is_text == true ){
                            console.log('show_success_modal');
                            show_success_modal();
                            //find_recog_show();
                            return;
                        } else {
                            cant_recog_show();
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
        is_closed = false;
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if(videoStatus == false || check_camera == false){
        //if(isiOS){
            var camera = document.getElementById('camera');
            var frame = document.getElementById('frame');

            $('#scan_before_img').hide();
            $('.scan_btn_wrap').hide();
            $('.recog_process').show();
            $('#waiting').hide();
            $('#open_camera').show();
            $('#waiting').hide();

            camera.addEventListener('change', function(e) {

                var file = e.target.files[0];
                frame.src = URL.createObjectURL(file);

                $('#waiting').show();
                $('#open_camera').hide();
                $('#scan_capture_img').attr('src', URL.createObjectURL(file));
                $('#scan_capture_img').show();
            });

            $('#camera').click();
        } else {
            recog_timmer = setTimeout( function(){
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
    $('.camera-wrap').hide();
    window.location = 'page6.html';
}

function show_camera(){
    $('#scan_before_img').hide();
    $('.camera-wrap').show();
    $('.scan_btn_wrap').hide();
}

var is_find = false;
function find_recog_show(){
    $('.videoWrapper').hide();
    $('#scan_capture_img').hide();
    $('.recog_process').hide();
    $('.cant_recog_wrap').show();

    is_find = true;
    $('#final_recog_show').show();
    $('#cant_recog_show').hide();
    is_processing = false;
    clearTimeout(recog_timmer);
}

function cant_recog_show(){
    $('.videoWrapper').hide();
    $('#scan_capture_img').hide();
    $('.recog_process').hide();
    $('.cant_recog_wrap').show();

    is_find = false;
    $('#final_recog_show').hide();
    $('#cant_recog_show').show();
    is_processing = false;
    clearTimeout(recog_timmer);
}

function cant_recog_hide(){
    if( is_find == true ){
        window.location = 'page6.html';
        return;
    }
    $('.cant_recog_wrap').hide();
    $('#lightbox').hide();
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


var videoStatus = false;
var videoElement;
var camera_ids = new Array();
function turnon_camera(){
    video.classList.remove('hidden');

    videoElement = document.querySelector('video');

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia;

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



function capture_recognitioon(){
    console.log('capture_recognitioon');
    //video.addEventListener('click', function(e){
    if (videoStatus) {
        $('#capture').show();
        var imageBase64 = capture(apiScale);
    } else {
        alert('Image capturing error.');
        return;
    }

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
                console.log(resp);
                if( resp.status == 0 ){
                    if( is_closed ){
                        return;
                    }
                    var is_catch = false;
                    var is_text = false;
                    for( var i=0; i<resp.objects.length; i++ ){
                        var result = resp.objects[i];
                        result = result.id;
                        if( result == 'h5ar_catch' ){
                            is_catch = true;
                            console.log('catch found');
                        }
                        if( result == 'h5ar_text' || result == 'h5ar_text1' ||
                            result == 'h5ar_text2' || result == 'h5ar_text3' ||
                            result == 'h5ar_text4' || result == 'h5ar_text5'){
                            is_text = true;
                            console.log('text found : ' + result);
                        }
                    }

                    console.log(result);

                    if( is_catch == true && is_text == true ){
                        console.log('show_success_modal');
                        show_success_modal();
                        //find_recog_show();
                        return;
                    } else {
                        cant_recog_show();
                    }
                }

                cant_recog_show();
            },
            onRecognitionFailure: function(resp) {
                console.log(resp);

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
};

function capture(scale) {
    var width = video.videoWidth;
    var height = video.videoHeight;
    if (scale && height > scale) {
        value = scale / width;
        width = scale;
        height = height * value;
    }
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    var image = canvas.toDataURL('image/jpeg');
    image = image.replace('data:image/jpeg;base64,', '');
    return image;
}

