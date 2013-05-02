/*globals require, define*/
define(
	[ 'sylvester' ],
	function( sylvester )
	{
		function create( x, y )
		{
			return sylvester.Vector.create( [ x, y, 0 ] );
		}

		var vector = { create: create };

		return vector;
	}
);