<?php
    require_once('../db-connect.php');
    
    $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);

    if ($action == 'createEvent' || $action == 'updateEvent') {
        $_businessPlaceId = (empty($_GET['_businessPlaceId'])) ? "": mysql_real_escape_string($_GET['_businessPlaceId']);
        $eventTitle = (empty($_GET['eventTitle'])) ? "": mysql_real_escape_string($_GET['eventTitle']);
        $description = (empty($_GET['description'])) ? "": mysql_real_escape_string($_GET['description']);
        $eventDateTime = (empty($_GET['eventDateTime'])) ? "": mysql_real_escape_string($_GET['eventDateTime']);
        $dressCode = (empty($_GET['dressCode'])) ? "": mysql_real_escape_string($_GET['dressCode']);
        $eventHasGuestList = (empty($_GET['eventHasGuestList'])) ? "": mysql_real_escape_string($_GET['eventHasGuestList']);
        $dealsOnTheNight = (empty($_GET['dealsOnTheNight'])) ? "": mysql_real_escape_string($_GET['dealsOnTheNight']);
        $extraInfo = (empty($_GET['extraInfo'])) ? "": mysql_real_escape_string($_GET['extraInfo']);
        $guestListMax = (empty($_GET['guestListMax'])) ? "": mysql_real_escape_string($_GET['guestListMax']);
        $weekdayIndex = (empty($_GET['weekdayIndex'])) ? "": mysql_real_escape_string($_GET['weekdayIndex']);
        $weeksAhead = (empty($_GET['weeksAhead'])) ? "": mysql_real_escape_string($_GET['weeksAhead']);

        $_musicStyleIds = $_GET['_musicStyleIds'];
        $musicStyleIdString = ( $_musicStyleIds != undefined ? implode(', ', $_musicStyleIds) : "");

        if ($action == 'createEvent') {
            $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
            $sqlQuery = mysql_query("CALL createEvent($_businessId, $_businessPlaceId, '$eventTitle', '$description', '$eventDateTime', '$dressCode', '$dealsOnTheNight', '$extraInfo', $eventHasGuestList, $guestListMax, 0, $weekdayIndex, $weeksAhead, '$musicStyleIdString', @_eventId)");
            $sqlQuery2 = mysql_query("SELECT @_eventId as _eventId");
            $output = mysql_fetch_object($sqlQuery2);
            $output = $output -> _eventId;
            echo json_encode($output);
        } else {
            $_eventId = (empty($_GET['_eventId'])) ? "": mysql_real_escape_string($_GET['_eventId']);
            $sqlQuery = "CALL updateEvent($_eventId, $_businessPlaceId, '$eventTitle', '$description', '$eventDateTime', '$dressCode', '$dealsOnTheNight', '$extraInfo', $eventHasGuestList, $guestListMax, 0, $weekdayIndex, $weeksAhead, '$musicStyleIdString')";
            $result = mysql_query($sqlQuery);
        }
  
    }
    elseif ($action == 'createEventEntryBooking') {
        $_eventId = (empty($_GET['_eventId'])) ? "": mysql_real_escape_string($_GET['_eventId']);
        $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        $eventDate = (empty($_GET['eventDate'])) ? "": mysql_real_escape_string($_GET['eventDate']);
        $additionalGuests = (empty($_GET['additionalGuests'])) ? "": mysql_real_escape_string($_GET['additionalGuests']);
        $bookingType = (empty($_GET['bookingType'])) ? "": mysql_real_escape_string($_GET['bookingType']);

        $result = mysql_query("CALL createEventEntryBooking($_eventId, $_profileId, '$eventDate', $additionalGuests, '$bookingType')");
        //print("CALL createEventEntryBooking($_eventId, $_profileId, '$eventDate', $additionalGuests, '$bookingType')");
    }
    elseif ($action == 'getEventEntryBooking') {
        $_eventEntryBookingId = (empty($_GET['_entryBookingId'])) ? "": mysql_real_escape_string($_GET['_entryBookingId']);

        $result = mysql_query("CALL getEventEntryBooking($_eventEntryBookingId)");
    }
    elseif ($action == 'updateEventEntryBookingByPerson') {
        $_eventEntryBookingId = (empty($_GET['_entryBookingId'])) ? "": mysql_real_escape_string($_GET['_entryBookingId']);
        $_eventDateId = (empty($_GET['_eventDateId'])) ? "": mysql_real_escape_string($_GET['_eventDateId']);
        $addGuests = (empty($_GET['addGuests'])) ? "": mysql_real_escape_string($_GET['addGuests']);
        $cancelled = (empty($_GET['cancelled'])) ? "": mysql_real_escape_string($_GET['cancelled']);

        $result = mysql_query("CALL personUpdateEventEntryBooking($_eventEntryBookingId, $_eventDateId, $addGuests, '$cancelled')");
    }
    elseif ($action == 'getEvents') {
        $_eventId = 0;
        $_businessId = 0;
        $_musicStyleId = 0;
        $_townId = 0;
        $_profileId = 0;
        
        $timeScale = (empty($_GET['timeScale'])) ? "": mysql_real_escape_string($_GET['timeScale']);

        if (isset($_GET['_profileId'])) {
            $_profileId = $_GET['_profileId'];
        }
        if (isset($_GET['_businessId'])) {
            $_businessId = $_GET['_businessId'];
        }
        elseif ($_GET['_townId']) {
            $_townId = (empty($_GET['_townId'])) ? "": mysql_real_escape_string($_GET['_townId']);
            if (isset($_GET['_musicStyleId'])) {
                $_musicStyleId = (empty($_GET['_musicStyleId'])) ? "0": mysql_real_escape_string($_GET['_musicStyleId']);
            }
        }
        elseif (isset($_GET['_eventId']) || isset($_GET['getDates'])) {
            $_eventId = (empty($_GET['_eventId'])) ? "": mysql_real_escape_string($_GET['_eventId']);
        }
        
        if (isset($_GET['getDates'])) {
            $result = mysql_query("CALL getEventDateDetails($_eventId, $_profileId)");
        } else {
            $format = $_GET['format'];
            $result = mysql_query("CALL getEvent('$timeScale', $_businessId, $_townId, $_musicStyleId, $_eventId, $_profileId, '$format')");
        }
    }
    
    if ($action == 'updateEvent' || $action == 'getEvents' || $action == 'getEventEntryBooking' || $action == 'createEventEntryBooking') {
        //print(json_encode($_usersId));
        $result = ($result === null) ? array() : $result;
        $output = null;
        while($row = mysql_fetch_assoc($result))
        $output[] = $row;

        //header('Content-Type: application/json');
        echo json_encode($output);
    }
    
    mysql_close();
?>
