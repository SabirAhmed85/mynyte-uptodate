<?php
  $id = $_GET['id'];

  $sql    = "SELECT * FROM offers o WHERE o.id == $id
            LEFT JOIN categories c ON o._categoryId == c.id
            LEFT JOIN places p ON o._placeId == p.id
            ORDER BY c.Id";

  $result = mysql_query($sql);
?>