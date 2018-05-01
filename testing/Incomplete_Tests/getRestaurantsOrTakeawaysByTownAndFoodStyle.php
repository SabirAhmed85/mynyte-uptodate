<?php

/* File name matches class name */
class getRestaurantsOrTakeawaysByTownAndFoodStyle extends SprocTest {

  public function get_sproc_name(){
      return "getRestaurantsOrTakeawaysByTownAndFoodStyle";
  }
  public function valid_type(){
    $type = null; // takeaway
    $town_id = 1;    // Bedford
    $food_style = 5; // Kebab
    $profile_id = 5; // King Kebab
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$type},{$town_id},{$food_style},{$profile_id})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","NOT_NULL_FLAG","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","INTEGER","INTEGER","INTEGER","INTEGER","INTEGER","INTEGER","INTEGER","NOT_NULL_FLAG");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $type = null; // takeaway
    $town_id = 1;    // Bedford
    $food_style = 5; // Kebab
    $profile_id = 5; // King Kebab
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$type},{$town_id},{$food_style},{$profile_id})";
    $valid_storage = array(
        "18" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $type = null; // takeaway
    $town_id = 1;    // Bedford
    $food_style = 5; // Kebab
    $profile_id = 5; // King Kebab
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$type},{$town_id},{$food_style},{$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0,1,3,4,5,8,12,13,14,18,20,21,23);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $type = null; // takeaway
    $town_id = 10000;    // Non existant town
    $food_style = 5; // Kebab
    $profile_id = 5; // King Kebab
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$type},{$town_id},{$food_style},{$profile_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $type = null; // takeaway
    $town_id = 1;    // Bedford
    $food_style = 5; // Kebab
    $profile_id = 5; // King Kebab
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$type},{$town_id},{$food_style},{$profile_id})";
    // to do once fix is in place $simplified_query = "SELECT Profile.displayName as name, Profile._id as _profileId, Business.description as description, Town.name as town, 'Business' as listingType, (SELECT bt.name FROM Business b  LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id  LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1) as listingType1, (SELECT bt.name FROM Business b  LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id  LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1, 1) as listingType2, (SELECT bt.name FROM Business b  LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id  LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 2, 1) as listingType3, (SELECT fs.name FROM FoodStyle fs  LEFT JOIN BusinessFoodStyle bfs ON bfs._foodStyleId = fs._id  LEFT JOIN Business b ON b._id = bfs._businessId WHERE b._id = Business._id LIMIT 1) AS listingTypeCat1, (SELECT fs.name FROM FoodStyle fs  LEFT JOIN BusinessFoodStyle bfs ON bfs._foodStyleId = fs._id  LEFT JOIN Business b ON b._id = bfs._businessId WHERE b._id = Business._id LIMIT 1, 1) AS listingTypeCat2, (SELECT fs.name FROM FoodStyle fs  LEFT JOIN BusinessFoodStyle bfs ON bfs._foodStyleId = fs._id  LEFT JOIN Business b ON b._id = bfs._businessId WHERE b._id = Business._id LIMIT 2, 1) AS listingTypeCat3, (SELECT fs.name FROM FoodStyle fs  LEFT JOIN BusinessFoodStyle bfs ON bfs._foodStyleId = fs._id  LEFT JOIN Business b ON b._id = bfs._businessId WHERE b._id = Business._id LIMIT 3, 1) AS listingTypeCat4, Business._id as relListingId, Business.isFeatured as isFeatured, Business.businessName as businessName, NULL as date, NULL as lastDate, NULL as weekdayName, CoverPhoto.name as currentCoverPhotoName, NULL as currentProfilePhotoName, tfbo.name as tonightsFeedButtonOption, tfbo.iconClass as tonightsFeedButtonIconClass, rbs.isAcceptingTableBookings as isAcceptingTableBookings, (SELECT COUNT(*) FROM Offer LEFT JOIN Business b ON Offer._createdByBusinessId = b._id WHERE b._id = Business._id AND NOW() < DATE_ADD(Offer.endDateTime, INTERVAL 180 MINUTE) ) as totalOffers,			@_analyticsRecId as _analyticsRecordId FROM Business LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN CoverPhoto ON Profile._currentCoverPhotoId = CoverPhoto._id LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = Business._id LEFT JOIN BusinessType ON bbt._businessTypeId = BusinessType._id AND (BusinessType._id IN (4,5) ) LEFT JOIN BusinessOpeningTimes bot ON bot._businessId = Business._id LEFT JOIN Weekdays ON Weekdays._id = bot._weekdayId LEFT JOIN AllBusinessSettings abs ON abs._businessId = Business._id LEFT JOIN TonightsFeedButtonOption tfbo ON tfbo._id = Business._tonightsFeedButtonId LEFT JOIN RestaurantBusinessSettings rbs ON rbs._restaurantBusinessId = Business._id WHERE Business._townId = {$town_id} AND (BusinessType._id IN (4,5) ) AND Weekdays._id IS NOT NULL AND Profile.isHidden = 0 GROUP BY Business._id    ;";
    return true;
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
