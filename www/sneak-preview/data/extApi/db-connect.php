<?php
  require_once('main-connect-external.php');
  
  header('content-type: application/json; charset=utf-8');
  header('Access-Control-Allow-Methods: GET, SET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  $db_con = mysqli_connect($db_host, $db_uid, $db_pass, $db_name);
  // Check connection
  if (!$db_con)
  {
    echo "Failed to connect to MySQL";
  }
?>
