/*
	load JSON configuration text (.txt) file
*/

inlets = 1;
outlets = 1;

//load external text file (with .txt extension)
function load_file( file_path ) 
{
	var ret_val = "";

	//max-specific variables
	filename = file_path;
	access = "readwrite";
	typelist = new Array("iLaF" , "maxb" , "TEXT" );

	//loop through file and add contents to return string
	file = new File( filename, access, typelist );

	while( file.isopen && file.position < file.eof ){
		ret_val += file.readline().trim(); //trim whitespace and special chars
	}

	file.close();

	return ret_val;
}

function anything()
{
	var args = arrayfromargs( messagename, arguments );

	switch( args[0] ) {
		case 'read':
			//output json from config file
			outlet( 0, load_file( args[1] ) );
			break;
	}
}