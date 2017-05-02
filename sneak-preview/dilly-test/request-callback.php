<?php
	$name = $_GET['name'];
	$number = $_GET['number'];
	$reference = $_GET['reference'];
	$bedrooms = $_GET['bedrooms'];
	$propertyType = $_GET['propertyType'];
	$address = $_GET['address'];

	$to = "info@bluerock-productions.com"; // note the comma
	$toName = "OpenHouse Bedford Admin Team";

    // Subject
    $subject = 'Callback Request for a Property on website (Ref: ' .$reference. ')';

    // Message
    $message =
        '<html>
        <head>
          <title>Callback requested by ' .$name. '</title>
        </head>
        <body>
          <table>
            <tr>
                <td>
                    <p>
                        Hi,<br><br>
                        Someone has requested a callback for a specific property through the OpenHouse Bedford website. Please see details of the person and the property below:
                    </p>

                    <p><b>Name</b>: '.$name.'</p>
                    <p><b>Contact Number</b>: '.$number.'</p>
                    <p><b>Property Enquired About:</b> </p>

                    <ul><li><b>Reference</b> - '.$reference.'</li>
                    <li><b>Address</b> - '.$address.'</li>
                    <li><b>Property Type</b> - '.$propertyType .'</li>
                    <li><b>Bedrooms</b> - '.$bedrooms.'</li></ul>
                </td>
            </tr>
          </table>
        </body>
        </html>';

    // To send HTML mail, the Content-type header must be set
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';

    // Additional headers
    $headers[] = 'To: '.$toName.' <'.$to.'>';
    $headers[] = 'From: OpenHouseBedford <noreply@openhousebedford.co.uk>';

    // Mail it
    $sendMail = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($sendMail) {
        echo json_encode("Success");
    } else {
        echo json_encode("Couldn't send email");
    }
?>