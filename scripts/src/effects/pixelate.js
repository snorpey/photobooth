/*global define*/
define(
	[ 'vec' ],
	function ( vec )
	{
		var supported_inputs = [ 'size' ];
		var defaults = { size: 40 };

		function getInstructions( image_data, input )
		{
			var items = { };
			var width = image_data.width;
			var height = image_data.height;
			var data = image_data.data;
			var len = data.length;
			var size = input.size || defaults.size;
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

					items['cam-' + i] = {
						pos: vec.create( x, y ),
						color: rgbToHex( r, g, b ),
						shape: 'rect',
						width: size,
						height: size
					};
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

		function rgbToHex( r, g, b )
		{
			return '#' + componentToHex( r ) + componentToHex( g ) + componentToHex( b );
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);
