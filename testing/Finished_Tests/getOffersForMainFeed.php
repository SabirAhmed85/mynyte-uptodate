<?php

/* File name matches class name */
class getOffersForMainFeed extends SprocTest {
  public function get_sproc_name(){
      return "getOffersForMainFeed";
  }
  public function valid_type(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $offersIdsString = "1000"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id},{$offersIdsString})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","","","STRING","","","","INTEGER","NOT_NULL_FLAG","STRING","UNIQUE_KEY_FLAG","UNIQUE_KEY_FLAG","STRING","STRING","STRING","STRING","","INTEGER","INTEGER","BIGINT");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $offersIdsString = "1"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id},{$offersIdsString})";
    $valid_storage = array();
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $offersIdsString = "1"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id},{$offersIdsString})";
    $no_nulls_allowed_in_these_rows = array(0);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $town_id = 100000;    // Mysterious non-existant town
    $profile_id = 1; // Sabir's profile.
    $offersIdsString = "1"; // offer id
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id},{$offersIdsString})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $town_id = 11;
    $profile_id = 11;
    $sproc_name = $this->get_sproc_name();
    $offersIdsString = "106"; // offer id
    $query = "CALL {$sproc_name}({$town_id},{$profile_id},'{$offersIdsString}')";
    $simplified_query = "SELECT Offer.title as name, Profile._id as _profileId, IF(LENGTH(Offer.description) < 55,    Offer.description,   CONCAT(SUBSTRING(Offer.description, 1, 54), '...')  ) as description, Town.name as town, 'Offer' as listingType, 'Offer' as listingType1, null as listingType2, null as listingType3, (SELECT name FROM OfferSubCategory WHERE _id = Offer._offerSubCategoryId) as listingTypeCat1, NULL as listingTypeCat2, NULL as listingTypeCat3, NULL as listingTypeCat4, Offer._id as relListingId, Business.isFeatured as isFeatured, Business.businessName as businessName, Offer.startDateTime as date, Offer.endDateTime as lastDate, (SELECT name FROM Weekdays WHERE _id = Offer.weekdayIndexId) as weekdayName, (SELECT CASE     WHEN CoverPhoto.name IS NOT NULL THEN CoverPhoto.name    WHEN (CoverPhoto.name IS NULL AND cp2.name IS NOT NULL) THEN cp2.name    ELSE 'default.jpg' END) as currentCoverPhotoName,   IF(CoverPhoto.name IS NULL, 'default-offer.jpg', CoverPhoto.name) as currentOfferCoverPhotoName, ProfilePhoto.name as currentProfilePhotoName, NULL as follow, uel._typeId as 'like', uew._typeId as 'watch',   (SELECT COUNT(*) FROM Offer o LEFT JOIN Business b ON o._createdByBusinessId = b._id WHERE b._id = Business._id AND NOW() < DATE_ADD(o.endDateTime, INTERVAL 180 MINUTE) ) as totalOffers FROM Offer LEFT JOIN Business ON Business._id = Offer._createdByBusinessId LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN CoverPhoto ON Offer._currentCoverPhotoId = CoverPhoto._id LEFT JOIN CoverPhoto cp2 ON Profile._currentCoverPhotoId = cp2._id LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN UserEngagement uew  ON uew._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Offer') AND uew._actionedListingId = Offer._id AND uew._actionerProfileId = _profileId AND uew._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Watch' LIMIT 1) LEFT JOIN UserEngagement uel  ON uel._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Offer') AND uel._actionedListingId = Offer._id AND uel._actionerProfileId = _profileId AND uel._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Like' LIMIT 1) WHERE Offer._id IN ('{$offersIdsString}');";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
