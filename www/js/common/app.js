/* UNIQUE TO ENVIRONMENT (Options are: 'Staging' and 'Live')*/
var IntendedEnvironment = "Staging";
var IntendedPlatform = "browser";
/* */

var AssetsFolderUrl = (IntendedEnvironment == 'Staging') ? "http://staging.mynyte.co.uk": "https://www.mynyte.co.uk/sneak-preview";
var RootUrl = (IntendedEnvironment == 'Staging') ? "http://staging.mynyte.co.uk/": "https://www.mynyte.co.uk/";
var ConnectionPrefix = (IntendedEnvironment == 'Staging') ? "http": "https";
var MetaContent = "default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src 'self' " + RootUrl + " "+ConnectionPrefix+"://csi.gstatic.com/ "+ConnectionPrefix+"://1.bp.blogspot.com/ "+ConnectionPrefix+"://maps.googleapis.com/ data:"

app.constant("EnvironmentVariables", {
              "IntendedPlatform": IntendedPlatform,
              "IntendedEnvironment": IntendedEnvironment,
              "MetaContent": MetaContent,
              "RootUrl": RootUrl,
              "AssetsFolderUrl": AssetsFolderUrl,
              "AssetsFolderRelUrl": (IntendedEnvironment == 'Staging') ? '': '/sneak-preview'
            });

app.constant("Config", {
             "CategoriesUrl": AssetsFolderUrl + "/data/sp/Categories.php",
             "ContactsUrl": AssetsFolderUrl + "/data/sp/Contacts.php",
             "CreateProfileUrl": AssetsFolderUrl + "/data/sp/Profile.php",
             "OffersUrl": AssetsFolderUrl + "/data/sp/Offer.php",
             "EventsUrl": AssetsFolderUrl + "/data/sp/Event.php",
             "ListingsUrl": AssetsFolderUrl + "/data/sp/Listing.php",
             "TaxiUrl": AssetsFolderUrl + "/data/sp/Taxi.php",
             "NotificationUrl": AssetsFolderUrl + "/data/sp/Notification.php",
             "MessageUrl": AssetsFolderUrl + "/data/sp/Message.php",
             "MenuItemUrl": AssetsFolderUrl + "/data/sp/MenuItem.php",
             "TableBookingUrl": AssetsFolderUrl + "/data/sp/TableBooking.php",
             "MovieUrl": AssetsFolderUrl + "/data/sp/Movie.php",
             "ImageUploadUrl": AssetsFolderUrl + "/data/functions/image-upload.php"
            })