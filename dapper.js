var Dapper = (function() {
	
	// private
	var _common_detections, _detect_library;
	
	// public
	var api;
	
	_common_detections = {
		jQuery: function() { return typeof jQuery !== 'undefined'; }
	};
	
	_detect_library = function() {
		
		var name, lib;
		
		for (name in api) {
			lib = api[name];
			if (lib instanceof Dapper.Library) { 
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
		
		detect: function(library_name, detection) {
			detection = detection || Dapper._common_detections[library_name] || $.noop();
			api[library_name] = new Dapper.Library(library_name, detection);
		},

		handle: function(function_name) {
			var lib = _detect_library();
			api.handle = lib.handle;
			return api.handle.apply(api, arguments);
		}
	}
	
	return api;
})();

Dapper.Library = function(name, detection) {
	this.name = name;
	this.detect = detection;
	this.maps = [];
}

Dapper.Library.prototype = {
	
	map: function(function_name, handler) {
		this.maps[function_name] = handler;
	},
	
	handle: function(function_name) {
		var map = this.maps[function_name];
		var args = [].slice.call(arguments).slice(1);
		map.apply(this, args);
	}
};
