<?php

/* File name matches class name */
class getOfferIdsForNightlifeFeed extends SprocTest {

  public function get_sproc_name(){
      return "getOfferIdsForNightlifeFeed";
  }
  public function valid_type(){
    $town_id = 1;    // Bedford
    $analytics_id = 1;
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analytics_id})";
    $valid_types = array("INTEGER");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $town_id = 1;    // Bedford
    $analytics_id = 1;
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analytics_id})";
    $valid_storage = array();
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $town_id = 1;    // Bedford
    $analytics_id = 1;
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analytics_id})";
    $no_nulls_allowed_in_these_rows = array(0);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $town_id = 1111111;    // No existant town
    $analytics_id = 1;
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analytics_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $town_id = 1;    // Bedford
    $analytics_id = 1;
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id},{$analytics_id})";
    $simplified_query = "SELECT o._id as _id FROM Offer o LEFT JOIN Business b ON b._id = o._createdByBusinessId LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId LEFT JOIN EventOffer eo ON eo._offerId = o._id LEFT JOIN Event e ON e._id = eo._eventId WHERE b._townId = {$town_id} AND p.isHidden = 0 AND (NOW() > o.startDateTime || o.startDateTime IS NULL) AND (NOW() < o.endDateTime || o.endDateTime IS NULL) AND ( o.weekdayIndexId IS NULL OR ( o.weekdayIndexId IS NOT NULL AND (SELECT name FROM Weekdays WHERE _id = o.weekdayIndexId) = DAYNAME(NOW()) ) ) AND (e._id IS NULL || ( NOW() < e.lastDate AND NOW() > e.date AND ( e.weekdayIndexId IS NULL OR ( e.weekdayIndexId IS NOT NULL AND (SELECT name FROM Weekdays WHERE Weekdays._id = o.weekdayIndexId) = DAYNAME(NOW()) ) ) ) ) AND (bt._id IN (2,3) ) GROUP BY o._id;";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>