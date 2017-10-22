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
    $_userId = 0;
    $_eventId = 0;
    $_offerId = 0;
    $timeScale = 'present';
    $_townId = 1;
    $_businessId = ($_GET['_businessId']);

    //$result = mysql_query("CALL getListingsForMainFeed($_townId, $_userId)");
    $result = mysqli_query($db_con, "CALL getMenuItems('$_businessId', 0, 1);");
    //echo json_encode("CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);

    header("Content-Type: application/json");
    echo $callback . "({'items': ".json_encode($output)."})";
    //echo json_encode($output);
  }
  else if ($action == 'getBusinessesByBusinessType') {
    $_profileId = $_GET['_profileId'];
    //$businessTypesString = $_GET['businessTypesString'];
    $businessTypesString = "Restaurant, Takeaway";
    $_townId = $_GET['_townId'];
    $limit = $_GET['limit'];
    $output_listings = array();

    $result = mysqli_query($db_con, "CALL getBusinessesByBusinessType(".$_profileId.", '".$businessTypesString."', ".$_townId.");");
    //echo json_encode("CALL getBusinessesByBusinessType(".$_profileId.", '".$businessTypesString."', ".$_townId.");");
    
    while($row = mysqli_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);
    for ($i = 0; $i < count($output); $i++) {
      
      if (!isset($output_listings[$output[$i]['businessTypeName']])) {
        $output_listings[$output[$i]['businessTypeName']] = array();
      }

      if (count($output_listings[$output[$i]['businessTypeName']]) < $limit) {
        array_push($output_listings[$output[$i]['businessTypeName']], $output[$i]);
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

  mysql_close();
?>
