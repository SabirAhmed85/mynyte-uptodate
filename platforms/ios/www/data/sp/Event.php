<?php
    require_once('../db-connect.php');
    
    $action = ($_GET['action'] == undefined) ? "": mysql_real_escape_string($_GET['action']);

    if ($action == 'createEvent' || $action == 'updateEvent') {
        $_businessPlaceId = ($_GET['_businessPlaceId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessPlaceId']);
        $eventTitle = ($_GET['eventTitle'] == undefined) ? "": mysql_real_escape_string($_GET['eventTitle']);
        $description = ($_GET['description'] == undefined) ? "": mysql_real_escape_string($_GET['description']);
        $eventDateTime = ($_GET['eventDateTime'] == undefined) ? "": mysql_real_escape_string($_GET['eventDateTime']);
        $dressCode = ($_GET['dressCode'] == undefined) ? "": mysql_real_escape_string($_GET['dressCode']);
        $eventHasGuestList = ($_GET['eventHasGuestList'] == undefined) ? "": mysql_real_escape_string($_GET['eventHasGuestList']);
        $dealsOnTheNight = ($_GET['dealsOnTheNight'] == undefined) ? "": mysql_real_escape_string($_GET['dealsOnTheNight']);
        $extraInfo = ($_GET['extraInfo'] == undefined) ? "": mysql_real_escape_string($_GET['extraInfo']);
        $guestListMax = ($_GET['guestListMax'] == undefined) ? "": mysql_real_escape_string($_GET['guestListMax']);
        $weekdayIndex = ($_GET['weekdayIndex'] == undefined) ? "": mysql_real_escape_string($_GET['weekdayIndex']);
        $weeksAhead = ($_GET['weeksAhead'] == undefined) ? "": mysql_real_escape_string($_GET['weeksAhead']);

        $_musicStyleIds = $_GET['_musicStyleIds'];
        $musicStyleIdString = ( $_musicStyleIds != undefined ? implode(', ', $_musicStyleIds) : "");

        if ($action == 'createEvent') {
            $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
            $sqlQuery = mysql_query("CALL createEvent($_businessId, $_businessPlaceId, '$eventTitle', '$description', '$eventDateTime', '$dressCode', '$dealsOnTheNight', '$extraInfo', $eventHasGuestList, $guestListMax, 0, $weekdayIndex, $weeksAhead, '$musicStyleIdString', @_eventId)");
            $sqlQuery2 = mysql_query("SELECT @_eventId");
            $output = mysql_fetch_array($sqlQuery2)["@_eventId"];
            echo json_encode($output);
        } else {
            $_eventId = ($_GET['_eventId'] == undefined) ? "": mysql_real_escape_string($_GET['_eventId']);
            $sqlQuery = "CALL updateEvent($_eventId, $_businessPlaceId, '$eventTitle', '$description', '$eventDateTime', '$dressCode', '$dealsOnTheNight', '$extraInfo', $eventHasGuestList, $guestListMax, 25, $weekdayIndex, $weeksAhead, '$musicStyleIdString')";
            $result = mysql_query($sqlQuery);
        }
  
    }
    elseif ($action == 'createEventEntryBooking') {
        $_eventId = ($_GET['_eventId'] == undefined) ? "": mysql_real_escape_string($_GET['_eventId']);
        $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
        $eventDate = ($_GET['eventDate'] == undefined) ? "": mysql_real_escape_string($_GET['eventDate']);
        $additionalGuests = ($_GET['additionalGuests'] == undefined) ? "": mysql_real_escape_string($_GET['additionalGuests']);
        $bookingType = ($_GET['bookingType'] == undefined) ? "": mysql_real_escape_string($_GET['bookingType']);

        $result = mysql_query("CALL createEventEntryBooking($_eventId, $_profileId, '$eventDate', $additionalGuests, '$bookingType')");
        print("CALL createEventEntryBooking($_eventId, $_profileId, '$eventDate', $additionalGuests, '$bookingType')");
    }
    elseif ($action == 'getEventEntryBooking') {
        $_eventEntryBookingId = ($_GET['_entryBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_entryBookingId']);

        $result = mysql_query("CALL getEventEntryBooking($_eventEntryBookingId)");
    }
    elseif ($action == 'updateEventEntryBookingByPerson') {
        $_eventEntryBookingId = ($_GET['_entryBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_entryBookingId']);
        $_eventDateId = ($_GET['_eventDateId'] == undefined) ? "": mysql_real_escape_string($_GET['_eventDateId']);
        $addGuests = ($_GET['addGuests'] == undefined) ? "": mysql_real_escape_string($_GET['addGuests']);
        $cancelled = ($_GET['cancelled'] == undefined) ? "": mysql_real_escape_string($_GET['cancelled']);

        $result = mysql_query("CALL personUpdateEventEntryBooking($_eventEntryBookingId, $_eventDateId, $addGuests, '$cancelled')");
    }
    elseif ($action == 'getEvents') {
        $_eventId = 0;
        $_businessId = 0;
        $_musicStyleId = 0;
        $_townId = 0;
        
        $timeScale = ($_GET['timeScale'] == undefined) ? "": mysql_real_escape_string($_GET['timeScale']);
        if (isset($_GET['_businessId'])) {
            $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
        }
        elseif ($_GET['_townId']) {
            $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
            if (isset($_GET['_musicStyleId'])) {
                $_musicStyleId = ($_GET['_musicStyleId'] == undefined) ? "": mysql_real_escape_string($_GET['_musicStyleId']);
                $result1 = mysql_query("CALL updateAnalyticsClubnightSearch('$_townId','$_musicStyleId');");
            }
        }
        elseif (isset($_GET['_eventId']) || isset($_GET['getDates'])) {
            $_eventId = ($_GET['_eventId'] == undefined) ? "": mysql_real_escape_string($_GET['_eventId']);
            $_profileId = ($_GET['_profileId'] == undefined) ? "": mysql_real_escape_string($_GET['_profileId']);
        }
        
        if (isset($_GET['getDates'])) {
            $result = mysql_query("CALL getEventDateDetails($_eventId, $_profileId)");
        } else {
            $result = mysql_query("CALL getEvent('$timeScale', $_businessId, $_townId, $_musicStyleId, $_eventId)");
        }
    }
    
    if ($action == 'getEvents' || $action == 'getEventEntryBooking') {
        //print(json_encode($_usersId));
        while($row = mysql_fetch_assoc($result))
        $output[] = $row;

        //header('Content-Type: application/json');
        echo json_encode($output);
    }
    
    mysql_close();
?>
