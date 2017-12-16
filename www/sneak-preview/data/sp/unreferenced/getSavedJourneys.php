<?php
  $userId = $_GET['userId'];

  $sql    = "SELECT * FROM savedJourney sj WHERE _personId == $userId
  			LEFT JOIN savedPlace sp on sp.id == sj.pickUpSavedPlaceId
  			LEFT JOIN savedPlace sp2 on sp2.id == sj.dropOffSavedPlaceId";

  $result = mysql_query($sql);
?>