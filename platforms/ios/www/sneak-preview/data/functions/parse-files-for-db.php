<?php
ini_set('display_errors', 1);
require '../classes/xmlStreamer.php';
require_once('../db-connect.php');

class SimpleXmlStreamer extends \Prewk\XmlStreamer
{
    public $movie;
    
    public function getMovieGenresAndRatings () {
        $_movieId = $this->movie->_id;
        $imdbIdSearch = file_get_contents("https://www.omdbapi.com/?apikey=18ccd4b0&i=".$this->movie->imdb_id);
        $imdbIdSearchRes = json_decode(utf8_encode($imdbIdSearch),true);
                print_r($imdbIdSearchRes);
        
        if ($imdbIdSearchRes && !isset($imdbIdSearchRes["Error"])) {
            if (isset($imdbIdSearchRes["Genre"])) {
                $genres = explode(", ", $imdbIdSearchRes["Genre"]);
                if (count($genres) > 0) {
                    for ($i = 0; $i < count($genres); $i++) {
                        $genre = $genres[$i];
                        echo "CALL addMovieGenre('$genre', $_movieId)";
                        $result = mysql_query("CALL addMovieGenre('$genre', $_movieId)");
                    }
                }
            }
            
            if (isset($imdbIdSearchRes["Ratings"])) {
                $ratings = Array();
                $ratings = $imdbIdSearchRes["Ratings"];
                
                if (count($ratings) > 0) {
                    for ($ind = 0; $ind < count($ratings); $ind++) {
                        $imdbRating = ''; $rtRating = ''; $mcRating = '';
                        if ($ratings[$ind]["Source"] == "Internet Movie Database") {
                            $imdbRating = $ratings[$ind]["Value"];
                        }
                        else if ($ratings[$ind]["Source"] == "Rotten Tomatoes") {
                            $rtRating = $ratings[$ind]["Value"];
                        }
                        else if ($ratings[$ind]["Source"] == "Metacritic") {
                            $mcRating = $ratings[$ind]["Value"];
                        }
                        
                        if ($ind == (count($ratings) - 1)) {
                            //echo "CALL updateMovieRatings('$imdbRating', '$rtRating', '$mcRating', $_movieId)";
                            $result = mysql_query("CALL updateMovieRatings('$imdbRating', '$rtRating', '$mcRating', $_movieId)");
                        }
                    }
                }
            }
        }
    }
    
    public function doMovieDbIdSearch() {
        $_movieId = $this->movie->_movieId;
        $movieDbId = $this->movie->movieDbId;
        $movieDBIdSearch = file_get_contents("https://api.themoviedb.org/3/movie/".$movieDbId."?api_key=bad6907fbc0593ecf082f5022a24804c&append_to_response=videos");
        $movieDBIdSearchRes = json_decode(utf8_encode($movieDBIdSearch),true);
        
        if (count($movieDBIdSearchRes["videos"]["results"]) > 0) {
            $trailerUrl = $movieDBIdSearchRes["videos"]["results"][0]["key"];
            //echo "INSERT INTO BusinessEntityItemMeta SELECT $_movieId, 'Movie Trailer URL', '$trailerUrl' FROM DUAL WHERE (SELECT COUNT(*) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = $_movieId AND metaName = 'Movie Trailer URL') = 0";
            $resultTrailer = mysql_query("INSERT INTO BusinessEntityItemMeta SELECT $_movieId, 'Movie Trailer URL', '$trailerUrl' FROM DUAL WHERE (SELECT COUNT(*) FROM BusinessEntityItemMeta WHERE _businessEntityItemId = $_movieId AND metaName = 'Movie Trailer URL') = 0");
        }
        
        if ($movieDBIdSearchRes["imdb_id"]) {
            $this->movie->_id = $_movieId;
            $this->movie->imdb_id = $movieDBIdSearchRes["imdb_id"];
            
            $this->getMovieGenresAndRatings();
        }
    }
    
    public function processNode($xmlString, $elementName, $nodeIndex)
    {
        $bedfordCineworldId = '34'; //change later back to 34, dublin is 75
        
        $xml = simplexml_load_string($xmlString);
        $cinemaId = (string)$xml->column[0];
        
        if ($cinemaId != $bedfordCineworldId) {return true;
        };
        
        $movieTitle = (string)$xml->column[2];
        $movieTitle = str_replace('"', '\"', $movieTitle);
        $movieTitle = str_replace("'", "\'", $movieTitle);
        
        //if original name already exists in array, don't add movie
        
        //if formatted name already exists in array, add this as a sub-movie
        
        //else just add this to db
        $movieRating = (string)$xml->column[3];
        $movieRelease = (string)$xml->column[4];
        $movieReleaseExploded = explode("/", $movieRelease);
        $movieRelease = $movieReleaseExploded[2]."/".$movieReleaseExploded[1]."/".$movieReleaseExploded[0];
        $movieCineworldEdi = (string)$xml->column[7];
        $moviePosterUrl = (string)$xml->column[8];
        $movieFormat = "Main";
        
        if (strpos($movieTitle, '(2D)') !== FALSE) {
            $movieFormat = "2D";
            $movieTitle = str_replace("(2D) ", "", $movieTitle);
        }
        else if (strpos($movieTitle, '(3D)') !== FALSE) {
            $movieFormat = "3D";
            $movieTitle = str_replace("(3D) ", "", $movieTitle);
        }
        else if (strpos($movieTitle, 'Unlimited Screening') !== FALSE) {
            $movieFormat = "Unlimited Streening";
            $movieTitle = str_replace(" Unlimited Screening", "", $movieTitle);
        }
        else if (strpos($movieTitle, 'Autism Friendly Screening-') !== FALSE) {
            $movieFormat = "Autism Friendly Screening";
            $movieTitle = str_replace("Autism Friendly Screening-", "", $movieTitle);
        }
        else if (strpos($movieTitle, ' - Movies For Juniors') !== FALSE) {
            $movieTitle = str_replace(" - Movies For Juniors", "", $movieTitle);
        }
        
        $queryShowingTimesString = "";
        $showingTimeCounter = 1;
        
        for($i = 12; $i < count($xml->column); $i++) {
            $columnVal = (string)$xml->column[$i];
            if ($i % 2 == 0) {
                preg_match_all('!\d+!', $columnVal, $matches);
                $monthVal = 0;
                $specificDateVal = "";
                if (strpos($columnVal, 'Jan') !== FALSE) {
                    $monthVal = "01";
                }
                else if (strpos($columnVal, 'Feb') !== FALSE) {
                    $monthVal = "02";
                }
                else if (strpos($columnVal, 'Mar') !== FALSE) {
                    $monthVal = "03";
                }
                else if (strpos($columnVal, 'Apr') !== FALSE) {
                    $monthVal = "04";
                }
                else if (strpos($columnVal, 'May') !== FALSE) {
                    $monthVal = "05";
                }
                else if (strpos($columnVal, 'Jun') !== FALSE) {
                    $monthVal = "06";
                }
                else if (strpos($columnVal, 'Jul') !== FALSE) {
                    $monthVal = "07";
                }
                else if (strpos($columnVal, 'Aug') !== FALSE) {
                    $monthVal = "08";
                }
                else if (strpos($columnVal, 'Sep') !== FALSE) {
                    $monthVal = "09";
                }
                else if (strpos($columnVal, 'Oct') !== FALSE) {
                    $monthVal = 10;
                }
                else if (strpos($columnVal, 'Nov') !== FALSE) {
                    $monthVal = 11;
                }
                else if (strpos($columnVal, 'Dec') !== FALSE) {
                    $monthVal = 12;
                }
                foreach ($matches as $item) {
                    $specificDateVal .= $item[0];
                }
                $dateVal = date("Y")."-".$monthVal."-".$specificDateVal;
                $queryShowingTimesString .= "[[\"ShowingDate".$showingTimeCounter."\", \"".$dateVal."\"]],";
            }
            else {
                $queryShowingTimesString .= "[[\"ShowingTime".$showingTimeCounter."\", \"".$columnVal."\"]]";
                $queryShowingTimesString .= ($i < count($xml->column) - 1) ? ",": "";
                $showingTimeCounter += 1;
            }
        }
        
        $result1 = mysql_query("CALL createMovieFromCineworldFile('$movieTitle', $movieCineworldEdi, '$movieRating', '$movieRelease', '$moviePosterUrl', $cinemaId, '$movieFormat', '".$queryShowingTimesString."', @_movieId);");
        $result = mysql_query("SELECT @_movieId as _movieId");

        $_movieId = mysql_fetch_object($result);
        $_movieId = $_movieId -> _movieId;
        $this->movie = new stdClass();
        $this->movie->_movieId = $_movieId;
        
        if ($result1) {
            $urlTitle = str_replace(" ", "+", $movieTitle);
            $movieDBNameSearch = file_get_contents("https://api.themoviedb.org/3/search/movie?api_key=bad6907fbc0593ecf082f5022a24804c&query=".$urlTitle);
            $movieDBNameSearchRes = json_decode(utf8_encode($movieDBNameSearch),true);
            
            if ($movieDBNameSearchRes["total_results"] == 1) {
                $this->movie->movieDbId = $movieDBNameSearchRes["results"][0]["id"];
                $this->doMovieDbIdSearch();
            }
            else if ($movieDBNameSearchRes["total_results"] > 1) {
                for ($i = 0; $i < count($movieDBNameSearchRes["results"]); $i++) {
                    if ($movieReleaseExploded[2] == substr($movieDBNameSearchRes["results"][$i]["release_date"], 0, 4)) {
                        $this->movie->movieDbId = $movieDBNameSearchRes["results"][$i]["id"];
                        $this->doMovieDbIdSearch();
                    }
                }
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
        
        
        /*$result = mysql_query("CALL createMovieFromCineworldFile('$movieTitle', $movieCineworldEdi, '$movieRating', '$movieRelease', '$moviePosterUrl', $cinemaId, '$movieFormat', '".$queryShowingTimesString."');");
        
        if ($result) {
            echo "SUCCESS: CALL createMovieFromCineworldFile('$movieTitle', $movieCineworldEdi, '$movieRating', '$movieRelease', '$moviePosterUrl', $cinemaId, '$movieFormat', '".$queryShowingTimesString."');<br><br>   ";
        }
        else {
            echo "FAIL: '$movieTitle', $movieCineworldEdi, '$movieRating', '$movieRelease', '$moviePosterUrl', $cinemaId, '$movieFormat', '".$queryShowingTimesString."');<br><br>   ";
        }
        */
    }
}

/*
$streamer = new SimpleXmlStreamer("https://www.cineworld.co.uk/syndication/film_times_ie.xml");

if ($streamer->parse()) {
    echo "Finished successfully";
} else {
    echo "Couldn't find root node";
}
*/
$url = "https://www.cineworld.co.uk/syndication/film_times.xml";
$timeout = 10;

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $timeout);

try {
    $response = curl_exec($curl);
    curl_close($curl);

    // success! Let's parse it and perform whatever action necessary here.
    if ($response !== false) {
        /** @var $xml SimpleXMLElement */
        $xml = simplexml_load_string($response);
        
        $xml->saveXML("cineworldFile.xml");
        $streamer = new SimpleXmlStreamer("cineworldFile.xml");

        if ($streamer->parse()) {
            //echo "Finished successfully";
        } else {
            echo "Couldn't find root node";
        }

    } else {
        // Warn the user here
    }
} catch (Exception $ex) {
    // Let user's know that there was a problem
    curl_close($curl);
}
?>
