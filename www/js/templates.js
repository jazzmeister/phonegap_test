if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['AlphabeticChoiceTemplate.html'] = "<!-- AlphabeticChoiceTemplate -->\n" +
    "<!-- EMQ Choice (Alphabetic) -->\n" +
    "<tr><th style='width: 20px;'><%= letter %></th><td><%= text %></td></tr>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['AnsweredSJQOptionTemplate.html'] = "<!-- AnsweredSJQOptionTemplate -->\n" +
    "<!-- Disabled SJQ Question Option -->\n" +
    "\n" +
    "<li><%= answerText %></li>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['AppUpdateTemplate.html'] = "<!-- AppUpdateTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"content\">\n" +
    "		<h2 style=\"margin:0px;\">App Update Required</h2>\n" +
    "		<p>This version of the onExamination app is no longer supported. Please update to the latest version.</p>\n" +
    "		<p>\n" +
    "			<button id=\"appUpdate\" data-theme=\"e\">Update Application</button>\n" +
    "		</p>			\n" +
    "	</div>\n" +
    "</ons-page>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['ChallengeFriendTemplate.html'] = "<!-- ChallengeFriendTemplate -->\n" +
    "<h1 class=\"contentHeader\" style=\"margin-top: 0px !important;\">Challenge a Friend</h1>\n" +
    "\n" +
    "<% if(questionCount > 10) { %>\n" +
    "	<p>You can only challenge others to assessments with 10 questions or less.</p>\n" +
    "<% } else { %>\n" +
    "	<% if(email === null) { %>\n" +
    "		<p>Challenge a friend to this assessment by sharing a link with them. <i>They don't even need to be a BMJ OnExamination user!</i></p>\n" +
    "		<p>Once they complete their assessment we will email you both to reveal the winner.</p>\n" +
    "\n" +
    "		<!--\n" +
    "		<div style=\"padding:4px;\"></div>\n" +
    "		<input type=\"email\" pattern=\"[^ @]*@[^ @]*\" placeholder=\"Friend's Email\" id=\"challengeFriendEmail\">\n" +
    "		-->\n" +
    "\n" +
    "		<!-- TEMP START -->\n" +
    "		<div style=\"padding:4px;\"></div>\n" +
    "		<% if(allowShare) { %>\n" +
    "			<a id=\"shareChallengeButton\" data-role=\"button\" data-theme=\"b\" data-shadow=\"false\">Share Challenge</a>							\n" +
    "		<% } else { %>\n" +
    "			<p style=\"color:green;\">This feature is only available for Work Hard / Work Smart Assessments</p>\n" +
    "		<% } %>\n" +
    "		<!-- TEMP END -->\n" +
    "\n" +
    "		<!--\n" +
    "		<div style=\"padding:4px;\"></div>\n" +
    "		<a id=\"challengeFriendButton\" data-role=\"button\" data-theme=\"d\" data-shadow=\"false\">Send Challenge</a>				\n" +
    "		-->\n" +
    "	<% } else { %>\n" +
    "		<p>You have already made a challenge!</p>\n" +
    "	<% } %>\n" +
    "<% } %>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['DemoTemplate.html'] = "<!-- DemoTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1>Demo Questions</h1>		\n" +
    "	</div>\n" +
    "	<div data-role=\"content\" class=\"demo\">\n" +
    "		<p>Test yourself with our sample of 25 exam format questions. At the moment our App is only available on our MRCP Part 1 resource but all of our other resources are coming soon.</p>\n" +
    "		<p>To get more revision, visit the <a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">BMJ OnExamination website</a></p>\n" +
    "		<br />\n" +
    "		<button id=\"startQuestions\" data-icon=\"arrow-r\" data-theme=\"e\">Start Demo Questions</button>\n" +
    "		\n" +
    "		<div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</ons-page>    "; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['DisabledMCQOptionTemplate.html'] = "<!-- DisabledMCQOptionTemplate -->\n" +
    "<!-- Disabled MCQ Options -->\n" +
    "\n" +
    "<div class=\"mcqOptionRow\">\n" +
    "	<span class=\"mcqOptionText\">\n" +
    "		<%= answerText %>\n" +
    "	</span>\n" +
    "	<span class=\"mcqOption\">\n" +
    "		<fieldset data-role=\"controlgroup\" data-theme=\"e\" data-type=\"horizontal\">\n" +
    "			<input type=\"radio\" name=\"question-option-<%= id %>\" id=\"question-option-<%= id %>-true\" data-theme=\"e\" value=\"1\" disabled=\"disabled\" <%= trueSelected %> />\n" +
    "			<label for=\"question-option-<%= id %>-true\">True</label>\n" +
    "\n" +
    "			<input type=\"radio\" name=\"question-option-<%= id %>\" id=\"question-option-<%= id %>-false\" data-theme=\"e\" value=\"0\" disabled=\"disabled\" <%= falseSelected %> />\n" +
    "			<label for=\"question-option-<%= id %>-false\">False</label>\n" +
    "		</fieldset>\n" +
    "	</span>\n" +
    "</div>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['DisabledOptionCheckboxTemplate.html'] = "<!-- DisabledOptionCheckboxTemplate -->\n" +
    "<!-- Disabled Question Checkbox Option -->\n" +
    "\n" +
    "<input type=\"checkbox\" name=\"options\" data-theme=\"e\" id=\"question-option-<%= id %>\" value=\"<%= id %>\" disabled=\"disabled\" <%= checked %> />\n" +
    "<label for=\"question-option-<%= id %>\"><%= text %></label>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['DisabledQuestionOptionTemplate.html'] = "<!-- DisabledQuestionOptionTemplate -->\n" +
    "<!-- Disabled Question Radio Option -->\n" +
    "\n" +
    "<ons-list-item>\n" +
    "	<label class=\"left\">\n" +
    "		<ons-radio name=\"options\" data-theme=\"e\" input-id=\"question-option-<%= id %>\" value=\"<%= id %>\" disabled=\"disabled\" <%= checked %> />\n" +
    "	</label>\n" +
    "	<label class=\"center\" for=\"question-option-<%= id %>\"><%= text %></label>\n" +
    "</ons-list-item>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['EMQAnsweredQuestionStemTemplate.html'] = "<!-- EMQAnsweredQuestionStemTemplate -->\n" +
    "<!-- EMQ Answered Question Stem -->\n" +
    "\n" +
    "	<%= result %>\n" +
    "	<span class=\"emqStemText\" style=\"<%= style %>\"><%= text %></span>\n" +
    "	<span class=\"emqOption\">\n" +
    "		<select id=\"stem-<%= id %>\" data-theme=\"e\" disabled=\"disabled\">            \n" +
    "			<%= choiceHtml %>\n" +
    "		</select>\n" +
    "	</span>\n" +
    "	<%= correctAnswerText %>\n" +
    "	<div class=\"emqStemExplanation\">\n" +
    "		<%= comment %>\n" +
    "	</div>\n" +
    "<!--// END OF DIV OPENED IN VIEWS  //-->\n" +
    "</div>\n" +
    "\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['EMQAnsweredTemplate.html'] = "<!-- EMQAnsweredTemplate -->\n" +
    "<!-- View EMQ Answer -->	\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "        <% if(sessionType !== 'notification') { %>\n" +
    "            <div class=\"left\">\n" +
    "                <ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "                    <ons-icon icon=\"md-menu\"></ons-icon>                                        \n" +
    "                </ons-toolbar-button>               \n" +
    "            </div>\n" +
    "            <div class=\"center\">\n" +
    "                <%= questionIndex %> of <%= questionCount %>                    \n" +
    "            </div>\n" +
    "            <div class=\"right\">\n" +
    "                <a href=\"#NextQuestion\" class=\"button button--quiet\"><%= nextNavButtonText %></a>\n" +
    "            </div>            \n" +
    "        <% } else { %>        \n" +
    "            <div class=\"left\">\n" +
    "                <a href=\"#\" class=\"button button--quiet\">Home</a>\n" +
    "            </div>\n" +
    "            <div class=\"center\">\n" +
    "                Daily Question\n" +
    "            </div>\n" +
    "        <% } %>\n" +
    "    </ons-toolbar>\n" +
    "			\n" +
    "    <div data-role=\"content\" class=\"answerPage\" data-qid=\"<%= id %>\">		\n" +
    "		<div style=\"padding-bottom:30px; <%= exitAnswerReviewStyle %>\" id='exitAnswerReview'>\n" +
    "			<a href=\"#SessionReview\" data-icon=\"back\" data-theme=\"a\" data-role=\"button\" data-shadow=\"false\" data-inline=\"false\">Exit Answer Review</a>\n" +
    "		</div>\n" +
    "	\n" +
    "        <h2 class=\"<%= resultColour %>\"><%= result %></h2>\n" +
    "        <div class=\"questionAnswer\">\n" +
    "	        <h5 class=\"contentHeader\">Explanation</h5>\n" +
    "	        <%= comment %>\n" +
    "        </div>			\n" +
    "\n" +
    "        <div class=\"questionAnswer\">                \n" +
    "            <table class='alphaList'>\n" +
    "                <%= choiceList %>\n" +
    "            </table>\n" +
    "	        \n" +
    "	        <span class=\"emqInstruction\"><%= text %></span>\n" +
    "        </div>\n" +
    "                    \n" +
    "	    <%= stemHtml %>            \n" +
    "\n" +
    "	    <div class=\"contentGap\"></div>\n" +
    "\n" +
    "	    <%= contentEnd %>	        		\n" +
    "    </div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>		\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['EMQQuestionStemTemplate.html'] = "<!-- EMQAnsweredTemplate -->\n" +
    "<!-- EMQ Question Stem -->\n" +
    "\n" +
    "<div class=\"emqQuestionStem\">\n" +
    "	<span class=\"emqStemText\" style=\"<%= style %>\"><%= text %></span>\n" +
    "	<span class=\"emqOption\">\n" +
    "		<select id=\"stem-<%= id %>\" data-theme=\"e\" data-additional-answer=\"<%= isAdditionalAnswer %>\" >\n" +
    "			<option value=\"-1\">Please select an option</option>\n" +
    "			<%= choiceHtml %>\n" +
    "		</select>\n" +
    "	</span>\n" +
    "</div>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['EMQTemplate.html'] = "<!-- EMQTemplate -->\n" +
    "<!-- Ask a EMQ Question -->	\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "        <% if(sessionType !== 'notification') { %>\n" +
    "            <div class=\"left\">\n" +
    "                <ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "                    <ons-icon icon=\"md-menu\"></ons-icon>                                        \n" +
    "                </ons-toolbar-button>               \n" +
    "            </div>\n" +
    "            <div class=\"center\"><%= questionIndex %> of <%= questionCount %></div>\n" +
    "            <div class=\"right\">\n" +
    "                <ons-toolbar-button id=\"session-review-button\" class=\"sessionReview\" style=\"<%= reviewButtonStyle %>\" >Review</ons-toolbar-button>\n" +
    "            </div>\n" +
    "            \n" +
    "        <% } else { %>          \n" +
    "            <div class=\"center\">Daily Question</div>\n" +
    "        <% } %>\n" +
    "    </ons-toolbar>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"questionPage\">\n" +
    "        <div class=\"question\">                \n" +
    "            <h5 class=\"contentHeader\">Theme: <%= theme %></h5>\n" +
    "\n" +
    "            <table class='alphaList'>\n" +
    "                <%= choiceList %>\n" +
    "            </table>\n" +
    "	        \n" +
    "	        <span class=\"emqInstruction\"><%= text %></span>\n" +
    "        </div>\n" +
    "                    \n" +
    "	    <%= stemHtml %>            \n" +
    "        		\n" +
    "		<div class=\"ui-grid-solo\">\n" +
    "			<div class=\"ui-block-a marginTop answerButton\">\n" +
    "				<button id=\"answer-button\" data-theme=\"b\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-shadow=\"false\">Answer Question</button>\n" +
    "			</div>\n" +
    "		</div>	 \n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>       \n" +
    "	</div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['ExamSelectionTemplate.html'] = "<!-- ExamSelectionTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href=\"#\" class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1>Exam SelectionS</h1>			\n" +
    "	</div>\n" +
    "	<div data-role=\"content\">\n" +
    "		<div data-role=\"fieldcontain\">\n" +
    "			<h1 class=\"pageHeading\">What would you like to Revise?</h1>\n" +
    "			<select name=\"examList\" data-theme=\"e\" id=\"examList\">					\n" +
    "			</select>\n" +
    "		</div>\n" +
    "			\n" +
    "		<div class=\"marginBottom\" style=\"<%= displayExamDateSection %>\">				\n" +
    "			<p id=\"examDate\" data-date=\"\"></p>\n" +
    "			<a id=\"selectExamDate\" data-theme=\"e\" data-role=\"button\" data-shadow=\"false\">Set Exam Date</a>\n" +
    "		</div>\n" +
    "			\n" +
    "		<div class=\"marginTop\">                \n" +
    "			<button id=\"selectExam\" data-icon=\"check\" data-theme=\"b\" data-shadow=\"false\"><%= selectExamButton %></button>			\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['FeedbackTemplate.html'] = "<!-- FeedbackTemplate -->\n" +
    "<h5 class=\"contentHeader contentGap\" id=\"questionFeedbackHeader\">Feedback</h5>\n" +
    "\n" +
    "<fieldset data-role=\"controlgroup\" id=\"questionFeedbackGroup\">\n" +
    "	<label for=\"questionFeedback\">You can use this form to leave feedback for the author</label>\n" +
    "	<textarea name=\"textarea\" id=\"questionFeedback\"><%= feedback %></textarea>\n" +
    "</fieldset>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['GettingStartedTemplate.html'] = "<!-- GettingStartedTemplate -->\n" +
    "<ons-page>\n" +
    "    <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "    	<h1>Getting Started</h1>\n" +
    "    </div>\n" +
    "    <div data-role=\"content\" class=\"gettingStarted\">\n" +
    "    	<h1 class=\"pageHeading\">Revise Using our Free Questions</h1>\n" +
    "    	<p>The BMJ OnExamination app lets you revise anytime, anywhere with our clinically rich case problems that test your knowledge across a range of relevant topics and question formats.</p>\n" +
    "		<p>You can choose to revise with or without a data connection, enabling you to answer questions both on and offline.</p>\n" +
    "		<p>Our app containing a selection of free questions is available on a range of our revision resources including:</p>\n" +
    "	\n" +
    "		<ul class=\"gettingStartedExamList\">\n" +
    "		\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/general-medicine/mrcp-part-1?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCP Part 1</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/general-medicine/mrcp-part-2-written?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCP Part 2 written</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/general-practice/mrcgp?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCGP</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/general-practice/gp-st-stage-2-knowledge-test?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">GP ST</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/students/medical-student-finals?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">Medical Student Finals</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/students/situational-judgement-test?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">Situational Judgement Test for Students</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/students/medical-student-years-2-to-3?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">Medical Student Years 2-3</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/students/medical-student-year-1?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">Medical Student Year 1</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/obs-and-gynae/mrcog-part-1?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCOG Part 1</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/obs-and-gynae/mrcog-part-2?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCOG Part 2</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/obs-and-gynae/drcog?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">DRCOG</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/child-health/mrcpch-part-1-a-and-b?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCPCH Part 1 A &amp; B</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/child-health/mrcpch-part-2?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCPCH Part 2</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/surgery/mrcs-part-a-papers-1-and-2?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">MRCS Part A Papers 1 & 2</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/surgery/frcs-general-surgery?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">FRCS General Surgery</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/worldwide/plab?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">PLAB</a></li>\n" +
    "			\n" +
    "			<li><a onclick=\"appLib.openLink('http://www.onexamination.com/anaesthesia/frca-primary?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App', '_system');\">FRCA Primary</a></li>\n" +
    "			\n" +
    "		</ul>\n" +
    "	\n" +
    "		<p>and many more.</p>\n" +
    "		\n" +
    "		<p>Choose to revise with either Work Smart - which allows you to answer questions by topic, level of difficulty or key word; or Work Hard - which delivers revision questions to you in a random order to fully prepare you for exam day.</p>\n" +
    "\n" +
    "		<p>Check your scores at the end of each session to see how well you performed. </p>\n" +
    "	    \n" +
    "	    <h3>Current BMJ OnExamination Customers</h3>\n" +
    "	    <p>Once signed in to your account you can download up to 100 questions at a time and revise using both Work Hard or Work Smart. After completing a set of questions your answers and scores will synchronise back to your account (if an internet connection is available). You can also work offline and answer previously downloaded questions.</p> \n" +
    "        \n" +
    "        <h3>Get a Revision Account with BMJ OnExamination</h3>\n" +
    "	    <p>If you don't already have a revision account with BMJ OnExamination, you can sign-up for the full database of questions at <a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">BMJ OnExamination</a>.</p>\n" +
    "	    \n" +
    "	    <h3>Answering Questions</h3>\n" +
    "	    <p>You need an internet connection to download questions before you are able to answer them offline. Questions can download in batches of up to 100  at a time. Once a question has been answered the correct option, explanation and links to further reading will be displayed.</p>\n" +
    "	    \n" +
    "	    <h3>Scores</h3>\n" +
    "	    <p>At the end of each session to will be given a score to know how well you did in that session. If an internet connection is available your scores will be synchronised with your online revision resource.</p>\n" +
    "	    <br />\n" +
    "    	<div class=\"clear\"></div>\n" +
    "    	<div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "    	</div>\n" +
    "    \n" +
    "    </div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['HomeTemplate.html'] = "<!--HomeTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\" class=\"home\">\n" +
    "	    <span class=\"logo\">\n" +
    "	    	<img src=\"img/logo.png\" />\n" +
    "	    </span>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div data-role=\"content\" class=\"home\">\n" +
    "	    <h1 class=\"brandTagLine\"></h1>\n" +
    "	    <div class=\"buttonsWrapper\">\n" +
    "	    	<fieldset data-role=\"controlgroup\" class=\"newSessionButton\">\n" +
    "	    		<ons-button modifier=\"large\" id='newSessionButton'>Start New Revision Session</ons-button>  \n" +
    "    		</fieldset>\n" +
    "\n" +
    "			<fieldset data-role=\"controlgroup\" class=\"continueButton\">\n" +
    "			    <ons-button modifier=\"large\" id='continueSessionButton' style=\"<%= continueButtonStyle %>\"><%= continueButtonText %></ons-button>  \n" +
    "			</fieldset>\n" +
    "\n" +
    "			<fieldset data-role=\"controlgroup\"  class=\"challengeButton\">\n" +
    "			   	<ons-button modifier=\"large\" id='receievedChallengeButton' style=\"<%= challengeButtonStyle %>\">Received a challenge?</ons-button>\n" +
    "		   	</fieldset>\n" +
    "\n" +
    "			<fieldset data-role=\"controlgroup\" class=\"optionButtons\">			    \n" +
    "			    <a href=\"#Settings\" data-role=\"button\" data-icon=\"gear\" data-iconpos=\"left\" data-theme=\"e\">Settings</a>\n" +
    "			    <a href=\"#GettingStarted\" data-role=\"button\" data-icon=\"info\" data-iconpos=\"left\" data-theme=\"e\">Information</a>\n" +
    "			</fieldset>\n" +
    "			<fieldset data-role=\"controlgroup\"  class=\"challengeButton\">\n" +
    "				<a href=\"#ListChallenges\" id=\"waitingChallenges\" data-role=\"button\" data-theme=\"d\" data-icon=\"user\" data-shadow=\"false\" data-iconshadow=\"false\" style=\"display:none;\">-</a>\n" +
    "			</fieldset>\n" +
    "	    </div>\n" +
    "	    <div class=\"mainImage\">\n" +
    "			<span>\n" +
    "				<img src=\"img/StudentsLg.jpg\" />\n" +
    "			</span>\n" +
    "	    </div>\n" +
    "	    <div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "	    </div>\n" +
    "		<div id=\"mainmenu\"></div>		\n" +
    "	</div>\n" +
    "</ons-page>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['InQuestionMenuTemplate.html'] = "<!-- InQuestionMenuTemplate -->\n" +
    "<!-- Popup in-question menu -->\n" +
    "\n" +
    "<ons-list>\n" +
    "    <ons-list-header>Menu</ons-list-header>\n" +
    "    <ons-list-item tappable class=\"homeLink\">Home</ons-list-item>\n" +
    "    <ons-list-item tappable id=\"sessionOverviewLink\">Session Overview</ons-list-item>\n" +
    "    <% if(isLoggedIn) { %>\n" +
    "    	<ons-list-item tappable id=\"newRevisionSession\">Start New Revision Session</ons-list-item>\n" +
    "	<% } %>\n" +
    "\n" +
    "    <ons-list-header>Jump to</ons-list-header>\n" +
    "    <ons-list-item tappable id=\"scrollToQuestion\">Question</ons-list-item>\n" +
    "    <ons-list-item tappable id=\"scrollToExplanation\" style=\"<%= showIfAnswerIsVisible %>\">Explanation</ons-list-item>\n" +
    "    <% if(!inSessionReview) { %>\n" +
    "    	<ons-list-item tappable id=\"scrollToRating\" style=\"<%= showIfAnswerIsVisible %>\">Question Rating</ons-list-item>\n" +
    "    	<ons-list-item tappable id=\"scrollToFeedback\" style=\"<%= showIfAnswerIsVisible %>\">Question Feedback</ons-list-item>\n" +
    "	<% } %>\n" +
    "</ons-list>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['ListChallengesTemplate.html'] = "<!-- ListChallengesTemplate -->\n" +
    "<!-- List Challenges -->\n" +
    "\n" +
    "<ons-page>\n" +
    "    <div data-role=\"header\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "    	<h1>Challenges</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-role=\"content\">\n" +
    "		<div data-role=\"fieldcontain\">\n" +
    "			<h1 class=\"pageHeading\">Challenges from your friends</h1>\n" +
    "			<select name=\"challengeList\" data-theme=\"e\" id=\"challengeList\">					\n" +
    "			</select>\n" +
    "		</div>\n" +
    "										\n" +
    "		<div class=\"marginTop\">                \n" +
    "			<button id=\"selectChallenge\" data-icon=\"check\" data-theme=\"b\" data-shadow=\"false\">Start Challenge</button>			\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['LoginTemplate.html'] = "<!-- LoginTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1>Sign In</h1>\n" +
    "	</div>\n" +
    "	<div data-role=\"content\" class=\"login\">\n" +
    "		<h1 class=\"pageHeading\">Sign in to your account:</h1>\n" +
    "		<div class=\"ui-hide-label\">\n" +
    "			<fieldset data-role=\"controlgroup\">\n" +
    "				<label for=\"email\">Email address</label>\n" +
    "				<input id=\"email\" placeholder=\"email\" value=\"\" type=\"email\" pattern=\"[^ @]*@[^ @]*\" class=\"marginBottom\" />\n" +
    "				<label for=\"password\">Password</label>\n" +
    "				<input id=\"password\" placeholder=\"password\" value=\"\" type=\"password\" />	\n" +
    "			</fieldset>\n" +
    "			<br />\n" +
    "			<button id=\"login-button\" data-theme=\"e\" data-icon=\"arrow-r\" data-shadow=\"false\">Sign In</button>\n" +
    "		</div>\n" +
    "		<br />\n" +
    "			\n" +
    "		<div class=\"hr\"><hr /></div>\n" +
    "\n" +
    "		<ons-gesture-detector>\n" +
    "			  <div id=\"detect-area\" style=\"width: 200px; height: 300px; background-color: red;\">\n" +
    "			    Swipe Here\n" +
    "			  </div>\n" +
    "			</ons-gesture-detector>\n" +
    "\n" +
    "		\n" +
    "		<div style=\"<%= demoModeStyle %>\">\n" +
    "			<div>\n" +
    "				<h4>Don't have a BMJ OnExamination account?</h4>\n" +
    "			</div>\n" +
    "			<fieldset data-role=\"controlgroup\">\n" +
    "				<a href='#SelectDemoExam' data-role=\"button\" data-theme=\"e\">Try our Demo Questions</a>   \n" +
    "			</fieldset>\n" +
    "		</div>\n" +
    "		<br />\n" +
    "		<div class=\"clear\"></div>\n" +
    "		<div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    "<script>\n" +
    "  document.addEventListener('swipeleft', function(event) {\n" +
    "    if (event.target.matches('#detect-area')) {\n" +
    "    	pushPage('homeTemplate.html', {data: {title: 'Page 2'}});\n" +
    "      console.log('Swipe left is detected.');\n" +
    "    }\n" +
    "  });\n" +
    "</script>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['MCQAnsweredTemplate.html'] = "<!-- MCQAnsweredTemplate -->\n" +
    "<!-- View MCQ Answer -->\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "        <% if(sessionType !== 'notification') { %>\n" +
    "            <div class=\"left\">\n" +
    "                <ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "                    <ons-icon icon=\"md-menu\"></ons-icon>                                        \n" +
    "                </ons-toolbar-button>               \n" +
    "            </div>\n" +
    "            <div class=\"center\">\n" +
    "                <%= questionIndex %> of <%= questionCount %>                    \n" +
    "            </div>\n" +
    "            <div class=\"right\">\n" +
    "                <a href=\"#NextQuestion\" class=\"button button--quiet\"><%= nextNavButtonText %></a>\n" +
    "            </div>            \n" +
    "        <% } else { %>        \n" +
    "            <div class=\"left\">\n" +
    "                <a href=\"#\" class=\"button button--quiet\">Home</a>\n" +
    "            </div>\n" +
    "            <div class=\"center\">\n" +
    "                Daily Question\n" +
    "            </div>\n" +
    "        <% } %>\n" +
    "    </ons-toolbar>\n" +
    "			\n" +
    "    <div data-role=\"content\" class=\"answerPage\" data-qid=\"<%= id %>\">			\n" +
    "		<div style=\"padding-bottom:30px; <%= exitAnswerReviewStyle %>\" id='exitAnswerReview'>\n" +
    "			<a href=\"#SessionReview\" data-icon=\"back\" data-theme=\"a\" data-role=\"button\" data-shadow=\"false\" data-inline=\"false\">Exit Answer Review</a>\n" +
    "		</div>\n" +
    "	\n" +
    "        <h2 class=\"<%= resultColour %>\"><%= result %></h2>\n" +
    "        <div class=\"questionAnswer\">\n" +
    "	        <h5 class=\"contentHeader\">Explanation</h5>\n" +
    "	        <%= comment %>\n" +
    "        </div>\n" +
    "        \n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "        <div class=\"questionAnswer\">\n" +
    "	        <h5 class=\"contentHeader\">Question</h5>\n" +
    "	        <%= text %>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"mcqQuestionOptions\"> \n" +
    "	        <%= optionHtml %>\n" +
    "        </div>\n" +
    "\n" +
    "    	<div class=\"contentGap\"></div>\n" +
    "\n" +
    "        <%= contentEnd %>\n" +
    "    </div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['MCQOptionTemplate.html'] = "<!-- MCQOptionTemplate -->\n" +
    "<!-- MCQ Options -->\n" +
    "\n" +
    "<div class=\"mcqOptionRow\">\n" +
    "	<span class=\"mcqOptionText\">\n" +
    "		<%= answerText %>\n" +
    "	</span>\n" +
    "	<span class=\"mcqOption\">\n" +
    "		<fieldset data-role=\"controlgroup\" data-theme=\"e\" data-type=\"horizontal\">\n" +
    "			<input type=\"radio\" name=\"question-option-<%= id %>\" id=\"question-option-<%= id %>-true\" data-theme=\"e\"  value=\"1\" />\n" +
    "			<label for=\"question-option-<%= id %>-true\">True</label>\n" +
    "			<input type=\"radio\" name=\"question-option-<%= id %>\" id=\"question-option-<%= id %>-false\" data-theme=\"e\" value=\"0\" />\n" +
    "			<label for=\"question-option-<%= id %>-false\">False</label>\n" +
    "		</fieldset>\n" +
    "	</span>\n" +
    "</div>	\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['MCQTemplate.html'] = "<!-- MCQTemplate -->\n" +
    "<!-- Ask a MCQ Question -->	\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "    	<% if(sessionType !== 'notification') { %>\n" +
    "    		<div class=\"left\">\n" +
    "	        	<ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "	        		<ons-icon icon=\"md-menu\"></ons-icon>	        			        		\n" +
    "	        	</ons-toolbar-button>	        	\n" +
    "        	</div>\n" +
    "        	<div class=\"center\"><%= questionIndex %> of <%= questionCount %></div>\n" +
    "        	<div class=\"right\">\n" +
    "	        	<ons-toolbar-button id=\"session-review-button\" class=\"sessionReview\" style=\"<%= reviewButtonStyle %>\" >Review</ons-toolbar-button>\n" +
    "    		</div>\n" +
    "            \n" +
    "    	<% } else { %>        	\n" +
    "    		<div class=\"center\">Daily Question</div>\n" +
    "    	<% } %>\n" +
    "    </ons-toolbar>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"questionPage\">\n" +
    "        <div class=\"question\">\n" +
    "	        <h5 class=\"contentHeader\">Question</h5>\n" +
    "	        <%= text %>\n" +
    "        </div>\n" +
    "		\n" +
    "        <div class=\"mcqQuestionOptions\"> \n" +
    "	        <%= optionHtml %>\n" +
    "        </div>\n" +
    "        		\n" +
    "		<div class=\"ui-grid-solo\">\n" +
    "			<div class=\"ui-block-a marginTop answerButton\">\n" +
    "				<button id=\"answer-button\" data-theme=\"b\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-shadow=\"false\">Answer Question</button>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>	        \n" +
    "	</div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['MockTestSelectionTemplate.html'] = "<!-- MockTestSelectionTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1>Mock Test</h1>						\n" +
    "	</div>\n" +
    "	<div data-role=\"content\">			\n" +
    "		<h1 class=\"pageHeading\" style=\"padding-bottom:20px;\">Select a Mock Test:</h1>			\n" +
    "\n" +
    "		<ul data-role=\"listview\" data-theme=\"e\" data-divider-theme=\"d\" style=\"padding: 0px 20px;\">								\n" +
    "			<% 	_.each(assessmentTemplates, function(template) { %>\n" +
    "				<li id=\"mockTestListButton\">\n" +
    "					<a class=\"mocktest\" data-assessmenttemplateid=\"<%= template.Id %>\">\n" +
    "						<div style=\"float:left; padding-top:10px;\">\n" +
    "							<span class=\"oe-icon-mock-tests oe-icon\"></span>\n" +
    "						</div>\n" +
    "						<div>\n" +
    "							<h3><%= template.Name %></h3>\n" +
    "							<p><%= template.Description %></p>\n" +
    "						</div>\n" +
    "					</a>\n" +
    "				</li>\n" +
    "			<% }); %>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['NotificationTimeSelectionTemplate.html'] = "<!-- NotificationTimeSelectionTemplate -->\n" +
    "<h4 style=\"font-weight: bold;\">Daily Notification</h4>\n" +
    "\n" +
    "<div>\n" +
    "	<div data-role=\"fieldcontain\" class=\"marginBottom\">\n" +
    "		<label for=\"notificationTime\">What time would you like your daily notification?</label>\n" +
    "		<select id=\"notificationTime\" class=\"jqmSelect\" data-theme=\"e\">\n" +
    "			<option value=\"-1\">No Notification</option>\n" +
    "\n" +
    "			<% \n" +
    "				for(var hour = 0; hour < 24; hour++) { \n" +
    "					for(var minute = 0; minute < 60; minute += 30) {\n" +
    "\n" +
    "						var mins = (hour * 60) + minute;								\n" +
    "			%>\n" +
    "						<option value=\"<%= mins %>\" <%= (mins == selectedTime ? \"selected\" : \"\") %>>\n" +
    "							<%= appLib.right('0' + hour, 2) %>:<%= appLib.right('0' + minute, 2) %>\n" +
    "						</option>			\n" +
    "			<%\n" +
    "					} \n" +
    "				}\n" +
    "			%>											\n" +
    "		</select>\n" +
    "	</div>\n" +
    "\n" +
    "	<button id=\"saveNotification\" class=\"jqmButton\" data-theme=\"b\" data-shadow=\"false\">Save</button>\n" +
    "</div>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['OptionCheckboxTemplate.html'] = "<!-- OptionCheckboxTemplate -->\n" +
    "<!-- Question Checkbox Option -->\n" +
    "\n" +
    "<input type=\"checkbox\" name=\"options\" data-theme=\"e\" id=\"question-option-<%= id %>\" value=\"<%= id %>\" />\n" +
    "<label for=\"question-option-<%= id %>\"><%= text %></label>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['PrivacyPolicyTemplate.html'] = "<!-- PrivacyPolicyTemplate -->\n" +
    "<ons-page>\n" +
    "    <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Back</a>\n" +
    "    	<h1>Privacy Policy</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"settings\">\n" +
    "    \n" +
    "	    <div>\n" +
    "			<p>Protecting your privacy is one of our top priorities. Please take a few minutes to review this policy.</p>\n" +
    "			<h2>Introduction</h2>\n" +
    "			<h3>Our privacy commitment</h3>\n" +
    "			<p>This document sets out the basis on which the BMJ Publishing Group Limited (\"BMJ Group\") will process any personal data we collect from you. The BMJ Group shall be the data controller. We will make every effort to protect your privacy by adopting a consistently high level of security and adhering to strict company policies on how we store and use personal information. This privacy policy has been developed in accordance with our legal obligations and may be updated from time to time. If we make any changes to this privacy policy, we will post the revisions within our various mobile software applications (\"App\"). If in response to any communication we have with you or otherwise, you are directed to any of our websites, the privacy policy contained herein will govern the collection and use of your data. We may from time to time amend that privacy policy and post those revisions on the BMJ Group site.</p>\n" +
    "			<h2>1. What information is being collected and how is it used?</h2>\n" +
    "			<h3>1.1 App Users</h3>\n" +
    "			<p>\n" +
    "			Some of our Apps require registration to access certain functions, services or content or ask for you to opt in to our database for email communications. You will know what information is being collected via these processes when you complete required details prior to submission (including which information is mandatory).</p>\n" +
    "			<p>Once you start using our Apps, we may track and keep a record of the pages overall that our users you visit. We do this via tracking a UDID. We collect this data from groups of users to get a sense of how people are using our Apps and which content and areas are most popular. This helps us improve what we offer on our Apps.</p>\n" +
    "			If we wish to send you marketing emails, you may be given an opportunity to opt in or out (as applicable) from receiving these from the BMJ Group.<br /><br />\n" +
    "			<p>For users who have opted to receive marketing emails from BMJ Group, and visit our websites through links provided in these emails, we may send back information about your website usage to our third party email direct marketing provider. This is for the purpose of understanding the effectiveness of our email marketing campaigns and for targeting future email campaigns.</p>\n" +
    "			<br />\n" +
    "			<h3>1.2 What else do we collect when you use our website?</h3>\n" +
    "			<p>If you contact us, we may keep a record of that correspondence and use it to contact you in response and/or to update our records. We may use all information to enforce our legal rights and protect against unauthorised access, use, activity and/or copying, either personally or via third party contractors and advisors. This may involve using your name and subscription details on a database with other publishers' data for detection purposes.</p>\n" +
    "			<h3>1.3 What else do we use personal information for?</h3>\n" +
    "			<p>Other than for fulfilling our obligations to you (where these exist), on some occasions we use the information provided to produce aggregate statistics in relation to pages being accessed. We may also use it to monitor usage patterns of our content in order to improve navigation and design features to help you get information more easily. This information is provided to us as daily logged files. In order to help us develop our services, we may provide such aggregate information to third parties. The statistics however will not include any information that can be used to identify any individual. We may contact you to notify you about changes to our service. We also may send you non marketing emails for the purpose of inviting you to partake in surveys or market research which we conduct or which third parties are conducting. In addition to responding to complaints or claims received or discovered referred to above or any breaches of our relevant terms of use, all information supplied or collected by us may be used to enforce our legal rights and protect against unauthorised access, use, activity and/or copying, either personally or via third party contractors and advisors and/or protect the rights, property, or personal safety other users of the websites and the public. This may involve using any details supplied by you including your name and contact details.</p>\n" +
    "			<h2>2. How long do we keep the information we collect?</h2>\n" +
    "			<p>We keep (including via our contractors) your personal information for as long as necessary to fulfil our obligations to you and to protect our legal interests.</p>\n" +
    "			<h2>3. To whom will information be disclosed?</h2>\n" +
    "			<p>Other than as expressly agreed by you or stated when data is collected or within this policy we will not disclose your personal data to any third parties other than:</p>\n" +
    "			<p>(i) our co-owners (where applicable),Licensors, contractors and advisors who must keep this data confidential and who may be located outside of the EEA;</p>\n" +
    "			<p>(ii) as required to enforce our legal rights (including property, safety, our customers or others);</p>\n" +
    "			<p>(iii) fraud protection and credit risk reduction; and</p>\n" +
    "			<p>(iv) where our company or its assets (to which your data relates) are to be acquired by a new company location data may be shared;</p>\n" +
    "			<h2>4. How personal information is stored and protected</h2>\n" +
    "			<p>Your personal data is stored in our databases or those of our contractors which is only available to the web administrators of us and our contractors and selected authorised people on a password protected basis. The data that we collect from you may be transferred to and stored at a destination outside of the European Economic Area (\"EEA\"). It may also be processed by staff operating outside of the EEA who work for us or are of our suppliers. Such staff may be engaged in among other things, hosting the fulfilment of your order, processing of your payment details and the provision of support services by submitting your personal data, you agree to this transfer, storing or process. We will take all steps reasonably necessary to ensure that your data is treated securely by us and our contractors and in accordance with this privacy policy.</p>\n" +
    "			<h3>4.1 Security</h3>\n" +
    "			<p>We understand that the security of your information is important to you. We also understand that our continued success as a publisher relies on our ability to communicate with you in a secure manner. We adhere to the highest standards of decency, fairness, and integrity in our operations. We use several measures to authenticate your identity when you visit our sites or access out content. We also take steps to protect your information as it travels the internet, and to make sure all information is as secure as possible against unauthorised access and use (for example, by hackers). We review our security measures regularly.</p>\n" +
    "			<p>Despite our best efforts, and the best efforts of other firms, \"perfect security\" does not exist on the internet, or anywhere else. Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data transmitted to our sites; any transmission is at your own risk. Once we have received your information, we will use strict procedures and security features to try to prevent unauthorised access.</p>\n" +
    "			<h3>4.2 Email</h3>\n" +
    "			<p>Any email between you and the BMJ Group is not encrypted. It will be stored securely within our corporate firewall (see below).</p>\n" +
    "			<h3>4.3 Data within our walls</h3>\n" +
    "			<p>The information we collect about people is stored in secure environments that are not available to any other individual or party. We have mechanisms in place to protect data. One such mechanism is called a \"firewall.\" A firewall is a barrier that allows only authorised traffic through. It safeguards our computer systems and your information. We also use system and application logs to track all access. We review these logs periodically and investigate any anomalies or discrepancies.</p>\n" +
    "			<h2>5 Contact us</h2>\n" +
    "			<p>Please contact us if any of the data we hold about you becomes inaccurate and if you have any queries or concerns about the data we are holding about you. Also we welcome your feedback about what you like or don't like about our sites. Your feedback is stored on a secure internal system that allows the appropriate person to respond to you. Please contact us through our <a onclick=\"appLib.openLink('http://www.bmj.com/company/contact-us/');\">Contact us </a>section.</p>\n" +
    "			<h2>6. Your consent</h2>\n" +
    "			<p>By submitting your information, you consent to the use of that information as set out in this policy. You should review this policy regularly, to note any changes as to how we collect and use personal information. Thank you for reviewing this information.</p>\n" +
    "			<p>If you have any questions, please send us an e-mail through our <a onclick=\"appLib.openLink('http://www.bmj.com/company/contact-us/');\">Contact us</a> section.</p>\n" +
    "			<p><em>Last updated October 2015</em></p>\n" +
    "\n" +
    "		    <a href=\"#Settings\" data-role=\"button\" data-theme=\"e\" data-icon=\"back\" data-shadow=\"false\">Back</a><br /><br /><br />\n" +
    "		</div>	    \n" +
    "	    <div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "	    </div>\n" +
    "      \n" +
    "    </div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionBrowserAnsweredTemplate.html'] = "<!-- QuestionBrowserAnsweredTemplate -->\n" +
    "<!-- View BoF/NOM Question Answer -->\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "    	<% if(sessionType !== 'notification') { %>\n" +
    "    		<div class=\"left\">\n" +
    "	        	<ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "	        		<ons-icon icon=\"md-menu\"></ons-icon>	        			        		\n" +
    "	        	</ons-toolbar-button>	        	\n" +
    "        	</div>\n" +
    "        	<div class=\"center\">\n" +
    "        		<%= questionIndex %> of <%= questionCount %>        			\n" +
    "    		</div>\n" +
    "        	<div class=\"right\">\n" +
    "	        	<a href=\"#NextQuestion\" class=\"button button--quiet\"><%= nextNavButtonText %></a>\n" +
    "    		</div>            \n" +
    "    	<% } else { %>        \n" +
    "    		<div class=\"left\">\n" +
    "    			<a href=\"#\" class=\"button button--quiet\">Home</a>\n" +
    "			</div>\n" +
    "    		<div class=\"center\">\n" +
    "    			Daily Question\n" +
    "    		</div>\n" +
    "    	<% } %>\n" +
    "    </ons-toolbar>\n" +
    "				\n" +
    "	<div data-role=\"content\" class=\"answerPage\" data-qid=\"<%= id %>\">	\n" +
    "		<div style=\"padding-bottom:30px; <%= exitAnswerReviewStyle %>\" id='exitAnswerReview'>\n" +
    "			<a href=\"#SessionReview\" data-icon=\"back\" data-theme=\"a\" data-role=\"button\" data-shadow=\"false\" data-inline=\"false\">Exit Answer Review</a>\n" +
    "		</div>\n" +
    "	\n" +
    "		<h2 class=\"<%= resultColour %>\"><%= result %></h2>\n" +
    "		<div class=\"questionAnswer\">\n" +
    "			<h5 class=\"contentHeader\">Explanation</h5>\n" +
    "			<%= comment %>\n" +
    "		</div>\n" +
    "		\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<div class=\"questionAnswer\">\n" +
    "			<h5 class=\"contentHeader\">Question</h5>\n" +
    "			<%= text %>\n" +
    "		</div>\n" +
    "	\n" +
    "		<fieldset data-role=\"controlgroup\" id=\"optionList\" data-theme=\"e\">								\n" +
    "			<legend><i><%= selectText %></i></legend>\n" +
    "			<%= optionHtml %>\n" +
    "		</fieldset>						\n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>	\n" +
    "	</div>\n" +
    "	\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionBrowserTemplate.html'] = "<!-- QuestionBrowserTemplate -->\n" +
    "<!-- Ask a BoF/NOM Question -->	\n" +
    "\n" +
    "<ons-page>    \n" +
    "	<ons-toolbar>\n" +
    "    	<% if(sessionType !== 'notification') { %>\n" +
    "    		<div class=\"left\">\n" +
    "	        	<ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "	        		<ons-icon icon=\"md-menu\"></ons-icon>\n" +
    "	        	</ons-toolbar-button>\n" +
    "        	</div>\n" +
    "        	<div class=\"center\"><%= questionIndex %> of <%= questionCount %></div>\n" +
    "        	<div class=\"right\">\n" +
    "	        	<ons-toolbar-button id=\"session-review-button\" class=\"sessionReview\" style=\"<%= reviewButtonStyle %>\" >Review</ons-toolbar-button>\n" +
    "    		</div>\n" +
    "            \n" +
    "    	<% } else { %>        	\n" +
    "    		<div class=\"center\">Daily Question</div>\n" +
    "    	<% } %>\n" +
    "    </ons-toolbar>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"questionPage\" >\n" +
    "        <div class=\"question\">\n" +
    "	        <h1 class=\"questionHeading contentHeader\">Question</h1>\n" +
    "	        <%= text %>\n" +
    "        </div>\n" +
    "	\n" +
    "        <fieldset data-role=\"controlgroup\" id=\"optionList\" >								\n" +
    "	        <legend><%= selectText %></legend>\n" +
    "	        <%= optionHtml %>\n" +
    "        </fieldset>		\n" +
    "		\n" +
    "		<div class=\"ui-grid-solo\">\n" +
    "			<div class=\"ui-block-a marginTop answerButton\">\n" +
    "				<ons-button modifier=\"large\" id=\"answer-button\">Answer Question</ons-button>\n" +
    "			</div>\n" +
    "		</div>				\n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>\n" +
    "	</div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionContentFooterTemplate.html'] = "<!-- QuestionContentFooterTemplate -->\n" +
    "<h5 class=\"contentHeader\" id=\"tagQuestionHeader\">Question Tags</h5>\n" +
    "<div class=\"ui-grid-solo\">\n" +
    "	<div class=\"ui-block-a\">\n" +
    "		<button id=\"showTagDialog\" data-theme=\"d\" data-shadow=\"false\">Question Tags</button>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"contentGap\"></div>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionFooterTemplate.html'] = "<!-- QuestionFooterTemplate -->\n" +
    "\n" +
    "<ons-bottom-toolbar style=\"height:60px;\">    			\n" +
    "	<div id=\"examTimerSection\" style=\"<%= showTimerCss %> text-align:center; color:#31708f; margin-top:2px; margin-bottom:10px;\">\n" +
    "		Time Taken: <span id=\"examTimer\"><%= timer %></span>\n" +
    "	</div>\n" +
    "\n" +
    "	<ons-row>\n" +
    "		<ons-col width=\"33%\">\n" +
    "			<div style=\"text-align: left;\">\n" +
    "				<a href=\"#PreviousQuestion\" class=\"skipQuestion button\">Previous</a>\n" +
    "			</div>\n" +
    "		</ons-col>		        \n" +
    "		<ons-col width=\"33%\">\n" +
    "			<div style=\"text-align: center;\">\n" +
    "				<a id=\"menuButton\" class=\"button\">\n" +
    "					<span class=\"oe-icon oe-icon-question-navigator oe-icon-in-jqm-button\"></span>\n" +
    "					Overview\n" +
    "				</a>\n" +
    "			</div>\n" +
    "		</ons-col>\n" +
    "	    <ons-col width=\"33%\">\n" +
    "	    	<div style=\"text-align: right;\">\n" +
    "				<a href=\"#NextQuestion\" class=\"skipQuestion button\"><%= nextNavButtonText %></a>\n" +
    "			</div>\n" +
    "		</ons-col>\n" +
    "	</ons-row>\n" +
    "</ons-bottom-toolbar>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionOptionPreviewTemplate.html'] = "<!-- QuestionOptionPreviewTemplate -->\n" +
    "\n" +
    "<div id=\"questionPreview<%= id %>\" class=\"questionPreviewBlock <%= colour %>\">\n" +
    "	<span>\n" +
    "		<p><%= id %></p>\n" +
    "	</span>\n" +
    "</div>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionOptionTemplate.html'] = "<!-- QuestionOptionTemplate -->\n" +
    "<!-- Question Radio Option -->\n" +
    "\n" +
    "<ons-list-item tappable>\n" +
    "	<label class=\"left\">\n" +
    "		<ons-radio name=\"options\" data-theme=\"e\" input-id=\"question-option-<%= id %>\" value=\"<%= id %>\" />\n" +
    "	</label>\n" +
    "	<label class=\"center\" for=\"question-option-<%= id %>\"><%= text %></label>\n" +
    "</ons-list-item>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionPreviewFooterTemplate.html'] = "<!-- QuestionPreviewFooterTemplate -->\n" +
    "<div style=\"clear:both;\">\n" +
    "	<span>Q<%= id %>:</span> <%= text %>\n" +
    "</div>\n" +
    "<div style=\"padding-top:5px; min-width:250px;\">\n" +
    "	<div class=\"ui-grid-a\" style=\"min-height:40px;\">\n" +
    "		<div class=\"ui-block-a\" style=\"text-align:left;\">\n" +
    "			<button id=\"moveToPreviewQuestionButton\" value=\"<%= id %>\" data-theme=\"a\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-inline=\"true\" data-mini=\"true\">Go to Question</button>		\n" +
    "		</div>\n" +
    "		<div class=\"ui-block-b\" style=\"text-align:right; <%= reviewButtonStyle %>\">\n" +
    "			<button id=\"sessionReviewButton\" class=\"sessionReview\" data-theme=\"a\" data-icon=\"custom\" data-inline=\"true\" data-mini=\"true\">Review</a>\n" +
    "		</div>			\n" +
    "	</div>\n" +
    "</div>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionPreviewHeaderTemplate.html'] = "<!-- QuestionPreviewHeaderTemplate -->\n" +
    "<!-- Popup Menu -->		\n" +
    "<div class=\"questionNav\">\n" +
    "	<h1 class=\"questionNavQCount\"><%= headerText %></h1>\n" +
    "	<div class=\"nav-instruction\">Touch a question number to preview</div>\n" +
    "	<div class=\"questionNumberBlock\" style=\"height: <%= height %>px;\">\n" +
    "		<%= questionOptionHtml %>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div id=\"questionPreview\"></div>\n" +
    "</div>"; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['QuestionTagsTemplate.html'] = "<!-- QuestionTagsTemplate -->\n" +
    "<h1 class=\"contentHeader\" style=\"margin-top: 0px !important;\">OnExamination Tags</h1>\n" +
    "			\n" +
    "<% if(globalTags.length < 1) { %>\n" +
    "	<p class=\"smallText\">This question has no OnExamination tags</p>\n" +
    "<% } else { %>\n" +
    "	<ul data-role=\"listview\" data-theme=\"b\" data-inset=\"true\" data-mini=\"true\">\n" +
    "<% 		_.each(globalTags, function(tag) { %>\n" +
    "			<li data-theme=\"b\" data-mini=\"true\">\n" +
    "				<!-- must be better workaround as mini is not working on read-only lists! -->\n" +
    "				<label style=\"font-size:12.5px;\">\n" +
    "					<%= tag.Text %>								\n" +
    "				</label>\n" +
    "			</li>            			\n" +
    "<%		}); %>\n" +
    "	</ul>			\n" +
    "<% } %>	\n" +
    "<div style=\"padding-top:10px\"></div>			\n" +
    "\n" +
    "\n" +
    "<h1 class=\"contentHeader\" style=\"margin-top: 0px !important;\">Your Tags</h1>				\n" +
    "<% if(userTags.length < 1) { %>\n" +
    "	<p class=\"smallText\">You have not tagged this question</p>\n" +
    "<% } else { %>\n" +
    "	<ul data-role=\"listview\" data-theme=\"e\" data-inset=\"true\" data-mini=\"true\">\n" +
    "<% 		_.each(userTags, function(tag) { %>\n" +
    "			<li data-theme=\"e\" data-icon=\"delete\" data-mini=\"true\" class=\"deleteTag\" data-tag=\"<%= tag.Text %>\" data-qid=\"<%= tag.Qid %>\">\n" +
    "				<a><%= tag.Text %></a>	\n" +
    "			</li>		\n" +
    "<%		}); %>					\n" +
    "	</ul>\n" +
    "<% } %>\n" +
    "<div style=\"padding-top:10px\"></div>\n" +
    "	\n" +
    "<button id=\"addTag\" data-theme=\"d\" data-shadow=\"false\" data-mini=\"true\" data-qid=\"<%= qid %>\">Add Tag</button>					\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['RatingTemplate.html'] = "<!-- RatingTemplate -->\n" +
    "\n" +
    "<h5 class=\"contentHeader\" id=\"rateQuestionHeader\">Rate this question</h5>\n" +
    "\n" +
    "<fieldset class=\"star-group\">			\n" +
    "	<input type=\"radio\" name=\"question-option-rating\" id=\"question-option-rating1\" <%= (rating === 1 ? 'checked' : '') %> value=\"1\" />\n" +
    "	<label for=\"question-option-rating1\" class=\"star <%= (rating >= 1 ? 'filled-star' : '') %>\">\n" +
    "		<span class=\"ui-btn-inner ui-corner-left\"><span class=\"ui-btn-text\"></span></span>\n" +
    "	</label>					\n" +
    "\n" +
    "	<input type=\"radio\" name=\"question-option-rating\" id=\"question-option-rating2\" <%= (rating === 2 ? 'checked' : '') %> value=\"2\" />\n" +
    "	<label for=\"question-option-rating2\" class=\"star <%= (rating >= 2 ? 'filled-star' : '') %>\">\n" +
    "		<span class=\"ui-btn-inner ui-corner-left\"><span class=\"ui-btn-text\"></span></span>\n" +
    "	</label>\n" +
    "\n" +
    "	<input type=\"radio\" name=\"question-option-rating\" id=\"question-option-rating3\" <%= (rating === 3 ? 'checked' : '') %> value=\"3\" />\n" +
    "	<label for=\"question-option-rating3\" class=\"star <%= (rating >= 3 ? 'filled-star' : '') %>\">\n" +
    "		<span class=\"ui-btn-inner ui-corner-left\"><span class=\"ui-btn-text\"></span></span>\n" +
    "	</label>\n" +
    "\n" +
    "	<input type=\"radio\" name=\"question-option-rating\" id=\"question-option-rating4\" <%= (rating === 4 ? 'checked' : '') %> value=\"4\" />\n" +
    "	<label for=\"question-option-rating4\" class=\"star <%= (rating >= 4 ? 'filled-star' : '') %>\">\n" +
    "		<span class=\"ui-btn-inner ui-corner-left\"><span class=\"ui-btn-text\"></span></span>\n" +
    "	</label>\n" +
    "\n" +
    "	<input type=\"radio\" name=\"question-option-rating\" id=\"question-option-rating5\" <%= (rating === 5 ? 'checked' : '') %> value=\"5\" />\n" +
    "	<label for=\"question-option-rating5\" class=\"star <%= (rating == 5 ? 'filled-star' : '') %>\">\n" +
    "		<span class=\"ui-btn-inner ui-corner-left\"><span class=\"ui-btn-text\"></span></span>\n" +
    "	</label>\n" +
    "</fieldset>	\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['ReceivedChallengeTemplate.html'] = "<!-- ReceivedChallengeTemplate -->\n" +
    "\n" +
    "<ons-page>\n" +
    "    <div data-role=\"header\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "    	<h1>Received a challenge?</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"settings\">\n" +
    "    	<h1 class=\"contentHeader\">Emailed a PIN?</h1>\n" +
    "    	<p>To start your assessment challenge please enter your email and the PIN you were sent:</p>\n" +
    "    	<div class=\"ui-hide-label\">\n" +
    "			<fieldset data-role=\"controlgroup\">\n" +
    "				<label for=\"email\">Email address</label>\n" +
    "				<input id=\"email\" placeholder=\"email\" value=\"\" type=\"email\" pattern=\"[^ @]*@[^ @]*\" class=\"marginBottom\" />\n" +
    "				<label for=\"pin\">Password</label>\n" +
    "				<input id=\"pin\" placeholder=\"PIN\" value=\"\" type=\"text\" />	\n" +
    "			</fieldset>\n" +
    "			\n" +
    "			<button id=\"startAssessment\" data-theme=\"e\" data-icon=\"arrow-r\" data-shadow=\"false\">Start Assessment</button>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"contentGap\" />\n" +
    "\n" +
    "    	<h1 class=\"contentHeader\">Already have an onExamination account?</h1>\n" +
    "    	<button id=\"login\" data-theme=\"b\" data-icon=\"arrow-r\" data-shadow=\"false\">Sign in to see your challenges</button>        	\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['RevisionOptionsTemplate.html'] = "<!-- RevisionOptionsTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1 id=\"revisionOptionsTitle\">Revision Options</h1>						\n" +
    "	</div>\n" +
    "	<div data-role=\"content\">\n" +
    "		<div id=\"revisionOptionsLoading\">Loading... <img src=\"css/images/loader.gif\" class=\"loading-spinner\"></div>\n" +
    "		<div id=\"revisionOptions\" style=\"display:none; padding-bottom:150px;\">\n" +
    "\n" +
    "			<div data-role=\"fieldcontain\" style=\"display: none;\">\n" +
    "				<h1 class=\"pageHeading\">How would you like to Revise?</h1>					\n" +
    "				<label for=\"revisionType\" class=\"fullWidth marginTop\">Choose your Revision Style:</label>\n" +
    "				<select name=\"revisionType\" data-theme=\"e\" id=\"revisionType\">\n" +
    "					<option value=\"WorkHard\">\n" +
    "						Work Hard\n" +
    "					</option>\n" +
    "					<option value=\"WorkSmart\">\n" +
    "						Work Smart\n" +
    "					</option>					\n" +
    "					<!--\n" +
    "					<option value=\"PastPaper\">\n" +
    "						Past Paper\n" +
    "					</option>\n" +
    "					-->\n" +
    "				</select>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- Past Paper Filters: -->\n" +
    "			<div data-role=\"fieldcontain\" style=\"display: none;\" id=\"pastPaperGroup\">\n" +
    "				<label for=\"pastPaper\" class=\"fullWidth\">Select a Past Paper</label>\n" +
    "				<select name=\"pastPaper\" data-theme=\"e\" id=\"pastPaper\">\n" +
    "					<option value=\"Test\">Test</option>					\n" +
    "				</select>\n" +
    "			</div>\n" +
    "			\n" +
    "			<!-- Work Smart Filters: -->\n" +
    "			<div id=\"workSmartGroup\" style=\"display: none;\">\n" +
    "				<div data-role=\"fieldcontain\">\n" +
    "					<label for=\"questionStatus\" class=\"fullWidth\">With Questions:</label>\n" +
    "					<select name=\"questionStatus\" id=\"questionStatus\" data-theme=\"e\">\n" +
    "						<option value=\"NotSeen\">\n" +
    "							I have not seen before\n" +
    "						</option>\n" +
    "						<option value=\"AllQuestions\">\n" +
    "							All Questions\n" +
    "						</option>\n" +
    "						<option value=\"WrongQuestions\">\n" +
    "							I have got wrong before\n" +
    "						</option>\n" +
    "						<!--\n" +
    "						<option value=\"TaggedQuestions\">\n" +
    "							I have tagged\n" +
    "						</option>\n" +
    "						-->\n" +
    "					</select>\n" +
    "				</div>					\n" +
    "				\n" +
    "				<div data-role=\"fieldcontain\">\n" +
    "					<label for=\"questionCategory\" class=\"fullWidth\">Filter by Category:</label>\n" +
    "					<select name=\"questionCategory\" id=\"questionCategory\" data-theme=\"e\">\n" +
    "						<option value=\"AllCategories\">\n" +
    "							All Categories\n" +
    "						</option>\n" +
    "						<option value=\"SelectCategories\">\n" +
    "							Select Categories\n" +
    "						</option>\n" +
    "					</select>\n" +
    "				</div>\n" +
    "				\n" +
    "				<div data-role=\"fieldcontain\" id=\"questionCategorySection\" style=\"display:none;\">\n" +
    "					<div data-role=\"controlgroup\" data-type=\"horizontal\" style='padding-bottom:10px;'>\n" +
    "						<legend>Categories:</legend>\n" +
    "						<button id=\"selectAllCats\" data-theme=\"e\">Select All</button>\n" +
    "						<button id=\"selectNoCats\" data-theme=\"e\">Select None</button>\n" +
    "					</div>			\n" +
    "				\n" +
    "					<fieldset data-role=\"controlgroup\" id=\"questionCategoryList\">											\n" +
    "					</fieldset>				\n" +
    "				</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "				<!-- Advanced filters -->\n" +
    "				<div data-role=\"fieldcontain\">\n" +
    "					<input type=\"checkbox\" name=\"workSmartAdvancedFilter\" data-theme=\"a\" id=\"workSmartAdvancedFilter\" value=\"false\" />\n" +
    "    				<label for=\"workSmartAdvancedFilter\">Show Advanced Options</label>\n" +
    "				</div>\n" +
    "\n" +
    "				<div id=\"workSmartAdvancedFilterSection\" style=\"display:none; padding-left:20px; padding-top:5px;\">\n" +
    "					<div data-role=\"fieldcontain\">\n" +
    "						<label for=\"showAnswerAfterQuestion\" class=\"fullWidth\">Revision Type:</label>\n" +
    "						<select name=\"showAnswerAfterQuestion\" id=\"showAnswerAfterQuestion\" data-theme=\"e\">\n" +
    "							<option value=\"true\">\n" +
    "								Revision <i>(Show Answers)</i>\n" +
    "							</option>\n" +
    "							<option value=\"false\">\n" +
    "								Exam <i>(Hide Answers)</i>\n" +
    "							</option>\n" +
    "						</select>\n" +
    "					</div>		\n" +
    "				\n" +
    "					<div data-role=\"fieldcontain\">\n" +
    "						<label for=\"questionDifficulty\" class=\"fullWidth\">Question Difficulty:</label>\n" +
    "						<select name=\"questionDifficulty\" id=\"questionDifficulty\" data-theme=\"e\">\n" +
    "							<option value=\"AllQuestions\">\n" +
    "								All Questions\n" +
    "							</option>\n" +
    "							<option value=\"SelectDifficulty\">\n" +
    "								Select Difficulty\n" +
    "							</option>						\n" +
    "						</select>\n" +
    "						<div id=\"difficultySliderGroup\" style=\"display: none;\">\n" +
    "							<div class=\"sliderWrapper\">\n" +
    "								<span class=\"diffEasy\">Easy</span><span class=\"diffHard\">Hard</span>\n" +
    "								<input type=\"range\" name=\"slider\" data-theme=\"e\" data-track-theme=\"a\" id=\"questionDifficultyValue\" value=\"5\" min=\"0\" max=\"10\" data-highlight=\"true\" class=\"ui-hidden-accessible diffSlider\" />\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "								\n" +
    "					\n" +
    "\n" +
    "\n" +
    "					<div data-role=\"fieldcontain\">\n" +
    "						<label for=\"questionTags\" class=\"fullWidth\">Filter by Tags:</label>\n" +
    "						<select name=\"questionTags\" id=\"questionTags\" data-theme=\"e\">\n" +
    "							<option value=\"AllQuestionTags\">\n" +
    "								All Tags\n" +
    "							</option>\n" +
    "							<option value=\"SelectQuestionTags\">\n" +
    "								Select Tags\n" +
    "							</option>\n" +
    "						</select>\n" +
    "					</div>\n" +
    "					<div data-role=\"fieldcontain\" id=\"questionTagsSection\" style=\"display:none;\">\n" +
    "						<fieldset data-role=\"controlgroup\" id=\"questionTagsList\">											\n" +
    "						</fieldset>\n" +
    "					</div>		    \n" +
    "				</div>\n" +
    "			</div>		\n" +
    "			\n" +
    "			<!-- Shared question type filter -->    \n" +
    "			<div id=\"questionTypeFilterSection\">\n" +
    "				<div data-role=\"fieldcontain\">\n" +
    "					<label for=\"questionType\" class=\"fullWidth\">Filter by Question Type:</label>\n" +
    "					<select name=\"questionType\" id=\"questionType\" data-theme=\"e\">\n" +
    "						<option value=\"AllQuestionTypes\">\n" +
    "							All Types\n" +
    "						</option>\n" +
    "						<option value=\"SelectQuestionTypes\">\n" +
    "							Select Types\n" +
    "						</option>\n" +
    "					</select>\n" +
    "				</div>\n" +
    "				<div data-role=\"fieldcontain\" id=\"questionTypeSection\" style=\"display:none;\">\n" +
    "					<fieldset data-role=\"controlgroup\" id=\"questionTypeList\">											\n" +
    "					</fieldset>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			\n" +
    "			\n" +
    "			<!-- Shared number of question filter -->						\n" +
    "			<div data-role=\"fieldcontain\" class=\"marginBottom\">\n" +
    "				<label for=\"questionLimit\" class=\"fullWidth\">Number of Questions:</label>\n" +
    "				<select name=\"questionLimit\" data-theme=\"e\" id=\"questionLimit\">					\n" +
    "					<option value=\"10\">10 questions</option>\n" +
    "					<option value=\"20\">20 questions</option>\n" +
    "					<option value=\"30\">30 questions</option>\n" +
    "					<option value=\"40\">40 questions</option>\n" +
    "					<option value=\"50\">50 questions</option>\n" +
    "					<option value=\"60\">60 questions</option>\n" +
    "					<option value=\"70\">70 questions</option>\n" +
    "					<option value=\"80\">80 questions</option>\n" +
    "					<option value=\"90\">90 questions</option>\n" +
    "					<option value=\"100\">100 questions</option>\n" +
    "				</select>\n" +
    "			</div>							\n" +
    "			\n" +
    "			<div id=\"workHardStatus\" class=\"progress-bar\">\n" +
    "				<div class=\"progress-bar-inner\"></div>\n" +
    "				<p class=\"progress-text\"></p>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div data-role=\"footer\" data-position=\"fixed\" data-tap-toggle=\"false\">\n" +
    "		<div style=\"padding-top:5px; padding-bottom:15px; padding-left:5px; padding-right:5px;\">\n" +
    "			<div style=\"padding-top:5px; padding-bottom:5px;\">\n" +
    "				<div id=\"revisionFilterSummary\"></div>\n" +
    "			</div>\n" +
    "			<button id=\"startQuestions\" data-icon=\"check\" data-theme=\"b\" data-shadow=\"false\">Start Questions</button>			\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['RevisionTypeSelectionTemplate.html'] = "<!-- RevisionTypeSelectionTemplate -->\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "		<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "		<h1>Revision Types</h1>						\n" +
    "	</div>\n" +
    "	<div data-role=\"content\">			\n" +
    "		<h1 class=\"pageHeading\" style=\"padding-bottom:20px;\">How would you like to Revise?</h1>			\n" +
    "\n" +
    "		<ul data-role=\"listview\" data-theme=\"e\" data-divider-theme=\"d\" style=\"padding: 0px 20px;\">				\n" +
    "			<li>\n" +
    "				<a id=\"selectWorkSmart\">					\n" +
    "					<div style=\"float:left; padding-top:10px;\">\n" +
    "						<span class=\"oe-icon-work-smart oe-icon\"></span>\n" +
    "					</div>\n" +
    "					<div>\n" +
    "						<h3>Choose Questions</h3>\n" +
    "						<p>Personalise your revision session</p>\n" +
    "					</div>\n" +
    "				</a>\n" +
    "			</li>				\n" +
    "			<li id=\"coreQuestionsListButton\" style=\"display:none;\">\n" +
    "				<a id=\"selectCoreQuestions\">					\n" +
    "					<div style=\"float:left; padding-top:10px;\">\n" +
    "						<span class=\"oe-icon-key-learning-points oe-icon\"></span>\n" +
    "					</div>\n" +
    "					<div>\n" +
    "						<h3>Core Questions</h3>\n" +
    "						<p>Revise the core questions</p>\n" +
    "					</div>\n" +
    "				</a>\n" +
    "			</li>		\n" +
    "			<li id=\"mockTestListButton\" style=\"display:none;\">\n" +
    "				<a id=\"selectMockTest\">					\n" +
    "					<div style=\"float:left; padding-top:10px;\">\n" +
    "						<span class=\"oe-icon-mock-tests oe-icon\"></span>\n" +
    "					</div>\n" +
    "					<div>\n" +
    "						<h3>Mock Test</h3>\n" +
    "						<p>Tests created on recent exam themes</p>\n" +
    "					</div>\n" +
    "				</a>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "\n" +
    "		<div style=\"padding:80px 5px;\">\n" +
    "			<a id=\"selectWorkHard\" style=\"text-decoration:underline;\">Work Hard</a>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['SJQAnsweredTemplate.html'] = "<!-- SJQAnsweredTemplate -->\n" +
    "<!-- View SJQ Answer -->\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "    	<% if(sessionType !== 'notification') { %>\n" +
    "    		<div class=\"left\">\n" +
    "	        	<ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "	        		<ons-icon icon=\"md-menu\"></ons-icon>	        			        		\n" +
    "	        	</ons-toolbar-button>	        	\n" +
    "        	</div>\n" +
    "        	<div class=\"center\">\n" +
    "        		<%= questionIndex %> of <%= questionCount %>        			\n" +
    "    		</div>\n" +
    "        	<div class=\"right\">\n" +
    "	        	<a href=\"#NextQuestion\" class=\"button button--quiet\"><%= nextNavButtonText %></a>\n" +
    "    		</div>            \n" +
    "    	<% } else { %>        \n" +
    "    		<div class=\"left\">\n" +
    "    			<a href=\"#\" class=\"button button--quiet\">Home</a>\n" +
    "			</div>\n" +
    "    		<div class=\"center\">\n" +
    "    			Daily Question\n" +
    "    		</div>\n" +
    "    	<% } %>\n" +
    "    </ons-toolbar>\n" +
    "			\n" +
    "    <div data-role=\"content\" class=\"answerPage\" data-qid=\"<%= id %>\">		\n" +
    "		<div style=\"padding-bottom:30px; <%= exitAnswerReviewStyle %>\" id='exitAnswerReview'>\n" +
    "			<a href=\"#SessionReview\" data-icon=\"back\" data-theme=\"a\" data-role=\"button\" data-shadow=\"false\" data-inline=\"false\">Exit Answer Review</a>\n" +
    "		</div>\n" +
    "	\n" +
    "        <h2 class=\"<%= resultColour %>\"><%= result %></h2>\n" +
    "        <div class=\"questionAnswer\">\n" +
    "	        <h5 class=\"contentHeader\">Explanation</h5>\n" +
    "	        <%= comment %>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"contentGap\"></div>\n" +
    "\n" +
    "        <div class=\"questionAnswer\">\n" +
    "	        <h5 class=\"contentHeader\">Question</h5>\n" +
    "	        <%= text %>\n" +
    "        </div>\n" +
    "\n" +
    "			<div class=\"sjqAnswerList\">\n" +
    "	        <h4>Your choices</h4>\n" +
    "			<ul>\n" +
    "				<%= userChoicesHtml %>\n" +
    "			</ul>\n" +
    "            <h4>Correct order</h4>\n" +
    "			<ul>\n" +
    "				<%= correctChoicesHtml %>\n" +
    "			</ul>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>\n" +
    "    </div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['SJQOptionTemplate.html'] = "<!-- SJQOptionTemplate -->\n" +
    "<!-- SJQ Question Option -->\n" +
    "\n" +
    "<tr class=\"sjqOption\">\n" +
    "    <td class=\"sjqOptionRank\">\n" +
    "        <input type=\"number\" data-theme=\"e\" id=\"question-option-<%= id %>\" value=\"\" maxlength=\"1\" data-mini=\"true\" />\n" +
    "    </td>\n" +
    "    <td class=\"sjqOptionText\">\n" +
    "        <label for=\"question-option-<%= id %>\"><%= answerText %></label>\n" +
    "    </td>\n" +
    "</tr>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['SJQTemplate.html'] = "<!-- SJQTemplate -->\n" +
    "<!-- Ask a SJQ Question -->	\n" +
    "\n" +
    "<ons-page>\n" +
    "    <ons-toolbar>\n" +
    "    	<% if(sessionType !== 'notification') { %>\n" +
    "    		<div class=\"left\">\n" +
    "	        	<ons-toolbar-button class=\"inQuestionMenuButton\">\n" +
    "	        		<ons-icon icon=\"md-menu\"></ons-icon>	        			        		\n" +
    "	        	</ons-toolbar-button>	        	\n" +
    "        	</div>\n" +
    "        	<div class=\"center\"><%= questionIndex %> of <%= questionCount %></div>\n" +
    "        	<div class=\"right\">\n" +
    "	        	<ons-toolbar-button id=\"session-review-button\" class=\"sessionReview\" style=\"<%= reviewButtonStyle %>\" >Review</ons-toolbar-button>\n" +
    "    		</div>\n" +
    "            \n" +
    "    	<% } else { %>        	\n" +
    "    		<div class=\"center\">Daily Question</div>\n" +
    "    	<% } %>\n" +
    "    </ons-toolbar>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"questionPage\">\n" +
    "        <div class=\"question\">\n" +
    "	        <h5 class=\"contentHeader\">Question</h5>\n" +
    "	        <%= text %>\n" +
    "        </div>\n" +
    "		            \n" +
    "        <table class=\"sjqAnswersTable\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "			<tr>\n" +
    "				<th class=\"sjqInstruction ui-bar-a \"><p><%= selectionInfo %></p></th>\n" +
    "			</tr>\n" +
    "	        <%= optionHtml %>\n" +
    "        </table>\n" +
    "        		\n" +
    "		<div class=\"ui-grid-solo\">\n" +
    "			<div class=\"ui-block-a marginTop answerButton\">\n" +
    "				<button id=\"answer-button\" data-theme=\"b\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-shadow=\"false\">Answer Question</button>\n" +
    "			</div>\n" +
    "		</div>	\n" +
    "\n" +
    "		<div class=\"contentGap\"></div>\n" +
    "\n" +
    "		<%= contentEnd %>        \n" +
    "	</div>\n" +
    "\n" +
    "	<%= footer %>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['SessionReviewTemplate.html'] = "<!-- SessionReviewTemplate -->\n" +
    "<!-- Review Session -->\n" +
    "\n" +
    "<ons-page>\n" +
    "	<div data-role=\"header\">\n" +
    "	    <a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "	    <h1>Session Review</h1>\n" +
    "	</div>\n" +
    "\n" +
    "	<div data-role=\"content\" class=\"sessionResults\">\n" +
    "		<div style=\"background-color:#FAFAFA; padding:15px; border:1px solid #CCC; margin-bottom:50px; <%= (isDemo && appLib.getDevice() == 'android' ? '' : 'display:none;') %>\">\n" +
    "	    	<span style=\"display:block; text-align:center;\">\n" +
    "	    		<img src=\"img/logo.png\" style=\"width:100%; max-width:377px; max-height:76px;\" />	    		\n" +
    "	    	</span>\n" +
    "	    	<div style=\"text-align:center;\">\n" +
    "	    		<p style=\"padding:10px 0;\"><span style=\"font-weight:bold;\">Thanks for trying our demo questions!</span><br /><br />Why not sign up to BMJ OnExamination to get access to quality questions and expert clinical advice.</p>\n" +
    "	    		\n" +
    "    			<a id=\"shopLink\" data-role=\"button\" data-inline=\"true\" data-theme=\"d\" data-shadow=\"false\" data-iconshadow=\"false\">Visit the BMJ OnExamination Shop</a>		    		\n" +
    "	    	</div>\n" +
    "	    </div>			    \n" +
    "\n" +
    "	    <div class=\"sessionScore ui-grid-b\">\n" +
    "			<div class=\"ui-block-a\"><p>You<br />scored<br /><span class=\"sessionStat\"><%= percentCorrect %></span><span class=\"percentageSign\">&#37;</span></p></div>\n" +
    "			<div class=\"ui-block-b\"><p>Questions<br />answered<br /><span class=\"sessionStat\"><%= questionsAnswered %></span></p></div>\n" +
    "			<div class=\"ui-block-c\"><p>Questions<br />correct<br /><span class=\"sessionStat\"><%= questionsCorrect %></span></p></div>\n" +
    "	    </div>\n" +
    "	    <div style=\"text-align:center;font-style:italics;background-color:#2a6ebb;color:white;padding:5px;<%= appLib.cssDisplay(assessmentSummary.length > 0) %>\">\n" +
    "	    	<%= assessmentSummary %>	    		\n" +
    "    	</div>\n" +
    "	    <div class=\"graphWrapper\">\n" +
    "			<div id=\"livePie\" class=\"graph\"></div>\n" +
    "	    </div>\n" +
    "		\n" +
    "		<div id=\"keyLearningPointsSection\" style=\"display:none;\">\n" +
    "			<h1 class=\"pageHeading\" style=\"color: #2a6ebb;\">Key Learning Points</h1>\n" +
    "			<div id=\"keyLearningPoints\"></div>\n" +
    "		</div>\n" +
    "				\n" +
    "	    <div class=\"sessionStatus\">\n" +
    "			<span>Status: </span>\n" +
    "			<span id=\"reviewStatus\">Processing results...</span>\n" +
    "	    </div>\n" +
    "	    <div class=\"uploadAnswersButton\">	\n" +
    "			<a data-role=\"button\" data-theme=\"e\" data-icon=\"refresh\" style=\"display:none;\" id=\"uploadAnswersButton\" data-shadow=\"false\">Try Upload Again</a>\n" +
    "	    </div>			    			   \n" +
    "\n" +
    "		<div id=\"reviewMainMenuButton\" style=\"display:none;\">			\n" +
    "			<div id=\"challengeFriendSection\" style=\"<%= challengeButtonStyle %>\">\n" +
    "		    	<a id=\"challengeFriend\" data-role=\"button\" data-theme=\"d\" data-icon=\"user\" data-shadow=\"false\" data-iconshadow=\"false\">Share Questions</a>			    		    	\n" +
    "		    	<div style=\"padding:8px;\"></div>\n" +
    "		    </div>\n" +
    "		    \n" +
    "			<a id=\"reviewSession\" data-role=\"button\" data-theme=\"b\" data-icon=\"check\" data-shadow=\"false\">Review Answered Questions</a>			\n" +
    "			<div style=\"padding:32px;\"></div>\n" +
    "\n" +
    "			<% if(!isDemo && !isChallenge) { %>\n" +
    "				<a href=\"#RevisionTypeMenu\" data-role=\"button\" data-theme=\"e\" data-icon=\"forward\" data-shadow=\"false\">Start New Revision Session</a>\n" +
    "				<div style=\"padding:8px;\"></div>\n" +
    "			<% } %>\n" +
    "\n" +
    "			<a href=\"#\" data-role=\"button\" data-theme=\"e\" data-icon=\"home\" data-shadow=\"false\">Home</a>			\n" +
    "		</div>\n" +
    "		\n" +
    "		<div style=\"min-height: 50px;\"></div>\n" +
    "	    <div class=\"webLink\" style=>\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Get more revision from BMJ OnExamination.</a>  	\n" +
    "	    </div>\n" +
    "	</div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['SettingsTemplate.html'] = "<!-- SettingsTemplate -->\n" +
    "<ons-page data-side=\"right\">\n" +
    "    <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "    	<h1>Settings</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"settings\">\n" +
    "    \n" +
    "	    <div class=\"logout\">\n" +
    "			<h4>Log Out and clear Sign In details</h4>\n" +
    "			<button id=\"clearSignIn\" data-theme=\"e\" data-icon=\"alert\" data-shadow=\"false\">Log Out</button>\n" +
    "	    </div>\n" +
    "	    <br />\n" +
    "		<span style=\"<%= sessionStyle %>\"><%= sessionState %></span>\n" +
    "\n" +
    "	    <div class=\"hr\" style=\"margin-top:40px; margin-bottom:40px;\"><hr /></div>\n" +
    "\n" +
    "		<div style=\"<%= appLib.cssDisplay(sessionActive && notificationsEnabled) %>\">\n" +
    "			<h4>Daily Notification</h4>\n" +
    "			<button class=\"showNotificationDialog\" data-theme=\"e\" data-shadow=\"false\">Configure Daily Notification</button>				\n" +
    "			<% if(!isMinified) { %>\n" +
    "				<button id=\"testNotificationQuestion\" data-theme=\"e\" data-shadow=\"false\">Test Notification Question</button>\n" +
    "			<% } %>\n" +
    "\n" +
    "			<div class=\"hr\" style=\"margin-top:40px; margin-bottom:40px;\"><hr /></div>\n" +
    "		</div>		    			    			\n" +
    "\n" +
    "	    <div class=\"appInfo\">\n" +
    "			<h3 style='margin:0;'>BMJ OnExamination mobile app</h3>\n" +
    "			<p>Version <%= version %></p>\n" +
    "			<p>&copy; 2018 BMJ Publishing Group Ltd. All rights reserved</p>\n" +
    "		\n" +
    "			<div style=\"padding: 10px 0 20px 0;\">\n" +
    "				<button id=\"rateApp\" data-icon=\"comment\" data-iconpos=\"right\" data-theme=\"b\" data-shadow=\"false\">Rate this app</button>\n" +
    "			</div>\n" +
    "\n" +
    "			<div data-role=\"controlgroup\">				    					\n" +
    "			    <a href=\"#TermsConditions\" data-role=\"button\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"e\" data-shadow=\"false\">Terms &amp; Conditions</a>\n" +
    "			    <a href=\"#PrivacyPolicy\" data-role=\"button\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"e\" data-shadow=\"false\">Privacy Policy</a>\n" +
    "			</div>\n" +
    "		\n" +
    "			<div class=\"hr\" style=\"margin-top:40px; margin-bottom:40px;\"><hr /></div>\n" +
    "\n" +
    "			<button id=\"showLog\" data-theme=\"e\" data-shadow=\"false\">Technical Support</button>\n" +
    "\n" +
    "			<% if(allowBetaMode) { %>\n" +
    "				<div style=\"padding-top: 20px;\"></div>\n" +
    "				<button id=\"enableBetaMode\" data-theme=\"c\" data-shadow=\"false\">Use Beta API</button>\n" +
    "			<% } %>\n" +
    "	    </div>\n" +
    "\n" +
    "	    <br /><br />\n" +
    "	    \n" +
    "	    <div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "	    </div>\n" +
    "      \n" +
    "    </div>\n" +
    "</ons-page>\n" +
    ""; 
if(typeof oeTemplates === 'undefined') {var oeTemplates = {};}
oeTemplates['TermsConditionsTemplate.html'] = "<!-- TermsConditionsTemplate -->\n" +
    "<ons-page>\n" +
    "    <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\">\n" +
    "    	<a href='#' class=\"homeButton\" data-role=\"button\" data-icon=\"home\" data-mini=\"true\">Home</a>\n" +
    "    	<h1>T&amp;Cs</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div data-role=\"content\" class=\"settings\">\n" +
    "    \n" +
    "    <!--// Text from bmj legal //-->\n" +
    "	    <h2>BMJ Group mobile software application (\"App\") is owned by the BMJ Publishing Group Limited (\"BMJ Group\").</h2>\n" +
    "\n" +
    "	    <h3>Use of our App</h3>\n" +
    "	    \n" +
    "	    <p>Please read the following Terms and Conditions, which relate to information regarding general use of our App. By using our BMJ Group App, you are agreeing to these Terms and Conditions and abide by them. From time to time we may change these Terms and Conditions, and will post revisions on any new editions of any App. We recommend that you read these Terms and Conditions for each new App and/or its upgrade (if applicable) and you are responsible for doing so.</p>\n" +
    "	    <p>Our App uses Google Analytics to anonymously track usage data within the App.</p>\n" +
    "	    \n" +
    "	    <h3>Privacy</h3>\n" +
    "	    \n" +
    "	    <p>Use of the data that you provide us, or which is collected by use on our App, is governed by our Privacy Policy. By using our App you consent to such processing.</p>\n" +
    "	    \n" +
    "	    <h3>Our Products and Services</h3>\n" +
    "	    \n" +
    "	    <p>BMJ Group Apps contain information designed for health professionals (unless otherwise expressly indicated). A description of what is included in each BMJ Group App is available prior to purchase. It should only be considered current for the period indicated when purchased but is subject to disclaimers as indicated in any end user licence and below.\n" +
    "	    Accounts and Passwords</p>\n" +
    "	    \n" +
    "	    <p>If you have registered or subscribed to use any service within the App or on our website , any user identification code or password is personal and non transferable and must be kept confidential and used only by you (unless agreed in writing with the BMJ Group) for the specified term of your use of the App or subscription or registration period  as applicable (which may be terminated at the discretion of the BMJ Group). We have the right to take action should this requirement be breached.</p>\n" +
    "	    \n" +
    "	    <h3>Intellectual Property Rights & Your Licence</h3>\n" +
    "	    \n" +
    "	    <p>The content, layout, design, data, databases and graphics on this App are protected by UK and other international intellectual property laws and are owned by the BMJ Group or it's licensors.</p>\n" +
    "	    \n" +
    "	    <p>The BMJ Group products made available through the App are licensed, not sold, to you. This licence granted to you for the App is limited to a non-transferable licence to use the App on certain mobile devices running the iOS (minimum supported operating system is iOS 3.0) or Android operating systems-based device (including, but not limited to iPad, iPhone or iPod touch) that you own or control. This licence does not allow you to use the App on any mobile  device that you do not own or control, and you may not distribute or make the App available over a network where it could be used by multiple devices at the same time. You may not rent, lease, lend, sell, redistribute or sub licence the App. You may not copy (except as expressly permitted by this licence), decompile, reverse engineer, disassemble, attempt to derive the source code of, modify, adapt, or create derivative works of the App or any part thereof, any updates (if so part of your subscription), or any part thereof (except as and only to the extent any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing use of any open sourced components included with the App. Any attempt to do so is a violation of the rights of the BMJ Group and its licensors. If you breach this restriction, you may be subject to prosecution and damages. In addition if you use any material from our App in breach of these terms of use, your right to use this App will cease immediately and you must destroy all copies, full or partial, of the App. All rights not expressly granted in these terms or any express written licence, are reserved.</p>\n" +
    "	    <p>The terms of the licence will govern any upgrades provided by BMJ Group (if any upgrades are expressly included in your subscription) unless such upgrade is accompanied by a separate licence in which case the terms of that licence will govern.</p>\n" +
    "	    <p>The BMJ Group's trademarks and logos which are displayed on the App are the trademarks of the BMJ Group and its licensors. Any use including framing, metatags or other text utilising the BMJ Group's trademarks or other trademarks displayed, is strictly prohibited without our (or our licensor's) express written consent.</p>\n" +
    "	    \n" +
    "	    <h3>Permission for use of our Intellectual Property</h3>\n" +
    "	    \n" +
    "	    <p>For permission to use our content or images, or other use of our intellectual property not authorised under a subscription for BMJ or BMJ Journals visit <a onclick=\"appLib.openLink('http://group.bmj.com/group/rights-licensing/permissions');\">group.bmj.com</a> and for other permissions please email support.onexamination.com @bmjgroup.com</p>\n" +
    "	    \n" +
    "	    <h3>Links</h3>\n" +
    "	    \n" +
    "	    <p>Should any App have links including hyperlinks which may take you outside of the BMJ Group's App or its websites, those links are provided for your convenience, and an inclusion of any link does not imply endorsement or approval by us of the linked website, its operator or content. We have no control over the contents or functionality of those sites and accept no responsibility for any loss or damages that may arise from your use of them. We are not responsible for any website outside the BMJ Group websites, and such websites use will be subject to relevant terms and conditions and privacy policies.</p>\n" +
    "	    \n" +
    "	    <h2>Disclaimers and Limitations of Liability</h2>\n" +
    "	    \n" +
    "	    <h3>Disclaimers</h3>\n" +
    "	    \n" +
    "	    <p>Description or reference to an organisation, product or publication or service does not imply endorsement of that organisation, product or publication unless it is owned by the BMJ Group and in which case it is subject to the disclaimers and limitations of liability herein and within any licence or other agreement with you the latter of which shall prevail in the event of a conflict.. To the fullest extent permitted by law the material and information displayed on our App is provided on an \"as is\" basis without any guarantees, conditions or warranties as to accuracy. You should note that for content that is periodically updated, the last updated date will be stated and you should check this date. We do not warrant that any changes will be made on any frequency including for important changes in evidence or drug information or otherwise.</p>\n" +
    "	    \n" +
    "	    <h2>Additional Product Specific Disclaimers</h2>\n" +
    "	    \n" +
    "	    <h3>Best Health</h3>\n" +
    "	    \n" +
    "	    <p>Best Health is designed for non-medically trained individuals. It does not offer medical advice and should not be seen as a replacement for consultation with a doctor or other health professional. The articles and information on the Best Health website are designed for you to help you talk to your doctor, not to be used instead of seeing your doctor.</p>\n" +
    "	    \n" +
    "	    <p>Categories presented in Best Health indicate a judgement about the strength of evidence and the relevant importance of benefits and risks. We rely on our authors to confirm accuracy.</p>\n" +
    "	    \n" +
    "	    <p>Readers should be aware that professionals in the field may have different opinions. Also there are regular advances in medical research. Our categories do not indicate whether a particular treatment is generally appropriate or whether it is suitable for an individual.</p>\n" +
    "		    \n" +
    "	    <p>Best Practice, Best Practice DX, Evidence Summary Pages and Action Sets & Drug Databases linked to from within</p>\n" +
    "	    \n" +
    "	    <p>Best Practice (including DX), the Evidence Summary Pages and Action Sets are intended for use by licensed medical health professionals. You are responsible for your decisions on diagnosis, treatment and follow up for a patient, or from choosing or not choosing specific treatments based on this. The content does not, provide any conclusive checklists, endorse drugs, diagnose patients, or recommend therapy. Users should use their professional judgment in using the BMJ Group or licensed in content, which is done at their own risk. They should always check and ensure that in each situation at the point of care they are qualified to consult and/or treat and/or prescribe at the point of care of a patient. Categories presented indicate a judgment about the evidence and strength of evidence available to our authors and licensors prior to publication and the relevant importance of benefit and harms. BMJ Group relies on its authors to confirm the accuracy of the information presented to prescribe generally accepted practices.</p>\n" +
    "			\n" +
    "	    <p>Users should be aware that professionals in the field may have different opinions. Because of this fact and because of regular advances in medical research and the possibility of human error, users should independently verify specified diagnosis methods, evidence, treatments, follow up, drugs and any contraindications or side effects including via manufacturers guidance. Also, the categories and information do not indicate whether a particular diagnosis, evidence, treatment andor drug or other follow up is generally appropriate or whether it is up to date and suitable for a particular individual. The Content is no substitute for individual patient assessment based upon the healthcare provider's examination of each patient and consideration of laboratory data and other factors unique to the patient. Please also note that information whilst not warranted to be accurate, is generally updated annually, so may be out of date and you should check the last updated date for any section being used. Ultimately it is the User's responsibility to make your own professional judgments, so to appropriately advise and treat yourself or your patients</p>\n" +
    "	    \n" +
    "	    \n" +
    "	    <h3>BMJ Updates</h3>\n" +
    "	    \n" +
    "\n" +
    "	    <p>The information contained in BMJ Updates is intended for medical professionals. BMJ Updates provides an educational service for practising clinicians, designed to alert clinicians to important new research; however we cannot warrant its accuracy. It is intended to support evidence based decision making, by providing links to published research reports about the diagnosis, treatment, preduction and prognosis, etiology and economics of medical conditions. However, \"evidence does not make decisions\". Clinicians making decisions about the care of their patients must take into account the limitations of evidence from research as well as the unique nature of their patients' circumstances and wishes. Readers should also be aware that professionals in the field may have different opinions. Because of this fact and also because of regular advances in medical research, we strongly recommend that readers independently verify any information they chose to rely on. Ultimately it is the reader's responsibility to make their own professional judgements.\n" +
    "	    BMJ Updates attempts to provide access to the best new research of relevance for clinical practice in the fields of primary medical care and sub specialties of internal medicine. It does not report all research but uses explicit criteria (<a onclick=\"appLib.openLink('http://tiny.cc/purpose_and_procedure');\">tiny.cc/purpose_and_procedure</a>) to define a subset of published research that is likely to be valid and ready for clinical attention. Practising physicians then provide their assessments of the relevance and newsworthiness of the reports through an online review process, the McMaster Online Rating of Evidence (MORE, <a onclick=\"appLib.openLink('http://hiru.mcmaster.ca/MORE');\">http://hiru.mcmaster.ca/MORE</a>). Individual clinicians who then receive these reviews must then apply their own judgement concerning the strength and applicability of this evidence to their own patients.</p>\n" +
    "	    \n" +
    "	    <h3>BMJ, Student BMJ, BMJ Journals (including BMJ Case Reports), BMJ Careers, Veterinary Record & Vet Record Careers</h3>\n" +
    "	    \n" +
    "	    <p>We rely on our authors of articles, contractors and third party data providers to confirm the accuracy of information and advertisements presented and to describe generally accepted practices and therefore we as the publisher and editors cannot warrant its accuracy. Differences may occur also between the print and online text of articles and advertisements. Readers should be aware that professionals in the field may have different opinions. Because of this fact and also because of regular advances in medical research we strongly recommend that readers independently verify any information that they chose to rely upon. Ultimately it is the reader's responsibility to make their own professional judgements.</p>\n" +
    "	    \n" +
    "	    <h3>BMJ Learning</h3>\n" +
    "	    \n" +
    "	    <p>We do not warrant that the completion of any Modules or use of other BMJ will be all the necessary continuing professional development you need nor that it is accurate. We rely on our authors of articles, contractors and third party data providers to confirm the accuracy of information presented and to describe generally accepted practices and therefore we as the publisher and editors cannot warrant its accuracy or that this meets all or any requirements for professional development. Readers should be aware that professionals in the field may have different opinions. Because of this fact and also because of regular advances in medical research we strongly recommend that readers independently verify any information that they chose to rely upon. Ultimately it is the reader's responsibility to make their own professional judgements</p>\n" +
    "	    \n" +
    "	    <h3>Clinical Evidence</h3>\n" +
    "	    \n" +
    "	    <p>The information contained in this publication is intended for medical professionals. Categories presented in Clinical Evidence indicate a judgement about the strength of the evidence available to our authors prior to publication and the relevant importance of benefit and harms. We rely on our authors to confirm the accuracy of the information presented to describe generally accepted practices. Readers should be aware that professionals in the field may have different opinions. Because of this fact and because of regular advances in medical research we strongly recommend that readers independently verify specified treatments and drugs including manufacturers' guidance. Also, the categories do not indicate whether a particular treatment is generally appropriate or whether it is suitable for a particular individual. Ultimately it is the reader's responsibility to make their own professional judgements, so to appropriately advise and treat their patients</p>\n" +
    "	    \n" +
    "	    <h3>BMJ OnExamination</h3>\n" +
    "	    \n" +
    "	    <p>The information contained on BMJ OnExamination websites and services is intended for medical professionals. It is intended for use as an exam revision or personal development resource. It is not a substitute for clinical judgement as a professional. Any reference to drug dosage should be checked with your local formulary before prescribing. The BMJ Group does not make any guarantees that use of BMJ OnExamination products or services will guarantee success in any examination or other test of any nature.</p>\n" +
    "	    \n" +
    "	    <h3>Limitation of Liability</h3>\n" +
    "	    \n" +
    "	    <p>To the fullest extent permitted by law, the BMJ Group expressly exclude:</p>\n" +
    "	    <p>\n" +
    "		<ol>\n" +
    "		    <li>all conditions, warranties and other terms which might otherwise be implied by statute, common law or the law of equity;</li>\n" +
    "		    <li>any liability caused by events outside of our reasonable control;</li>\n" +
    "		    <li>any obligation of effectiveness or accuracy;</li>\n" +
    "		    <li>any liability for any direct, indirect or consequential loss or damage incurred by any user in connection with the information contained on or use or inability to use or result of the use of our App, any websites linked from it and any material posted on it, including without limitation any liability for loss of income or revenue, loss of business, loss of profits or contracts, loss of anticipated savings, loss of data, loss of goodwill, wasted management or office time and for any other loss or damage of any kind, however arising and whether caused by tort (including negligence), breach of contract or otherwise, even if foreseeable; and</li>\n" +
    "		    <li>any direct losses in excess of twice any subscription fees paid.</li>\n" +
    "		</ol>\n" +
    "	    </p>\n" +
    "	    \n" +
    "	    <p>Nothing in this provision affects our or our contractors' liability for death or personal injury arising from our (or their) negligence nor our (or their) liability for fraudulent misrepresentation or misrepresentation as to a fundamental matter nor any other liability which cannot be excluded or limited under an applicable law.</p>\n" +
    "	    \n" +
    "	    <h3>Your Conduct</h3>\n" +
    "	    \n" +
    "	    <p>You must not use the App or any website linked from it in any way that causes or is likely to cause the website or access to it to be interrupted, damaged or impaired in any way. You understand that you are solely responsible for all electronic communications and contents sent from your computer to us. You must use the App for lawful purposes only. You must not use the App, its content or any website linked from the App for any of the following:\n" +
    "		<ol>\n" +
    "		    <li>Fraudulent purposes in connection with a criminal offence or otherwise unlawful activity</li>\n" +
    "		    <li>To send, use or re-use any material that is illegal, offensive, abusive, indecent, harmful, defamatory, obscene or menacing; or in breach of copyright, trademark, confidence, privacy or any other right; or is otherwise injurious to third parties; or objectionable; or which consists of or contains software viruses, trojan horses, worms, time bombs, keystroke loggers, spyware, adware or any other harmful or similar computer code designed to adversely affect the operation of any computer software or hardware, political campaigning, commercial solicitation, chain letters, mass mailings or any spam</li>\n" +
    "		    <li>To cause annoyance, inconvenience or needless anxiety</li>\n" +
    "		    <li>To reproduce, duplicate, copy or resell any part of our App in contravention with these terms of use.</li>\n" +
    "		</ol>\n" +
    "	    </p>\n" +
    "	    \n" +
    "	    <h3>Governing Law</h3>\n" +
    "	    \n" +
    "	    <p>These Terms and Conditions shall be governed and construed in accordance with the laws of England and Wales, whose courts shall have exclusive jurisdiction, although we retain the right to bring proceedings against you for breach of these conditions in your country of residence or other relevant country.</p>\n" +
    "	    <p>Last Updated: July  2012 &copy; The BMJ Publishing Group Limited 2012.</p>\n" +
    "\n" +
    "	    \n" +
    "	    \n" +
    "	    \n" +
    "	    <a href=\"#Settings\" data-role=\"button\" data-theme=\"e\" data-icon=\"back\" data-shadow=\"false\">Back</a>\n" +
    "\n" +
    "\n" +
    "        <br /><br /><br />                                                                                                                                                                                                                                                                         \n" +
    "	    <br /><br />\n" +
    "\n" +
    "	    <div class=\"webLink\">\n" +
    "			<a onclick=\"appLib.openLink('http://www.onexamination.com/?utm_source=<%= appLib.getDevice() %>-App&utm_medium=Link&utm_campaign=OE-Mobile-App');\">Find out more about BMJ OnExamination.</a>  	\n" +
    "	    </div>\n" +
    "      \n" +
    "    </div>\n" +
    "</ons-page>\n" +
    ""; 