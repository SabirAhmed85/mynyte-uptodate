<?php

  $db_host = "localhost:3306";

  $db_uid = "sabir_admin";

  $db_pass = "The_edgesxa454";

  $db_name = "MyNyte";
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
