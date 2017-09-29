<?php

  require_once('../db-connect-headers.php');
    
  $action = $_GET['action'];

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
      $sql    = "SELECT email FROM `Profile` WHERE email = '$email';";
      $result = mysql_query($sql);

      if ($email == null) {
        echo json_encode("noEmailGiven");
      }
      else if (mysql_num_rows($result)==0) {
            $data               = file_get_contents("php://input");
            $dataJsonDecode     = json_decode($data);
            
            $name = $dataJsonDecode->name;
            $displayName = $dataJsonDecode->displayName;
            $email = $dataJsonDecode->email;
            $profileType = $dataJsonDecode->profileType;
            $word = $dataJsonDecode->word;
            $wordLength = strlen($word);
          
            $sql2 = "SELECT displayName FROM `Profile` WHERE displayName = '$displayName';";
            $result2 = mysql_query($sql2);
          
            if (mysql_num_rows($result2)==0) {
                //Hash the pword
                // A higher "cost" is more secure but consumes more processing power
                $cost = 10;

                // Create a random salt
                $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');

                // Prefix information about the hash so PHP knows how to verify it later.
                // "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
                $salt = sprintf("$2a$%02d$", $cost) . $salt;

                // Value:
                // $2a$10$eImiTXuWVxfM37uY4JANjQ==

                // Hash the password with the salt
                $hash = crypt($word, $salt);
          
                //need new way to get 
                $firstName = explode(" ", $name);
                $firstName = $firstName[0];
                //need new way to get 
                $lastName = explode(" ", $name);
                $lastName = $lastName[count(explode(" ", $name))-1];

                $result1 = mysql_query("CALL createProfileInitial('$profileType', '$hash', '$displayName', '$name', '$firstName', '$lastName', '$email', @_usersId, '$wordLength');");

                $result = mysql_query("SELECT @_usersId as _usersId");

                // new way to get Users Id
                $_usersId = mysql_fetch_object($result);
                $_usersId = $_usersId -> _usersId;

                echo json_encode($_usersId);
                //echo json_encodeint("CALL createProfileInitial('$profileType', '$hash', '$displayName', '$name', '$firstName', '$lastName', '$email', @_usersId, '$wordLength');");
            } else {
                echo json_encode("displayNameTaken");
            }
      }
      else {
        echo json_encode("emailTaken");
      }
      
  }
  elseif ($action == 'createFBUserProfile') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);

    $name = $dataJsonDecode->name;
    $displayName = $dataJsonDecode->displayName;
    $email = $dataJsonDecode->email;
    $fbId = $dataJsonDecode->fbId;

    //need new way to get 
    $firstName = explode(" ", $name);
    $firstName = $firstName[0];
    //need new way to get 
    $lastName = explode(" ", $name);
    $lastName = $lastName[count(explode(" ", $name)) - 1];

    $result1 = mysql_query("CALL createFBUserProfileInitial('$fbId', '$displayName', '$name', '$firstName', '$lastName', '$email', @_usersId);");
    $result = mysql_query("SELECT @_usersId as _usersId");

    //need new way to get Users Id $_usersId = mysql_fetch_array($result)["@_usersId"];
    $_usersId = mysql_fetch_object($result);
    $_usersId = $_usersId -> _usersId;

    //header('Content-Type: application/json');
    echo json_encode($_usersId);
  }
  elseif ($action == 'makeUserActive') {
      $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
      $_oneSignalId = (empty($_GET['_oneSignalId'])) ? "": mysql_real_escape_string($_GET['_oneSignalId']);
      
      $result = mysql_query("CALL makeUserActive($_profileId,$_oneSignalId)");
  }
  elseif ($action == 'makeUserInactive') {
      $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
      $_oneSignalId = (empty($_GET['_oneSignalId'])) ? "": mysql_real_escape_string($_GET['_oneSignalId']);
      
      $result = mysql_query("CALL makeUserInactive($_profileId,$_oneSignalId)");
  }
  else if ($action == 'checkHowManyEmailInvitesSent') {
      $senderEmail = ($_POST['senderEmail']) ? $_POST['senderEmail']: $_REQUEST['senderEmail'];
      
      $result1 = mysql_query("CALL checkHowManyEmailInvitesSent('$senderEmail', @emailSentCount);");
      $result = mysql_query("SELECT @emailSentCount as emailSentCount");

      // new way to get Users Id
      $emailSentCount = mysql_fetch_object($result);
      $emailSentCount = $emailSentCount -> emailSentCount;
      //echo json_encode("CALL checkHowManyEmailInvitesSent('$senderEmail', @emailSentCount);");
      echo json_encode($emailSentCount);
  }
  elseif ($action == 'getProfileItemCountForProfile') {
      $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
      
      $result = mysql_query("CALL getProfileItemCountForProfile($_profileId)");
  }
  elseif ($action == 'getAllProfileDetails') {
      $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
      
      $result = mysql_query("CALL getAllProfileDetails($_profileId)");
      
  }
  elseif ($action == 'getAllBusinessSettingsForBusiness') {
      $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getAllBusinessSettingsForBusiness($_businessId)");
  }
  elseif ($action == 'getBusinessTypesForBusiness') {
      $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getBusinessTypesForBusiness($_businessId)");
  }
  elseif ($action == 'getFoodStylesForBusiness') {
      $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getFoodStylesForBusiness($_businessId)");
  }
  elseif ($action == 'getBusinessOpeningTimesForBusiness') {
      $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getBusinessOpeningTimesForBusiness($_businessId)");
  }
  elseif ($action == 'getAllTonightsFeedOptionsForBusiness') {
      $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
      
      $result = mysql_query("CALL getAllTonightsFeedOptionsForBusiness($_businessId)");
  }
  elseif ($action == 'getMyNyteExternalContacts') {
      $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

        $format = $dataJsonDecode->format;
        $_profileId = $dataJsonDecode->_profileId;
      
      $result = mysql_query("CALL getMyNyteExternalContacts($_profileId, '$format')");
  }
  elseif ($action == 'getTimeSheetToFill') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_profileId = $dataJsonDecode->_profileId;
        $relDate = $dataJsonDecode->relDate;
        $relDate = (isset($relDate)) ? "'".$relDate."'": 'NULL';
      echo "CALL getTimeSheetToFill($_profileId, $relDate)";
        $result = mysql_query("CALL getTimeSheetToFill($_profileId, $relDate)");
      
  }
  elseif ($action == 'updateAllProfileDetails') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_profileId = $dataJsonDecode->_profileId;
        $isBusiness = $dataJsonDecode->isBusiness;
        $displayName = $dataJsonDecode->displayName;
        $email = $dataJsonDecode->email;
        $firstName = $dataJsonDecode->firstName;
        $lastName = $dataJsonDecode->lastName;
        $addressLine1 = $dataJsonDecode->addressLine1;
        $addressLine1 = str_replace("'", "\'", $addressLine1);
        $addressLine2 = $dataJsonDecode->addressLine2;
        $addressLine2 = str_replace("'", "\'", $addressLine2);
        $postcode = $dataJsonDecode->postcode;
        $phone1 = $dataJsonDecode->phone1;
        $businessName = $dataJsonDecode->businessName;
        $businessName = str_replace("'", "\'", $businessName);
        $profileDescription = $dataJsonDecode->profileDescription;
        $profileDescription = str_replace("'", "\'", $profileDescription);
      
        $result = mysql_query("CALL updateAllProfileDetails($_profileId, $isBusiness, '$displayName', '$email', '$firstName', '$lastName', '$addressLine1', '$addressLine2', '$postcode', '$phone1', '$profileDescription', '$businessName');");
        //print("CALL updateAllProfileDetails($_profileId, $isBusiness, '$displayName', '$email', '$firstName', '$lastName', '$addressLine1', '$addressLine2', '$postcode', '$phone1', '$profileDescription', '$businessName', '$hash', '$wordLength');");
  }
  elseif ($action == 'updateUsersDefaultPhoto') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_profileId = $dataJsonDecode-> _profileId;
        $_photoId = $dataJsonDecode-> _photoId;
        $photoType = $dataJsonDecode-> photoType;
      
        $result = mysql_query("CALL updateUsersDefaultPhoto($_profileId, $_photoId, '$photoType');");
        //print("CALL updateUsersDefaultPhoto($_profileId, $_photoId, '$photoType');");
  }
  elseif ($action == 'updateProfilePasswordDetails') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_profileId = $dataJsonDecode->_profileId;
        $word = $dataJsonDecode->word;
        $resetCode = $dataJsonDecode->resetCode;
        $withResetCode = $dataJsonDecode->withResetCode;
        $wordLength = strlen($word);
      
        //Hash the pword
        // A higher "cost" is more secure but consumes more processing power
        $cost = 10;

        // Create a random salt
        $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');

        // Prefix information about the hash so PHP knows how to verify it later.
        // "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
        $salt = sprintf("$2a$%02d$", $cost) . $salt;

        // Value:
        // $2a$10$eImiTXuWVxfM37uY4JANjQ==

        // Hash the password with the salt
        $hash = crypt($word, $salt);
      
        $result = mysql_query("CALL updateProfilePasswordDetails('$hash', $_profileId, '$wordLength', $withResetCode, '$resetCode');");
      
        //echo json_encode("CALL updateProfilePasswordDetails('$hash', $_profileId, '$wordLength');");
  }
  elseif ($action == 'updateAllBusinessSettingDetails') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_businessId = $dataJsonDecode->_businessId;
        $isAcceptingOnlineOrders = $dataJsonDecode->isAcceptingOnlineOrders;
        $showTakeawayMenu = $dataJsonDecode->showTakeawayMenu;
        $isAcceptingTableBookings = $dataJsonDecode->isAcceptingTableBookings;
        $showCarteMenu = $dataJsonDecode->showCarteMenu;
        $maxTableBookingGuests = $dataJsonDecode->maxTableBookingGuests;
        $isAcceptingTaxiBookings = $dataJsonDecode->isAcceptingTaxiBookings;
        $isAcceptingEnquiries = $dataJsonDecode->isAcceptingEnquiries;
        $_tonightsFeedButtonOptionId = $dataJsonDecode->_tonightsFeedButtonOptionId;
        //$isSearchable = $dataJsonDecode->isSearchable;
        $isSearchable = 1;
      
        $result = mysql_query("CALL updateAllBusinessSettingDetails($_businessId, $isAcceptingOnlineOrders, $showTakeawayMenu, $isAcceptingTableBookings, $showCarteMenu, $maxTableBookingGuests, $isAcceptingTaxiBookings, $isSearchable, $isAcceptingEnquiries, $_tonightsFeedButtonOptionId);");
        //echo json_encode("CALL updateAllBusinessSettingDetails($_businessId, $isAcceptingOnlineOrders, $showTakeawayMenu, $isAcceptingTableBookings, $showCarteMenu, $maxTableBookingGuests, $isAcceptingTaxiBookings, $isSearchable, $isAcceptingEnquiries, $_tonightsFeedButtonOptionId);");
  }
  elseif ($action == 'updateBusinessTypesForBusiness') {
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $_businessTypeIds = $_GET['_businessTypeIds'];
    $businessTypeIdString = ( $_businessTypeIds != undefined ? implode(', ', $_businessTypeIds) : "");
    $_foodStyleIds = $_GET['_foodStyleIds'];
    $foodStyleIdString = ( $foodStyleIdString != undefined ? implode(', ', $_foodStyleIds) : "");
    
    $result = mysql_query("CALL updateBusinessTypesForBusiness($_businessId, '$businessTypeIdString', '$foodStyleIdString');");
  }
  elseif ($action == 'updateOrInsertBusinessOpeningTimesForBusiness') {
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $mondayOpeningTime = ($_GET['mondayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['mondayOpeningTime'])."'";
    $tuesdayOpeningTime = ($_GET['tuesdayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['tuesdayOpeningTime'])."'";
    $wednesdayOpeningTime = ($_GET['wednesdayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['wednesdayOpeningTime'])."'";
    $thursdayOpeningTime = ($_GET['thursdayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['thursdayOpeningTime'])."'";
    $fridayOpeningTime = ($_GET['fridayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['fridayOpeningTime'])."'";
    $saturdayOpeningTime = ($_GET['saturdayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['saturdayOpeningTime'])."'";
    $sundayOpeningTime = ($_GET['sundayOpeningTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['sundayOpeningTime'])."'";
    $mondayClosingTime = ($_GET['mondayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['mondayClosingTime'])."'";
    $tuesdayClosingTime = ($_GET['tuesdayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['tuesdayClosingTime'])."'";
    $wednesdayClosingTime = ($_GET['wednesdayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['wednesdayClosingTime'])."'";
    $thursdayClosingTime = ($_GET['thursdayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['thursdayClosingTime'])."'";
    $fridayClosingTime = ($_GET['fridayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['fridayClosingTime'])."'";
    $saturdayClosingTime = ($_GET['saturdayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['saturdayClosingTime'])."'";
    $sundayClosingTime = ($_GET['sundayClosingTime'] == 'null') ? 'NULL': "'".mysql_real_escape_string($_GET['sundayClosingTime'])."'";
    
    $result = mysql_query("CALL updateOrInsertBusinessOpeningTimesForBusiness($_businessId, $mondayOpeningTime, $mondayClosingTime, $tuesdayOpeningTime, $tuesdayClosingTime, $wednesdayOpeningTime, $wednesdayClosingTime, $thursdayOpeningTime, $thursdayClosingTime, $fridayOpeningTime, $fridayClosingTime, $saturdayOpeningTime, $saturdayClosingTime, $sundayOpeningTime, $sundayClosingTime);");
    
  }
  elseif ($action == 'createUserEngagement' || $action == 'deleteUserEngagement') {
    //createUserEngagement($rootScope.userEngagementTypes[a]._id, $rootScope.user._id, listing.relListingId, listing.listingType)
    $_engagementTypeId = $_GET['_engagementTypeId'];
    $_actionedListingId = $_GET['_actionedListingId'];
    $actionedListingTypeName = $_GET['actionedListingTypeName'];
    $_actionerId = $_GET['_actionerId'];
    $_profileIds = $_GET['_profileIds'];
    $profileIdString = ( $_profileIds != undefined ? implode(', ', $_profileIds) : "");

    if ($action == 'createUserEngagement') {
      //
      $result = mysqli_query($db_con, "CALL createUserEngagement('$_engagementTypeId','$_actionedListingId','$actionedListingTypeName','$_actionerId', '$profileIdString');");

      $data = file("php://input");
      //print($data[0]);
      //print($data[0]["file"]);
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
  elseif ($action == 'removeImage') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);

    $_profileId = $dataJsonDecode-> _profileId;
    $_photoId = $dataJsonDecode-> _photoId;
    $photoType = $dataJsonDecode-> photoType;
    $photoName = $dataJsonDecode-> photoName;

    $uploadDir = $_SERVER['DOCUMENT_ROOT']."/sneak-preview/img/user_images/";

    if ($photoType == 'Profile Photo') {
        $uploadDir .= "profile_photo/";
    }
    else if ($photoType == 'Cover Photo') {
        $uploadDir .= "cover_photo/";
    }
    
    if (file_exists($uploadDir.$photoName)) {
        $unlink = unlink($uploadDir.$photoName);
    } else {
        $unlink = true;
    }
    
    if ($unlink && $photoType == 'Cover Photo') {
        if (file_exists($uploadDir."thumbnail/".$photoName)) {
            $unlink = unlink($uploadDir."thumbnail/".$photoName);
        }
        
        $result = mysql_query("CALL deleteUsersImage($_profileId, $_photoId, '$photoType', '$photoName');");
        print(json_encode("Photo successfully deleted"));
    }
    else if ($unlink && $photoType != 'Cover Photo') {
        $result = mysql_query("CALL deleteUsersImage($_profileId, $_photoId, '$photoType', '$photoName');");
        print(json_encode("Photo successfully deleted"));
    } else {
        print(json_encode("Could not delete Photo"));
    }
  }
  elseif ($action == 'checkIfDisplayNameTaken') {
      $displayName = $_GET['displayName'];
      $displayName = (empty($_GET['displayName'])) ? "": mysql_real_escape_string($_GET['displayName']);
      $sql    = mysql_query("SELECT COUNT(displayName) as total FROM `Profile` WHERE displayName = '$displayName'");
      $data=mysql_fetch_assoc($sql);
      print(json_encode($data));
  }
  elseif ($action == 'checkIfEmailTaken') {
      $email = $_GET['email'];
      $sql    = mysql_query("SELECT COUNT(email) as total FROM `Profile` WHERE email = '$email'");
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
      
    echo json_encode($_usersId);
  }
  elseif ($action == 'logIn') {
    $email = (empty($_GET['email'])) ? "": mysql_real_escape_string($_GET['email']);
    $word = (empty($_GET['word'])) ? "": mysql_real_escape_string($_GET['word']);
    
    $preResult = mysql_query("SELECT word FROM Profile WHERE email = '$email' LIMIT 1");
    //new way to get hash 
    $hash = mysql_fetch_object($preResult);
    $hash = $hash -> word;
    
    // Hashing the password with its hash as the salt returns the same hash
    if ( hash_equals($hash, crypt($word, $hash)) ) {
      // Ok!
      $result = mysql_query("CALL logIn('$email','$hash');");
        //print(json_encode($_usersId));
        while($row = mysql_fetch_assoc($result))
            $output[] = $row;
            
          //header('Content-Type: application/json');
          echo json_encode($output);
    } else {
        header('Content-Type: application/json');
        echo json_encode($preResult);
    }
  }
  elseif ($action == 'logInThroughFb') {
    $email = (empty($_GET['email'])) ? "": mysql_real_escape_string($_GET['email']);
    $fbId = (empty($_GET['fbId'])) ? "": mysql_real_escape_string($_GET['fbId']);
    
    $result = mysql_query("CALL logInThroughFb('$email', $fbId);");
    
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  elseif ($action == 'getProfiles') {
    $_townId = (empty($_GET['_townId'])) ? "": mysql_real_escape_string($_GET['_townId']);
    
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
        AND (Business._townId = '$_townId' OR Person._townId = '$_townId')
		AND Profile.isHidden = 0");
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  elseif ($action == 'getListings') {
    $_townId = (empty($_GET['_townId'])) ? "": mysql_real_escape_string($_GET['_townId']);
    //print($_townId);
    if (isset($_GET['name'])) {
        $name = (empty($_GET['name'])) ? "": mysql_real_escape_string($_GET['name']);
        
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
                IF(ProfilePhoto.name IS NULL, 'default.jpg', ProfilePhoto.name) as currentProfilePhotoName
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
			AND Profile.isHidden = 0
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
                IF(ProfilePhoto.name IS NULL, 'default-person.jpg', ProfilePhoto.name) as currentProfilePhotoName
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
                IF(CoverPhoto.name IS NULL, 'default.jpg', CoverPhoto.name) as currentProfilePhotoName
            FROM Event
            LEFT JOIN BusinessPlace ON BusinessPlace._id = Event._businessPlaceId
            LEFT JOIN Business ON Business._id = BusinessPlace._id
            LEFT JOIN Profile ON Profile._id = Business._profileId
            LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId
            LEFT JOIN CoverPhoto ON CoverPhoto._id = Event._currentCoverPhotoId
            LEFT JOIN Town ON Business._townId = Town._id
            WHERE Event.name LIKE  '$name%'
            AND Business._townId ='$_townId'
			AND Profile.isHidden = 0
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
                IF(CoverPhoto.name IS NULL, 'default.jpg', CoverPhoto.name) as currentProfilePhotoName
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
			AND Profile.isHidden = 0
            GROUP BY m._id");
    }
    elseif (isset($_GET['_businessTypeId'])) {
        $_businessTypeId = (empty($_GET['_businessTypeId'])) ? "": mysql_real_escape_string($_GET['_businessTypeId']);
        $_profileId = (empty($_GET['_profileId'])) ? "0": mysql_real_escape_string($_GET['_profileId']);
        
        $result = mysql_query("CALL getListingsByBusinessType('$_businessTypeId','$_townId','$_profileId')");
    }
    elseif (isset($_GET['_listingId'])) {
        $listingType = (empty($_GET['listingType'])) ? "": mysql_real_escape_string($_GET['listingType']);
        $_listingId = (empty($_GET['_listingId'])) ? "": mysql_real_escape_string($_GET['_listingId']);
        $_profileId = (empty($_GET['_profileId'])) ? "0": mysql_real_escape_string($_GET['_profileId']);
        
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
                    IF(CoverPhoto.name IS NULL, 'default.jpg', CoverPhoto.name) as currentCoverPhotoName,
                    IF(ProfilePhoto.name IS NULL, 'default-person.jpg', ProfilePhoto.name) as currentProfilePhotoName,
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
    $_businessTypeId = (empty($_GET['_businessTypeId'])) ? "": mysql_real_escape_string($_GET['_businessTypeId']);
    $_townId = (empty($_GET['_townId'])) ? "": mysql_real_escape_string($_GET['_townId']);
    
    $result = mysql_query("CALL getAllOpenBusinessAccountsByTown($_townId, $_businessTypeId)");
  }
  elseif ($action == 'getAllFollowersByName') {
    $nameSearched = (empty($_GET['nameSearched'])) ? "": mysql_real_escape_string($_GET['nameSearched']);
    $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        
    $result = mysql_query("CALL getAllFollowersByName('$_profileId', '$nameSearched')");
  }
  elseif ($action == 'getAllBusinessesByName') {
    $nameSearched = (empty($_GET['nameSearched'])) ? "": mysql_real_escape_string($_GET['nameSearched']);
    $business1Type = (empty($_GET['business1Type'])) ? "": mysql_real_escape_string($_GET['business1Type']);
    $business2Type = (empty($_GET['business2Type'])) ? "": mysql_real_escape_string($_GET['business2Type']);
        
    $result = mysql_query("CALL getAllBusinessesByName('$nameSearched', '$business1Type', '$business2Type')");
  }
  elseif ($action == 'getWatchedListingsForProfile'
    || $action == 'getFollowedListingsForProfile'
    || $action == 'getFollowingProfilesForProfile'
    || $action == 'getLikedListingsForProfile') {
    $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
    if ($action == 'getWatchedListingsForProfile') {
      $timeScale = $_GET['timeScale'];
      $result = mysql_query("CALL getWatchedListingsForProfile('$_profileId', '$timeScale')");
    }
    elseif ($action == 'getFollowedListingsForProfile') {
      $result = mysql_query("CALL getFollowedListingsForProfile('$_profileId')");
    }
    elseif ($action == 'getFollowingProfilesForProfile') {
      $result = mysql_query("CALL getFollowingProfilesForProfile('$_profileId')");
    }
    elseif ($action == 'getLikedListingsForProfile') {
      $timeScale = $_GET['timeScale'];
      $result = mysql_query("CALL getLikedListingsForProfile('$_profileId', '$timeScale')");
    }

  }
  elseif ($action == 'getFollowerProfileIdsForBusiness') {
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $result = mysql_query("CALL getFollowerProfileIdsForBusiness('$_businessId')");
  }
  elseif ($action == 'getPhotoAlbumsSummaryForProfile') {
    $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
    $result = mysql_query("CALL getPhotoAlbumsSummaryForProfile('$_profileId')");

  }
  elseif ($action == 'getPhotoAlbumsSummaryForListing') {
    $_listingId = (empty($_GET['_listingId'])) ? "": mysql_real_escape_string($_GET['_listingId']);
    $listingType = (empty($_GET['listingType'])) ? "": mysql_real_escape_string($_GET['listingType']);
    $result = mysql_query("CALL getPhotoAlbumsSummaryForListing('$_listingId','$listingType')");
  }
  elseif ($action == 'getSpecificAlbumSummaryForListing') {
    $_listingId = (empty($_GET['_listingId'])) ? "": mysql_real_escape_string($_GET['_listingId']);
    $listingType = (empty($_GET['listingType'])) ? "": mysql_real_escape_string($_GET['listingType']);
    $albumType = (empty($_GET['albumType'])) ? "": mysql_real_escape_string($_GET['albumType']);
    //print($albumType);
    if ($albumType == 'Cover Photo') {
      $result = mysql_query("CALL getCoverPhotoAlbumSummaryForListing('$_listingId', '$listingType')");
      //print("CALL getCoverPhotoAlbumSummaryForListing('$_listingId', '$listingType')");
    } else if ($albumType == 'Profile Photo') {
      $result = mysql_query("CALL getProfilePhotoAlbumSummaryForProfile('$_listingId')");
    } else {
      $_albumId = (empty($_GET['_albumId'])) ? "": mysql_real_escape_string($_GET['_albumId']);
      $result = mysql_query("CALL getGeneralPhotoAlbumSummaryForProfile('$_listingId', '$_albumId')");
    }
  }
  elseif ($action == 'getMyNyteActivityForPerson') {
    $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
    $timeScale = (empty($_GET['timeScale'])) ? "": mysql_real_escape_string($_GET['timeScale']);

    $result = mysql_query("CALL getMyNyteActivityForPerson('$_profileId', '$timeScale')");
  }
  elseif ($action == 'createResetCodeForProfileEmail') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $email = $dataJsonDecode-> email;
    
    $result = mysql_query("SELECT email, isBusiness, _id FROM Profile WHERE email = '$email'");
    
    if (mysql_num_rows($result)==1) {
        function crypto_rand_secure($min, $max) {
            $range = $max - $min;
            if ($range < 0) return $min; // not so random...
            $log = log($range, 2);
            $bytes = (int) ($log / 8) + 1; // length in bytes
            $bits = (int) $log + 1; // length in bits
            $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
            do {
                $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
                $rnd = $rnd & $filter; // discard irrelevant bits
            } while ($rnd >= $range);
            return $min + $rnd;
        }

        function getToken($length=32){
            $hash = "";
            $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
            $codeAlphabet.= "0123456789";
            for($i=0;$i<$length;$i++){
                $hash .= $codeAlphabet[crypto_rand_secure(0,strlen($codeAlphabet))];
            }
            return $hash;
        }

        // Hash the password with the salt
        $hash = getToken();
        
        $result2 = mysql_query("INSERT INTO ProfileResetCode(_profileId, code, dateTimeCreated) VALUES ((SELECT _id FROM Profile WHERE email = '$email'), '$hash', NOW());");
        if ($result2) {
            //get users name
            $firstResult = mysql_fetch_array($result);
            $isBusiness = $firstResult["isBusiness"];
            $_id = $firstResult["_id"];
            
            if ($isBusiness) {
                $nameQuery = mysql_query("SELECT businessName FROM Business b JOIN Profile pr ON pr._id = b._profileId WHERE pr._id = ".$_id);
                //new way to get name 
                $name = mysql_fetch_object($nameQuery);
                $name = $name -> businessName;
            } else {
                $nameQuery = mysql_query("SELECT firstName FROM Person p JOIN Profile pr ON pr._id = p._profileId WHERE pr._id = ".$_id);
                //new way to get name 
                $name = mysql_fetch_object($nameQuery);
                $name = $name -> firstName;
            }
            
            // Create a url which we will direct them to reset their password
            $pwrurl = $httpUrl."/#/app/resetPassword/2/".$hash."/2";
            
            $to = $email; // note the comma

            // Subject
            $subject = 'Reset your MyNyte password - www.mynyte.co.uk';

            // Message
            $message =
                '<html>
                <head>
                  <title>Reset your MyNyte password</title>
                </head>
                <body>
                  <table>
                    <tr>
                        <td>
                            <p>
                                Dear user,\n\nIf this e-mail does not apply to you please ignore it. It appears that you have requested a password reset at our website wwwmynyte.co.uk.\n\nTo reset your password, please click the link below. If you cannot click it, please paste it into your web browser\'s address bar.\n\n' . $pwrurl . '\n\nThanks,\nThe MyNyte Team
                            </p>
                        </td>
                    </tr>
                  </table>
                </body>
                </html>';

            // To send HTML mail, the Content-type header must be set
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/html; charset=iso-8859-1';

            // Additional headers
            $headers[] = 'To: '.$name.' <'.$to.'>';
            $headers[] = 'From: MyNyte <noreply@mynyte.co.uk>';

            // Mail it
            $sendMail = mail($to, $subject, $message, implode("\r\n", $headers));
            
            if ($sendMail) {
                echo json_encode("Success");
            } else {
                echo json_encode("Couldn't send email");
            }
        } else {
            echo json_encode("Query Unsuccessful");
        }
        //echo(json_encode("INSERT INTO ProfileResetCode(_profileId, code, dateTimeCreated) VALUES ((SELECT _id FROM Profile WHERE email = '$email'), '$hash', NOW());"));
    }
    else {
        echo json_encode("Email not found");
    }
  }
  else if ($action == 'checkPasswordResetCodeValidity') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_profileId = $dataJsonDecode-> _profileId;
    $code = $dataJsonDecode-> code;
    
    $result = mysql_query("CALL checkPasswordResetCodeValidity($_profileId, '$code');");
    //echo json_encode("CALL checkPasswordResetCodeValidity($_profileId, '$code');");
    
    if ($result) {
        echo json_encode(mysql_fetch_assoc($result));
    } else {
        echo json_encode("Password Check Query Failed");
    }
  }
  else if ($action == 'contactMyNyteTeam') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_profileId = $dataJsonDecode-> _profileId;
    $subject = $dataJsonDecode-> subject;
    $message = $dataJsonDecode-> message;
    
    $result = mysql_query("CALL contactMyNyteTeam($_profileId, '$subject', '$message');");
    //echo json_encode("CALL contactMyNyteTeam($_profileId, '$subject', '$message');");
    
    if ($result) {
        echo json_encode("MyNyte Contact Success");
    } else {
        echo json_encode("MyNyte Contact Failed");
    }
  }
  
  /*CREATE SEPARATE FILE FOR MYNYTEENTITY*/
  else if ($action == 'addMyNyteItem') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_parentId = $_POST['_parentId'];
    $itemName = $_POST['itemName'];
    $itemNameValueString = $_POST['itemNameValueString'];
    
    /*
    addMyNyteEntityItem Method Parameters:
      - _Parent Id (_id of business which owns the item Model)
      - MyNyte Item Name (VARCHAR(1000))
      - Stringified Object of Properties to filter by (VARCHAR(1000000)) | NULL if n/a

      Example: CALL addMyNyteItem(1, "Apppointment Booking", "[['Related Business Entity Item Appointment Type':='Process Serving Job']],[['_Related User Account Id':='19']]");

    */
    
    $result = mysql_query('CALL addMyNyteItem('.$_parentId.', "'.$itemName.'", "'.$itemNameValueString.'");');
    
    if ($result) {
        echo json_encode(mysql_fetch_assoc($result));
    } else {
        echo "CALL addMyNyteItem($_parentId, '".$itemName."', '".$itemNameValueString."');";
        echo json_encode("Failed addMyNyteEntityItem");
    }
  }
  else if ($action == 'getMyNyteItemCountForProfile') {
    $_profileId = $_POST['_profileId'];
    
    $result = mysql_query('CALL getMyNyteItemCountForProfile('.$_profileId.')');
  }
  else if ($action == 'getMyNyteItems') {
    $_parentId = (!isset($_POST['_parentId'])) ? 'NULL' : '"'.$_POST['_parentId'].'"';
    $myNyteItemType = $_POST['myNyteItemType'];
    $myNyteItemPropertyString = (!isset($_POST['myNyteItemPropertyString'])) ? 'NULL' : '"'.$_POST['myNyteItemPropertyString'].'"';
    $_relatedViewModelId = (!isset($_POST['_relatedViewModelId'])) ? 'NULL' : $_POST['_relatedViewModelId'];
    $extraFiltersString = (!isset($_POST['extraFiltersString'])) ? 'NULL' : '"'.$_POST['extraFiltersString'].'"';

    /*
    getMyNyteItems Method Parameters:
      - _parentId (_id of business which owns the item Model)
      - MyNyte Item Name (VARCHAR(1000))
      - Stringified Object of Properties to return (VARCHAR(1000000)) | NULL if n/a
      - _Related View Model Id (INT(11)) | NULL if n/a
      - Stringified Object of Properties to filter by (VARCHAR(1000000)) | NULL if n/a

      Example: CALL getMyNyteItems(1, "Apppointment Booking", NULL, NULL, "[['Status':='Incomplete']],[['Date Created':>'2017-05-01']]");

    */
    
    $result = mysql_query('CALL getMyNyteItems('.$_parentId.', "'.$myNyteItemType.'", '.$myNyteItemPropertyString.', '.$_relatedViewModelId.', '.$extraFiltersString.')');
  }

  else if ($action == 'getMyNyteItem') {
    $_parentId = $_POST['_parentId'];
    $_myNyteItemId = $_POST['_myNyteItemId'];
    $_relatedViewModelId = (!isset($_POST['_relatedViewModelId'])) ? 'NULL' : $_GET['_relatedViewModelId'];
    
    /*
    getMyNyteItemsMeta Method Parameters:
      - _Parent Id (_id of business which owns the item)
      - _MyNyte Item Id (VARCHAR(1000))
      - _Related View Model Id (INT(11)) | NULL if n/a

      Example: CALL getMyNyteItemsMeta(1, 2, 12);

    */
    
    $result = mysql_query('CALL getMyNyteItem('.$_parentId.', '.$_myNyteItemId.', '.$_relatedViewModelId.')');
  }

  else if ($action == 'getMyNyteItemModel') {
    $_parentId = $_GET['_parentId'];
    $myNyteItemType = $_GET['myNyteItemType'];
    $extraFiltersString = (isset($_GET['extraFiltersString'])) ? ('"'.$_GET['extraFiltersString'].'"'): 'NULL';
    $_relatedViewModelId = (isset($_GET['_relatedViewModelId'])) ? ('"'.$_GET['_relatedViewModelId'].'"'): 'NULL';
    /*
    getMyNyteItemModel Method Parameters:
      - _Parent Id (_id of business which owns the item)
      - _MyNyte Item Type (VARCHAR(1000))
      - Stringified Object of Properties to filter by (VARCHAR(100000)) | NULL if n/a
      - _Related View Model Id (INT(11)) | NULL if n/a

      Example: CALL getMyNyteItemModel(1, "Appointment Booking", "[['Related Business Entity Item Appointment Type':='Process Serving Job']]", NULL);

    */
    
    $result = mysql_query('CALL getMyNyteItemModel('.$_parentId.', "'.$myNyteItemType.'", '.$extraFiltersString.', '.$_relatedViewModelId.');');
  }

  else if ($action == 'updateMyNyteItem') {
    $_myNyteItemId = $_POST['_myNyteItemId'];
    $updateString = $_POST['updateString'];
    
    /*
    updateMyNyteItem Method Parameters:
      - _Parent Id (_id of business which owns the item)
      - _MyNyte Item Id (VARCHAR(1000))
      - Stringified Object of Properties to update (VARCHAR(100000))

      Example: CALL updateBusinessEntityItem(1, 2, "[['Status':'Complete']],[['Date Completed':NOW()]]");

    */
    $result = mysql_query('CALL updateMyNyteItem("'.$_myNyteItemId.'", "'.$updateString.'");');
  }

  else if ($action == 'deleteMyNyteItem') {
    $_parentId = $_GET['_parentId'];
    $_myNyteItemId = $_GET['_myNyteItemId'];
    
    /*
    deleteMyNyteItem Method Parameters:
      - _Parent Id (_id of business which owns the item)
      - _MyNyte Item Id (VARCHAR(1000))

      Example: CALL deleteMyNyteItem(1, 2);

    */

    $result = mysql_query("CALL deleteMyNyteItem($_parentId, $_myNyteItemId");
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
    || $action == 'getAllBusinessSettingsForBusiness'
    || $action == 'getBusinessTypesForBusiness'
    || $action == 'getFoodStylesForBusiness'
    || $action == 'getBusinessOpeningTimesForBusiness'
    || $action == 'getAllTonightsFeedOptionsForBusiness'
    || $action == 'getProfileItemCountForProfile'
    || $action == 'getMyNyteExternalContacts'
    || $action == 'getTimeSheetToFill'
    || $action == 'updateAllProfileDetails'
    || $action == 'updateProfilePasswordDetails'
    || $action == 'getMyNyteItemCountForProfile'
    || $action == 'getMyNyteItems'
    || $action == 'getMyNyteItem'
    || $action == 'getMyNyteItemModel') {
      $result = ($result === null) ? array() : $result;
      $output = null;
      while($row = mysql_fetch_assoc($result))
        $output[] = $row;  
      echo json_encode($output);
  }

  if ($action == "createUserEngagement" || $action == "deleteUserEngagement") {
    mysqli_close($db_con);
  }
  mysql_close();
?>
