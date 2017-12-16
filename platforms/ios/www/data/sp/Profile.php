<?php

  require_once('../db-connect-headers.php');
    
  $action = ($_GET['action']);

  if ($action == "createUserEngagement" || $action == "deleteUserEngagement") {
    require_once('../db-connect-sqli.php');
  } else {
    //print($action);
  }
  
  if ($action == 'getAllUserEngagementTypes') {
    $result = mysql_query("SELECT * FROM UserEngagementType");
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  else if ($action == 'createProfile') {
  
      //Check First if that e-mail address already exists
      $email = $_GET['email'];
      $sql    = "SELECT email FROM `Profile` WHERE email == '$email';";

      $result = mysql_query($sql);
      
      if ($result == 0) {
            $data               = file_get_contents("php://input");
            $dataJsonDecode     = json_decode($data);
            
            $name = $dataJsonDecode->name;
            $displayName = $dataJsonDecode->displayName;
            $email = $dataJsonDecode->email;
            $profileType = $dataJsonDecode->profileType;
            $word = $dataJsonDecode->word;
          
          $firstName = explode(" ", $name)[0];
          $lastName = explode(" ", $name)[count(explode(" ", $name))];
          
          $result1 = mysql_query("CALL createProfileInitial('$profileType', '$word', '$displayName', '$name', '$firstName', '$lastName', '$email', @_usersId);");
          $result = mysql_query("SELECT @_usersId");
          //$value = mysql_fetch_object($result);
          //$_usersId = $value->_usersId;
          
          
          $_usersId = mysql_fetch_array($result)["@_usersId"];
            
          //header('Content-Type: application/json');
          echo json_encode($_usersId);
      }
      else {
        $result = "emailTaken";
      }
      
  }
  elseif ($action == 'createFBUserProfile') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);

    $name = $dataJsonDecode->name;
    $displayName = $dataJsonDecode->displayName;
    $email = $dataJsonDecode->email;
    $fbId = $dataJsonDecode->fbId;

    $firstName = explode(" ", $name)[0];
    $lastName = explode(" ", $name)[count(explode(" ", $name))];

    $result1 = mysql_query("CALL createFBUserProfileInitial('$fbId', '$displayName', '$name', '$firstName', '$lastName', '$email', @_usersId);");
    $result = mysql_query("SELECT @_usersId");
    //$value = mysql_fetch_object($result);
    //$_usersId = $value->_usersId;


    $_usersId = mysql_fetch_array($result)["@_usersId"];

    //header('Content-Type: application/json');
    echo json_encode($_usersId);
  }
  elseif ($action == 'makeUserActive') {
      $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
      $_oneSignalId = ($_GET['_oneSignalId'] == undefined) ? "": mysql_real_escape_string($_GET['_oneSignalId']);
      
      $result = mysql_query("CALL makeUserActive($_profileId,$_oneSignalId)");
  }
  elseif ($action == 'makeUserInactive') {
      $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
      $_oneSignalId = ($_GET['_oneSignalId'] == undefined) ? "": mysql_real_escape_string($_GET['_oneSignalId']);
      
      $result = mysql_query("CALL makeUserInactive($_profileId,$_oneSignalId)");
  }
  elseif ($action == 'getProfileItemCountForProfile') {
      $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
      
      $result = mysql_query("CALL getProfileItemCountForProfile($_profileId)");
  }
  elseif ($action == 'getAllProfileDetails') {
      $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
      
      $result = mysql_query("CALL getAllProfileDetails($_profileId)");
  }
  elseif ($action == 'getAllBusinessSettingsForBusiness') {
      $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getAllBusinessSettingsForBusiness($_businessId)");
  }
  elseif ($action == 'getAllTonightsFeedOptionsForBusiness') {
      $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getAllTonightsFeedOptionsForBusiness($_businessId)");
  }
  elseif ($action == 'updateAllProfileDetails') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_profileId = $dataJsonDecode->_profileId;
        $isBusiness = $dataJsonDecode->isBusiness;
        $displayName = $dataJsonDecode->displayName;
        $email = $dataJsonDecode->email;
        $word = $dataJsonDecode->word;
        $firstName = $dataJsonDecode->firstName;
        $lastName = $dataJsonDecode->lastName;
        $addressLine1 = $dataJsonDecode->addressLine1;
        $addressLine2 = $dataJsonDecode->addressLine2;
        $postcode = $dataJsonDecode->postcode;
        $phone1 = $dataJsonDecode->phone1;
        $businessName = $dataJsonDecode->businessName;
        $profileDescription = $dataJsonDecode->profileDescription;
      
        $result = mysql_query("CALL updateAllProfileDetails($_profileId, $isBusiness, '$displayName', '$email', '$firstName', '$lastName', '$addressLine1', '$addressLine2', '$postcode', '$phone1', '$profileDescription', '$businessName', '$word');");
        print("CALL updateAllProfileDetails($_profileId, $isBusiness, '$displayName', '$email', '$word', '$firstName', '$lastName', '$addressLine1', '$addressLine2', '$postcode', '$phone1', '$businessName', '$profileDescription');");
  }
  elseif ($action == 'updateAllBusinessSettingDetails') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_businessId = $dataJsonDecode->_businessId;
        //$isAcceptingOnlineOrders = $dataJsonDecode->isAcceptingOnlineOrders;
      
        $showTakeawayMenu = $dataJsonDecode->showTakeawayMenu;
        $isAcceptingTableBookings = $dataJsonDecode->isAcceptingTableBookings;
        $showCarteMenu = $dataJsonDecode->showCarteMenu;
        $isAcceptingTaxiBookings = $dataJsonDecode->isAcceptingTaxiBookings;
        //$isSearchable = $dataJsonDecode->isSearchable;
        $isSearchable = 1;
      
        $isAcceptingOnlineOrders = ($isAcceptingOnlineOrders == "") ? 0: $isAcceptingOnlineOrders;
        $showTakeawayMenu = ($showTakeawayMenu == "") ? 0: $showTakeawayMenu;
        $isAcceptingTableBookings = ($isAcceptingTableBookings == "") ? 0: $isAcceptingTableBookings;
        $showCarteMenu = ($showCarteMenu == "") ? 0: $showCarteMenu;
        $isAcceptingTaxiBookings = ($isAcceptingTaxiBookings == "") ? 0: $isAcceptingTaxiBookings;
      
        $result = mysql_query("CALL updateAllBusinessSettingDetails($_businessId, $isAcceptingOnlineOrders, $showTakeawayMenu, $isAcceptingTableBookings, $showCarteMenu, $isAcceptingTaxiBookings, $isSearchable);");
        print("CALL updateAllBusinessSettingDetails($_businessId, $isAcceptingOnlineOrders, $showTakeawayMenu, $isAcceptingTableBookings, $showCarteMenu, $isAcceptingTaxiBookings, $isSearchable);");
  }
  elseif ($action == 'createUserEngagement' || $action == 'deleteUserEngagement') {
    //createUserEngagement($rootScope.userEngagementTypes[a]._id, $rootScope.user._id, listing.relListingId, listing.listingType)
    $_engagementTypeId = ($_GET['_engagementTypeId']);
    $_actionedListingId = ($_GET['_actionedListingId']);
    $actionedListingTypeName = ($_GET['actionedListingTypeName']);
    $_actionerId = ($_GET['_actionerId']);
    $_profileIds = $_GET['_profileIds'];
    $profileIdString = ( $_profileIds != undefined ? implode(', ', $_profileIds) : "");

    if ($action == 'createUserEngagement') {
      //
      $result = mysqli_query($db_con, "CALL createUserEngagement('$_engagementTypeId','$_actionedListingId','$actionedListingTypeName','$_actionerId', '$profileIdString');");

      $data = file("php://input");
      print($data[0]);
      print($data[0]["file"]);
          //The error validation could be done on the javascript client side.
      $errors= array();
      foreach($data[0]["file"] as $image) {
        $file_name =  $image['name'];
        $file_size = $image['size'];
        $file_tmp = $image['tmp_name'];
        $file_type= $image['type'];   
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $extensions = array("jpeg","jpg","png");
        print($image);
        print($file_type);        
        if(in_array($file_ext,$extensions )=== false){
         $errors[]="image extension not allowed, please choose a JPEG or PNG file.";
        }
        if($file_size > 2097152){
        $errors[]='File size cannot exceed 2 MB';
        }               
        if(empty($errors)==true){
            move_uploaded_file($file_tmp,"img/".$file_name);
            echo $fname . " uploaded file: " . "img/" . $file_name;
        }else{
            print_r($errors);
        }
      }   

    }
    elseif ($action == 'deleteUserEngagement') {
      $result = mysqli_query($db_con, "CALL deleteUserEngagement('$_engagementTypeId','$_actionedListingId','$actionedListingTypeName','$_actionerId');");
    }

  }
  elseif ($action == 'checkIfDisplayNameTaken') {
      $displayName = $_GET['displayName'];
      $displayName = ($_GET['displayName'] == undefined) ? "": mysql_real_escape_string($_GET['displayName']);
      $sql    = mysql_query("SELECT COUNT(displayName) as total FROM `Profile` WHERE displayName = '$displayName'");
      $data=mysql_fetch_assoc($sql);
      print(json_encode($data));
  }
  elseif ($action == 'completeRegistration') {
    $_businessTypeIds = $_GET['_businessTypeIds'];
    $_businessTypeIdsString = implode(', ', $_businessTypeIds);
    $_foodStyleIds = $_GET['_foodStyleIds'];
    $_foodStyleIdsString = implode(', ', $_foodStyleIds);
      
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_usersId = $dataJsonDecode->_usersId;
    $profileType = $dataJsonDecode->profileType;
    $name = $dataJsonDecode->name;
    $name = str_replace("'", "\'", $name);
    $addressLine1 = $dataJsonDecode->addressLine1;
    $addressLine1 = str_replace("'", "\'", $addressLine1);
    $addressLine2 = $dataJsonDecode->addressLine2;
    $addressLine2 = str_replace("'", "\'", $addressLine2);
    $_townId = $dataJsonDecode->_townId;
    $postCode = $dataJsonDecode->postCode;
    $phone1 = $dataJsonDecode->phone1;
    $phone2 = $dataJsonDecode->phone2;
      
    $result = mysql_query("CALL createProfileFinal($_usersId, '$profileType', '$name', '$addressLine1', '$addressLine2', $_townId, '$postCode', '$phone1', '$phone2', '$_businessTypeIdsString', '$_foodStyleIdsString');");
    print("CALL createProfileFinal($_usersId, '$profileType', '$name', '$addressLine1', '$addressLine2', $_townId, '$postCode', '$phone1', '$phone2', '$_businessTypeIdsString', '$_foodStyleIdsString');");
      
    //print(json_encode($_usersId));
  }
  elseif ($action == 'logIn') {
    $email = ($_GET['email'] == undefined) ? "": mysql_real_escape_string($_GET['email']);
    $word = ($_GET['word'] == undefined) ? "": mysql_real_escape_string($_GET['word']);
    
    $result = mysql_query("CALL logIn('$email','$word');");
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  elseif ($action == 'logInThroughFb') {
    $email = ($_GET['email'] == undefined) ? "": mysql_real_escape_string($_GET['email']);
    $fbId = ($_GET['fbId'] == undefined) ? "": mysql_real_escape_string($_GET['fbId']);
    
    $result = mysql_query("CALL logInThroughFb('$email', $fbId);");
    
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  elseif ($action == 'getProfiles') {
    $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
    
    $result = mysql_query("SELECT Profile.*,
        IF(Profile.isBusiness = 0, Person._townId, Business._townid) as __actualTownId,
        IF(Profile.isBusiness = 0, Person.phone1, Business.phone1) as phone1,
        IF(Profile.isBusiness = 0, Person.phone2, Business.phone2) as phone2,
        IF(Profile.isBusiness = 0, Person.isActive, Business.isActive) as isActive,
        IF(Profile.isBusiness = 0, Person.firstName, Business.businessName) as name,
        IF(Profile.isBusiness = 0, Person.addressLine1, BusinessPlace.addressLine1) as addressLine1,
        IF(Profile.isBusiness = 0, Person.addressLine2, BusinessPlace.addressLine2) as addressLine2,
        IF(Profile.isBusiness = 0, Person.postCode, BusinessPlace.postCode) as postCode,
        IF(Profile.isBusiness = 0, NULL, BusinessType.name) as businessType,
        IF(Profile.isBusiness = 0, NULL, BusinessType._id) as _businessTypeId,
        IF(Profile.isBusiness = 0, NULL, BusinessType.showInMainSearch) as showBusinessTypeInMainSearch
        FROM `Profile`
        LEFT JOIN Business ON Business._profileId = Profile._id AND Profile.isBusiness = 1
        LEFT JOIN Person ON Person._profileId = Profile._id  AND Profile.isBusiness = 0
        LEFT JOIN BusinessPlace ON BusinessPlace._businessId = Business._id
        LEFT JOIN BusinessType ON BusinessType._id = Business._businessTypeId
        WHERE (Business.isActive = 1 OR Person.isActive = 1)
        AND (Business._townId = '$_townId' OR Person._townId = '$_townId')");
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  elseif ($action == 'getListings') {
    $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
    //print($_townId);
    if (isset($_GET['name'])) {
        $name = ($_GET['name'] == undefined) ? "": mysql_real_escape_string($_GET['name']);
        
        $result = mysql_query(
            "SELECT Profile.displayName as name,
                Business.businessName as otherName,
                Business.description as description,
                Town.name as town,
                'Business' as listingType,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 1) as listingType1,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 1, 1) as listingType2,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 2, 1) as listingType3,
                Business._id as relListingId,
                NULL as date,
                ProfilePhoto.name as currentProfilePhotoName
            FROM Business
            LEFT JOIN Profile ON Profile._id = Business._profileId
            LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
            LEFT JOIN Town ON Business._townId = Town._id
            LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = Business._id
            LEFT JOIN BusinessType ON bbt._businessTypeId = BusinessType._id
            WHERE (Business.businessName LIKE  '$name%'
            OR Business.businessName LIKE  'The $name%'
            OR Business.businessName LIKE  'A $name%'
            OR Profile.displayName LIKE  '$name%'
            OR Profile.displayName LIKE  'The $name%'
            OR Profile.displayName LIKE  'A $name%')
            AND Business._townId = '$_townId'
            GROUP BY Business._id
            UNION ALL
            SELECT Profile.displayName as name,
                Person.firstName as otherName,
                Person.description as description,
                Town.name as town,
                'Person' as listingType,
                'Person' as listingType1,
                null as listingType2,
                null as listingType3,
                Person._id as relListingId,
                NULL as date,
                ProfilePhoto.name as currentProfilePhotoName
            FROM Person
            LEFT JOIN Profile ON Profile._id = Person._profileId
            LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
            LEFT JOIN Town ON Person._townId = Town._id
            WHERE (Person.firstName LIKE  '$name%'
            OR Person.firstName LIKE  'The $name%'
            OR Person.firstName LIKE  'A $name%'
            OR Profile.displayName LIKE  '$name%'
            OR Profile.displayName LIKE  'The $name%'
            OR Profile.displayName LIKE  'A $name%')
            AND Person._townId = '$_townId'
            UNION ALL
            SELECT Event.name as name,
                Business.businessName as otherName,
                Event.description as description,
                Town.name as town,
                'Event' as listingType,
                'Event' as listingType1,
                null as listingType2,
                null as listingType3,
                Event._id as relListingId,
                Event.date as date,
                ProfilePhoto.name as currentProfilePhotoName
            FROM Event
            LEFT JOIN BusinessPlace ON BusinessPlace._id = Event._businessPlaceId
            LEFT JOIN Business ON Business._id = BusinessPlace._id
            LEFT JOIN Profile ON Profile._id = Business._profileId
            LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
            LEFT JOIN Town ON Business._townId = Town._id
            WHERE Event.name LIKE  '$name%'
            AND Business._townId ='$_townId'
            GROUP BY Event._id
            UNION ALL
            SELECT m.name as name,
                m.name as otherName,
                m.description as description,
                NULL as town,
                'Movie' as listingType,
                (SELECT ms.name FROM Movie
                LEFT JOIN MovieMovieStyle mms ON mms._movieId = Movie._id
                LEFT JOIN MovieStyle ms ON ms._id = mms._movieStyleId
                WHERE Movie._id = m._id LIMIT 1) as listingType1,
                (SELECT ms.name FROM Movie
                LEFT JOIN MovieMovieStyle mms ON mms._movieId = Movie._id
                LEFT JOIN MovieStyle ms ON ms._id = mms._movieStyleId
                WHERE Movie._id = m._id LIMIT 1, 1) as listingType2,
                (SELECT ms.name FROM Movie
                LEFT JOIN MovieMovieStyle mms ON mms._movieId = Movie._id
                LEFT JOIN MovieStyle ms ON ms._id = mms._movieStyleId
                WHERE Movie._id = m._id LIMIT 2, 1) as listingType3,
                m._id as relListingId,
                NULL as date,
                CoverPhoto.name as currentProfilePhotoName
            FROM Movie m
            LEFT JOIN MovieCinema mc ON mc._movieId = m._id
            LEFT JOIN Business ON mc._cinemaId = Business._id
            LEFT JOIN Profile ON Profile._id = Business._profileId
            LEFT JOIN CoverPhoto ON CoverPhoto._id = m._currentCoverPhotoId
            LEFT JOIN Town ON Business._townId = Town._id
            WHERE m.name LIKE  '$name%'
            OR m.name LIKE  'The $name%'
            OR m.name LIKE  'A $name%'
            AND Business._townId ='$_townId'
            GROUP BY m._id");
    }
    elseif (isset($_GET['_businessTypeId'])) {
        $_businessTypeId = ($_GET['_businessTypeId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessTypeId']);
        
        $result = mysql_query(
            "SELECT Profile.displayName as name,
                Business.description as description,
                Town.name as town,
                'Business' as listingType,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 1) as listingType1,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 1, 1) as listingType2,
                (SELECT bt.name FROM Business b
                LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id
                LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId
                WHERE b._id = Business._id LIMIT 2, 1) as listingType3,
                Business._id as relListingId,
                Business.isFeatured as isFeatured,
                NULL as date,
                ProfilePhoto.name as currentProfilePhotoName,
                CoverPhoto.name as currentCoverPhotoName
            FROM Business
            LEFT JOIN Profile ON Profile._id = Business._profileId
            LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
            LEFT JOIN Town ON Business._townId = Town._id
            LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = Business._id
            LEFT JOIN BusinessType ON bbt._businessTypeId = BusinessType._id
            LEFT JOIN CoverPhoto ON CoverPhoto._id = Profile._currentCoverPhotoId
            WHERE BusinessType._id =  '$_businessTypeId'
            AND Business._townId = '$_townId'
            GROUP BY Business._id");
    }
    elseif (isset($_GET['_listingId'])) {
        $listingType = ($_GET['listingType'] == undefined) ? "": mysql_real_escape_string($_GET['listingType']);
        $_listingId = ($_GET['_listingId'] == undefined) ? "": mysql_real_escape_string($_GET['_listingId']);
        $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
        
        $result1 = mysql_query("CALL updateAnalyticsListingView('$_listingId','$listingType');");
        
        if ($listingType != 'Person' && $listingType != 'Event' && $listingType != 'Movie') {
            //If its not a Person or an Event it's a Business
            $result = mysql_query("CALL getAllBusinessListingDetailsById($_listingId, $_profileId);");
        } elseif ($listingType == 'Person') {
            $result = mysql_query(
                "SELECT Profile.displayName as name,
                    Person.description as description,
                    Town.name as town,
                    'Person' as listingType,
                    'Person' as listingType1,
                    Person._id as relListingId,
                    NULL as isFeatured,
                    NULL as date,
                    CoverPhoto.name as currentCoverPhotoName,
                    ProfilePhoto.name as currentProfilePhotoName,
                    Profile._id as _profileId,
                    uef._typeId as 'follow',
                    uefo._typeId as 'following'
                FROM Person
                LEFT JOIN Profile ON Profile._id = Person._profileId
                LEFT JOIN CoverPhoto ON CoverPhoto._id = Profile._currentCoverPhotoId
                LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
                LEFT JOIN Town ON Person._townId = Town._id
                LEFT JOIN UserEngagement uef 
                    ON uef._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Person')
                    AND uef._actionedListingId = Person._profileId
                    AND uef._actionerProfileId = $_profileId
                    AND uef._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Follow' LIMIT 1)
                LEFT JOIN UserEngagement uefo 
                    ON uefo._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Person')
                    AND uefo._actionedListingId = $_profileId
                    AND uefo._actionerProfileId = Person._profileId
                    AND uefo._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Follow' LIMIT 1)
                WHERE Person._id = $_listingId
                LIMIT 1");
        } elseif ($listingType == 'Event') {
            $result = mysql_query("CALL getAllEventListingDetailsById($_listingId, $_profileId)");
        } elseif ($listingType == 'Movie') {
            $result = mysql_query("CALL getAllMovieListingDetailsById($_listingId, $_profileId)");
        }
    }
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;  
      echo json_encode($output);
  }
  elseif ($action == 'getAllOpenBusinessAccountsByTown') {
    $_businessTypeId = ($_GET['_businessTypeId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessTypeId']);
    $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
    
    $result = mysql_query("CALL getAllOpenBusinessAccountsByTown($_townId, $_businessTypeId)");
  }
  elseif ($action == 'getAllFollowersByName') {
    $nameSearched = ($_GET['nameSearched'] == undefined) ? "": mysql_real_escape_string($_GET['nameSearched']);
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
        
    $result = mysql_query("CALL getAllFollowersByName('$_profileId', '$nameSearched')");
  }
  elseif ($action == 'getAllBusinessesByName') {
    $nameSearched = ($_GET['nameSearched'] == undefined) ? "": mysql_real_escape_string($_GET['nameSearched']);
    $business1Type = ($_GET['business1Type'] == undefined) ? "": mysql_real_escape_string($_GET['business1Type']);
    $business2Type = ($_GET['business2Type'] == undefined) ? "": mysql_real_escape_string($_GET['business2Type']);
        
    $result = mysql_query("CALL getAllBusinessesByName('$nameSearched', '$business1Type', '$business2Type')");
  }
  elseif ($action == 'getWatchedListingsForProfile'
    || $action == 'getFollowedListingsForProfile'
    || $action == 'getFollowingProfilesForProfile'
    || $action == 'getLikedListingsForProfile') {
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
    if ($action == 'getWatchedListingsForProfile') {
      $result = mysql_query("CALL getWatchedListingsForProfile('$_profileId')");
    }
    elseif ($action == 'getFollowedListingsForProfile') {
      $result = mysql_query("CALL getFollowedListingsForProfile('$_profileId')");
    }
    elseif ($action == 'getFollowingProfilesForProfile') {
      $result = mysql_query("CALL getFollowingProfilesForProfile('$_profileId')");
    }
    elseif ($action == 'getLikedListingsForProfile') {
      $result = mysql_query("CALL getLikedListingsForProfile('$_profileId')");
    }

  }
  elseif ($action == 'getFollowerProfileIdsForBusiness') {
    $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
    $result = mysql_query("CALL getFollowerProfileIdsForBusiness('$_businessId')");
  }
  elseif ($action == 'getPhotoAlbumsSummaryForProfile') {
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
    $result = mysql_query("CALL getPhotoAlbumsSummaryForProfile('$_profileId')");

  }
  elseif ($action == 'getPhotoAlbumsSummaryForListing') {
    $_listingId = ($_GET['_listingId'] == undefined) ? "": mysql_real_escape_string($_GET['_listingId']);
    $listingType = ($_GET['listingType'] == undefined) ? "": mysql_real_escape_string($_GET['listingType']);
    $result = mysql_query("CALL getPhotoAlbumsSummaryForListing('$_listingId','$listingType')");
  }
  elseif ($action == 'getSpecificAlbumSummaryForListing') {
    $_listingId = ($_GET['_listingId'] == undefined) ? "": mysql_real_escape_string($_GET['_listingId']);
    $listingType = ($_GET['listingType'] == undefined) ? "": mysql_real_escape_string($_GET['listingType']);
    $albumType = ($_GET['albumType'] == undefined) ? "": mysql_real_escape_string($_GET['albumType']);
    //print($albumType);
    if ($albumType == 'Cover Photo') {
      $result = mysql_query("CALL getCoverPhotoAlbumSummaryForListing('$_listingId', '$listingType')");
      //print("CALL getCoverPhotoAlbumSummaryForListing('$_listingId', '$listingType')");
    } else if ($albumType == 'Profile Photo') {
      $result = mysql_query("CALL getProfilePhotoAlbumSummaryForProfile('$_listingId')");
    } else {
      $_albumId = ($_GET['_albumId'] == undefined) ? "": mysql_real_escape_string($_GET['_albumId']);
      $result = mysql_query("CALL getGeneralPhotoAlbumSummaryForProfile('$_listingId', '$_albumId')");
    }
  }
  elseif ($action == 'getMyNyteActivityForPerson') {
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
    $timeScale = ($_GET['timeScale'] == undefined) ? "": mysql_real_escape_string($_GET['timeScale']);

    $result = mysql_query("CALL getMyNyteActivityForPerson('$_profileId', '$timeScale')");
  }
  //print(json_encode($_usersId));

  if ($action == 'getAllProfileDetails'
    || $action == 'getAllBusinessesByName'
    || $action == 'getAllOpenBusinessAccountsByTown'
    || $action == 'getAllFollowersByName'
    || $action == 'getFollowerProfileIdsForBusiness'
    || $action == 'getSpecificAlbumSummaryForListing'
    || $action == 'getPhotoAlbumsSummaryForListing'
    || $action == 'getPhotoAlbumsSummaryForProfile'
    || $action == 'getWatchedListingsForProfile'
    || $action == 'getFollowedListingsForProfile'
    || $action == 'getFollowingProfilesForProfile'
    || $action == 'getLikedListingsForProfile'
    || $action == 'getMyNyteActivityForPerson'
    || $action == 'updateAllProfileDetails'
    || $action == 'getAllBusinessSettingsForBusiness'
    || $action == 'getAllTonightsFeedOptionsForBusiness'
    || $action == 'getProfileItemCountForProfile') {
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;  
      echo json_encode($output);
  }

  if ($action == "createUserEngagement" || $action == "deleteUserEngagement") {
    mysqli_close($db_con);
  }
  mysql_close();
?>
