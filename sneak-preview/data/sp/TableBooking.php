<?php

  require_once('../db-connect.php');
    
  $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);

  if ($action == 'createTableBooking') {
    $_usersProfileId = (empty($_GET['_usersProfileId'])) ? NULL: mysql_real_escape_string($_GET['_usersProfileId']);
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $usersName = (empty($_GET['usersName'])) ? "": mysql_real_escape_string($_GET['usersName']);
    $usersEmail = (empty($_GET['usersEmail'])) ? "": mysql_real_escape_string($_GET['usersEmail']);
    $tableFor = (empty($_GET['tableFor'])) ? "": mysql_real_escape_string($_GET['tableFor']);
    $dateTimeRequested = (empty($_GET['dateTimeRequested'])) ? "": mysql_real_escape_string($_GET['dateTimeRequested']);
    $result = mysql_query("CALL createTableBooking($_usersProfileId, $_businessId, '$usersName', '$usersEmail', $tableFor, '$dateTimeRequested');");
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
    && $action != 'createBlockedTableBookingInterval') {
    $output = null;
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;
        
    header('Content-Type: application/json');
    echo json_encode($output);
  }
  
  mysql_close();
?>