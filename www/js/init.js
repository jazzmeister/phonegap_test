var bottle = new Bottle();

bottle.service('api', function() { 
	return {
		getUrl: function(serviceName) { 
			// POST cache problem with iOS6
			var currentTime = new Date();
			var cacheBuster = currentTime.getTime();
	        return oeConstants.baseUrl + serviceName + '?cacheBuster=' + cacheBuster;
		}
	};
});
