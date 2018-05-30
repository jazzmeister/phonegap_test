//## ----------------- ROUTER
var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
		"AppUpdate": "appUpdate",
        "SelectExam": "examMenu",
        "SelectDemoExam": "demoExamMenu",
        "Settings": "settingsMenu",
        "GettingStarted": "gettingStartedMenu",
        "TermsConditions": "termsConditionsMenu",
        "PrivacyPolicy": "privacyPolicyMenu",
        "Login": "loginView",
        "Demo": "demoMenu",
        "RevisionTypeMenu": "revisionTypeMenu",
        "QuestionBrowser": "questionBrowserView",
		"QuestionBrowser/:hash": "questionBrowserView",
        "QuestionBrowserAnswer": "questionBrowserAnswerView",
        "SessionReview": "sessionReview",
        "PreviousQuestion": "previousQuestion",
        "NextQuestion": "nextQuestion",
        "ReceievedChallenge": "receievedChallenge",
        "ListChallenges": "listChallenges"
    },


    initialize: function () {
        //## Handle back button throughout the application
        $(document).on('click', '.back', function (event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;



        //## Fired by view
        this.on('startQuestions', function (showAnswers, showTimer) {
            oe.startNewSession(showAnswers, showTimer);
            oe.save();

            try {
                if(oe.currentSession().get('examId') !== null) {
                    appLib.setTrackVariable(oeConstants.gaVariable.examId, oe.currentSession().get('examId'));
                }               
            } catch(e) { }

            this.navigate("QuestionBrowser", { trigger: true, replace: true });
        });

        this.on('startDemoQuestions', function () {
            //## Clear username details
            oe.auth.reset();

            oe.startNewSession(true, false);
            oe.save();

            appLib.track('start-demo-questions');
            this.navigate("QuestionBrowser", { trigger: true, replace: true });
        });
		
        this.on('continueQuestions', function (questionId) {
            appLib.track('jump-to-question');
            this.navigate("QuestionBrowser/" + questionId, { trigger: true, replace: true });
        });		
		
        this.on('selectExam', function () {
            this.navigate("SelectExam", { trigger: true, replace: true });
        });

        this.on('selectRevisionType', function () {
            this.navigate("RevisionTypeMenu", { trigger: true, replace: true });
        });
		
		this.on('reloadRevisionType', function () {
            this.revisionTypeMenu();
        });

        this.on('selectMockTest', function (assessmentTemplates) {
            this.mockTestMenu(assessmentTemplates);
        });

        this.on('workSmartOptions', function (filters) {
            this.workSmartOptionsMenu(filters);
        });

        this.on('workHardOptions', function () {
            this.workHardOptionsMenu();
        });

        //## Fired by question models
        this.on('questionAnswered', function () {
            oe.save();

            try {
                appLib.track('questionAnswered-[online:' + (appLib.isOnline() ? 'Y' : 'N') + ']');
            } catch(e) { }

            //## Show the answer section
            this.navigate("QuestionBrowserAnswer", { trigger: true, replace: true });
        });

        this.on('viewSessionResults', function () {
            this.navigate("SessionReview", { trigger: true, replace: true });
        });

        this.on('loginRequired', function (destination) {
            //## Clear user login details
            oe.auth.reset();

            if (_.isUndefined(destination))
                oe.destination = null;
            else
                oe.destination = destination;

            this.navigate("Login", { trigger: true, replace: true });
        });

        this.on('home', function () {
            //## Return to home screen			
            this.navigate("", { trigger: true, replace: true });
        });
		
		this.on('appUpdate', function () {            
            this.navigate("AppUpdate", { trigger: true, replace: true });
        });


        this.on('login', function () {            
            this.navigate("Login", { trigger: true, replace: true });
        });

        this.on('questionBrowser', function () {            
            this.navigate("QuestionBrowser", { trigger: true, replace: true });
        });

        this.on('receievedChallenge', function () {            
            this.navigate("ReceievedChallenge", { trigger: true, replace: true });
        });

        this.on('showNotificationQuestion', function () {            
            var view;

            var q = oe.notificationQuestionBank.at(0);

            appLib.log('Added notification session');

            oe.sessions.add(new Session({
                numQuestions: 1,
                showAnswer: true,
                showTimer: false,

                //## HACK: Save the examId - use the oe.selectedExamId
                examId: 0,
                sessionType: 'notification'
            }));

            if (q.get('type') == QuestionTypes.MCQ)
                view = new MCQView({ model: q });
            else if (q.get('type') == QuestionTypes.EMQ)
                view = new EMQView({ model: q });
            else if (q.get('type') == QuestionTypes.SJQ || q.get('type') == QuestionTypes.SJT)
                view = new SJQView({ model: q });
            else if (q.get('type') == QuestionTypes.NOM)
                view = new NOMView({ model: q });
            else
                view = new QuestionBrowserView({ model: q });

            this.changePage(view);
        });        

        //## Load data?
        oe.load();
    },



    //##===================== ROUTE METHODS

    //## Home view
    home: function () {
        appLib.track('home');

        this.changePage(new HomeView({ model: oe.currentSession() }));
    },
	
	//## App Update view
    appUpdate: function () {
        appLib.track('appUpdate');

        this.changePage(new AppUpdateView());
    },


    //## Exam menu
    examMenu: function () {
        appLib.track('exam menu');

        this.changePage(new ExamView({ model: oe.auth }));
    },

    //## Demo Exam menu
    demoExamMenu: function () {
        appLib.track('demo exam menu');

        this.changePage(new DemoExamView({ model: oe.auth }));
    },

    //## Settings 
    settingsMenu: function () {
        appLib.track('settings');

        this.changePage(new SettingsView({ model: oe.auth }));
    },

    //### Getting Started
    gettingStartedMenu: function () {
        appLib.track('getting-started');

        this.changePage(new GettingStartedView({ model: oe.currentSession }));
    },

    //### Terms & Conditions
    termsConditionsMenu: function () {
        appLib.track('terms');

        this.changePage(new TermsConditionsView({ model: oe.currentSession }));
    },


    //### Privacy Policy
    privacyPolicyMenu: function () {
        appLib.track('privacy');

        this.changePage(new PrivacyPolicyView({ model: oe.currentSession }));
    },


    //## Login
    loginView: function () {
        if (oe.auth.get('key') != null) {
            //## Don't login - key already present
            this.navigate('SelectExam', { trigger: true, replace: true });
            return;
        }

        appLib.track('login');

        this.changePage(new LoginView({ model: oe.auth }));
    },


    //## Demo menu
    demoMenu: function () {
        appLib.track('demo-menu');

        this.changePage(new DemoView());
    },


    //## Revision Type Menu view
    revisionTypeMenu: function () {
        appLib.track('revision-type-menu');

        this.changePage(new RevisionTypeMenuView({ model: null }));
    },


    //## Mock Test Menu view
    mockTestMenu: function (assessmentTemplates) {
        appLib.track('mock-test-menu');

        this.changePage(new MockTestMenuView({ model: null, assessmentTemplates: assessmentTemplates }));
    },


    //## Work Smart Options Menu view
    workSmartOptionsMenu: function (filters) {
        appLib.track('work-smart-options-menu');

        this.changePage(new RevisionOptionsMenuView({ model: null, mode: 'WorkSmart', filters: filters }));
    },


    //## Work Hard Options Menu view
    workHardOptionsMenu: function () {
        appLib.track('work-hard-options-menu');

        this.changePage(new RevisionOptionsMenuView({ model: null, mode: 'WorkHard' }));
    },


    //## Question view
    questionBrowserView: function (questionIndex) {
        if (oe.currentSession().isCompleted() && oe.currentSession().hasAnswersToUpload()) {
            //## Jump to the review screen as there are answers to upload
            this.navigate("SessionReview", { trigger: true, replace: true });
            return;
        }

		if(!_.isUndefined(questionIndex) && oe.currentSession().get('questionIndex') != questionIndex && appLib.isInt(oe.currentSession().get('questionIndex')))
			oe.currentSession().set('questionIndex', parseInt(questionIndex, 10));

		//## Ensure in range
		if(oe.currentSession().get('questionIndex') >= oe.questionBank.length)
			oe.currentSession().set('questionIndex', 0);
		
        var qbank = oe.questionBank;        

        //## Is this a notification question session?
        if(oe.currentSession().get('sessionType') === 'notification') {
            qbank = oe.notificationQuestionBank;

            appLib.trackEvent('Notification', 'daily-question-viewed', '');
        }
        

        var q = qbank.at(oe.currentSession().get('questionIndex'));

        if (q.isAnswered()) {
            //## If answered then show selected answer & explanation		
            this.navigate("QuestionBrowserAnswer", { trigger: true, replace: true });
            return;
        }


        appLib.track('view-question');
        
        /*
        if(q.get('text').indexOf('<img') > 0 || q.get('comment').indexOf('<img') > 0)
            appLib.log('=== Contains Image ===');
        */

        var view;
        if (q.get('type') == QuestionTypes.MCQ)
            view = new MCQView({ model: q });
        else if (q.get('type') == QuestionTypes.EMQ)
            view = new EMQView({ model: q });
        else if (q.get('type') == QuestionTypes.SJQ || q.get('type') == QuestionTypes.SJT)
            view = new SJQView({ model: q });
        else if (q.get('type') == QuestionTypes.NOM)
            view = new NOMView({ model: q });
        else
            view = new QuestionBrowserView({ model: q });

        this.changePage(view);
    },


    //## Answered question view
    questionBrowserAnswerView: function () {
		var isSessionCompleted = oe.currentSession().isCompleted();

        if (isSessionCompleted && oe.currentSession().hasAnswersToUpload()) {
            //## Jump to the review screen as there are answers to upload
            this.navigate("SessionReview", { trigger: true, replace: true });
            return;
        }
        else if (!isSessionCompleted && !oe.currentSession().get('showAnswer')) {
            //## Skip showing the answer
            this.navigate("NextQuestion", { trigger: true, replace: true });
            return;
        }



        var qbank = oe.questionBank;        

        //## Is this a notification question session?
        if(oe.currentSession().get('sessionType') === 'notification') {
            qbank = oe.notificationQuestionBank;

            appLib.trackEvent('Notification', 'daily-question-answer-viewed', '');
        }
        

        var q = qbank.at(oe.currentSession().get('questionIndex'));

        if (!q.isAnswered()) {
            //## Security: If question isn't answered then show question - not explanation!		
            this.navigate("QuestionBrowser", { trigger: true, replace: true });
            return;
        }

		if(!isSessionCompleted)
			appLib.track('view-answer');

        var view;
        if (q.get('type') == QuestionTypes.MCQ)
            view = new MCQAnsweredView({ model: q });
        else if (q.get('type') == QuestionTypes.SJQ || q.get('type') == QuestionTypes.SJT)
            view = new SJQAnsweredView({ model: q });
        else if (q.get('type') == QuestionTypes.EMQ)
            view = new EMQAnsweredView({ model: q });
        else if (q.get('type') == QuestionTypes.NOM)
            view = new NOMAnsweredView({ model: q });
        else
            view = new QuestionBrowserAnswerView({ model: q });
        
        this.changePage(view);
    },


    //## Review the current session
    sessionReview: function () {
        appLib.track('session-review');

        //## Security: Should we ensure all questions are answered?
        oe.currentSession().set('completed', true);
        oe.save();

        var view = new SessionReviewView({ model: oe.currentSession() });
        this.changePage(view);
    },


    //## Request previous question
    previousQuestion: function () {
        this.moveToPreviousQuestion();

        oe.save();

        appLib.track('previous-question');
        this.navigate("QuestionBrowser", { trigger: true, replace: true });
    },


    //## Request next question
    nextQuestion: function () {
        if (oe.currentSession().allQuestionsAnswered() && oe.currentSession().hasAnswersToUpload()) {
            //## Show session review
            this.navigate("SessionReview", { trigger: true, replace: true });
            return;
        }

        this.moveToNextQuestion();

        oe.save();

        appLib.track('next-question');
        this.navigate("QuestionBrowser", { trigger: true, replace: true });
    },


    //## Received an assessment challenge from an onExam user
    receievedChallenge: function() {
        appLib.track('received-challenge');

        this.changePage(new ReceievedChallengeView({ model: null }));
    },


    listChallenges: function() {
        appLib.track('list-challenges');        

        this.changePage(new ListChallengesView({ model: null }));  
    },






    //##================= HELPER METHODS

    //## Move to the previous question
    moveToPreviousQuestion: function () {
        var index = oe.currentSession().get('questionIndex') - 1;
		var skipAnsweredQuestions = (!oe.currentSession().get('showAnswer') && !oe.currentSession().isCompleted());

		while(true) {	
			if (index < 0)
				index = oe.questionBank.length - 1;

			if (!skipAnsweredQuestions || !oe.questionBank.at(index).isAnswered())
				break;
			
			index--;
		}			
			
        oe.currentSession().set('questionIndex', index);
    },

    //## Move to the next question
    moveToNextQuestion: function () {
        var index = oe.currentSession().get('questionIndex') + 1;
		var skipAnsweredQuestions = (!oe.currentSession().get('showAnswer') && !oe.currentSession().isCompleted());
		
		while(true) {					
			if (index >= oe.questionBank.length)
				index = 0;
			
			if (!skipAnsweredQuestions || !oe.questionBank.at(index).isAnswered())
				break;
			
			index++;
		}

        oe.currentSession().set('questionIndex', index);
    },


    slideLeft: function(leavePage, enterPage) {
        var defaults = {timing: 'cubic-bezier(.1, .7, .1, 1)', delay: 0, duration: 0.8};        

        ons.animit.runAll(
            ons.animit(enterPage)
                .saveStyle()
                .queue({
                  css: {
                    transform: 'translate3D(100%, 0, 0)',
                  },
                  duration: 0
                })
                .wait(defaults.delay)
                .queue({
                  css: {
                    transform: 'translate3D(0, 0, 0)',
                  },
                  duration: defaults.duration,
                  timing: defaults.timing
                })        
                /*.queue(done => {
                  this.backgroundMask.remove();
                  //unblock();
                  //callback();
                  done();
            })*/,

            ons.animit(leavePage)
                .saveStyle()
                .queue({
                  css: {
                    transform: 'translate3D(0, 0, 0)'
                  },
                  duration: 0
                })
                .wait(defaults.delay)
                .queue({
                  css: {
                    transform: 'translate3D(-100%, 0, 0)'
                  },
                  duration: defaults.duration,
                  timing: defaults.timing
                })
                .queue(function() {
                    $(leavePage).parent().remove();
                })
        );        
    },


    slideRight: function(leavePage, enterPage) {
        var defaults = {timing: 'cubic-bezier(.1, .7, .1, 1)', delay: 0, duration: 0.8};        

        ons.animit.runAll(
            ons.animit(enterPage)
                .saveStyle()
                .queue({
                  css: {
                    transform: 'translate3D(-100%, 0, 0)',
                  },
                  duration: 0
                })
                .wait(defaults.delay)
                .queue({
                  css: {
                    transform: 'translate3D(0, 0, 0)',
                  },
                  duration: defaults.duration,
                  timing: defaults.timing
                })        
                /*.queue(done => {
                  this.backgroundMask.remove();
                  //unblock();
                  //callback();
                  done();
            })*/,

            ons.animit(leavePage)
                .saveStyle()
                .queue({
                  css: {
                    transform: 'translate3D(0, 0, 0)'
                  },
                  duration: 0
                })
                .wait(defaults.delay)
                .queue({
                  css: {
                    transform: 'translate3D(100%, 0, 0)'
                  },
                  duration: defaults.duration,
                  timing: defaults.timing
                })
                .queue(function() {
                    $(leavePage).parent().remove();
                })
        );        
    },


    //## Change page
    changePage: function (page) {        
        appLib.log('====> Page change start');
                       
        var leavingPage = $('.mobilePage ons-page')[0];

        $(page.el).addClass('mobilePage');

        if(oeBeta.isBetaMode) {            
            $(page.el).addClass('betaMode');
        }
		
		try {			
			//## Android issue: status bar sometimes shows (e.g. on-screen keyboard / switched back to app) and overlays webview, so hide on page change.
			if(appLib.getDevice() === 'android')
				StatusBar.hide();
		} catch(ex) { }
		
        try {
            page.render();
        } catch(ex) {
            appLib.log('Page change exception: ' + ex);
        }
          
        //## Remove all existing pages
        ////////////////////////////////// DISABLED WHILE TESTING TRANSITIONS $('.mobilePage').remove();  --- now handled by .slide()

        var enterPage = $(page.el).find('ons-page')[0];                        

        $('body').append($(page.el));
		
        if($(enterPage).data('side') === 'right')
            this.slideRight(leavingPage, enterPage);
        else
            this.slideLeft(leavingPage, enterPage);
        

        //## We don't want to slide the first page
        if (this.firstPage) {
            this.firstPage = false;

            //## Create loading mask 
            $('body').append('<div id="block-ui"><span id="spinner"></span><br /><h1>Loading...</h1></div>');
        }
         
		//## Ensure question area is at least as tall as the device height
		$('.questionPage').css('min-height', $(window).height() - 170);
		$('.answerPage').css('min-height', $(window).height() - 170);
		
		
        //$.mobile.changePage($(page.el), { changeHash: false, transition: 'none' });
        
        /*                             
        if(typeof(page.postRender) == "function")
            page.postRender();                                     
        */
                            
        var title = '[No Title]';
        try {
            title = '[' + $('h1:first', page.el).text() + ']';
        } catch(e) { }

        appLib.log('====> Page change complete ' + title);
    }
});
