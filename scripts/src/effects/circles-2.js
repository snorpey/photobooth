/*global define*/
define(
	[ 'vec' ],
	function ( vec )
	{
		var supported_inputs = [ 'size' ];
		var defaults = { size: 40 };

		function getInstructions( data, width, height, values )
		{
			var items = { };
			var len = data.length;
			var size = values.size || defaults.size;
			var multiplicator = 4 * size;

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

					var l = lightness( r, b, g );

					var radius = l / 255 * ( size / 2 );

					if ( radius > 0.3 )
					{
						var pos_x = x + size / 2;
						var pos_y = y + size / 2;

						items['cam-' + i] = {
							pos: vec.create( pos_x, pos_y ),
							color: '#ccc',
							shape: 'circle',
							rad: radius
						};
					}
				}
			}

			return items;
		}

		// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		function componentToHex( c )
		{
			var hex = c.toString( 16 );
			return hex.length === 1 ? '0' + hex : hex;
		}

		function hex( r, g, b )
		{
			return '#' + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
		}

		// http://stackoverflow.com/a/596241/229189
		function lightness( r, g, b )
		{
			return ( r + r + b + g + g + g ) / 6;
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);
