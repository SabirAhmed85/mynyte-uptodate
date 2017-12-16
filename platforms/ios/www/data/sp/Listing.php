<?php

  require_once('../db-connect.php');
    
  $action = ($_GET['action'] == undefined) ? "": mysql_real_escape_string($_GET['action']);
  $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
  if ($action == 'getListingsForFeed') {
    $_userId = ($_GET['_userId'] == undefined) ? "": mysql_real_escape_string($_GET['_userId']);
    $result = mysql_query("CALL getListingsForMainFeed($_townId, $_userId);");
  } else if ($action == 'getListingsForFoodFeed') {
    $result = mysql_query("CALL getListingsForFoodFeed($_townId);");
  } else if ($action == 'getListingsForNightlifeFeed') {
    $result = mysql_query("CALL getListingsForNightlifeFeed($_townId);");
  } else if ($action == 'getListingsForMoviesFeed') {
    $result = mysql_query("CALL getListingsForMoviesFeed()");
  } 

  else if ($action == 'getRestaurantsOrTakeawaysByTownAndFoodStyle') {
    $_profileId = ($_GET['_profileId'] == undefined) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_foodStyleId = ($_GET['_foodStyleId'] == undefined) ? "": mysql_real_escape_string($_GET['_foodStyleId']);
    $businessType = ($_GET['businessType'] == undefined) ? "": mysql_real_escape_string($_GET['businessType']);
    $result = mysql_query("CALL findRestaurantsOrTakeawaysByTownAndFoodStyle($_townId, $_foodStyleId, '$businessType', $_profileId)");
  }
  else if ($action == 'getMoviesByTownAndMovieStyle') {
    $_profileId = ($_GET['_profileId'] == undefined) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_movieStyleId = ($_GET['_movieStyleId'] == undefined) ? "": mysql_real_escape_string($_GET['_movieStyleId']);
    $result = mysql_query("CALL findMoviesByTownAndMovieStyle($_townId, $_movieStyleId, $_profileId)");
  }
  else if ($action == 'getBarsAndClubsByTown') {
    $_profileId = ($_GET['_profileId'] == undefined) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $result = mysql_query("CALL getBarsAndClubsByTown($_townId, $_profileId)");
  }
  //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        if ($action == 'getListingsForFeed') {
            shuffle($output);
        }
        
      header('Content-Type: application/json');
      echo json_encode($output);
  
  mysql_close();
?>