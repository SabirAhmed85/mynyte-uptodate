<?php 
// A util to do the OAuth dance and make signed requests using the YQL OAuth table (github.com/yql/yql-tables/raw/master/oauth/oauth.xml)
// usage: create an object above wherever you'll need to make a request, if the user doesn't have an token, it'll do the dance to get one, and store it in a cookie
// example: see the example.php file below
// license: http://gist.github.com/375593
class OauthMonkey {
    function __construct ( $params ) {
        $this->params = $params;
        $requestTokenName = md5( 'oauthMonkeyRequestToken'.$params['consumerKey'] );
        $accessTokenName = md5( 'oauthMonkeyAccessToken'.$params['consumerKey'] );
        
        //get input
        $filters = array(
            'oauth_verifier' => FILTER_SANITIZESTRING,
            'oauth_token' => FILTER_SANITIZESTRING,
            $requestTokenName => FILTER_SANITIZESTRING,
            $accessTokenName => FILTER_SANITIZESTRING
        );
        $input = filter_var_array( $_REQUEST, $filters );
        
        //if access token
        if ( $input[ $accessTokenName ] ) {
            
            $this->accessToken = json_decode( stripslashes( $input[ $accessTokenName ] ) );
            $time = time();
            
            //if can expire and is expired, refresh it 
            $expired = isset( $this->accessToken->oauthMonkeyExpireTime ) 
                && $this->accessToken->oauthMonkeyExpireTime < time();
            if ( !$expired ) {
                return $this;
            }
            
            $query = sprintf( 
                "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
                ." select * from table where consumerKey='%s' and consumerSecret='%s' and uri='%s'"
                ." and token='%s' and tokenSecret='%s' and sessionHandle='%s'", 
                $params['consumerKey'], 
                $params['consumerSecret'], 
                $params['accessTokenUri'],
                $this->accessToken->oauth_token, 
                $this->accessToken->oauth_token_secret,
                $this->accessToken->oauth_session_handle
            );
            
            //make request & handle result
            $results = $this->yql( $query );
            if ( !$results ) {
                throw new Exception( 'no access token info returned' );
            }
            parse_str( $results->query->results->result, $this->accessToken );
            // var_dump($results->query);
            $this->accessToken['oauthMonkeyExpireTime'] = $time + $this->accessToken['oauth_expires_in'];
            
            //store access token
            setcookie( $accessTokenName, json_encode( $this->accessToken ) );
            
        //if stored request token & token in url, we're in redirect after auth
        } elseif ( $input['oauth_token'] && $input[ $requestTokenName ] ) {
            
            $token = json_decode( stripslashes( $input[ $requestTokenName ] ) );
            $time = time();
            
            //construct query based on version
            switch ( $params['oauthVersion'] ) {
                case '1a':
                    $query = sprintf( 
                        "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
                        ." select * from table where consumerKey='%s' and consumerSecret='%s' and uri='%s'"
                        ." and token='%s' and tokenSecret='%s' and verifier='%s'", 
                        $params['consumerKey'], 
                        $params['consumerSecret'], 
                        $params['accessTokenUri'],
                        $token->oauth_token, 
                        $token->oauth_token_secret,
                        $input['oauth_verifier']
                    );
                    break; 
                case '1':
                default:
                    $query = sprintf( 
                        "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
                        ." select * from table where consumerKey='%s' and consumerSecret='%s' and uri='%s'"
                        ." and token='%s' and tokenSecret='%s'", 
                        $params['consumerKey'], 
                        $params['consumerSecret'], 
                        $params['accessTokenUri'],
                        trim($token->oauth_token), 
                        trim($token->oauth_token_secret)
                    );
            }
            
            //make request & handle result
            $results = $this->yql( $query );
            if ( !$results->query->results->result ) {
                throw new Exception( 'no access token info returned'.print_r($query, true) );
            }
            parse_str( $results->query->results->result, $this->accessToken );
            
            //calc expiration, if given
            if ( isset( $this->accessToken['oauth_expires_in'] ) ) {
                $this->accessToken['oauthMonkeyExpireTime'] = $time + $this->accessToken['oauth_expires_in'];
            }
            
            //store access token
            setcookie( $accessTokenName, json_encode( $this->accessToken ) );
            
            //delete req token
            setcookie( $requestTokenName, "", time() - 3600 );
        
        // if there's no stored req token, get one & redirect to auth
        } elseif ( !$input[ $requestTokenName ] ) {
            
            //construct query based on version
            switch ( $params['oauthVersion'] ) {
                case '1a':
                    $query = sprintf( 
                        "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
                        ." select * from table where consumerKey='%s' and consumerSecret='%s'"
                        ." and callbackUri = '%s' and uri='%s'", 
                        $params['consumerKey'], 
                        $params['consumerSecret'], 
                        $params['callbackUri'], 
                        $params['requestTokenUri']
                    );
                    break;
                case '1':
                default:
                    $query = sprintf( 
                        "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
                        ." select * from table where consumerKey='%s' and consumerSecret='%s' and uri='%s'", 
                        $params['consumerKey'], 
                        $params['consumerSecret'], 
                        $params['requestTokenUri']
                    );
            }
            
            //make request & handle result
            $results = $this->yql( $query );
            if ( !$results ) {
                throw new Exception( 'no request token info returned' );
            }
            parse_str( $results->query->results->result, $token );
            
            //store req token
            setcookie( $requestTokenName, json_encode( $token ) );
            //redirect
            header( sprintf( "Location: %s?oauth_token=%s", $params['authorizeUri'], $token['oauth_token'] ) );
            exit();
        }
        
        return $this;
    }
    
    function makeRequest ( $uri, $method = 'GET' ) {
        $query = sprintf( 
            "use 'http://github.com/yql/yql-tables/raw/master/oauth/oauth.xml' as table;"
            ." select * from table where consumerKey='%s' and consumerSecret='%s'"
            ." and uri='%s' and method='%s' and token='%s' and tokenSecret='%s'", 
            $this->params['consumerKey'], 
            $this->params['consumerSecret'], 
            $uri,
            $method,
            $this->accessToken->oauth_token,
            $this->accessToken->oauth_token_secret
        );
        
        $results = $this->yql( $query );
        if ( !$results ) {
            throw new Exception( 'nothing returned' );
        }var_dump($results);
        return $results->query->results->result;
    }
    
    function yql( $query ) {
        $params = array(
            'q' => $query,
            'debug' => 'true',
            'diagnostics' => 'true',
            'format' => 'json',
            'callback' => ''
        );
        $url = 'https://query.yahooapis.com/v1/public/yql?'.http_build_query( $params );
        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $json = curl_exec( $ch );
        $response = json_decode( $json );
        curl_close( $ch );
        return $response;
    }
}
?>
