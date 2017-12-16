<?php

  require_once('../db-connect.php');
    
  $action = $_GET['action'];
  
  if ($action == 'createOffer') {
  
    $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
    $_offerTypeId = ($_GET['_offerTypeId'] == undefined) ? "": mysql_real_escape_string($_GET['_offerTypeId']);
    $_offerSubCategoryId = ($_GET['_offerSubCategoryId'] == undefined) ? "": mysql_real_escape_string($_GET['_offerSubCategoryId']);
    $offerTitle = ($_GET['offerTitle'] == undefined) ? "": mysql_real_escape_string($_GET['offerTitle']);
    $description = ($_GET['description'] == undefined) ? "": mysql_real_escape_string($_GET['description']);
    $startDateTime = ($_GET['startDateTime'] == undefined) ? "": mysql_real_escape_string($_GET['startDateTime']);
    $endDateTime = ($_GET['endDateTime'] == undefined) ? "": mysql_real_escape_string($_GET['endDateTime']);
    $totalAvailable = ($_GET['totalAvailable'] == undefined) ? "NULL": mysql_real_escape_string($_GET['totalAvailable']);
      
    $query    = mysql_query("CALL createOffer('$_offerTypeId', '$_offerSubCategoryId', '$_businessId', '$offerTitle', '$description', '$totalAvailable', '$startDateTime', $endDateTime, @_offerId);");
    $result = mysql_query("SELECT @_offerId");
    $output = mysql_fetch_array($result)["@_offerId"];

    echo json_encode($output);
  }
  else if ($action == 'getOffers') {
    $_profileId = ($_GET['_profileId'] == undefined) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_townId = (!isset($_GET['_townId'])) ? 0: mysql_real_escape_string($_GET['_townId']);
    $_businessId = (!isset($_GET['_businessId'])) ? 0: mysql_real_escape_string($_GET['_businessId']);
    $_eventId = (!isset($_GET['_eventId'])) ? 0: mysql_real_escape_string($_GET['_eventId']);
    $_offerId = (!isset($_GET['_offerId'])) ? 0: mysql_real_escape_string($_GET['_offerId']);
    $timeScale = (!isset($_GET['timeScale'])) ? 'present': mysql_real_escape_string($_GET['timeScale']);

    $result = mysql_query("CALL getOffers($_profileId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;

    header('Content-Type: application/json');
    echo json_encode($output);
  }
  
  mysql_close();
?>
