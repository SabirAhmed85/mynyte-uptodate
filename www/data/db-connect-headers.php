<?php
    $http_origin = $_SERVER['HTTP_ORIGIN'];

    if ($http_origin == "http://staging.mynyte.co.uk" || $http_origin == "http://localhost:8000")
    {
        header("Access-Control-Allow-Origin: $http_origin");
    }
    //header('content-type: application/json; charset=utf-8');
    //header('Access-Control-Allow-Methods: GET, SET');
    //header("Access-Control-Allow-Headers: X-Requested-With");

  $db_host = "localhost:3306";

  $db_uid = "sabir_admin";

  $db_pass = "The_edgesxa454";

  $db_name = "MyNyte";
  //$db_name = "MyNyte_MyTownCombinedTest";

//error_reporting(E_ALL);
//ini_set('display_errors',1);
  
  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die(mysql_error());
  
  mysql_select_db($db_name);
  
?>
