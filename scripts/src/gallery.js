/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var wrapper = $( '.center-wrapper' );
		var gallery = $( '.gallery' );
		var item_count = $( '.gallery-item' ).length;
		var images = $( '.gallery-image' );
		var canvas = $( '#homescreen' );
		var current_index = 0;

		// todo: add keyboard nav

		function init( shared )
		{
			signals = shared.signals;

			signals['canvas-img'].add( addCanvasImage );
			images.click( imageClicked );
			canvas.click( moveToStart );
			shared.doc.keydown( keyUpped );
		}

		function keyUpped( event )
		{
			if ( item_count > 0 )
			{
				if ( event.which === 37 )
				{
					moveWrapperToIndex( current_index - 1 );
					event.preventDefault();
				}

				if ( event.which === 39 )
				{
					moveWrapperToIndex( current_index + 1 );
					event.preventDefault();
				}
			}
		}

		function addCanvasImage( src )
		{
			var item_html = '';

			item_count++;

			item_html += '<li class="gallery-item gallery-item-' + item_count + ' is-loading">';
			item_html +=     '<img class="gallery-image" src="' + src + '" alt="photobooth image ' + item_count + '" />';
			item_html +=     '<a class="gallery-download button" href="' + src + '" target="_blank" download="photobooth-image-' + item_count + '.png">download</a>';
			item_html += '</li>';

			gallery.prepend( item_html );

			$( '.gallery-item-' + item_count ).removeClass( 'is-loading' );

			images = $( '.gallery-image' );
			images.click( imageClicked );

			updateWrapperWidth();
		}

		function imageClicked( event )
		{
			event.preventDefault();

			var target = $( event.target );
			var target_index = target.closest( '.gallery-item' ).index();

			moveWrapperToIndex( target_index );
		}

		function moveWrapperToIndex( index )
		{
			var image = images.eq( index );

			if ( image.length )
			{
				var offset = images.eq( index ).closest( '.gallery-item' ).position().left;

				moveWrappperTo( offset );
				current_index = index;
			}

			if ( index === -1 )
			{
				moveToStart();
			}
		}

		function moveWrappperTo( new_left )
		{
			wrapper.css( 'margin-left', -340 - new_left );
		}

		function updateWrapperWidth()
		{
			var new_width = ( images.length + 1 ) * 675;
			wrapper.width( new_width );
		}

		function moveToStart()
		{
			moveWrappperTo( 0 );
		}

		var g = { init: init };

		return g;
	}
);