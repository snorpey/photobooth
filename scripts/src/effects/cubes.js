/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var supported_inputs = [ 'foreground-color', 'background-color' ];
		var defaults = { 'foreground-color': '#ccc', 'background-color': '#fff' };

		function getInstructions( data, width, height, values )
		{
			var items = { };
			var len = data.length;
			var size = 8;
			var min_size = size * 0.2;

			items['bg'] = {
				pos: vec.create( 0, 0 ),
				color: values['background-color'] || defaults['background-color'],
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

					var r = data[i];
					var g = data[i + 1];
					var b = data[i + 2];

					var l = lightness( r, b, g );

					var side = l / 255 * size;

					if ( side > min_size && side <= size )
					{
						var half_delta = ( size - side ) / 2;

						items['cam-' + pixel] = {
							pos: vec.create( x + half_delta, y + half_delta ),
							color: values['foreground-color'] || defaults['foreground-color'],
							shape: 'rect',
							width: side,
							height: side
						};
					}

					else
					{
						items['cam-' + i] = undefined;
					}
				}
			}

			return items;
		}

		// http://stackoverflow.com/a/596241/229189
		function lightness( r, g, b )
		{
			return ( r + r + b + g + g + g ) / 6;
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);