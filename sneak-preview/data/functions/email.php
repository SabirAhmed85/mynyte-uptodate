<?php
    $action = $_GET['action'];

    $recipients_array = array();
    array_push($recipients_array, (object)array('name' => 'Sabir Ahmed', 'email' => 'sabir.ahmed@hotmail.co.uk'));
    //array_push($recipients_array, (object)array('name' => 'Habiba Khatoon', 'email' => 'hkhatoon20@yahoo.com'));
    array_push($recipients_array, (object)array('name' => 'Sabzy Ahmed', 'email' => 'sabir.ahmed.web@gmail.com'));
    //array_push($recipients_array, (object)array('name' => 'Qaudir Ahmed', 'email' => 'qaudir@jav.org.uk'));

    //Process Varables where needed
    foreach ($recipients_array as $obj) {
        $name = $obj->name;
        $email = $obj->email;
        //Process Variables
        $nameArr = explode(' ', $name);
        $FirstName = $nameArr[0];


        //Compile Subject And Message Details based on Context

        if ($action == 'sendMyNyteWelcomeEmail') {
            $subject = 'Welcome to MyNyte';
            $htmlEmail = file_get_contents('../../../templates/email-views/welcome-to-mynyte.html');
            $htmlEmail = str_replace('{{$FirstName}}', $FirstName, $htmlEmail);
        }
        else if ($action == 'sendPromoEmailToBusinesses') {
            $subject = 'Welcome to MyNyte';
            $htmlEmail = file_get_contents('../../../templates/email-views/welcome-to-mynyte.html');
        }

        
        if (isset($_GET['action'])) {
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
?>