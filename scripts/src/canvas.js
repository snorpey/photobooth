/*global define, $*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var canvas = $( '#homescreen' );
		var ctx = canvas[0].getContext( '2d' );
		var size;

		function init( shared )
		{
			signals = shared.signals;

			signals['resized'].add( resized );
			signals['draw'].add( draw );
		}

		function resized( size )
		{
			updateCanvasSize( size );
		}

		function updateCanvasSize( new_size )
		{
			canvas.attr( new_size );
			size = new_size;
		}

		function draw( instructions )
		{
			//clear();

			for ( var key in instructions )
			{
				if ( typeof instructions[key] === 'object' )
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
					if ( obj.type === 'line' )
					{
						drawLine( obj, ctx );
					}

					if ( obj.type === 'circle' )
					{
						drawCircle( obj, ctx );
					}

					if ( obj.type === 'rect' )
					{
						drawRect( obj, ctx );
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

		function clear( obj )
		{
			if ( size )
			{
				var clr = obj || { x: 0, y: 0, width: size.width, height: size.height };

				ctx.clearRect( clr.x, clr.y, clr.width, clr.height );
			}
		}

		var canvas_manager = {
			init: init
		};

		return canvas_manager;
	}
);