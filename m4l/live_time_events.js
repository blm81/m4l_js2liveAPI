/*
	dispatch events from Live to server
*/

inlets = 1;
outlets = 1;

//change in bar or beat
function MeterEvent( name )
{
	var _name = name,
		_prev_value = null;

	this.get_name = function() {
		return this.name;
	}
}

//true if current value is different than previous
MeterEvent.prototype.is_event = function( value )
{
	if ( this._prev_value != null && value != this._prev_value ) {
		this._prev_value = value;
		return true;
	}
	else {
		this._prev_value = value;
		return false;
	}
}

var output = {},
	beat_change = new MeterEvent( "beat_change" ),
	bar_change = new MeterEvent( "bar_change" );

function anything()
{
	var args = arrayfromargs( messagename, arguments );

	//first arg should be the type of input
	switch( args[0] ) { 

		case 'json':

			//first, check if json is valid
			try {
				var json_input = JSON.parse( args[1] );
			}
			catch ( exception ) {
				post( "invalid json: " + exception, '\n' );
			}

			//then, make sure json has "type" and "data" keys
			if ( !json_input.hasOwnProperty( "type" ) || !json_input.hasOwnProperty( "data" ) ) {
				post( "json must contain 'type' and 'data' keys", '\n');
				return
			}

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
					break;
			}

			break; //case 'json'
	}
}