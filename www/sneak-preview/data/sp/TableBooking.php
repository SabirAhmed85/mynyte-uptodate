<?php

  require_once('../db-connect.php');
    
  $action = ($_GET['action'] == undefined) ? "": mysql_real_escape_string($_GET['action']);

  if ($action == 'createTableBooking') {
    $_usersProfileId = ($_GET['_usersProfileId'] == undefined) ? NULL: mysql_real_escape_string($_GET['_usersProfileId']);
    $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
    $usersName = ($_GET['usersName'] == undefined) ? "": mysql_real_escape_string($_GET['usersName']);
    $usersEmail = ($_GET['usersEmail'] == undefined) ? "": mysql_real_escape_string($_GET['usersEmail']);
    $tableFor = ($_GET['tableFor'] == undefined) ? "": mysql_real_escape_string($_GET['tableFor']);
    $dateTimeRequested = ($_GET['dateTimeRequested'] == undefined) ? "": mysql_real_escape_string($_GET['dateTimeRequested']);
    $result = mysql_query("CALL createTableBooking($_usersProfileId, $_businessId, '$usersName', '$usersEmail', $tableFor, '$dateTimeRequested');");
  }
  else if ($action == 'getRequestedTableBookings') {
    $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);

    $result = mysql_query("CALL getRequestedTableBookingsForBusiness('$_businessId');");
  }
  else if ($action == 'getAcceptedTableBookings') {
    $timeScale = ($_GET['timeScale'] == undefined) ? "": mysql_real_escape_string($_GET['timeScale']);
    $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);

    $result = mysql_query("CALL getAcceptedTableBookingsForBusiness('$timeScale', '$_businessId');");
  }
  else if ($action == 'getTableBookingById') {
    $_tableBookingId = ($_GET['_tableBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_tableBookingId']);

    $result = mysql_query("CALL getTableBookingById('$_tableBookingId');");
  }
  else if ($action == 'updateTableBooking' || $action == 'updateTableBookingByPerson') {
    $_tableBookingId = ($_GET['_tableBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_tableBookingId']);
    $accepted = ($_GET['accepted'] == undefined) ? "": mysql_real_escape_string($_GET['accepted']);
    $rejected = ($_GET['rejected'] == undefined) ? "": mysql_real_escape_string($_GET['rejected']);
    $completed = ($_GET['completed'] == undefined) ? "": mysql_real_escape_string($_GET['completed']);
    $cancelled = ($_GET['cancelled'] == undefined) ? "": mysql_real_escape_string($_GET['cancelled']);
    $alternateDate = ($_GET['alternateDate'] == 'null') ? 'null': "'". mysql_real_escape_string($_GET['alternateDate']) . "'";

    if ($action == 'updateTableBooking') {
      $result = mysql_query("CALL businessUpdateTableBooking($_tableBookingId, $accepted, $rejected, $cancelled, $completed, $alternateDate);");
    } else {
      $result = mysql_query("CALL personUpdateTableBooking($_tableBookingId, $accepted, $rejected, $cancelled, $completed, $alternateDate);");
    }
  }
  //print(json_encode($_usersId));
  while($row = mysql_fetch_assoc($result))
    $output[] = $row;
      
  header('Content-Type: application/json');
  echo json_encode($output);
  
  mysql_close();
?>