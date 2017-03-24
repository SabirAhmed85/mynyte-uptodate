<?php
    require_once('../db-connect.php');
    
    $action = ($_GET['action'] == undefined) ? "": mysql_real_escape_string($_GET['action']);
    
    function sendJson ($result) {
        //print(json_encode($_usersId));
        while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
        //header('Content-Type: application/json');
        echo json_encode($output);
    }
    
    if ($action == 'insertTaxiDriver') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_taxiCompanyBusinessId = $dataJsonDecode->_taxiCompanyBusinessId;
        $_vehicleModelId = $dataJsonDecode->_vehicleModelId;
        $_vehicleColourId = $dataJsonDecode->_vehicleColourId;
        $vehicleRegistrationNumber = $dataJsonDecode->vehicleRegistrationNumber;
        $name = $dataJsonDecode->name;
        $_taxiBookingId = $dataJsonDecode->_taxiBookingId;
        $setToDispatched = $dataJsonDecode->setToDispatched;
        
        $result = mysql_query("CALL insertTaxiDriver($_taxiCompanyBusinessId, $_vehicleModelId, $_vehicleColourId, $$vehicleRegistrationNumber, $name, $_taxiBookingId, $setToDispatched);");
        
        sendJson($result);
    }
    elseif ($action == 'getAllVehicleMakes') {
        $result = mysql_query("CALL getAllVehicleMakes();");
        
        sendJson($result);
    }
    elseif ($action == 'getAllOrSpecificVehicleModels') {
        $_vehicleMakeId = $_GET['_vehicleMakeId'];
        $result = mysql_query("CALL getAllOrSpecificVehicleModels($_vehicleMakeId);");
        
        sendJson($result);
    }
    elseif ($action == 'getAllVehicleColours') {
        $result = mysql_query("CALL getAllVehicleColours();");
        
        sendJson($result);
    }
    elseif ($action == 'getTaxiBookingsForBusiness') {
        $mode = ($_GET['mode'] == undefined) ? "": mysql_real_escape_string($_GET['mode']);
        $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
        
        $result = mysql_query("CALL getTaxiBookingsForBusiness('$mode', $_businessId);");
        
        sendJson($result);
    }
    elseif ($action == 'getTaxiBookingForBusiness') {
        $_id = ($_GET['_id'] == undefined) ? "": mysql_real_escape_string($_GET['_id']);
        $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
        $result = mysql_query("CALL getTaxiBookingForBusiness('$_id', '$_businessId')");
                              
        sendJson($result);
    }
    elseif ($action == 'assignTaxiBookingToDriver') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_taxiBookingId = $dataJsonDecode->_taxiBookingId;
        $_taxiDriverId = $dataJsonDecode->_taxiDriverid;
        $setToDispatched = $dataJsonDecode->setToDispatched;
        
        $result = mysql_query("CALL assignTaxiBookingToDriver($_taxiBookingId, $_taxiDriverId, $setToDispatched)");
                              
        sendJson($result);
    }
    elseif ($action == 'bookTaxi') {
        $_relContactId = ($_GET['_relContactId'] == undefined || $_GET['_relContactId'] == 'null' || is_null($_GET['_relContactId'])) ? "NULL": "'".mysql_real_escape_string($_GET['_relContactId'])."'";
        
        $pickUpTown = ($_GET['pickUpTown'] == '') ? "Bedford": mysql_real_escape_string($_GET['pickUpTown']);
        
        $_pickUpPlaceId = ($_GET['pickUpPlaceId'] == undefined || $_GET['pickUpPlaceId'] == '') ? 0: mysql_real_escape_string($_GET['pickUpPlaceId']);
        $_dropOffPlaceId = ($_GET['dropOffPlaceId'] == undefined || $_GET['dropOffPlaceId'] == '') ? 0: mysql_real_escape_string($_GET['dropOffPlaceId']);
        $totalPassengers = ($_GET['totalPassengers'] == undefined) ? "": mysql_real_escape_string($_GET['totalPassengers']);
        
        $pickUpLongAddress = ($_GET['lookedUpPickUpLocation'] == undefined) ? "": mysql_real_escape_string($_GET['lookedUpPickUpLocation']);
        $pickUpAddressLine1 = ($_GET['pickUpAddressLine1'] == undefined) ? "": mysql_real_escape_string($_GET['pickUpAddressLine1']);
        $pickUpPostCode = ($_GET['pickUpPostCode'] == undefined) ? "": mysql_real_escape_string($_GET['pickUpPostCode']);
        
        $dropOffLongAddress = ($_GET['lookedUpDropOffLocation'] == undefined) ? "": mysql_real_escape_string($_GET['lookedUpDropOffLocation']);
        $dropOffAddressLine1 = ($_GET['dropOffAddressLine1'] == undefined) ? "": mysql_real_escape_string($_GET['dropOffAddressLine1']);
        $dropOffTown = ($_GET['dropOffTown'] == '') ? "Bedford": mysql_real_escape_string($_GET['dropOffTown']);
        $dropOffPostCode = ($_GET['dropOffPostCode'] == undefined) ? "": mysql_real_escape_string($_GET['dropOffPostCode']);
        
        $quickestIsRequired = $_GET['quickestIsRequired'];
        
        $result = mysql_query("CALL bookTaxi($_relContactId, '$pickUpTown', $_pickUpPlaceId, $_dropOffPlaceId, $totalPassengers, $quickestIsRequired, '$pickUpLongAddress', '$pickUpAddressLine1', '$pickUpPostCode', '$dropOffLongAddress', '$dropOffAddressLine1', '$dropOffPostCode');");
        //$result ="CALL bookTaxi($_relContactId, '$pickUpTown', $_pickUpPlaceId, $_dropOffPlaceId, $totalPassengers, $quickestIsRequired, '$pickUpLongAddress', '$pickUpAddressLine1', '$pickUpPostCode', '$dropOffLongAddress', '$dropOffAddressLine1', '$dropOffPostCode');";
        //print($result);
        sendJson($result);
    }
    elseif ($action == "respondToTaxiBookingRequest") {
        $_businessId = ($_GET['_businessId'] == undefined) ? "": mysql_real_escape_string($_GET['_businessId']);
        $_bookingId = ($_GET['_bookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_bookingId']);
        $lowestPrice = ($_GET['lowestPrice'] == undefined) ? "": mysql_real_escape_string($_GET['lowestPrice']);
        $quickestTime = ($_GET['quickestTime'] == undefined) ? "": mysql_real_escape_string($_GET['quickestTime']);
        
        $result = mysql_query("CALL insertTaxiBookingResponse('$_businessId','$_bookingId',$lowestPrice, $quickestTime);");
        
        sendJson($result);
        
    }
    elseif ($action == "getTaxiBookingForPerson") {
        $_taxiBookingId = ($_GET['_taxiBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_taxiBookingId']);
        
        $result = mysql_query("CALL getTaxiBookingForPerson($_taxiBookingId);");
        
        sendJson($result);
    }
    elseif ($action == "updateTaxiBookingByPerson") {
        $_taxiBookingId = ($_GET['_taxiBookingId'] == undefined) ? "": mysql_real_escape_string($_GET['_taxiBookingId']);
        $cancelled = ($_GET['cancelled'] == undefined) ? "": mysql_real_escape_string($_GET['cancelled']);
        $completed = ($_GET['completed'] == undefined) ? "": mysql_real_escape_string($_GET['completed']);
        
        $result = mysql_query("CALL personUpdateTaxiBooking($_taxiBookingId, '$cancelled', '$completed');");
    }
    elseif ($action == "maintainAllTaxiBookings") {
        $result = mysql_query(
        "CREATE TEMPORARY TABLE IF NOT EXISTS TempBookings AS (
            SELECT TaxiBooking.*,
                IF (TaxiBooking.quickestIsRequired = '1', MIN(TaxiBookingResponse.quickestTime), MIN(TaxiBookingResponse.lowestPrice))	as response,
                TaxiBookingResponse._id as _responseId,
                TaxiBookingResponse._businessId as _businessId
            FROM TaxiBooking 
                LEFT JOIN TaxiBookingResponse ON TaxiBooking._id = TaxiBookingResponse._taxiBookingId
            WHERE _claimedByBusinessId IS NULL 
            AND  autoExpired = 0
            AND NOW() > DATE_ADD(TaxiBooking.dateTimeCreated, INTERVAL 9 MINUTE)
            GROUP BY TaxiBooking._id
        );
    
        //Transaction
        UPDATE TaxiBooking
            LEFT JOIN TempBookings ON TempBookings._id = TaxiBooking._id
            SET TaxiBooking._claimedByBusinessId = TempBookings._businessId
        WHERE TempBookings._businessId IS NOT NULL;
            
        INSERT INTO Notification (_profileId, alertType, _relatedItemId, dateTimeCreated, hasBeenViewed)
            SELECT _requestedByPersonId, 'Taxi Booking Accepted', TempBookings._id, NOW(), 0 FROM TempBookings WHERE _requestedByPersonId IS NOT NULL AND _businessId IS NOT NULL;
        
        //Transaction
        UPDATE TaxiBooking
            LEFT JOIN TempBookings ON TempBookings._id = TaxiBooking._id
            SET TaxiBooking.autoExpired = 1
        WHERE TempBookings._businessId IS NULL;

        INSERT INTO Notification (_profileId, alertType, _relatedItemId, dateTimeCreated, hasBeenViewed)
            SELECT _requestedByPersonId, 'Taxi Booking Not Available', TempBookings._id, NOW(), 0 FROM TempBookings WHERE _requestedByPersonId IS NOT NULL AND _businessId IS NULL;");
    }
    
    mysql_close();
?>
