<?php
  $id = $_GET['id'];

  $sql    = "SELECT * FROM event e WHERE e.id == {{$id}}
  			LEFT JOIN place p ON e._placeId == p.id
  			LEFT JOIN business b ON p._businessId == b.id
  			LEFT JOIN profile pr ON b._profileId == pr.id" ;

  $result = mysql_query($sql);
?>