/**
 * Created by Cai on 6/20/2017.
 */
var cam_width, cam_height;
var hiar_account = '2805980246@qq.com';
var hiar_pass = 'Hiar1234567890';
var hiar_appkey = 't5Doe0mv7E';
var hiar_secret = 'a316856db2abeb70367c02d4b68b4ae2';

window.addEventListener('load',function(){
    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach( '#scan_camera' );

    // scan dialog
    $('.scan').click(function(){
        show_scan_modal();
    })

    // scan dialog close button
    $('#scan_close_btn').click(function(){
        $('#lightbox').hide();
    });

    // scan button
    $('#scan_btn').click(function(){
        //$(this).hide();
        //$('#scan_before_img').hide();
        //$('.camera-wrap').show();
        show_camera();

        start_snapping();

        ajax_url = 'https://api.hiar.io/v1/account/signin';
        data = {
            account: hiar_account,
            password: hiar_pass
        }

        //$.ajax({
        //    type: "POST",
        //    url: ajax_url,
        //    headers: {
        //        'Content-Type': 'application/x-www-form-urlencoded',
        //        'Access-Control-Allow-Origin': '*'
        //    },
        //    success: function (data) {
        //        alert('result');
        //        console.log(data);
        //    },
        //    error: function (error) {
        //        alert('error');
        //    },
        //    dataType: "json",
        //    data: {
        //        account: hiar_account,
        //        password: hiar_pass
        //    },
        //    cache: false,
        //    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        //    processData: false,
        //    timeout: 60000
        //});

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

    var v = document.getElementsByTagName('video')[0];
    v.addEventListener( "loadedmetadata", function (e) {
        cam_width = this.videoWidth;
        cam_height = this.videoHeight;

        Webcam.params.width = cam_width*0.5;
        Webcam.params.height = cam_height*0.5;
        Webcam.params.dest_width = cam_width*0.5;
        Webcam.params.dest_height = cam_height*0.5;
    }, false );
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
    $('#scan_money_img').css('animation', 'moneyeffect 1s');
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

/*****************************************
scan functions
 ****************************************/
var timer = null;

function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
        // display results in page
        //var img = new Image();
        //img.src = data_uri;

        var image = $('#scan_result img');
        //img.onload = function() {
        //    //alert(this.width + 'x' + this.height);
        //}
        image.attr('src', data_uri);

    } );
}

function start_snapping() {
    if (!timer) {
        take_snapshot();
        timer = setInterval( take_snapshot, 250 );
    }
}

function stop_snapping() {
    if (timer) {
        clearTimeout( timer );
        timer = null;
    }
}

function erase_snaps() {
    document.getElementById('results').innerHTML = '';
}

