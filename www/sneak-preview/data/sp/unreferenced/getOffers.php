<?php
  $townToSearch = $_GET['town'];
  $dateTimeAtEndOfDay = null;

  $sql    = "SELECT 'Future' AS 'todayOrFuture', o.description, c.name, p.name, o.endDateTime FROM offers o WHERE startDateTime > {{$dateTimeAtEndOfDay}} AND p.town == $townToSearch
            LEFT JOIN categories c ON o._categoryId == c.Id
            LEFT JOIN places p ON o._placeId == p.Id
            ORDER BY c.Id
            UNION ALL
            SELECT 'Today' AS 'todayOrFuture', o.description, c.name, p.name, o.endDateTime FROM offers o WHERE o.StartDateTime > {{$datetimeNow}} AND o.endDateTime > {{$datetimeNow}} AND p.town == $townToSearch
            LEFT JOIN categories c ON o._categoryId == c.Id
            LEFT JOIN places p ON o._placeId == p.Id
            ORDER BY c.Id";

  $result = mysql_query($sql);
?>