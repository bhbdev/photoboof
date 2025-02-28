
    
	var video 	 	= document.getElementById("video"),
		canvas 	 	= document.getElementById("canvas"),
		img 	 	= document.getElementById("img"),
		btnPlay		= document.getElementById("play"),
		btnPause	= document.getElementById("pause"),
		btnStop		= document.getElementById("stop"),
		btnSnapshot	= document.getElementById("snapshot"),
		btnFilters 	= document.querySelectorAll("input[name='filter']"),
		curFilter 	= null,
		ctx 		= canvas.getContext('2d'),
		localMediaStream = null;

	var filters = ['grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'hue-rotate',
	               'hue-rotate2', 'hue-rotate3', 'saturate', 'invert', ''];



 const constraints = {
   audio: false,
   video: true 
 }

 function handleSuccess(stream) {
   window.stream = stream;
   video.srcObject = stream;
   localMediaStream = stream;
 }
 
 function handleError(error) {
   console.log('navigator.mediaDevices.getUserMedia error: ',error.message, error.name)
 }

 navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
 
//	navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia 
	//					|| navigator.mozGetUserMedia || navigator.msGetUserMedia;



	 function onGotMedia(stream) {
		console.debug('yup')
		if (typeof video.mozSrcObject != 'undefined') {
			console.debug('mozstream')
			video.mozSrcObject = stream;
			video.play();
		} // else if (typeof window.webKitURL == 'undefined') video.src = stream
		else {
			console.debug('webkitstream')
			video.src = window.webkitURL.createObjectURL(stream);
			//video.play();
		}

		localMediaStream = stream;
		
	}
	function onFailedMedia(e) {
		alert("doh... errors happen. ("+e+")");
	}
	
	function updateCanvasSize () {
		cw = video.clientWidth;
		ch = video.clientHeight;
		canvas.width = cw;
		canvas.height = ch;
	//	alert('canvas w: ' +cw + ' h'+ch);
	}

	function playStream() {
		console.debug('play')
		if (localMediaStream) {
			console.debug('err')
			if (video.paused) {
				video.play();
				btnPlay.disabled = true;
				btnPause.disabled = false;
			}
			return;
		}
		if (navigator.getMedia) {
		//	navigator.getMedia({video: true}, onGotMedia, onFailedMedia);
		} else {
			alert("Sorry your browser does not seem to support WebRTC methods. Bummer.");
		}
	}

	function pauseStream () {
		if (localMediaStream) {
			if (!video.paused) {
				video.pause();
				btnPause.disabled = true;
				btnPlay.disabled = false;
			}
		}
	}
	
	function stopStream () {
		if (!localMediaStream) return;
		localMediaStream.stop();
	}

	function snapshot() {
		if (localMediaStream) {
			ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
			//img.src = canvas.toDataURL('image/webp');
			img.src = canvas.toDataURL('image/png');
			img.style.opacity = '1';
		}
	}

	function changeFilter(e) {
	  var el = e.target;
	  var idx = el.id.replace(/filter/,'');
	  var effect = filters[idx-1];
 	  

	  if (effect == '') {
		for (var x=0; x<filters.length; ++x) {
			video.classList.remove(filters[x]);
			canvas.classList.remove(filters[x]);
		}
	  } else {
		if (curFilter && curFilter != effect) {
			video.classList.remove(curFilter);
			canvas.classList.remove(curFilter);
		}

		video.classList.add(effect);
		curFilter = effect;
		canvas.classList.add(effect);
	  }
		//alert(curFilter)
	}
	
	
	video.addEventListener('play', updateCanvasSize, false);
	btnPlay.addEventListener('click', playStream, false);
	btnPause.addEventListener('click', pauseStream, false);
	btnStop.addEventListener('click', stopStream,false);
	btnSnapshot.addEventListener('click', snapshot,false);
	for (var i=0,max=btnFilters.length; i < max; i++)
		btnFilters[i].addEventListener('click', changeFilter, false);
	//playStream();
	
	

