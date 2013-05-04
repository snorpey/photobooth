/*global define*/
define(
	[ 'src/effects/cubes' ],
	function( cubesFx )
	{
		var signals;
		var effects = { cubes: cubesFx };
		var active_effect = 'cubes';
		var effect = effects[active_effect];
		var input_values = { };

		function init( shared )
		{
			signals = shared.signals;

			effectActivated( 'cubes' );
			signals['cam-data'].add( gotCamData );
			signals['input-updated'].add( updateValues );
		}

		function effectActivated( id )
		{
			active_effect = id;
			effect = effects[active_effect];

			signals['update-controls'].dispatch( effect.input );
		}

		function gotCamData( data )
		{
			if ( typeof effect === 'object' )
			{
				var instructions = effect.fx( data.data, data.width, data.height, input_values );
				signals['instructed'].dispatch( instructions );
				signals['instructed'].dispatch( instructions );
			}
		}

		function updateValues( obj )
		{
			for ( var key in obj )
			{
				input_values[key] = obj[key];
			}
		}

		var fx = {
			init: init
		};

		return fx;
	}
);