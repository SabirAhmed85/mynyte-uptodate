<?php

/* File name matches class name */
class getListingsForNightlifeFeed extends SprocTest {

  public function get_sproc_name(){
      return "getListingsForNightlifeFeed";
  }
  public function valid_type(){
    $town_id = 1;    // Bedford
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id})";
    $valid_types = array("STRING","INTEGER","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","STRING","INTEGER","NOT_NULL_FLAG","STRING","UNIQUE_KEY_FLAG","UNIQUE_KEY_FLAG","STRING","STRING","STRING","STRING","STRING","BIGINT","BIGINT","BIGINT");
    return $this->valid_type_generic($query,$sproc_name,$valid_types);
  }
  public function valid_storage(){
    $town_id = 1;    // Bedford
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id})";
    $valid_storage = array(
        "18" => "IMAGEFILE"
    );
    return $this->valid_storage_generic($query,$sproc_name,$valid_storage);
  }
  public function check_for_nulls(){
    $town_id = 1;    // Bedford
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id})";
    $no_nulls_allowed_in_these_rows = array(0,1,3,4,5,12,13,14,18,20,21,22,23,24);
    return $this->check_for_nulls_generic($query,$sproc_name,$no_nulls_allowed_in_these_rows);
  }
  public function accurate_no_rows_returned(){
    $town_id = 133333;    // No existant town
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id})";
    return $this->accurate_no_rows_returned_generic($query,$sproc_name);
  }
  public function live_tests(){
    $town_id = 1;    // Bedford
    $sproc_name = $this->get_sproc_name();
    $query = "CALL {$sproc_name}({$town_id})";
    // May god have mercy on your soul. 
    $simplified_query = "(SELECT Profile.displayName as name, Profile._id as _profileId, Business.description as description, Town.name as town, 'Business' as listingType, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1) as listingType1, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 1, 1) as listingType2, (SELECT bt.name FROM Business b LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId WHERE b._id = Business._id LIMIT 2, 1) as listingType3, NULL as listingTypeCat1, NULL as listingTypeCat2, NULL as listingTypeCat3, NULL as listingTypeCat4, Business._id as relListingId, Business.isFeatured as isFeatured, Business.businessName as businessName, NULL as date, NULL as lastDate, NULL as weekdayName, CoverPhoto.name as currentCoverPhotoName, NULL as currentProfilePhotoName, tfbo.name as tonightsFeedButtonOption, tfbo.iconClass as tonightsFeedButtonIconClass, (SELECT COUNT(*) FROM Offer LEFT JOIN Business b ON Offer._createdByBusinessId = b._id WHERE b._id = Business._id AND NOW() < DATE_ADD(Offer.endDateTime, INTERVAL 180 MINUTE) ) as totalOffers, 0 as isAcceptingEntryBookings, @_analyticsRecId as _analyticsRecordId FROM ((SELECT b._id as _id, 'Business' as name FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId LEFT JOIN BusinessOpeningTimes bot ON bot._businessId = b._id LEFT JOIN Weekdays w ON w._id = bot._weekdayId WHERE b._townId = {$town_id} AND (bt._id in (2,3)) AND w._id IS NOT NULL AND p.isHidden = 0 GROUP BY b._id ) UNION ALL (SELECT e._id as _id, 'Event' as name FROM Event e LEFT JOIN Business b ON b._id = e._createdByBusinessId LEFT JOIN BusinessPlace bp ON e._businessPlaceId = bp._id LEFT JOIN Business b2 ON b2._id = bp._businessId LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN Profile p2 ON p2._id = b2._profileId WHERE (b._townId = {$town_id} OR b2._townId = {$town_id}) AND p.isHidden = 0 AND p2.isHidden = 0 AND ( ( DATE(NOW()) = DATE(e.lastDate) AND e.weekdayIndexId IS NULL ) OR ( e.weekdayIndexId IS NOT NULL AND NOW() > e.date AND NOW() < e.lastDate AND (SELECT name FROM Weekdays WHERE _id = e.weekdayIndexId) = DAYNAME(NOW()) ) ) GROUP BY e._id )) tempTable LEFT JOIN Business ON Business._id = tempTable._id LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN CoverPhoto ON Profile._currentCoverPhotoId = CoverPhoto._id LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = Business._id LEFT JOIN BusinessType ON bbt._businessTypeId = BusinessType._id AND (BusinessType._id IN (2,3)) LEFT JOIN AllBusinessSettings abs ON abs._businessId = Business._id LEFT JOIN TonightsFeedButtonOption tfbo ON tfbo._id = Business._tonightsFeedButtonId WHERE tempTable.name = 'Business' GROUP BY Business._id) UNION ALL (SELECT Event.name as name, Profile._id as _profileId, Event.description as description, Town.name as town, 'Event' as listingType, 'Event' as listingType1, null as listingType2, null as listingType3, (SELECT ms.name FROM MusicStyle ms LEFT JOIN EventMusicStyle ems ON ems._musicStyleId = ms._id LEFT JOIN Event e ON e._id = ems._eventId WHERE e._id = Event._id LIMIT 1) as listingTypeCat1, (SELECT ms.name FROM MusicStyle ms LEFT JOIN EventMusicStyle ems ON ems._musicStyleId = ms._id LEFT JOIN Event e ON e._id = ems._eventId WHERE e._id = Event._id LIMIT 1, 1) as listingTypeCat2, (SELECT ms.name FROM MusicStyle ms LEFT JOIN EventMusicStyle ems ON ems._musicStyleId = ms._id LEFT JOIN Event e ON e._id = ems._eventId WHERE e._id = Event._id LIMIT 2, 1) as listingTypeCat3, (SELECT ms.name FROM MusicStyle ms LEFT JOIN EventMusicStyle ems ON ems._musicStyleId = ms._id LEFT JOIN Event e ON e._id = ems._eventId WHERE e._id = Event._id LIMIT 3, 1) as listingTypeCat4, Event._id as relListingId, Business.isFeatured as isFeatured, Business.businessName as businessName, Event.date as date, Event.lastDate as lastDate, (SELECT name FROM Weekdays WHERE _id = Event.weekdayIndexId) as weekdayName, CoverPhoto.name as currentCoverPhotoName, ProfilePhoto.name as currentProfilePhotoName, tfbo.name as tonightsFeedButtonOption, tfbo.iconClass as tonightsFeedButtonIconClass, (SELECT COUNT(*) FROM EventOffer WHERE _eventId = Event._id) as totalOffers, IF(ISNULL(eeebta._eventEntryBookingTypeId), 0, 1) as isAcceptingEntryBookings, @_analyticsRecId as _analyticsRecordId FROM ((SELECT b._id as _id, 'Business' as name FROM Business b LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN BusinessBusinessType bbt ON bbt._businessId = b._id LEFT JOIN BusinessType bt ON bt._id = bbt._businessTypeId LEFT JOIN BusinessOpeningTimes bot ON bot._businessId = b._id LEFT JOIN Weekdays w ON w._id = bot._weekdayId WHERE b._townId = {$town_id} AND (bt._id in (2,3)) AND w._id IS NOT NULL AND p.isHidden = 0 GROUP BY b._id ) UNION ALL (SELECT e._id as _id, 'Event' as name FROM Event e LEFT JOIN Business b ON b._id = e._createdByBusinessId LEFT JOIN BusinessPlace bp ON e._businessPlaceId = bp._id LEFT JOIN Business b2 ON b2._id = bp._businessId LEFT JOIN Profile p ON p._id = b._profileId LEFT JOIN Profile p2 ON p2._id = b2._profileId WHERE (b._townId = {$town_id} OR b2._townId = {$town_id}) AND p.isHidden = 0 AND p2.isHidden = 0 AND ( ( DATE(NOW()) = DATE(e.lastDate) AND e.weekdayIndexId IS NULL ) OR ( e.weekdayIndexId IS NOT NULL AND NOW() > e.date AND NOW() < e.lastDate AND (SELECT name FROM Weekdays WHERE _id = e.weekdayIndexId) = DAYNAME(NOW()) ) ) GROUP BY e._id )) tempTable2 LEFT JOIN Event ON Event._id = tempTable2._id LEFT JOIN BusinessPlace ON BusinessPlace._id = Event._businessPlaceId LEFT JOIN Business ON Business._id = BusinessPlace._businessId LEFT JOIN Business b2 ON b2._id = Event._createdByBusinessId LEFT JOIN Profile ON Profile._id = Business._profileId LEFT JOIN CoverPhoto ON Event._currentCoverPhotoId = CoverPhoto._id LEFT JOIN ProfilePhoto ON ProfilePhoto._id = Profile._currentProfilePhotoId LEFT JOIN Town ON Business._townId = Town._id LEFT JOIN TonightsFeedButtonOption tfbo ON tfbo._id = Event._tonightsFeedButtonOptionId LEFT JOIN EventEventEntryBookingTypeAllowed eeebta ON eeebta._eventId = Event._id WHERE tempTable2.name = 'Event' GROUP BY Event._id);";
    return $this->live_tests_generic($query,$simplified_query,$sproc_name);
  }
}

?>
