<?php
  $intended_environment = 'Staging';

  $httpUrl = ($intended_environment == 'Staging') ? "https://www.mynyte.co.uk/staging": "https://www.mynyte.co.uk";

  header("Access-Control-Allow-Origin: $httpUrl");
  
  //Debug
  //ini_set('display_errors', 1);

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";

  //$db_name = ($intended_environment == 'Staging') ? "qxiryynz_MyNyte_Staging": "qxiryynz_mynyte";
  $db_name = ($intended_environment == 'Staging') ? "qxiryynz_mynyte": "qxiryynz_mynyte";

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