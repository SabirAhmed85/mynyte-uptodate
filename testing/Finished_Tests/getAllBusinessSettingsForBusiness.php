<?php

/* File name matches class name */
class getAllBusinessSettingsForBusiness extends SprocTest {

  public function get_sproc_name(){
      return "getAllBusinessSettingsForBusiness";
  }
  public function valid_type(){
    $business_id = 89;    // Tiger Lily
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$business_id})";
    $valid_types = array("NOT_NULL_FLAG","NOT_NULL_FLAG","NOT_NULL_FLAG","NOT_NULL_FLAG","INTEGER","NOT_NULL_FLAG","NOT_NULL_FLAG","NOT_NULL_FLAG","INTEGER","NOT_NULL_FLAG");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $business_id = 89;    // Tiger Lily
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$business_id})";
    $valid_storage = array();
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $business_id = 89;    // Tiger Lily
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$business_id})";
    $no_nulls_allowed_in_these_rows = array(7,8,9,10);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $business_id = 100000;    // Mysterious non-existant business
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$business_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $business_id = 89;    // Tiger Lily
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$business_id})";
    $simplified_query = "SELECT tbs.isAcceptingOnlineOrders , tbs.showTakeawayMenu , rbs.isAcceptingTableBookings , rbs.showCarteMenu , rbs.maxTableBookingGuests , rbs.allowCommentInTableBooking , tabs.isAcceptingTaxiBookings , abs.isSearchable , abs._tonightsFeedButtonOptionId , abs.isAcceptingEnquiries FROM Business b LEFT JOIN TakeawayBusinessSettings tbs ON tbs._takeawayBusinessId = 89 LEFT JOIN RestaurantBusinessSettings rbs ON rbs._restaurantBusinessId = 89 LEFT JOIN TaxiBusinessSettings tabs ON tabs._taxiBusinessId = 89 LEFT JOIN AllBusinessSettings abs ON abs._businessId = 89 WHERE b._id = 89;";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
