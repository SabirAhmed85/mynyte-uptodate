<?php
  $id = $_GET['id'];

  $sql    = "SELECT * FROM people WHERE id == {{$id}}" ;

  $result = mysql_query($sql);
?>