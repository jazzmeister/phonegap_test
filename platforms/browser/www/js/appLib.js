var appLib = {
	isPhoneGap: function() {			
		try {
			return !_.isUndefined(device.cordova);				
		} catch(err) {
		}
		
		return false;
	},
							
	
	alert: function(message /* :string */, alertCallback /* ?:function */, title /* ?:string */, buttonLabel /* ?:string */) {									
		if(_.isUndefined(alertCallback))
			alertCallback = function() { };
		
		if(_.isUndefined(title))
			title = 'Information';
			
		if(_.isUndefined(buttonLabel))
			buttonLabel = 'OK';
		
		this.debugLog('ALERT: ' + message + ' [' + title + ']');
	
		if(this.isPhoneGap())			
			navigator.notification.alert(message, alertCallback, title, buttonLabel);
		else {					
			alert(message);
			alertCallback();
		}
	},
				
	
	confirm: function(message /* :string */, confirmCallback /* ?:function */, title /* ?:string */, buttonLabels /* ?:string */) {
		if(_.isUndefined(confirmCallback))			
			confirmCallback = function() { };					//## Pointless use of confirm!
			
		if(_.isUndefined(title))
			title = '';
			
		if(_.isUndefined(buttonLabels))
			buttonLabels = ['Yes','No'];
		else
			buttonLabels = buttonLabels.split(',');
	
		this.debugLog('DIALOG: ' + message + ' [' + title + ']');

		if(this.isPhoneGap())
			navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
		else {					
			var result = confirm(message);
			confirmCallback(result ? 1 : 2);
		}
	},


	prompt: function(message /* :string */, onSuccess /* ?:function */, title /* ?:string */, buttonLabels /* ?:string */, defaultText /* ?:string */) {			
		if(_.isUndefined(onSuccess))			
			onSuccess = function() { };					//## Pointless use of prompt!
			
		if(_.isUndefined(title))
			title = '';
			
		if(_.isUndefined(buttonLabels))
			buttonLabels = ['OK','Cancel'];
		else
			buttonLabels = buttonLabels.split(',');

		if(_.isUndefined(defaultText))
			defaultText = '';
	
		this.debugLog('PROMPT: ' + message + ' [' + title + ']' + (defaultText.length > 0 ? ' {Default Text: ' + defaultText + '}' : ''));


		if(this.isPhoneGap())
			navigator.notification.prompt(message, onSuccess, title, buttonLabels, defaultText);
		else {					
			var result = prompt(message, defaultText);			
			onSuccess({ 
				buttonIndex: (result === null ? 2 : 1), 
				input1: result 
			});
		}
	},
	

	//## e.g. appLib.showPopup('questionTagPopup', oeTemplate.get('QuestionTagsTemplate'), { tagCount: 2, tagHtml: '' }, $.noop);
	showPopup: function(popupId, templateHtml, templateVars, onComplete /* ?:function */) {
		var popup = $('#' + popupId);
        var createPopup = (popup.length === 0);
        
        if (createPopup) {
            //## Add the popup markup to the current page
            $('[data-role=content]').first().append('<div data-role="popup" id="' + popupId + '" data-overlay-theme="a" class="ui-content" style="border:2px solid rgb(42, 110, 187);"></div>');
            popup = $('#' + popupId);
        } else {
            //## Empty existing popup
            popup.empty();
        }

        var template = _.template(templateHtml);
        popup.append(template(templateVars));        

        if(createPopup)
            popup.popup({ history: false });
                     
        popup.popup('open', { y:0 });   

        if(!_.isUndefined(onComplete))
        	onComplete();
	},


	//## Show 'toast' notification - modified version of: https://gist.github.com/kamranzafar/3136584
	toast: function(message /* :string */) {
		var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><h3>' + message + '</h3></div>');

	    $toast.css({
	        display: 'block', 
	        background: '#555555',
			color: 'white',
	        opacity: 0.90, 
	        position: 'fixed',
	        paddingBottom: '10px',
	        'text-align': 'center',
	        width: '270px',
	        left: ($(window).width() - 284) / 2,
	        top: ($(window).height() / 3) * 2 - 20
	    });

	    var removeToast = function(){
	        $(this).remove();
	    };

	    $toast.click(removeToast);

	    $toast.appendTo($.mobile.pageContainer).delay(2000);
	    $toast.fadeOut(400, removeToast);
	},

	
	//##TODO: Test on PhoneGap
	isOnline: function() {
		if(this.isPhoneGap())
			return (navigator.network.connection.type != Connection.NONE && navigator.network.connection.type != Connection.UNKNOWN);
		else
			return true;
	},
	
	
	maskUI: function(showMask) {		
		if(showMask)
			$('#block-ui').show();
		else
			$('#block-ui').hide();
	},
	
	isUIMasked: function() {
		return $('#block-ui').is(':visible');
	},


	//## Populates a ddlb with options (of type { id, text })
	fillDropDown: function(dropDownId, options, optionPrefix, optionSuffix) {
		$('#' + dropDownId).empty();

		_.each(options, function (item) {
			var attr = '';

			//## Is the option selected?
			if (!_.isUndefined(item.selected) && item.selected)
				attr = ' selected="selected" ';

			$('#' + dropDownId).append('<option value="' + item.id + '" ' + attr + '>' + optionPrefix + item.text + optionSuffix + '</option>');
		});	
	},



	//## Sorts and then populates a ddlb with options (of type { id, text })
	sortAndFillDropDown: function(dropDownId, options) {
		var sortedOptions = _.sortBy(options, function(item) {
			return item.text.toLowerCase();  
		});

		this.fillDropDown(dropDownId, sortedOptions, '', '');
	},


	//## Populates a ddlb with options (of type { id, text & more }) using templateHtml 
	//## e.g. templateHtml = 'data-examDate=<%= examDate %>' will produce: '<option value="$id" data-examDate="$examDate">$text</option>'
	fillTemplatedDropDown: function(dropDownId, options, templateHtml) {
		$('#' + dropDownId).empty();

		var template = _.template('<option value="<%= id %>" <%= attr %> ' + templateHtml + '><%= text %></option>');

		_.each(options, function (item) {
			item.attr = '';

			//## Is the option selected?
			if (!_.isUndefined(item.selected) && item.selected)
				item.attr = ' selected="selected" ';

			$('#' + dropDownId).append(template(item));
		});		 		
	},
	

	//## Get unique device id, Format: [GUID]-[DEVICE]#[OS VERSION]#[APP VERSION]   e.g. 33464622-c584-5daa-cd1c-d68efd103408-iphone#6.0#1.7.6
	getDeviceId: function(appVersion) {                
		//## Has an ID been generated and saved?
		var id = window.localStorage.getItem('oeguid');
		if(id == null) {
			//## No - create and save an ID with device and OS version
			id = (this.createGuid() + '-' + this.getDevice() + '#' + this.getDeviceVersion()).substring(0, 50);
			window.localStorage.setItem('oeguid', id);
			
			this.log('---> Generating new device id: ' + id);
		} else {                    					
			//## Does the device id contain OS version number?
			if(id.indexOf('#') < 0) {
				//## No - append OS version number and save
				id = (id + '#' + this.getDeviceVersion()).substring(0, 50);
				window.localStorage.setItem('oeguid', id);
				this.log('---> Updated device id to: ' + id);
			}
			
			this.log('---> Using existing device id: ' + id);
		}

		//## Append the app version to the device id (but don't save it)
		return id + '#' + appVersion;
	},
	
	
	//## Get device the app is running on
	getDevice: function() {
		if(!this.isPhoneGap())
			return 'web';
		
		var d = device.platform.toLowerCase();                

		if(d.indexOf('ios') >= 0) {
			var model = device.model.toLowerCase();
		
			if(model.indexOf('iphone') >= 0) {
				d = 'iphone';
			} else if(model.indexOf('ipad') >= 0) {
				d = 'ipad';
			} else if(model.indexOf('ipod') >= 0) {
				d = 'ipod';
			}
		} else if(d.indexOf('android') >= 0) {
			d = 'android';
		} else {
			d = 'unknown';
		}
			
		return d;
	},
	
	
	//## Returns string (e.g. '4.1.1')
	getDeviceVersion: function() {
		if(!this.isPhoneGap())
			return '1.0';
			
		return device.version.toLowerCase();
	},
	
	
	//## Returns int (e.g. 4)
	getDeviceMajorVersion: function() {
		var version = this.getDeviceVersion().split('.');
		
		if(version[0].length < 1 || !appLib.isInt(version[0]))
			return -1;
						
		return parseInt(version[0]);
	},
	
	
	//## Generate GUID
	createGuid: function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	

	_debugLog: '',	
	debugLog: function(msg) {
		this._debugLog = msg + '\n' + this._debugLog;

		//console.log('DEBUGLOG: ' + msg);

		try {
			this._debugLog = '## Net: ' + navigator.connection.type + ' @ ' + new Date().getTime() + '\n' + this._debugLog;			
		} catch(e) {			
			//## Ignore error
		}

		if(this._debugLog.length > 20000) {
			//## Max log size of 20k
			this._debugLog = this._debugLog.substring(0, 20000);
		}
	},

	getDebugLog: function() {
		return this._debugLog;
	},

	//## Log debug info to console, variable or no where
	log: function(msg, style) {
		if(true) {
			
		 	if(style)
				console.log('%c' + msg, style);
			else
			 	console.log(msg);
			
			if (typeof msg === 'string' && msg.indexOf('{') < 0)
		 		this.debugLog('LOG: ' + msg);	 				 	 
		}
	},
	
	
	//## Tracks pages in google analytics
	track: function(event) {                
		appLib.log('TRACK: ' + event);
		appLib.debugLog('EVENT: ' + event); 

		try {
			analytics.trackPage(function() { appLib.log('GA track page success'); }, function() { appLib.log('GA track page failed'); }, '/' + event);
		} catch(e) {			
			//alert(JSON.stringify(e, null, 4));
		}
	},
	

	//## Tracks events in google analytics: Category > Action > Label 
	trackEvent: function(category /* :string */, action /* :string */, label /* :string */, value /* ?:number */) {		
		try {
			if (typeof value === 'undefined') { value = 0; }

			appLib.log('TRACK-EVENT: ' + category + ' > ' + action + ' > ' + label + ' (' + value + ')');

			analytics.trackEvent(
				function() { appLib.log('GA track event success'); }, 
				function() { appLib.log('GA track event failed'); }, category, action, label, value);
		} catch(e) {			
			//alert(JSON.stringify(e, null, 4));
		}		
	},


	//## Sets a variable that's sent with subsequent calls to .track()
	setTrackVariable: function(id, value) {
		appLib.log('TRACK VAR: ' + id + ' = ' + value, 'color:yellow; background-color:blue;');
		appLib.debugLog('EVENT VAR: ' + id + ' = ' + value);

		try {
			analytics.setVariable(
				function() { appLib.log('GA track variable ' + id + ' success'); }, 
				function() { appLib.log('GA track variable ' + id + ' failed'); },
				id, value);
		} catch(e) {						
		}
	},


	//## Open (and track) link in external browser
	openLink: function(url)	{
		window.open(url, '_system');

		appLib.track('open-link ' + url);
	},
	
	openAppStore: function() {
		appLib.openLink(appLib.getDevice() == 'android' ? 'market://details?id=com.bmjgroup.onexamination' : 'itms-apps://itunes.apple.com/app/id544289965');
	},
	
	
	//## Ask the user to rate the app. If goToStore is true then go straight to the app store for review
	rateApp: function(goToStore) {
		if(!this.isPhoneGap()) {
			appLib.alert('On mobile "Rate App" dialog appears here');
			return;
		}
									
		if(goToStore) {						
			this.openAppStore();			
		} else {
			var rateAppCallback = function(index) {
				if(index == 1) {
					//## Yes
					this.openAppStore();
				} else if(index == 2) {
					//## No
				} else {
					//## Never
				}
			};
			
			appLib.confirm('If you enjoy using the BMJ OnExam app, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!', rateAppCallback, 'Rate BMJ OnExam', 'Yes,No,Never');
		}			
	},
	
	
	//## Indicates if a value is an integer or can be safely converted to one
	isInt: function(value) {
		if ((undefined === value) || (null === value)) {
			return false;
		}
		return value % 1 === 0;
	},
	
	
	//## Decodes a URL. e.g. 'http%3a%2f%2fwww.aafp.org%2fafp%2f20030701%2f93.html' to http://www.aafp.org/afp/20030701/93.html
	urlDecode: function(encodedUrl) {
		return decodeURIComponent((encodedUrl+'').replace(/\+/g, '%20'));
	},
	
	
	//## Saves data (to a file named 'data{key}.txt')
	saveData: function(key, data, onSuccess, onFailure) {
		//##TODO: Create HTML5 version
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				appLib.log('got file system');
			
				fileSystem.root.getFile('data' + key + '.txt', {create: true, exclusive: false}, function(dataFile) {
						appLib.log('got file');
				
						dataFile.createWriter(function(writer) {
								writer.onwrite = function(evt) {
									appLib.log(evt);
									appLib.log('saveData successful ' + writer.length);
									onSuccess();
								};
								
								writer.write(data);
							},
							function(evt) {
								appLib.log('saveData error: ' + evt.target.error.code);
								onFailure();
							}
						);
					
					},
					onFailure
				);
			},
			onFailure
		);
	},
	
	
	//## Loads data (from a file named 'data{key}.txt')
	loadData: function(key, onSuccess, onFailure) {
		//##TODO: Create HTML5 version
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				appLib.log('got file system');
				
				fileSystem.root.getFile('data' + key + '.txt', {create: true}, function(dataFile) {
						appLib.log('got file');
						
						dataFile.file(function(targetFile) {
								try {
									//## Force use of phonegap filereader as iOS6 implements a native filereader
									var FileReader = cordova.require('cordova/plugin/FileReader');
									// $FlowFixMe: FlowType should ignore the next line as it works in Cordova, but isn't technically valid JS
									var reader = new FileReader();
									
									reader.onloadend = function(evt) {
										appLib.log('loadData successful');
										appLib.log(evt.target.result);
										onSuccess(evt.target.result);
									};
									
									reader.readAsText(targetFile);
								} catch(ex) {
									appLib.log(ex);
								}
							},
							function(error) {
								appLib.log('loadData error: ' + error.code);
								onFailure();
							}
						);
					},
					onFailure
				);
			},
			onFailure
		);
	},
	
	
	//## Downloads url to specified filename (in the root folder)
	downloadFile: function(url, filename, onSuccess, onFailure) {
		appLib.log('Downloading ' + url);
	
		try {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(fileSystem) {
					appLib.log('Got FS');						
							
							
					function onGetFileSuccess(fileEntry) {
						appLib.log('onGetFileSuccess!');
						var path = fileEntry.toURL().replace('dummy.html', '');
						var fileTransfer = new FileTransfer();
						fileEntry.remove();
						
						fileTransfer.download(
							url,
							path + filename,
							function(file) {
								appLib.log('download complete: ' + file.toURL());
								onSuccess(url, file.toURL());
							},
							function(error) {
								appLib.log('download error source ' + error.source);
								appLib.log('download error target ' + error.target);
								appLib.log('upload error code: ' + error.code);

								onFailure('download error source ' + error.source);
							}
						);
					}
							
							
					fileSystem.root.getFile(
						'dummy.html',
						{create: true, exclusive: false},
						onGetFileSuccess,
						onFailure
					);
					
					/*
					fileSystem.root.getDirectory('files', 
						{ create:true }, 
						function(folder) {																				
							var fullPath = folder.fullPath + '/' + filename;																
							appLib.log('FS: ' + fullPath);
							
							var fileTransfer = new FileTransfer();
							fileTransfer.download(url, 
												  fullPath, 
												  function() { 
													appLib.log('Download ok');
													onSuccess(url, fullPath); 
												  },
												  onFailure);
						},
						onFailure);
						*/
				},
				onFailure);
		} catch(ex) {
			appLib.log('caught: ' + ex);
			onFailure();
		}
	},
	
	//## Returns style to hide element if it should not be displayed
	cssDisplay: function(show) { 
		return (show ? '' : 'display:none;');
	},
	
	selectDate: function(options, onSuccess, onCancel) {
		if(this.isPhoneGap()) {
			datePicker.show(options, onSuccess, onCancel);
		} else {
			//## Non phonegap - Random day in the next 3 months (approx)
			var d = new Date();
			d.setDate(d.getDate() + (Math.random() * 90));

			return onSuccess(d);
		}
	},

	getFormattedDate: function(d) {
		//var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
	},


	/* s = seconds 
	   e.g. formatTimer(30) = "00:00:30"
	*/
	formatTimer: function(s /* :number */) {		
	    var seconds = Math.floor(s);
	    var hours = Math.floor(seconds / 3600);

	    seconds -= hours * 3600;	    
	    var minutes = Math.floor(seconds / 60);
	    seconds -= minutes * 60;

	    if (hours < 10)
	    	hours   = '0' + hours;

	    if (minutes < 10) 
	    	minutes = '0' + minutes;

	    if (seconds < 10) 
	    	seconds = '0' + seconds;

	    return hours + ':' + minutes + ':' + seconds;
	},

	//## Allows sharing data via other apps on device
	//## onSuccess({ app (iOS only) }) 
	//## onFailure(error)
	socialShare: function(subject, message, url, onSuccess, onFailure) {
		if(!this.isPhoneGap()) {
			if(window.prompt(subject, message + ' (' + url + ')') === null) {
				onFailure('User stopped share');
			} else {
				onSuccess();
			}

			return;
		}

		try {			
            var options = {              
				subject: subject,
				message: message,              
				url: url,
				chooserTitle: 'Share via...' 
            };
                                                   
            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onFailure);

        } catch (ex) {
            onFailure(ex);
        }
	},

	niceList: function(items, separator, limit /* :number? */, listOf /* :string? */) {
		if(items == null)
			return '';
		else if(items.length === 0)
	    	return '';
	  	else if(items.length === 1)
		    return items[0];
		else if(items.length === 2)
			return items[0] + ' ' + separator + ' ' + items[1];
		else {
			//## Is limit defined?
			if (typeof limit === 'undefined') { limit = 999; }

			if(items.length <= limit)
		    	return _.initial(items).join(', ') + ', ' + separator + ' ' + _.last(items);

		    
		    if (typeof listOf === 'undefined') { listOf = 'items'; }

    		var text = '';
			for(var i = 0; i < limit - 1; i++) {
				text += items[i] + ', ';
			}

	    	return text + separator + ' ' + (items.length - i) + ' ' + listOf;			    
		}
	},

	
	right: function(str /* :string */, numChars /* :number */) {
		if(str.length <= numChars)
			return str;

		return str.substr(str.length - numChars);
	}
};
