## OnExamination Mobile App

OnExamination mobile app for [iOS](https://itunes.apple.com/us/app/onexamination-exam-revision/id544289965) and [Android](https://play.google.com/store/apps/details?id=com.bmjgroup.onexamination) devices.


***

### Code Generation / Minification

Javascript found in \www\js is generated from files found in \www\source, therefore should not be manually edited. 

Generation can be performed (on Windows) using:
* \www\tools\deploy.bat - which simply deploys the original script files
* \www\tools\deploy-minified.bat - which minifies and deploys script files ready for publication


***

### BDD / UI Tests

**Jenkins build**

We now have a [Jenkins build](http://scup.internal.bmjgroup.com:8080/jenkins/view/OnExamination/job/OnExamination-Mobile/) that runs these tests at the click of a button!

#### Configuration

[App.config](https://github.com/BMJ-Ltd/onexamination-mobile/blob/master/bdd/OnExaminationMobileApp_Tests/App.config) needs the follow values configured:

##### BaseUrl

URL of website hosting files in: [onexamination-mobile/www](https://github.com/BMJ-Ltd/onexamination-mobile/tree/master/www)

NOTE: A copy of cordova.js must be added in this folder for UI tests to work, but is not required for deployment via PhoneGap Build.

```
<add key="BaseUrl" value="http://localhost:8080/" />
```

##### ChromeDriverPath

Folder that contains [chromedriver.exe](https://code.google.com/p/selenium/wiki/ChromeDriver) (currently v2.8)

```
<add key="ChromeDriverPath" value="c:\dev\selenium" />
```

***

### Notes On Working With The Mobile App

go to directory

``` cd ~/Sites/onexamination-mobile ```



update to latest code from repository

``` git pull origin master ```



Navigate to ``` ~/Documents/adt-bundle-mac-x86_64-20131030/sdk/tools ``` and run the android application - this will fire up the Android SDK Manager where you can configure the Android Virtual Devices (AVDs)


The files to change are the ones in the www folder.


To run the app in the emulator 

``` cordova emulate android --target=Nexus_7_Lolipop ```


You can change the name of the emulator to any from the list in the AVD manager and it will boot up and emulate on that device
