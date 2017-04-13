<?php

  $searchTown = $_GET['town'];
  $searchMusic = $_GET['music'];
  $sqlMusicQuery = "";
  if ($searchMusic != "all") {
    $sqlMusicQuery = " and Music == " . $searchMusic;
  }

  $sql    = "SELECT * FROM event e WHERE Town == {{$searchTown}}" . $sqlMusicQuery . "LEFT JOIN place p ON e._placeId == p.id" ;

  $result = mysql_query($sql);
?>