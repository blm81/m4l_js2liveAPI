/*
	listen for clips being triggered
*/

inlets = 1;
outlets = 2;

var trackObserver = new LiveAPI( clipTriggerListener, "this_device canonical_parent" );
trackObserver.property = "playing_slot_index";

function clipTriggerListener( args )
{
	var argArr = arrayfromargs( args );

	//index 1 is the track number
	switch( argArr[1] ) {
		
		//-2 for clip off
		case -2: 
			post( "clip off" + '\n' );
			outlet( 1, "bang" );
			break;
		default:
			post( "clip on: " + argArr[1] + '\n' );
			outlet( 0, argArr[1] );
			break;
	}
}