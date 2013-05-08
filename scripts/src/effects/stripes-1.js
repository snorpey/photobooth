/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var supported_inputs = [ 'background-color', 'size' ];
		var defaults = { 'background-color': '#fff', size: 30 };

		function getInstructions( image_data, input )
		{
			var items = { };
			var width = image_data.width;
			var height = image_data.height;
			var data = image_data.data;
			var len = data.length;
			var size = input.size || defaults.size;
			var multiplicator = 4 * size;

			items['bg'] = {
				pos: vec.create( 0, 0 ),
				color: input['background-color'] || defaults['background-color'],
				shape: 'rect',
				width: width,
				height: height
			};

			for ( var i = 0; i < len; i += multiplicator )
			{
				var r = data[i];
				var g = data[i + 1];
				var b = data[i + 2];

				var s = i / 4;

				var x = s % width;
				var y = Math.round( s / width );

				items['cam-' + i] = {
					pos: vec.create( x, y ),
					color: rgbToHex( r, g, b ),
					shape: 'rect',
					width: size / 4,
					height: size / 4
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