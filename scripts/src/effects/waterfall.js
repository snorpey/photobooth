/*global define*/
define(
	[ 'vec' ],
	function ( vec )
	{
		var supported_inputs = [ 'size' ];
		var defaults = { size: 10 };

		function getInstructions( data, width, height, values )
		{
			var items = { };
			var len = data.length;
			var size = values.size || defaults.size;
			var multiplicator = 4 * size;

			for ( var i = 0; i < len; i += multiplicator )
			{
				var r = data[i];
				var g = data[i + 1];
				var b = data[i + 2];

				var s = i / 4;

				var x = s % width;
				var y = Math.round( s / width );

				items['cam-' + s] = {
					pos: vec.create( x, y ),
					color: rgbToHex( r, g, b ),
					shape: 'rect',
					width: size,
					height: size
				};
			}

			return items;
		}

		// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		function componentToHex( c )
		{
			var hex = c.toString( 16 );
			return hex.length === 1 ? '0' + hex : hex;
		}

		function rgbToHex( r, g, b )
		{
			return '#' + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);
