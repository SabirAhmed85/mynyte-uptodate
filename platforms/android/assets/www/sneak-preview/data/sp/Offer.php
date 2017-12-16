<?php

  require_once('../db-connect.php');
    
  $action = $_GET['action'];
  
  if ($action == 'createOffer' || $action == 'updateOffer') {
  
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
    $_offerTypeId = (empty($_GET['_offerTypeId'])) ? "": mysql_real_escape_string($_GET['_offerTypeId']);
    $_offerSubCategoryId = (empty($_GET['_offerSubCategoryId'])) ? "": mysql_real_escape_string($_GET['_offerSubCategoryId']);
    $offerTitle = (empty($_GET['offerTitle'])) ? "": mysql_real_escape_string($_GET['offerTitle']);
    $description = (empty($_GET['description'])) ? "": mysql_real_escape_string($_GET['description']);
    $startDateTime = (empty($_GET['startDateTime'])) ? "": mysql_real_escape_string($_GET['startDateTime']);
    $endDateTime = ($_GET['endDateTime'] == 0) ? "NULL": "'".mysql_real_escape_string($_GET['endDateTime'])."'";
    $weeksAhead = (empty($_GET['weeksAhead'])) ? "NULL": mysql_real_escape_string($_GET['weeksAhead']);
    $weekdayIndex = (empty($_GET['weekdayIndex'])) ? "NULL": mysql_real_escape_string($_GET['weekdayIndex']);
    $_eventId = (empty($_GET['_eventId'])) ? "NULL": mysql_real_escape_string($_GET['_eventId']);
    $newImageName = NULL;
      
    if ($action == 'createOffer') {
        $query    = mysql_query("CALL createOffer('$_offerTypeId', '$_offerSubCategoryId', '$_businessId', '$offerTitle', '$description', 0, '$startDateTime', $endDateTime, $weeksAhead, $weekdayIndex, $_eventId, $newImageName, @_offerId);");
        $result = mysql_query("SELECT @_offerId as _offerId");
        // Need new way to do this 
        $output = mysql_fetch_object($result);
        $output = $output -> _offerId;
        echo json_encode($output);
    } else {
        $_offerId = (empty($_GET['_offerId'])) ? "": mysql_real_escape_string($_GET['_offerId']);
        $sqlQuery = "CALL updateOffer('$_offerId', '$_offerTypeId', '$_offerSubCategoryId', '$_businessId', '$offerTitle', '$description', 0, '$startDateTime', $endDateTime, $weeksAhead, $weekdayIndex)";
        //print("CALL updateOffer('$_offerId', '$_offerTypeId', '$_offerSubCategoryId', '$_businessId', '$offerTitle', '$description', 0, '$startDateTime', $endDateTime, $weeksAhead, $weekdayIndex)");
        $result = mysql_query($sqlQuery);
    }
  }
  else if ($action == 'getOffers') {
    $_profileId = (empty($_GET['_profileId'])) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_townId = (empty($_GET['_townId'])) ? 0: mysql_real_escape_string($_GET['_townId']);
    $_businessId = (empty($_GET['_businessId'])) ? 0: mysql_real_escape_string($_GET['_businessId']);
    $_eventId = (empty($_GET['_eventId'])) ? 0: mysql_real_escape_string($_GET['_eventId']);
    $_offerId = (empty($_GET['_offerId'])) ? 0: mysql_real_escape_string($_GET['_offerId']);
    $timeScale = (empty($_GET['timeScale'])) ? '': mysql_real_escape_string($_GET['timeScale']);

    $result = mysql_query("CALL getOffers($_profileId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    $output = null;
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;

    header('Content-Type: application/json');
    echo json_encode($output);
  }
  else if ($action == 'getTodaysOffersForWideDisplay') {
    $_townId = (empty($_GET['_townId'])) ? 0: mysql_real_escape_string($_GET['_townId']);

    $result = mysql_query("CALL getTodaysOffersForWideDisplay($_townId);");
    
    $output = null;
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
    
    shuffle($output);
    $counter = (count($output) > 10) ? 10: count($output);
    $output = array_slice($output, 0, $counter);

    header('Content-Type: application/json');
    echo json_encode($output);
  }
  
  mysql_close();
?>
