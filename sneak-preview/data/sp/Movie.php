<?php

  require_once('../db-connect.php');
    
  $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);
  
  if ($action == 'getMoviesForMaintenance') {
    $timeScale = (empty($_GET['timeScale'])) ? "": mysql_real_escape_string($_GET['timeScale']);
    $_movieId = (empty($_GET['_movieId'])) ? "0": mysql_real_escape_string($_GET['_movieId']);
    
    $result = mysql_query("CALL getMoviesForMaintenance('$timeScale', $_movieId)");
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  else if ($action == 'getTodaysMoviesForWideDisplay') {
    $_townId = (!isset($_GET['_townId'])) ? 0: mysql_real_escape_string($_GET['_townId']);

    $result = mysql_query("CALL getTodaysMoviesForWideDisplay($_townId);");
    
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
    
    shuffle($output);
    $counter = (count($output) > 10) ? 10: count($output);
    $output = array_slice($output, 0, $counter);

    header('Content-Type: application/json');
    echo json_encode($output);
  }
  if ($action == 'getMoviesTrailerLink') {
    $_movieId = (empty($_GET['_movieId'])) ? "": mysql_real_escape_string($_GET['_movieId']);
    
    $result = mysql_query("CALL getMoviesTrailerLink($_movieId)");
    
      
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  else if ($action == 'createMovie') {
    $_movieStyleIds = $_GET['_movieStyleIds'];
    $_movieStyleIdsString = implode(', ', $_movieStyleIds);
      
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $name = $dataJsonDecode->name;
    $description = $dataJsonDecode->description;
    $firstShowingDate = $dataJsonDecode->firstShowingDate;
    $lastShowingDate = $dataJsonDecode->lastShowingDate;
    $movieTrailerLink = $dataJsonDecode->movieTrailerLink;
      
    $result = mysql_query("CALL createMovie('$name', '$description', '$firstShowingDate', '$lastShowingDate', '$_movieStyleIdsString', '$movieTrailerLink');");
  }
  
  mysql_close();
?>
