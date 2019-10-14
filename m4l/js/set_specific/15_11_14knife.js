/*
	listen for clips being triggered
*/

inlets = 1;
outlets = 1;

//60 / BPM * 100 = ms => BPM
var barMs = ( 4 * ( 60000 / 133 )),
	easing = new GM4L.Easing( barMs, 30, 0, 100 );

post( "bar ms: " + barMs + " duration: " + easing.duration + '\n' );

function anything()
{
	var jsonIn,
		easedVal,
		argArr = arrayfromargs( messagename, arguments );

	switch ( argArr[0] ) {

		case 'move':
			easedVal = easing.move( easing.easeIn );
			if ( easedVal !== 0 && easedVal !== 100 ) {
				post( "move: " + easing.move( easing.easeIn ) + '\n' );
			}
			break;

		case 'start':
			easing.start();
			break;

		case 'clip_event':
			//post( argArr[1] + '\n' );

			jsonIn = JSON.parse( argArr[1] );

			if ( jsonIn.data.event === "clip_on" && jsonIn.data.name === "knife" ) {
				easing.start();
			}
			/*post( "json data event: " + jsonIn.data.event + '\n' );
			if ( jsonIn.data.event == "clip_on" ) {
				var randNum = random_range( -1, 5 );
				outlet( 0, notes[ randNum ]);
			}*/
			break;
	}
}

function random_range( upper, lower ) {
	return Math.floor( Math.random() * ( upper - lower + 1) ) + lower;
}