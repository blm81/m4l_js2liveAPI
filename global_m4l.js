/* global javascript classes for max for live by Blake McConnell 2013
   can be acessed from anywhere in your live set
   make sure you send a "compile" message to this file,
   then to all other js objects to initialize them within live.
   drunk walk function makes use of banksean's implementation of Perlin 
   Simplex noise: https://gist.github.com/banksean/304522.
*/

g = new Global("m4l");

//performs a drunk walk, arguments are min and max of output
g.Drunk = function(min_out, max_out) {
	this.prev_val = (min_out + max_out)/2;
	this.min_out = min_out;
	this.max_out = max_out;
}
	//arguments set max and min step size
	g.Drunk.prototype.step = function(min_step, max_step) {
		sim_noise = new gp.SimplexNoise();
		var new_val;
		var rand_val = sim_noise.noise(1., 1.) * (max_step - min_step + 1) + max_step;
		if (rand_val + this.prev_val > this.min_out && rand_val + this.prev_val < this.max_out) {
			new_val = rand_val + this.prev_val;
		}
		else {
			rand_val = rand_val * -1;
			new_val = rand_val + this.prev_val;
		}
		if (new_val < this.min_out) {
			new_val = min_out;
		}
		else if (new_val > this.max_out) {
			new_val = max_out;
		}
		this.prev_val = new_val;
		return new_val;
	}

//implementation of common easing functions
g.Easing = function(total_time, rate) {
	this.total_time = total_time;
	this.rate = rate; //rate of bangs sent to js object
	this.duration = Math.floor(total_time/rate);
	this.counter = (total_time/rate) + 1;
	this.last_map_val = 0;
	
	this.start_motion = function() {
		this.counter = 0;
	}
	//set start val and end val
	this.set_start_val = function(start_val) {
		var sv = start_val;
		return sv;
	}
	
	this.set_end_val = function(end_val) {
		var ev = end_val;
		return ev;
	}
	
	//arguments: easing_function(counter/duration, start_val, end_val), end val
	this.move = function(easing_function, end_val) {
		var mapped_value;
		if (this.counter < this.duration) {
			var mapped_value = easing_function;
			this.counter ++;
		}
		else if (this.counter == this.duration) {
			mapped_value = end_val;
			this.last_map_val = mapped_value;
		}
		else {
			mapped_value = this.last_map_val;
		}
		return mapped_value;
	}
	
	this.set_rate = function(new_rate) {
		this.rate = new_rate;
		this.duration = this.total_time/this.rate;
		this.counter = (this.total_time/this.rate) + 1;
	}
	
	this.linear = function( t, v1, v2 ) {
  		return v1 + t * (v2 - v1);
	}
	
	this.easeIn = function( t, v1, v2 ) {
  		return v1 + (t * t * t) * (v2 - v1);
	}
	
	this.easeOut = function( t, v1, v2 ) {
  		return v1 + (((t-1) * (t-1) * (t-1)) + 1) * (v2 - v1);
	}
	
	this.easeInOut = function( t, v1, v2 ) {
  		if ((t * 2) < 1) {
    		return v1 + ((t * 2) * (t * 2) * (t * 2)) * (v2 - v1) / 2.0;
		}
  		else {
    		return v1 + ((t * 2 - 2) * (t * 2 - 2) * (t * 2 - 2) + 2) * (v2 - v1) / 2.0;
		}
	}
}

/*js version of transport, still a little wonky
initialize api object: var tempo = api.get("tempo");*/
g.Transport = function(tempo) {
	this.last_bar = 0;
	this.last_beat = 0;
	this.bpm_ms = 60000./tempo;
	
	//get current time: api.call("get_current_beats_song_time");
	this.beat_bang = function(cur_bt_st) {
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
	
	this.bar_bang = function(cur_bt_st) {
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
}	