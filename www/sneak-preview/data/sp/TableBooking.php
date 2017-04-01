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
    $accepted = (empty($_GET['accepted'])) ? "": mysql_real_escape_string($_GET['accepted']);
    $rejected = (empty($_GET['rejected'])) ? "": mysql_real_escape_string($_GET['rejected']);
    $completed = (empty($_GET['completed'])) ? "": mysql_real_escape_string($_GET['completed']);
    $cancelled = (empty($_GET['cancelled'])) ? "": mysql_real_escape_string($_GET['cancelled']);
    $alternateDate = (empty($_GET['alternateDate']) || $_GET['alternateDate'] == 'null') ? 'null': "'". mysql_real_escape_string($_GET['alternateDate']) . "'";

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