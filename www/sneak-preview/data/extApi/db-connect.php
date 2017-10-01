<?php
  require_once('main-connect-external.php');
  
  header('content-type: application/json; charset=utf-8');
  header('Access-Control-Allow-Methods: GET, SET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die(mysql_error());
  mysql_select_db($db_name);
?>
