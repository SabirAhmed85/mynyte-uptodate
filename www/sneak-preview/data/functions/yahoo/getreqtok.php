<?php
// Demonstrates how to use the OAuthMonkey by authorizing access to Twitter & Yahoo!, and making a signed request for Twitter secure data.  Note: you can't use the YQL table to make signed requests to YQL, so the Yahoo! auth is just to show you can have multiple objects on the same page
// usage: put this file in the same directory as OauthMonkey.php and load it in a browser
// license: http://gist.github.com/375593
require 'globals.php';

$yahoo = new OauthMonkey( array(
    'consumerKey' => 'dj0yJmk9S2RwQ01ZbFVhaUdyJmQ9WVdrOVNIbHBObmhOTTJVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hNA--',
    'consumerSecret' => '9347fbba92a8d014349102a66e863c8d6915e409',
    'requestTokenUri' => 'https://api.login.yahoo.com/oauth/v2/get_request_token',
    'accessTokenUri' => 'https://api.login.yahoo.com/oauth/v2/get_token',
    'authorizeUri' => 'https://api.login.yahoo.com/oauth/v2/request_auth',
    'callbackUri' => 'http://example.com/example.php',
    'oauthVersion' => '1a'
) );
var_dump( $yahoo->makeRequest( 'https://social.yahooapis.com/v2/user/12345/profile' ) );
?>
