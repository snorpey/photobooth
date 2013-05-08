/*global define*/
define(
	[
		'src/effects/circles',
		'src/effects/cubes',
		'src/effects/pixelate',
		'src/effects/stripes-1',
		'src/effects/stripes-2',
		'src/effects/glitch-jpg',
		'src/effects/color'
	],
	function (
		circlesFx,
		cubesFx,
		pixelateFx,
		stripes1Fx,
		stripes2Fx,
		glitchFx,
		colorFx
	)
	{
		var signals;

		var effects = {
			pixelate: pixelateFx,
			cubes: cubesFx,
			circles: circlesFx,
			stripes1: stripes1Fx,
			stripes2: stripes2Fx,
			glitch: glitchFx,
			color: colorFx
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
				var instructions = effect.fx( data, input_values );

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