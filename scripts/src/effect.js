/*global define*/
define(
	[
		'src/effects/waterfall',
		'src/effects/pixelate',
		'src/effects/cubes',
		'src/effects/circles',
		'src/effects/circles-2',
		'src/effects/stripes-1',
		'src/effects/stripes-2',
		'src/effects/stripes-3'
	],
	function (
		waterfallFx,
		pixelateFx,
		cubesFx,
		circlesFx,
		circles2Fx,
		stripes1Fx,
		stripes2Fx,
		stripes3Fx
	)
	{
		var signals;

		var effects = {
			waterfall: waterfallFx,
			pixelate: pixelateFx,
			cubes: cubesFx,
			circles: circlesFx,
			circles2: circles2Fx,
			stripes1: stripes1Fx,
			stripes2: stripes2Fx,
			stripes3: stripes3Fx
		};

		var active_effect = 'cubes';
		var effect = effects[active_effect];
		var input_values = { };

		function init( shared )
		{
			signals = shared.signals;

			signals['cam-data'].add( gotCamData );
			signals['input-updated'].add( updateValues );
			signals['effect-updated'].add( effectActivated );
		}

		function effectActivated( name )
		{
			if ( effects[name] )
			{
				active_effect = name;
				effect = effects[name];

				signals['update-controls'].dispatch( effect.input );
			}
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

		var fx = { init: init };

		return fx;
	}
);