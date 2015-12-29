/*
	generates an eased ramp of a specified duration
	destination value is generated via drunk walk number generator
*/

inlets = 1;
outlets = 1;

var centerVal = 0.9,		//center value of total output range
	lastVal = centerVal,
	range = 0.2,			//total output range
	rate = 30,				//rate / duration are in milliseconds
	duration = 1000,
	drunk = new GM4L.Drunk( centerVal - ( range / 2 ), centerVal + ( range / 2 )),
	easing = new GM4L.Easing( duration, rate );

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		//start ramp
		case "start":
			easing.start_val = lastVal;
			easing.end_val = drunk.step( 0.01, 0.05 ); //TODO set this dynamically
			lastVal = easing.end_val;
			easing.start();
			break;

		case "set_center_val":
			if ( a[1] ) {
				centerVal = a[1];
				resetDrunk();
			}
			else {
				post( "you must supply an argument to set center value" );
			}
			break;

		case "set_range":
			if ( a[1] ) {
				range = a[1];
				resetDrunk();
			}
			else {
				post( "you must supply an argument to set the range" );
			}
			break;
	}
}

function bang()
{
	easedVal = easing.move( easing.easeIn );
	if ( easing.end_val && easedVal !== easing.end_val ) {
		outlet( 0, easedVal );
	}
}

function resetDrunk()
{
	drunk.setMinOut( centerVal - ( range / 2 ));
	drunk.setMaxOut( centerVal + ( range / 2 ));
}