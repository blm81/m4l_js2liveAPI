/* 
	set parameters using global m4l ParamChange
*/

var param_change = null;

inlets = 1;

var api = new LiveAPI( "live_set" );

function anything()
{
	var a = arrayfromargs( messagename, arguments );
	//set the device for which to change parameter
	if ( a[0] == "set_device" ) {
		if ( a[1] ) 
			param_change = new GM4L.ParamChange( a[1] );
		else 
			post( "you must specify a device" );
	}
	if ( param_change != null ) {
		switch( a[0] ) {
			//list parameters for current device
			case "list_params":
				var params_obj = JSON.parse( param_change.list_params( api ) )
				for( var i = 0; i < params_obj.umenu.length; i++ )
					outlet( 0, params_obj.umenu[i] );
				break;
			//set the current parameter
			case "set_param":
				if ( a[1] )
					param_change.set_param( api, a[1] );
				else
					post( "set param called with no arguments", '\n' );
				break;
			//set parameter value directly
			case "set_value":
				if ( a[1] )
					param_change.set_value( api, a[1] );
				else
					post( "set value called with no arguments", '\n' );
				break;
			//set parameter value as a percentage
			case "set_percent_value":
				if ( a[1] )
					param_change.set_value( api, map( a[1], 0.0, 1.0, param_change.min, param_change.max ) );
				else 
					post( "normalized set value called with no arguments", '\n' );
				break;
		}
	}
}

//map input range to output range
function map( input, in_min, in_max, out_min, out_max ) {
	if ( input > in_max || input < in_min )
		post( "input is out of range" );
	else
		return ( input - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + parseInt( out_min );
}
	

