/*
	dispatch events from Live to server
*/

inlets = 1;
outlets = 1;

var availableEvents = {
	beat_callback : function() {
		var msgOut = {
			type : "time_ev",
			data : "beat"
		};
		messnamed( "time_ev", JSON.stringify( msgOut ));
	},
	bar_callback : function() { 
		var msgOut = {
			type : "time_ev",
			data : "bar"
		};
		messnamed( 'time_ev', JSON.stringify( msgOut ));
	}
}

//change in bar or beat
function MeterEvent( name, callback )
{
	var _name = name,
		_prev_value = null,
		_callback = callback;

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
			else {
				post("cb is null" + "\n");
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
	beat_change = null,
	bar_change = null;

function anything()
{
	var args = arrayfromargs( messagename, arguments );

	//first arg should be the type of input
	switch( args[0] ) { 
		case 'json':
			var jsonInput;
			//first, check if json is valid
			try {
				var jsonInput = JSON.parse( args[1] );
			}
			catch ( exception ) {
				post( "invalid json: " + exception, '\n' );
				return;
			}

			//then, make sure json has "type" and "data" keys
			if ( !check_keys( jsonInput ) )
				return;

			var dataObj = jsonInput.data;
			//evaluate the json
			switch( jsonInput.type ) {
				//transport object
				case 'transport':
					//beat change event check
					if ( beat_change !== null && beat_change.is_event( dataObj.beat_count ))
						outlet(0, "beat_change" );
					//bar change event check
					if ( bar_change !== null && bar_change.is_event( dataObj.bar_count ))
						outlet(0, "bar_change" );
					break; //case 'transport'

				//external configuration
				case 'config':
					//loop through array of objects where data = the callback function
					for ( var i = 0, il = dataObj.length; i < il; i++ ) {
						//make sure each object has "type" and "data" keys
						/*if ( !check_keys( obj_array[i] ) )
							continue;*/

						switch( dataObj[i].type ) {
							//set meter event callbacks
							case 'bar_callback':
								bar_change = MeterEvent( "bar_change", availableEvents.bar_callback );
								break;
							case 'beat_callback':
								beat_change = MeterEvent( "beat_change", availableEvents.beat_callback );
								break;
						}
					}
					break; //case 'config'
			}
			break; //case 'json'
	}
}