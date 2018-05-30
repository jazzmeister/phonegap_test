//## Push Notification
var pushNotification = {

    //## Push Notification Token methods / data
    token: {
        currentToken: null,
        newToken: null,
        updateServer: false,

        loadToken: function() {
            var token = localStorage.getItem('registrationId');
            appLib.debugLog('load push token: ' + token);
            
            return token;
        },

        saveToken: function(token) {
            appLib.debugLog('save push token: ' + token);
            localStorage.setItem('registrationId', token); 
        }
    },    


    //## Push Notification Permission methods / data
    permission: {
        grant: function() {
            localStorage.setItem('notificationAllow', true);
        },

        isGranted: function() {
            return localStorage.getItem('notificationAllow');  
        },

        _getInterval: function() {
            var currentInterval = localStorage.getItem('notificationInterval');
            if(currentInterval === null)
                currentInterval = 0;

            //## Ensure int
            return currentInterval * 1;
        },

        calculateNextTimeToPrompt: function() {                        
            //##            After 10 seconds,   After 1 day,        After 7 days,       After 28 days
            var intervals = [ 10,               1 * 24 * 60 * 60,   7 * 24 * 60 * 60,   28 * 24 * 60 * 60];


            var currentInterval = pushNotification.permission._getInterval();
            currentInterval++;   
            if(currentInterval >= intervals.length)
                currentInterval = intervals.length;
            
            
            var targetDate = new Date();
            var dt = localStorage.getItem('notificationLastPrompt');
            if(dt !== null) {
                targetDate = new Date(dt);            
            }            
            
            targetDate.setSeconds(targetDate.getSeconds() + intervals[currentInterval - 1]);

            //## Save the new target date and interval
            localStorage.setItem('notificationLastPrompt', targetDate);
            localStorage.setItem('notificationInterval', currentInterval);

            return targetDate;
        },

        canPrompt: function() {                                    
            var dt = localStorage.getItem('notificationLastPrompt');
            if(dt === null)
                return true;

            var targetDate = new Date(dt);
            return (new Date() > targetDate);
        }
    },


    //## Fires when device token has been confirmed
    onRegistration: function(data) {               
        pushNotification.token.currentToken = pushNotification.token.loadToken();

        if (pushNotification.token.currentToken !== data.registrationId) {
            pushNotification.token.newToken = data.registrationId;
            pushNotification.token.updateServer = true;

            appLib.log('Push notification has changed from: ' + pushNotification.token.currentToken + ' to: ' + pushNotification.token.newToken);
       } else {
            appLib.log('Push notification is: ' + pushNotification.token.currentToken);
       }
    },


    //## Fires when a push notification error occurs
    onError: function(e) {
       appLib.log("push error = " + e.message);
       appLib.trackEvent('Notification', 'error', e.message);
    },


    //## Fires when a push notification has been pressed, causing the app to open
    onNotification: function(data) {
        appLib.log('notification event');
        appLib.trackEvent('Notification', 'clicked', '');        

        function getFailureFunc(title) {
            return function(xhr, msg, err) { 
                var wrappedTitle = '[' + title + ']';

                var detail = '';
                if(msg !== null) detail += msg + ' ';
                if(err !== null) detail += err;

                appLib.log('Notification error: ' + detail + ' ' + wrappedTitle);
                appLib.trackEvent('Notification', 'error', detail + ' ' + wrappedTitle);

                if(detail.toLowerCase().indexOf('you must complete an assessment') > -1) {
                    appLib.alert(detail.trim());
                    return;
                } else if(detail.toLowerCase().indexOf('invalid token, please call authenticateuser') > -1) {
                    appLib.alert('Please login to receive daily notifications');
                    return;
                }


                appLib.confirm('Unable to download Daily Question - Retry?', 
                    function(selection) { 
                        if(selection != 1)
                            return;

                        getQuestionAndDisplay();                        
                    },
                    title); 
            };
        }

        function getQuestionAndDisplay() {
            oe.getNotificationQuestions(function(questions) {
                 _.each(questions, function (q) {
                    appLib.debugLog('Downloaded Notification QID: ' + q.QID);
                });

                oe.loadQuestions(questions, -1, oe.downloadImages, function(qSet) {
                        oe.notificationQuestionBank = qSet;

                        app.trigger('showNotificationQuestion');
                    }, 
                    getFailureFunc('Load Notification Question'));
            }, getFailureFunc('Get Notification Question'));
        }

        getQuestionAndDisplay();
    }
};
