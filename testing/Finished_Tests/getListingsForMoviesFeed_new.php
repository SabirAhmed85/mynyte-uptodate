<?php

/* File name matches class name */
class getListingsForMoviesFeed_new extends SprocTest {

  public function get_sproc_name(){
      return "getListingsForMoviesFeed_new";
  }
  public function valid_type(){
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}()";
    $valid_types = array("INTEGER","INTEGER","STRING","INTEGER","STRING","BLOB","BLOB","BLOB","BLOB","BLOB","STRING","STRING","BLOB","BLOB","STRING","STRING","BLOB","BLOB","BLOB","BLOB","INTEGER","BIGINT");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}()";
    $valid_storage = array(
        "12" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $sproc_name = $this->get_sproc_name(); //9,13, 18, 17, 16, 19, 20, 21
    $query = "CALL {$sproc_name}()";
    $no_nulls_allowed_in_these_rows = array(0,1,2,3,4,5,6,7,3,10,11,12,14,15);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    //$sproc_name = $this->get_sproc_name();
    //$query = "CALL {$sproc_name}()";
    //return $this->accurate_no_rows_returned_generic($query,$sproc_name);
    // Limited in how we can test this one as is does not filter the data.
    return true;
  }
  public function live_tests(){
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}()";
    $simplified_query = "(SELECT bei.*, beim.*, (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Title') as movieTitle, (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Rating') as rating, (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Release Year') as releaseYear, (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Cineworld Edi') as cineworldEdi, (SELECT name FROM TonightsFeedButtonOption WHERE _id = (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = '_Tonights Feed Button Option Id')) as tonightsFeedButtonOption, (SELECT iconClass FROM TonightsFeedButtonOption WHERE _id = (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = '_Tonights Feed Button Option Id')) as tonightsFeedButtonIconClass, (SELECT metaValue FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Poster URL') as currentCoverPhotoName, (SELECT IF(metaValue IS NULL, 0, metaValue) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = bei._id AND metaName = 'Photo URL Top Pos') as photoUrlTopPos, 'Movie' as listingType, 'Movie' as listingType1, (SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 1) as listingTypeCat1, (SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 1, 1) as listingTypeCat2, (SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 2, 1) as listingTypeCat3, (SELECT acim.metaValue FROM AppConfigItem aci LEFT JOIN AppConfigItemMeta acim ON acim._appConfigItemId = aci._id AND acim.metaName = 'Genre Name' LEFT JOIN BusinessEntityItemMeta beim ON beim.metaValue = aci._id WHERE beim._businessEntityItemId = bei._id AND beim.metaName = '_Movie Genre Id' LIMIT 3, 1) as listingTypeCat4, bei._id as relListingId, 1 as isFeatured FROM (SELECT bei._id as _id FROM BusinessEntityItem bei LEFT JOIN BusinessEntityItemMeta beim ON beim.metaName = '_Movie Id' AND beim.metaValue = bei._id LEFT JOIN BusinessEntityItem bei2 ON bei2._id = beim._businessEntityItemId AND bei2.type = 'Movie Showing' LEFT JOIN BusinessEntityItemMeta beim2 ON beim2._businessEntityItemId = bei2._id AND LEFT(beim2.metaName, 11) = 'ShowingDate' WHERE bei.type = 'Movie' AND CURDATE() = beim2.metaValue GROUP BY bei._id) tt LEFT JOIN BusinessEntityItem bei ON bei._id = tt._id LEFT JOIN BusinessEntityItemMeta beim ON ( (beim._businessEntityItemId = bei._id AND beim.metaName = 'Title') OR (beim.metaName = '_Movie Id' AND beim.metaValue = bei._id) ) LIMIT 0, 18446744073709551615) UNION ALL (SELECT bei.*, beim3.*, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL FROM (SELECT bei._id as _id FROM BusinessEntityItem bei LEFT JOIN BusinessEntityItemMeta beim ON beim.metaName = '_Movie Id' AND beim.metaValue = bei._id LEFT JOIN BusinessEntityItem bei2 ON bei2._id = beim._businessEntityItemId AND bei2.type = 'Movie Showing' LEFT JOIN BusinessEntityItemMeta beim2 ON beim2._businessEntityItemId = bei2._id AND LEFT(beim2.metaName, 11) = 'ShowingDate' WHERE bei.type = 'Movie' AND CURDATE() = beim2.metaValue GROUP BY bei._id) tt LEFT JOIN BusinessEntityItem bei ON bei._id = tt._id LEFT JOIN BusinessEntityItemMeta beim1 ON beim1.metaName = '_Movie Id' AND beim1.metaValue = bei._id LEFT JOIN BusinessEntityItem bei1 ON bei1._id = beim1._businessEntityItemId LEFT JOIN BusinessEntityItemMeta beim ON beim._businessEntityItemId = beim1._businessEntityItemId AND LEFT(beim.metaName, 11) = 'ShowingDate' LEFT JOIN BusinessEntityItemMeta beim3 ON beim3._businessEntityItemId = beim._businessEntityItemId WHERE CURDATE() = beim.metaValue AND ( (LEFT(beim3.metaName, 11) = 'ShowingDate' AND beim3.metaValue = CURDATE()) OR (LEFT(beim3.metaName, 11) = 'ShowingTime' AND ( SELECT metaValue FROM BusinessEntityItemMeta WHERE metaName = CONCAT('ShowingDate', RIGHT(beim3.metaName, CHAR_LENGTH(beim3.metaName) - 11)) AND _businessEntityItemId = bei1._id ) = CURDATE()) ) AND bei1._parentId IN ( SELECT b._id FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE bt.name = 'Cinema' AND b._townId = 1 AND p.isHidden = 0 ) AND bei1.type = 'Movie Showing' ORDER BY RIGHT(beim3.metaName, CHAR_LENGTH(beim3.metaName) - 11) ASC LIMIT 0, 18446744073709551615)";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
