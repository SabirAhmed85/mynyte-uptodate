<?php

/* File name matches class name */
class getBarsAndClubsByTown extends SprocTest {

  public function get_sproc_name(){
      return "getBarsAndClubsByTown";
  }
  public function valid_type(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_types = array("STRING","STRING","STRING","STRING","STRING","STRING","STRING","INTEGER","NOT_NULL_FLAG","","STRING","STRING","INTEGER","INTEGER");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_storage = array(
        "10" => "IMAGEFILE",
        "11" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0,2,3,4,7,8,10,11);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 666111;    // Bedrock
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $simplified_query = "SELECT Profile.displayName as name, Business.description as description, Town.name as town, 'Business' as listingType, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1) as listingType1, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1, 1) as listingType2, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 2, 1) as listingType3, Business._id as relListingId, Business.isFeatured as isFeatured, NULL as date, ProfilePhoto.name as currentProfilePhotoName, CoverPhoto.name as currentCoverPhotoName, uef._typeId as 'follow', uel._typeId as 'like' FROM (SELECT b._id as _id FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE (bt._id = 2 OR bt._id = 3) AND b._townId = {$town_id} AND p._id = b._profileId AND p.isHidden = 0 GROUP BY b._id) tempTable LEFT JOIN Business ON Business._id = tempTable._id LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN CoverPhoto ON CoverPhoto._id = Profile._currentCoverPhotoId LEFT JOIN UserEngagement uef ON uef._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Business') AND uef._actionedListingId = Business._profileId AND uef._actionerProfileId = {$profile_id} AND uef._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Follow' LIMIT 1) LEFT JOIN UserEngagement uel ON uel._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Business') AND uel._actionedListingId = Business._profileId AND uel._actionerProfileId = {$profile_id} AND uel._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Like' LIMIT 1);";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
