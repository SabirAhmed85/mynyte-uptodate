<?php
    
  $action = $_GET['action'];
  
  if ($action == 'clearAllExpiredTransactionsExternal') {

    require_once('../db-connect.php');
  
    function sendMessage($deviceTokens, $contentsInner, $headingsInner, $dataObj){
		$contents = array(
			"en" => $contentsInner
			);
        $headings = array(
			"en" => $headingsInner
			);
		
		$fields = array(
			'app_id' => "5d38e847-c406-4e2e-85d6-27a76ce657f3",
			'include_player_ids' => $deviceTokens,
			'data' => $dataObj,
			'contents' => $contents,
            'headings' => $headings,
            'ios_badgType' => "Increase",
            'ios_badgeCount' => 1
		);
		
		$fields = json_encode($fields);
    	print("\nJSON sent:\n");
    	print($fields);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
												   'Authorization: Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

		$response = curl_exec($ch);
		curl_close($ch);
		
		return $response;
	}
	
    
    $result = mysql_query("CALL clearAllExpiredTransactionsExternal()");
    
    while($rowInitial = mysql_fetch_assoc($result)) {
        $outputInitial[] = $rowInitial;
    }
      
    if (count($outputInitial) > 0) {
        $fullNotificationsObject = array(
            "Taxi Booking Accepted" => array(
                "contents" => "Your Taxi Booking Request has been accepted.",
                "headings" => "Taxi Booking Confirmed",
                "dataObj" => array("actionFunction" => "goToMyNyteActivity"),
                "items" => array()
            ),
            "Taxi Booking Not Available" => array(
                "contents" => "Your Taxi Booking Request has not been accepted.",
                "headings" => "Taxi Booking Update",
                "dataObj" => array("actionFunction" => "goToMyNyteActivity"),
                "items" => array()
            ),
            "Table Booking Not Accepted" => array(
                "contents" => "Your Restaurant Table Booking Request has not been accepted.",
                "headings" => "Table Booking Update",
                "dataObj" => array("actionFunction" => "goToMyNyteActivity"),
                "items" => array()
            ),
            "Taxi Booking Won" => array(
                "contents" => "You've just won a Taxi Booking!",
                "headings" => "Taxi Booking Won",
                "dataObj" => array("actionFunction" =>"goToBusinessItems", "businessItemType" => "ownTaxiBookings"),
                "items" => array()
            )
        );
        
        function loopNotificationsObject ($fullNotificationsObject) {
            $fullNotificationsArray = array("Taxi Booking Accepted", "Taxi Booking Not Available", "Taxi Booking Not Accepted", "Taxi Booking Won" );
            
            $i = 0;
            while ($i < (count($fullNotificationsArray) - 1)) {
                $tokens = $fullNotificationsObject[$fullNotificationsArray[$i]]["items"];
                if (count($tokens) > 0) {
                    $alertType = $fullNotificationsArray[$i];
                    $contents = $fullNotificationsObject[$alertType]["contents"];
                    $headings = $fullNotificationsObject[$alertType]["headings"];
                    $dataObj = $fullNotificationsObject[$alertType]["dataObj"];
                    $tokens = $fullNotificationsObject[$alertType]["items"];
                    
                    $response = sendMessage($tokens, $contents, $headings, $dataObj);
                    $return["allresponses"] = $response;
                    $return = json_encode( $return);
                    
                    print("\n\nJSON received:\n");
                    print($return);
                    print("\n");
                }
                
                $i++;
            }
        }
        
        function loopResults ($i, $outputInitial, $fullNotificationsObject) {
            $alertType = $outputInitial[$i]["alertType"];
            array_push($fullNotificationsObject[$alertType]["items"], $outputInitial[$i]["oneSignalDeviceToken"]);
        
            if ($i < count($outputInitial) - 1) {
                loopResults($i+1, $outputInitial, $fullNotificationsObject);
            } else {
                loopNotificationsObject($fullNotificationsObject);
            }
        }
        
        loopResults(0, $outputInitial, $fullNotificationsObject);
        
    } else {
        print("No Results received");
    }
      
    mysql_close();
  }
?>
