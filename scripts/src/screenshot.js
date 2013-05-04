/*global define*/
define(
	[ 'jquery' ],
	function ( $ )
	{
		var signals;
		var button = $( '#screenshot-button' );

		function init( shared )
		{
			signals = shared.signals;

			button.click( buttonClicked );
		}

		function buttonClicked( event )
		{
			event.preventDefault();

			signals['capture'].dispatch();
		}

		var s = { init: init };

		return s;
	}
);