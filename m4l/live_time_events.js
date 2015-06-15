/*
	dispatch events from Live to server
*/

inlets = 1;
outlets = 1;

//change in bar or beat
function MeterEvent( name )
{
	var _name = name,
		_prev_value = null,
		_callback = null;

	function get_name() {
		return this.name;
	}

	function set_callback( callback ) {
		_callback = callback;
	}

	//returns true if current value is different than previous
	function is_event( value ) {
		if ( this._prev_value != null && value != this._prev_value ) {
			this._prev_value = value;
			if ( _callback !== null ) {
				_callback();
			}
			return true;
		}
		else {
			this._prev_value = value;
			return false;
		}
	}

	return {
		get_name : get_name,
		set_callback : set_callback,
		is_event : is_event
	}
}

//returns true is "type" and "data" keys found in input JSON
function check_keys( json_input ) {
	if ( !json_input.hasOwnProperty( "type" ) || !json_input.hasOwnProperty( "data" ) ) {
		post( "json must contain 'type' and 'data' keys", '\n');
		return false;
	}
	return true;
}

var output = {},
	beat_change = MeterEvent( "beat_change" ),
	bar_change = MeterEvent( "bar_change" );

function anything()
{
	var args = arrayfromargs( messagename, arguments );

	//first arg should be the type of input
	switch( args[0] ) { 
		case 'json':

			//first, check if json is valid
			try {
				var json_input = JSON.parse( args[1], function ( key, value ) {
				if ( value && ( typeof value === 'string' ) && value.indexOf( "function" ) === 0 ) {
				    // we can only pass a function as string in JSON ==> doing a real function
				    var func = new Function('return ' + value)();
        			return func;
				}
				      
				return value;
				});
			}
			catch ( exception ) {
				post( "invalid json: " + exception, '\n' );
				return;
			}

			//then, make sure json has "type" and "data" keys
			if ( !check_keys( json_input ) )
				return;

			//evaluate the json
			switch( json_input.type ) {

				//transport object
				case 'transport':
					var transport_obj = json_input.data;
					//beat change event check
					if ( beat_change.is_event( transport_obj.beat_count ) )
						outlet(0, "beat_change" );
					//bar change event check
					if ( bar_change.is_event( transport_obj.bar_count ) )
						outlet(0, "bar_change" );
					break; //case 'transport'

				//external configuration
				case 'config':
					var obj_array = json_input.data;
					//loop through array of objects where data = the callback function
					for ( var i in obj_array ) {

						//make sure each object has "type" and "data" keys
						if ( !check_keys( obj_array[i] ) )
							continue;

						switch( obj_array[i].type ) {
							//set meter event callbacks
							case 'bar_callback':
								bar_change.set_callback( obj_array[i].data );
								break;
							case 'beat_callback':
								beat_change.set_callback( obj_array[i].data );
								break;
						}
					}
					break; //case 'config'
			}

			break; //case 'json'
	}
}