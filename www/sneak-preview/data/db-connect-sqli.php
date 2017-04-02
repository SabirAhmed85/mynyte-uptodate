<?php
  require_once('main-connect.php');

  $db_con = mysqli_connect($db_host, $db_uid, $db_pass, $db_name);
  // Check connection
  if (!$db_con)
  {
    echo "Failed to connect to MySQL";
  }
?>
