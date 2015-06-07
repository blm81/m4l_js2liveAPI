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
	switch( args[0] ) {
		case 'beat_change':
			post( "new beat: " + beat_change.is_event( args[1] ), '\n' );
			break;
		case 'bar_change':
			post( "new beat: " + bar_change.is_event( args[1] ), '\n' );
			break;
	}
}