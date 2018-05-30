function mobileEventInit() {                         

	$(document).on('change', '.star-group input[type=radio]', function() {
		try {  			
  			var rating = $('.star-group input[type=radio]:checked').val();

  			//## Fill in lower stars, e.g. if 4 is clicked then fill in stars 1, 2 and 3
  			var labels = $('.star-group label').removeClass('filled-star');  			
  			if(rating > 1) labels.eq(0).addClass('filled-star');
  			if(rating > 2) labels.eq(1).addClass('filled-star');
  			if(rating > 3) labels.eq(2).addClass('filled-star');
  			if(rating > 4) labels.eq(3).addClass('filled-star');  			

  			//## Inform current page of rating change
  			//$('[data-role="page"]').trigger('star-rating:changed', [ rating ]);
  			$('.mobilePage').trigger('star-rating:changed', [ rating ]);
  		} catch(e) { 
  			appLib.alert(e, jQuery.noop, 'Rating Error');
  		}
	});

                 
    //## Popup dialog for question images
    $(document).on('click', '.questionAnswer img, .question img', function() {
        var popup = $('#imagePopup');
        var createPopup = (popup.length === 0);
        
        if (createPopup) {
            //## Add the popup markup to the current page
            $('[data-role=content]').first().append('<div data-role="popup" id="imagePopup" data-overlay-theme="e" class="ui-content"></div>');
            popup = $('#imagePopup');
        } else {
            //## Empty existing popup
            popup.empty();
        }
        
        //## Hacked icon as suggested code below wasn't working
        //popup.append('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>');
        //popup.append('<a href="#" data-rel="back" data-role="button" data-theme="a" data-iconpos="notext" class="ui-btn-right ui-icon ui-icon-delete ui-icon-shadow"></a>');
	
		var popupWidth = Math.round(Math.min($(window).width() * 0.8, this.naturalWidth * 2));
		var popupHeight = Math.round(Math.min($(window).height() * 0.8, this.naturalHeight * 2));
		
        popup.append('<div id="imagePopupInner" style="width:' + popupWidth + 'px; max-width:' + Math.round($(window).width() * 0.8) + 'px; height:' + popupHeight + 'px; overflow:auto;"></div><div class="ui-popup-notice">Scrollable image (x2)</div>');
        popup.append('<a href="#" id="imagePopupClose" data-rel="back" data-role="button" data-theme="a" data-iconpos="notext" class="ui-btn-right ui-icon ui-icon-delete ui-icon-shadow"></a>');
		//popup.append('<div class="ui-popup-close"><a href="#" data-rel="back" data-role="button" data-theme="a">Close</a></div><br />');
		
        //## NOTE: Injecting an IFrame (to allow pinch/zoom) doesn't work with phonegap
        //## Add the image to the popup
        
        $('#imagePopupInner').append('<img src="' + $(this).attr('src') + '" style="width:' + (this.naturalWidth * 2) + 'px;" />');
        
                    
        if(createPopup)
            popup.popup({ history: false });
        
        popup.popup('open', { positionTo:'window' });
    });
	


    //## Home button
    $(document).on('click', '.homeButton', function() {
    	appLib.log('Trigger Home');
    	app.trigger('home');
    });



	//##========================= Challenge a friend dialog

	$(document).on('click', '#challengeFriend', function() {
		var popup = $('#challengeFriendPopup');
        var createPopup = (popup.length === 0);
        
        if (createPopup) {
            //## Add the popup markup to the current page
            $('[data-role=content]').first().append('<div data-role="popup" id="challengeFriendPopup" data-overlay-theme="a" class="ui-content" style=" border:2px solid rgb(42, 110, 187);"></div>');
            popup = $('#challengeFriendPopup');
        } else {
            //## Empty existing popup
            popup.empty();
        }

        var template = _.template($('#ChallengeFriendTemplate').html());
        popup.append(template({    
        	email: oe.friendChallenged,
        	questionCount: oe.currentSession().get('numQuestions'),
        	allowShare: oe.auth.canUploadAnswers() && oe.assessmentId != null
        }));        

        if(createPopup)
            popup.popup({ history: false });
                     
        popup.popup('open', { y:0 });        
        $('#challengeFriendPopup a').button();
        $('#challengeFriendPopup input').textinput();

        appLib.track('challenge-friend-dialog-opened');
	});

	//## Challenge Friend to assessment
	$(document).on('click', '#challengeFriendButton', function(evt) {			
		var email = $('#challengeFriendEmail').val();
		if(email.length < 6) {
			appLib.alert('Please enter a valid email address');
			return;
		}

		//## Hide popup otherwise it obscures the 'loading' mask
		$('#challengeFriendPopup').parent().hide();

		oe.challengeFriendToAssessment(email, function() {
			//## Save challenge has occurred
			oe.friendChallenged = email;
			oe.save();				
			
			$('#challengeFriendPopup').popup('close');						
		}, function() {
			//## 'Challenge a Friend' API failed so display popup
			$('#challengeFriendPopup').parent().show();
		});
	});

	// TEMP!
	$(document).on('click', '#shareChallengeButton', function(evt) {			
		//## Hide popup otherwise it obscures the 'loading' mask
		$('#challengeFriendPopup').parent().hide();

		oe.getChallengeUrl(function(url) {
			//## Save challenge has occurred
			oe.friendChallenged = url;
			oe.save();				
			
			$('#challengeFriendPopup').popup('close');

			appLib.socialShare('I challenge you to a short BMJ OnExamination Quiz!', 
				'I challenge you to a short BMJ OnExamination Quiz!\n\nSee if you can beat me.\n\n', 
				url, 
				function() { appLib.track('challenge-friend-share-completed'); }, 
				function() { appLib.track('challenge-friend-share-cancelled'); });
		}, function() {
			//## 'Challenge a Friend' API failed so display popup
			$('#challengeFriendPopup').parent().show();
		});				
	});




	//##========================= Popup Notification Time Selection Dialog
	$(document).on('click', '.showNotificationDialog', function() {
		var popup = $('#notificationPopup');
        var createPopup = (popup.length === 0);
        
        if (createPopup) {
            //## Add the popup markup to the current page
            $('[data-role=content]').first().append('<div data-role="popup" id="notificationPopup" data-overlay-theme="a" class="ui-content" style=" border:2px solid rgb(42, 110, 187);"></div>');
            popup = $('#notificationPopup');
        } else {
            //## Empty existing popup
            popup.empty();
        }

        var showPopupNotificationTime = function(notificationTime) {
	        var template = _.template($('#NotificationTimeSelectionTemplate').html());
	        popup.append(template({    
	        	selectedTime: notificationTime
	        }));        

	        if(createPopup)
	            popup.popup({ history: false });

	        popup.popup('open', { y:0 });                
	        //$('.jqmButton').button();
	        //$('.jqmSelect').selectmenu();

	        appLib.track('notification-time-dialog-opened');
    	};

    	oe.getNotificationTime(showPopupNotificationTime, function() {
			appLib.track('notification-time-dialog-open-error');	
    	});
	});


	$(document).on('click', '#saveNotification', function(evt) {	
		oe.setNotificationTime(function() { 
				$('#notificationPopup').popup('close');
			}, 
			jQuery.noop, 
			$('#notificationTime').val());		
	});





	//##========================= Menu button when viewing Question tags
	$(document).on('click', '#addTag', function(evt) {		
		var qid = $(this).data('qid');

		var onSuccess = function(data) {
			if(data.buttonIndex !== 1)
				return;
			

			//## Attempt to add the tag
			try {
				oe.addQuestionTag(qid, data.input1);

			} catch(e) {
				//## Display validation error
				appLib.alert(e.message, function() {
					appLib.prompt('Tag this question with:', onSuccess, 'Question Tag', 'OK,Cancel', data.input1);	
				});					

				return;
			}
			
			appLib.alert('This question has been tagged with: ' + data.input1 + '\n\nThe tag filter is available for "Work Smart" assessments in the "Advanced Options" section.');

			//## Tag added - close tag dialog
			$('#questionTagPopup').popup('close');
		};

		appLib.prompt('Tag this question with:', onSuccess, 'Tag Question');
	});
	

	$(document).on('click', '.deleteTag', function(evt) {	
		var tag = $(this).data('tag');
		var qid = $(this).data('qid');

		var onSuccess = function(result) {
			if(result !== 1)
				return;
						
			if(oe.deleteQuestionTag(qid, tag) !== null)
				$('#questionTagPopup').trigger('custom-reload');
		};

		appLib.confirm('Are you sure you want to delete "' + tag + '" tag?', onSuccess, 'Delete Tag?');
	});





	//##========================= Menu button when viewing Question / Answer
	
	function isAnswerVisible() {
		return $('.answerPage').length > 0;
	}

	function inSessionReview() {
		return $('#exitAnswerReview:visible').length > 0;
	}

	//## Close the In-Question Menu
	function closeInQuestionMenu() {
		$('#inQuestionMenuPopup')[0].hide();
	}


	$(document).on('click', '.inQuestionMenuButton', function() {	
        var popup = $('#inQuestionMenuPopup');
        var createPopup = (popup.length === 0);
        
        if(!createPopup) {
        	popup.remove();
        }
                
        //## OnSenUI: Menu works fine if appended in a single call. 
        //## It failed to render correctly when a the <ons-popover> was rendered and then markup appended inside it
        var template = _.template(oeTemplate.get('InQuestionMenuTemplate'));
        var html = template({         	
        	showIfAnswerIsVisible: appLib.cssDisplay(isAnswerVisible()),
        	inSessionReview: inSessionReview(),
        	isLoggedIn: oe.isLoggedIn()
        });
        $('.mobilePage:first').append('<ons-popover direction="down" id="inQuestionMenuPopup" cancelable>' + html + '</ons-popover>');
        

        //## jQuery object has a show method, but we want to call OnSenUI show so must get plain element        
    	$('#inQuestionMenuPopup')[0].show('.inQuestionMenuButton');
    });

	
	$(document).on('click', '.homeLink', function(evt) {	
		app.trigger('home');
	});

	$(document).on('click', '#newRevisionSession', function(evt) {	
		app.trigger('selectRevisionType');
	});


	$(document).on('click', '#sessionOverviewLink', function(evt) {			
		closeInQuestionMenu();
		$('#menuButton').click();				
	});

	$(document).on('click', '#scrollToQuestion', function(evt) {			
		try {
			if(isAnswerVisible()) {
				//## Question is the 2nd questionAnswer element
				window.scrollTo(0, $('.questionAnswer')[1].offsetTop - 70);				
			} else {
				window.scrollTo(0, 0);	
			}		
		} catch(e) { }

		closeInQuestionMenu();
	});

	$(document).on('click', '#scrollToExplanation', function() {	
		window.scrollTo(0, 0);	
		closeInQuestionMenu();
	});

	$(document).on('click', '#scrollToFeedback', function() {	
		window.scrollTo(0, $('#questionFeedbackHeader')[0].offsetTop - 70);
		closeInQuestionMenu();
	});

	$(document).on('click', '#scrollToRating', function() {	
		window.scrollTo(0, $('#rateQuestionHeader')[0].offsetTop - 70);
		closeInQuestionMenu();
	});




	//##========================= Popup dialog for in-question menu
    $(document).on('click', '#menuButton', function() {	
        var popup = $('#menuPopup');
        var createPopup = (popup.length === 0);
        
        if (createPopup) {
            //## Add the popup markup to the current page
            $('[data-role=content]').first().append('<div data-role="popup" id="menuPopup" data-overlay-theme="e" class="ui-content"></div>');
            popup = $('#menuPopup');
        } else {
            //## Empty existing popup
            popup.empty();
        }
        
    	appLib.trackEvent('Question Overview', 'Popup Opened', '');

		var popupWidth = $(window).width() * 0.8;
		var popupHeight = $(window).height() * 0.8;		
        popup.append('<div id="menuPopupInner" style="width:' + popupWidth + 'px; height:' + popupHeight + 'px; overflow:auto;"></div>');
		popup.append('<a href="#" id="menuPopupClose" data-rel="back" data-role="button" data-iconpos="notext" class="ui-btn-right ui-icon ui-icon-delete ui-icon-shadow popNavClose"></a>');
		
        		
		var questionTemplate = _.template($('#QuestionOptionPreviewTemplate').html());		
		var count = 1, questionsDisplayed = 0;
		var html = '';
		var currentQuestionIndex = oe.currentSession().get('questionIndex');
		var includeAnsweredQuestions = oe.currentSession().get('showAnswer') || oe.currentSession().isCompleted();
		
		oe.questionBank.each(function (question) {		
			var colour = 'blueBlock';
			
			if(question.isAnswered()) {
				var score = question.get('lastAnswer').get('score');
				if(score == 0)
					colour = 'redBlock';
				else if(score == 100)
					colour = 'greenBlock';
				else
					colour = 'yellowBlock';
			}
			
			if(count - 1 == currentQuestionIndex)
				colour += ' highlighted';
					
			if(includeAnsweredQuestions || !question.isAnswered()) {
				html += questionTemplate({ id: count, colour: colour });        	
				questionsDisplayed++;
			}
			
			count++;
		});
				
		var template = _.template($('#QuestionPreviewHeaderTemplate').html());
		
		var questionsDisplayedSuffix = (questionsDisplayed == 1 ? '' : 's');
		var headerText = (includeAnsweredQuestions 
							? questionsDisplayed + ' question' + questionsDisplayedSuffix + ' available'
							: questionsDisplayed + ' unanswered question' + questionsDisplayedSuffix);
		
		//## Height is based on showing part of some question id "blocks" to give the indication the area can be scrolled
		$('#menuPopupInner').append(template({ 
										headerText: headerText,
										questionOptionHtml: html, 
										height: popupHeight - 220,
										questionCount: oe.questionBank.length
									}));						
		
		showQuestionPreview(currentQuestionIndex);
		
        if(createPopup)
            popup.popup({ history: false });
        
        popup.popup('open', { positionTo:'window' });
		
		//## Scroll the current (highlighted) question index into view (question elements start at 1)
		//$('#questionPreview' + (currentQuestionIndex + 1))[0].scrollIntoView(true);
		var offset = $('#questionPreview' + (currentQuestionIndex + 1))[0].offsetTop;
		$('.questionNumberBlock').scrollTop(offset - 69);
	});
	
	
	//## Display the specified question text in the preview area (index is zero based)
	function showQuestionPreview(index) {
		var text = $('<p>' + oe.questionBank.at(index).get('text') + '</p>').text().substr(0, 100);
		if(text.length == 100)
			text += '...';

		//## Only allow session review if a question has been answered
		var reviewButtonStyle = (oe.currentSession().get('answers').length > 0 ? '' : 'display:none;');
		
		var template = _.template($('#QuestionPreviewFooterTemplate').html());
		$('#questionPreview').empty().append(template({ 
			id: index + 1, 
			text: text,
			reviewButtonStyle: reviewButtonStyle
		}));   
		
		//## Convert to jqm buttons
		$('#menuPopupInner button').button();
	}
	
		
	//## Question index links in Popup dialog 
    $(document).on('vclick', '.questionPreviewBlock', function() {
		
		var text = $(this).text();
		var id = parseInt(text, 10);
		
		showQuestionPreview(id - 1);
		
		//## Highlight only the selected question index
		$('.questionPreviewBlock').removeClass('highlighted');
		$(this).addClass('highlighted');
	});
	
	
	//## Close the popup and display the selected question
	$(document).on('click', '#moveToPreviewQuestionButton', function() {			
		var questionIndex = parseInt(this.value, 10) - 1;
		oe.currentSession().set('questionIndex', questionIndex);
		
		appLib.trackEvent('Question Overview', 'Jump to question', '');

		$('#menuPopup').popup('close');
		
		app.trigger('continueQuestions', questionIndex);		
	});

		
	//## Session Review click - confirm via dialog
	$(document).on('vclick', '#sessionReviewButton', function() {	
		appLib.confirm('Are you sure you want to finish this question session?',
					   function (index) {
					       if (index == 1)
					           app.trigger("viewSessionResults");
					   },
					   'Finish Questions?',
					   'Yes,No');
	});
	
	/*
	//## Android fix for fixed footer issue when select list is under it
	$(document).bind('tap', function(e) {
		console.log(e.target);
		var footerTap = $(e.target).closest("[data-role='footer']").length > 0;
		console.log('footer? ' + footerTap);
	
		if(footerTap)
			e.preventDefault();
	
        //if($(e.target).closest("[data-role='footer']").length > 0 || $(e.target).closest("[data-role='header']").length > 0) {
        //    $('[data-role="content"]').hide();
        //}
	});*/
	
}
