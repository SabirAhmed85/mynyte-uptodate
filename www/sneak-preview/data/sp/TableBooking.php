<?php
  include '../functions/intellisms/SendScripts/IntelliSMS.php';

  require_once('../db-connect.php');
    
  $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);

  if ($action == 'createTableBooking') {
    $_usersProfileId = (empty($_GET['_usersProfileId'])) ? NULL: mysql_real_escape_string($_GET['_usersProfileId']);
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $usersName = (empty($_GET['usersName'])) ? "": mysql_real_escape_string($_GET['usersName']);
    $usersEmail = (empty($_GET['usersEmail'])) ? "": mysql_real_escape_string($_GET['usersEmail']);
    $tableFor = (empty($_GET['tableFor'])) ? "": mysql_real_escape_string($_GET['tableFor']);
    $dateTimeRequested = (empty($_GET['dateTimeRequested'])) ? "": mysql_real_escape_string($_GET['dateTimeRequested']);
    $comment = (empty($_GET['comment'])) ? "": mysql_real_escape_string($_GET['comment']);
  //echo json_encode("CALL createTableBooking($_usersProfileId, $_businessId, '$usersName', '$usersEmail', $tableFor, '$dateTimeRequested', '$comment');");
    $result = mysql_query("CALL createTableBooking($_usersProfileId, $_businessId, '$usersName', '$usersEmail', $tableFor, '$dateTimeRequested', '$comment');");

    $output = mysql_fetch_assoc($result);
    $email = $output['email'];
    $phone = $output['phone'];
    $informByPhone = $output['informByPhone'];
    $informByText = $output['informByText'];
    $phone = (substr($phone, 0, 1) == '0') ? '44' . substr($phone, 1, strlen($phone)): $phone;

    $rootUrl = ($intended_environment == 'Staging') ? 'https://www.mynyte.co.uk/staging/': 'https://www.mynyte.co.uk/live/';
    $emailUrl = $rootUrl . 'sneak-preview/data/functions/email.php';
    $myvars = 'action=informRestaurantOfTableBooking&email=' . $email;

    $ch = curl_init( $emailUrl );
    curl_setopt( $ch, CURLOPT_POST, 1);
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
    curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt( $ch, CURLOPT_HEADER, 0);
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

    $response = curl_exec( $ch );

    if ($informByPhone == '1') {
      $voiceCallUrl = $rootUrl . 'sneak-preview/data/functions/call.php';
      $myvars = 'phone=+' . $phone;
      
      $ch = curl_init( $voiceCallUrl );
      curl_setopt( $ch, CURLOPT_POST, 1);
      curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
      curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
      curl_setopt( $ch, CURLOPT_HEADER, 0);
      curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
    
      $response = curl_exec( $ch );
    }
	elseif ($informByText == '1' && (substr($phone, 0, 2) == '07' || substr($phone, 0, 3) == '447')) {
      $objIntelliSMS = new IntelliSMS();

      $objIntelliSMS->Username = 'mynyte';
      $objIntelliSMS->Password = 'Liberty44';

      $objIntelliSMS->SendMessage ( $phone, "You've just received a Table Booking through the MyNyte App. Log into MyNyte to see full details.", 'MyNyte' );
    }
	
  }
  else if ($action == 'getRequestedTableBookings') {
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);

    $result = mysql_query("CALL getRequestedTableBookingsForBusiness('$_businessId');");
  }
  else if ($action == 'getAcceptedTableBookings') {
    $timeScale = (empty($_GET['timeScale'])) ? "": mysql_real_escape_string($_GET['timeScale']);
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);

    $result = mysql_query("CALL getAcceptedTableBookingsForBusiness('$timeScale', '$_businessId');");
  }
  else if ($action == 'getTableBookingById') {
    $_tableBookingId = (empty($_GET['_tableBookingId'])) ? "": mysql_real_escape_string($_GET['_tableBookingId']);

    $result = mysql_query("CALL getTableBookingById('$_tableBookingId');");
  }
  else if ($action == 'updateTableBooking' || $action == 'updateTableBookingByPerson') {
    $_tableBookingId = (empty($_GET['_tableBookingId'])) ? "": mysql_real_escape_string($_GET['_tableBookingId']);
    $accepted = (empty($_GET['accepted'])) ? "0": mysql_real_escape_string($_GET['accepted']);
    $rejected = (empty($_GET['rejected'])) ? "0": mysql_real_escape_string($_GET['rejected']);
    $completed = (empty($_GET['completed'])) ? "0": mysql_real_escape_string($_GET['completed']);
    $cancelled = (empty($_GET['cancelled'])) ? "0": mysql_real_escape_string($_GET['cancelled']);
    $alternateDate = (empty($_GET['alternateDate']) || $_GET['alternateDate'] == 'null') ? 'null': "'". mysql_real_escape_string($_GET['alternateDate']) . "'";

    if ($action == 'updateTableBooking') {
      $result = mysql_query("CALL businessUpdateTableBooking($_tableBookingId, $accepted, $rejected, $cancelled, $completed, $alternateDate);");
    } else {
      $result = mysql_query("CALL personUpdateTableBooking($_tableBookingId, $accepted, $rejected, $cancelled, $completed, $alternateDate);");
    }
  }
  else if ($action == 'findOutIfRestaurantBookingPossible') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_businessId = $dataJsonDecode->_businessId;
    $requestedBookingDate = $dataJsonDecode->requestedBookingDate;
    $requestedBookingTime = $dataJsonDecode->requestedBookingTime;

    $result = mysql_query("CALL findOutIfRestaurantBookingPossible($_businessId, '$requestedBookingDate', '$requestedBookingTime');");
  }
  else if ($action == 'createBlockedTableBookingInterval') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_businessId = $dataJsonDecode->_businessId;
    $startDateTime = $dataJsonDecode->startDateTime;
    $endDateTime = $dataJsonDecode->endDateTime;

    $result1 = mysql_query("CALL createBlockedTableBookingInterval($_businessId, '$startDateTime', '$endDateTime', @existingIntervals);");
    $result = mysql_query("SELECT @existingIntervals as existingIntervals");

    //need new way to get Users Id $_usersId = mysql_fetch_array($result)["@_usersId"];
    $existingIntervals = mysql_fetch_object($result);
    $existingIntervals = $existingIntervals -> existingIntervals;

    //header('Content-Type: application/json');
    echo json_encode($existingIntervals);
  }
  else if ($action == 'deleteBlockedTableBookingInterval') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_intervalId = $dataJsonDecode->_intervalId;

    $result = mysql_query("CALL deleteBlockedTableBookingInterval($_intervalId);");
  }
  else if ($action == 'getBlockedTableBookingIntervals') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_businessId = $dataJsonDecode->_businessId;

    $result = mysql_query("CALL getBlockedTableBookingIntervals($_businessId);");

  }
  //print(json_encode($_usersId));
  if ($action != 'deleteBlockedTableBookingInterval'
    && $action != 'createBlockedTableBookingInterval'
    && $action != 'createTableBooking') {
    $output = null;
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;
        
    header('Content-Type: application/json');
    echo json_encode($output);
  }
  else if ($action == 'createTableBooking') {
    header('Content-Type: application/json');
    echo json_encode($output);
  }
  
  mysql_close();
?>