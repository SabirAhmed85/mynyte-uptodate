<?php
  $id = $_GET['id'];
  $displayName = $_GET['displayName'];


  $sql    = "UPDATE profile SET
  			displayName = $displayName
        WHERE id = $id";

  $result = mysql_query($sql);
?>