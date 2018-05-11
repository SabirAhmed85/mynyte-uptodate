<?php

/* File name matches class name */
class getListingsForMainFeed extends SprocTest {

  public function get_sproc_name(){
      return "getListingsForMainFeed";
  }
  public function valid_type(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","INTEGER","BIGINT","STRING","UNIQUE_KEY_FLAG","UNIQUE_KEY_FLAG","STRING","STRING","","STRING","INTEGER","INTEGER","INTEGER","BIGINT","BIGINT");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $valid_storage = array(
        "18" => "IMAGEFILE",
        "19" => "IMAGEFILE",
        "20" => "IMAGEFILE",
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $town_id = 1;    // Bedford
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0,1,3,4,5,8,12,13,14,18,25);
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
    $profile_id = 1; // Sabir's profile.
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$profile_id})";
    $simplified_query = "(SELECT b._id as _id, 'Business' as name FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._townId = {$town_id} AND bt._id NOT IN (1, 8, 9) AND p.isHidden = 0 GROUP BY b._id LIMIT 10) UNION ALL (SELECT e._id as _id, 'Event' as name FROM Event e LEFT JOIN Business b ON b._id = e._createdByBusinessId LEFT JOIN BusinessPlace bp ON e._businessPlaceId = bp._id LEFT JOIN Business b2 ON b2._id = bp._businessId LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN Profile p2 ON p2._id = b2._profileId WHERE (b._townId = {$town_id} OR b2._townId = {$town_id}) AND NOW() < e.lastDate AND p.isHidden = 0 AND p2.isHidden = 0 GROUP BY e._id LIMIT 5) UNION ALL (SELECT m._id as _id, 'Movie' as name FROM Movie m LEFT JOIN MovieCinema mc ON mc._movieId = m._id LEFT JOIN Business b ON b._id = mc._cinemaId LEFT JOIN Profile p ON p._id = b._profileId WHERE b._townId = {$town_id} AND NOW() < DATE_ADD(mc.showingEndDate, INTERVAL 1 DAY) AND p.isHidden = 0 GROUP BY m._id LIMIT 5);";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
