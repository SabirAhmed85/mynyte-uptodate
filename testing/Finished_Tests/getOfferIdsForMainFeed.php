<?php

/* File name matches class name */
class getOfferIdsForMainFeed extends SprocTest {
  public function get_sproc_name(){
      return "getOfferIdsForMainFeed";
  }
  public function valid_type(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_types = array("INTEGER");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_storage = array();
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $town_id = 100000;    // Mysterious non-existant town
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $town_id = 1;    // Bedford
    $analyticsRecId = 1; // Analytics record
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analyticsRecId})";
    $simplified_query = "SELECT o._id as _id FROM Offer o LEFT JOIN Business b ON b._id = o._createdByBusinessId LEFT JOIN Profile p ON p._id = b._profileId WHERE b._townId = {$town_id} AND p.isHidden = 0 AND NOW() < o.endDateTime;";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
