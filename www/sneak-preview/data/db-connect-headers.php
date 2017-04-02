<?php
  require_once('main-connect.php');
  
  $db_con = mysql_connect($db_host, $db_uid, $db_pass) or die(mysql_error());
  
  mysql_select_db($db_name);
?>
