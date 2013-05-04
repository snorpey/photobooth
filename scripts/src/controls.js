/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var wrapper = $( '.controls' );
		var control_items = $( '.control-item', wrapper );
		var controls = $( '.control', wrapper );
		var active_controls = [ ];
		var control_ids;

		function init( shared )
		{
			signals = shared.signals;
			control_ids = getControlIds();

			controls.change( controlValueChanged );

			signals[ 'update-controls' ].add( updateControls );
		}

		function controlValueChanged( event )
		{
			var target = $( event.target );
			var id = event.target.id;

			if ( active_controls.indexOf( id ) !== -1 )
			{
				var data = { };

				data[id] = target.val();

				signals['input-updated'].dispatch( data );
			}
		}

		function updateControls( control_ids )
		{
			for ( var i = 0; i < active_controls.length; i++ )
			{
				var id = active_controls[i];

				if ( control_ids.indexOf( id ) === -1 )
				{
					controls
						.filter( '#' + id )
						.closest( '.control-item' )
						.removeClass( 'is-active' );
				}
			}

			active_controls = control_ids;

			for ( var j = 0; j < active_controls.length; j++ )
			{
				var aid = active_controls[j];

				controls
					.filter( '#' + aid )
					.closest( '.control-item' )
					.addClass( 'is-active' );
			}
		}

		function getControlIds()
		{
			var result = [ ];

			for ( var i = 0; i < controls.length; i++ )
			{
				result[i] = controls[i].id;
			}

			return result;
		}

		var ctrl = { init: init };

		return ctrl;
	}
);