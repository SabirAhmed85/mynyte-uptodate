<?php
//function for parsing the curl request
function curl_file_get_contents($url) {
$ch = curl_init();
curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
$data = curl_exec($ch);
curl_close($ch);
return $data;
}
$client_id = '00000000401DD32D';
$client_secret = 'T3WRvyERr70TUp5ifvtbsoo';
$redirect_uri = 'https://www.mynyte.co.uk/live/oauth-hotmail.php';
$auth_code = $_GET["code"];

$fields=array(
'code'=>  urlencode($auth_code),
'client_id'=>  urlencode($client_id),
'client_secret'=>  urlencode($client_secret),
'redirect_uri'=>  urlencode($redirect_uri),
'grant_type'=>  urlencode('authorization_code')
);
$post = '';
foreach($fields as $key=>$value) { $post .= $key.'='.$value.'&'; }
$post = rtrim($post,'&');
$curl = curl_init();
curl_setopt($curl,CURLOPT_URL,'https://login.live.com/oauth20_token.srf');
curl_setopt($curl,CURLOPT_POST,5);
curl_setopt($curl,CURLOPT_POSTFIELDS,$post);
curl_setopt($curl, CURLOPT_RETURNTRANSFER,TRUE);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
$result = curl_exec($curl);
curl_close($curl);
$response =  json_decode($result);
$accesstoken = $response->access_token;
$personalInfoUrl = 'https://apis.live.net/v5.0/me?access_token='.$accesstoken;
$contactsUrl = 'https://apis.live.net/v5.0/me/contacts?access_token='.$accesstoken.'&limit=100';
$xmlresponse =  curl_file_get_contents($personalInfoUrl);
$contactsUrlXml = json_decode($xmlresponse, true);
$sendersEmail = rtrim(implode(",",array_unique($contactsUrlXml['emails'])), ",");
$xmlresponse =  curl_file_get_contents($contactsUrl);
$xml = json_decode($xmlresponse, true);
$msn_email = "
	<head>
		<link rel='stylesheet' href='css/nightlife-style.css' />
		<style>
			body.email-contacts-list {
				overflow-x: visible !important;
			}

			.page-header {
				float: left;
			    width: calc(100% - 30px);
			    background: #732929;
			    padding: 5px 15px;
			    color: #ccc;
			    font-size: 13px;
			    position: fixed;
			    top: 0;
			}

			.header-note {
			    display: none;
			    float: left;
			    width: calc(100% - 25px);
			    padding: 5px 10px;
			    border: 1px solid #6b1a1a;
			    border-radius: 5px;
			    background: #753131;
			    line-height: 22px;
			    margin: 5px 0;
			    max-width: 760px;
			    float: none;
			    margin: 5px auto;
			}
			.header-note.competition-entered-note {
			    color:#eee;
			}

			.header-note.show {
			    display: block;
			}

			.invite-contacts-main-contacts-container {
				margin: 0 auto;
    			padding: 0;
			    background: #333;
			    float: none;
			    max-width: 800px;
			    display: block;
			}

			.contact-item {
			    width: calc(100% - 25px);
			    padding: 10px 10px 10px 15px;
			    color: #bbb;
			    border-bottom: 1px solid #282828;
			    background: #212121;
			    float: left;
			}

			span.contact-name {
			    color: #fff;
			    float: left;
			}

			span.contact-email {
			    float: left;
			    clear: left;
			    margin-top: 5px;
			}

			button.send-invite-button {
			    float: right;
			    margin-right: 10px;
			    background: #af8b8b;
			    border: 1px solid #dca7a7;
			    color: #402424;
			    font-size: 13px;
			    width: 100px;
			    margin-top: -5px;
			    border-radius: 3px;
			}

			button.send-invite-button.email-sent {
				background: #675555;
    			color: #1b1515;
    			border-color: #8c7878;
			}
		</style>

    	<script src='js/plugins/jquery-2.2.0.min.js' type='text/javascript'></script>
		<script type='text/javascript'>
			function checkTopHeaderNote (successData) {
				successData = parseInt(successData.replace(/\"/g, ''));
		    	console.log(successData);
		      	$('.invites-sent-count').html(5 - successData + ' more');

		      	if (parseInt(successData) > 4) {
		      		competitionEntered = true;
		      		$('.competition-entered-note').addClass('show');
		      		$('.competition-not-entered-note').removeClass('show');
		      	}
			}

			function sendEmail (elem, name, email) {
				var thisButton = elem;

				$.ajax({
				    url: 'sneak-preview/data/functions/email.php?action=sendInviteToMyNyteApp',
            		type: 'POST',
				    data: {senderName: '".$contactsUrlXml["name"]."', senderEmail: '".$sendersEmail."', recipientName: name, recipientEmail: email},
				    success: function(successData){
				    	console.log(successData);
				      	$(thisButton).attr('disabled', true).addClass('email-sent').html('Invite Sent');

				      	checkTopHeaderNote(successData);
				    }
				});
			}

			$(function () {
				$.ajax({
				    url: 'sneak-preview/data/sp/Profile.php?action=checkHowManyEmailInvitesSent',
            		type: 'GET',
				    data: {senderEmail: '".$sendersEmail."'},
				    success: function(successData){
				    	var competitionEntered = false;

						var headerHeight = $('.page-header').outerHeight();
						$('.invite-contacts-main-contacts-container').css({'margin-top': headerHeight + 'px'});
						checkTopHeaderNote(successData);
				    }
				});
			})
		</script>


		<!--<script type='text/javascript' src='js/plugins/email-contact.js' />-->
	</head>
	<body class='email-contacts-list'>
		<div class='page-header'>
			<div class='header-note competition-not-entered-note show'>
				Send an MyNyte invite to <span class='invites-sent-count'>5</span> contact(s) and get entered into the Prize Draw for your chance to win an iPad!
			</div>
			<div class='header-note competition-entered-note'>
				Congratulations! You've just been entered into the MyNyte Prize Draw for your chance to win an iPad!
			</div>
		</div>";
$msn_email .= "<div class='invite-contacts-main-contacts-container'>";
foreach($xml['data'] as $emails)
{
	// echo $emails['name'];

	$email_ids = implode(",",array_unique($emails['emails'])); //will get more email primary,sec etc with comma separate
	$recipientName = $emails['name'];
	if (strpos($recipientName, "@") !== false && ucfirst($emails['first_name']) != '') {
		$recipientName = ucfirst($emails['first_name']);
	}
	elseif (strpos($recipientName, "@") !== false) {
		$recipientName = '';
	}
	elseif (strpos($recipientName, "@") === false && strpos($recipientName, " ") !== false) {
		list($first, $last) = explode(" ", $recipientName);
		$recipientName = ucfirst($first);
	}

	if (rtrim($email_ids,",") != '') {
		$msn_email .= '<div class="contact-item"><span class="contact-name">'.ucfirst($emails['name']).'</span> <span class="contact-email">'. rtrim($email_ids,",").'</span><button class="send-invite-button" onclick="sendEmail(this, \''.$recipientName.'\', \''.rtrim($email_ids,",").'\')">Send Invite</button></div>';
	}
}
$msn_email .= "</div></body>";
echo $msn_email;
 
?>