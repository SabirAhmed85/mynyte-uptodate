<?php
    $action = $_GET['action'];
    $actionFound = false;

    $recipients_array = array();
    //array_push($recipients_array, (object)array('name' => 'Sabir Ahmed', 'email' => 'sabir.ahmed@hotmail.co.uk'));
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

    //Process Varables where needed
    foreach ($recipients_array as $obj) {
        $name = $obj->name;
        $email = $obj->email;
        //Process Variables
        $nameArr = explode(' ', $name);
        $FirstName = $nameArr[0];

        if ($action == 'sendMyNyteWelcomeEmail') {
            $htmlEmail = str_replace('{{$FirstName}}', $FirstName, $htmlEmail);
        }

        
        if (isset($_GET['action']) && $actionFound) {
            $message = $htmlEmail;

            // To send HTML mail, the Content-type header must be set
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/html; charset=iso-8859-1';

            // Additional headers
            $headers[] = 'To: '.$name.' <'.$email.'>';
            $headers[] = 'From: MyNyte <noreply@mynyte.co.uk>';

            // Mail it
            $sendMail = mail($email, $subject, $message, implode("\r\n", $headers));

            if ($sendMail) {
                echo "Email Successfully sent to ".$name." at ".$email."<br>";
            } else {
                echo "Couldn't send email to ".$name." at ".$email."<br>";
            }
        }
    }

    if (!$actionFound) {
        echo "Action not recognised.";
    }
    else if (count($recipients_array) == 0) {
        echo "No e-mail addresses supplied to Recipients Array.";
    }
?>