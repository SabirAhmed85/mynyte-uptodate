<?php
  $intended_environment = 'Staging';

  $http_origin = $_SERVER['HTTP_ORIGIN'];
  $httpUrl = ($intended_environment == 'Staging') ? "https://www.mynyte.co.uk/staging": "https://www.mynyte.co.uk";

  if ($http_origin == $httpUrl) {
    header("Access-Control-Allow-Origin: $http_origin");
  }
  header('content-type: application/json; charset=utf-8');
  header('Access-Control-Allow-Methods: GET, SET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";

  $db_name = ($intended_environment == 'Staging') ? "qxiryynz_mynyte": "qxiryynz_mynyte";
  //$db_name = "MyNyte_MyTownCombinedTest";


  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die(mysql_error());

  mysql_select_db($db_name);
  
  //Debug
  //ini_set('display_errors', 1);
?>
