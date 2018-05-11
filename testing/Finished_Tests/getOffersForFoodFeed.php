<?php

/* File name matches class name */
class getOffersForFoodFeed extends SprocTest {
  public function get_sproc_name(){
      return "getOffersForFoodFeed";
  }
  public function valid_type(){
    $offersIdsString = "108"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","","","STRING","","","","INTEGER","NOT_NULL_FLAG","STRING","UNIQUE_KEY_FLAG","UNIQUE_KEY_FLAG","STRING","STRING","STRING","","","NOT_NULL_FLAG","BIGINT");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $offersIdsString = "108"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $valid_storage = array(
        "19" => "IMAGEFILE"    
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $offersIdsString = "108"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $no_nulls_allowed_in_these_rows = array(0,1,2,3,4,5,8,12,13,14,15,16,19,23);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $offersIdsString = "10222228333"; // invalid id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $offersIdsString = "108"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $simplified_query = "SELECT Offer.title as name , Profile._id as _profileId , IF(LENGTH(Offer.description) < 55, Offer.description, CONCAT(SUBSTRING(Offer.description, 1, 54), '...')) as description , Town.name as town , 'Offer' as listingType , 'Offer' as listingType1 , null as listingType2 , null as listingType3 , (SELECT name FROM OfferSubCategory WHERE _id = Offer._offerSubCategoryId) as listingTypeCat1 , NULL as listingTypeCat2 , NULL as listingTypeCat3 , NULL as listingTypeCat4 , Offer._id as relListingId , Business.isFeatured as isFeatured , Business.businessName as businessName , Offer.startDateTime as date , Offer.endDateTime as lastDate , (SELECT name FROM Weekdays WHERE _id = Offer.weekdayIndexId) as weekdayName , CoverPhoto.name as currentCoverPhotoName , ProfilePhoto.name as currentProfilePhotoName , NULL as tonightsFeedButtonOption, NULL as tonightsFeedButtonIconClass , rbs.isAcceptingTableBookings as isAcceptingTableBookings , (SELECT COUNT(*) FROM Offer o LEFT JOIN Business b ON o._createdByBusinessId = b._id WHERE b._id = Business._id AND NOW() < DATE_ADD(o.endDateTime, INTERVAL 180 MINUTE) ) as totalOffers FROM Offer LEFT JOIN Business ON Business._id = Offer._createdByBusinessId LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN CoverPhoto ON Offer._currentCoverPhotoId = CoverPhoto._id LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN RestaurantBusinessSettings rbs ON rbs._restaurantBusinessId = Business._id WHERE Offer._id = {$offersIdsString};";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
