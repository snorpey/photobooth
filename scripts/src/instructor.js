/*global define*/
define(
	function()
	{
		var signals;
		var instructions = { };
		var valid_value_types = [ 'string', 'number' ];
		var valid_shapes = [ 'rect', 'circle', 'line' ];
		var reserved_keys = [ 'updated' ];
		var flush = false;

		function init( shared )
		{
			signals = shared.signals;

			signals['instructed'].add( checkInstructions );
			signals['looped'].add( drawInstructions );
			signals['input-updated'].add( flushInstructions );
		}

		function checkInstructions( obj )
		{
			if ( flush )
			{
				instructions = { };

				flush = false;
			}

			for ( var id in obj )
			{
				if ( isValidInstruction( obj[id] ) )
				{
					if ( instructions[id] )
					{
						updateInstruction( id, obj[id] );
					}

					else
					{
						addInstruction( id, obj[id] );
					}
				}

				else
				{
					removeInstruction( id );
				}
			}
		}

		function updateInstruction( id, obj )
		{
			var updated = false;

			for ( var key in obj )
			{
				var new_value = obj[key];

				if ( valid_value_types.indexOf( typeof new_value ) !== -1 )
				{
					updated = true;
					instructions[id][key] = new_value;
				}
			}

			instructions[id].updated = updated;
		}

		function addInstruction( id, obj )
		{
			instructions[id] = obj;
			instructions[id].updated = true;
		}

		function removeInstruction( id )
		{
			instructions[id] = undefined;
		}

		function flushInstructions()
		{
			flush = true;
		}

		function drawInstructions()
		{
			signals['draw'].dispatch( instructions );
		}

		function isValidInstruction( obj )
		{
			return ( typeof obj === 'object' && valid_shapes.indexOf( obj.shape ) !== -1 );
		}

		var i = {
			init: init
		};

		return i;
	}
);