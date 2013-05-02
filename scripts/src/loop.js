/*global define, $, requestAnimationFrame, cancelAnimationFrame*/
define(
	function()
	{
		var signals;
		var animation_id = NaN;
		var is_looping = false;

		function init( shared )
		{
			signals = shared.signals;

			startLoop();
		}

		function startLoop()
		{
			is_looping = true;
			animation_id = requestAnimationFrame( update );
		}

		function update()
		{
			signals['looped'].dispatch();

			if ( is_looping )
			{
				startLoop();
			}
		}

		function stopLoop()
		{
			is_looping = false;
			cancelAnimationFrame( animation_id );
			animation_id = NaN;
		}

		var loop = {
			init: init
		};

		return loop;
	}
)