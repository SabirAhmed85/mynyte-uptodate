<?php

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";

  $db_name = "qxiryynz_mynyte";
  //$db_name = "MyNyte_MyTownCombinedTest";

  $db_con = mysqli_connect($db_host, $db_uid, $db_pass, $db_name);
  // Check connection
  if (!$db_con)
  {
    echo "Failed to connect to MySQL";
  }
  
  //Debug
  //ini_set('display_errors', 1);
?>
