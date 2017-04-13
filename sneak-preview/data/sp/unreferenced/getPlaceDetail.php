<?php
  $id = $_GET['id'];

  $sql    = "SELECT * FROM place WHERE id == {{$id}}" ;

  $result = mysql_query($sql);
?>