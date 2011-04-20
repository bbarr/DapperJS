var dapper = (function() {
	
	var _libraries, api;
	
	_libraries = {
		detections: {
			jQuery: function() { return typeof jQuery !== 'undefined'; }
		},
		
	}
	_common_detections = {
		
	};
	
	_detect_library = function() {
		
		var name, lib;
		
		for (name in api) {
			lib = api[name];
			if (lib instanceof dapper.Library) { 
				if (lib.detect()) { 
					break;
				}
			}
		}
		
		if (typeof lib.handle === 'undefined') {
			throw new Error('No Library Matched');
		}
		
		return lib;
	}
	
	api = {
		
		use: function(library_name, detection) {
			detection = detection || _common_detections[library_name] || $.noop();
			api[library_name] = new dapper.Library(library_name, detection);
		},

		exec: function(function_name) {
			var lib = _detect_library();
			
			api.handle = function() {
				lib.handle.apply(lib, arguments);
			}
			
			return api.handle.apply(api, arguments);
		}
	}

	return api;
	
})();

dapper.Library = function(name, detection) {
	this.name = name;
	this.detect = detection;
	this.maps = {};
}

dapper.Library.prototype = {
	
	map: function(function_name, handler) {
		this.maps[function_name] = handler;
	},
	
	handle: function(function_name) {
		var map = this.maps[function_name];
		var args = [].slice.call(arguments).slice(1);
		map.apply(this, args);
	}
};