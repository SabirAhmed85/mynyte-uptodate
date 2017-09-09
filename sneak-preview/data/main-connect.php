<?php
  include_once('globals.php');

  $httpUrl = ($intended_environment == 'Staging') ? "https://www.mynyte.co.uk/staging": "https://www.mynyte.co.uk/live";

  header("Access-Control-Allow-Origin: $httpUrl");
  if ($intended_environment != 'Staging') {
    header("Access-Control-Allow-Origin: https://mynyte.co.uk");
  }
  
  //Debug
  //ini_set('display_errors', 1);

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";
  
  if ($intended_environment == 'Staging') {
    $db_name = "qxiryynz_MyNyte_Staging";
  }
  else if ($intended_environment == 'Live') {
    $db_name = "qxiryynz_MyNyte";
  }
  else {
    print("Error: please check configuration of environment.");
  }

  //Global Functions
  if(!function_exists('hash_equals')) {
    function hash_equals($str1, $str2) {
      if(strlen($str1) != strlen($str2)) {
        return false;
      } else {
        $res = $str1 ^ $str2;
        $ret = 0;
        for($i = strlen($res) - 1; $i >= 0; $i--) $ret |= ord($res[$i]);
        return !$ret;
      }
    }
  }
?>
