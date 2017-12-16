<?php
    require_once('../db-connect.php');
    
    if (isset($_GET['categoryType'])) {
        if (($_GET['categoryType']) == 'town') {
            $sql    = "SELECT * FROM Town WHERE isActive = 1";
        }
        elseif (($_GET['categoryType']) == 'musicStyle') {
            $sql    = "SELECT * FROM MusicStyle";
        }
        elseif (($_GET['categoryType']) == 'businessType') {
            $sql    = "SELECT * FROM BusinessType WHERE name != 'Special'";
        }
        elseif (($_GET['categoryType']) == 'foodStyle') {
            $sql    = "CALL getAllFoodStyles()";
        }
        elseif (($_GET['categoryType']) == 'foodStylesForTown') {
            $_townId = ($_GET['_townId'] == undefined) ? "": mysql_real_escape_string($_GET['_townId']);
            $businessType = ($_GET['businessType'] == undefined) ? "": mysql_real_escape_string($_GET['businessType']);
            $sql    = "CALL getAllFoodStylesForTown('$_townId', '$businessType')";
        }
        elseif (($_GET['categoryType']) == 'movieStyle') {
            $sql    = "CALL getAllMovieStyles()";
        }
        elseif (($_GET['categoryType']) == 'movieStylesForTown') {
            $sql    = "CALL getAllMovieStylesForTown()";
        }
    }
    else {
        $sql    = "SELECT * FROM category";
    }

    $result = mysql_query($sql);
    while($row = mysql_fetch_assoc($result))
    $output[] = $row;
    
    //header('Content-Type: application/json');
    echo json_encode($output);
    
    mysql_close();
?>