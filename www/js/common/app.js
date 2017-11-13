var RootUrl = (IntendedEnvironment == 'Staging') ? "https://www.mynyte.co.uk/staging/": "https://www.mynyte.co.uk/live/";
var AssetsFolderUrl = RootUrl + "sneak-preview";
var AnalyticsScriptSrc = (IntendedPlatform == "browser") ? " https://www.google-analytics.com/ ": "";
var MetaContent = "default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src 'self' " + RootUrl + " https://csi.gstatic.com/ https://1.bp.blogspot.com/ https://stats.g.doubleclick.net/ https://www.cineworld.co.uk/ https://maps.googleapis.com/"+AnalyticsScriptSrc+"data:";

app.constant("EnvironmentVariables", {
              "IntendedPlatform": IntendedPlatform,
              "IntendedEnvironment": IntendedEnvironment,
              "DebugMode": DebugMode,
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
             "CineworldApiUrl": "https://www.cineworld.co.uk/api/quickbook/films",
             "ImageUploadUrl": AssetsFolderUrl + "/data/functions/image-upload.php",
             "FilesUrl": AssetsFolderUrl + "/data/functions/files.php",
             
             "MovieDBApiKey": "bad6907fbc0593ecf082f5022a24804c"
            })
