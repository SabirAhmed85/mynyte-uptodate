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
      url: "/profile",
      views: {
        'profile-tab' :{
          	templateUrl: "templates/profile-views/profile.html",
		  		controller: "ProfileCtrl"
        }
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
          url: "/register",
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
          url: "/registerFinal",
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
        .state('app.notificationsSummary', {
          url: "/notificationsSummary",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/notifications-summary.html",
                controller: "NotificationsSummaryCtrl"
            }
          }
        })
        .state('app.notification', {
          url: "/notification",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/notification.html",
                controller: "NotificationCtrl"
            }
          },
          params: {
            id: null,
            type: null
          }
        })
        .state('app.messageGroups', {
          url: "/messageGroups",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/message-groups.html",
                controller: "MessageGroupsCtrl"
            }
          },
          params: {
            relListing: null,
            groupType: null
          }
        })
        .state('app.messageGroup', {
          url: "/messageGroup",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/message-group.html",
                controller: "MessageGroupCtrl"
            }
          },
          params: {
            _id: null,
            relListing: null,
            _profileIds: [],
            groupType: null,
            messageNameString: null
          }
        })
        /* Business Items */
        .state('app.businessItems', {
          url: "/businessItems",
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
          url: "/businessItem",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/business-item.html",
                controller: "BusinessItemCtrl"
            }
          },
          params: {
            _id: null,
            itemType: null,
            timeScale: null
          }
        })
        .state('app.addBusinessItem', {
          url: "/addBusinessItem",
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
          url: "/businessItemSettings",
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
        /* Business Items */
        .state('app.profileItems', {
          url: "/profileItems",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/profile-items.html",
                controller: "ProfileItemsCtrl"
            }
          },
          params: {
            itemType: null,
            _albumId: null,
            albumType: null
          }
        })
        
        .state('app.accountSettings', {
          url: "/accountSettings",
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

        .state('app.videos', {
          url: "/videos",
          views: {
            'profile-tab' :{
                templateUrl: "templates/videos.html",
                controller: "VideosCtrl"
            }
          },
          params: {
            itemType: null
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
          url: "/addContact",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/add-contact.html",
                    controller: "AddContactCtrl"
            }
          }
        })
        // contact detail
        .state('app.contactDetail', {
          url: "/contactDetail",
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
        .state('app.offerDetail', {
          url: "/offerDetail",
          views: {
            'offers-tab' :{
                templateUrl: "templates/offers-views/offer-detail.html",
                controller: "OfferDetailCtrl"
            }
          },
          params : {
            _id: null
          }
        })
    
    //  nl feed
    .state('app.nlfeed', {
      url: "/nl-feed",
      views: {
        'nlfeed-tab' :{
          	templateUrl: "templates/feed-views/nl-feed.html",
		  		controller: "NLFeedCtrl"
        }
      }
    })
        .state('app.nlfeedListings', {
          url: "/nl-feedListings",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listings.html",
                    controller: "NLFeedListingsCtrl"
            }
          },
          params: {
            searchType: null,
            _businessTypeId: null
          }
        })
        .state('app.nlfeedListing', {
          url: "/nl-feedListing",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing.html",
                    controller: "NLFeedListingCtrl"
            }
          },
          params: {
            _listingId: null,
            listingType: null
          }
        })
        .state('app.nlfeedListing-enquiry', {
          url: "/nl-feedListing-enquiry",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing-enquiry.html",
                    controller: "NLFeedListingEnquiryCtrl"
            }
          },
          params: {
            _profileId: null
          }
        })
        .state('app.nlfeedListing-photos', {
          url: "/nl-feedListing-photos",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing-photos.html",
                    controller: "NLFeedListingPhotosCtrl"
            }
          },
          params: {
            _listingId: null,
            listingType: null
          }
        })
        .state('app.nlfeedListing-specific-photos', {
          url: "/nl-feedListing-specific-photos",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/nl-feed-listing-specific-photos.html",
                    controller: "NLFeedListingSpecificPhotosCtrl"
            }
          },
          params: {
            _listingProfileId: null,
            _listingId: null,
            listingType: null,
            _albumId: null,
            albumType: null
          }
        })
        .state('app.seeTrailer', {
          url: "/see-trailer",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/see-trailer.html",
                    controller: "SeeTrailerCtrl"
            }
          },
          params: {
            _id: null,
            movieTitle: null
          }
        })
        .state('app.bookTable', {
          url: "/book-table",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/book-table.html",
                    controller: "BookTableCtrl"
            }
          },
          params: {
            _id: null
          }
        })
        .state('app.bookTickets', {
          url: "/book-tickets",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/book-tickets.html",
                    controller: "BookTicketsCtrl"
            }
          },
          params: {
            _id: null
          }
        })
        .state('app.seeMenu', {
          url: "/see-menu",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/see-menu.html",
                    controller: "SeeMenuCtrl"
            }
          },
          params: {
            _businessId: null,
            _menuTypeId: null
          }
        })
        .state('app.seeMenuItems', {
          url: "/see-menu-items",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/see-menu-items.html",
                    controller: "SeeMenuItemsCtrl"
            }
          },
          params: {
            _businessId: null,
            _menuItemCategoryId: null,
            _menuTypeId: null
          }
        })
        .state('app.seeBusinessesItems', {
          url: "/see-businesses-items",
          views: {
            'nlfeed-tab' :{
                templateUrl: "templates/feed-views/see-businesses-items.html",
                    controller: "SeeBusinessesItemsCtrl"
            }
          },
          params: {
            _businessId: null,
            itemType: null,
            listingType: null
          }
        })
        .state('app.seeBusinessMenuItems', {
          url: "/see-business-menu-items",
          views: {
            'profile-tab' :{
                templateUrl: "templates/profile-views/see-business-menu-items.html",
                    controller: "SeeBusinessMenuItemsCtrl"
            }
          },
          params: {
            _businessId: null,
            _menuItemCategoryId: null,
            _menuTypeId: null
          }
        })
        .state('app.completeTakeawayOrder', {
          url: "/complete-takeaway-order",
          views: {
            'nlfeed-tab' :{
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
      url: "/taxi",
      views: {
        'taxi-tab' :{
          	templateUrl: "templates/taxi-views/taxi.html",
		  		controller: "TaxiCtrl"
        }
      }
    })
    // more page
    .state('app.more', {
      url: "/more",
      views: {
        'more-tab' :{
          	templateUrl: "templates/more-views/more.html",
		  		controller: "MoreCtrl"
        }
      }
    })
	 
    //  login page
    //Default Page App goes to on Start
  	$urlRouterProvider.otherwise("/app/nl-feed");
    $ionicConfigProvider.views.maxCache(5);
    //$ionicConfigProvider.footerBar.transition('none');

})