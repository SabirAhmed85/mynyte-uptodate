<?php

  require_once('../db-connect.php');
    
  $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);
  
  if ($action == 'getMoviesForMaintenance') {
    $timeScale = (empty($_GET['timeScale'])) ? "": mysql_real_escape_string($_GET['timeScale']);
    $_movieId = (empty($_GET['_movieId'])) ? "0": mysql_real_escape_string($_GET['_movieId']);
    
    $result = mysql_query("CALL getMoviesForMaintenance('$timeScale', $_movieId)");
      
    //print(json_encode($_usersId));
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
    
  }
  else if ($action == 'getMoviesToUpdate') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $format = $dataJsonDecode->format;
    
    $result = mysql_query("CALL getMoviesToUpdate('$format')");
  }
  else if ($action == 'getMovieToUpdatePhotoPos') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_movieId = $dataJsonDecode->_movieId;
    
    $result = mysql_query("CALL getMovieToUpdatePhotoPos($_movieId)");
  }
  else if ($action == 'getExistingCineworldMovies') {
    
    $result = mysql_query("CALL getExistingCineworldMovies()");
    
    //print(json_encode($_usersId));
  }
  else if ($action == 'getMoviesToUpdate') {
    $format = (empty($_GET['format'])) ? "": mysql_real_escape_string($_GET['format']);
    
    $result = mysql_query("CALL getMoviesToUpdate('$format')");
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
  else if ($action == 'createMovieFromCineworldFile') {
    $movieStyles = $_GET['movieStyles'];
    $movieStylesString = implode(', ', $movieStyles);
      
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $name = $dataJsonDecode->name;
    $trailerLink = $dataJsonDecode->trailerLink;
    $edi = $dataJsonDecode->edi;
      
    $result = mysql_query("CALL createMovieFromCineworldFile('$name', '$trailerLink', '$edi', '$movieStylesString');");
  }
  else if ($action == 'addMovieImdbId') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $imdbId = $dataJsonDecode->imdbId;
    $_movieId = $dataJsonDecode->_movieId;
      
    $result = mysql_query("INSERT INTO BusinessEntityItemMeta SELECT $_movieId, 'IMDB Id', '$imdbId' FROM DUAL WHERE (SELECT COUNT(*) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = $_movieId AND metaName = 'IMDB id') = 0");
  }
  else if ($action == 'addMovieTrailer') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $trailerUrl = $dataJsonDecode->trailerUrl;
    $_movieId = $dataJsonDecode->_movieId;
      
    $result = mysql_query("INSERT INTO BusinessEntityItemMeta SELECT $_movieId, 'Movie Trailer URL', '$trailerUrl' FROM DUAL WHERE (SELECT COUNT(*) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = $_movieId AND metaName = 'Movie Trailer URL') = 0");
  }
  else if ($action == 'updateMovieRatings') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $imdbRating = $dataJsonDecode->imdbRating;
    $rtRating = $dataJsonDecode->rtRating;
    $mcRating = $dataJsonDecode->mcRating;
    $_movieId = $dataJsonDecode->_movieId;
      
    $result = mysql_query("CALL updateMovieRatings('$imdbRating', '$rtRating', '$mcRating', $_movieId)");
  }
  else if ($action == 'applyMoviePosterPos') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_movieId = $dataJsonDecode->_movieId;
    $posterTopPos = $dataJsonDecode->posterTopPos;
      
    $result = mysql_query("CALL applyMoviePosterPos($_movieId, $posterTopPos)");
  }
  else if ($action == 'addMovieGenre') {
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $genre = $dataJsonDecode->genre;
    $_movieId = $dataJsonDecode->_movieId;
      
    $result = mysql_query("CALL addMovieGenre('$genre', $_movieId)");
  }
  
  if ($action == 'getMoviesToUpdate'
    || $action == 'getMovieToUpdatePhotoPos'
    || $action == 'getMoviesTrailerLink'
    || $action == 'getMoviesForMaintenance'
    || $action == 'getExistingCineworldMovies') {
    
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
      header('Content-Type: application/json');
      echo json_encode($output);
  }
  
  mysql_close();
?>
