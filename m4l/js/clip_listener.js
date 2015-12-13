/*
	listen for clips being triggered
*/

inlets = 1;
outlets = 1;

var trackObserver = new LiveAPI( clipTriggerListener, "this_device canonical_parent" );
trackObserver.property = "playing_slot_index";

function clipTriggerListener( args )
{
	var argArr = arrayfromargs( args );

	//index 1 is the track number
	switch( argArr[1] ) {
		
		//-2 for clip off
		case -2: 
			post( "track off" + '\n' );
			break;
		default:
			post( "track on: " + argArr[1] + '\n' );
			break;
	}
}