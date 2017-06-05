<?php

  header("Access-Control-Allow-Origin: http://legalservebedford.co.uk");
  header("Access-Control-Allow-Origin: http://www.legalservebedford.co.uk");
  
  //Debug
  //ini_set('display_errors', 1);

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";

  $db_name = "qxiryynz_MyNyteTest";
  
  header('content-type: application/json; charset=utf-8');
  header('Access-Control-Allow-Methods: GET, SET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die(mysql_error());
  mysql_select_db($db_name);
?>
