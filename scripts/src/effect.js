/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var signals;
		var width = 640;

		function init( shared )
		{
			signals = shared.signals;

			signals['cam-data'].add( gotCamData );
		}

		function gotCamData( data )
		{
			var instructions = getInstructions( data.data );

			for ( var key in instructions )
			{
				signals['instructed'].dispatch( instructions[key] );
			}
		}

		function getInstructions( data )
		{
			var items = { };
			var len = data.length;
			var size = 20;
			var multiplicator = 4 * size;

			var line_counter = 0;

			// to lines

			for ( var i = 0; i < len; i += 4 )
			{
				var pixel = i / 4;
				var line = Math.floor( pixel / width );

				if (
					line % size === 0 &&
					pixel % size === 0
				)
				{
					var x = pixel % width;
					var y = Math.floor( pixel / width );

					var r = data[i];
					var g = data[i + 1];
					var b = data[i + 2];

					items['cam-' + i] = {
						pos: vec.create( x, y ),
						color: rgbToHex(r, g, b),
						id: 'cam-' + i,
						type: 'rect',
						width: size,
						height: size
					};
				}
			}

			return items;
		}

		//gf: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		function componentToHex( c )
		{
			var hex = c.toString( 16 );
			return hex.length === 1 ? '0' + hex : hex;
		}

		function rgbToHex( r, g, b )
		{
			return '#' + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
		}


		var fx = {
			init: init
		};

		return fx;
	}
);

// 1234  x = florri / 
// 5678  y = i % width