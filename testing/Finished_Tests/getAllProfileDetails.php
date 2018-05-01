<?php

/* File name matches class name */
class getAllProfileDetails extends SprocTest {

  public function get_sproc_name(){
      return "getAllProfileDetails";
  }
  public function valid_type(){
    $sproc_name = $this->get_sproc_name();
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$profile_id})";
    $valid_types = array("STRING","CHAR","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","INTEGER");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $sproc_name = $this->get_sproc_name();
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$profile_id})";
    $valid_storage = array(
        "2" => "EMAIL",
        "11" => "IMAGEFILE",
        "12" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $sproc_name = $this->get_sproc_name();
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0,1,2,5,7,10,11,12,13);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $sproc_name = $this->get_sproc_name();
    $profile_id = 0; // Non existant user.
    $query = "CALL {$sproc_name}({$profile_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $sproc_name = $this->get_sproc_name();
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$profile_id})";
    $simplified_query = "SELECT p.displayName , p.word , p.email , pe.firstName , pe.lastName , bp.addressLine1 as addressLine1 , bp.addressLine2 as addressLine2 , bp.postcode as postcode , b.description as description , b.phone1 as phone1 , b.businessName , cp.name as currentCoverPhotoName , pp.name as currentProfilePhotoName , p.wordLength FROM Profile p LEFT JOIN CoverPhoto cp ON cp._id = p._currentCoverPhotoId LEFT JOIN ProfilePhoto pp ON pp._id = p._currentProfilePhotoId LEFT JOIN Business b ON b._profileId = p._id LEFT JOIN BusinessPlace bp ON bp._businessId = b._id LEFT JOIN Person pe ON pe._profileId = p._id WHERE p._id = {$profile_id};";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
