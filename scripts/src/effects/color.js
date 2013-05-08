/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var supported_inputs = [ 'brightness', 'saturation', 'hue', 'contrast' ];
		var defaults = { 'brightness': 50, 'saturation': 50, 'hue': 0, 'contrast': 50 };
		var tmp_ctx = document.createElement( 'canvas' ).getContext( '2d' );

		function getInstructions( image_data, input )
		{
			var items = { };
			var width = image_data.width;
			var height = image_data.height;
			var copy = copyImageData( image_data );
			var len = copy.data.length;

			var brightness_input = ( input.brightness || defaults.brightness ) * 2 - 100;
			var saturation_input = ( input.saturation || defaults.saturation ) * 2 - 100;
			var contrast_input = ( ( input.contrast || defaults.contrast ) * 2 - 50 ) * 0.02;
			var hue_input = ( input.hue || defaults.hue );

			for ( var i = 0; i < len; i += 4 )
			{
				setBrightness( i, copy.data, brightness_input );
				setSaturation( i, copy.data, saturation_input );
				setContrast( i, copy.data, contrast_input );
				setHue( i, copy.data, hue_input );
			}

			image_data.data.set( copy.data );

			items['buf'] = {
				shape: 'image-data',
				image_data: image_data,
				pos: vec.create( 0, 0 )
			};

			return items;
		}

		function copyImageData( image_data )
		{
			var dst = tmp_ctx.createImageData( image_data.width, image_data.height );
			dst.data.set( image_data.data );
			return dst;
		}

		// https://github.com/meltingice/CamanJS/blob/master/src/lib/filters.coffee
		function setBrightness( index, data, brightness )
		{
			if ( brightness !== 0 )
			{
				var l = Math.floor( 255 * ( brightness / 100 ) );

				data[index] = getConstrainedValue( data[index] + l, 255 );
				data[index + 1] = getConstrainedValue( data[index + 1] + l, 255 );
				data[index + 2] = getConstrainedValue( data[index + 2] + l, 255 );
			}
		}

		function setSaturation( index, data, saturation )
		{
			if ( saturation !== 0 )
			{
				var c = ( saturation / -100 );
				var max = Math.max( data[index], data[index + 1], data[index + 2] );

				for ( var i = 0; i < 3; i++ )
				{
					if ( data[index + i] !== max )
					{
						data[index + i] += getConstrainedValue( ( max - data[index + i] ) * c, max );
					}
				}
			}
		}

		function setContrast( index, data, contrast )
		{
			//if ( contrast !== 0 )
			//{
				for ( var i = 0; i < 3; i++ )
				{
					var value = data[index + i];

					value /= 255;
					value -= 0.5;
					value *= contrast;
					value += 0.5;
					value *= 255;

					data[index + i] = value;
				}
			//}
		}

		function setHue( index, data, hue )
		{
			if ( hue !== 0 )
			{
				var hsv = rgb2hsv( data[index], data[index + 1], data[index + 2] );
				hsv.hue = Math.abs( hsv.hue - hue );

				var rgb = hsv2rgb( hsv );

				data[index] = rgb.r;
				data[index + 1] = rgb.g;
				data[index + 2] = rgb.b;
			}
		}

		function getConstrainedValue( value, max )
		{
			return value > max ? max : value;
		}

		// http://matthaynes.net/blog/2008/08/07/javascript-colour-functions/
		/*function rgb2hsv( r, g, b )
		{
			r = ( r / 255 );
			g = ( g / 255 );
			b = ( b / 255 );

			var min = Math.min( Math.min( r, g ), b ),
				max = Math.max( Math.max( r, g ), b ),
				delta = max - min;

			var value = max,
				saturation,
				hue;

			// Hue
			if ( max === min )
			{
				hue = 0;
			}

			else if ( max === r )
			{
				hue = ( 60 * ( ( g - b ) / ( max - min ) ) ) % 360;
			}

			else if ( max === g )
			{
				hue = 60 * ( ( b - r ) / ( max - min ) ) + 120;
			}

			else if ( max === b )
			{
				hue = 60 * ( ( r - g ) / ( max - min ) ) + 240;
			}

			if ( hue < 0 )
			{
				hue += 360;
			}

			// Saturation
			if ( max === 0 )
			{
				saturation = 0;
			}

			else
			{
				saturation = 1 - ( min/max );
			}

			return {
				h: Math.round( hue ),
				s: Math.round( saturation * 100 ),
				v: Math.round( value * 100 )
			};
		}*/

		// http://matthaynes.net/blog/2008/08/07/javascript-colour-functions/
		/*function hsv2rgb( h, s, v )
		{
			s = s / 100;
			v = v / 100;

			var hi = Math.floor( ( h / 60 ) % 6 );
			var f = ( h / 60 ) - hi;
			var p = v * ( 1 - s );
			var q = v * ( 1 - f * s );
			var t = v * ( 1 - (1 - f ) * s );

			var rgb = [ ];

			switch ( hi ) {
				case 0:
					rgb = [ v, t, p ];
					break;
				case 1:
					rgb = [ q, v, p ];
					break;
				case 2:
					rgb = [ p, v, t ];
					break;
				case 3:
					rgb = [ p, q, v ];
					break;
				case 4:
					rgb = [ t, p, v ];
					break;
				case 5:
					rgb = [ v, p, q ];
					break;
			}

			return {
				r: Math.min( 255, Math.round( rgb[0] * 256 ) ),
				g: Math.min( 255, Math.round( rgb[1] * 256 ) ),
				b: Math.min( 255, Math.round( rgb[2] * 256 ) )
			};
		}*/

		function rgb2hsv( r, g, b )
		{
			var hsv = { };
			var max = Math.max( r, g, b );
			var dif = max - Math.min( r, g, b );

			hsv.saturation = ( max === 0) ? 0 : ( 100 * dif / max );

			if ( hsv.saturation === 0 ){ hsv.hue = 0; }
			else if ( r === max ){ hsv.hue = 60 * ( g - b ) / dif; }
			else if ( g === max ){ hsv.hue = 120 + 60 * ( b - r ) / dif; }
			else if ( b === max ){ hsv.hue = 240 + 60 * ( r - g ) / dif; }
			if ( hsv.hue < 0 ){ hsv.hue += 360; }

			hsv.value = Math.round( max * 100 / 255 );
			hsv.hue = Math.round( hsv.hue );
			hsv.saturation = Math.round( hsv.saturation );
			return hsv;
		}

		function hsv2rgb( hsv )
		{
			var rgb = { };

			if ( hsv.saturation === 0 )
			{
				rgb.r = rgb.g = rgb.b = Math.round( hsv.value * 2.55 );
			}

			else
			{
				hsv.hue /= 60;
				hsv.saturation /= 100;
				hsv.value /= 100;
				var i = Math.floor( hsv.hue );
				var f = hsv.hue - i;
				var p = hsv.value * ( 1 - hsv.saturation );
				var q = hsv.value * ( 1 - hsv.saturation * f);
				var t = hsv.value * ( 1 - hsv.saturation * ( 1 - f ) );

				switch( i )
				{
					case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
					case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
					case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
					case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
					case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
					default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
				}

				rgb.r = Math.round( rgb.r * 255 );
				rgb.g = Math.round( rgb.g * 255 );
				rgb.b = Math.round( rgb.b * 255 );
			}

			return rgb;
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);