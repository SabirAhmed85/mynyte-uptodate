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
    
    $result = mysql_query("INSERT INTO ExternalApiContact (_businessId, name, email, message) VALUES (1, '$name', '$email', '$message')");
  }

  else if ($action == 'getOffersFeed') {
    $_userId = 0;
    $_eventId = 0;
    $_offerId = 0;
    $timeScale = 'present';
    $_townId = 1;
    $_businessId = ($_GET['_businessId']);

    //$result = mysql_query("CALL getListingsForMainFeed($_townId, $_userId)");
    $result = mysql_query("CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    //echo json_encode("CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    while($row = mysql_fetch_assoc($result))
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
    $result = mysql_query("CALL getMenuItems('$_businessId', 0, 1);");
    //echo json_encode("CALL getOffers($_userId, $_townId, $_businessId, $_eventId, $_offerId, '$timeScale');");
    
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);

    header("Content-Type: application/json");
    echo $callback . "({'items': ".json_encode($output)."})";
    //echo json_encode($output);
  }
  else if ($action == 'getBusinessesByBusinessType') {
    $_profileId = 0;
    $businessTypesString = $_GET['businessTypesString'];
    $_townId = $_GET['_townId'];

    $result = mysql_query("CALL getBusinessesByBusinessType($_profileId, '".$businessTypesString."', $_townId);");
    
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);

    header("Content-Type: application/json");
    echo $callback . "({'items': ".json_encode($output)."})";
  }

  else if ($action == 'createExternalPersonEntity') {
    /*
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $name = $dataJsonDecode-> name;
    $email = $dataJsonDecode-> email;
    */

    $result = mysql_query("CALL createExternalPersonEntity('James Steven', 'james@j.com');");
    
    while($row = mysql_fetch_assoc($result))
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

    $result = mysql_query("CALL createLiveChatMessageGroup(853, 1);");
    
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);
    echo json_encode($output[0]["@_messageGroupId"]);
  }

  mysql_close();
?>
