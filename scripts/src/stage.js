/*global define*/
define(
	[ 'vec' ],
	function ( vec )
	{
		var signals;
		var doc;

		var da_circle_yo = {
			pos: vec.create( 39, 203 ),
			rad: 3,
			color: '#000',
			id: 'heh',
			type: 'circle'
		};

		function init( shared )
		{
			signals = shared.signals;
			doc = shared.doc;

			doc.click( mouseMoved );

			signals['instructed'].dispatch( da_circle_yo );
		}

		function mouseMoved( event )
		{
			da_circle_yo.pos = vec.create( event.pageX, event.pageY );

			signals['instructed'].dispatch( da_circle_yo );
		}

		var stage = {
			init: init
		};

		return stage;
	}
);