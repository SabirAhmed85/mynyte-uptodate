<?php
  $id = $_GET['id'];
  $name = $_GET['name'];
  $_placeId = $_GET['_placeId'];
  $description = $_GET['description'];

  $sql    = "UPDATE events SET name = $name
  							, description = $description
  							, isActive = 1
  			WHERE id = $id";

  $result = mysql_query($sql);
?>