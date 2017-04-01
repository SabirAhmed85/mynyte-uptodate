/* UNIQUE TO ENVIRONMENT (Options are: 'Staging' and 'Live')*/
var IntendedEnvironment = "Live";
var IntendedPlatform = "browser";
var UnderConstruction = true;
/* */

var RootUrl = (IntendedEnvironment == 'Staging') ? "https://www.mynyte.co.uk/staging/": "https://www.mynyte.co.uk/";
var ConnectionPrefix = (IntendedEnvironment == 'Staging') ? "http": "https";
var AssetsFolderUrl = RootUrl + "sneak-preview";
var MetaContent = "default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src 'self' " + RootUrl + " "+ConnectionPrefix+"://csi.gstatic.com/ "+ConnectionPrefix+"://1.bp.blogspot.com/ "+ConnectionPrefix+"://maps.googleapis.com/ data:"

app.constant("EnvironmentVariables", {
              "IntendedPlatform": IntendedPlatform,
              "IntendedEnvironment": IntendedEnvironment,
              "UnderConstruction": UnderConstruction,
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