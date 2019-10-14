/*
	keeps track of and sorts notes being played
	intended to drive live resonator
*/

inlets = 1;
outlets = 4;

var rootNote,
	chordNotes = [];

function anything()
{
	var a = arrayfromargs( messagename, arguments );

	switch( a[0] ) {

		case "note_event":
			//notes including and above middle C
			if ( a[1] >= 60 ) {
				if ( a[2] > 0 ) {
					chordNotes.push( a[1] );
					chordNotes.sort();
					post( "chord notes: " + chordNotes + '\n' );
					outputNotes( chordNotes, false );
				}
				else { 
					chordNotes.splice( chordNotes.indexOf( a[1] ), 1 );
				}
			}
			//notes below middle C
			else {
				if ( a[2] > 0 ) {
					rootNote = a[1];
					post( "root note: " + rootNote + '\n' );
					outputNotes( rootNote, true );
				}
			}
			break;
	}
}

/**
	output note values to correct outlets
	0 is root
	1-3 are chord notes with 1 being lowest
*/
function outputNotes( notes, bIsRoot ) 
{
	if ( bIsRoot ) {
		outlet( 0, notes );
	}
	else {
		for ( var i = 0, il = notes.length; i < il; i++ ) {
			outlet( i + 1, notes[i] );
		}
	}
}