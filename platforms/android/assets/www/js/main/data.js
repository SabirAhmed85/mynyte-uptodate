
// profile
app.factory('Profile', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.details = function () {
		return $http(
            {
				method: 'GET', url:Config.ProfileUrl
			}
		);
	}
	data.getAllUserEngagementTypes = function () {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllUserEngagementTypes',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.checkIfDisplayNameTaken = function (displayName) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=checkIfDisplayNameTaken&displayName=' + displayName
			}
		);
	}
    data.checkIfEmailTaken = function (email) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=checkIfEmailTaken&email=' + email
			}
		);
	}
    data.createProfile = function (name, displayName, email, word, profileType) {
		return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=createProfile&email=' + email,
                data: {'name': name, 'displayName': displayName, 'word': word, 'profileType': profileType, 'email': email},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.createFBUserProfile = function (name, displayName, email, fbId) {
		return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=createFBUserProfile&email=' + email,
                data: {'name': name, 'displayName': displayName, 'fbId': fbId, 'email': email},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getProfileItemCountForProfile = function (_profileId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getProfileItemCountForProfile&_profileId=' + _profileId
			}
		);
    }
    data.getAllProfileDetails = function (_profileId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllProfileDetails&_profileId=' + _profileId
			}
		);
    }
    data.getAllTonightsFeedOptionsForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllTonightsFeedOptionsForBusiness&_businessId=' + _businessId
			}
		);
    }
    data.getAllBusinessSettingsForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllBusinessSettingsForBusiness&_businessId=' + _businessId
			}
		);
    }
    data.getBusinessTypesForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getBusinessTypesForBusiness&_businessId=' + _businessId
			}
		);
    }
    data.getFoodStylesForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getFoodStylesForBusiness&_businessId=' + _businessId
			}
		);
    }
    data.getBusinessOpeningTimesForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getBusinessOpeningTimesForBusiness&_businessId=' + _businessId
			}
		);
    }
    data.updateAllProfileDetails = function (params) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=updateAllProfileDetails',
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.updateUsersDefaultPhoto = function (params) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=updateUsersDefaultPhoto',
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.updateProfilePasswordDetails = function (params) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=updateProfilePasswordDetails',
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.updateAllBusinessSettingDetails = function (params) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=updateAllBusinessSettingDetails',
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.updateBusinessTypesForBusiness = function (_businessId, _businessTypeIds, _foodStyleIds) {
        var businessTypeIdString = "";
		if (_businessTypeIds.length > 0) {
			for (a = 0; a < _businessTypeIds.length; a++) {
				businessTypeIdString += '&_businessTypeIds[]=' + _businessTypeIds[a];
			}
		} else {
			businessTypeIdString = '&_businessTypeIds[]=undefined';
		}
        var foodStyleIdString = "";
		if (_foodStyleIds.length > 0) {
			for (a = 0; a < _foodStyleIds.length; a++) {
				foodStyleIdString += '&_foodStyleIds[]=' + _foodStyleIds[a];
			}
		} else {
			foodStyleIdString = '&_foodStyleIds[]=undefined';
		}
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=updateBusinessTypesForBusiness&_businessId=' + _businessId + businessTypeIdString + foodStyleIdString,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.updateOrInsertBusinessOpeningTimesForBusiness = function (_businessId, mondayOpening, mondayClosing, tuesdayOpening, tuesdayClosing, wednesdayOpening, wednesdayClosing, thursdayOpening, thursdayClosing, fridayOpening, fridayClosing, saturdayOpening, saturdayClosing, sundayOpening, sundayClosing) {
        return $http(
            {
				method: 'POST',
                url:Config.CreateProfileUrl + '?action=updateOrInsertBusinessOpeningTimesForBusiness&_businessId=' + _businessId + '&mondayOpeningTime=' + mondayOpening + '&mondayClosingTime=' + mondayClosing + '&tuesdayOpeningTime=' + tuesdayOpening + '&tuesdayClosingTime=' + tuesdayClosing + '&wednesdayOpeningTime=' + wednesdayOpening + '&wednesdayClosingTime=' + wednesdayClosing + '&thursdayOpeningTime=' + thursdayOpening + '&thursdayClosingTime=' + thursdayClosing + '&fridayOpeningTime=' + fridayOpening + '&fridayClosingTime=' + fridayClosing + '&saturdayOpeningTime=' + saturdayOpening + '&saturdayClosingTime=' + saturdayClosing + '&sundayOpeningTime=' + sundayOpening + '&sundayClosingTime=' + sundayClosing,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
	data.createUserEngagement = function (_engagementTypeId, _actionerId, _actionedListingId, actionedListingTypeName, _profileIds, images) {
		var profileIdString = "";
		if (_profileIds.length > 0) {
			for (a = 0; a < _profileIds.length; a++) {
				profileIdString += '&_profileIds[]=' + _profileIds[a]._profileId;
			}
		} else {
			profileIdString = '&_profileIds[]=undefined';
		}
		return $http(
            {
				method: 'POST', 
				url:Config.CreateProfileUrl + '?action=createUserEngagement&_engagementTypeId=' + _engagementTypeId + '&_actionerId=' + _actionerId + '&_actionedListingId=' + _actionedListingId + '&actionedListingTypeName=' + actionedListingTypeName + profileIdString,
				data: {file: images},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
	data.deleteUserEngagement = function (_engagementTypeId, _actionerId, _actionedListingId, actionedListingTypeName) {
		return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=deleteUserEngagement&_engagementTypeId=' + _engagementTypeId + '&_actionerId=' + _actionerId + '&_actionedListingId=' + _actionedListingId + '&actionedListingTypeName=' + actionedListingTypeName,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.deleteUsersImage = function (params) {
		return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=removeImage',
                data: params, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.completeRegistration = function (_usersId, phone1, phone2, name, addressLine1, addressLine2, _townId, postCode, profileType, _businessTypeIds, _foodStyleIds) {
		var businessTypeIdString = "";
		if (_businessTypeIds.length > 0) {
			for (a = 0; a < _businessTypeIds.length; a++) {
                businessTypeIdString += '&_businessTypeIds[]=' + _businessTypeIds[a];
			}
		} else {
			businessTypeIdString = '&_businessTypeIds[]=undefined';
		}
        
        var foodStyleIdString = "";
		if (_foodStyleIds.length > 0) {
			for (a = 0; a < _foodStyleIds.length; a++) {
                foodStyleIdString += '&_foodStyleIds[]=' + _foodStyleIds[a];
			}
		} else {
			foodStyleIdString = '&_foodStyleIds[]=undefined';
		}
        
        var dataObj = {'_usersId': _usersId, 'phone1': phone1, 'phone2': phone2, 'name': name, 'addressLine1': addressLine1, 'addressLine2': addressLine2, '_townId': _townId, 'postCode': postCode, 'profileType': profileType};
		return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=completeRegistration' + businessTypeIdString + foodStyleIdString,
                data: dataObj,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.makeUserActive = function (_profileId, _oneSignalId) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=makeUserActive&_profileId=' + _profileId + '&_oneSignalId=' + _oneSignalId,
                async: false
            }
		);
    }
    data.makeUserInactive = function (_profileId, _oneSignalId) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=makeUserInactive&_profileId=' + _profileId + '&_oneSignalId=' + _oneSignalId,
                async: false
            }
		);
    }
    data.logIn = function (email, word) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=logIn&email=' + email + '&word=' + word
			}
		);
	}
    data.logInThroughFb = function (email, fbId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=logInThroughFb&email=' + email + '&fbId=' + fbId
			}
		);
	}
    data.getProfiles = function (_townId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getProfiles&_townId=' + _townId
			}
		);
	}
    data.getListingsByName = function (_townId, name) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getListings&_townId=' + _townId + '&name=' + name
			}
		);
	}
	data.getAllFollowersByName = function (nameSearched, _profileId) {
		return $http(
			{
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllFollowersByName&_profileId=' + _profileId + '&nameSearched='+ nameSearched
			}
		);
	}
	data.getAllBusinessesByName = function (nameSearched, business1Type, business2Type) {
		return $http(
			{
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllBusinessesByName&nameSearched='+ nameSearched + '&business1Type='+ business1Type + '&business2Type='+ business2Type
			}
		);
	}
    data.getListingsByBusinessType = function (_townId, _businessTypeId, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getListings&_townId=' + _townId + '&_businessTypeId=' + _businessTypeId + '&_profileId=' + _profileId
			}
		);
	}
    data.getAllOpenBusinessAccountsByTown = function (_townId, _businessTypeId) {
        return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getAllOpenBusinessAccountsByTown&_townId=' + _townId + '&_businessTypeId=' + _businessTypeId
			}
		);
    }
    data.getListingsByMusicType = function (_townId, _musicStyleId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getListings&_townId=' + _townId + '&_musicStyleId=' + _musicStyleId
			}
		);
	}
    data.getListingById = function (_listingId, listingType, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getListings&_listingId=' + _listingId + '&listingType=' + listingType+ '&_profileId=' + _profileId
			}
		);
	}
    data.getListingsForFeed = function (_townId, _userId, feedType) {
    	var action = 'getListingsForFeed';
    	var userId = (_userId == null) ? 0: _userId;
    	switch(feedType) {
		    case 'food':
		        action = 'getListingsForFoodFeed';
		        break;
		    case 'events':
		        action = 'getListingsForNightlifeFeed';
		        break;
		    case 'movies':
		        action = 'getListingsForMoviesFeed';
		        break;
		    default:
		        action = 'getListingsForFeed';
		}
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl + '?action='+action+'&_userId=' + userId+'&_townId=' + _townId
			}
		);
	}

	/*Photo Info for Profile*/
	data.getPhotoAlbumsSummaryForProfile = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getPhotoAlbumsSummaryForProfile&_profileId=' + _profileId
			}
		);
	}
	data.getPhotoAlbumsSummaryForListing = function (_listingId, listingType) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getPhotoAlbumsSummaryForListing&_listingId=' + _listingId + '&listingType=' + listingType
			}
		);
	}
	data.getSpecificAlbumSummaryForListing = function (_listingId, _albumId, albumType, listingType) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getSpecificAlbumSummaryForListing&albumType='+albumType+'&_listingId=' + _listingId + '&_albumId=' + _albumId + '&listingType=' + listingType
			}
		);
	}

	/*Watchlist, Following/Followers List and Like List Info for Profile*/
	data.getWatchedListingsForProfile = function (_profileId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getWatchedListingsForProfile&_profileId=' + _profileId+'&timeScale='+timeScale
			}
		);
	}
	data.getFollowedListingsForProfile = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getFollowedListingsForProfile&_profileId='+_profileId
			}
		);
	}
	data.getFollowingProfilesForProfile = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getFollowingProfilesForProfile&_profileId='+_profileId
			}
		);
	}
	data.getLikedListingsForProfile = function (_profileId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getLikedListingsForProfile&_profileId='+_profileId+'&timeScale='+timeScale
			}
		);
	}
    data.getFollowerProfileIdsForBusiness = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getFollowerProfileIdsForBusiness&_businessId='+_businessId
			}
		);
	}

	data.getMyNyteActivityForPerson = function (_profileId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.CreateProfileUrl + '?action=getMyNyteActivityForPerson&_profileId='+_profileId + '&timeScale=' + timeScale
			}
		);
	}
    data.createResetCodeForProfileEmail = function (email) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=createResetCodeForProfileEmail',
                data: {'email': email}, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.checkPasswordResetCodeValidity = function (_profileId, code) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=checkPasswordResetCodeValidity',
                data: {'_profileId': _profileId, 'code': code}, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    },
    data.contactMyNyteTeam = function (params) {
        return $http(
            {
				method: 'POST', url:Config.CreateProfileUrl + '?action=contactMyNyteTeam',
                data: params, headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }

  	return data;
}]);

// notifications
app.factory('Notifications', ['$http', 'Config', function($http, Config) {
	var data = {};
    data.clearAllExpiredTransactions = function () {
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=clearAllExpiredTransactions'
			}
		);
	}
	data.getNotifications = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=getNotifications&_profileId=' + _profileId
			}
		);
	}
    data.getAllUserNotificationsSummaryForUpdate = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=getAllUserNotificationsSummaryForUpdate&_profileId=' + _profileId
			}
		);
	}
    data.getUnreadUserNotificationsSummaryForUpdate = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=getUnreadUserNotificationsSummaryForUpdate&_profileId=' + _profileId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getUnreadUserMessagesAndNotificationsSummaryForUpdate = function (_profileId) {
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=getUnreadUserMessagesAndNotificationsSummaryForUpdate&_profileId=' + _profileId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    
    //Push Notifications
    data.createOneSignalId = function (_profileId, _oneSignalId, deviceToken) {
		return $http(
            {
				method: 'POST', url:Config.NotificationUrl + '?action=createOneSignalId&_profileId=' + _profileId + '&_oneSignalId=' + _oneSignalId + '&deviceToken=' + deviceToken
			}
		);
	}
    data.removeOneSignalIdForLogOut = function (_oneSignalId) {
		return $http(
            {
				method: 'POST', url:Config.NotificationUrl + '?action=removeOneSignalIdForLogOut&_oneSignalId=' + _oneSignalId
			}
		);
	}
    
    data.getOneSignalDeviceTokensForProfiles = function (_profileIds) {
        var profileIdsString = "";
		if (_profileIds.length > 0) {
			for (a = 0; a < _profileIds.length; a++) {
                profileIdsString += '&_profileIds[]=' + _profileIds[a];
			}
		} else {
			profileIdsString = '&_profileIds[]=undefined';
		}
        
		return $http(
            {
				method: 'GET', url:Config.NotificationUrl + '?action=getOneSignalDeviceTokensForProfiles' + profileIdsString
			}
		);
	}
    
    //
  	return data;
}]);

// notifications
app.factory('Followers', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getFollowerEventFollowers = function () {
		return $http(
            {
				method: 'GET', url:Config.FollowerEventFollowersUrl
			}
		);
	}
  	return data;
}]);

// messages factory
app.factory('Messages',['$http', 'Config', function($http, Config) {
	var data = {};
    data.currentMessageGroupIdBeingViewed = null;
    data.checkIfMessageGroupExists = function (profilesArray) {
        var profilesUrlString = '';
        for (a = 0; a < profilesArray.length; a++) {
            profilesUrlString += '&_profiles[]=' + profilesArray[a];
        }
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=checkIfMessageGroupExists' + profilesUrlString
			}
		);
	}
    data.getMessageGroups = function (_profileId, groupType) {
        return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getMessageGroups&_profileId=' + _profileId + '&groupType=' + groupType
			}
		);
    }
	data.getMesages = function () {
		return $http(
			{
				method: 'GET', url:Config.MessagesUrl
			}
		);
	}
    data.getMessageGroupSummary = function (_usersProfileId, _groupId) {
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getMessageGroupSummary&_usersProfileId=' + _usersProfileId + '&_groupId=' + _groupId
			}
		);
	}
	data.getMessageGroup = function (_groupId, _usersProfileId, currentMessageIndex, _firstMessageId) {
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getMessageGroup&_groupId=' + _groupId + '&_usersProfileId=' + _usersProfileId + '&currentMessageIndex=' + currentMessageIndex + '&_firstMessageId=' + _firstMessageId
			}
		);
	}
    data.getMessageRecipientProfileIds = function (_messageGroupId, _senderProfileId) {
        return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getMessageRecipientProfileIds&_messageGroupId=' + _messageGroupId + '&_senderProfileId=' + _senderProfileId
			}
		);
    }
    data.getAllUserMessagesSummaryForUpdate = function (_usersProfileId) {
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getAllUserMessagesSummaryForUpdate&_profileId=' + _usersProfileId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getUnreadUserMessagesSummaryForUpdate = function (_usersProfileId) {
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getUnreadUserMessagesSummaryForUpdate&_profileId=' + _usersProfileId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getMessageDetails = function (_id) {
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=getMessageDetails&_id=' + _id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.insertMessageReadReceipts = function (_groupId, _usersProfileId, _messageId) {
        return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=insertMessageReadReceipts&_groupId=' + _groupId + '&_usersProfileId=' + _usersProfileId + '&_messageId=' + _messageId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.addMessage = function (newMessage) {
    	var profilesUrlString = '';
        for (a = 0; a < newMessage._profileIds.length; a++) {
            profilesUrlString += '&_profileIds[]=' + newMessage._profileIds[a];
        }
		return $http(
			{
				method: 'GET', url:Config.MessageUrl + '?action=addMessage&_groupId=' + newMessage._groupId + '&groupType='+ newMessage.groupType + '&_senderId=' + newMessage._senderId + '&messageText=' + newMessage.messageText + '&_relListingId=' + newMessage._relatedItemId + '&relListingType=' + newMessage.relatedItemType + profilesUrlString,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
  	return data;
}]);

    // NL Admin Contacts //
    // Contacts
    app.factory('Contacts', ['$http', 'Config', function($http, Config) {
        var data = {};
        data.getContacts = function () {
            return $http(
                {
                    method: 'GET', url:Config.ContactsUrl
                }
            );
        }
        data.getContact = function (contactId) {
            return $http(
                {
                    method: 'GET', url:Config.ContactsUrl + '?contactId=' + contactId
                }
            );
        }
        data.addContact = function (businessType, town, companyName, name, role, phone, email, website, note) {
            return $http(
                {
                    method: 'POST', url:Config.ContactsUrl + '?action=add&businessType=' + businessType + '&town=' + town + '&companyName=' + companyName + '&name=' + name + '&role=' + role + '&phone=' + phone + '&email=' + email + '&website=' + website + '&note=' + note
                }
            );
        }
        data.editContact = function (contactId, businessType, town, companyName, name, role, phone, email, website, note) {
            return $http(
                {
                    method: 'GET', url:Config.ContactsUrl + '?action=edit&contactId=' + contactId + '&businessType=' + businessType + '&town=' + town + '&companyName=' + companyName + '&name=' + name + '&role=' + role + '&phone=' + phone + '&email=' + email + '&website=' + website + '&note=' + note
                }
            );
        }
        return data;
    }]);

// categories
app.factory('Categories', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getCategories = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl
			}
		);
	}
    data.getAvailableTowns = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=town'
			}
		);
	}
    data.getAvailableMusicStyles = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=musicStyle'
			}
		);
	}
    data.getAvailableBusinessTypes = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=businessType'
			}
		);
	}
    data.getAllFoodStyles = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=foodStyle'
            }
		);
	}
    data.getAvailableFoodStyles = function (_townId, businessType) {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=foodStylesForTown&_townId=' + _townId + '&businessType=' + businessType
			}
		);
	}
    data.getAllMovieStyles = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=movieStyle'
			}
		);
	}
    data.getAvailableMovieStyles = function () {
		return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=movieStylesForTown'
			}
		);
	}
    data.getAllOfferCategoriesForBusiness = function (_businessId) {
        return $http(
            {
				method: 'GET', url:Config.CategoriesUrl + '?categoryType=getAllOfferCategoriesForBusiness&_businessId=' + _businessId
			}
		);
    }
  	return data;
}]);

// places
app.factory('Places', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPlaces = function () {
		return $http(
            {
				method: 'GET', url:Config.PlacesUrl
			}
		);
	}
  	return data;
}]);

// events
app.factory('Events', ['$http', 'Config', function($http, Config) {
	var data = {};
    data.getEvent = function (_eventId) {
		return $http(
            {
				method: 'GET', url:Config.EventsUrl + '?action=getEvents&_eventId=' + _eventId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
	data.getEventDateDetails = function (_eventId, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.EventsUrl + '?action=getEvents&getDates=1&_profileId='+_profileId+'&_eventId=' + _eventId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
	data.getEventsByBusiness = function (_businessId, timeScale, _profileId) {
		return $http(
            {
				method: 'GET', 
				url:Config.EventsUrl + '?action=getEvents&_businessId=' + _businessId + '&timeScale=' + timeScale + '&_profileId=' + _profileId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getEventsByTown = function (_townId, _musicStyleId, _profileId) {
        var stringAppend = _townId;
        if (typeof _musicStyleId !== 'undefined') {
            stringAppend += '&_musicStyleId=' + _musicStyleId;
        }
        stringAppend += '&_profileId=' + _profileId;
		return $http(
            {
				method: 'GET', url:Config.EventsUrl + '?action=getEvents&timeScale=present&_townId=' + stringAppend,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.createEvent = function (_businessId, _businessPlaceId, eventTitle, description, eventDateTime, dressCode, guestListMax, dealsOnTheNight, extraInfo, eventHasGuestList, weekdayIndex, weeksAhead, _musicStyleIds) {
		var musicStyleIdString = "";
		if (_musicStyleIds.length > 0) {
			for (a = 0; a < _musicStyleIds.length; a++) {
				if (_musicStyleIds[a]._id != null) {
					musicStyleIdString += '&_musicStyleIds[]=' + _musicStyleIds[a]._id;
				}
			}
		} else {
			musicStyleIdString = '&_musicStyleIds[]=undefined';
		}
		return $http(
            {
				method: 'POST', url:Config.EventsUrl + '?action=createEvent&_businessId=' + _businessId + '&_businessPlaceId=' + _businessPlaceId + '&eventTitle=' + eventTitle + '&description=' + description + '&eventDateTime=' + eventDateTime + '&dressCode=' + dressCode + '&guestListMax=' + guestListMax + '&dealsOnTheNight=' + dealsOnTheNight + '&extraInfo=' + extraInfo + '&eventHasGuestList=' + eventHasGuestList + '&weekdayIndex=' + weekdayIndex + '&weeksAhead=' + weeksAhead + musicStyleIdString
			}
		);
	}
	data.updateEvent = function (_eventId, _businessPlaceId, eventTitle, description, eventDateTime, dressCode, guestListMax, dealsOnTheNight, extraInfo, eventHasGuestList, weekdayIndex, weeksAhead, _musicStyleIds) {
		var musicStyleIdString = "";
		if (_musicStyleIds.length > 0) {
			for (a = 0; a < _musicStyleIds.length; a++) {
				if (_musicStyleIds[a]._id != null) {
					musicStyleIdString += '&_musicStyleIds[]=' + _musicStyleIds[a]._id;
				}
			}
		} else {
			musicStyleIdString = '&_musicStyleIds[]=undefined';
		}
		return $http(
            {
				method: 'POST', url:Config.EventsUrl + '?action=updateEvent&_eventId=' + _eventId + '&_businessPlaceId=' + _businessPlaceId + '&eventTitle=' + eventTitle + '&description=' + description + '&eventDateTime=' + eventDateTime + '&dressCode=' + dressCode + '&guestListMax=' + guestListMax + '&dealsOnTheNight=' + dealsOnTheNight + '&extraInfo=' + extraInfo + '&eventHasGuestList=' + eventHasGuestList + '&weekdayIndex=' + weekdayIndex + '&weeksAhead=' + weeksAhead + musicStyleIdString
			}
		);
	}
	data.createEventEntryBooking = function (_eventId, _profileId, eventDate, additionalGuests, bookingType) {
		return $http(
            {
				method: 'POST', url:Config.EventsUrl + '?action=createEventEntryBooking&_eventId=' + _eventId + '&_profileId=' + _profileId + '&eventDate=' + eventDate + '&additionalGuests=' + additionalGuests + '&bookingType=' + bookingType
			}
		);
	}
    data.getEventEntryBooking = function (_entryBookingId) {
        return $http(
            {
				method: 'GET', url:Config.EventsUrl + '?action=getEventEntryBooking&_entryBookingId=' + _entryBookingId
			}
		);
    }
    data.updateEventEntryBookingByPerson = function (_entryBookingId, _eventDateId, addGuests, cancelled) {
        return $http(
            {
				method: 'POST', url:Config.EventsUrl + '?action=updateEventEntryBookingByPerson&_entryBookingId=' + _entryBookingId + '&_eventDateId=' + _eventDateId + '&addGuests=' + addGuests + '&cancelled=' + cancelled
			}
		);
    }
  	return data;
}]);

// offers
app.factory('Offers', ['$http', 'Config', function($http, Config) {
	var data = {};
    data.getOffer = function (_offerId, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.OffersUrl + '?action=getOffers&_offerId=' + _offerId + '&_profileId=' + _profileId
			}
		);
	}
	data.getOffersByTownId = function (_townId, _profileId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.OffersUrl + '?action=getOffers&timeScale='+ timeScale +'&_townId=' + _townId + '&_profileId=' + _profileId
			}
		);
	}
    data.getOffersByBusinessId = function (_businessId, _profileId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.OffersUrl + '?action=getOffers&timeScale='+ timeScale +'&_businessId=' + _businessId + '&_profileId=' + _profileId
			}
		);
	}
	data.getOffers = function (_listingId, listingType, _profileId) {
		if (listingType == 'Event') {
			return $http(
		        {
					method: 'GET', url:Config.OffersUrl + '?action=getOffers&_eventId=' + _listingId + '&_profileId=' + _profileId
				}
			);
		} else {
			return $http(
		        {
					method: 'GET', url:Config.OffersUrl + '?action=getOffers&timeScale=present&_businessId=' + _listingId + '&_profileId=' + _profileId
				}
			);
		}
		
	}
    data.createOffer = function (_businessId, _offerTypeId, _offerSubCategoryId, offerTitle, description, startDateTime, endDateTime, weeksAhead, weekdayIndex, _eventId) {
		return $http(
            {
				method: 'GET', url:Config.OffersUrl + '?action=createOffer&_businessId=' + _businessId + '&_offerTypeId=' + _offerTypeId + '&_offerSubCategoryId=' + _offerSubCategoryId + '&offerTitle=' + offerTitle + '&description=' + description + '&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime + '&weeksAhead=' + weeksAhead + '&weekdayIndex=' + weekdayIndex + '&_eventId=' + _eventId
			}
		);
	}
    data.updateOffer = function (_offerId, _businessId, _offerTypeId, _offerSubCategoryId, offerTitle, description, startDateTime, endDateTime, weeksAhead, weekdayIndex) {
		return $http(
            {
				method: 'GET', url:Config.OffersUrl + '?action=updateOffer&_offerId=' + _offerId + '&_businessId=' + _businessId + '&_offerTypeId=' + _offerTypeId + '&_offerSubCategoryId=' + _offerSubCategoryId + '&offerTitle=' + offerTitle + '&description=' + description + '&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime + '&weeksAhead=' + weeksAhead + '&weekdayIndex=' + weekdayIndex,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    
  	return data;
}]);

//listings
app.factory('Listings', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getListings = function () {
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl
			}
		);
	}
    data.getListing = function () {
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl
			}
		);
	}
    data.getRestaurantsOrTakeawaysByTownAndFoodStyle = function (_townId, _foodStyleId, businessType, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl + '?action=getRestaurantsOrTakeawaysByTownAndFoodStyle&_townId=' + _townId + '&_foodStyleId=' + _foodStyleId + '&businessType=' + businessType + '&_profileId=' + _profileId
			}
		);
	}
    data.getMoviesByTownAndMovieStyle = function (_townId, _movieStyleId, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl + '?action=getMoviesByTownAndMovieStyle&_townId=' + _townId + '&_movieStyleId=' + _movieStyleId + '&_profileId=' + _profileId
			}
		);
	}
    data.getBarsAndClubsByTown = function (_townId, _profileId) {
		return $http(
            {
				method: 'GET', url:Config.ListingsUrl + '?action=getBarsAndClubsByTown&_townId=' + _townId + '&_profileId=' + _profileId
			}
		);
	}
  	return data;
}]);

//menu items
app.factory('MenuItems', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.createMenuItemCategory = function (_businessId, catName, catDescription) {
		return $http(
            {
				method: 'POST', url:Config.MenuItemUrl + '?action=createMenuItemCategory&_businessId=' + _businessId,
                data: {'catName': catName, 'catDescription': catDescription},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
	data.getMenuItemCategories = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemCategories&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItemCategoriesForBusiness = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemCategoriesForBusiness&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItemCategoryDetailsForBusiness = function (_businessId, _menuItemCategoryId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemCategoryDetailsForBusiness&_businessId=' + _businessId + '&_menuItemCategoryId=' + _menuItemCategoryId
			}
		);
	}
    data.updateMenuItemCategoryDetailsForBusiness = function (_businessId, _menuItemCategoryId, catName, description) {
		return $http(
            {
				method: 'POST', url:Config.MenuItemUrl + '?action=updateMenuItemCategoryDetailsForBusiness&_businessId=' + _businessId,
                data: {'_menuItemCategoryId': _menuItemCategoryId, 'description': description, 'catName': catName},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}

	data.createMenuItemSubCategory = function (catName, catDescription, _businessId) {
		return $http(
            {
				method: 'POST', url:Config.MenuItemUrl + '?action=createMenuItemSubCategory&_businessId=' + _businessId,
                data: {'catDescription': catDescription, 'catName': catName},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
	data.getMenuItemSubCategories = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemSubCategories&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItemSubCategoriesForBusiness = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemSubCategoriesForBusiness&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItemSubCategoryDetailsForBusiness = function (_businessId, _menuItemSubCategoryId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemSubCategoryDetailsForBusiness&_businessId=' + _businessId + '&_menuItemSubCategoryId=' + _menuItemSubCategoryId
			}
		);
	}
    data.updateMenuItemSubCategoryDetailsForBusiness = function (_businessId, _menuItemSubCategoryId, catName, description) {
		return $http(
            {
				method: 'POST', url:Config.MenuItemUrl + '?action=updateMenuItemSubCategoryDetailsForBusiness&_businessId=' + _businessId,
                data: {'_menuItemSubCategoryId': _menuItemSubCategoryId, 'description': description, 'catName': catName},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}

    data.getMenuTemplateOptionCategories = function () {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuTemplateOptionCategories'
			}
		);
	}
    data.getAllMenuItemTemplateOptionsForBusiness = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getAllMenuItemTemplateOptionsForBusiness&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItemTemplateOption = function (_businessId, _optionId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemTemplateOption&_businessId=' + _businessId + '&_optionId=' + _optionId
			}
		);
	}
    data.getAllMenuItemTags = function () {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getAllMenuItemTags'
			}
		);
	}
    data.getMenuItemOptionsForBusiness = function (_businessId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemOptionsForBusiness&_businessId=' + _businessId
			}
		);
	}
    data.getMenuItems = function (_businessId, _menuItemCategoryId, _menuTypeId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItems&_businessId=' + _businessId + '&_menuItemCategoryId=' + _menuItemCategoryId + '&_menuTypeId=' + _menuTypeId
			}
		);
	}
    data.getMenuItem = function (_businessId, _menuItemId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItem&_businessId=' + _businessId + '&_menuItemId=' + _menuItemId
			}
		);
	}
    data.getMenuItemsExtraOptions = function (_businessId, _menuItemId) {
		return $http(
            {
				method: 'GET', url:Config.MenuItemUrl + '?action=getMenuItemsExtraOptions&_businessId=' + _businessId + '&_menuItemId=' + _menuItemId
			}
		);
	}
    data.getMenuOrdersForBusiness = function (_businessId, orderType) {
		return $http(
            {
				method: 'GET',
                url:Config.MenuItemUrl + '?action=getMenuOrdersForBusiness&_businessId=' + _businessId + '&orderType=' + orderType
			}
		);
	}
    data.getMenuOrderForBusiness = function (_orderId) {
		return $http(
            {
				method: 'GET',
                url:Config.MenuItemUrl + '?action=getMenuOrderForBusiness&_menuOrderId=' + _orderId
			}
		);
	}
    data.acceptOrRejectMenuOrder = function (_orderId, actionString) {
		return $http(
            {
				method: 'POST',
                url:Config.MenuItemUrl + '?action=' + actionString + '&_menuOrderId=' + _orderId
			}
		);
	}
    data.createMenuItem = function (_businessId, _menuTypeId, _menuItemCategoryId, _menuItemSubCategoryId, name, price, description, appliedOptions, appliedTags) {
        var newOptions = {};
        newOptions.appliedOptions = appliedOptions;
        newOptions.appliedTags = appliedTags;
        
		return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=createMenuItem&_businessId=' + _businessId + '&_menuTypeId=' + _menuTypeId + '&_menuItemCategoryId=' + _menuItemCategoryId  + '&_menuItemSubCategoryId=' + _menuItemSubCategoryId  + '&name=' + name + '&price=' + price + '&description=' + description,
                data: newOptions,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.updateMenuItemDetails = function (_businessId, _menuItemId, _menuItemCatId, _menuItemSubCatId, name, price, description, appliedOptions, appliedTags) {
        var newOptions = {};
        newOptions.appliedOptions = appliedOptions;
        newOptions.appliedTags = appliedTags;
        
		return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=updateMenuItem&_businessId=' + _businessId + '&_menuItemId=' + _menuItemId + '&_menuItemCatId=' + _menuItemCatId  + '&_menuItemSubCatId=' + _menuItemSubCatId  + '&name=' + name + '&price=' + price + '&description=' + description,
                data: newOptions,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.updateMenuItemTemplateOption = function (_businessId, optionObj, selectedCatId) {
		return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=updateMenuItemTemplateOption&_businessId=' + _businessId + '&_catId=' + selectedCatId,
                data: optionObj,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.createMenuItemTemplateOption = function (_businessId, _catId, optionObj) {
		return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=createMenuItemTemplateOption&_businessId=' + _businessId + '&_catId=' + _catId,
                data: optionObj,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.deleteMenuItemTemplateOptionOption = function (_optionId) {
        return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=deleteMenuItemTemplateOptionOption&_optionId=' + _optionId
			}
		);
    }
    data.createMenuItemTemplateOptionOption = function (_optionId, optionChoiceObject) {
        return $http(
            {
				method: 'POST',
                url: Config.MenuItemUrl + '?action=createMenuItemTemplateOptionOption&_optionId=' + _optionId,
                data: optionChoiceObject,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.createOrder = function (_profileId, _businessId, menuOrderObj) {
		return $http(
            {
				method: 'POST',
                url:Config.MenuItemUrl + '?action=createMenuOrder&_profileId=' + _profileId + '&_businessId=' + _businessId,
                data: menuOrderObj,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
  	return data;
}]);

app.factory('TableBooking', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.createTableBooking = function (_usersProfileId, _businessId, usersName, usersEmail, tableFor, dateTimeRequested) {
		return $http(
            {
				method: 'POST', url:Config.TableBookingUrl + '?action=createTableBooking&_usersProfileId=' + _usersProfileId + '&_businessId=' + _businessId + '&usersName=' + usersName + '&usersEmail=' + usersEmail + '&tableFor=' + tableFor + '&dateTimeRequested=' + dateTimeRequested
			}
		);
	}
	data.getRequestedTableBookings = function (_businessId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.TableBookingUrl + '?action=getRequestedTableBookings&timeScale=' + timeScale + '&_businessId=' + _businessId
			}
		);
	}
	data.getAcceptedTableBookings = function (_businessId, timeScale) {
		return $http(
            {
				method: 'GET', url:Config.TableBookingUrl + '?action=getAcceptedTableBookings&timeScale=' + timeScale + '&_businessId=' + _businessId
			}
		);
	}
	data.getTableBookingById = function (_tableBookingId) {
		return $http(
            {
				method: 'GET', url:Config.TableBookingUrl + '?action=getTableBookingById&_tableBookingId=' + _tableBookingId
			}
		);
	}
	data.updateTableBooking = function (_tableBookingId, accepted, rejected, completed, alternateDate) {
		return $http(
            {
				method: 'POST', url:Config.TableBookingUrl + '?action=updateTableBooking&_tableBookingId=' + _tableBookingId + '&accepted=' + accepted + '&rejected=' + rejected + '&completed=' + completed + '&alternateDate='+ alternateDate
			}
		);
	}
	data.updateTableBookingByPerson = function (_tableBookingId, accepted, rejected, cancelled, completed, alternateDate) {
		return $http(
            {
				method: 'POST', url:Config.TableBookingUrl + '?action=updateTableBookingByPerson&_tableBookingId=' + _tableBookingId + '&accepted=' + accepted + '&rejected=' + rejected + '&cancelled=' + cancelled + '&completed=' + completed + '&alternateDate='+ alternateDate
			}
		);
	}
	return data;
}]);

// taxi
app.factory('Taxi', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getTaxiCompanies = function () {
		return $http(
            {
				method: 'GET', url:Config.TaxiUrl
			}
		);
	}
    data.getTaxiBookingsForBusiness = function (mode, _businessId) {
		return $http(
            {
				method: 'GET', url:Config.TaxiUrl + '?action=getTaxiBookingsForBusiness&mode=' + mode + '&_businessId=' + _businessId
			}
		);
	}
    data.getTaxiBookingForBusiness = function (_id, _businessId) {
		return $http(
            {
				method: 'GET', url:Config.TaxiUrl + '?action=getTaxiBookingForBusiness&_id=' + _id + '&_businessId=' + _businessId
			}
		);
	}
    data.bookTaxi = function (_pickUpPlaceId, lookedUpPickUpLocation, pickUpAddressLine1, pickUpTown, pickUpPostCode, _dropOffPlaceId, lookedUpDropOffLocation, dropOffAddressLine1, dropOffTown, dropOffPostCode, totalPassengers, quickestIsRequired, relContactName, relContactEmail, _relContactId) {
        return $http(
            {
				method: 'POST', url:Config.TaxiUrl + '?action=bookTaxi&pickUpPlaceId=' + _pickUpPlaceId + '&lookedUpPickUpLocation=' + lookedUpPickUpLocation + '&pickUpAddressLine1=' + pickUpAddressLine1 + '&pickUpTown=' + pickUpTown + '&pickUpPostCode=' + pickUpPostCode + '&dropOffPlaceId=' + _dropOffPlaceId + '&lookedUpDropOffLocation=' + lookedUpDropOffLocation + '&dropOffAddressLine1=' + dropOffAddressLine1 + '&dropOffTown=' + dropOffTown + '&dropOffPostCode=' + dropOffPostCode + '&totalPassengers=' + totalPassengers + '&quickestIsRequired=' + quickestIsRequired + '&relContactName=' + relContactName + '&relContactEmail=' + relContactEmail + '&_relContactId=' + _relContactId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }
    data.respondToTaxiBooking = function (_businessId, _bookingId, lowestPrice, quickestTime) {
		return $http(
            {
				method: 'POST', url:Config.TaxiUrl + '?action=respondToTaxiBookingRequest&_businessId=' + _businessId + '&_bookingId=' + _bookingId + '&lowestPrice=' + lowestPrice + '&quickestTime=' + quickestTime,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
    data.getTaxiBookingForPerson = function (_bookingId) {
        return $http(
            {
				method: 'GET', url:Config.TaxiUrl + '?action=getTaxiBookingForPerson&_taxiBookingId=' + _bookingId
			}
		);
    }
    data.updateTaxiBookingByPerson = function (_bookingId, cancelled, completed) {
        return $http(
            {
				method: 'POST', url:Config.TaxiUrl + '?action=updateTaxiBookingByPerson&_taxiBookingId=' + _bookingId + '&cancelled=' + cancelled + '&completed=' + completed
			}
		);
    }
  	return data;
}]);

// movies
app.factory('Movies', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getMoviesForMaintenance = function (timeScale, _movieId) {
		return $http(
            {
				method: 'GET', url:Config.MovieUrl + '?action=getMoviesForMaintenance&timeScale=' + timeScale + '&_movieId=' + _movieId
			}
		);
	}
    data.getMoviesTrailerLink = function (_movieId) {
		return $http(
            {
				method: 'GET', url:Config.MovieUrl + '?action=getMoviesTrailerLink&_movieId=' + _movieId
			}
		);
	}
    data.createMovie = function (name, description, firstShowingDate, lastShowingDate, _movieStyleIds, movieTrailerLink) {
        var movieStyleIdsString = "";
		if (_movieStyleIds.length > 0) {
			for (a = 0; a < _movieStyleIds.length; a++) {
                movieStyleIdsString += '&_movieStyleIds[]=' + _movieStyleIds[a];
			}
		} else {
			movieStyleIdsString = '&_movieStyleIds[]=undefined';
		}
		return $http(
            {
				method: 'POST', url:Config.MovieUrl + '?action=createMovie' + movieStyleIdsString,
                data: {'name': name, 'description': description, 'firstShowingDate': firstShowingDate, 'lastShowingDate': lastShowingDate, 'movieTrailerLink': movieTrailerLink},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
	}
  	return data;
}]);

// image
app.factory('Images', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.uploadImage = function (formData) {
		return $.ajax(
            {
				type: 'POST', url:Config.ImageUploadUrl + '?action=uploadImage',
                data: formData, processData: false, contentType: false
			}
		);
	}
    data.uploadImageForEventCreation = function (formData) {
		return $.ajax(
            {
				type: 'POST', url:Config.ImageUploadUrl + '?action=uploadImage',
                data: formData, processData: false, contentType: false
			}
		);
	}
    data.uploadImageForOfferCreation = function (formData) {
		return $.ajax(
            {
				type: 'POST', url:Config.ImageUploadUrl + '?action=uploadImage',
                data: formData, processData: false, contentType: false
			}
		);
	}
    data.uploadImageForMovieCreation = function (formData) {
		return $.ajax(
            {
				type: 'POST', url:Config.ImageUploadUrl + '?action=uploadImage',
                data: formData, processData: false, contentType: false
			}
		);
	}
  	return data;
}]);

app.factory('myPushNotification', ['$http', 'PushNoti', function ($http, PushNoti) {
  return {
		registerPush: function(fn) {
            if (window.plugins) {
                var myPushNotification = window.plugins.pushNotification,
                successHandler = function(result) {
                     //alert('result = ' + result);
                },
                errorHandler = function(error) {
                     //alert('error = ' + error);
                };
                if (device.platform == 'android' || device.platform == 'Android') { //alert('asdasd');
                    // myPushNotification.unregister(successHandler, errorHandler);
                    myPushNotification.register(successHandler, errorHandler, {
                         'senderID': PushNoti.senderID, // **ENTER YOUR SENDER ID HERE**
                         'ecb': 'onNotificationGCM'
                    });
                }
            }
		}
  };
}]);
// push notification push to server
app.factory('SendPush',['$http', 'Config', function($http, Config) {
	var SendPush = {};
	SendPush.android = function(token) {
		return  $http({method: "post", url: 'http://www.skyafar.com/tools/push/push.php',
			data: {
				token: token,
			}
		});
	}
  	return SendPush;
}]);

//User Service to Store and get User Details
app.factory('userService', ['$rootScope', function ($rootScope) {

    var service = {

        model: {
            user: {}
        },

        SaveState: function () {
            localStorage.userService = angular.toJson(service.model);
        },

        RestoreState: function () {
            service.model = (typeof(localStorage.userService) === 'undefined') ? service.model : angular.fromJson(localStorage.userService);
            //service.model = service.model;
        }
    }

    $rootScope.$on("savestate", service.SaveState);
    $rootScope.$on("restorestate", service.RestoreState);

    return service;
}]);
