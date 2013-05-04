/*global define*/
// todo: update to new format
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
			console.log( 'gotCamData' );
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
			var size = 30;
			var multiplicator = 4 * size;

			for ( var i = 0; i < len; i += multiplicator )
			{
				var r = data[i];
				var g = data[i + 1];
				var b = data[i + 2];

				var s = Math.round( i / 4 );

				var x = s % width// * size;
				var y = Math.round( s / width )// * size;

				items['cam-' + i] = {
					pos: vec.create( x, y ),
					color: rgbToHex(r, g, b),
					id: 'cam-' + i,
					type: 'rect',
					width: size / 4,
					height: size / 4
				};

				if ( i === 300 )
				{
					console.log( rgbToHex(r, g, b) );
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