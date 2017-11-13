<?php

  require_once('db-connect.php');

  function getOffersFeed() {

  }
    
  $action = $_GET['jsonp'];
  $callback = $_GET['jsonp'];

  if ($action == 'registerContact') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $name = $dataJsonDecode-> name;
    $email = $dataJsonDecode-> email;
    $organisation = $dataJsonDecode-> company;
    $message = $dataJsonDecode-> message;
    
    $result = mysqli_query($db_con, "INSERT INTO ExternalApiContact (_businessId, name, email, message) VALUES (1, '$name', '$email', '$message')");
  }

  else if ($action == 'getOffersFeed') {
    $_userId = 0;
    $_eventId = 0;
    $_offerId = 0;
    $timeScale = 'present';
    $_townId = 1;
    $_businessId = ($_GET['_businessId']);

    //$result = mysql_query("CALL getListingsForMainFeed($_townId, $_userId)");
    $result = mysqli_query($db_con, "CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    //echo json_encode("CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);

    header("Content-Type: application/json");
    echo $callback . "({'items': ".json_encode($output)."})";
    //echo json_encode($output);
  }
  else if ($action == 'getMenuItems') {
    $_businessId = ($_GET['_businessId']);
    $menuType = (isset($_GET['menuType'])) ? $_GET['menuType']: 'takeaway';
	  $_menuTypeId = ($menuType == 'takeaway') ? 1: 2;
    $menuItemCategoryIdString = (!isset($_GET['menuItemCategoryIdString'])) ? "0": $_GET['menuItemCategoryIdString'];

    //$result = mysql_query("CALL getListingsForMainFeed($_townId, $_userId)");
    $result = mysqli_query($db_con, "CALL getMenuItems($_businessId, $_menuTypeId, '$menuItemCategoryIdString');");
    //echo json_encode("CALL getMenuItems($_businessId, $_menuTypeId, '$menuItemCategoryIdString');");

    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    header("Content-Type: application/json");
    echo $callback . "({'items': ".json_encode($output)."})";
    //echo json_encode($output);
  }
  else if ($action == 'getBusinessesByBusinessType') {
    $_profileId = $_GET['_profileId'];
    //$businessTypesString = $_GET['businessTypesString'];
    $businessTypesString = "Bar, Nightclub, Event";
    $_townId = $_GET['_townId'];
    $limit = $_GET['limit'];
    $hasEvents = strpos($businessTypesString, 'Event') !== false;
    $hasMovies = strpos($businessTypesString, 'Movie') !== false;
    $hasOffers = strpos($businessTypesString, 'Offer') !== false;
    $output_listings = array();

    $businessTypesString = str_replace(" ", "", $businessTypesString);
    $businessTypesString = str_replace(",Event", "", $businessTypesString);
    $businessTypesString = str_replace("Event", "", $businessTypesString);
    $businessTypesString = str_replace(",Offer", "", $businessTypesString);
    $businessTypesString = str_replace("Offer", "", $businessTypesString);
    $businessTypesString = str_replace(",Movie", "", $businessTypesString);
    $businessTypesString = str_replace("Movie", "", $businessTypesString);
    

    $result = mysqli_query($db_con, "CALL getBusinessesByBusinessType(".$_profileId.", '".$businessTypesString."', ".$_townId.");");
    //echo json_encode("CALL getBusinessesByBusinessType(".$_profileId.", '".$businessTypesString."', ".$_townId.");");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    mysqli_next_result($db_con);

    if ($hasEvents == 1) {
      $result_events = mysqli_query($db_con, "CALL getBusinessesByBusinessType(".$_profileId.", 'Event', ".$_townId.");");
      //echo json_encode("CALL getBusinessesByBusinessType(".$_profileId.", 'Event', ".$_townId.");");

      while($row_events = mysqli_fetch_assoc($result_events))
        $output_events[] = $row_events;

      for ($a = 0; $a < count($output_events); $a++) {
        array_push($output, $output_events[$a]);
      }
    }

    shuffle($output);

    for ($i = 0; $i < count($output); $i++) {
      
      if (!isset($output_listings[$output[$i]['listingTypeName']])) {
        $output_listings[$output[$i]['listingTypeName']] = array();
      }

      if (count($output_listings[$output[$i]['listingTypeName']]) < $limit) {
        array_push($output_listings[$output[$i]['listingTypeName']], $output[$i]);
      }
      
      if ($i == count($output) - 1) {
        header("Content-Type: application/json");
        echo $callback . "({'items': ".json_encode($output_listings)."})";
      }
    }
  }

  else if ($action == 'createExternalPersonEntity') {
    /*
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $name = $dataJsonDecode-> name;
    $email = $dataJsonDecode-> email;
    */

    $result = mysqli_query($db_con, "CALL createExternalPersonEntity('James Steven', 'james@j.com');");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);
    echo json_encode($output[0]["@_profileId"]);
  }

  else if ($action == 'createLiveChatMessageGroup') {
    /*
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_personProfileId = $dataJsonDecode-> _personProfileId;
    $_businessId = $dataJsonDecode-> _businessId;
    */

    $result = mysqli_query($db_con, "CALL createLiveChatMessageGroup(853, 1);");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);
    echo json_encode($output[0]["@_messageGroupId"]);
  }

  mysqli_close();
?>
