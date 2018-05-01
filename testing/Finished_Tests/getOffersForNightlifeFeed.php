<?php

/* File name matches class name */
class getOffersForNightlifeFeed extends SprocTest {
  public function get_sproc_name(){
      return "getOffersForNightlifeFeed";
  }
  public function valid_type(){
    $offersIdsString = "108"; // offer id - NEEDS UPDATED
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","","","STRING","","","","INTEGER","NOT_NULL_FLAG","STRING","UNIQUE_KEY_FLAG","UNIQUE_KEY_FLAG","STRING","STRING","STRING","","","BIGINT","BIGINT");
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
    $offersIdsString = "108"; // offer id - NEEDS UPDATED
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
    $offersIdsString = "108"; // offer id - NEEDS UPDATED
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$offersIdsString})";
    $simplified_query = "SELECT Offer.title as name, Profile._id as _profileId, IF(LENGTH(Offer.description) < 55, Offer.description, CONCAT(SUBSTRING(Offer.description, 1, 54), '...') ) as description, Town.name as town, 'Offer' as listingType, 'Offer' as listingType1, null as listingType2, null as listingType3, (SELECT name FROM OfferSubCategory WHERE _id = Offer._offerSubCategoryId) as listingTypeCat1, null as listingTypeCat2, null as listingTypeCat3, null as listingTypeCat4, Offer._id as relListingId, Business.isFeatured as isFeatured, Business.businessName as businessName, Offer.startDateTime as date, Offer.endDateTime as lastDate, (SELECT name FROM Weekdays WHERE _id = Offer.weekdayIndexId) as weekdayName, CoverPhoto.name as currentCoverPhotoName, ProfilePhoto.name as currentProfilePhotoName, NULL as tonightsFeedButtonOption, NULL as tonightsFeedButtonIconClass, (SELECT COUNT(*) FROM Offer o LEFT JOIN Business b ON o._createdByBusinessId = b._id WHERE b._id = Business._id AND NOW() < DATE_ADD(o.endDateTime, INTERVAL 180 MINUTE) ) as totalOffers, IF(ISNULL(eeebta._eventEntryBookingTypeId), 0, 1) as isAcceptingEntryBookings FROM Offer LEFT JOIN Business ON Business._id = Offer._createdByBusinessId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = Business._id LEFT JOIN BusinessType ON bbt._businessTypeId = BusinessType._id AND (BusinessType._id IN (2,3)) LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN CoverPhoto ON Offer._currentCoverPhotoId = CoverPhoto._id LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN EventOffer ON EventOffer._offerId = Offer._id LEFT JOIN Event ON Event._id = Offer._id LEFT JOIN EventEventEntryBookingTypeAllowed eeebta ON eeebta._eventId = Event._id WHERE Offer._id IN (', {$offersIdsString}, ');";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>