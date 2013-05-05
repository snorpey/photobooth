/*global require, requirejs, define, Modernizr, _basepath_ */
// http://requirejs.org/docs/api.html#config 
var path = typeof _basepath_ === 'string' ? _basepath_ + '/' : '';
requirejs.config(
	{
		baseUrl: path + 'scripts/',
		waitSeconds: 5,
		urlArgs: 'bust=' +  ( new Date() ).getTime(),
		paths: {
			'jquery'    : 'lib/jquery-1.9.1-deprecated-effects',
			'signals'   : 'lib/signals-1.0.0',
			'masonry'   : 'lib/jquery.masonry.2.1.08.min',
			'sylvester' : 'lib/sylvester-1.0.3.mod',
			'vec'       : 'aux/vec'
		},
		shim: {
			'masonry' : [ 'jquery' ]
		}
	}
);

require(
	[
		'src/canvas',
		'src/loop',
		'src/instructor',
		'src/cam',
		'src/effect',
		'src/screenshot',
		'src/gallery',
		'src/controls',
		'signals',
		'jquery'
	],
	function(
		canvas,
		loop,
		instructor,
		cam,
		effect,
		screenshot,
		gallery,
		controls,
		Signal,
		$
	)
	{
		var shared = {
			win: $( window ),
			doc: $( document ),
			signals: {
				'resized'        : new Signal(),
				'looped'         : new Signal(),
				'instructed'     : new Signal(),
				'draw'           : new Signal(),
				'cam-started'    : new Signal(),
				'cam-data'       : new Signal(),
				'capture'        : new Signal(),
				'canvas-img'     : new Signal(),
				'update-controls': new Signal(),
				'input-updated'  : new Signal(),
				'effect-updated' : new Signal()
			}
		};

		$( document ).ready( init );

		function init()
		{
			canvas.init( shared );
			loop.init( shared );
			instructor.init( shared );
			cam.init( shared );
			controls.init( shared );
			effect.init( shared );
			screenshot.init( shared );
			gallery.init( shared );

			$( window ).resize( resized );

			$( '.no-js' )
				.removeClass( 'no-js' )
				.addClass( 'js' );

			resized();
		}

		function resized()
		{
			var size = {
				width: shared.win.width(),
				height: shared.win.height()
			};

			shared.signals['resized'].dispatch( size );
		}
	}
);