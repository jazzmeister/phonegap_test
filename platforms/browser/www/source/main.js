var oeConstants = {	
    alpha: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

    baseUrl: 'https://api.onexamination.com/1.1.5/Assessment/AssessmentService.asmx/',
    //baseUrl: 'http://devapi.onexamination.com/1.1.5/Assessment/AssessmentService.asmx/',
	//baseUrl: 'http://localhost:50584/Assessment/AssessmentService.asmx/',
    //baseUrl: 'https://api.onexamination.com/beta/Assessment/AssessmentService.asmx/',
    betaBaseUrl: 'https://api.onexamination.com/beta/Assessment/AssessmentService.asmx/',

    //======================= Constants
    version: '1.9.82',
    mrcpPart1: 1,
	
	emqAdditionalAnswer: '{{AdditionalAnswer}}',

    coreQuestionsTag: 'Core Questions',

    //## Google Analytics (Dimension) Variables
    gaVariable: { 
        userId: 1, 
        institutionId: 2, 
        examId: 3 
    }
};


var oeTemplate = {
    get: function(id) {
        var templateFile = id + '.html';

        if(_.isUndefined(oeTemplates[templateFile])) {
            appLib.log('Unable to find template: ' + templateFile);
            throw 'Unable to find template: ' + templateFile;
        }

        return oeTemplates[templateFile];
    }
};


var oeBeta = {
    //## Allow user access to Beta mode? Requires exam that expires > 2050
    allowBetaMode: false,
    
    //## Is Beta mode active?
    isBetaMode: false    
};


//## Global object OE --- to be persisted to file or local storage
var oe = {
    //======================= Properties
    //## Questions
    questionBank: new QuestionBank(),

    //## Notification Questions
    notificationQuestionBank: new QuestionBank(),

    //## User
    auth: new Auth(),

    //## Sessions
    sessions: new Sessions(),

    //## Assessment Id
    assessmentId: null,

    //## Destination once logged in
    destination: null,

    //## Selected exam - this may be abandoned so don't disrupt the current session's examId
    selectedExamId: null,

    //## Local copy of demo exams - initially downloaded via API
    demoExams: [],

    //## Local copy of demo questions - initially downloaded via API
    //## Format: Array of { examId: int, questions: QuestionBank, updatedAt: int }
    demoQuestions: [],

    //## Flag to download images
    downloadImages: true,

	//## Key learning points
	keyLearningPoints: null,
	
	//## Last used revision type options
	revisionTypeOptions: null,

    //## Question ratings - { qid:int, rating:int, uploaded:bool }
    questionRatings: null,

    //## Question feedback - { qid:int, feedback:string }
    questionFeedback: null,    

    //## Has a friend been challenged to this assessment?
    friendChallenged: null,

    //## { email, pin OR challengeId }
    challenge: null,

    //## user/global tags
    tags: new TagList(),

    //## Session timer
    lastTimer: 0,
    timer: 0,

    //## Summary of mock test assessment
    assessmentSummary: '',

    //======================= Methods
    addAjaxOptions: function (options) {
        //return _.extend(options, { timeout: 5000, dataType: 'jsonp' });			//## Enable for Chrome testing
        return _.extend(options,
                        {
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            type: 'POST',
                            cache: false
                        }); 					//## Enable for Cordova testing
    },


    ajax: function (serviceName, data, successFunc, errorFunc, context, applyMask) {
        if(applyMask === undefined) 
            applyMask = true;

        if(applyMask) appLib.maskUI(true);

        appLib.log(JSON.stringify(data), 'color:yellow; background-color:black;');
				
        var ajaxUrl = bottle.container.api.getUrl(serviceName);
        
		var options = {
            url: ajaxUrl,
            data: JSON.stringify(data),
            success: function (data, textStatus) {
                if(applyMask) appLib.maskUI(false);

                appLib.log('Ajax success - ' + ajaxUrl, 'color:white; background-color:green;');
                appLib.log(data);

                if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
                    appLib.debugLog('API Error Message: ' + serviceName + ' - ' + data.d.ErrorMessage);
                    appLib.log('API returned warning message');
                    errorFunc.call(this, data, '', data.d.ErrorMessage);
                } else {
                    appLib.debugLog('API Success: ' + serviceName);
                    appLib.log('Calling success func', 'color:green;');                    
                    successFunc.call(this, data, textStatus);
                }
            },
            error: function (xhr, msg, err) {
                if(applyMask) appLib.maskUI(false);

                appLib.debugLog('API Error: ' + serviceName + ' - ' + err + ' (' + msg + ') ' + JSON.stringify(xhr));
                appLib.log('Ajax error: ' + err + ' (' + msg + ')', 'color:white; background-color:red;');
                appLib.log(xhr);
                errorFunc.call(this, xhr, msg, err);
            }
        };

        options = oe.addAjaxOptions(options);        

        appLib.log('Calling ' + oeConstants.baseUrl + serviceName + ' via ' + options.type + ' as ' + options.contentType, 'color:blue;');

        if(context !== undefined) {
            options = _.extend(options, { context: context });
            appLib.log('Using specified context');
        }

        jQuery.ajax(options);
    },



    reset: function () {
        this.auth.reset();
        this.questionBank.reset();
        this.notificationQuestionBank.reset();
        this.sessions.reset();

        //## Reset challenge data
        this.challenge = null;
        this.friendChallenged = null;

        this.timer = 0;
        this.assessmentSummary = '';

        //## Delete saved data
        window.localStorage.removeItem('oe');

        try {
            appLib.setTrackVariable(oeConstants.gaVariable.userId, '');
            appLib.setTrackVariable(oeConstants.gaVariable.institutionId, '');
            appLib.setTrackVariable(oeConstants.gaVariable.examId, '');
        } catch(e) { }
    },



    startNewSession: function (showAnswers, showTimer) {
        //## Clear answers in the question bank
        this.questionBank.each(function (question) {
            question.clearAnswer();
        });        

        //## Clear all sessions
        this.sessions.reset();

        //## Reset session timer / mock test assessment summary
        this.timer = 0;
        this.assessmentSummary = '';

        //## Add a new session
        this.sessions.add(new Session({
            numQuestions: this.questionBank.length,
            showAnswer: showAnswers,
            showTimer: showTimer,

            //## HACK: Save the examId - use the oe.selectedExamId
            examId: this.selectedExamId
        }));
    },

    /* Session can only be ended by uploading answers and getting new questions
    endCurrentSession: function() {
    this.currentSession().set('completed', true);
    },
    */

    //## Could be null, but to skip many FlowType bugs marked as Session (not null)
    currentSession: function () /* :Session */ {
        if (this.sessions.length == 0)
            return null;

        return this.sessions.at(this.sessions.length - 1);
    },


    //## Workaround to not having an array of questionBanks for different question sources (i.e. demo, notification questions, assessment questions)
    getQuestionBank: function() {
        return this.questionBank;
    },




    //## Load / Save data
    load: function () {
        var json = window.localStorage.getItem('oe');
        if (json == null) {
            appLib.log('No data to load');
            return;
        }

        var data = JSON.parse(json);

        this.auth = new Auth(data.auth);
        try { 
            if(this.auth.get('userId') !== null) {
                appLib.setTrackVariable(oeConstants.gaVariable.userId, this.auth.get('userId'));
            }

            if(this.auth.get('institutionDescription') !== null) {
                appLib.setTrackVariable(oeConstants.gaVariable.institutionId, this.auth.get('institutionDescription'));
            }                     
        } catch(e) { }

        //## Notification question(s) are being stored in the oe.session list, but shouldn't be loaded

        appLib.log('Loading sessions: ' + JSON.stringify(data.sessions).split('{').join('<').split('}').join('>'));

        this.sessions = new Sessions(data.sessions);
        this.questionBank = new QuestionBank(data.questionBank);
        this.notificationQuestionBank = new QuestionBank();
        this.tags = new TagList(data.tags);

        
        //## Quick fix for sessions.currentSession() 'lastAnswers' being copies rather than references of questionBank 'answers'
        //## Clear loaded session answers and user question bank answers
        oe.currentSession().set('answers', new UserAnswers());
        oe.questionBank.each(function(q) { 
          var answer = q.get('lastAnswer');
          if(answer != null) {
            oe.currentSession().get('answers').add(answer);
          }
        });


        try {
            if(this.auth.get('userId') !== null && this.currentSession().get('examId') !== null) {
                appLib.setTrackVariable(oeConstants.gaVariable.examId, this.currentSession().get('examId'));
            }               
        } catch(e) { }


        this.assessmentId = data.assessmentId;
        this.selectedExamId = data.selectedExamId;

        //## Demo exams
        this.demoExams = data.demoExams;

        //## Demo questions - array of { examId: int, questions: questionObject, updatedAt: int }
        this.demoQuestions = data.demoQuestions;
		
		this.keyLearningPoints = data.keyLearningPoints;
		
		this.revisionTypeOptions = data.revisionTypeOptions;

        this.questionRatings = data.questionRatings;
        this.questionFeedback = data.questionFeedback;

        this.friendChallenged = data.friendChallenged;
        this.challenge = data.challenge;



        this.timer = 0;
        appLib.log('Timer is zero');

        timerStr = window.localStorage.getItem('oeTimer');
        if (timerStr === null || !appLib.isInt(timerStr))
            return;

        this.timer = timerStr * 1;
        appLib.log('Loaded timer of ' + this.timer);
    },

    save: function () {
        window.localStorage.setItem('oe', JSON.stringify(this));

        appLib.log('Saved state');
    },



    //## Get the exam's mock tests
    getMockTests: function (onSuccess, examId) {
        oe.ajax('GetMockTests',
                {
                    token: oe.auth.get('key'),
                    examId: examId
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.MockTests)) {
                        appLib.alert('Mock tests could not be downloaded', jQuery.noop, 'Get Mock Tests');
                        return;
                    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Get Mock Tests');
                        return;
                    }                    

                    onSuccess(data.d.MockTests);
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to download mock tests', jQuery.noop, 'Get Mock Tests');
                });
    },


    //## Get the user's exam list
    getUserExams: function (context, onSuccess) {
        oe.ajax('GetActiveExams',
				{
				    token: oe.auth.get('key')
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.Exams)) {
				        appLib.alert('Your exams could not be downloaded', jQuery.noop, 'Get User Exams');
				        return;
				    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
				        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Get User Exams');
				        return;
				    } else if (data.d.Exams.length == 0) {
                        appLib.alert('You do not have any active subscriptions', jQuery.noop, 'Get User Exams');
                        return;
					}

				    onSuccess(context, data.d.Exams, data.d.CurrentExamId);
				},
				function (xhr, msg, ex) {
				    if (oe.isLoginExpired(ex))
				        return;

				    appLib.alert('Unable to download your exams', jQuery.noop, 'Get User Exams');
				});
    },


    setUserExamDate: function(examId, examDate, onSuccess, onFailure) {
        oe.ajax('SetUserExamDate',
                {
                    token: oe.auth.get('key'),
                    examId: examId,
                    examDate: examDate
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d)) {
                        appLib.alert('Unable to update your exam date.', jQuery.noop, 'Set Exam Date');
                        return;
                    } else if (data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Set Exam Date');
                        return;
                    }

                    return onSuccess();
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to update your exam date', jQuery.noop, 'Set Exam Date');
                });
    },

    //## Get question types for an exam
    getQuestionTypes: function (onSuccess, examId) {
		var context = this;
	
        oe.ajax('GetQuestionTypes',
				{
				    token: oe.auth.get('key'),
				    examId: examId,
				    excludeNotSuitableForMobile: true
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.QuestionTypes)) {
				        appLib.alert('Exam question types could not be downloaded', jQuery.noop, 'Question Types');
				        return;
				    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
				        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Question Types');
				        return;
				    }

					//## Call success func with original context for [this]
				    $.proxy(onSuccess, context, data.d.QuestionTypes).apply();
				},
				function (xhr, msg, ex) {
				    if (oe.isLoginExpired(ex))
				        return;

				    appLib.alert('Unable to download exam question types', jQuery.noop, 'Question Types');
				});
    },


    //## Get question tags for user's exam
    getQuestionTags: function (onSuccess, onFailure, examId) {
        var context = this;
    
        oe.ajax('GetTags',
                {
                    token: oe.auth.get('key'),
                    examId: examId                    
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.Tags)) {
                        appLib.alert('Exam question tags could not be downloaded', jQuery.noop, 'Question Tags');
                        return onFailure();
                    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Question Tags');
                        return onFailure();
                    }

                    //## Call success func with original context for [this]
                    $.proxy(onSuccess, context, data.d.Tags).apply();
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to download exam question tags', jQuery.noop, 'Question Tags');
                    return onFailure();
                });
    },


    setAssessmentTags: function(tags) { 
        oe.tags = new TagList();
        
        if(tags !== null) {
            oe.tags.addTags(tags);
        }
    },


    getTagsForQuestion: function(qid) {         
        appLib.log('getTagsForQuestion(' + qid + ')');
        return oe.tags.getVisibleTags(qid);
    },


    addQuestionTag: function(qid, tagText) {
        return oe.tags.addUserTag(qid, tagText);
    },

    deleteQuestionTag: function(qid, tagText) {
        return oe.tags.removeUserTag(qid, tagText);
    },


    //## Get assessment tags
    getAssessmentTagsFunction: function (assessmentId, applyMask) {
        return function(resolve, reject) {            
            oe.ajax('GetAssessmentTags',
                {
                    token: oe.auth.get('key'),
                    assessmentId: assessmentId                    
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.Tags)) {
                        appLib.alert('Assessment tags could not be downloaded', jQuery.noop, 'Assessment Tags');

                        reject();
                        return;

                    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Assessment Tags');

                        reject();
                        return;
                    }

                    oe.setAssessmentTags(data.d.Tags);

                    resolve();
                },
                function (xhr, msg, ex) {
                    reject();

                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to download assessment tags', jQuery.noop, 'Assessment Tags');
                }, undefined, applyMask);
        };
    },



    getUploadModifiedUserTagsPromise: function () {        
        return function(resolve, reject) {  
            appLib.log('running getUploadModifiedUserTagsPromise');
            
            //## Don't call API if there aren't any modified tags to upload
            var modifiedTags = oe.tags.getModifiedTags();
            if(modifiedTags.length === 0)
                return resolve();


            oe.ajax('UpdateQuestionTags',
                {
                    token: oe.auth.get('key'),
                    tags: modifiedTags        
                },
                function (data) {
                    if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        return reject(data.d.ErrorMessage);
                    }

                    //## Clear tags
                    oe.tags = new TagList();

                    return resolve();
                },
                function (xhr, msg, errorThrown) {
                    reject(errorThrown);

                    if (oe.isLoginExpired(errorThrown))
                        return;

                    appLib.alert(errorThrown, jQuery.noop, 'Upload Tags');
                },
                this,
                false);
        };
    },



    /* Set push notification time (for all devices registered to user's account) */
    setNotificationTime: function (onSuccess /* :function */, onFailure /* :function */, notificationTime /* :int */) {
        var context = this;
    
        oe.ajax('SetNotificationTime',
                {
                    token: oe.auth.get('key'),
                    notificationTime: notificationTime                    
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d)) {
                        appLib.alert('Unable to set notification time', jQuery.noop, 'Daily Notification');
                        return onFailure();
                    } else if (data.d.length > 0) {
                        appLib.alert(data.d, jQuery.noop, 'Daily Notification');
                        return onFailure();
                    }

                    //## Call success func with original context for [this]
                    $.proxy(onSuccess, context).apply();
                },
                function (xhr, msg, ex) {                    
                    appLib.alert('Unable to set notification time.', jQuery.noop, 'Daily Notification');
                    return onFailure();
                });
    },
    
    /* Get push notification time */
    getNotificationTime: function (onSuccess, onFailure) {
        var context = this;
    
        oe.ajax('GetNotificationTime',
                {
                    token: oe.auth.get('key'),                    
                },
                function (data, textStatus) {
                    if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        appLib.alert('Unable to get notification time. \n\n' + data.d.ErrorMessage, jQuery.noop, 'Daily Notification');
                        return onFailure();                    
                    }

                    //## Call success func with original context for [this]
                    $.proxy(onSuccess, context, data.d.NotificationTime).apply();
                },
                function (xhr, msg, ex) {                    
                    appLib.alert('Unable to get notification time.', jQuery.noop, 'Daily Notification');
                    return onFailure();
                });
    },


    getNotificationQuestions: function(onSuccess, onFailure) {
        var context = this;

        //## Get last active token    
        var token = (oe.isLoggedIn() ? oe.auth.get('key') : oe.getLastToken());

        oe.ajax('GetNotificationQuestions',
                {
                    token: token,                    
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.Questions)) {
                        appLib.alert('Unable to get notification question', jQuery.noop, 'Daily Notification');
                        return onFailure(null, '');
                    } else if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        appLib.alert('Unable to get notification question. \n\n' + data.d.ErrorMessage, jQuery.noop, 'Daily Notification');
                        return onFailure(null, '');                    
                    }

                    //## Call success func with original context for [this]
                    //$.proxy(onSuccess, context, data.d.Questions).apply();
                    onSuccess(data.d.Questions);
                },
                function (xhr, msg, ex) {                    
                    //appLib.alert('Unable to get Notification question. \n\n' + msg, jQuery.noop, 'Daily Notification');
                    return onFailure(xhr, msg, ex);
                });
    },





	getWorkHardOptions: function(numQuestions, questionTypes) {
		//questionTypeOptions: questionTypes
        var questionTypeOptions = [];

        //## Apply questionTypes filters if specified
        if (questionTypes != null) {
            var qt = _.map(questionTypes, function (type) {
                return {
                    NumberOfQuestions: 0,
                    QuestionType: type
                };
            });

            questionTypeOptions = qt;
        }

        
        var optionsWrapper = {
            AssessmentType: 'WorkHardMobile',
            UserId: oe.auth.get('userId'),
            DisableImageZoom: true,

            QuestionFilter: {
                ExamId: oe.selectedExamId,
                ExcludeNotSuitableForMobileDevices: true,
                ExcludeMediaQuestions: false,

                QuestionTypes: questionTypeOptions
            }
        };


        var options = {
            token: oe.auth.get('key'),
            numberOfQuestions: numQuestions,
            options: optionsWrapper
        };
		
		return options;
	},
	
	
	//## Get status of specified work hard exam
	getWorkHardStatus: function(onSuccess, questionTypes) {
		var options = oe.getWorkHardOptions(0, questionTypes);
		var context = this;
		
		oe.ajax('GetWorkHardStatus',
				options,
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.WorkHard) || _.isUndefined(data.d.WorkHard.QuestionsAnswered) || _.isUndefined(data.d.WorkHard.TotalQuestions)) {
				        appLib.alert('No work hard statistics could be downloaded', jQuery.noop, 'Work Hard Status');
				        return;
				    }

				    $.proxy(onSuccess, context, data.d.WorkHard.QuestionsAnswered, data.d.WorkHard.TotalQuestions).apply();
				},
				function (xhr, msg, ex) {
				    if (oe.isLoginExpired(ex))
				        return;

				    if (msg.indexOf('No questions found') != -1)
				        appLib.alert('No question statistics match the selected filters', jQuery.noop, 'Work Hard Status');
				    else
				        appLib.alert('Unable to download work hard statistics', jQuery.noop, 'Work Hard Status');
				});
	},
	

	//## Download work hard questions
    workHard: function (onSuccess, numQuestions, questionTypes) {
		var options = oe.getWorkHardOptions(numQuestions, questionTypes);
        
        //## Request questions
        oe.ajax('GetWorkHardQuestions',
            options,
            function (data, textStatus) {
                if (_.isUndefined(data.d) || _.isUndefined(data.d.WorkHard) || _.isUndefined(data.d.WorkHard.Questions) || _.isUndefined(data.d.WorkHard.AssessmentId)) {
                    appLib.alert('No work hard questions could be downloaded', jQuery.noop, 'Work Hard');
                    return;
                }

                oe.clearChallengeData();

                var workhardData = data.d.WorkHard;

                var getQuestionRatings = oe.getAssessmentQuestionRatingsFunction(workhardData.AssessmentId, false);
                var getAssessmentTags = oe.getAssessmentTagsFunction(workhardData.AssessmentId, false);

                var failureFunc = function (error) {
                    appLib.maskUI(false);

                    var msg = 'No question meta data could be downloaded';

                    if(error == 'Unable to download question image') {    
                        msg = error + '\n\nPlease check your internet connection and try again';
                    }

                    appLib.alert(msg, jQuery.noop, 'Work Hard');
                };                

                Promise.all([new Promise(getQuestionRatings), new Promise(getAssessmentTags)])
                        .then(function() {  
                            oe.loadQuestions(workhardData.Questions,
                                             workhardData.AssessmentId,
                                             oe.downloadImages,
                                             onSuccess,
                                             failureFunc);                    

                        }).then(undefined, function(error) {                                                                    
                            failureFunc(error);
                        });        
            },
            function (xhr, msg, ex) {
                if (oe.isLoginExpired(ex))
                    return;

                if (msg.indexOf('No questions found') != -1)
                    appLib.alert('No questions match the selected filters', jQuery.noop, 'Work Hard');
                else
                    appLib.alert('Unable to download work hard questions', jQuery.noop, 'Work Hard');

            });        
    },


    //## Work Smart question type enum
    workSmartQuestionType: {
        NotSeenBefore: 0,
        AllQuestions: 1,
        WrongBefore: 2,
        Tagged: 3
    },



    //## Get question rating
    getQuestionRating: function(qid) {        
        if(_.isUndefined(oe.questionRatings) || oe.questionRatings === null) {
            oe.questionRatings = {};
        }

        if(_.isUndefined(oe.questionRatings[qid])) {
            return null;
        }

        return oe.questionRatings[qid];
    },


    //## Set question rating
    setQuestionRating: function(qid, rating) {        
        if(_.isUndefined(oe.questionRatings) || oe.questionRatings === null) {
            oe.questionRatings = {};
        }
        
        if(!_.isUndefined(oe.questionRatings[qid]) && oe.questionRatings[qid].rating == rating) {
            return;
        }         
        
        oe.questionRatings[qid] = { 
            rating: rating,
            uploaded: false
        };      
    },

    //## Set question ratings from array of { QID, Rating }
    setQuestionRatings: function(ratings) {
        oe.questionRatings = {};

        _.each(ratings, function(rating) {
            oe.questionRatings[rating.QID] = { 
                rating: rating.Rating,
                uploaded: true
            };      
        });
    },


    //## Get user's ratings of questions in specified assessment
    //## Returns a function that can be used as a promise
    getAssessmentQuestionRatingsFunction: function(assessmentId, applyMask) {
        return function(resolve, reject) { 
            oe.ajax('GetQuestionRatings',
                {
                    token: oe.auth.get('key'),
                    assessmentId: assessmentId
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.Ratings)) {                        
                        appLib.alert('No question ratings could be downloaded', jQuery.noop, 'Question Rating');

                        reject();                       
                        return;
                    }
                    
                    oe.setQuestionRatings(data.d.Ratings);
                    
                    resolve();
                },
                function (xhr, msg, ex) {
                    reject();

                    if (oe.isLoginExpired(ex)) {                    
                        return;
                    }
                    
                    appLib.alert('No question ratings could be downloaded.', jQuery.noop, 'Question Rating');
                }, undefined, applyMask);
        };        
    },

    //## TODO: Could getQuestionRating be injected?
    getQuestionRatingHtml: function(qid) {
        var template = _.template(oeTemplate.get('RatingTemplate'));
        var rating = 0;

        var data = oe.getQuestionRating(qid);
        if(data !== null) {
            rating = data.rating;
        }

        return template({ rating: rating });
    },    






    //## Set question feedback
    getQuestionFeedback: function(qid) {        
        if(_.isUndefined(oe.questionFeedback) || oe.questionFeedback === null) {
            oe.questionFeedback = {};
        }

        if(_.isUndefined(oe.questionFeedback[qid])) {
            return null;
        }

        return oe.questionFeedback[qid];
    },


    //## Set question feedback
    setQuestionFeedback: function(qid, feedback) {        
        if(_.isUndefined(oe.questionFeedback) || oe.questionFeedback === null) {
            oe.questionFeedback = {};
        }
        
        oe.questionFeedback[qid] = { 
            feedback: feedback            
        };      
    },

    getQuestionFeedbackHtml: function(qid) {
        var template = _.template(oeTemplate.get('FeedbackTemplate'));        
        var feedback = (oe.getQuestionFeedback(qid) || { feedback: '' }).feedback;        

        return template({ feedback: feedback });
    },








    //## Returns a work smart options object that can be used to create an assessment or calculate the number of available questions
    getWorkSmartOptions: function (questionType, minDifficulty, maxDifficulty, categories, numQuestions, examId, questionTypes, questionTags) {
        var onlyTagged, excludeNew, excludeOld, excludeCorrect, excludeWrong;

        if (questionType == oe.workSmartQuestionType.NotSeenBefore) {
            onlyTagged = false;
            excludeNew = false;
            excludeOld = true;
            excludeCorrect = true;
            excludeWrong = true;
        } else if (questionType == oe.workSmartQuestionType.AllQuestions) {
            onlyTagged = false;
            excludeNew = false;
            excludeOld = false;
            excludeCorrect = false;
            excludeWrong = false;
        } else if (questionType == oe.workSmartQuestionType.WrongBefore) {
            onlyTagged = false;
            excludeNew = true;
            excludeOld = false;
            excludeCorrect = true;
            excludeWrong = false;
        } else if (questionType == oe.workSmartQuestionType.Tagged) {
            onlyTagged = true;
            excludeNew = false;
            excludeOld = false;
            excludeCorrect = false;
            excludeWrong = false;
        }

        var options = {
            __type: 'DABL.GenericAssessment.DTO.AssessmentOptionsDTO',
            Id: 1,
            NumberOfQuestions: numQuestions,
            ExamId: examId,
            TaggedQuestionsOnly: onlyTagged,
            ExcludeNewQuestions: excludeNew,
            ExcludeOldQuestions: excludeOld,
            ExcludeCorrectQuestions: excludeCorrect,
            ExcludeIncorrectQuestions: excludeWrong,
            Difficulty: {
                MinimumDifficulty: minDifficulty,
                MaximumDifficulty: maxDifficulty
            },
            AdaptForMe: true,
            AllowSkip: true,        
            ShowAnswers: true,
            ShowExplanations: true,
            AssessmentType: 'WorkSmartMobile',
            ExcludeMediaQuestions: false,
            Tags: questionTags      // [1, 5172]            
        };

        //## Apply category filters if specified
        if (categories != null)
            _.extend(options, { Curricula: categories });

        //## Apply questionTypes filters if specified
        if (questionTypes != null) {
            var qt = _.map(questionTypes, function (type) {
                return {
                    NumberOfQuestions: 0,
                    QuestionType: type
                };
            });

            _.extend(options, { QuestionTypes: qt });
        }

        return options;
    },


    //## Downloads work smart questions into the local question bank
    workSmart: function (onSuccess, questionType, minDifficulty, maxDifficulty, categories, numQuestions, examId, questionTypes, questionTags) {
        var options = this.getWorkSmartOptions(questionType, minDifficulty, maxDifficulty, categories, numQuestions, examId, questionTypes, questionTags);

        this.prepAssessment(onSuccess, options, 'Work Smart');
    },


    mockTest: function(onSuccess /* :function */, assessmentTemplateId /* :number */, examId /* :number */) {
        var options = {
            __type: 'DABL.GenericAssessment.DTO.AssessmentOptionsDTO',
            Id: 1,                                    

            //## Yes, it's spelt incorrectly in the API
            AsssessmentTemplateId: assessmentTemplateId,
            AssessmentType: 'MockTest',

            ShowAnswers: false,
            ShowExplanations: false,
            ExamId: examId
        };

        this.prepAssessment(onSuccess, options, 'Mock Test');
    },


    /* private */
    prepAssessment: function(onSuccess /* :function */, options /* :AssessmentOptionsDTO object */, title /* :string */) {
        //## Create a function to be called once an assessment has been created
        var downloadWorkSmartQuestion = function (onSuccess, assessmentId) {

            var downloadWSQuestions = function(resolve, reject) { 
                oe.ajax('GetUnansweredsQuestions',
					{
					    token: oe.auth.get('key'),
					    assessmentId: assessmentId
					},
					function (data, textStatus) {
					    if (_.isUndefined(data.d) || _.isUndefined(data.d.Questions)) {
					        appLib.alert('No ' + title + ' questions could be downloaded', jQuery.noop, title);
					        return;
					    }

                        oe.clearChallengeData();

					    oe.loadQuestions(data.d.Questions, assessmentId, oe.downloadImages, resolve, reject);
					},
					function (xhr, msg, ex) {
					    if (oe.isLoginExpired(ex)) {
                            reject();
					        return;
                        }

                        reject();

					    if (ex.indexOf('GetUnansweredsQuestions error') > -1) {
					        appLib.alert('No ' + title + ' questions could be downloaded.', jQuery.noop, title);
					    } else {
					        appLib.alert(ex, jQuery.noop, title);
					    }					    
					});
            };

            var getQuestionRatings = oe.getAssessmentQuestionRatingsFunction(assessmentId, false);
            var getAssessmentTags = oe.getAssessmentTagsFunction(assessmentId, false);

            Promise.all([new Promise(downloadWSQuestions), new Promise(getQuestionRatings), new Promise(getAssessmentTags)])
                .then(function() {  
                    onSuccess();

                }).then(undefined, function(error) {
                    appLib.maskUI(false);
                
                    var msg = 'An error occurred';
                    if(error == 'Unable to download question image') {
                        msg = error + '\n\nPlease check your internet connection and try again';
                    }

                    //TODO: Retry promises?                    
                    appLib.alert(msg, jQuery.noop, title);
                });
        };


        var assessmentName = 'mobile';
        if(options.AssessmentType == 'WorkSmartMobile')
            assessmentName = 'App Question Session';
        else if(options.AssessmentType == 'MockTest')
            assessmentName = ' (App)';

        //## TODO: If question options have not changed then the previous assessmentId can be re-used and only the above ajax request is required
        oe.ajax('CreateAssessment',
				{
				    token: oe.auth.get('key'),
				    assessmentName: assessmentName,
				    optionsDTO: options
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.AssessmentId)) {
				        appLib.alert('No assessment could be downloaded', jQuery.noop, title);
				        return;
				    }

				    downloadWorkSmartQuestion(onSuccess, data.d.AssessmentId);
				},
				function (xhr, msg, ex) {
				    if (oe.isLoginExpired(ex))
				        return;

                    var message = 'Unable to download ' + title + ' questions';
                    if(ex != null && ex.indexOf('[') > 0) {
                        message = ex;
                    }

				    appLib.alert(message, jQuery.noop, title);
				});
    },


    //## Downloads the number of available work smart questions based on the specified criteria
    workSmartQuestionCount: function (onSuccess, questionType, minDifficulty, maxDifficulty, categories, examId, questionTypes, questionTags) {
        var options = this.getWorkSmartOptions(questionType, minDifficulty, maxDifficulty, categories, 0, examId, questionTypes, questionTags);

        oe.ajax('GetQuestionCount',
				{
				    token: oe.auth.get('key'),
				    optionsDTO: options
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.QuestionCount)) {
				        appLib.alert('No question count could be downloaded', jQuery.noop, 'Work Smart');
				        return;
				    }

				    onSuccess(data.d.QuestionCount);
				},
				function (xhr, msg, ex) {
				    if (oe.isLoginExpired(ex))
				        return;

				    //if(ex.indexOf('GetQuestionCount error') > 0)
				    appLib.alert('Unable to download work smart question count', jQuery.noop, 'Work Smart');
				});
    },


    isLoginExpired: function (msg) {
        if (msg.indexOf('Invalid token') >= 0) {
            appLib.alert('Your session has expired. Please login again.', function () { app.trigger('loginRequired'); });
            return true;
        }

        return false;
    },

    //## Load specified questions into the local question bank, and optionally downloads images to local storage
    //HACK: Refactor so onComplete doesn't assume questions should be saved in oe.questionBank, current workaround is -ve assessmentId
    loadQuestions: function (questions, assessmentId, downloadImages, onSuccess, onFailure) {
		//appLib.log('loadQuestions()');
	
        var qbank = new QuestionBank();

        _.each(questions, function (el, index, list) {
            //## Process question options including the correct answer
            var options = new QuestionOptions();
            var questionType = el.QuestionType;

            if (questionType == 1) {
                //## Add MCQ options
                _.each(el.QuestionAnswer.AnswerItems, function (item) {
                    options.add(
					    new MCQOption({
					        id: item.Id,
					        answer: item.Answer,
					        answerText: item.AnswerText
					    })
				    );
                });

                qbank.add(
				    new MCQ({
				        id: el.QID,
				        text: oe.processQuestionText(el.QuestionText),
				        comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				        options: options
				    })
			    );


            } else if (questionType == 2) {
                //## Add EMQ question stems
                _.each(el.QuestionAnswer.AnswerItems, function (item) {
                    options.add(
					    new EMQOption({
					        id: item.Id,
					        text: oe.processQuestionText(item.IntroText),
					        comment: oe.processQuestionText(item.Explanation),
					        answerId: item.CorrectOptionId
					    })
				    );
                });


                //## Add the choices for the ddlb
                var choices = new EMQChoices();

                _.each(el.QuestionAnswer.AnswerOptions, function (item) {
                    choices.add(
                        new EMQChoice({
                            id: item.Id,
                            score: item.Score,
                            text: item.Text,
                            comment: item.Comment
                        })
                    );
                });


                //## Add the question
                qbank.add(
				    new EMQ({
				        id: el.QID,
				        text: oe.processQuestionText(el.QuestionText),
				        comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				        options: options,
				        choices: choices,
				        theme: el.Theme
				    })
			    );


            } else if (questionType == 4) {
                //## Add NoM/BoF options
                try {
                    _.each(el.QuestionAnswer.AnswerItems[0].AnswerOptions, function (item) {
                        options.add(
    					    new QuestionOption({
    					        id: item.Id,
    					        text: item.Text,
    					        score: item.Score
    					    })
    				    );
                    });
                } catch(e) {
                    appLib.debugLog("Skipping invalid question: " + el.QID);
                }

                if (el.NumberOfOptions > 1 || el.SelectAllThatApply) {
                    //## N of Many
                    qbank.add(
				        new NOM({
				            id: el.QID,
				            text: oe.processQuestionText(el.QuestionText),
				            comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				            options: options,
				            numberOfOptions: el.NumberOfOptions,
				            selectAllThatApply: el.SelectAllThatApply
				        })
			        );
                } else {
                    //## Best of 5
                    qbank.add(
				        new BestOfFive({
				            id: el.QID,
				            text: oe.processQuestionText(el.QuestionText),
				            comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				            options: options
				        })
			        );
                }


            } else if (questionType == 9) {
                //## Add SJQ options
                _.each(el.QuestionAnswer.AnswerItems, function (item) {
                    options.add(
					    new SJQOption({
					        id: item.Id,
					        rank: item.Rank,
					        answerText: item.AnswerText
					    })
				    );
                });

                qbank.add(
				    new SJQ({
				        id: el.QID,
				        text: oe.processQuestionText(el.QuestionText),
				        comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				        options: options
				    })
			    );
				
				
            } else if (questionType == 10) {
				//## Add SJT options
                _.each(el.QuestionAnswer.AnswerItems, function (item) {
                    options.add(
					    new SJTOption({
					        id: item.Id,
					        rank: item.Rank,
					        answerText: item.AnswerText
					    })
				    );
                });

                qbank.add(
				    new SJT({
				        id: el.QID,
				        text: oe.processQuestionText(el.QuestionText),
				        comment: oe.processQuestionText(el.QuestionAnswer.Explanation),
				        options: options
				    })
			    );			
			}
        });

		//appLib.log('loadQuestions() checking length');

        //## Ensure qbank is not empty before replacing current session
        if (qbank.length == 0) {
            onFailure();
            return;
        }


        //## Function to run on completion of this func
        var onCompletion = function () {
            //## Make the new questions active
            oe.questionBank = qbank;
            oe.assessmentId = assessmentId;

            //## No friend has been challenged for this assessment
            oe.friendChallenged = null;

            onSuccess();
        };

		//appLib.log('loadQuestions() about to check for images');

        var imageFilenamePrefix = 'image';

        //HACK: If -ve assessmentId then don't save in oe.questionBank, instead just allow onSuccess(questions) function to handle it
        if(assessmentId < 0) {
            onCompletion = onSuccess;
            imageFilenamePrefix = 'imageDailyNotification';
        }


        //## Download images to local storage (only for phonegap)?
        if (downloadImages && appLib.isPhoneGap())
            oe._downloadImagesInQuestionBank(qbank, onCompletion, onFailure, imageFilenamePrefix);
        else
            onCompletion(qbank);
    },


    //## Replace oE website specific text/links in question text
    processQuestionText: function (text) {
		//## Ensure the html is safe as below code will eval() it
		var safeText = oe._disableScriptTagsInHtml(text);
		
		var html = $('<html>').html(safeText);
		$('a', html).each(function(i, el) { 
			//## Get href 
			var url = $(el).attr('href');			
			
			if(url.indexOf('/goto.aspx?url=') == 0) {
				//## strip partial OE redirect page and decode				
				url = appLib.urlDecode(url.split('/goto.aspx?url=').join(''));
			}
			
			//## Remap URL to open in new tab
			$(el).removeAttr('href').removeAttr('target').attr('onclick','appLib.openLink(\'' + url + '\', \'_system\');'); 
		});
		
		//## Running   $('<html>').html('example question text')   on modern browsers generates: 
		// 			<html><head></head><body>example question text</body></html> 
		//## However, on Android 2.x it generates:
		//			example question text
		//## Therefore, test for a body element and if available return it's content otherwise return all content
		return ($('body', html).length > 0 ? $('body', html).html() : $(html).html());
    },



    //## Download images from question bank to local storage
    _downloadImagesInQuestionBank: function (questions, onCompletion /* :function */, onFailure /* :function */, imageFilenamePrefix /* :string */) {
        appLib.maskUI(true);

		//appLib.log('_downloadImagesInQuestionBank() about to look for images');
		
        //## Build an array of unique image urls from all questions
        var uniqueImageUrls = [];
        questions.each(function (q) {
            //## Find images inside question and comment text
            var images = [].concat(_.toArray(imageLib.findImages(q.get('text'))), _.toArray(imageLib.findImages(q.get('comment'))));

            //## Extract URLs from <img/> tags
            var urls = _.map(images, function (img) {
                return $(img).attr('src');
            });

            uniqueImageUrls = uniqueImageUrls.concat(urls);
        });

		//appLib.log('_downloadImagesInQuestionBank() finished .each');

        var stripImageDimentionsAndRemapUrl = function (imgEl) {
            //## Caching issue with local images!
            var currentTime = new Date();
            var cacheBuster = currentTime.getTime();
        
            //## Attempt to replace with local image data
            var src = imgEl.attr('src');
            imgEl.attr('src', imageLib.getImage(src, true) + '?cacheBuster=' + cacheBuster);

            //## Strip width/height attributes
            imgEl.removeAttr('width').removeAttr('height');
            
            //## Useful for debugging - also displays original image from website (first)
            //imgEl.before('<img src="' + src + '" />');
        };


        //## FOR TESTING: Randomly add a bad image url - john        
        /*
        if(Math.random() < 0.5) {
            uniqueImageUrls.push('http://www.onexamination.com/banana.gif');
        }
        */

        //## Download images
        imageLib.downloadImages(uniqueImageUrls, function() {

            //## Process question elements - attempt to replace image url with local image data
            questions.each(function (q) {
				//appLib.log('_downloadImagesInQuestionBank() processing question');
				
                q.set('text', imageLib.processImages(q.get('text'), stripImageDimentionsAndRemapUrl));
                q.set('comment', imageLib.processImages(q.get('comment'), stripImageDimentionsAndRemapUrl));
            });

            appLib.maskUI(false);

			//appLib.log('_downloadImagesInQuestionBank() calling onCompletion');
			
            onCompletion(questions);

        }, function(error) {             
            appLib.track(error);
            
            //## Pass on message to be displayed
            onFailure('Unable to download question image');
        },
        imageFilenamePrefix);
    },

	
	//## Disables HTML script tags by commenting them out
	_disableScriptTagsInHtml: function(html) {					
		return html.split('<script').join('<!-- /* ').split('</script').join('*/ -->');
	},



    //TODO: Move into backbone object and add these methods
    getQuestionRatingsToUpload: function() {
        
        var createRatingDTO = function(qid, rating) {
            return {
                __type: 'DABL.GenericAssessment.DTO.QuestionRatingDTO',
                QID: qid,
                Rating: rating
            };
        };

        var upload = _.map(oe.questionRatings, 
            function(r, key) { 
                if(r.uploaded) 
                    return null;

                return createRatingDTO(key, r.rating);
                })
            .filter(function(r) { 
                return r !== null; 
            });

        return (upload === null || upload.length < 1 ? null : upload);            
    },

    markQuestionRatingsAsUploaded: function() {
        _.each(oe.questionRatings, function(r) {
            r.uploaded = true;
        });
    },


    getUploadQuestionRatingsPromise: function (ratings) {        
        return function(resolve, reject) {  
            appLib.log('running getUploadQuestionRatingsPromise');

            //## Don't call API if there aren't any ratings to upload
            if(ratings === null)
                return resolve();


            oe.ajax('SetQuestionRatings',
                {
                    token: oe.auth.get('key'),
                    ratings: ratings        
                },
                function (data) {
                    if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        return reject(data.d.ErrorMessage);
                    }

                    oe.markQuestionRatingsAsUploaded();

                    return resolve();
                },
                function (xhr, msg, errorThrown) {
                    reject(errorThrown);

                    if (oe.isLoginExpired(errorThrown))
                        return;

                    appLib.alert(errorThrown, jQuery.noop, 'Upload Ratings');
                },
                this,
                false);
        };
    },




    //TODO: Move into backbone object and add these methods
    getQuestionFeedbackToUpload: function() {
        
        var createFeedbackDTO = function(qid, feedback) {
            return {
                __type: 'API.Assessment.Requests.QuestionFeedback',
                QID: qid,
                Feedback: feedback
            };
        };

        var upload = _.map(oe.questionFeedback, 
            function(data, key) { 
                return createFeedbackDTO(key, data.feedback);
            });

        return (upload === null || upload.length < 1 ? null : upload);
    },


    getUploadQuestionFeedbackPromise: function (feedback) {        
        return function(resolve, reject) {  
            appLib.log('running getUploadQuestionFeedbackPromise');
            
            //## Don't call API if there isn't any feedback to upload
            if(feedback === null)
                return resolve();


            oe.ajax('ProvideQuestionFeedback',
                {
                    token: oe.auth.get('key'),
                    userFeedback: feedback        
                },
                function (data) {
                    if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        return reject(data.d.ErrorMessage);
                    }

                    //## Clear question feedback
                    oe.questionFeedback = {};

                    return resolve();
                },
                function (xhr, msg, errorThrown) {
                    reject(errorThrown);

                    if (oe.isLoginExpired(errorThrown))
                        return;

					/*
                    appLib.log('Upload Feedback Error: ' + errorThrown);
                    appLib.log(JSON.stringify(xhr));
                    appLib.debugLog(JSON.stringify(xhr));
                    appLib.log(msg);                    
					*/

                    appLib.alert(errorThrown, jQuery.noop, 'Upload Feedback');
                },
                this,
                false);
        };
    },




    //## Returns the required answer set (either Work Hard or Work Smart) to upload
    getAnswersToUpload: function () {
        var answersToUpload = [];

        this.questionBank.each(function (question) {
            var answer = question.get('lastAnswer');

            if (answer != null && !answer.get('uploaded')) {
                answersToUpload.push(answer.getUserAnswerDTO());
            }
        });


        //## Don't return an object to upload if there are no answers!
        if (answersToUpload == null || answersToUpload.length == 0)
            return null;

        var challengeData = oe.getChallengeData();
        if(challengeData !== null) {
            var key = (this.auth === null ? null : this.auth.get('key'));

            //## Completing a challenge 
            return _.extend(challengeData, {                                    
                    token: key,
                    answers: answersToUpload
                });

        } else if (oe.assessmentId == null) {
            //## Old Work hard questions - downloaded before updating to new version of the app
            return {
                token: this.auth.get('key'),                
                userAnswers: answersToUpload,
                options: {
                    AssessmentType: 'WorkHardMobile',
                    UserId: this.auth.get('userId'),
                    QuestionFilter: {
                        ExamId: oe.selectedExamId
                    }
                },                
                url: function () { return oeConstants.baseUrl + 'AnswerWorkHardQuestions'; },
                serviceName: 'AnswerWorkHardQuestions'
            };
        } else {
            //## Work Smart / New Work Hard            
            var data = {
                token: this.auth.get('key'),
                assessmentId: oe.assessmentId,
                answers: answersToUpload,
                userId: this.auth.get('userId'),
                url: function () { 
                    //appLib.alert('Who calls getAnswersToUpload.url() ???');
                    return oeConstants.baseUrl + 'AnswerQuestions'; 
                },
                serviceName: 'AnswerQuestions'
            };

            //## Include assessment time if available
            if(this.timer > 0) {
                data = _.extend(data, {
                    timeTaken: this.timer,
                    url: function () { return oeConstants.baseUrl + 'AnswerTimedQuestions'; },
                    serviceName: 'AnswerTimedQuestions'
                });
            }

            appLib.log(data);
            return data;
        }
    },


    answersToUpload: function() {
        var toUpload = 0;

        this.questionBank.each(function (question) {
            var answer = question.get('lastAnswer');

            if (answer != null && !answer.get('uploaded')) {
                toUpload++;
            }
        });

        return toUpload > 0;
    },

    markAnswersAsUploaded: function (keyLearningPoints) {
        this.questionBank.each(function (question) {
            var answer = question.get('lastAnswer');

            if (answer != null)
                answer.set('uploaded', true);
        });
		
		this.keyLearningPoints = keyLearningPoints;
    },

	
	removeUnansweredQuestions: function() {
		this.questionBank.remove(this.questionBank.filter(function(question) { 
			return question.get('lastAnswer') == null;
		}));
	},
	

    //## Gets curricula for the specified exam
    getCurricula: function (onSuccess, onFailure, examId) {
        oe.ajax('GetCurriculaForExam',
			    {
			        token: oe.auth.get('key'),
			        examId: examId
			    },
				function (data) {
				    onSuccess(oe.getParentCurricla(data.d.Curricula));
				},
				function (xhr, msg, errorThrown) {
				    if (oe.isLoginExpired(errorThrown))
				        return;

				    appLib.alert(errorThrown, onFailure, 'Get Curricula');
				});
    },

    //## Converts a hierarchy of curricula into a flat key/value list where the value is csv with the parent id first (e.g. parent,child1,child2)
    getParentCurricla: function (curricula) {
        var parentItems = [];

        _.each(curricula, function (item) {
            var title = item.Name;
            var ids = oe.getChildCurriculaIds(item);

            parentItems.push({ key: title, value: ids });
        });

        return parentItems;
    },

    //## Recursive function that processes child curricula for IDs
    getChildCurriculaIds: function (item) {
        var ids = item.CurriculumID;

        if (!_.isUndefined(item.Children))
            _.each(item.Children, function (c) {
                ids += ',' + oe.getChildCurriculaIds(c);
            });

        return ids;
    },


    //## Get demo exams
    getDemoExams: function (onSuccess, onError) {
        oe.ajax('GetExamsWithDemoQuestions',
				{},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.Exams)) {
				        appLib.alert('Unable to download demo resources', jQuery.noop, 'Demo Exams');
				        return;
				    } else if (data.d.ErrorMessage != null && data.d.ErrorMessage.length > 0) {
				        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Demo Exams');
				        return;
				    }

				    //## Save demo exams list
				    if (data.d.Exams.length > 0)
				        oe.demoExams = data.d.Exams;

				    onSuccess(data.d.Exams);
				},
				function (xhr, msg, ex) {
				    //## Don't warn about being unable to download demo exam list
				    onError();
				});
    },


    //## Get last changed demo question datetime
    getDemoLastChangeDate: function (examId, onSuccess, onError) {
        oe.ajax('GetDemoQuestionLastChangeDate',
				{
				    examId: examId
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d)) {
				        appLib.alert('Unable to download demo metadata', jQuery.noop, 'Demo Exams');
				        return;
				    }

				    //## Convert date to an int
				    onSuccess(parseInt(data.d.substr(6)));
				},
				function (xhr, msg, ex) {
				    //## Don't warn about being unable to download demo exam list
				    onError();
				});
    },


    //## Download demo questions and setup in current question bank
    getDemoQuestions: function (examId, onSuccess, onError) {
        oe.ajax('GetDemoQuestions',
				{
				    examId: examId
				},
				function (data, textStatus) {
				    if (_.isUndefined(data.d) || _.isUndefined(data.d.Questions)) {
				        appLib.alert('No demo questions could be downloaded', jQuery.noop, 'Demo Exams');
				        return;
				    }

                    oe.clearChallengeData();

				    oe.loadQuestions(data.d.Questions,
                                     null,
                                     oe.downloadImages,
                                     function () {
                                         onSuccess(data.d.Questions, parseInt(data.d.LastChangeDate.substr(6)));
                                     },
                                     function () {
                                         appLib.alert('No demo questions are available for this exam', jQuery.noop, 'Demo Exams');
                                     });
				},
				function (xhr, msg, ex) {
				    onError();
				});
    },


    resultColour: function (score) {
        return (score == 0 ? 'red' : (score == 100 ? 'green' : 'yellow'));
    },

    resultText: function (score) {
        return (score == 0 ? 'Incorrect' : (score == 100 ? 'Correct' : 'Partially Correct'));
    },

    convertExamListToDropDownFormat: function (examList) {
        var options = _.map(examList, function (item) {
            return {
                id: item.ExamId,
                text: item.ExamName
            };
        });

        return options;
    },
	
	//## Indicates if the javascript (in this file) has been minified
	isMinified: function() /* :bool */ {
		//## Upon minification this function's "not_minified" variable will be renamed with something shorter (e.g. 'a')
		var f = function() { var not_minified = ''; return not_minified; };
		
		try {
			return (f.toString().indexOf('not_minified') == -1);
		} catch(e) {
		}
		
		return false;
	},
	
	    	
	//## (Saved) Revision Options
	
	setRevisionOptions: function(options) /* :void */ {	
		this.revisionTypeOptions = options;
	},	
	
	getRevisionOptions: function() { 
		return this.revisionTypeOptions;
	},
	
	clearRevisionOptions: function() /* :void */ {
		this.setRevisionOptions(null);
		this.save();
	},


    getChallengeUrl: function(onSuccess /* :function */, onFailure /* :function */) {
        var context = this;

        oe.ajax('GetChallengeUrl',
                {
                    token: oe.auth.get('key'),
                    assessmentId: oe.assessmentId                    
                },
                function (data, textStatus) {
                    if (data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Create Challenge');
                        return;
                    } 

                    onSuccess(data.d.Url);
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to create challenge', jQuery.noop, 'Create Challenge');

                    onFailure();
                }, context, true);
    },


    challengeFriendToAssessment: function(email, onSuccess, onFailure) {
        var context = this;

        oe.ajax('ChallengeFriend',
                {
                    token: oe.auth.get('key'),
                    assessmentId: oe.assessmentId,
                    friendEmail: email
                },
                function (data, textStatus) {
                    if (data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Challenge Friend');
                        return;
                    } 

                    onSuccess();
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    appLib.alert('Unable to challenge your friend', jQuery.noop, 'Challenge Friend');

                    onFailure();
                }, context, true);
    },

    downloadAssessmentChallengeForGuest: function(email, pin, onSuccess) {
        var context = this;

        oe.ajax('GetChallengeQuestionsForGuest', 
                {
                    email: email,
                    pin: pin
                },
                function (data, textStatus) {
                    if (!_.isUndefined(data.d.ErrorMessage) && data.d.ErrorMessage !== null && data.d.ErrorMessage.length > 0) {
                        if(data.d.ErrorMessage.indexOf('GetChallengeQuestionsForGuest error.') >= 0) {
                            appLib.alert('Unable to find challenge for provided email/PIN', jQuery.noop, 'Challenge for Guest');
                            return;
                        }

                        appLib.alert(data.d.ErrorMessage, jQuery.noop, 'Challenge for Guest');
                        return;                        
                    } else if (_.isUndefined(data.d) || _.isUndefined(data.d.Questions)) {
                        appLib.alert('Guest assessment challenge could not be downloaded', jQuery.noop, 'Challenge for Guest');
                        return;
                    }

                    //TODO: Add onFaiure method?
                    oe.loadQuestions(data.d.Questions, null, oe.downloadImages, onSuccess, jQuery.noop);
                },
                function (xhr, msg, ex) {
                    if (ex !== null && ex.length > 0) {
                        if(ex.indexOf('GetChallengeQuestionsForGuest error.') >= 0) {
                            appLib.alert('Unable to find challenge for provided email/PIN.', jQuery.noop, 'Challenge for Guest');
                            return;
                        }

                        appLib.alert(ex, jQuery.noop, 'Challenge for Guest');
                    } else if (msg.indexOf('No questions found') != -1)
                        appLib.alert('Guest assessment challenge does not have any questions!', jQuery.noop, 'Challenge for Guest');
                    else
                        appLib.alert('Unable to download guest assessment challenge', jQuery.noop, 'Challenge for Guest');

                }, context, true);
    },

    downloadAssessmentChallenge: function(challengeId, onSuccess) {
        var context = this;

        oe.ajax('GetChallengeQuestions', 
                {
                    token: oe.auth.get('key'),
                    challengeId: challengeId
                },
                function (data, textStatus) {
                    if (_.isUndefined(data.d) || _.isUndefined(data.d.Questions)) {
                        appLib.alert('Assessment challenge could not be downloaded', jQuery.noop, 'Challenge for User');
                        return;
                    }

                    //TODO: Add onFaiure method?
                    oe.loadQuestions(data.d.Questions, null, oe.downloadImages, onSuccess, jQuery.noop);
                },
                function (xhr, msg, ex) {
                    if (oe.isLoginExpired(ex))
                        return;

                    if (msg.indexOf('No questions found') != -1)
                        appLib.alert('Assessment challenge does not have any questions!', jQuery.noop, 'Challenge for User');
                    else
                        appLib.alert('Unable to download assessment challenge', jQuery.noop, 'Challenge for User');

                }, context, true);
    },

    setGuestChallengeData: function(email, pin) {
        this.challenge = {
            type: 'guest',
            email: email, 
            pin: pin,
            url: function () { return oeConstants.baseUrl + 'AnswerChallengeQuestionsForGuest'; },
            serviceName: 'AnswerChallengeQuestionsForGuest' 
        };

        this.save();
    },

    setOnExamUserChallengeData: function(challengeId) {
        this.challenge = { 
            type: 'user',
            challengeId: challengeId,
            url: function () { return oeConstants.baseUrl + 'AnswerChallengeQuestions'; },
            serviceName: 'AnswerChallengeQuestions' 
        };

        this.save();
    },

    getChallengeData: function() {
        if(_.isUndefined(this.challenge) || this.challenge === null)
            return null;

        return this.challenge;
    },

    clearChallengeData: function() {
        appLib.log('clear challenge data');

        this.challenge = null;
    },

    getChallenges: function(onSuccess, onFailure, maskUI) {
        oe.ajax('GetChallenges', 
            {
                token: oe.auth.get('key')
            },
            function(data, textStatus) { 
                if (!_.isUndefined(data.d.Challenges) && data.d.Challenges !== null) {
                    onSuccess(data.d.Challenges);
                    return;                    
                }

                onFailure();
            },
            function() {
                onFailure();
            },
            this,
            maskUI);
    },


    isLoggedIn: function() {
        return (oe.auth !== null && oe.auth.get('key') !== null);
    },


    //## Used to get/set a copy of the last API token - used for push notification's "get today's question"
    getLastToken: function() {
        var token = localStorage.getItem('lastAPIToken');
        appLib.debugLog('Loaded last API token: ' + token);

        return token;
    },

    setLastToken: function(token) {
       localStorage.setItem('lastAPIToken', token); 
    },


    // Indicates if a session is in progress (i.e. answers to upload and/or session is not finished)
    isSessionInProgress: function() {
        return oe.answersToUpload() || (!_.isUndefined(oe.currentSession()) && oe.currentSession() != null && !oe.currentSession().get('completed'));
    },


    sessionTimerFunc: function() {        
        try {
            //## Calc interval between now and last time this func was called. lastTimerZero indicates the app was reloaded
            var now = Date.now();
            var lastTimerZero = (oe.lastTimer == 0);
            var interval = now - oe.lastTimer;
            oe.lastTimer = now;            

            //## Only tick if the timer is visible AND app is in foreground AND app hasn't been reloaded
            if($('#examTimerSection:visible').length === 0 || isAppPaused || lastTimerZero) {                            
                return;
            }

            //## Timer is in ms
            oe.timer += interval;
            appLib.log('Timer: ' + oe.timer + ' (' + interval + ')');

            $('#examTimer').html(appLib.formatTimer(Math.round(oe.timer / 1000)));
            window.localStorage.setItem('oeTimer', oe.timer);

        } catch(err) { 
            //?
        }
    }
};