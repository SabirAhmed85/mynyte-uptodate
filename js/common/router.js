app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  	//bottom tabs
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    
    // profile page
    .state('app.profile', {
      url: "/profile/:action",
      views: {
        'profile-tab' :{
          	templateUrl: "templates/profile-views/profile.html",
		  		controller: "ProfileCtrl"
        },
        params: {
          action: null
        }
      }
    })
        //Forgot Password
        .state('app.resetPassword', {
          url: "/resetPassword/:stage/:code/:_profileId",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/reset-password.html",
                    controller: "ResetPasswordCtrl"
            }
          },
          params: {
            stage: null,
            code: null,
            _profileId: null
          }
        })
        //RegisterIntro
        .state('app.registerIntro', {
          url: "/registerIntro",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/sign-up-intro.html",
                    controller: "RegisterIntroCtrl"
            }
          }
        })
        //Register
        .state('app.register', {
          url: "/register/:profileType",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/sign-up.html",
                    controller: "RegisterCtrl"
            }
          },
          params: {
            profileType: null
          }
        })
        //Complete Registration
        .state('app.registerFinal', {
          url: "/registerFinal/:profileType/:_usersId/:usersEMail",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/sign-up-final.html",
                    controller: "RegisterFinalCtrl"
            }
          },
          params: {
            profileType: null,
            _usersId: null,
            usersEMail: null,
            usersPWord: null
          }
        })
        //Privacy
        .state('app.privacyPolicy', {
          url: "/privacyPolicy",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/privacy-policy.html",
                    controller: "PrivacyPolicyCtrl"
            }
          }
        })

        //Notifications
        .state('app.profile.notificationsSummary', {
          url: "/notificationsSummary/",
          views: {
            'profile-tab@app' :{
                templateUrl: "templates/profile-views/notifications-summary.html",
                controller: "NotificationsSummaryCtrl"
            }
          }
        })
        .state('app.profile.notification', {
          url: "/notification/:id/:type",
          views: {
            'profile-tab@app' :{
                templateUrl: "templates/profile-views/notification.html",
                controller: "NotificationCtrl"
            }
          },
          params: {
            id: null,
            type: null
          }
        })
        .state('app.profile.messageGroups', {
          url: "/messageGroups/:relListing/:groupType",
          views: {
            'profile-tab@app' :{
                templateUrl: "templates/profile-views/message-groups.html",
                controller: "MessageGroupsCtrl"
            }
          },
          params: {
            relListing: null,
            groupType: null
          }
        })
        .state('app.profile.messageGroups.messageGroup', {
          url: "/messageGroups/:relListing/:groupType/messageGroup/:_id/:_profileIds/:messageNameString",
          cache: true,
          views: {
            'profile-tab@app' :{
                templateUrl: "templates/profile-views/message-group.html",
                controller: "MessageGroupCtrl"
            }
          },
          params: {
            relListing: null, groupType: null,
            _id: null,
            _profileIds: [],
            messageNameString: null
          }
        })
        /* Business Items */
        .state('app.businessItems', {
          url: "/businessItems/:itemType/:timeScale",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/business-items.html",
                controller: "BusinessItemsCtrl"
            }
          },
          params: {
            itemType: null,
            timeScale: null
          }
        })
        .state('app.businessItem', {
          url: "/businessItems/:itemType/:timeScale/businessItem/:_id",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/business-item.html",
                controller: "BusinessItemCtrl"
            }
          },
          params: {
            itemType: null, timeScale: null,
            _id: null
          }
        })
        .state('app.addBusinessItem', {
          url: "/businessItems/:itemType/addBusinessItem/:_secondaryItemTypeId",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/add-business-item.html",
                controller: "AddBusinessItemCtrl"
            }
          },
          params: {
            itemType: null,
            _secondaryItemTypeId: null
          }
        })
        .state('app.businessItemSettings', {
          url: "/businessItems/:itemType/businessItemSettings",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/business-item-settings.html",
                controller: "BusinessItemSettingsCtrl"
            }
          },
          params: {
            itemType: null
          }
        })
        /* Business Items END */
        /* Profile Items */
        .state('app.profileItems', {
          url: "/profileItems/:itemType/:specificItemType/:_albumId/:albumType/:timeScale",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/profile-items.html",
                controller: "ProfileItemsCtrl"
            }
          },
          params: {
            itemType: null,
            specificItemType: null,
            _albumId: null,
            albumType: null,
            timeScale: null
          }
        })
        .state('app.addProfileItem', {
          url: "/addProfileItem/:itemType/:specificItemType/:_albumId/:albumType",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/add-profile-item.html",
                controller: "AddProfileItemCtrl"
            }
          },
          params: {
            itemType: null, specificItemType: null, _albumId: null, albumType: null
          }
        })
        
        .state('app.accountSettings', {
          url: "/accountSettings/:settingsType",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/account-settings.html",
                controller: "AccountSettingsCtrl"
            }
          },
          params: {
            settingsType: null
          }
        })
        .state('app.accountSettingsAdvanced', {
          url: "/accountSettings/:settingsType/accountSettingsAdvanced/:setting",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/account-settings-advanced.html",
                controller: "AccountSettingsAdvancedCtrl"
            }
          },
          params: {
            settingsType: null,
            setting: null
          }
        })
        //Contact MyNyte
        .state('app.contactMyNyte', {
          url: "/contactMyNyte/",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/contact-mynyte.html",
                    controller: "ContactMyNyteCtrl"
            }
          }
        })
        
        //** NL ADMIN **//
        // contacts page
        .state('app.contacts', {
          url: "/contacts",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/contacts.html",
                    controller: "ContactsCtrl"
            }
          }
        })
        // add contacts page
        .state('app.addContact', {
          url: "/contacts/addContact",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/add-contact.html",
                    controller: "AddContactCtrl"
            }
          }
        })
        // contact detail
        .state('app.contactDetail', {
          url: "/contacts/contactDetail/:_id",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/contact-detail.html",
                    controller: "ContactDetailCtrl"
            }
          },
          params: {
            _id: null
          }
        })

        //Article Pages
        .state('app.articles', {
          url: "/articles/:articleType/:categories/:subCategories",
          views: {
            'profile-tab' :{
                templateUrl: "templates/article-views/articles.html",
                    controller: "ArticlesCtrl"
            }
          },
          params : {
            articleType: null,
            categories: null,
            subCategories: null
          }
        })
        .state('app.articles.article', {
          url: "/:articleId",
          views: {
            'profile-tab' :{
                templateUrl: "templates/article-views/article.html",
                    controller: "ArticleCtrl"
            }
          },
          params : {
            articleId: null
          }
        })
    
    //  offers
    .state('app.offers', {
      url: "/offers",
      views: {
        'offers-tab' :{
          	templateUrl: "templates/offers-views/offers.html",
		  		  controller: "OffersCtrl"
        }
      }
    })
        .state('app.offers.offerDetail', {
          url: "/offerDetail/:_id",
          views: {
            'offers-tab@app' :{
                templateUrl: "templates/offers-views/offer-detail.html",
                controller: "OfferDetailCtrl"
            }
          },
          params : {
            _id: null
          }
        })
    
    //  nl feed
    .state('app.feed', {
      url: "/feed",
      views: {
        'feed-tab' :{
          	templateUrl: "templates/feed-views/nl-feed.html",
		  		controller: "NLFeedCtrl"
        }
      }
    })
        .state('app.feed.nlfeedListings', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/",
          views: {
            'feed-tab@app' :{
                templateUrl: "templates/feed-views/nl-feed-listings.html",
                    controller: "NLFeedListingsCtrl"
            }
          },
          params: {
            searchType: null,
            _businessTypeId: null
          }
        })
        .state('app.feed.nlfeedListing', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType",
          views: {
            'feed-tab@app' :{
                templateUrl: "templates/feed-views/nl-feed-listing.html",
                    controller: "NLFeedListingCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null,
            _listingId: null,
            listingType: null
          }
        })
        .state('app.feedListing-photos', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/:listingName/nl-feedListing-photos/:_id",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing-photos.html",
                    controller: "NLFeedListingPhotosCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null, listingName: null,
            _id: null, specificListingType: null
          }
        })
        .state('app.feedListing-specific-photos', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/:listingName/nl-feedListing-photos/:_id/nl-feedListing-specific-photos/:_listingProfileId/:_albumId/:albumType",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing-specific-photos.html",
                    controller: "NLFeedListingSpecificPhotosCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null, listingName: null, _id: null,
            _listingProfileId: null,
            _albumId: null,
            albumType: null
          }
        })
        .state('app.seeTrailer', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/:listingName/see-trailer/:_id/:movieTitle",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/see-trailer.html",
                    controller: "SeeTrailerCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null, listingName: null,
            _id: null,
            movieTitle: null
          }
        })
        .state('app.bookTable', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/book-table/:_id/:listingName/:tableForMax",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/book-table.html",
                    controller: "BookTableCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null,
            _id: null,
            listingName: null,
            tableForMax: null
          }
        })
        .state('app.bookTickets', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/book-tickets/:_id/:listingName",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/book-tickets.html",
                    controller: "BookTicketsCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null,
            _id: null,
            listingName: null
          }
        })
        .state('app.seeMenu', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/see-menu/:_businessId/:listingName/:_menuTypeId",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/see-menu.html",
                    controller: "SeeMenuCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null,
            _businessId: null,
             listingName: null,
            _menuTypeId: null
          }
        })
        .state('app.seeMenuItems', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/see-menu/:_businessId/:listingName/:_menuTypeId/see-menu-items/:_menuItemCategoryId",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/see-menu-items.html",
                    controller: "SeeMenuItemsCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null, _businessId: null, listingName: null, _menuTypeId: null,
            _menuItemCategoryId: null
          }
        })
        .state('app.seeBusinessesItems', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/see-businesses-items/:_businessId/:itemType/:listingName",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/see-businesses-items.html",
                    controller: "SeeBusinessesItemsCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null,
            _businessId: null,
            itemType: null,
            listingName: null
          }
        })
        .state('app.seeBusinessMenuItems', {
          url: "/nl-feedListings/:searchType/:_businessTypeId/nl-feedListing/:_listingId/:listingType/see-business-menu-items/:_businessId/:_menuItemCategoryId/:_menuTypeId/:viewType",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/see-business-menu-items.html",
                    controller: "SeeBusinessMenuItemsCtrl"
            }
          },
          params: {
            searchType: null, _businessTypeId: null, _listingId: null, listingType: null,
            _businessId: null,
            _menuItemCategoryId: null,
            _menuTypeId: null,
            viewType: null
          }
        })
        .state('app.completeTakeawayOrder', {
          url: "/complete-takeaway-order/:_businessId",
          views: {
            'feed-tab' :{
                templateUrl: "templates/feed-views/complete-takeaway-order.html",
                    controller: "CompleteTakeawayOrderCtrl"
            }
          },
          params: {
            _businessId: null
          }
        })
    
    //  taxi
    .state('app.taxi', {
      url: "/taxi/",
      views: {
        'taxi-tab' :{
          	templateUrl: "templates/taxi-views/taxi.html",
		  		controller: "TaxiCtrl"
        }
      }
    })
    // more page
    .state('app.more', {
      url: "/more/",
      views: {
        'more-tab' :{
          	templateUrl: "templates/more-views/more.html",
		  		controller: "MoreCtrl"
        }
      }
    })
      //Download the App
      .state('app.downloadTheApp', {
        url: "/downloadTheApp",
        views: {
          'more-tab' :{
              templateUrl: "templates/more-views/download-the-app.html",
                  controller: "DownloadTheAppCtrl"
          }
        }
      })
      //ExternalApi
      .state('app.externalApi', {
        url: "/externalApi/:format/:colorScheme/:_businessId/:_liveChatId",
        views: {
          'more-tab' :{
              templateUrl: "templates/more-views/external-api.html",
                  controller: "ExternalApiCtrl"
          }
        }
      })
	 
    //  login page
    //Default Page App goes to on Start
    
  	$urlRouterProvider.otherwise("/app/feed");
    //$ionicConfigProvider.footerBar.transition('none');

})
