/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var stream;
		var canvas = document.createElement( 'canvas' );
		var ctx = canvas.getContext( '2d' );
		var video;

		var counter = 0;
		var framerate = 1;

		function init( shared )
		{
			signals = shared.signals;
			canvas.width = 640;
			canvas.height = 480;

			if ( hasWebcamAccess() )
			{
				var cam_options = { video: true };

				video = $( '#cam-video' );
				video.click( stopCam );

				signals['looped'].add( sendCamData );

				normalize();
				navigator.webkitGetUserMedia( cam_options, gotCamData, failed );
			}

			else
			{
				console.log( 'unfortunately, i can\'t access your camera.' );
			}
		}

		function gotCamData( media_stream )
		{
			var cam_url = window.URL.createObjectURL( media_stream );

			stream = media_stream;

			video.attr( { src: cam_url } );

			signals['cam-started'].dispatch();
		}

		function failed( event )
		{
			console.log( 'failed.' );
		}

		function sendCamData()
		{
			if ( stream )
			{
				if ( counter >= framerate )
				{
					counter = 0;

					ctx.drawImage( video[0], 0, 0 );

					var data = ctx.getImageData( 0, 0, canvas.width, canvas.height );
					var image = canvas.toDataURL( 'image/png' );

					signals['cam-data'].dispatch( data );
				}

				else
				{
					counter++;
				}
			}
		}

		function stopCam()
		{
			video[0].pause();
			video[0].src = '';
		}

		// gf: http://www.html5rocks.com/en/tutorials/getusermedia/intro/
		function hasWebcamAccess()
		{
			return !! (
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia
			);
		}

		function normalize()
		{
			window.URL = window.URL || window.webkitURL;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		}

		var cam = { init: init };

		return cam;
	}
);