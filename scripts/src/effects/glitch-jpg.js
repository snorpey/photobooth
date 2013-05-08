/*global define*/
define(
	[ 'vec' ],
	function( vec )
	{
		var supported_inputs = [ 'glitch-seed', 'glitch-iterations', 'glitch-quality' ];
		var defaults = { 'seed': 20, 'glitch-iterations': 20, 'glitch-quality': 20 };

		var tmp_canvas = document.createElement( 'canvas' );
		var tmp_ctx = tmp_canvas.getContext( '2d' );

		var size = { width: 10, height: 10 };

		var base64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		var base64_map = base64_chars.split( '' );
		var reverse_base64_map = { };

		var jpg_header_length;

		base64_map.forEach( function( val, key ) { reverse_base64_map[val] = key; } );

		function getInstructions( image_data, input )
		{
			var items = { };
			var width = image_data.width;
			var height = image_data.height;
			var glitch_seed = ( input['glitch-seed'] || defaults['glitch-seed'] ) / 100;
			var glitch_quality = ( input['glitch-quality'] || defaults['glitch-quality'] ) / 100;
			var glitch_iterations = ( input['glitch-iterations'] || defaults['glitch-iterations'] ) / 10;

			updateCanvasSize( width, height );

			var base64 = getBase64FromImageData( image_data, glitch_quality );
			var data = base64ToByteArray( base64 );
			var jpg_header_length = getJpegHeaderSize( data );

			for ( var i = 0; i < glitch_iterations; i++ )
			{
				glitchJpegBytes( data, jpg_header_length, glitch_seed );
			}

			var img = new Image();

			img.src = byteArrayToBase64( data );

			items['buf'] = {
				shape: 'image',
				image: img,
				pos: vec.create( 0, 0 )
			};

			return items;
		}

		function updateCanvasSize( width, height )
		{
			var updated = false;

			if ( size.width !== width ) { size.width = width; updated = true; }
			if ( size.height !== height ) { size.height = height; updated = true; }

			if ( updated )
			{
				tmp_canvas.width = width;
				tmp_canvas.height = height;
			}
		}

		function glitchJpegBytes( data, jpg_header_length, seed, iteration )
		{
			var index = Math.floor( jpg_header_length + Math.random() * ( data.length - jpg_header_length - 4 ) );
			data[index] = Math.floor( seed * 256 );
		}

		function getBase64FromImageData( image_data, quality )
		{
			var q = typeof quality === 'number' && quality < 1 && quality > 0 ? quality : 0.1;
			tmp_ctx.putImageData( image_data, 0, 0 );
			return tmp_canvas.toDataURL( 'image/jpeg', q );
		}

		function getJpegHeaderSize( data )
		{
			var result = 417;

			for ( var i = 0, l = data.length; i < l; i++ )
			{
				if ( data[i] === 0xFF && data[i + 1] === 0xDA )
				{
					result = i + 2;
					break;
				}
			}

			return result;
		}

		// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html
		// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes
		function base64ToByteArray( str )
		{
			var result = [ ];
			var digit_num;
			var cur;
			var prev;

			for ( var i = 23, l = str.length; i < l; i++ )
			{
				cur = reverse_base64_map[ str.charAt( i ) ];
				digit_num = ( i - 23 ) % 4;

				switch ( digit_num )
				{
					// case 0: first digit - do nothing, not enough info to work with
					case 1: // second digit
						result.push( prev << 2 | cur >> 4 );
						break;
					case 2: // third digit
						result.push( ( prev & 0x0f ) << 4 | cur >> 2 );
						break;
					case 3: // fourth digit
						result.push( ( prev & 3 ) << 6 | cur );
						break;
				}

				prev = cur;
			}

			return result;
		}

		function byteArrayToBase64( arr )
		{
			var result = [ 'data:image/jpeg;base64,' ];
			var byte_num;
			var cur;
			var prev;

			for ( var i = 0, l = arr.length; i < l; i++ )
			{
				cur = arr[i];
				byte_num = i % 3;

				switch ( byte_num )
				{
					case 0: // first byte
						result.push( base64_map[ cur >> 2 ] );
						break;
					case 1: // second byte
						result.push( base64_map[(prev & 3) << 4 | ( cur >> 4 ) ] );
						break;
					case 2: // third byte
						result.push( base64_map[ ( prev & 0x0f ) << 2 | ( cur >> 6 ) ] );
						result.push( base64_map[ cur & 0x3f ] );
						break;
				}

				prev = cur;
			}

			if ( byte_num === 0 )
			{
				result.push( base64_map[ ( prev & 3 ) << 4 ] );
				result.push( '==' );
			}

			else if ( byte_num === 1 )
			{
				result.push( base64_map[ ( prev & 0x0f ) << 2 ] );
				result.push( '=' );
			}

			return result.join( '' );
		}

		function getImageDataCopy( image_data )
		{
			var copy = tmp_ctx.createImageData( image_data.width, image_data.height );
			copy.data.set( image_data.data );
			return copy;
		}

		return { fx: getInstructions, input: supported_inputs };
	}
);