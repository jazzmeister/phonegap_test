//## ----------------- SHARED VIEWS

//## Backbone views have a horrible inheritance setup, so this is a quick hack to share rating / feedback functionality across answer views
var AnswerViewMixin = {
    addCommonEvents: function(view) {

        //## Question Rating (Stars) changed
        view.questionRatingChanged = function(event, rating) {
            appLib.log('rating changed to: ' + rating);

            var qid = $('.answerPage').data('qid');
            oe.setQuestionRating(qid, rating);
            
            appLib.trackEvent('Question Answer', 'Question Rated', rating,  qid);
        };


        //## Question Feedback - scroll to show textbox when it receives focus
        view.scrollToFeedback = function() {
            $('#questionFeedbackGroup').css('padding-bottom', '400px');        
            window.scrollTo(0, $('#questionFeedbackHeader')[0].offsetTop - 40);
        };

        //## Question Feedback - save question feedback the user entered
        view.saveFeedback = function() {        
            var feedback = $('#questionFeedback').val();        
            var qid = $('.answerPage').data('qid');

            appLib.log('feedback: ' + feedback);
            oe.setQuestionFeedback(qid, feedback);

            appLib.trackEvent('Question Answer', 'Question Feedback', feedback.length, qid);

            if(appLib.getDevice() === 'android') {
                StatusBar.hide();            
            }
        };


        //## Answer view for Notification question can have a "Start New Revision Session" button
        view.newSession = function() {            
            app.trigger('login');
        };

        //## Answer view for Notification question has a "Continue Challenge" / "Continue Previous Session" button
        view.continueSession = function() {
            app.trigger('questionBrowser');
        };



        //## Bind events
        if(_.isUndefined(view.events)) {
            view.events = {};
        }

        view.delegateEvents(_.extend(view.events, {
            'star-rating:changed': 'questionRatingChanged',
            'focus #questionFeedback': 'scrollToFeedback',
            'focusout #questionFeedback': 'saveFeedback',
            'click #newSession': 'newSession',
            'click #continueSession': 'continueSession'
        }));        
    }    
};

var TagControlMixin = {
    addEvents: function(view) {
        view.showTagDialog = function() {   
            var currentQid = oe.questionBank.at(oe.currentSession().get('questionIndex')).get('id');
            var tags = oe.getTagsForQuestion(currentQid);
            
            appLib.showPopup('questionTagPopup', 
                oeTemplate.get('QuestionTagsTemplate'), 
                {                     
                    userTags: _.filter(tags, function(tag) { return !tag.IsGlobal; }),
                    globalTags: _.filter(tags, function(tag) { return tag.IsGlobal; }),
                    qid: currentQid
                },
                function() {                     
                    $("#questionTagPopup").trigger("create");

                    appLib.trackEvent('Question Tags', 'Dialog Opened', tags.length + ' existing tag(s)', currentQid);
                });
        };

        view.reloadTagDialog = function() {
            appLib.log('reloadTagDialog');

            $('#questionTagPopup').popup('close');
            this.showTagDialog();
        };

        //## Bind events
        if(_.isUndefined(view.events)) {
            view.events = {};
        }

        view.delegateEvents(_.extend(view.events, {
            'click #showTagDialog': 'showTagDialog',
            'custom-reload #questionTagPopup': 'reloadTagDialog'            
        }));
    },

    template: _.template(oeTemplate.get('QuestionContentFooterTemplate'))    
};


var NotificationQuestionViewMixin = {
    processQuestionViewModel: function(session, viewModel) {        
        viewModel.sessionType = session.get('sessionType');

        if(session.get('sessionType') === 'notification') {
            viewModel.contentEnd = '';
            viewModel.footer = '';

            if(viewModel.view === 'answer') {
                //## Remove notification sessions in order to correctly decide if a real (non notification) session is in progress
                SessionManager.clearNotificationSessions();

                var sessionStatus = SessionManager.getSessionStatus();

                if(sessionStatus.hideContinueSession) {
                    viewModel.contentEnd = '<button id="newSession" data-theme="d" data-shadow="false">Start New Revision Session</button>';
                } else {
                    var text = (sessionStatus.challengeInProgress ? 'Continue Challenge' : 'Continue Previous Session');
                    viewModel.contentEnd = '<button id="continueSession" data-theme="d" data-shadow="false">' + text + '</button>';
                }
            }            
        }
    }
};



//## ----------------- VIEWS
var SessionManager = {
    getSessionStatus: function() { 
        return { 
            hideContinueSession: (oe.sessions.length === 0),
            challengeInProgress: (oe.getChallengeData() !== null)
        };
    },

    clearNotificationSessions: function() {
        try {
            appLib.log('Sessions pre: ' + JSON.stringify(oe.sessions).split('{').join('<').split('}').join('>'));

            //## Remove notification question sessions as they will cause issue with the 'continued' assessment session
            var notificationSessions = oe.sessions.filter(function(s) { return s.get('sessionType') == 'notification'; });
            oe.sessions.remove(notificationSessions);

            appLib.log('Sessions post: ' + JSON.stringify(oe.sessions).split('{').join('<').split('}').join('>'));
        } catch(e) {
            appLib.debugLog('Error during clearNotificationSessions() - ' + e);
        }
    }
};


//## Home
var HomeView = Backbone.View.extend({
    template: _.template(oeTemplate.get('HomeTemplate')),
	
    render: function(eventName) {
        appLib.debugLog('HomeView.render()');

        SessionManager.clearNotificationSessions();        
        var sessionStatus = SessionManager.getSessionStatus();

		var html = this.template({ 
            continueButtonText: (sessionStatus.challengeInProgress ? 'Continue Challenge' : 'Continue Previous Session'),
            continueButtonStyle: appLib.cssDisplay(!sessionStatus.hideContinueSession),
            challengeButtonStyle: appLib.cssDisplay(!oe.isLoggedIn())
        });
        $(this.el).html(html);		
        
        if(oe.isLoggedIn()) {
            _.delay(this.checkForChallenges, 500, this);
        }

        return this;
    },

    events: {
        "click #newSessionButton": "newSession",
        "click #continueSessionButton": "continueSession",
        "click #receievedChallengeButton": "receievedChallenge"
    },


    checkForChallenges: function(context) {
        
        var onSuccess = function(challenges) {
            var count = challenges.length;

            appLib.log(count + ' challenge(s) waiting');

            //## If a challenge is in progress then remove it from the list
            var challengeInProgress = oe.getChallengeData();
            if(challengeInProgress !== null && challengeInProgress.type == 'user') {
                //## Remove the in progress challenge from the list
                if(!_.isUndefined(_.find(challenges, function(item) { return item.ChallengeId == challengeInProgress.challengeId; }))) {
                    appLib.log('challenge is in progress');
                    count--;
                }
            }

            if(count > 0) {
                $('#waitingChallenges .ui-btn-text').text('You have ' + count + ' challenge' + (count === 1 ? '' : 's') + ' waiting');
                $('#waitingChallenges').show();
            }
        };

        oe.getChallenges(onSuccess, jQuery.noop, false);
    },

    newSession: function() {
        appLib.trackEvent('Home', 'Start New Revision Session', '');
        app.trigger('login');
    },

    continueSession: function() {
        appLib.trackEvent('Home', $('#continueSessionButton').text(), '');
        app.trigger('questionBrowser');
    },

    receievedChallenge: function() {
        appLib.trackEvent('Home', 'Received a challenge?', '');
        app.trigger('receievedChallenge');
    }
});




//========================================================================================

//## App Update
var AppUpdateView = Backbone.View.extend({
    template: _.template(oeTemplate.get('AppUpdateTemplate')),
	
    render: function(eventName) {				
        $(this.el).html(this.template());		
                                    
        return this;
    },
	
	events: {
		"click #appUpdate": "appUpdate"		
	},
	
	appUpdate: function() {
		appLib.openAppStore();
	}
});




//========================================================================================

//## Receieved Challenge
var ReceievedChallengeView = Backbone.View.extend({
    template: _.template(oeTemplate.get('ReceivedChallengeTemplate')),
    
    render: function(eventName) {               
        $(this.el).html(this.template());       
                                    
        return this;
    },
    
    events: {
        "click #startAssessment": "startChallenge",     
        "click #login": "login"     
    },
    

    startChallenge: function() {
        var challengeData = oe.getChallengeData();        
        var challengeInProgress = (challengeData !== null);
        var msg = '';

        var email = $('#email').val().trim();
        if(email.length < 3 || email.indexOf('@') < 1) {
            msg = 'Please enter a valid email address';
            appLib.alert(msg);
            appLib.trackEvent('Received Challenge', 'Validation Error', msg);
            return;

        } else if($('#pin').val().trim().length < 1) {
            msg = 'Please enter a PIN';
            appLib.alert(msg);
            appLib.trackEvent('Received Challenge', 'Validation Error', msg);

            return;
        }

        if(challengeInProgress) {
            if(challengeData.type === 'guest' && challengeData.pin === $('#pin').val().trim()) {
                msg = 'This challenge is already in progess. To continue it press "Home" and then "Continue Challenge".';
                appLib.alert(msg);
                appLib.trackEvent('Received Challenge', 'Validation Error', msg);

                return;
            }

            appLib.confirm('You have a challenge in progress.\n\nAre you sure you wish to lose these answers and start another challenge instead?',
                             this.downloadChallenge,
                             'Abandon Challenge?',
                             'Yes,No');
            return;
        }

        this.downloadChallenge(1);
    },

    downloadChallenge: function(buttonIndex) {
        if(buttonIndex != 1) {
            return;
        }

        var email = $('#email').val().trim();
        var pin = $('#pin').val().trim();

        oe.downloadAssessmentChallengeForGuest(email, pin, function() {
            oe.setGuestChallengeData(email, pin);

            appLib.track('guest-challenge-' + pin);
            appLib.trackEvent('Received Challenge', 'Start Assessment', 'Challenge PIN: ' + pin);

            app.trigger('startQuestions', false, false);
        });
    },

    login: function() {
        appLib.trackEvent('Received Challenge', 'Sign in to see your challenges', '');

        app.trigger('loginRequired', 'home');        
    }
});



//========================================================================================

//## List Challenges
var ListChallengesView = Backbone.View.extend({
    template: _.template(oeTemplate.get('ListChallengesTemplate')),
    
    render: function(eventName) {               
        this.listChallenges();

        $(this.el).html(this.template());       
                                    
        return this;
    },
    
    events: {   
        "click #selectChallenge": "startChallenge"
    },

    listChallenges: function() {
        var onSuccess = function(challenges) {
            if(challenges.length < 1)
                return;
           

            var options = _.map(challenges, function (item) {
                var dt = new Date(parseInt(item.Requested.substr(6)));                

                return { 
                    id: item.ChallengeId,
                    text: item.Name + " (" + appLib.getFormattedDate(dt) + ")"
                };
            });

            var challengeInProgress = oe.getChallengeData();
            if(challengeInProgress !== null && challengeInProgress.type == 'user') {
                //## Remove the in progress challenge from the list
                options = _.filter(options, function(item) { 
                        return item.id != challengeInProgress.challengeId;
                    });
            }

            appLib.fillDropDown('challengeList', options, '', '');
        };

        oe.getChallenges(onSuccess, 
                        function() { 
                            appLib.alert('Unable to download your challenges', jQuery.noop, 'List Challenges');
                        },
                        true);
    },

    startChallenge: function() {                
        if(oe.isSessionInProgress()) {
            appLib.confirm('You have a session in progress.\n\nAre you sure you wish to lose these answers and start the challenge instead?',
                             this.downloadChallenge,
                             'Abandon Session?',
                             'Yes,No');
            return;
        }

        appLib.trackEvent('Challenges', 'Start Challenge', '');

        this.downloadChallenge(1);
    },

    downloadChallenge: function(buttonIndex) {
        if(buttonIndex != 1) {
            return;
        }


        var challengeId = $('#challengeList').find(':selected').val();

        oe.downloadAssessmentChallenge(challengeId, function() {
            oe.setOnExamUserChallengeData(challengeId);

            appLib.track('user-challenge-' + challengeId);
            app.trigger('startQuestions', false, false);
        });
    }

});




//========================================================================================

//## Settings	
var SettingsView = Backbone.View.extend({
    template: _.template(oeTemplate.get('SettingsTemplate')),

    render: function(eventName) {		
		var sessionState = 'Session is not logged in';
		var sessionStyle = '';
        var sessionActive = false;
		
		try {
			var sessionExpires = parseInt(oe.auth.get('tokenExpires').replace(/\/Date\((-?\d+)\)\//, '$1'));
			if(sessionExpires > new Date().getTime()) {
				sessionState = 'Session is logged in';
				sessionStyle = 'color:green;';
                sessionActive = true;
			} else {
				sessionState = 'Session login has expired';
				sessionStyle = 'color:red;';
			}
		} catch(e) { }
	
        $(this.el).html(this.template({ 
			version: oeConstants.version + (oe.isMinified() ? '' : ' <span style=\'color:red;\'>(Dev. Build)</span>'),
			sessionState: sessionState,
			sessionStyle: sessionStyle,
            sessionActive: sessionActive,
            notificationsEnabled: pushNotification.permission.isGranted(),
            isMinified: oe.isMinified(),
            allowBetaMode: oeBeta.allowBetaMode && !oeBeta.isBetaMode
		}));
        return this;
    },
	
	
	events: {
		"click #clearSignIn": "clearSignIn",
		"click #rateApp": "rateApp",
        "click #showLog": "showLog",
        "click #testNotificationQuestion": "testNotificationQuestion",
        "click #enableBetaMode": "enableBetaMode",
	},
	
	clearSignIn: function() {                                          
		var session = oe.currentSession();
	
		if(session != null && session.hasAnswersToUpload())
			appLib.confirm('You have answers to upload.\n\nAre you sure you wish to lose these answers and Log Out?',
							 this.clearSignInConfirmation,
							 'Log Out',
							 'Yes,No');
		else
			appLib.confirm('Are you sure you wish to Log Out?',
							 this.clearSignInConfirmation,
							 'Log Out',
							 'Yes,No');										 
	},
			
	
	clearSignInConfirmation: function(buttonIndex) {
		if(buttonIndex == 1) {
			//## Reset everything!
			oe.reset();
			
            appLib.trackEvent('Settings', 'Log Out', '');

			appLib.alert('You have been Logged Out successfully', function() { app.trigger('home'); });
		}
	},
	
	rateApp: function() {
        appLib.trackEvent('Settings', 'Rate this app', '');

		appLib.rateApp(true);
	},

    showLog: function() {
        var log = appLib.getDebugLog();

        appLib.trackEvent('Settings', 'Technical Support', '');

        //$('.appInfo').html('<h1>Log</h1><textarea style="width:90%;height:200px;margin-bottom:200px;">' + log + '</textarea>');        
        //window.open('mailto:jjones@bmj.com?subject=BMJ%20onExam%20App%20Log&body=' + encodeURI(log.substr(log.length - 1000, 1000)), '_system');

        appLib.socialShare('BMJ OnExamination App Log', 
            'Please send to support@onexamination.com\n\n' + log,
            '', $.noop, $.noop);        
    },

    testNotificationQuestion: function() {
        /*
        function getFailureFunc(suffix) {
           return function() { appLib.alert('Unable to download daily question ' + suffix); };
        }

        oe.getNotificationQuestions(function(questions) {                        
            oe.loadQuestions(questions, -1, oe.downloadImages, function(qSet) {                    
                    oe.notificationQuestionBank = qSet;

                    app.trigger('showNotificationQuestion');
                }, 
                getFailureFunc('[loadQuestions]'));            
        }, getFailureFunc('[getNotificationQuestions]'));
        */

        pushNotification.onNotification();
    },

    enableBetaMode: function() {
        $('#enableBetaMode').parent().hide();

        oeBeta.isBetaMode = true;
        oeConstants.baseUrl = oeConstants.betaBaseUrl;
    }
});


//========================================================================================

//## Terms & Conditions	
var TermsConditionsView = Backbone.View.extend({
    template: _.template(oeTemplate.get('TermsConditionsTemplate')),

    render: function(eventName) {		
        $(this.el).html(this.template());        
		
        return this;
    }
    
});



//========================================================================================

//## Privacy Policy	
var PrivacyPolicyView = Backbone.View.extend({
    template: _.template(oeTemplate.get('PrivacyPolicyTemplate')),

    render: function(eventName) {		
        $(this.el).html(this.template());        
		
        return this;
    }
    
});



//========================================================================================

//## Login	
var LoginView = Backbone.View.extend({
    template: _.template(oeTemplate.get('LoginTemplate')),

    render: function(eventName) {	
        var demoModeStyle = (oe.destination == null ? '' : 'display:none;');
                                     
        $(this.el).html(this.template({ demoModeStyle: demoModeStyle }));        
		
        return this;
    },
	
	
	events: {
		"click #login-button": "login"		
	},
	
	login: function() {
		var email = this.$('#email').val()
		var password = this.$('#password').val();		
        var msg = '';
		
		if(email.length == 0) {
            msg = 'Email cannot be blank!';
			appLib.alert(msg);
            appLib.trackEvent('Sign In', 'Validation', msg);
			return;
		}

		if(password.length == 0) {
            msg = 'Password cannot be blank!';
			appLib.alert(msg);
            appLib.trackEvent('Sign In', 'Validation', msg);
			return;
		}
		
		
		this.tryAuth(email, password);
	},	
	
	
	tryAuth: function(email, password) {
		var view = this;
			
        var authDate = new Date();

		oe.ajax('AuthenticateUserWithTimeZone', 
				{
					deviceId: appLib.getDeviceId(oeConstants.version),
					emailAddress: email,
					password: password,
                    timezoneOffset: authDate.getTimezoneOffset()
				},
				function(data, textStatus) {                                     
					if (!_.isUndefined(data.d) && !_.isUndefined(data.d.AssessmentAPIToken)) {						
						if(data.d.AssessmentAPIToken.Token != null) {
							view.model.set('email', email);
							view.model.set('key', data.d.AssessmentAPIToken.Token);
							view.model.set('userId', data.d.AssessmentAPIToken.UserId);
							view.model.set('tokenExpires', data.d.AssessmentAPIToken.ExpiryDate);
							
                            oe.setLastToken(data.d.AssessmentAPIToken.Token);

                            appLib.setTrackVariable(oeConstants.gaVariable.userId, data.d.AssessmentAPIToken.UserId);

                            try {
                                appLib.setTrackVariable(oeConstants.gaVariable.institutionId, data.d.InstitutionDescription);
                                view.model.set('institutionDescription', data.d.InstitutionDescription);
                            } catch(e) {
                                appLib.debugLog('Unable to set Institution Description');
                            }

                            appLib.track('login-ok');
                            appLib.trackEvent('Sign In', 'Log In Successful', '');

                            //## Signal where to navigate to. Default to selecting exam, but can optionally be session review
                            var appEvent = 'selectExam';
                            if(oe.destination != null) {
                                appLib.log('destination is ' + oe.destination);
                                appEvent = oe.destination;
                                oe.destination = null;
                            }       
                

                            //## Check push notification token has changed
                            var onNotificationTokenSaved = function() {                                
                                pushNotification.token.saveToken(pushNotification.token.newToken);
                                appLib.debugLog('Saved push notification token: ' + pushNotification.token.newToken);

                                pushNotification.token.updateServer = false;
                            };

                            
                            var updatePushTokenOnServer = function() {
                                if(!appLib.isPhoneGap()) {
                                    appLib.debugLog('Skipped updatePushTokenOnServer as not PhoneGap');
                                    return;
                                }

                                if(pushNotification.token.newToken === null) {
                                    appLib.debugLog('Skipped updatePushTokenOnServer as new token is null');
                                    return;
                                }


                                var os = (appLib.getDevice() == 'android' ? 'android' : 'ios');

                                //if(pushNotification.token.currentToken === null) {
                                    //## New device registration                                    
                                    oe.ajax('RegisterForNotification', {
                                            token: data.d.AssessmentAPIToken.Token,
                                            notificationToken: pushNotification.token.newToken,
                                            deviceOS: os,                                            
                                        }, 
                                        onNotificationTokenSaved, 
                                        function(xhr, msg, err) {
                                            appLib.trackEvent('Error', 'Unable to register push token', pushNotification.token.newToken);
                                            appLib.debugLog('RegisterForNotification: Unable to register token: ' + pushNotification.token.newToken + ' [msg:' + msg + '][error:' + err + ']');
                                        }, 
                                        this, false);
                                /*    
                                } else {
                                    //## Update device registration                                    
                                    oe.ajax('UpdateNotificationRegistration', {
                                            token: data.d.AssessmentAPIToken.Token,
                                            currentNotificationToken: pushNotification.token.currentToken,
                                            newNotificationToken: pushNotification.token.newToken,
                                            deviceOS: os,                                            
                                        }, 
                                        onNotificationTokenSaved, 
                                        function() {
                                            appLib.log('UpdateNotificationRegistration: Unable to update token from: ' + pushNotification.token.currentToken + ' to: ' + pushNotification.token.newToken);
                                        }, 
                                        this, false);
                                }*/
                            };

                            if(pushNotification.permission.isGranted()) {
                                updatePushTokenOnServer();

                            } else if(pushNotification.permission.canPrompt()) {                            
                                appLib.confirm('Would you like to receive a daily question notification?', 
                                    function(choice) {
                                        appLib.debugLog(choice);
                                        appLib.trackEvent('Notification', 'Accept', (choice == 2 ? 'Not Now' : 'Yes'));

                                        if(choice == 2) {
                                            pushNotification.permission.calculateNextTimeToPrompt();
                                            return;
                                        }
                                        
                                        pushNotification.permission.grant();

                                        if(pushNotification.token.updateServer) {
                                            updatePushTokenOnServer();
                                        }
                                    }, 
                                    'Daily Question', 
                                    'Yes,Not Now');
                            }


							app.trigger(appEvent);
						}
					}
				}, 
				function(data, msg, errorText) {                     
                    if(errorText == null || errorText.length == 0) {
						appLib.alert('Unable to access onExamination website', jQuery.noop, 'Login');

                        appLib.track('login-no-access');
                        appLib.trackEvent('Sign In', 'Log In Failed', 'No internet');
					} else if (!_.isUndefined(data) && !_.isUndefined(data.d) && !_.isUndefined(data.d.SuggestUpdate) && data.d.SuggestUpdate) {	
						oe.destination = null;
												
						app.trigger('appUpdate');
					} else {
						appLib.alert(errorText, jQuery.noop, 'Login');

                        appLib.track('login-failed');
                        appLib.trackEvent('Sign In', 'Log In Failed', 'Incorrect details');
                    }
                });

	}
});



//========================================================================================

//## Getting Started	
var GettingStartedView = Backbone.View.extend({
    template: _.template(oeTemplate.get('GettingStartedTemplate')),

    render: function(eventName) {		
        $(this.el).html(this.template());        
		
        return this;
    }
    
});


//========================================================================================

//## Demo page	
var DemoView = Backbone.View.extend({
    template: _.template(oeTemplate.get('DemoTemplate')),

    render: function(eventName) {		
        $(this.el).html(this.template());        
		
        return this;
    },
	
	
	events: {
		"click #startQuestions": "startQuestions"
	},	
	
	startQuestions: function() {		
        appLib.trackEvent('Demo Questions', 'Start Demo Questions', '');

		app.trigger('startDemoQuestions');
	}		
});


//========================================================================================

//## Exam page
var ExamView = Backbone.View.extend({
    template: _.template(oeTemplate.get('ExamSelectionTemplate')),

    render: function (eventName) {
        //## Get the user's exams
        oe.getUserExams(this, this.renderUserExams);

        $(this.el).html(this.template({ 
            selectExamButton: 'Select Revision Options',
            displayExamDateSection: appLib.cssDisplay(true) 
        }));

        return this;
    },

    renderUserExams: function (view, exams, currentExamId) {
        //## Allow Beta Mode: Test if the user has a sub that expires after 2100
        try {            
            oeBeta.allowBetaMode = oeBeta.allowBetaMode || _.any(exams, function(exam) { 
                return new Date(parseInt(exam.Expires.substr(6))) > new Date(2100, 0, 1);
            });

            if(oeBeta.allowBetaMode) 
                appLib.log('Beta Mode is allowed');
        } catch(e) { }


        var options = _.map(exams, function (item) {
            return {
                id: item.ExamId,
                text: item.ExamName,
                selected: (item.ExamId == currentExamId),
                examDate: item.ExamDate                
            };
        });
		
        appLib.fillTemplatedDropDown('examList', options, 'data-examdate="<%= examDate %>"');
        view.updateExamDate();
    },


    events: {
        "change #examList": "changeExam",
        "click #selectExam": "selectExam",
		"click #selectExamDate": "editExamDate"
    },

    changeExam: function() {
        this.updateExamDate();
    },

    updateExamDate: function() {
        var selectedExam = $('#examList').find(':selected');
        $('#examDate').text('When is your ' + selectedExam.text() + ' exam?');

        var examDate = selectedExam.data('examdate');
        if(typeof examDate === 'undefined') {
            return;
        }
        
        try {
            var dt = new Date(parseInt(examDate.substr(6)));
            this.displayExamDate(dt);
        }  catch(ex) { }      
    },

    displayExamDate: function(d) {
        $('#examDate').text('Your ' + $('#examList').find(':selected').text() + ' exam is on ' + appLib.getFormattedDate(d));
    },

    selectExam: function () {
        var selectedExamId = $('#examList').val();

        if (selectedExamId == null) {
            appLib.alert('Please select an exam');
            return;
        }

        appLib.trackEvent('Exam Selection', $('#selectExam').text(), $('#examList').find(':selected').text() + ' Selected', selectedExamId);

        oe.selectedExamId = selectedExamId;
        app.trigger('selectRevisionType');
    },
	
	editExamDate: function() {
        var view = this;
		var examDate = $('#examDate').data('date');
		var dt = new Date();
		
		if(examDate !== '')
			dt = new Date(dt);
			

        appLib.trackEvent('Exam Selection', 'Set Exam Date', '');

		appLib.selectDate({ 
			date: dt,
			mode: 'date'
		}, function(d) {
			if(typeof d !== 'undefined') {				
                oe.setUserExamDate($('#examList').find(':selected').val(), 
                                    d, 
                                    function() {
                                        view.displayExamDate(d);    

                                        //## Update exam date in exam drop down
                                        $('#examList').find(':selected').data('examdate', '/Date(' + d.getTime() + ')/');
                                    });
			}
		}, function(err) {
			//## Do nothing - user cancelled date dialog
		});
	}
});


//========================================================================================

//## Demo Exam page
var DemoExamView = Backbone.View.extend({
    template: _.template(oeTemplate.get('ExamSelectionTemplate')),

    render: function (eventName) {
        //## Get the demo exams
        oe.getDemoExams(this.renderDemoExams, this.renderLocalDemoExams);

        //## For testing without internet: 
        //_.delay(this.renderLocalDemoExams, 1000, this); 

        $(this.el).html(this.template({ 
            selectExamButton: 'Start Demo Questions', 
            displayExamDateSection: appLib.cssDisplay(false) 
        }));

        return this;
    },


    //## Successfully downloaded demo exams, save and display them
    renderDemoExams: function (exams) {
        var options = oe.convertExamListToDropDownFormat(exams);        

        appLib.log('Displaying API demo exams');
        appLib.sortAndFillDropDown('examList', options);
    },


    //## Use local demo data if internet is unavailable
    renderLocalDemoExams: function () {
        if (oe.demoExams == null || oe.demoExams.length == 0) {
            appLib.alert('An Internet connection is required to download all demo exams');

            //## Setup local MRCP Part 1 exam and questions
            oe.demoExams = [{ ExamId: oeConstants.mrcpPart1, ExamName: 'MRCP Part 1'}];
            oe.demoQuestions = [{ examId: oeConstants.mrcpPart1, updatedAt: 0, questions: null}];

            appLib.log('Local exams = local MRCP Part 1');
                                        
        } else {					
			//## Limit demoExams to exams that we have questions for
			var availableExams = _.filter(oe.demoExams, function(availableExam) {
				//## Do we have questions for this exam?
				var haveQuestions = false;
				
				_.each(oe.demoQuestions, function(exam) {
					if(exam.examId == availableExam.ExamId)
						haveQuestions = true;
				});
				
				return haveQuestions;
			});
                                        
            //## Add MRCP Part 1 if it's not been downloaded
            var containsMrcpPart1 = false;
			_.each(availableExams, function(exam) {
				 if(exam.ExamId == oeConstants.mrcpPart1)                                               
					containsMrcpPart1 = true;                                  
			});

			if(!containsMrcpPart1) {
				availableExams.push({
										ExamId: oeConstants.mrcpPart1,
										ExamName: 'MRCP Part 1'
									});
			
			   oe.demoQuestions.push({ examId: oeConstants.mrcpPart1, updatedAt: 0, questions: null});
			}
                                        
										
			appLib.log('filtering demo question list');
			oe.demoExams = availableExams;
		}

		
        var options = oe.convertExamListToDropDownFormat(oe.demoExams);

        appLib.log('Displaying local demo exams');
        appLib.sortAndFillDropDown('examList', options);
    },


    events: {
        "click #selectExam": "selectExam"
    },

    selectExam: function () {
        var selectedExamId = $('#examList').val();

        if (selectedExamId == null) {
            appLib.alert('Please select an exam');
            return;
        }

        appLib.trackEvent('Exam Selection', $('#selectExam').text(), selectedExamId);

        oe.selectedExamId = selectedExamId;


        //## Do we have any local demo questions for this exam?
        var demoExam = _.find(oe.demoQuestions, function (exam) {
            return (exam.examId == selectedExamId);
        });



        //## Function to download demo questions, and if successful save them locally, before starting to view the questions
        var downloadDemoQuestions = function (examId) {
                                        oe.getDemoQuestions(examId,
                                                            function (questions, updateDate) {
                                                                //## Store demo questions locally
                                                                oe.demoQuestions.push({
                                                                    examId: examId,
                                                                    questions: questions,
                                                                    updatedAt: updateDate
                                                                });

                                                                appLib.log('Starting downloaded demo questions for exam ' + examId);
                                                                app.trigger('startDemoQuestions');
                                                            },
                                                            function () {
                                                                appLib.alert('An Internet connection is required to download demo questions');
                                                            });
        };


        //## Function to setup and view local demo questions
        var startLocalDemoQuestions = function (demoExam) {
            appLib.log('Starting local demo questions for exam ' + demoExam.examId);            

            //## Load questions, but don't download images as we're offline
            oe.loadQuestions(demoExam.questions, 
                             demoExam.examId, 
                             false, 
                             function () {
                                app.trigger('startDemoQuestions');
                             },
                             jQuery.noop);
        };



        if (demoExam == null) {
            //## No local questions - download from API
            downloadDemoQuestions(selectedExamId);

        } else {

            //## Has the user selected local MRCP Part 1 demo?
            if (selectedExamId == oeConstants.mrcpPart1 && demoExam.questions == null) {
                oe.questionBank = demoQuestions;
                oe.assessmentId = null;

                appLib.log('Starting hardcoded demo question for MRCP Part 1');

                app.trigger('startDemoQuestions');
                return;
            }


            //## Local questions, but are they up-to-date?
            oe.getDemoLastChangeDate(selectedExamId,
                                     function (updatedAt) {
                                         if (demoExam.updatedAt != updatedAt) {
                                             //## New questions so remove demo exam from local demo list
                                             oe.demoQuestions = _.without(oe.demoQuestions, demoExam);

                                             appLib.log('Updating demo questions for exam ' + selectedExamId);

                                             //## Download new demo questions - and save to local demo list
                                             downloadDemoQuestions(selectedExamId);

                                         } else {
                                             //## No updates, so use current demo questions
                                             startLocalDemoQuestions(demoExam); 
                                        }
                                     },
                                     function () {
                                         //## Error checking for question updates - so use local demo questions
                                         startLocalDemoQuestions(demoExam);
                                     });
        }
    }
});


//========================================================================================


var RevisionTypeMenuView = Backbone.View.extend({
    template: _.template(oeTemplate.get('RevisionTypeSelectionTemplate')),
    mockTests: null,

    render: function (eventName) {              
        $(this.el).html(this.template());        

        appLib.maskUI(true);
        _.delay(this.postRender, 500, this);
                                                        
        return this;
    },

    postRender: function (context) {        
        $.proxy(oe.getQuestionTags, context, function(tags) {
                context.processQuestionTags(tags);
                
                appLib.log('getQuestionTags resolve');

                oe.getMockTests(function(mockTests) {
                    context.mockTests = mockTests;

                    if(mockTests.length > 0)
                        $('#mockTestListButton').show();

                }, oe.selectedExamId);
            }, jQuery.noop, oe.selectedExamId).apply();
    },

    events: {
        "click #selectWorkHard": "startWorkHard",
        "click #selectWorkSmart": "startWorkSmart",
        "click #selectCoreQuestions": "startCoreQuestions",
        "click #selectMockTest": "selectMockTest"
    },


    processQuestionTags: function(tags) {
        try {
            if(tags !== null && tags.length > 0) {
                var containsCoreQuestions = (_.find(tags, function(tag) { return tag.Value === oeConstants.coreQuestionsTag; }) !== undefined);

                if(containsCoreQuestions) {
                    $('#coreQuestionsListButton').show();
                }
            }
        } catch(e) {
            appLib.debugLog('Unable to download question tags for Revision Type menu');
        }
    },


    startWorkHard: function() {        
        appLib.trackEvent('Revision Type', 'Work Hard', '');
        app.trigger('workHardOptions');
    },

    startWorkSmart: function() {
        appLib.trackEvent('Revision Type', 'Work Smart', '');
        app.trigger('workSmartOptions');
    },

    startCoreQuestions: function() {
        appLib.trackEvent('Revision Type', 'Core Questions', '');
        app.trigger('workSmartOptions', { 
                title: 'Core Questions Options', 
                questionStatus: oe.workSmartQuestionType.AllQuestions,
                tagsByName: [ oeConstants.coreQuestionsTag ]
            });
    },

    selectMockTest: function() {
        appLib.trackEvent('Revision Type', 'Mock Test', '');
        app.trigger('selectMockTest', this.mockTests);
    }
});


//========================================================================================


//## Mock Test Selection
var MockTestMenuView = Backbone.View.extend({
    template: _.template(oeTemplate.get('MockTestSelectionTemplate')),
    assessmentTemplates: null,

    initialize: function() {        
        this.assessmentTemplates = this.options.assessmentTemplates;
                
        //## Ensure filters isn't empty, as it's easier to (later) check for properties on a non null object
        if (typeof this.assessmentTemplates === 'undefined')
            this.assessmentTemplates = {};
    },

    render: function (eventName) {              
        $(this.el).html(this.template({ 
            assessmentTemplates: this.assessmentTemplates 
        }));
                                                        
        return this;
    },

    events: {
        "click .mocktest": "startMockTest"
    },

    startMockTest: function(evt) {
        var assessmentTemplateId = $(evt.currentTarget).data('assessmenttemplateid');

        oe.mockTest(function() {
            appLib.track('mock-test-#' + oe.selectedExamId + '-' + assessmentTemplateId);
            appLib.trackEvent('Revision Type', 'Mock Test', oe.selectedExamId, assessmentTemplateId);

            app.trigger('startQuestions', false, true);
        }, assessmentTemplateId, oe.selectedExamId);
    }

});


//========================================================================================


//## Revision Option Selection
var RevisionOptionsMenuView = Backbone.View.extend({
    template: _.template(oeTemplate.get('RevisionOptionsTemplate')),
    mode: null,
    filters: null,

    initialize: function() {        
        this.mode = this.options.mode;
        
        this.filters = this.options.filters;

        //## Ensure filters isn't empty, as it's easier to (later) check for properties on a non null object
        if (typeof this.filters === 'undefined')
            this.filters = {};
    },

    render: function (eventName) {		        
        $(this.el).html(this.template());
        
		appLib.maskUI(true);
        _.delay(this.postRender, 1000, this);
                                                		
		return this;
    },

    postRender: function (context) {        		
		var getCurricula = function(resolve, reject) {
			appLib.log('getCurricula start');
			
			//## Download curricula and render the list
			oe.getCurricula(function(results) {
					context.renderCategoryList(results);
					
					appLib.log('getCurricula resolve');
					resolve();
				}, reject, oe.selectedExamId);
		};
		
		var getQuestionTypes = function(resolve, reject) { 
			appLib.log('getQuestionTypes start');
		
			$.proxy(oe.getQuestionTypes, context, function(results) {
					context.renderQuestionTypeList(results);
					
					appLib.log('getQuestionTypes resolve');
					resolve();
				}, oe.selectedExamId).apply();        
		};

        var getQuestionTags = function(resolve, reject) { 
            appLib.log('getQuestionTags start');
        
            $.proxy(oe.getQuestionTags, context, function(results) {
                    context.renderQuestionTagList(results);
                    
                    appLib.log('getQuestionTags resolve');
                    resolve();
                }, reject, oe.selectedExamId).apply();        
        };				
		
		Promise.all([new Promise(getCurricula), new Promise(getQuestionTypes), new Promise(getQuestionTags)])
			.then(function() {                                                		                
                if(context.mode == 'WorkHard') {
                    //## Work hard settings
                    context.changeRevisionType();
                    context.updateQuestionCount();
                    
                } else {
                    appLib.log(context.filters);

                    //## Work smart specific settings
                    $('#revisionType').val('WorkSmart'); //.selectmenu('refresh');

                    var title = (context.filters.hasOwnProperty('title') ? context.filters.title : 'Work Smart Options');
                    context.changeRevisionType(true, title);
                    
                    //## Set question status
                    if(context.filters.hasOwnProperty('questionStatus'))
                        context.setQuestionStatus(context.filters.questionStatus);

                    try {
                        //## filter and/or tagsByName may be null / undefined
                        context.setQuestionTagsByText(context.filters.tagsByName);            //## New setting so can be undefined for some users
                    } catch(e) { }

                    context.updateQuestionCount();                                                
                }

				appLib.maskUI(false);
				$('#revisionOptionsLoading').hide();
                $('#revisionOptions').show();                                                
							
			}).catch(function(error) {
				appLib.maskUI(false);
				
                appLib.debugLog('RevisionOptionsMenuView promise error: ' + error);

                //TODO: Retry promises?                
				appLib.alert('An error occurred', jQuery.noop, 'Revision Type');
			});                
    },


    events: {
        "click #startQuestions": "startQuestions",
        "change #revisionType": "changeRevisionType",
        "change #questionDifficulty": "showQuestionDifficulty",
        "change #questionCategory": "showQuestionCategories",
        "change #questionType": "updateQuestionTypes",
        "change #questionTags": "updateQuestionTags",
        "change #questionStatus": "changeQuestionStatus",
        "change #workSmartAdvancedFilter": "showWorkSmartAdvancedFilters",
        "change #showAnswerAfterQuestion": "updateRevisionFilterSummary",

        //## Seems backbone uses 'live()' to bind events, so this works even though the checkboxes don't exist when the view is rendered!
        "change #questionCategoryList input[type='checkbox']": "updateWorkSmartQuestionCount",
        "change #questionTypeList input[type='checkbox']": "updateQuestionCount",
        "change #questionTagsList input[type='checkbox']": "updateQuestionCount",

        "slidestop #questionDifficultyValue": "updateQuestionCount",
		
		"click #selectAllCats": "selectAllCats",
        "click #selectNoCats": "selectNoCats",
        "click #resetFilters": "resetFilters"
    },
    	   
	
    startQuestions: function () {
        //## Download required questions
		
		var options = {
			revisionType: $('#revisionType').val(),
			numberOfQuestions: $('#questionLimit').val(),
			difficulty: this.getDifficulty(),
			questionTypes: this.getQuestionTypes(),
            allQuestionTypes: $('#questionType').val() != 'SelectQuestionTypes'
		};

        if (options.numberOfQuestions == null || options.numberOfQuestions == '0') {
            appLib.alert('No questions match the selected filters');
            return;
        }

        if (oe.selectedExamId == null) {
            appLib.alert('There is no selected exam!');
            return;
        }

        if (options.questionTypes.length == 0) {
            appLib.alert('Select at least one question type!');
            return;
        }



        if (options.revisionType == 'PastPaper') {
            //##TODO: Add support for past papers

            //oe.questionBank = pastPaperQuestions;
            //app.trigger('startQuestions', false, true);
        }
        else if (options.revisionType == 'WorkSmart') {
			options = _.extend(options, {
				categories: this.getCategories(),
				categoriesCSV: this.getCategoriesCSV(),
				showAnswers: ($('#showAnswerAfterQuestion').val() == 'true'),
				questionStatus: this.getQuestionStatus(),
                questionTags: this.getQuestionTags()
			});
			            
            var hasCategoryFilter = ($.isArray(options.categories) && options.categories.length > 0) ? 'Y' : 'N';
            var hasTagFilter = ($.isArray(options.questionTags) && options.questionTags.length > 0) ? 'Y' : 'N';
            var isAdvancedVisible = $('#workSmartAdvancedFilterSection').is(':visible') ? 'Y' : 'N';

            //## Download work smart questions
            oe.workSmart(
				function () {
					oe.setRevisionOptions(options);
					
					appLib.track('work-smart-' + options.numberOfQuestions + '-'
                        + '[category:' + hasCategoryFilter + ']'
                        + '[tags:' + hasTagFilter + ']'
                        + '[advanced:' + isAdvancedVisible + ']');
					app.trigger('startQuestions', options.showAnswers, false);
				},
				options.questionStatus,
				options.difficulty.minDiff,
				options.difficulty.maxDiff,
				options.categories,
				options.numberOfQuestions,
				oe.selectedExamId,
				options.questionTypes,
                options.questionTags
			);
        }
        else if (options.revisionType == 'WorkHard') {
            //## Download work hard questions
            oe.workHard(
				function () {
					oe.setRevisionOptions(options);
					
					appLib.track('work-hard-' + options.numberOfQuestions);

					//## Start questions if download is successful
					app.trigger('startQuestions', true, false);
				},
				options.numberOfQuestions,
				options.questionTypes
			);
        }
    },


    //## Summary text (describing the current filters) at the bottom of the 'Work Smart' page
    updateRevisionFilterSummary: function() {        
        var difficultyMentioned = false;
        var questionTypeMentioned = false;

        //## 'Revise [exam style] with'
        var summary = 'Revise ' + ($('#showAnswerAfterQuestion').val() === 'false' ? ' exam style ' : '') + 'with';

        //## ' [easy|hard|]'
        if($('#questionDifficulty').val() === 'SelectDifficulty') {
            if($('#questionDifficultyValue').val() > 6) {
                summary += ' hard';
                difficultyMentioned = true;
            } else if($('#questionDifficultyValue').val() < 4) {
                summary += ' easy';
                difficultyMentioned = true;
            }
        }

        //## [SBA][, EMQ][, ...]
        var questionTypes = $("#questionTypeList input:checked");
        if($('#questionType').val() === 'SelectQuestionTypes' && questionTypes.length > 0) {
            summary += ' ' + appLib.niceList(_.map(questionTypes.parent().find('span.ui-btn-text'), function(el) { return $(el).text(); }), 'and');
            questionTypeMentioned = true;
        }       

        //## ' [all questions|questions I have not seen before|questions I have got wrong before]'         
        if($('#questionStatus').val() === 'AllQuestions') {
            summary += (!difficultyMentioned && !questionTypeMentioned ? ' all' : '') + ' questions';
        } else {
            summary += ' questions ' + $('#questionStatus option:selected').text().trim();                
        }        

        //## '[ in [cat1][, cat2][, ...]]'
        var categories = $("#questionCategoryList input:checked");
        if($('#questionCategory').val() === 'SelectCategories' && categories.length > 0) {
            summary += ' in ' + appLib.niceList(_.map(categories.parent().find('span.ui-btn-text'), function(el) { return $(el).text(); }), 'and', 3, 'other categories');
        }        

        //## '[ that are tagged as [tag1][, tag2][, ...]]'
        var tags = $("#questionTagsList input:checked");
        if($('#questionTags').val() === 'SelectQuestionTags' && tags.length > 0) {
            summary += ' that are tagged as ' + appLib.niceList(_.map(tags.parent().find('span.ui-btn-text'), function(el) { return $(el).text(); }), 'or', 3, 'other tags');
        }

        $('#revisionFilterSummary').text(summary);
    },


    //## Advanced Filters
    showWorkSmartAdvancedFilters: function() {
        //## Toggle showing advanced filter section + question type filter (which is inside another div as it's shared with Work Hard)
        $('#questionTypeFilterSection').toggle($('#workSmartAdvancedFilterSection').toggle().is(':visible'));
    },
	    

	
	//## Question Types    

    renderQuestionTypeList: function (questionTypes) {
        $('#questionTypeList').empty().append('<legend>Types:</legend>');

        var count = 1;
        _.each(questionTypes, function (type) {
            $('#questionTypeList').append('<input type="checkbox" data-theme="e" id="type' + count + '" value="' + type.QuestionType + '" />'
											  + '<label for="type' + count + '">' + type.ExamSpecificName + '</label>');
            count++;
        });        
    },

    updateQuestionTypes: function() {
        this.showQuestionTypes();
        this.updateQuestionCount();
    },

    showQuestionTypes: function () {            
        if ($('#questionType').val() == 'SelectQuestionTypes') {
            $('#questionTypeSection').show();
            //-- REFRESH CONTROL & PAGE TO CORRECTLY APPLY STYLING 
            //$("#questionTypeList").controlgroup("refresh");
            //$('#RevisionOptionsTemplate').trigger('create');               // Is this needed?
        }
        else {
            $('#questionTypeSection').hide();
		}					
    },
    	
	setQuestionTypes: function(questionTypes) {				
		if(questionTypes == null) {
			return;
		}
															
        $('#questionType').val('SelectQuestionTypes'); //.selectmenu('refresh');
		this.showQuestionTypes();
		
		_.each(questionTypes, function(qtype) { 
			//$("#questionTypeList input[type=checkbox][value='" + qtype + "']").prop('checked', true).checkboxradio("refresh");
		});
	},

    getQuestionTypes: function () {
        var selected;

        if ($('#questionType').val() != 'SelectQuestionTypes') {
            //## API v1.1 supported sending empty array to request all question types for work hard.
            //## API v1.1.1 requires question types to be specified for work hard.
            selected = $("#questionTypeList input");
        } else {
            selected = $("#questionTypeList input:checked");
			
			//## If no types are selected then return all valid question types
			if(selected.length == 0)
				selected = $("#questionTypeList input");
        }

        var types = _.map(selected, function (item) {
            return $(item).val();
        });

        return types;
    },
		
	

    //## Tags

    renderQuestionTagList: function (questionTags) {
        $('#questionTagsList').empty().append('<legend>Tags:</legend>');

        var count = 1;
        _.each(questionTags, function (tag) {
            $('#questionTagsList').append('<input type="checkbox" data-theme="e" id="tag' + count + '" value="' + tag.Key + '" data-value="' + tag.Value + '" />'
                                            + '<label for="tag' + count + '">' + tag.Value + '</label>');
            count++;
        });        
    },

    updateQuestionTags: function() {
        this.showQuestionTags();
        this.updateQuestionCount();
    },

    showQuestionTags: function () {            
        if ($('#questionTags').val() == 'SelectQuestionTags') {
            $('#questionTagsSection').show();
            //-- REFRESH CONTROL & PAGE TO CORRECTLY APPLY STYLING 
            //$("#questionTagsList").controlgroup("refresh");
            //$('#RevisionOptionsTemplate').trigger('create');               // Is this needed?
        }
        else {
            $('#questionTagsSection').hide();
        }                   
    },

    //## questionTags: array of string, e.g. ['Core Questions', 'Bookmarked']
    setQuestionTagsByText: function(questionTags) {             
        if(questionTags === null || questionTags.length === 0) {
            return;
        }
                                
        var tagsChecked = 0;

        _.each(questionTags, function(tag) { 
            //tagsChecked += $("#questionTagsList input[type=checkbox][data-value='" + tag + "']").prop('checked', true).checkboxradio("refresh").length;
            tagsChecked += $("#questionTagsList input[type=checkbox][data-value='" + tag + "']").prop('checked', true).length;
        });

        if(tagsChecked > 0) {
            $('#questionTags').val('SelectQuestionTags'); //.selectmenu('refresh');        
            this.showQuestionTags();
        }
    },

    //## questionTags: array of int, e.g. [5, 27]
    setQuestionTags: function(questionTags) {             
        if(questionTags === null || questionTags.length === 0) {
            return;
        }
                                                            
        $('#questionTags').val('SelectQuestionTags'); //.selectmenu('refresh');
        this.showQuestionTags();
        
        _.each(questionTags, function(tag) { 
            //$("#questionTagsList input[type=checkbox][value='" + tag + "']").prop('checked', true).checkboxradio("refresh");
        });
    },

    getQuestionTags: function () {
        if($('#questionTags').val() == 'AllQuestionTags')
            return [];

        var selected = $("#questionTagsList input:checked");
        if (selected.length === 0) {
            return [];
        }

        
        var tags = _.map(selected, function (item) {
            return $(item).val();
        });

        return tags;
    },


	
	//## Categories
		
	//## Generate and render HTML for category list for current exam
	renderCategoryList: function (categories) {
        $('#questionCategoryList').empty().append('<legend></legend>');

        var count = 1;
        _.each(categories, function (cat) {
            $('#questionCategoryList').append('<input type="checkbox" data-theme="e" id="cat' + count + '" value="' + cat.value + '" />'
											  + '<label for="cat' + count + '">' + cat.key + '</label>');
            count++;
        });        
    },
	
	//## Update question category view  
	showQuestionCategories: function () {
        if ($('#questionCategory').val() == 'SelectCategories') {
            $('#questionCategorySection').show();
            //-- REFRESH CONTROL & PAGE TO CORRECTLY APPLY STYLING 
            //$("#questionCategoryList").controlgroup("refresh");
            //$('#RevisionOptionsTemplate').trigger('create');
        }
        else
            $('#questionCategorySection').hide();

        this.updateWorkSmartQuestionCount();
    },
	
	//## Get array of individual curriculum ids associated to the selected categories - e.g. [1, 2, 3]
	getCategories: function () {
        if ($('#questionCategory').val() != 'SelectCategories')
            return null;

        var selected = $("#questionCategoryList input:checked");

        var categories = [];
        _.each(selected, function (item) {
            var ids = $(item).val();

            _.each(ids.split(','), function (id) {
                categories.push({ CurriculumID: id });
            });
        });

        return categories;
    },
	
	//## Get array of curriculum ids associated to the selected categories - e.g. ['1,2', '3', '6,7,10']
	getCategoriesCSV: function () {
        if ($('#questionCategory').val() != 'SelectCategories')
            return null;

        var selected = $("#questionCategoryList input:checked");

        var categoriesCSV = [];
        _.each(selected, function (item) {            
			categoriesCSV.push($(item).val());            
        });

        return categoriesCSV;
    },
	
	//## Set selected categories by curriculum ids - e.g. ['1,2', '3', '6,7,10'] -> ENT, Eyes, Genetics
	setCategoriesCSV: function(categoriesCSV) {
		if(categoriesCSV == null) {
			return;
		}
					
        $('#questionCategory').val('SelectCategories'); //.selectmenu('refresh');
		this.showQuestionCategories();        
		
		_.each(categoriesCSV, function(cat) { 
			//$("#questionCategoryList input[type=checkbox][value='" + cat + "']").prop('checked', true).checkboxradio("refresh");
            $("#questionCategoryList input[type=checkbox][value='" + cat + "']").prop('checked', true);
		});
    },
	
	//## Select all category checkboxes
	selectAllCats: function() {
        $("#questionCategoryList input[type='checkbox']").each(function() {
            this.checked = true;
        }); //.checkboxradio('refresh');
        
        this.updateWorkSmartQuestionCount();
    },
    
	//## Select no category checkboxes	
    selectNoCats: function() {
        $("#questionCategoryList input[type='checkbox']").each(function() {
            this.checked = false;
        }); //.checkboxradio('refresh');
        
        this.updateWorkSmartQuestionCount();
    },
	
	
	
	
	
	//## Revision Type

    changeRevisionType: function (skipQuestionCountUpdate, title) {
        var revisionType = $('#revisionType').val();

        if (revisionType == 'PastPaper') {
            $('#workSmartGroup').hide();
            $('#pastPaperGroup').show();
        }
        else if (revisionType == 'WorkSmart') {
            if (typeof title === 'undefined') { title = 'Work Smart Options'; }

            $('#revisionOptionsTitle').html(title);
            $('#pastPaperGroup').hide();
			$('#workHardStatus').hide();
            $('#workSmartGroup').show();

            //## Initially hide as it's part of the advanced filter group
            $('#questionTypeFilterSection').css('padding-left', '20px').hide();

            if(!skipQuestionCountUpdate)
                this.updateWorkSmartQuestionCount();
        }
        else if (revisionType == 'WorkHard') {
            $('#revisionOptionsTitle').html('Work Hard Options');            
            $('#pastPaperGroup').hide();
            $('#workSmartGroup').hide();
			$('#workHardStatus').show();
            $('#questionTypeFilterSection').css('padding-left', '0px').show();

            var options = [
                { id: 10, text: '10' },
                { id: 20, text: '20' },
                { id: 30, text: '30' },
                { id: 40, text: '40' },
                { id: 50, text: '50' },
                { id: 60, text: '60' },
                { id: 70, text: '70' },
                { id: 80, text: '80' },
                { id: 90, text: '90' },
                { id: 100, text: '100' }
            ];
            appLib.fillDropDown('questionLimit', options, '', ' questions');
        }
    },



	//## Question Status

    changeQuestionStatus: function () {
        this.updateWorkSmartQuestionCount();
    },

	
	
	//## Question Counts

    updateQuestionCount: function () {
        var revisionType = $('#revisionType').val();

        if (revisionType == 'WorkSmart') {
            this.updateWorkSmartQuestionCount();            
        } else if (revisionType == 'WorkHard') {
            this.updateWorkHardQuestionCount();			
        }
    },

    updateWorkSmartQuestionCount: function () {
        var diff = this.getDifficulty();
        var categories = this.getCategories();
        var questionTypes = this.getQuestionTypes();
        var tags = this.getQuestionTags();

        if (oe.selectedExamId == null) {
            appLib.alert('There is no selected exam!');
            return;
        }        

        this.updateRevisionFilterSummary();

        //## Populate ddlb with options from 10 to 100 or less if there are fewer questions
        oe.workSmartQuestionCount(
			function (questionCount) {
				var options = [];
				var limit = Math.min(questionCount, 100);

				for (var i = 10; i <= limit; i += 10)
					options.push({ id: i, text: i });

				//## Add the total number of questions if less than 100, but not divisible by 10 (as it'll be a duplicate)
				if (limit < 100 && limit % 10 > 0)
					options.push({ id: questionCount, text: questionCount });

				//## If there are no questions then add a zero questions option
				if (options.length == 0)
					options.push({ id: 0, text: 0 });

				appLib.fillDropDown('questionLimit', options, '', ' questions');
			},
			this.getQuestionStatus(),
			diff.minDiff,
			diff.maxDiff,
			categories,
			oe.selectedExamId,
			questionTypes,
            tags
		);
    },
		
	updateWorkHardQuestionCount: function() {
		$.proxy(
			oe.getWorkHardStatus, 
			this, 
			function(questionsAnswered, totalQuestions) {
				var pct = Math.floor((questionsAnswered / totalQuestions) * 100, 0) + '%';
			
				$('#workHardStatus .progress-bar-inner').css('width', pct);					
                $('#workHardStatus .progress-text').text(questionsAnswered + ' of ' + totalQuestions + ' answered (' + pct + ' complete)');                    
			},
			this.getQuestionTypes()
		).apply();		
	},

	
	
	//## Question Difficulty

    isDifficultySliderVisible: function () {
        return $('#questionDifficulty').val() == 'SelectDifficulty';
    },

    showQuestionDifficulty: function (e) {
        var questionDifficulty = $('#questionDifficulty').val();

        if (questionDifficulty == 'AllQuestions')
            $('#difficultySliderGroup').hide();
        else if (questionDifficulty == 'SelectDifficulty')
            $('#difficultySliderGroup').show();

        this.updateWorkSmartQuestionCount();
    },

    getDifficulty: function () {
        var minDiff = 0.0, maxDiff = 1.0, diffVal = -1;

        if (this.isDifficultySliderVisible()) {
            diffVal = parseInt($('#questionDifficultyValue').val());

            minDiff = (diffVal - 1) / 10;
            maxDiff = (diffVal + 1) / 10;

            if (minDiff <= 0)
                minDiff = 0.0;

            if (maxDiff >= 1)
                maxDiff = 1.0;
        }

        return {
            minDiff: minDiff,
            maxDiff: maxDiff,
			diff: diffVal
        };
    },

	setDifficulty: function (diff) {
        if(diff == -1)
			return;

		
		$('#questionDifficulty').val('SelectDifficulty'); //.selectmenu('refresh');
		$('#questionDifficultyValue').val(diff).slider('refresh');
		this.showQuestionDifficulty();		       
    },
	
	
	
	//## Question Status
	
    getQuestionStatus: function () {
        var status = $('#questionStatus').val();

        if (status == 'NotSeen')
            return oe.workSmartQuestionType.NotSeenBefore;
        else if (status == 'AllQuestions')
            return oe.workSmartQuestionType.AllQuestions;
        else if (status == 'WrongQuestions')
            return oe.workSmartQuestionType.WrongBefore;
        else if (status == 'TaggedQuestions')
            return oe.workSmartQuestionType.Tagged;
    },
	
	setQuestionStatus: function (status) {
        var val = ''; 
        
        if (status == oe.workSmartQuestionType.NotSeenBefore)
			val = 'NotSeen';        
        else if (status == oe.workSmartQuestionType.AllQuestions)
			val = 'AllQuestions';        
        else if (status == oe.workSmartQuestionType.WrongBefore)
			val = 'WrongQuestions';        
        else if (status == oe.workSmartQuestionType.Tagged)
			val = 'TaggedQuestions';			
		
		$('#questionStatus').val(val); //.selectmenu('refresh');
    },
	
	
	//## Reset filters
	
	resetFilters: function() {
		appLib.confirm('Are you sure you want to reset your revision filters?',
					   function (index) {
					       if (index == 1) {
					           oe.clearRevisionOptions();
							   app.trigger('reloadRevisionType');
						   }
					   },
					   'Reset Filters?',
					   'Yes,No');
	}
});



//========================================================================================

//## BoF View
var QuestionBrowserView = Backbone.View.extend({
    template: _.template(oeTemplate.get('QuestionBrowserTemplate')),
    optionTemplate: _.template(oeTemplate.get('QuestionOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        TagControlMixin.addEvents(this);        
    },

    render: function (eventName) {
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'));

        //## Used for question index and count
        var session = oe.currentSession();

        //## Don't show tags button when answering challenge assessment or demo assessment
        var contentEnd = '';         
        if(oe.auth.canUploadAnswers() && !oe.getChallengeData()) {            
            contentEnd = TagControlMixin.template();
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'question',
									    optionHtml: optionHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    selectText: '(Please select 1 option)',
										reviewButtonStyle: (session.get('answers').length > 0 ? '' : 'display:none;'),
                                        contentEnd: contentEnd,
                                        footer: this.footerTemplate({ nextNavButtonText: 'Next', showTimerCss: appLib.cssDisplay(session.get('showTimer')), timer: appLib.formatTimer(Math.round(oe.timer / 1000)) })
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));				        					       

        return this;
    },


    //## Returns HTML for a radio list of options
    buildHtmlForOptions: function (options) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        var template = this.optionTemplate;
        var optionHtml = '';

        //## Process question options
        options.each(function (option) {
            optionHtml += template(option.toJSON());
        });

        return '<ons-list>' + optionHtml + '</ons-list>';
    },



    events: {
        "click #answer-button": "answerQuestion",
        "click #session-review-button": "sessionReview"
    },

    answerQuestion: function () {
        var selection = $('#optionList').find('input[type=radio]:checked');

        //## Ensure an answer has been selected
        if (selection.length != 1) {
            appLib.alert('Please select one option.');
            return;
        }

        //## Store the user's answer
        var answerId = parseInt(selection.val());
        this.model.answerQuestion(answerId);
    },

    //## TODO: Refactor into a shared function or parent view?
    sessionReview: function () {
        appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
    }
});




//## BoF Answer
var QuestionBrowserAnswerView = Backbone.View.extend({
    template: _.template(oeTemplate.get('QuestionBrowserAnsweredTemplate')),
    disabledOptionTemplate: _.template(oeTemplate.get('DisabledQuestionOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        AnswerViewMixin.addCommonEvents(this);      
        TagControlMixin.addEvents(this);  
    },

    render: function (eventName) {
        var answer = this.model.get('lastAnswer');
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'), answer.get('answerId'));

        //appLib.log('Comment: ' + this.model.get('comment'));

        //## Used for question index and count
        var session = oe.currentSession();

		var showFinish = session.allQuestionsAnswered() && session.hasAnswersToUpload();

        var contentEnd = '';         
        if(!session.isCompleted() && oe.auth.canUploadAnswers()) {
            contentEnd += TagControlMixin.template();
            contentEnd += oe.getQuestionRatingHtml(this.model.get('id'));            
            contentEnd += oe.getQuestionFeedbackHtml(this.model.get('id'));            
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'answer',
									    optionHtml: optionHtml,
									    resultColour: oe.resultColour(answer.get('score')),
									    result: oe.resultText(answer.get('score')),
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    nextButtonText: (showFinish ? 'Finish' : 'Next Question'),
										nextNavButtonText: (showFinish ? 'Finish' : 'Next'),
                                        footer: this.footerTemplate({ nextNavButtonText: (showFinish ? 'Finish' : 'Next'), showTimerCss: appLib.cssDisplay(false), timer: '' }),
                                        selectText: '',
										exitAnswerReviewStyle: appLib.cssDisplay(session.isCompleted()),
                                        contentEnd: contentEnd
									});        

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));        

        return this;
    },
    

    //## Returns HTML for a radio list of options
    buildHtmlForOptions: function (options, userAnswerId) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        //## Copy options so as not to modify the original when displaying correct/incorrect labels
        var localOptions = new Backbone.Collection(options.toJSON());

        var template = this.disabledOptionTemplate;
        var optionHtml = '';

        //## Process question options
        localOptions.each(function (option) {
            var selected = '';
            var text = option.get('text');

            //## Check the user's selected answer
            if (option.get('id') == userAnswerId) {
                selected = 'checked';

                if (option.get('score') == 100)
                    option.set('text', text + ' - <span class="correct">Correct</span>');
                else
                    option.set('text', text + ' - <span class="incorrect">Incorrect answer selected</span>');
            }
            else if (option.get('score') == 100)
                option.set('text', text + ' - <span class="correct">This is the correct answer</span>');


            var modelData = option.toJSON();
            optionHtml += template(_.extend(modelData, { checked: selected }));
        });

        return optionHtml;
    }    
});



//========================================================================================

//## NoM View
var NOMView = Backbone.View.extend({
    template: _.template(oeTemplate.get('QuestionBrowserTemplate')),
    optionTemplate: _.template(oeTemplate.get('OptionCheckboxTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        TagControlMixin.addEvents(this);        
    },

    render: function (eventName) {
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'));

        //## Used for question index and count
        var session = oe.currentSession();

        var correctOptions = this.model.get('numberOfOptions');
        var selectText = '(Please select ' + correctOptions + ' option' + (correctOptions > 1 ? 's' : '') + ')';
        if (this.model.get('selectAllThatApply'))
            selectText = '(Please select all that apply)';


        //## Don't show tags button when answering challenge assessment or demo assessment
        var contentEnd = '';         
        if(oe.auth.canUploadAnswers() && !oe.getChallengeData()) {            
            contentEnd = TagControlMixin.template();
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'question',
									    optionHtml: optionHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    selectText: selectText,
										reviewButtonStyle: (session.get('answers').length > 0 ? '' : 'display:none;'),
                                        contentEnd: contentEnd,
                                        footer: this.footerTemplate({ nextNavButtonText: 'Next', showTimerCss: appLib.cssDisplay(session.get('showTimer')), timer: appLib.formatTimer(Math.round(oe.timer / 1000)) })
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));

		
        //## Delay until view is rendered then update checkbox state after each checkbox state change
        _.delay(function() {
            $(document).on('change', 'input[type=checkbox]', function(e) {
                //$('input[type=checkbox]').checkboxradio('refresh');
                //TODO: remove whole _delay() call?
            });
        }, 1000, this);
                                   
								   
        return this;
    },


    //## Returns HTML for a radio list of options
    buildHtmlForOptions: function (options) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        var template = this.optionTemplate;
        var optionHtml = '';

        //## Process question options
        options.each(function (option) {
            optionHtml += template(option.toJSON());
        });

        return optionHtml;
    },



    events: {
        "click #answer-button": "answerQuestion",
        "click #session-review-button": "sessionReview"
    },

    answerQuestion: function () {
        var selections = $('#optionList').find('input[type=checkbox]:checked');

        var requiredSelections = this.model.get('numberOfOptions');

        if (this.model.get('selectAllThatApply')) {
            //## Select all that apply
            if (selections.length == 0) {
                appLib.alert('Please select at least one option.');
                return;
            }

        } else {
            //## Select N options
            if (selections.length != requiredSelections) {
                appLib.alert('Please select ' + requiredSelections + ' options.');
                return;
            }
        }


        //## Store the user's answers
        var answers = [];

        _.each(selections, function (el) {
            answers.push(parseInt($(el).val()));
        });

        this.model.answerQuestion(answers);
    },

    sessionReview: function () {
        appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
    }
});




//## NoM Answer
var NOMAnsweredView = Backbone.View.extend({
    template: _.template(oeTemplate.get('QuestionBrowserAnsweredTemplate')),
    disabledOptionTemplate: _.template(oeTemplate.get('DisabledOptionCheckboxTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        AnswerViewMixin.addCommonEvents(this);
        TagControlMixin.addEvents(this);
    },

    render: function (eventName) {
        var answer = this.model.get('lastAnswer');
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'), answer.get('answers'));

        //appLib.log('Comment: ' + this.model.get('comment'));

        //## Used for question index and count
        var session = oe.currentSession();

        var correctOptions = this.model.get('numberOfOptions');
        var selectText = '';
        if (correctOptions == 1)
            selectText = '(There was 1 correct answer)';
        else
            selectText = '(There were ' + correctOptions + ' correct answers)';

		var showFinish = session.allQuestionsAnswered() && session.hasAnswersToUpload();

        var contentEnd = '';         
        if(!session.isCompleted() && oe.auth.canUploadAnswers()) {
            contentEnd += TagControlMixin.template();
            contentEnd += oe.getQuestionRatingHtml(this.model.get('id'));            
            contentEnd += oe.getQuestionFeedbackHtml(this.model.get('id'));            
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'answer',
									    optionHtml: optionHtml,
									    resultColour: oe.resultColour(answer.get('score')),
									    result: oe.resultText(answer.get('score')),
                                        questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    nextButtonText: (showFinish ? 'Finish' : 'Next Question'),
										nextNavButtonText: (showFinish ? 'Finish' : 'Next'),
                                        footer: this.footerTemplate({ nextNavButtonText: (showFinish ? 'Finish' : 'Next'), showTimerCss: appLib.cssDisplay(false), timer: '' }),
									    selectText: selectText,
										exitAnswerReviewStyle: appLib.cssDisplay(session.isCompleted()),
                                        contentEnd: contentEnd
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    //## Returns HTML for a radio list of options
    buildHtmlForOptions: function (options, userAnswers) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        //## Copy options so as not to modify the original when displaying correct/incorrect labels
        var localOptions = new Backbone.Collection(options.toJSON());

        var template = this.disabledOptionTemplate;
        var optionHtml = '';

        //## Process question options
        localOptions.each(function (option) {
            var selected = '';
            var text = option.get('text');

            //## Did the user select this answer?
            var selectedAnswer = _.find(userAnswers, function (answer) {
                return (answer == option.get('id'));
            });

            if (selectedAnswer != null) {
                selected = 'checked';

                if (option.get('score') == 100)
                    option.set('text', text + ' - <span class="correct">Correct</span>');
                else
                    option.set('text', text + ' - <span class="incorrect">Incorrect answer selected</span>');
            }
            else if (option.get('score') == 100)
                option.set('text', text + ' - <span class="correct">This is the correct answer</span>');


            var modelData = option.toJSON();
            optionHtml += template(_.extend(modelData, { checked: selected }));
        });

        return optionHtml;
    }
});



//========================================================================================

//## MCQ View
var MCQView = Backbone.View.extend({
    template: _.template(oeTemplate.get('MCQTemplate')),
    optionTemplate: _.template(oeTemplate.get('MCQOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        TagControlMixin.addEvents(this);        
    },

    render: function (eventName) {
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'));

        //## Used for question index and count
        var session = oe.currentSession();

        //## Don't show tags button when answering challenge assessment or demo assessment
        var contentEnd = '';         
        if(oe.auth.canUploadAnswers() && !oe.getChallengeData()) {            
            contentEnd = TagControlMixin.template();
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'question',
									    optionHtml: optionHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
										reviewButtonStyle: (session.get('answers').length > 0 ? '' : 'display:none;'),
                                        contentEnd: contentEnd,
                                        footer: this.footerTemplate({ nextNavButtonText: 'Next', showTimerCss: appLib.cssDisplay(session.get('showTimer')), timer: appLib.formatTimer(Math.round(oe.timer / 1000)) })
									});											

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
		
		//## Delay until view is rendered then update checkbox state after each checkbox state change
        _.delay(function() {
            $(document).on('change', 'input[type=radio]', function(e) {
                //$('input[type=radio]').checkboxradio('refresh');
                //TODO: Remove whole _delay() call?
				//appLib.log("Refresher");
            });
        }, 1000, this);
		
        return this;
    },


    //## Returns HTML for multiple true/false radio options
    buildHtmlForOptions: function (options) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        var template = this.optionTemplate;
        var optionHtml = '';

        //## Process question options
        options.each(function (option) {
            optionHtml += template(option.toJSON());
        });

        return optionHtml;
    },



    events: {
        "click #answer-button": "answerQuestion",
        "click #session-review-button": "sessionReview"
    },

    answerQuestion: function () {
        //## Ensure all questions have been answered
        if ($('input[type=radio]:checked').length != ($('input[type=radio]').length / 2)) {
            appLib.alert('Please answer all sections.');
            return;
        }

        //## Create an array of answer IDs and values
        var answers = [];
        _.each($('input[type=radio]:checked'), function (radioEl) {
            var el = $(radioEl);

            answers.push({
                //## radioEl's name is the answerId prefixed with 'question-option-'
                id: el.attr('name').replace('question-option-', ''),
                value: (el.val() == "1")
            });
        });

        //## Store the user's answer		
        this.model.answerQuestion(answers);
    },

    sessionReview: function () {
        appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
    }
});


//## MCQ Answer
var MCQAnsweredView = Backbone.View.extend({
    template: _.template(oeTemplate.get('MCQAnsweredTemplate')),
    disabledOptionTemplate: _.template(oeTemplate.get('DisabledMCQOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        AnswerViewMixin.addCommonEvents(this);
        TagControlMixin.addEvents(this);
    },

    render: function (eventName) {
        var answer = this.model.get('lastAnswer');
        var optionHtml = this.buildHtmlForOptions(this.model.get('options'), answer.get('answers'));

        //## Used for question index and count
        var session = oe.currentSession();        

		var showFinish = session.allQuestionsAnswered() && session.hasAnswersToUpload();

        var contentEnd = '';         
        if(!session.isCompleted() && oe.auth.canUploadAnswers()) {
            contentEnd += TagControlMixin.template();
            contentEnd += oe.getQuestionRatingHtml(this.model.get('id'));            
            contentEnd += oe.getQuestionFeedbackHtml(this.model.get('id'));            
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'answer',
									    optionHtml: optionHtml,
									    resultColour: oe.resultColour(answer.get('score')),
									    result: oe.resultText(answer.get('score')),
                                        questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    nextButtonText: (showFinish ? 'Finish' : 'Next Question'),	
                                        nextNavButtonText: (showFinish ? 'Finish' : 'Next'),									
                                        footer: this.footerTemplate({ nextNavButtonText: (showFinish ? 'Finish' : 'Next'), showTimerCss: appLib.cssDisplay(false), timer: '' }),
										exitAnswerReviewStyle: appLib.cssDisplay(session.isCompleted()),
                                        contentEnd: contentEnd
									});		

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    //## Returns HTML for a radio list of options
    buildHtmlForOptions: function (options, userAnswers) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        //## Copy options so as not to modify the original when displaying correct/incorrect labels
        var localOptions = new Backbone.Collection(options.toJSON());

        var template = this.disabledOptionTemplate;
        var optionHtml = '';

        //## Process question options
        localOptions.each(function (option) {
            var trueSelected = '';
            var falseSelected = '';
            var text = option.get('answerText');

            //## Get the user's response
            var currentAnswer = _.find(userAnswers, function (answer) {
                return (option.get('id') == answer.id);                
            });

            if (currentAnswer == null) {
                appLib.alert('Error - Could not find option id: ' + option.get('id'));
                return '';
            }


            //## Select the user's response radio button
            if (currentAnswer.value)
                trueSelected = 'checked';
            else
                falseSelected = 'checked';


            //## Display the result
            if (option.get('answer') == currentAnswer.value)
                option.set('answerText', text + ' - <span class="correct">Correct</span>');
            else
                option.set('answerText', text + ' - <span class="incorrect">Incorrect</span>');



            var modelData = option.toJSON();
            optionHtml += template(_.extend(modelData, { falseSelected: falseSelected, trueSelected: trueSelected }));
        });

        return optionHtml;
    }
});


//========================================================================================

//## EMQ View
var EMQView = Backbone.View.extend({
    template: _.template(oeTemplate.get('EMQTemplate')),
    alphabeticTemplate: _.template(oeTemplate.get('AlphabeticChoiceTemplate')),
    stemTemplate: _.template(oeTemplate.get('EMQQuestionStemTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        TagControlMixin.addEvents(this);        
    },

    render: function (eventName) {
        var choiceList = this.buildAlphabeticChoiceList(this.model.get('choices'));
        var choiceDropDownHtml = this.buildHtmlForChoices(this.model.get('choices'));

        var stemHtml = this.buildHtmlForStems(this.model.get('options'), choiceDropDownHtml);

        //## Used for question index and count
        var session = oe.currentSession();

        //## Don't show tags button when answering challenge assessment or demo assessment
        var contentEnd = '';         
        if(oe.auth.canUploadAnswers() && !oe.getChallengeData()) {            
            contentEnd = TagControlMixin.template();
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'question',
									    stemHtml: stemHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    choiceList: choiceList,
										reviewButtonStyle: (session.get('answers').length > 0 ? '' : 'display:none;'),
                                        contentEnd: contentEnd,
                                        footer: this.footerTemplate({ nextNavButtonText: 'Next', showTimerCss: appLib.cssDisplay(session.get('showTimer')), timer: appLib.formatTimer(Math.round(oe.timer / 1000)) })
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    //## Returns HTML for a list of options prefixed by alphabetic chars
    buildAlphabeticChoiceList: function (choices) {
        if (_.isUndefined(choices) || choices.length == 0)
            return '';
        
        var choicesHtml = '';
        var index = 0;

        var template = this.alphabeticTemplate;

        //## Process choices
        choices.each(function (choice) {		
            choicesHtml += template(_.extend(choice.toJSON(), { letter: oeConstants.alpha[index] }));
            index++;
        });

        return choicesHtml;
    },


    //## Returns HTML for drop down list of choices
    buildHtmlForChoices: function (choices) {
        if (_.isUndefined(choices) || choices.length == 0)
            return '';

        var choicesHtml = '';

        //## Process choices
        choices.each(function (choice) {
            choicesHtml += '<option value="' + choice.get('id') + '" id="' + choice.get('id') + '">' + choice.get('text') + '</option>';
        });

        return choicesHtml;
    },


    //## Returns HTML for all question stems
    buildHtmlForStems: function (stems, choiceHtml) {
        if (_.isUndefined(stems) || stems.length == 0)
            return '';


        var template = this.stemTemplate;
        var stemHtml = '';

        //## Process stems
        stems.each(function (stem) {
			var isAdditionalAnswer = (stem.get('text') == oeConstants.emqAdditionalAnswer);
			var style = (isAdditionalAnswer ? 'display:none;' : '');		
			
            stemHtml += template(_.extend(stem.toJSON(), { 
				choiceHtml: choiceHtml, 
				style: style,
				isAdditionalAnswer: (isAdditionalAnswer ? '1' : '0') 
			}));			
			
			//## Padding between the pair of answers
			if(isAdditionalAnswer)
				stemHtml += "<div style='padding-bottom:20px;'></div>";
        });

        return stemHtml;
    },



    events: {
        "click #answer-button": "answerQuestion",
        "click #session-review-button": "sessionReview"
    },

    answerQuestion: function () {
        //## Ensure all questions have been answered
		var error = '';
        var answers = [];		
		var lastValue = null;
		
        $('select').each(function (index, element) {
            var el = $(element);

            if (el.val() == -1) {
                error = 'Please answer section ' + (index + 1);
                return false;
            } else if(el.data('additional-answer') == '1' && el.val() == lastValue) {
				error = 'Section ' + index + ' and ' + (index + 1) + ' cannot have the same answer';
                return false;
			}			

			//## Track last answer value for comparison in EMI questions
			lastValue = el.val();
			
            answers.push({ 
                //## select id is prefixed with 'stem-'
                itemId: parseInt(el.attr('id').replace('stem-', ''), 10),
                answerOptionId: parseInt(el.val(), 10)
            });
        });

        if (error.length > 0) {
            appLib.alert(error);
            return;
        }


        //## Store the user's answer		
        this.model.answerQuestion(answers);
    },


    //## Could be moved into a base class
    sessionReview: function () {
        appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
    }
});


//## EMQ Answer
var EMQAnsweredView = Backbone.View.extend({
    template: _.template(oeTemplate.get('EMQAnsweredTemplate')),
    alphabeticTemplate: _.template(oeTemplate.get('AlphabeticChoiceTemplate')),
    stemTemplate: _.template(oeTemplate.get('EMQAnsweredQuestionStemTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        AnswerViewMixin.addCommonEvents(this);
        TagControlMixin.addEvents(this);
    },

    render: function (eventName) {
        var answer = this.model.get('lastAnswer');
        var choiceList = this.buildAlphabeticChoiceList(this.model.get('choices'));
        var stemHtml = this.buildHtmlForStems(this.model.get('options'), this.model.get('choices'), answer.get('answers'));

        //## Used for question index and count
        var session = oe.currentSession();
        
		var showFinish = session.allQuestionsAnswered() && session.hasAnswersToUpload();

        var contentEnd = '';         
        if(!session.isCompleted() && oe.auth.canUploadAnswers()) {
            contentEnd += TagControlMixin.template();
            contentEnd += oe.getQuestionRatingHtml(this.model.get('id'));            
            contentEnd += oe.getQuestionFeedbackHtml(this.model.get('id'));            
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'answer',
									    stemHtml: stemHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
                                        nextButtonText: (showFinish ? 'Finish' : 'Next Question'),
										nextNavButtonText: (showFinish ? 'Finish' : 'Next'),
                                        footer: this.footerTemplate({ nextNavButtonText: (showFinish ? 'Finish' : 'Next'), showTimerCss: appLib.cssDisplay(false), timer: '' }),
									    choiceList: choiceList,
									    resultColour: oe.resultColour(answer.get('score')),
									    result: oe.resultText(answer.get('score')),
										exitAnswerReviewStyle: appLib.cssDisplay(session.isCompleted()),
                                        contentEnd: contentEnd
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    //## Returns HTML for a list of options prefixed by alphabetic chars
    buildAlphabeticChoiceList: function (choices) {
        if (_.isUndefined(choices) || choices.length == 0)
            return '';
        
        var choicesHtml = '';
        var index = 0;

        var template = this.alphabeticTemplate;

        //## Process choices
        choices.each(function (choice) {
            choicesHtml += template(_.extend(choice.toJSON(), { letter: oeConstants.alpha[index] }));
            index++;
        });

        return choicesHtml;
    },


    //## Returns HTML for drop down list of choices
    buildHtmlForChoice: function (choice) {
        return '<option value="' + choice.get('id') + '" id="' + choice.get('id') + '">' + choice.get('text') + '</option>';
    },


    //## Returns HTML for all question stems
    buildHtmlForStems: function (stems, choices, answers) {
        if (_.isUndefined(stems) || stems.length == 0
            || _.isUndefined(choices) || choices.length == 0
            || _.isUndefined(answers) || answers.length == 0)
            return '';


        var template = this.stemTemplate;
        var buildHtmlForChoice = this.buildHtmlForChoice;
        var stemHtml = '';


        //## Process stems
        stems.each(function (stem) {
            //## Get the answer for this stem
            var userAnswer = _.find(answers, function (answer) {
                return (answer.itemId == stem.get('id'));
            });

            if(userAnswer == null)
                return;


            //## Get the choice for this answerId
            //## [Different syntax as it's a Backbone collection]
            var choice = choices.find(function (choice) {
                return (choice.get('id') == userAnswer.answerOptionId);
            });
			
			var correctChoice = choices.find(function(choice) {
				return (choice.get('id') == stem.get('answerId'));
			});

            if(choice == null)
                return;

            var result;
			var correctAnswerText; 
            if (userAnswer != null && userAnswer.answerOptionId == stem.get('answerId')) {
                result = '<div class="emqAnswerCorrect marginTop"><h4 class="green emqAnswer"><span class="emqHeadingBG">Correct</span></h4>';
				correctAnswerText = '<p class="emqStemCorrect"></p>';
			}			
			else {
                result = '<div class="emqAnswerWrong marginTop"><h4 class="red emqAnswer"><span class="emqHeadingBG">Incorrect</span></h4>';
				correctAnswerText = '<p class="emqStemWrong">The correct answer is: ' + correctChoice.get('text') + '</p>';
			}
			
			var style = (stem.get('text') == oeConstants.emqAdditionalAnswer ? 'visibility:hidden; height:0px;' : '');
			
            stemHtml += template(_.extend(stem.toJSON(), { 
                choiceHtml: buildHtmlForChoice(choice),
                result: result,
				correctAnswerText: correctAnswerText,
				style: style
            }));
			
			//## Padding between the pair of answers
			if(style != '')
				stemHtml += "<div style='padding-bottom:50px;'></div>";
        });

        return stemHtml;    
    }

});





//========================================================================================

//## SJQ View
var SJQView = Backbone.View.extend({
    template: _.template(oeTemplate.get('SJQTemplate')),
    optionTemplate: _.template(oeTemplate.get('SJQOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        TagControlMixin.addEvents(this);        
    },

    render: function (eventName) {
        var options = this.model.get('options');
        var optionHtml = this.buildHtmlForOptions(options);

        //## Used for question index and count
        var session = oe.currentSession();

        var selectionInfo = '(Please rank the options from 1 to ' + options.length + ' where 1 is the best and ' + options.length + ' is the worst)';

        //## Don't show tags button when answering challenge assessment or demo assessment
        var contentEnd = '';         
        if(oe.auth.canUploadAnswers() && !oe.getChallengeData()) {            
            contentEnd = TagControlMixin.template();
        }

        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'question',
									    optionHtml: optionHtml,
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
                                        selectionInfo: selectionInfo,
										reviewButtonStyle: (session.get('answers').length > 0 ? '' : 'display:none;'),
                                        contentEnd: contentEnd,
                                        footer: this.footerTemplate({ nextNavButtonText: 'Next', showTimerCss: appLib.cssDisplay(session.get('showTimer')), timer: appLib.formatTimer(Math.round(oe.timer / 1000)) })
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    //## Returns HTML for options with a textbox for rank
    buildHtmlForOptions: function (options) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        var template = this.optionTemplate;
        var optionHtml = '';

        //## Process question options
        options.each(function (option) {
            optionHtml += template(option.toJSON());
        });

        return optionHtml;
    },



    events: {
        "click #answer-button": "answerQuestion",
        "click #session-review-button": "sessionReview"
    },

    answerQuestion: function () {
        //## Ensure all options have been answered
        var answers = [];
        var ranks = [];
        var maxRank = this.model.get('options').length;

        $('input[type=number]').each(function (index, txt) {
            var el = $(txt);
            var val = el.val();
            var errorPrefix = 'Option ' + (index + 1);

            if (val.length < 1) {
                appLib.alert(errorPrefix + ' cannot be empty');
                return false;
            } else if (!appLib.isInt(val)) {
                appLib.alert(errorPrefix + ' is not an integer');
                return false;
            }

            var rank = parseInt(val, 10);
            if (rank < 1 || rank > maxRank) {
                appLib.alert(rank + ' is out of the range of 1 to ' + maxRank);
                return false;
            } else if (_.indexOf(ranks, rank) > -1) {
                appLib.alert('You have entered ' + rank + ' more than once. Please only use each number once');
                return false;
            }

            //## Store the rank and the answer
            ranks.push(rank);
            answers.push({
                //## textbox's id is the answerId prefixed with 'question-option-'
                id: parseInt(el.attr('id').replace('question-option-', ''), 10),
                rank: rank
            });
        });

        if (ranks.length != maxRank)
            return;


        //## Store the user's answer		
        this.model.answerQuestion(answers);
    },

    sessionReview: function () {
        appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
    }
});




//## SJQ Answer
var SJQAnsweredView = Backbone.View.extend({
    template: _.template(oeTemplate.get('SJQAnsweredTemplate')),
    disabledOptionTemplate: _.template(oeTemplate.get('AnsweredSJQOptionTemplate')),
    footerTemplate: _.template(oeTemplate.get('QuestionFooterTemplate')),

    initialize: function() {        
        AnswerViewMixin.addCommonEvents(this);
        TagControlMixin.addEvents(this);
    },

    render: function (eventName) {
        var answer = this.model.get('lastAnswer');
        var userChoicesHtml = this.buildHtmlForUserAnswers(this.model.get('options'), answer.get('answers'));
        var correctChoicesHtml = this.buildHtmlForCorrectAnswers(this.model.get('options'));

        //## Used for question index and count
        var session = oe.currentSession();

		var showFinish = session.allQuestionsAnswered() && session.hasAnswersToUpload();

        var contentEnd = '';         
        if(!session.isCompleted() && oe.auth.canUploadAnswers()) {
            contentEnd += TagControlMixin.template();
            contentEnd += oe.getQuestionRatingHtml(this.model.get('id'));            
            contentEnd += oe.getQuestionFeedbackHtml(this.model.get('id'));            
        }
		
        //## _.extend() copies right object properties into left object 
        var completeModel = _.extend(this.model.toJSON(),
									{
                                        view: 'answer',
									    userChoicesHtml: userChoicesHtml,
									    correctChoicesHtml: correctChoicesHtml,
									    resultColour: oe.resultColour(answer.get('score')),
									    result: oe.resultText(answer.get('score')),
									    questionIndex: session.get('questionIndex') + 1,
									    questionCount: oe.questionBank.length,
									    nextButtonText: (showFinish ? 'Finish' : 'Next Question'),
										nextNavButtonText: (showFinish ? 'Finish' : 'Next'),
                                        footer: this.footerTemplate({ nextNavButtonText: (showFinish ? 'Finish' : 'Next'), showTimerCss: appLib.cssDisplay(false), timer: '' }),
										exitAnswerReviewStyle: appLib.cssDisplay(session.isCompleted()),
                                        contentEnd: contentEnd
									});

        NotificationQuestionViewMixin.processQuestionViewModel(session, completeModel);

        //## Render the templated HTML
        $(this.el).html(this.template(completeModel));
        return this;
    },


    buildHtmlForUserAnswers: function (options, userAnswers) {
        var template = this.disabledOptionTemplate;
        var optionHtml = '';

        //## Sort user answers by rank
        var rankedAnswers = _.sortBy(userAnswers, function (answer) {
            return answer.rank;
        });


        //## Process each answer
        _.each(rankedAnswers, function (answer) {
            //## Find the text for this answer
            var option = options.find(function (option) {
                return (answer.id == option.get('id'));
            });

            var modelData = option.toJSON();
            optionHtml += template(_.extend(modelData, {}));
        });

        return optionHtml;
    },


    //## Returns HTML for a list of correct answers
    buildHtmlForCorrectAnswers: function (options) {
        if (_.isUndefined(options) || options.length == 0)
            return '';


        //## Copy options so as not to modify the original when displaying correct/incorrect labels
        var localOptions = new Backbone.Collection(options.toJSON());

        var template = this.disabledOptionTemplate;
        var optionHtml = '';

        //## Sort question options by rank
        var rankedOptions = localOptions.sortBy(function (option) {
            return option.get('rank');
        });


        _.each(rankedOptions, function (option) {
            var modelData = option.toJSON();
            optionHtml += template(_.extend(modelData, {}));
        });

        return optionHtml;
    }
});


//========================================================================================


//## Session Review
var SessionReviewView = Backbone.View.extend({
    template: _.template(oeTemplate.get('SessionReviewTemplate')),

    render: function (eventName) {
        var answered = this.model.questionsAnswered();        
        var pct = Math.round(this.model.score());

        if (answered == 0)
            pct = '?';

        var assessmentSummary = '';
        if(oe.timer > 0) {
            try {
                var numQuestions = this.model.get('numQuestions');
                var testScore = Math.round(this.model.totalScore() / numQuestions);
                assessmentSummary = 'Under test conditions you scored ' + testScore + '%<br>' + answered + ' of ' + numQuestions + ' questions were answered in ' + appLib.formatTimer(Math.round(oe.timer / 1000));
            } catch(ex) { 

            }
        }

        //## Render the templated HTML
        $(this.el).html(this.template({
            questionsAnswered: answered,
            questionsCorrect: this.model.correctAnswers(),
            percentCorrect: pct,
            challengeButtonStyle: appLib.cssDisplay(oe.getChallengeData() === null),
            isDemo: this.isDemo(),
            isChallenge: (oe.getChallengeData() !== null),
            assessmentSummary: assessmentSummary
        }));

        var _this = this;
        _.delay(function() {
            _this.uploadAnswers.call(_this);
        }, 100);        


        if(this.isDemo())
            appLib.trackEvent('Session Review', 'Demo Session Completed', '');
        else if(oe.getChallengeData() !== null)
            appLib.trackEvent('Session Review', 'Challenge Session Completed', '');
        else
            appLib.trackEvent('Session Review', 'Session Completed', '');


        return this;
    },

    events: {
        "click #uploadAnswersButton": "uploadAnswers",
		"click #reviewSession": "reviewSession",
        "click #shopLink": "shopLink"        
    },


    uploadAnswers: function () {        
        this.renderGraph();

        //## Track retries of answer upload
        if($('#uploadAnswersButton:visible').length > 0) {
            appLib.track('upload-answers-retry');
        }

        //appLib.debugLog('--------------------------');
        //appLib.debugLog('uploadAnswers @ ' + new Date());
        //appLib.debugLog('');
        //appLib.debugLog('getQuestionRatingsToUpload');

        var ratingsToUpload = oe.getQuestionRatingsToUpload();
        $('#reviewStatus').html('Uploading ratings... <img src="css/images/loader.gif" id="uploadingAnswers" />');


        //appLib.debugLog('getUploadQuestionRatingsPromise');
        
        // Could be made async, but easier for now just to do them sync        
        var _this = this;
        return new Promise(oe.getUploadQuestionRatingsPromise(ratingsToUpload))
            .then(function() {       
                //appLib.debugLog('getQuestionFeedbackToUpload');

                var feedback = oe.getQuestionFeedbackToUpload();
                $('#reviewStatus').html('Uploading question feedback... <img src="css/images/loader.gif" id="uploadingAnswers" />');                

                //appLib.debugLog('getUploadQuestionFeedbackPromise');
                return new Promise(oe.getUploadQuestionFeedbackPromise(feedback).bind(_this));
            
            }).then(function() {
                $('#reviewStatus').html('Uploading user question tags... <img src="css/images/loader.gif" id="uploadingAnswers" />');                
                return new Promise(oe.getUploadModifiedUserTagsPromise().bind(_this));

            }).then(function() {
                //appLib.debugLog('uploadAnswersAjaxPromise');
                return new Promise(_this.uploadAnswersAjaxPromise.bind(_this));

            }).catch(function(msg) {          
                //appLib.debugLog('uploadError');       
                //appLib.debugLog('msg: ' + msg);
                _this.uploadError(null, msg, msg);
            });

        //## Simpler than...?
        /*
        return new Promise(oe.getUploadQuestionRatingsPromise(ratingsToUpload))
                .then(function () {
                    return new Promise(this.uploadAnswersAjaxPromise.bind(this));
                }.bind(this))
                .catch(function (msg) {                    
                    this.uploadError(null, msg, msg);
                }.bind(this));
        */
    },

    renderGraph: function() {
        var correct = this.model.correctAnswers();
        var incorrect = this.model.wrongAnswers();
        var partial = this.model.questionsAnswered() - (correct + incorrect);

        //## Draw graph
        var pieData = [
            { label: "Correct", color: "rgba(105,190,40,1)", data: correct },
            { label: "Incorrect", color: "rgba(205,32,44,1)", data: incorrect },
            { label: "Partially Correct", color: "rgba(240,171,0,1)", data: partial }
        ];

        var pieOptions = {
            series: {
                pie: {
                    innerRadius: 0,
                    show: true
                }
            }
        };

        $.plot($("#livePie"), pieData, pieOptions);
    },
    
    uploadAnswersAjaxPromise: function (resolve, reject) {        
        var answersToUpload = oe.getAnswersToUpload();
        
        //## Only upload answers if we have some that haven't been uploaded!
        if (answersToUpload == null) {
            appLib.log(this);
            this.showHomeButton();            
            this.showKeyLearningPoints(oe.keyLearningPoints);			

            return resolve();

        } else if(oe.getChallengeData() !== null) {
            //## Completing a challenge

        } else if(!oe.auth.canUploadAnswers()) {
			//## Demo mode - fake a successful upload
            this.uploadSuccessful({ d: { ErrorMessage: null, KeyLearningPoints: null } });

            return resolve();
        }

        $('#reviewStatus').html('Uploading answers... <img src="css/images/loader.gif" id="uploadingAnswers" />');

        return oe.ajax(answersToUpload.serviceName,
            answersToUpload,
            function(data) {
                this.uploadSuccessful(data);
                return resolve();
            },
            function(xhr, msg, err) {
                this.uploadError(xhr, msg, err);
                return reject(msg);
            },
            this,
            false);
    },

    //## Fires if answers are successfully uploaded
    uploadSuccessful: function (data) {
        appLib.log('Upload successful');
        appLib.log(data);

        if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
            appLib.log('API returned warning message');
            this.uploadError(null, 'uploadSuccessful', data.d.ErrorMessage);
            return;
        }

		var keyLearningPoints = null;
		
		if(!_.isUndefined(data.d.KeyLearningPoints) && data.d.KeyLearningPoints != null && data.d.KeyLearningPoints.length > 0) {			
			keyLearningPoints = data.d.KeyLearningPoints;
		}
		
        oe.markAnswersAsUploaded(keyLearningPoints);		
		
		//## Ready for answer review
		oe.removeUnansweredQuestions();		
        oe.save();

        this.showHomeButton();
		this.showKeyLearningPoints(keyLearningPoints);
    },

    //## Fires if an error occurs during answer upload
    uploadError: function (xhr, msg, err) {
        try {
            appLib.log(err);
            appLib.log(msg);
            appLib.log(xhr);
        } catch(e) { }

        if (err != null) { 
            if(err.indexOf('Invalid token') >= 0) {
                appLib.alert('Your session has expired. Please login again.', function () { app.trigger('loginRequired', 'viewSessionResults'); });
                appLib.track('upload-answers-session-expired');
                return;

            } else if(err.indexOf('You do not have a valid subscription') >= 0) {
                appLib.confirm('Your exam subscription has expired. Please renew it in order to submit your answers.\n\n'
                    + 'Would you like to visit the BMJ OnExamination store?', 
                    function(result) {                         
                        if(result === 1)
                            appLib.openLink('http://my.onexamination.com/ShopRedirect.aspx?source=app&examId=' + oe.currentSession().get('examId'));
                    });
                appLib.track('upload-answers-subscription-expired');                
                return;
            }
        }


        $('#reviewStatus').html('Unable to upload answers, please try again.');
        $('#uploadAnswersButton').show();

        
        //## Report error to GA
        try {
            var errorTrack = 'upload-answers-error-[a:' + oe.assessmentId + ']'; 
            if(xhr != null) {
                if(!_.isUndefined(xhr.status) && xhr.status != null) {
                    errorTrack += '[status:' + xhr.status + ']';
                }

                if(!_.isUndefined(xhr.responseText) && xhr.responseText != null) {
                    errorTrack += '[len:' + xhr.responseText.length + ']';
                }                
            } 

            if(err != null) {
                errorTrack += '[err:' + err + ']';
            }

            if(msg != null) {
                errorTrack += '[msg:' + msg + ']';
            }

            errorTrack += '[network:' + navigator.connection.type + ']';

            appLib.track(errorTrack);
        } catch(e) { 
            appLib.track('upload-answers-error-exception-caught');
        }


        //## Inform user of error info
        if(err.indexOf('error') >= 0) {
            if(err == 'error') {
                err = 'Unable to upload data.';
            }

            try {
                if(navigator.connection.type === Connection.NONE) {
                    err += "\n\nNo internet connection found!";
                }
            } catch(e) { }

            appLib.alert(err, jQuery.noop, 'Upload Error');
        }
    },

    showHomeButton: function () {
        $('#reviewStatus').html('Session complete');
        $('#reviewMainMenuButton').show();
        $('#uploadAnswersButton').hide();
    },
	
	showKeyLearningPoints: function(points) {				
		if(points == null || points.length == 0) {			
			return;
		}
		
		$('#keyLearningPointsSection').show();
		var html = '';
		
		_.each(points, function(section) {
			html += '<span style="font-weight:bold;">' + section.Title + '</span><ul style="margin-top:0px;">';
			
			_.each(section.Items, function(item) { 
				html += '<li>' + item + '</li>';
			});
			
			html += '</ul>';
		});
		
		$('#keyLearningPoints').html(html);
	},
	
	reviewSession: function() {				
		app.trigger('continueQuestions', 0);
	},

    shopLink: function() {        
        appLib.openLink('http://my.onexamination.com/ShopRedirect.aspx?source=app&examId=' + oe.currentSession().get('examId'));                    
    },

    isDemo: function() {
        return oe.getChallengeData() === null && !oe.auth.canUploadAnswers();
    }
});
