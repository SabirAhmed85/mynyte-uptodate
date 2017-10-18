<?php
    //ini_set('display_errors', 1);
    include_once('globals.php');
    require '../classes/php-mailer/PHPMailerAutoload.php';
    
    $action = $_POST['action'];
    echo $action;
    $actionFound = false;

    $recipients_array = array();
    //array_push($recipients_array, (object)array('name' => 'Habiba Khatoon', 'email' => 'hkhatoon20@yahoo.com'));
    //array_push($recipients_array, (object)array('name' => 'Qaudir Ahmed', 'email' => 'qaudir@jav.org.uk'));


    //Compile Subject And Message Details based on Context

    if ($action == 'sendMyNyteWelcomeEmail') {
        $subject = 'Welcome to MyNyte';
        $htmlEmail = file_get_contents('../../../templates/email-views/welcome-to-mynyte.html');
        $actionFound = true;
    }
    else if ($action == 'sendMynyteAppOutNowToBusinesses') {
        $subject = 'The MyNyte App - Out Now!';
        $htmlEmail = file_get_contents('../../../templates/email-views/mynyte-app-out-now.html');
        $actionFound = true;
    }
    else if ($action == 'genericEmailToAllBusinesses') {
        $subject = 'Your new Account Manager';
        $htmlEmail = file_get_contents('../../../templates/email-views/your-new-account-manager.html');
        $actionFound = true;
    }
    else if ($action == 'sendInviteToMyNyteApp') {
        require_once('../db-connect.php');
        
        $senderName = $_POST['senderName'];
        $senderEmail = $_POST['senderEmail'];
        $firstName = $_POST['recipientName'];
        $email = $_POST['recipientEmail'];
        
        $subject = $senderName . ' has invited you to MyNyte!';
        $htmlEmail = file_get_contents('../../../templates/email-views/mynyte-app-out-now.html');
        $actionFound = true;
        
        array_push($recipients_array, (object)array('name' => $firstName, 'email' => $email));
    }
    else if ($action == 'informRestaurantOfTableBooking') {

        $email = $_POST['email'];
        
        $subject = "You've just received a Table Booking Request on the MyNyte App";
        $htmlEmail = file_get_contents('../../../templates/email-views/table-booking-request-received.html');
        $actionFound = true;
        
        array_push($recipients_array, (object)array('name' => 'Business Manager', 'email' => $email));
    }

    //Process Varables where needed
    foreach ($recipients_array as $obj) {
        $name = $obj->name;
        $email = $obj->email;
        //Process Variables
        $nameArr = explode(' ', $name);
        $firstName = $nameArr[0];

        if ($action == 'sendMyNyteWelcomeEmail' || $action == 'sendInviteToMyNyteApp') {
            $htmlEmail = str_replace('{{$FirstName}}', $firstName, $htmlEmail);
        }

        
        if (isset($_POST['action']) && $actionFound) {
            $mail = new PHPMailer();
            
            $mail->IsSMTP();
            $mail->CharSet = 'UTF-8';
            $mail->Host = "relay.bluesword.org"; // SMTP server example
            $mail->SMTPDebug = 0; // enables SMTP debug information (for testing)
            $mail->SMTPAuth = true; // enable SMTP authentication
            $mail->Port = 25;
            $mail->Username = "sabir@bluesword.org";
            $mail->Password = "my-nyte-designed1";
            
            $mail->From = 'no-reply@mynyte.co.uk';
            $mail->FromName = 'MyNyte';
            $mail->addAddress($email, $name);
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlEmail;

            // Mail it
            if ($mail->send() && $action != 'sendInviteToMyNyteApp') {
                echo json_encode("Email Successfully sent to ".$name." at ".$email."<br>");
                
            }
            else if ($mail->send() && $action == 'sendInviteToMyNyteApp') {
                $result1 = mysql_query("CALL sendMyNyteInviteEmailToContact('$senderEmail', '$email', @emailSentCount);");
                $result = mysql_query("SELECT @emailSentCount as emailSentCount");

                // new way to get Users Id
                $emailSentCount = mysql_fetch_object($result);
                $emailSentCount = $emailSentCount -> emailSentCount;
                
                echo json_encode($emailSentCount);
                
            } else {
                echo json_encode("Couldn't send email to ".$name." at ".$email."<br>");
            }
        }
    }

    if (!$actionFound) {
        echo json_encode("Action not recognised: ".$action);
    }
    else if (count($recipients_array) == 0) {
        echo json_encode("No e-mail addresses supplied to Recipients Array.");
    }
?>
