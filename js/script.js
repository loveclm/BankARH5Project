
	//var captureBtn = document.querySelector('#capture');
	var canvas = document.querySelector('#canvas');
	var video = document.querySelector('#video');


	var apiKey = 'd9318ea05c'
	var apiClientId = '46895';
	var apiMode = 'single';
	var apiScale = 480;
	var apiIsAll = 'best';
	var is_processing = false;

	function capture_recognitioon(){
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
					if( resp.status == 0 ){
						var result = resp.objects[0];
						result = result.id;

						if( result == 'h5ar_catch' ){
							show_success_modal();
							return;
						}
					}

					cant_recog_show();
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

	function cant_recog_show(){
		$('.videoWrapper').hide();
		$('#scan_capture_img').hide();
		$('.cant_recog_wrap').show();
		recog_count = 0;
		is_processing = false;
		clearInterval(recog_timmer);
	}
	function cant_recog_hide(){
		$('.cant_recog_wrap').hide();
		$('#lightbox').hide();

	}