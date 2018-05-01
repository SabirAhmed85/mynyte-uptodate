<?php

/* File name matches class name */
class getMoviesByTownAndMovieStyle extends SprocTest {

  public function get_sproc_name(){
      return "getMoviesByTownAndMovieStyle";
  }
  public function valid_type(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $movie_style = 1; // Action
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$movie_style},{$profile_id})";
    $valid_types = array("BLOB","BLOB","STRING","BIGINT","STRING","STRING","INTEGER","BLOB","BLOB","BLOB","BLOB","BLOB","BLOB","INTEGER","INTEGER","BLOB");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $movie_style = 1; // Action
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$movie_style},{$profile_id})";
    $valid_storage = array(
        "1" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $movie_style = 1; // Action
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$movie_style},{$profile_id})";
    $no_nulls_allowed_in_these_rows = array(0,1,2,3,4,5,6,7,8,9);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 13333;    // Mars, Pluto? - No existant town.
    $movie_style = 1; // Action
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$movie_style},{$profile_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $sproc_name = $this->get_sproc_name();
    $town_id = 1;    // Bedford
    $movie_style = 1; // Action
    $profile_id = 1; // Sabir
    $query = "CALL {$sproc_name}({$town_id},{$movie_style},{$profile_id})";
    $simplified_query = "SELECT (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Title') as name ,(SELECT CONCAT('https://www.cineworld.co.uk', metaValue) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Poster URL') as currentCoverPhotoName ,(SELECT name FROM Town WHERE _id = {$town_id}) as town ,1 as isFeatured ,'Movie' as listingType ,'Movie' as listingType1 ,bei._id as relListingId ,(SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Release Date') as DATE ,beim2.metaValue as lastDate ,(SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 1) as listingTypeCat1 ,(SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 1, 1) as listingTypeCat2 ,(SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 2, 1) as listingTypeCat3 ,(SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 3, 1) as listingTypeCat4 ,uew._typeId as 'watch' ,uew._typeId as 'like' ,(SELECT IF(metaValue IS NULL, 0, metaValue) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Photo URL Top Pos') as photoUrlTopPos FROM BusinessEntityItem bei LEFT JOIN BusinessEntityItem bei2 ON bei2.type = 'Movie Showing' AND bei2._parentId IN ( SELECT b._id FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE bt.name = 'Cinema' AND b._townId = {$town_id} AND p.isHidden = 0 ) AND bei._id = ( SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei2._id AND metaName = '_Movie Id' ) LEFT JOIN BusinessEntityItemMeta beim2 ON beim2._businessEntityItemId = bei2._id AND beim2.metaName = ( SELECT metaName FROM BusinessEntityItemMeta WHERE _businessEntityItemId IN ( SELECT _id FROM BusinessEntityItem bei1 LEFT JOIN BusinessEntityItemMeta beim ON beim._businessEntityItemId = bei1._id AND beim.metaName = '_Movie Id' WHERE bei1.type = 'Movie Showing' AND bei._id = beim.metaValue ) AND LEFT(metaName, 11) = 'ShowingDate' ORDER BY STR_TO_DATE(metaValue, '%Y-%m-%d') DESC LIMIT 1 ) LEFT JOIN UserEngagement uew ON uew._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Movie') AND uew._actionedListingId = bei._id AND uew._actionerProfileId = {$profile_id} AND uew._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Watch' LIMIT 1) LEFT JOIN UserEngagement uel ON uel._actionedListingTypeId = (SELECT _id FROM ListingType WHERE name = 'Movie') AND uel._actionedListingId = bei._id AND uel._actionerProfileId = {$profile_id} AND uel._typeId = (SELECT _id FROM UserEngagementType WHERE name = 'Like' LIMIT 1) WHERE bei.type = 'Movie' AND ( ( bei._id IN ( SELECT beim._businessEntityItemId FROM BusinessEntityItemMeta beim WHERE beim.metaValue = {$movie_style} AND beim.metaName = '_Movie Genre Id' ) AND {$movie_style} IS NOT NULL ) OR ({$movie_style} = 0 AND ( SELECT COUNT(*) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = '_Movie Genre Id' ) > 0) ) AND CURDATE() < DATE_ADD(beim2.metaValue, INTERVAL 1 DAY) GROUP BY bei._id;";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
