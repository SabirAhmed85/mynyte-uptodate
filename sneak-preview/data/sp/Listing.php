<?php
    require_once('../db-connect.php');
    
    $action = $_GET['action'];
    $_townId = $_GET['_townId'];
    
    if ($action == 'getListingsForFoodFeed'
        || $action == 'getListingsForNightlifeFeed'
        || $action == 'getListingsForFeed') {
        //mysql_close();
        require_once('../db-connect-sqli.php');
    }
    
    function prepareOfferIdString ($result_prep, $offerCount) {
        while($row_prep = mysqli_fetch_assoc($result_prep)) {
            $output_prep[] = $row_prep["_id"];
        }
        shuffle($output_prep);
        $output_prep2 = array_slice($output_prep, 0, $offerCount);
        
        $_offerIdsString = "";
        foreach ($output_prep2 as $key=>$a) {
            $_offerIdsString .= (string)$a;
            if ($key < count($output_prep2) - 1) {
                $_offerIdsString .= ",";
            }
        }
        
        return $_offerIdsString;
    }
    
    function prepareOffersOutputObj ($result_offers) {
        $output_offers = array();
        while($row_offers = mysqli_fetch_assoc($result_offers)) {
            $output_offers[] = $row_offers;
        }
        
        return $output_offers;
    }
    
    function prepareListingsOutputObj ($result_listings) {
        while($row_listings = mysqli_fetch_assoc($result_listings)) {
            $output_listings[] = $row_listings;
        }
        shuffle($output_listings);
        $output_listings_top = array_slice($output_listings, 0, 2);
        $output_listings = array_slice($output_listings, 2, count($output_listings) - 2);
        
        return array("listings_top"=> $output_listings_top, "listings"=> $output_listings);
    }
  
  if ($action == 'getListingsForFeed') {
    $_userId = (empty($_GET['_userId'])) ? "0": mysql_real_escape_string($_GET['_userId']);
    
    $result_prep = mysqli_query($db_con, "CALL getOfferIdsForMainFeed($_townId);");
    $_offerIdsString = prepareOfferIdString($result_prep, 5);
    mysqli_next_result($db_con);
    
    $result_offers = mysqli_query($db_con, "CALL getOffersForMainFeed($_townId, $_userId, '$_offerIdsString');");
    
    $output_offers = prepareOffersOutputObj($result_offers);
    mysqli_next_result($db_con);
    
    $result_listings = mysqli_query($db_con, "CALL getListingsForMainFeed($_townId, $_userId);");
  }
  else if ($action == 'getListingsForFoodFeed') {
    $result_prep = mysqli_query($db_con, "CALL getOfferIdsForFoodFeed($_townId);");
    $_offerIdsString = prepareOfferIdString($result_prep, 8);
    mysqli_next_result($db_con);
    
    $result_offers = mysqli_query($db_con, "CALL getOffersForFoodFeed('$_offerIdsString');");
    $output_offers = prepareOffersOutputObj($result_offers);
    mysqli_next_result($db_con);
    
    $result_listings = mysqli_query($db_con, "CALL getListingsForFoodFeed($_townId);");
  }
  else if ($action == 'getListingsForNightlifeFeed') {
    //$result = mysql_query("CALL getListingsForNightlifeFeed($_townId);");
    $result_prep = mysqli_query($db_con, "CALL getOfferIdsForNightlifeFeed($_townId);");
    $_offerIdsString = prepareOfferIdString($result_prep, 8);
    mysqli_next_result($db_con);
    
    $result_offers = mysqli_query($db_con, "CALL getOffersForNightlifeFeed('$_offerIdsString');");
    $output_offers = prepareOffersOutputObj($result_offers);
    mysqli_next_result($db_con);
    
    $result_listings = mysqli_query($db_con, "CALL getListingsForNightlifeFeed($_townId);");
  }
  else if ($action == 'getListingsForMoviesFeed') {
    $result = mysql_query("CALL getListingsForMoviesFeed()");
  } 

  else if ($action == 'getRestaurantsOrTakeawaysByTownAndFoodStyle') {
    $_profileId = (empty($_GET['_profileId'])) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_foodStyleId = (empty($_GET['_foodStyleId'])) ? 0: mysql_real_escape_string($_GET['_foodStyleId']);
    $businessType = (empty($_GET['businessType'])) ? "": mysql_real_escape_string($_GET['businessType']);
    $result = mysql_query("CALL getRestaurantsOrTakeawaysByTownAndFoodStyle('$businessType', $_townId, $_foodStyleId, $_profileId)");
  }
  else if ($action == 'getMoviesByTownAndMovieStyle') {
    $_profileId = (empty($_GET['_profileId'])) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $_movieStyleId = (empty($_GET['_movieStyleId'])) ? 0: mysql_real_escape_string($_GET['_movieStyleId']);
    $result = mysql_query("CALL getMoviesByTownAndMovieStyle($_townId, $_movieStyleId, $_profileId)");
  }
  else if ($action == 'getBarsAndClubsByTown') {
    $_profileId = (empty($_GET['_profileId'])) ? 0: mysql_real_escape_string($_GET['_profileId']);
    $result = mysql_query("CALL getBarsAndClubsByTown($_townId, $_profileId)");
  }
  else if ($action == 'getPhoneNumberForListing') {
    $_listingId = $_GET['_listingId'];
    $listingType = $_GET['listingType'];
      
    $result = mysql_query("CALL getPhoneNumberForListing($_listingId, '$listingType')");
  }
  //print(json_encode($_usersId));
  
    if ($action != 'getListingsForFoodFeed'
        && $action != 'getListingsForNightlifeFeed'
        && $action != 'getListingsForFeed') {
        while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        if ($action != 'getPhoneNumberForListing') {
            shuffle($output);
        }
    }
    else {
        $output = prepareListingsOutputObj($result_listings);
        $result = array_merge($output_offers, $output["listings"]);
        shuffle($result);
        $output = array_merge($output["listings_top"], $result);
    }
    
    header('Content-Type: application/json');
    echo json_encode($output);
  
    if ($action == 'getListingsForFoodFeed') {
        mysqli_close($db_con);
    } else {
        mysql_close();
    }
?>
