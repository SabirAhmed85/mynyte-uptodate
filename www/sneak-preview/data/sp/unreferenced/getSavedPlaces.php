<?php
  $userId = $_GET['userId'];

  $sql    = "SELECT * FROM savedPlace sp WHERE _personId == $userId";

  $result = mysql_query($sql);
?>