/*global define*/
define(
	function()
	{
		var signals;
		var instructions = { };
		var types = [ 'string', 'number' ];

		function init( shared )
		{
			signals = shared.signals;

			signals['instructed'].add( updateInstruction );
			signals['looped'].add( drawInstructions );
		}

		function updateInstruction( obj )
		{
			if (
				typeof obj === 'object' &&
				typeof obj.id !== 'undefined'
			)
			{
				var id = obj.id;
				var updated = false;

				if ( instructions[id] )
				{
					for ( var key in instructions[id] )
					{
						if (
							key !== 'id' &&
							key !== 'updated'
						)
						{
							var new_value = obj[key];

							if ( types.indexOf( typeof new_value ) !== -1 )
							{
								updated = true;
								instructions[id][key] = new_value;
							}
						}
					}

					instructions[id].updated = updated;
				}

				else
				{
					if ( typeof obj === 'object' )
					{
						addInstruction( id, obj );
					}

					else
					{
						removeInstruction( id );
					}
				}
			}
		}

		function addInstruction( id, obj )
		{
			instructions[id] = obj;
		}

		function removeInstruction( id )
		{
			instructions[id] = undefined;
		}

		function drawInstructions()
		{
			signals['draw'].dispatch( instructions );
		}

		var i = {
			init: init
		};

		return i;
	}
);