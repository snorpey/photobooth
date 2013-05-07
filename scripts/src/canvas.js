/*global define, $*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var wrapper = $( '.center-wrapper' );
		var canvas = $( '#homescreen' );
		var ctx = canvas[0].getContext( '2d' );
		var is_clearing = true;
		var not_clearing_effects = [ 'glitch' ];
		var size;

		function init( shared )
		{
			signals = shared.signals;
			signals['draw'].add( draw );
			signals['cam-started'].add( activateCanvas );
			signals['capture'].add( sendCapture );
			signals['effect-updated'].add( updateClearing );

			updateCanvasSize( { width: 640, height: 480 } );

			canvas.click( canvasClicked );
		}

		function canvasClicked( event )
		{
			event.preventDefault();

			signals['capture'].dispatch();
		}

		function updateCanvasSize( new_size )
		{
			canvas.attr( new_size );
			size = new_size;
		}

		function updateClearing( effect_name )
		{
			is_clearing = not_clearing_effects.indexOf( effect_name ) === -1;
		}

		function draw( instructions )
		{
			if ( is_clearing )
			{
				clear();
			}

			for ( var key in instructions )
			{
				if (
					typeof instructions[key] === 'object' &&
					instructions[key].updated
				)
				{
					drawByInstruction( instructions[key], ctx );
				}
			}
		}

		function drawByInstruction( obj, ctx )
		{
			if ( obj.updated )
			{
				if ( typeof obj === 'object' )
				{
					if ( obj.shape === 'line' )
					{
						drawLine( obj, ctx );
					}

					if ( obj.shape === 'circle' )
					{
						drawCircle( obj, ctx );
					}

					if ( obj.shape === 'rect' )
					{
						drawRect( obj, ctx );
					}

					if ( obj.shape === 'image-data' )
					{
						drawData( obj, ctx );
					}

					if ( obj.shape === 'image' )
					{
						drawImage( obj, ctx );
					}
				}
			}
		}

		function drawCircle( c, ctx )
		{
			if ( typeof c === 'object' )
			{
				ctx.beginPath();
				ctx.arc( c.pos.elements[0], c.pos.elements[1], c.rad, 0, Math.PI * 2, true );
				ctx.closePath();
				ctx.fillStyle = c.color;
				ctx.fill();
			}
		}

		function drawLine( l, ctx )
		{
			if ( typeof l === 'object' )
			{
				ctx.beginPath();
				ctx.lineWidth = l.width;
				ctx.strokeStyle = l.color;
				ctx.moveTo( l.points[0].pos.elements[0], l.points[0].pos.elements[1] );
				ctx.lineTo( l.points[1].pos.elements[0], l.points[1].pos.elements[1] );
				ctx.stroke();
				ctx.closePath();
			}
		}

		function drawRect( r, ctx )
		{
			if ( typeof r === 'object' )
			{
				ctx.fillStyle = r.color;
				ctx.fillRect( r.pos.elements[0], r.pos.elements[1], r.width, r.height );
				ctx.fill();
			}
		}

		function drawData( d, ctx )
		{
			ctx.putImageData( d.image_data, d.pos.elements[0], d.pos.elements[1] );
		}

		function drawImage( d, ctx )
		{
			//d.image.onload = function() {
			ctx.drawImage( d.image, d.pos.elements[0], d.pos.elements[1] );
			//};
		}

		function clear( obj )
		{
			if ( size )
			{
				var clr = obj || { x: 0, y: 0, width: size.width, height: size.height };

				ctx.clearRect( clr.x, clr.y, clr.width, clr.height );
			}
		}

		function activateCanvas()
		{
			wrapper.addClass( 'is-active' );
		}

		function getImageUrlFromCanvas()
		{
			return canvas[0].toDataURL( 'image/png' );
		}

		function sendCapture()
		{
			var src = getImageUrlFromCanvas();

			signals['canvas-img'].dispatch( src );
		}

		var canvas_manager = {
			init: init
		};

		return canvas_manager;
	}
);