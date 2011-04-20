(function() {
	
	dapper.detect('jQuery');
	
	dapper['jQuery'].map('a_function', function() {
		jQuery('body').html('some text from jquery');
	});
	
	dapper.handle('a_function');
	
})();