app.constant("Config", {
             "CategoriesUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Categories.php",
             "ContactsUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Contacts.php",
             "CreateProfileUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Profile.php",
             "OffersUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Offer.php",
             "EventsUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Event.php",
             "ListingsUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Listing.php",
             "TaxiUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Taxi.php",
             "NotificationUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Notification.php",
             "MessageUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Message.php",
             "MenuItemUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/MenuItem.php",
             "TableBookingUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/TableBooking.php",
             "MovieUrl": "https://www.mynyte.co.uk/sneak-preview/data/sp/Movie.php",
             "ImageUploadUrl": "https://www.mynyte.co.uk/sneak-preview/data/functions/image-upload.php"
             })
// config contact
app.constant("ConfigContact", {
             "EmailId": "weblogtemplatesnet@gmail.com",
             "ContactSubject": "Contact"
             })
// config admon
app.constant("ConfigAdmob", {
             "interstitial": "ca-app-pub-3940256099942544/1033173712",
             "banner": "ca-app-pub-3940256099942544/6300978111"
             })
/* push notification
 app.constant("PushNoti", {
 "senderID": "senderID",
 })*/

app.constant("$MD_THEME_CSS","");

//KK - adding one signal setup.
/*
document.addEventListener("deviceready",
  //background thread it
  setTimeout(function () {
    var oneSignalReady = function () {
    console.log("readyFunction");
      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      // receive a call back? - output the data to console
      var notificationOpenedCallback = function(jsonData) {
        alert('notificationOpenedCallback: ' + "GOT A RESPONSE!" + JSON.stringify(jsonData));
      };
      
      // for android, this'll both params need to be filled in. See https://documentation.onesignal.com/docs/cordova-sdk-setup
        
      console.log(typeof window.plugins.OneSignal);
      console.log(window.plugins.OneSignal);
      window.plugins.OneSignal
      .startInit("5d38e847-c406-4e2e-85d6-27a76ce657f3","")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
      window.plugins.OneSignal.registerForPushNotifications();
      //window.plugins.OneSignal.setSubscription(true);
      //verbose
      // change visual level to 6 for pop ups
      window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 6})
    }
  
    var checkForOneSignal = function(){
      if (window.plugins == null) {
        alert("plugins not Found");
        window.setTimeout(function () {checkForOneSignal()}, 500);
      } else {
          alert("onesignal Found");
          if (window.plugins.OneSignal) {
          alert("onesignal Ready");
            oneSignalReady();
          } else {
            alert("stillChecking, ", window.plugins.OneSignal);
            window.setTimeout(function () {checkForOneSignal()}, 2000);
          }
      }
    };
    
    checkForOneSignal();
  }),
  false
);
*/

