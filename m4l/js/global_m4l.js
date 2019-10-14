
/* global javascript classes for max for live by Blake McConnell 2013-15
   can be acessed from anywhere in your live set
   make sure you send a "compile" message to this file,
   then to all other js objects to initialize them within live.
   drunk walk function makes use of banksean's implementation of Perlin 
   Simplex noise: https://gist.github.com/banksean/304522.
*/

GM4L = new Global("m4l");
autowatch = 1;
post("global m4l is loaded");

GM4L.GetDateTime = function() {
	var today = new Date();
	var date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return dateTime = date + "::" + time;
}

GM4L.LogToFile = function( msgStr )
{
	messnamed("console", GM4L.GetDateTime() + ": " + msgStr + "\n");
}

//performs a drunk walk, arguments are min and max of output
GM4L.Drunk = function( min_out, max_out ) {
	this.prev_val = ( min_out + max_out ) / 2;
	this.min_out = min_out;
	this.max_out = max_out;
	this.sim_noise = new gp.SimplexNoise();
}
	//arguments set max and min step size
	GM4L.Drunk.prototype.step = function( min_step, max_step ) {
		var current_val,
			today = new Date(),
			today_ms = today.getTime(),
			noise = this.sim_noise.noise( today_ms, today_ms ),
			rand_val = noise * ( max_step - min_step ) + min_step,
			sign = noise && noise / Math.abs( noise );  //TODO move this to its own function
		rand_val = rand_val * sign; 				    //give random val the sign of the seed
		
		//keep values from getting stuck at the edges of range
        if ( rand_val + this.prev_val < this.min_out || rand_val + this.prev_val > this.max_out )
            rand_val = rand_val * -1;
        current_val = rand_val + this.prev_val;
        
        //make sure value does not exceed bounds of range
        if ( current_val < this.min_out )
            current_val = this.min_out;
        else if ( current_val > this.max_out )
            current_val = this.max_out;
        
        this.prev_val = current_val; //keep track of previous value
		return current_val;
	}

	GM4L.Drunk.prototype.setMinOut = function( minOut )
	{
		this.min_out = minOut;
	}

	GM4L.Drunk.prototype.setMaxOut = function( maxOut )
	{
		this.max_out = maxOut;
	}

//implementation of common easing functions
GM4L.Easing = function( total_time, rate, start_val, end_val ) {
	this.total_time = total_time;
	this.rate = rate; //rate of bangs sent to js object
	this.duration = Math.floor(total_time/rate);
	this.counter = (total_time/rate) + 1;
	this.last_map_val = 0;
	this.start_val = start_val;
	this.end_val = end_val;
}
	
	GM4L.Easing.prototype.start = function() {
		this.counter = 0;
	}
	
	//arguments: easing_function(counter/duration, start_val, end_val), end val
	GM4L.Easing.prototype.move = function( easing_function ) {
		var mapped_value;
		if (this.counter < this.duration) {
			mapped_value = easing_function( this.counter / this.duration, this.start_val, this.end_val );
			this.counter ++;
		}
		else if (this.counter == this.duration) {
			mapped_value = this.end_val;
			this.last_map_val = mapped_value;
		}
		else {
			mapped_value = this.last_map_val;
		}
		return mapped_value;
	}
	
	GM4L.Easing.prototype.set_rate = function(new_rate) {
		this.rate = new_rate;
		this.duration = this.total_time/this.rate;
		this.counter = (this.total_time/this.rate) + 1;
	}
	
	GM4L.Easing.prototype.linear = function( t, v1, v2 ) {
  		return v1 + t * (v2 - v1);
	}
	
	GM4L.Easing.prototype.easeIn = function( t, v1, v2 ) {
  		return v1 + (t * t * t) * (v2 - v1);
	}
	
	GM4L.Easing.prototype.easeOut = function( t, v1, v2 ) {
  		return v1 + (((t-1) * (t-1) * (t-1)) + 1) * (v2 - v1);
	}
	
	GM4L.Easing.prototype.easeInOut = function( t, v1, v2 ) {
  		if ((t * 2) < 1) {
    		return v1 + ((t * 2) * (t * 2) * (t * 2)) * (v2 - v1) / 2.0;
		}
  		else {
    		return v1 + ((t * 2 - 2) * (t * 2 - 2) * (t * 2 - 2) + 2) * (v2 - v1) / 2.0;
		}
	}

/* get JSON object containing an array of track objects 
   that each have an array of clip objects */
GM4L.get_song_info = function( api_object ) {

	var song_info = {
		tracks : []
	};

	//get tracks
	api_object.goto( "live_set" );
	var tracks = arrayfromargs( api_object.get( "tracks" ) );
	//loop through half the length as "id" and "number" each have own array index
	for ( var i = 0; i < tracks.length / 2; i++ ) {
		api_object.goto( "live_set tracks " + i );
		//make track object
		var track = {
			index : i,
			name : api_object.get( "name" )[0],
			clips : []
		};

		//get clips
		api_object.goto( "live_set tracks " + i );
		var clips = arrayfromargs( api_object.get( "clip_slots" ) );
		for ( var j =0; j < clips.length / 2; j++ ) {
			api_object.goto( "live_set tracks " + i + " clip_slots " + j );
			
			//check if clip slot actally has a clip, if so, add
			if ( api_object.get( "has_clip" ) == 1 ) {
				api_object.goto( "live_set tracks " + i + " clip_slots " + j + " clip" );
				var clip = {
					index : j,
					name : api_object.get( "name" )[0]
				}
				track.clips.push( clip );
			}
		}
		song_info.tracks.push( track );
	}

	return JSON.stringify( song_info );
}

//change parameters of live devices
GM4L.ParamChange = function( device ) {
	this.devices = device;
	this.parameters = null;
	this.min = 0;
	this.max = 0;
}
	//use parameter list to populate umenu, or print names to console
	GM4L.ParamChange.prototype.list_params = function(api_object) { //pass name of api object
		api_object.goto("this_device canonical_parent devices " + this.devices);
		var args = arrayfromargs( api_object.get ( "parameters" ) );
		var output = {};
		//initialize umenu-loading array with "clear" message
		output.umenu = [ "clear" ];
		output.id_num = [];
		for ( var i = 0; i < args.length; i++ ) {
			//since "get" lists ids with commas between "id" and id #
			//divide by 2 to get total # of params
			if ( i < args.length / 2 ) {
				api_object.goto("this_device canonical_parent devices " + this.devices + " parameters " + i);
				//get parameter name and prepare it for umenu entry
				var param_name = api_object.get( "name" );
				var item = "insert " + i + " " + param_name;
				output.umenu.push( item );
			}
			//get device's numerical id and push to id number array
			if ( i % 2 != 0 ) {
				var param_id = {};
				param_id.index = Math.floor( i / 2 ); //match the index in the umenu array
				param_id.id = args[i];
				output.id_num.push( param_id );
			}
		}
		output = JSON.stringify( output );
		return output;
	}
	
	GM4L.ParamChange.prototype.set_devices = function(device_number) {
		this.devices = device_number;
	}
	
	GM4L.ParamChange.prototype.set_param = function( api_object, param_number ) {
		this.parameters = param_number;
		this.set_bounds( api_object );
	}
	
	//set minimum and maximum value, use for scaling
	GM4L.ParamChange.prototype.set_bounds = function( api_object ) {
		api_object.goto("this_device canonical_parent devices " + this.devices + " parameters " + this.parameters);
		this.min = api_object.get("min");
		this.max = api_object.get("max");
	}
	
	GM4L.ParamChange.prototype.set_value = function(api_object, value) {
		api_object.goto("this_device canonical_parent devices " + this.devices + " parameters " + this.parameters);
		api_object.set("value", value);
	}

/*
	fire a random clip

	@param api_obj		{obj}		api instance
	@param trigger		{string}	cue to trigger clip update
	@param track_num: 	{array} 	track number(s), if multiple, will choose random track
	@param tick_range: 	{array} 	low [0] and high [1] range for fire time
									if only 1 arg, then clip will fire at that interval
	@param out_range: 	{array} 	optional *breaks random track* output range low [0] high [1]
*/
GM4L.RandomFire = function( api_obj, trigger, tracks, tick_range, output_range ) {
	var _counter = 0,
		_ticks,
		_output,
		_trigger = trigger,
		_song_info = null;

	set_all();

	function set_ticks() {
		if ( tick_range[1] === undefined )
			_ticks = tick_range[0];
		else 
			_ticks = random_range( tick_range[0], tick_range[1] );
		post( "ticks set to: ", _ticks );
	}

	function set_track() {
		_track = tracks[ random_range( -1, tracks.length ) ];
		post( "track set to: ", _track );
	}

	function set_output() {
		_output = random_range( output_range[0], output_range[1] );
	}

	function get_trigger() { return _trigger; }

	function set_all() {
		set_ticks();
		set_track();

		var clips_idx,
			str_song_info;

		//if there's an output range specified, choose a random index
		if ( output_range !== undefined )
			set_output();

		//otherwise, get the tracks clips and select a random index from them
		else {

			//make sure that the song info has been aquired
			if ( _song_info === null ) {
				str_song_info = GM4L.get_song_info( api_obj )
				_song_info = JSON.parse( str_song_info );
			}

			//get clips for the current track and set a randomly chosen one as output
			for ( var i = 0, il = _song_info.tracks.length; i < il; i++ ) {
				if ( _song_info.tracks[i].index === _track ) {
					clips_idx = random_range( -1, _song_info.tracks[i].clips.length );
					post( "output track: ", _song_info.tracks[i].clips[ clips_idx ].name, '\n' );
					_output = _song_info.tracks[i].clips[ clips_idx ].index;
				}
			}
		}
	}

	function update() {
		if( _counter === _ticks ) {
			//select and fire clip
			api_obj.goto( "live_set tracks " + _track + " clip_slots " + _output );
			api_obj.call( "fire" );
			//reset for next round
			set_all();
			_counter = 0;
		}
		_counter++;
	}

	//get random int within a specified range
	function random_range( upper, lower ) {
		return Math.floor( Math.random() * ( upper - lower + 1) ) + lower;
	}

	return {
		get_trigger : get_trigger,
		update : update
	}
}

/*js version of transport, still a little wonky
initialize api object: var tempo = api.get("tempo");*/
GM4L.Transport = function(tempo) {
	this.last_bar = 0;
	this.last_beat = 0;
	this.bpm_ms = 60000./tempo;
}
	
	//get current time: api.call("get_current_beats_song_time");
	GM4L.Transport.prototype.beat_bang = function(cur_bt_st) {
		var song_time = cur_bt_st.split(".");
		var beat_change;
			if (song_time[1] !== this.last_beat){ 
				beat_change = true;
				this.last_beat = song_time[1];
			}
			else {
				beat_change = false;
			}
		return beat_change;
	}
	
	GM4L.Transport.prototype.bar_bang = function(cur_bt_st) {
		var song_time = cur_bt_st.split(".");
		var bar_change;
			if (song_time[0] !== this.last_bar){ 
				bar_change = true;
				this.last_bar = song_time[0];
			}
			else {
				bar_change = false;
			}
		return bar_change;
	}
	