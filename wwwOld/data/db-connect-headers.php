<?php
    $http_origin = $_SERVER['HTTP_ORIGIN'];

    if ($http_origin == "http://www.mynyte.co.uk" || $http_origin == "http://localhost:8100")
    {
        header("Access-Control-Allow-Origin: $http_origin");
    }
    header('content-type: application/json; charset=utf-8');
    header('Access-Control-Allow-Methods: GET, SET');
    header("Access-Control-Allow-Headers: X-Requested-With");

    $db_host = "213.171.200.84";

  $db_uid = "sabirAhmed1";

  $db_pass = "Liberty44nightlife";

  $db_name = "NightlifeTownlifeDB";

//error_reporting(E_ALL);
//ini_set('display_errors',1);
  
  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die('could not connect');
  
  mysql_select_db($db_name);
  
?>
