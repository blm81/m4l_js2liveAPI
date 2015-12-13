/*
	listen for clips being triggered
*/

inlets = 1;
outlets = 2;

var trackObserver = new LiveAPI( clipTriggerListener, "this_device canonical_parent" );
trackObserver.property = "playing_slot_index";

function clipTriggerListener( args )
{
	/** output object : 
		type = String
		data object : event = String
			slotNum : num, number of playing slot
	*/				 
	var objOut = {
			type : "clip_event",
			data : {}
		},
		argArr = arrayfromargs( args );

	//index 1 is the track number
	switch( argArr[1] ) {
		
		//-2 for clip off
		case -2: 
			post( "clip off" + '\n' );
			objOut.data.event = "clip_off";
			outlet( 1, "bang" );
			break;
		default:
			post( "clip on: " + argArr[1] + '\n' );
			objOut.data.event = "clip_on";
			objOut.data.slotNum = argArr[1];
			outlet( 0, argArr[1] );
			break;
	}
	//receiver name : clip event
	messnamed( 'clip_event', JSON.stringify( objOut ));
}