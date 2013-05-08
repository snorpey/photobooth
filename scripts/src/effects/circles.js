/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var supported_inputs = [ 'background-color', 'size' ];
		var defaults = { 'background-color': '#fff', size: 40 };

		function getInstructions( image_data, input )
		{
			var items = { };
			var size = input.size || defaults.size;
			var width = image_data.width;
			var height = image_data.height;
			var len = image_data.data.length;
			var multiplicator = 4 * size;

			items['bg'] = {
				pos: vec.create( 0, 0 ),
				color: input['background-color'] || defaults['background-color'],
				shape: 'rect',
				width: width,
				height: height
			};

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

					var r = image_data.data[i];
					var g = image_data.data[i + 1];
					var b = image_data.data[i + 2];

					var l = lightness( r, b, g );

					var radius = l / 255 * ( size / 2 );

					if ( radius > 0.3 )
					{
						var pos_x = x + size / 2;
						var pos_y = y + size / 2;

						items['cam-' + i] = {
							pos: vec.create( pos_x, pos_y ),
							color: hex( r, g, b ),
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
