<?php
	require_once('../functions/externalFunctions.php');
	
    require_once('../db-connect.php');
    
    $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);
    
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
        $mode = (empty($_GET['mode'])) ? "": mysql_real_escape_string($_GET['mode']);
        $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
        
        $result = mysql_query("CALL getTaxiBookingsForBusiness('$mode', $_businessId);");
        
        sendJson($result);
    }
    elseif ($action == 'getTaxiBookingForBusiness') {
        $_id = (empty($_GET['_id'])) ? "": mysql_real_escape_string($_GET['_id']);
        $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
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
        $_relContactId = (empty($_GET['_relContactId']) || $_GET['_relContactId'] == 'null' || is_null($_GET['_relContactId'])) ? "NULL": "'".mysql_real_escape_string($_GET['_relContactId'])."'";
        
        $pickUpTown = ($_GET['pickUpTown'] == '') ? "Bedford": mysql_real_escape_string($_GET['pickUpTown']);
        
        $_pickUpPlaceId = (empty($_GET['pickUpPlaceId']) || $_GET['pickUpPlaceId'] == '') ? 0: mysql_real_escape_string($_GET['pickUpPlaceId']);
        $_dropOffPlaceId = (empty($_GET['dropOffPlaceId']) || $_GET['dropOffPlaceId'] == '') ? 0: mysql_real_escape_string($_GET['dropOffPlaceId']);
        $totalPassengers = (empty($_GET['totalPassengers'])) ? "": mysql_real_escape_string($_GET['totalPassengers']);
        
        $pickUpLongAddress = (empty($_GET['lookedUpPickUpLocation'])) ? "": mysql_real_escape_string($_GET['lookedUpPickUpLocation']);
        $pickUpAddressLine1 = (empty($_GET['pickUpAddressLine1'])) ? "": mysql_real_escape_string($_GET['pickUpAddressLine1']);
        $pickUpPostCode = (empty($_GET['pickUpPostCode'])) ? "": mysql_real_escape_string($_GET['pickUpPostCode']);
        
        $dropOffLongAddress = (empty($_GET['lookedUpDropOffLocation'])) ? "": mysql_real_escape_string($_GET['lookedUpDropOffLocation']);
        $dropOffAddressLine1 = (empty($_GET['dropOffAddressLine1'])) ? "": mysql_real_escape_string($_GET['dropOffAddressLine1']);
        $dropOffTown = ($_GET['dropOffTown'] == '') ? "Bedford": mysql_real_escape_string($_GET['dropOffTown']);
        $dropOffPostCode = (empty($_GET['dropOffPostCode'])) ? "": mysql_real_escape_string($_GET['dropOffPostCode']);
        
        $quickestIsRequired = $_GET['quickestIsRequired'];
        
        $result = mysql_query("CALL bookTaxi($_relContactId, '$pickUpTown', $_pickUpPlaceId, $_dropOffPlaceId, $totalPassengers, $quickestIsRequired, '$pickUpLongAddress', '$pickUpAddressLine1', '$pickUpPostCode', '$dropOffLongAddress', '$dropOffAddressLine1', '$dropOffPostCode');");
        //print("CALL bookTaxi($_relContactId, '$pickUpTown', $_pickUpPlaceId, $_dropOffPlaceId, $totalPassengers, $quickestIsRequired, '$pickUpLongAddress', '$pickUpAddressLine1', '$pickUpPostCode', '$dropOffLongAddress', '$dropOffAddressLine1', '$dropOffPostCode');");
		
		$output = null;
    	while($row = mysql_fetch_assoc($result))
      		$output[] = $row;
			
		for ($i = 0; $i < count($output); $i++) {
			$emailCurl = externalCurl($root_url . 'sneak-preview/data/functions/email.php', 'action=informTaxiFirmOfTaxiBooking&email=' . $output[$i]['email']);
			
			if ($i == count($output) - 1) {
				echo json_encode($output);
			}
		}
    }
    elseif ($action == "respondToTaxiBookingRequest") {
        $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
        $_bookingId = (empty($_GET['_bookingId'])) ? "": mysql_real_escape_string($_GET['_bookingId']);
        $lowestPrice = (empty($_GET['lowestPrice'])) ? "": mysql_real_escape_string($_GET['lowestPrice']);
        $quickestTime = (empty($_GET['quickestTime'])) ? "": mysql_real_escape_string($_GET['quickestTime']);
        
        $result = mysql_query("CALL insertTaxiBookingResponse('$_businessId','$_bookingId',$lowestPrice, $quickestTime);");
        
        sendJson($result);
        
    }
    elseif ($action == "getTaxiBookingForPerson") {
        $_taxiBookingId = (empty($_GET['_taxiBookingId'])) ? "": mysql_real_escape_string($_GET['_taxiBookingId']);
        
        $result = mysql_query("CALL getTaxiBookingForPerson($_taxiBookingId);");
        
        sendJson($result);
    }
    elseif ($action == "updateTaxiBookingByPerson") {
        $_taxiBookingId = (empty($_GET['_taxiBookingId'])) ? "": mysql_real_escape_string($_GET['_taxiBookingId']);
        $cancelled = (empty($_GET['cancelled'])) ? "": mysql_real_escape_string($_GET['cancelled']);
        $completed = (empty($_GET['completed'])) ? "": mysql_real_escape_string($_GET['completed']);
        
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
