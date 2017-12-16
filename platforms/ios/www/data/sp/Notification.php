<?php

  require_once('../db-connect.php');
    
  $action = ($_GET['action'] == undefined) ? "": mysql_real_escape_string($_GET['action']);
  
  if ($action == 'clearAllExpiredTransactions') {
    $result = mysql_query("CALL clearAllExpiredTransactions()");
  }
  else if ($action == 'getNotifications') {
    
    if (isset($_GET['_profileId'])) {
        $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
        
        $result = mysql_query("CALL getNotifications($_profileId)");
    }
      
    
  }
  else if ($action == 'getAllUserNotificationsSummaryForUpdate') {
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
    
    $result = mysql_query("CALL getAllUserNotificationsSummaryForUpdate($_profileId)");
  }
  else if ($action == 'getUnreadUserNotificationsSummaryForUpdate') {
    $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
    
    $result = mysql_query("CALL getUnreadUserNotificationsSummaryForUpdate($_profileId)");
  }
  else if ($action == 'createOneSignalId') {
    $_profileId = $_GET['_profileId'];
    $_oneSignalId = $_GET['_oneSignalId'];
    $deviceToken = $_GET['deviceToken'];
    
    $result = mysql_query("CALL createOneSignalId('$_profileId','$_oneSignalId','$deviceToken')");
  }
  else if ($action == 'removeOneSignalIdForLogOut') {
    $_oneSignalId = $_GET['_oneSignalId'];
    
    $result = mysql_query("CALL removeOneSignalIdForLogOut('$_oneSignalId')");
  }
  else if ($action == 'getOneSignalDeviceTokensForProfiles') {
    $profileIds = $_GET['_profileIds'];
    $profileIdString = implode(', ', $profileIds);
    
    $result = mysql_query("CALL getOneSignalDeviceTokensForProfiles('$profileIdString')");
  }
  
  //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  
  mysql_close();
?>
