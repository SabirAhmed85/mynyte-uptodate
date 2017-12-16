<?php

  $db_host = "213.171.200.84";

  $db_uid = "sabirAhmed1";

  $db_pass = "Liberty44nightlife";

  $db_name = "NightlifeTownlifeDB";

  $db_con = mysqli_connect($db_host, $db_uid, $db_pass, $db_name);
  // Check connection
  if (!$db_con)
  {
  echo "Failed to connect to MySQL";
  }
  
  //Debug
  //ini_set('display_errors', 1);
?>