/*
	packs Live transport data from Max plugsync~ object
*/

inlets = 1;
outlets = 1;

var transport_obj = { 
	//all possible params, init as null
	'state'			: null, 
	'bar_count'  	: null, 
	'beat_count' 	: null, 
	'ticks_beat' 	: null,
	'time_sig'   	: null,
	'ticks'      	: null,
	'tempo'      	: null, 
	'sample_count' 	: null, 
	'flags'      	: null 
};

function anything()
{
	var args = arrayfromargs( messagename, arguments ),
		valid_arg = 0;

	for ( var i = 0; i < args.length; i += 2 ) {

		//loop through properties
		for ( var prop in transport_obj ) {
			//check that current argument is valid property
			if ( prop === args[i] ) {
				transport_obj[ prop ] = args[ i + 1 ];
				valid_arg++;
			}
		}

		//if current arguement is not valid, log error
		if ( valid_arg === 0 )
			post( args[i] + " is not a valid arg", '\n' );
	}
}

function bang()
{
	//check if any transport parameters are null
	var null_count = 0;
	for ( var prop in transport_obj ) {
		if ( transport_obj[ prop ] === null )
			null_count++;
	}

	//if all parameters are set, output transport object
	if ( null_count === 0 ) {
		outlet( 0, JSON.stringify( transport_obj ) );
	}
	else
		post( "at least one required property is not set", '\n' );
}