<?php
    function externalCurl ($url, $vars) {
		$ch = curl_init( $url );
		curl_setopt( $ch, CURLOPT_POST, 1);
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $vars);
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt( $ch, CURLOPT_HEADER, 0);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
	
		$response = curl_exec( $ch );
		curl_close($ch);
		
		return $response;
	}
	
	function sendTextMessage ($phone, $msg, $sender) {
		$objIntelliSMS = new IntelliSMS();

      	$objIntelliSMS->Username = 'mynyte';
      	$objIntelliSMS->Password = 'Liberty44';

      	$objIntelliSMS->SendMessage($phone,$msg,$sender);
		
		return true;
	}
?>
