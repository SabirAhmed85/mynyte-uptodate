<?php
    //Allow Headers
    require_once('../db-connect.php');
    $action = $_GET['action'];
    
    if ($action == 'uploadImage') {
        $config["quality"] = 120; //jpeg quality
        
        $imgEntryType = $_POST["imgEntryType"];
        $_profileId = $_POST["_profileId"];
        $startX = $_POST["startX"];
        $startY = $_POST["startY"];
        $xDist = $_POST["xDist"];
        $yDist = $_POST["yDist"];
        $images = $_FILES["files"];
        
        if ($imgEntryType == 'event_cover_photo') {
            $_businessPlaceId = $_POST["_businessPlaceId"];
            $eventTitle = $_POST["eventTitle"];
            $description = ($_POST["description"] == undefined) ? '': $_POST["description"];
            $eventDateTime = $_POST["eventDateTime"];
            $dressCode = ($_POST["dressCode"] == undefined) ? '': $_POST["dressCode"];
            $eventHasGuestList = ($_POST["eventHasGuestList"] == undefined) ? '': $_POST["eventHasGuestList"];
            $guestListMax = $_POST["guestListMax"];
            $dealsOnTheNight = ($_POST["dealsOnTheNight"] == undefined) ? '': $_POST["dealsOnTheNight"];
            $extraInfo = ($_POST["extraInfo"] == undefined) ? '': $_POST["extraInfo"];
            $weekdayIndex = $_POST["weekdayIndex"];
            $weeksAhead = $_POST["weeksAhead"];
            $_businessId = $_POST["_businessId"];
            $musicStyleIdString = $_POST["musicStyleIdString"];
        }
        else if ($imgEntryType == 'offer_cover_photo') {
            $_businessId = $_POST["_businessId"];
            $_offerTypeId = $_POST["_offerTypeId"];
            $_offerSubCategoryId = $_POST["_offerSubCategoryId"];
            $offerTitle = $_POST["offerTitle"];
            $description = $_POST["description"];
            $startDateTime = $_POST["startDateTime"];
            $endDateTime = ($_POST["endDateTime"] == 0) ? "NULL": "'".mysql_real_escape_string($_POST["endDateTime"])."'";;
            $weeksAhead = $_POST["weeksAhead"];
            $weekdayIndex = $_POST["weekdayIndex"];
            $_eventId = $_POST["_eventId"];
        }
        else if ($imgEntryType == 'movie_cover_photo') {
            $_movieStyleIds = $_GET['_movieStyleIds'];
            $_movieStyleIdsString = implode(', ', $_movieStyleIds);
              
            $data               = file_get_contents("php://input");
            $dataJsonDecode     = json_decode($data);
            
            $name = $_POST["name"];
            $description = $_POST["$description"];
            $firstShowingDate = $_POST["firstShowingDate"];
            $lastShowingDate = $_POST["lastShowingDate"];
            $movieTrailerLink = $_POST["movieTrailerLink"];
            $_movieStyleIdsString = $_POST["_movieStyleIdsString"];
        }
        
        if ($imgEntryType == 'update') {
            $uploadFolder = "general_photo";
            $_imageId = mysql_query("SELECT _id FROM GeneralPhoto ORDER BY _id DESC LIMIT 1");
        }
        else if ($imgEntryType == 'cover_photo' || $imgEntryType == 'event_cover_photo' || $imgEntryType == 'offer_cover_photo' || $imgEntryType == 'movie_cover_photo') {
            $uploadFolder = "cover_photo";
            $uploadDir = $_SERVER['DOCUMENT_ROOT']."/sneak-preview/img/user_images/".$uploadFolder."/";
            $_imageId = mysql_query("SELECT _id FROM CoverPhoto ORDER BY _id DESC LIMIT 1");
        }
        else if ($imgEntryType == 'profile_photo') {
            $uploadFolder = "profile_photo";
            $uploadDir = $_SERVER['DOCUMENT_ROOT']."/sneak-preview/img/user_images/".$uploadFolder."/";
            $_imageId = mysql_query("SELECT _id FROM ProfilePhoto ORDER BY _id DESC LIMIT 1");
        }
        
        $_imageId = mysql_fetch_array($_imageId)["_id"] + 1;
        
        if ($imgEntryType == 'cover_photo' || $imgEntryType == 'profile_photo' || $imgEntryType == 'event_cover_photo' || $imgEntryType == 'movie_cover_photo' || ($imgEntryType == 'offer_cover_photo' && !empty($_FILES["files"]["name"]))) {
            $data = getimagesize($_FILES["files"]["tmp_name"][0]);
            $imgName = $_FILES["files"]["name"][0];
            $newImageName = $_profileId."_".$_imageId."_".$imgName;
            $newImageNameQuoted = "'".$_profileId."_".$_imageId."_".$imgName."'";
            $mainUploadDir = $uploadDir.$newImageName;
            $thumbUploadDir = $uploadDir."thumbnail/".$newImageName;
            
            switch($images["type"][0]){
                case 'image/png':
                    $img_res =  imagecreatefrompng($_FILES["files"]["tmp_name"][0]);
                    $file_extension = ".png";
                    break;
                case 'image/gif':
                   $img_res = imagecreatefromgif($_FILES["files"]["tmp_name"][0]);
                   $file_extension = ".gif";
                   break;
                case 'image/jpeg': 
                case 'image/pjpeg':
                    $img_res = imagecreatefromjpeg($_FILES["files"]["tmp_name"][0]);
                    $file_extension = ".jpg";
                    break;
                default:
                    $img_res = 0;
            }
            
            function image_fix_orientation(&$image, $filename) {
                $image = imagerotate($image, array_values([0, 0, 0, 180, 0, 0, -90, 0, 90])[@exif_read_data($filename)['Orientation'] ?: 0], 0);
            }

            image_fix_orientation($img_res, $_FILES["files"]["tmp_name"][0]);
            $canvas  = imagecreatetruecolor($xDist, $yDist);
            $resample = imagecopyresampled($canvas, $img_res, 0, 0, $startX, $startY, $xDist, $yDist, $xDist, $yDist);
            
            if($resample){
                
                switch($images["type"][0]){
                    case 'image/png':
                        $result = imagepng($canvas, $mainUploadDir); //save image
                        break;
                    case 'image/gif':
                       $result = imagegif($canvas, $mainUploadDir); //save image
                       break;
                    case 'image/jpeg': 
                    case 'image/pjpeg':
                        $result = imagejpeg($canvas, $mainUploadDir); //save image
                        break;
                }
                if ($imgEntryType != 'profile_photo') {
                    switch($images["type"][0]){
                        case 'image/png':
                            $thumb_res = imagecreatefrompng($_FILES["files"]["tmp_name"][0]);
                            break;
                        case 'image/gif':
                            $thumb_res = imagecreatefromgif($_FILES["files"]["tmp_name"][0]);
                            break;
                        case 'image/jpeg': 
                        case 'image/pjpeg':
                            $thumb_res = imagecreatefromjpeg($_FILES["files"]["tmp_name"][0]);
                            break;
                        default:
                            $thumb_res = 0;
                    }
                    
                    image_fix_orientation($thumb_res, $_FILES["files"]["tmp_name"][0]);
                    $thumb_dest = imagecreatetruecolor(320, 320*(640/960));
                    $resample_thumb = imagecopyresized($thumb_dest, $thumb_res, 0, 0, 0, 0, 320, 320*(640/960), $data[0], $data[1]);
                    
                    switch($images["type"][0]){
                        case 'image/png':
                            $result_thumb = imagepng($thumb_dest, $thumbUploadDir); //save image
                            break;
                        case 'image/gif':
                           $result_thumb = imagegif($thumb_dest, $thumbUploadDir); //save image
                           break;
                        case 'image/jpeg': 
                        case 'image/pjpeg':
                            $result_thumb = imagejpeg($thumb_dest, $thumbUploadDir); //save image
                            break;
                    }
                }
            }
        }
        else if ($imgEntryType == 'offer_cover_photo' && empty($_FILES["files"]["name"])) {
            $newImageNameQuoted = "''";
            $result = 1;
            $result_thumb = true;
        }
        else {
            $uploadDir = $_SERVER['DOCUMENT_ROOT']."/sneak-preview/img/user_images/".$uploadFolder."/";
            
            //Move your files into upload folder
            $imgName = $_FILES["files"]["name"][0];
            $newImageName = $_profileId."_".$_imageId."_".$imgName;
            $newImageNameQuoted = "'".$_profileId."_".$_imageId."_".$imgName."'";
            $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $uploadDir.$newImageName);
        }
        
        if($result) {
            if ($imgEntryType == 'update') {
                $result = mysql_query("INSERT INTO GeneralPhoto (_relatedListingId, relatedListingType, name) VALUES ('$_profileId', 'Profile', $newImageNameQuoted)");
                echo json_encode("Successfully uploaded");
            }
            else if ($imgEntryType == 'cover_photo') {
                if ($result_thumb) {
                    $result = mysql_query("CALL insertCoverPhotoForProfile('$_profileId', $newImageNameQuoted);");
                    if ($result) {
                        echo json_encode('Successfully uploaded');
                    } else {
                        echo json_encode('Image Procedure not successful');
                    }
                } else {
                    echo json_encode('Thumb image not uploaded');
                }
            }
            else if ($imgEntryType == 'profile_photo') {
                $result = mysql_query("CALL insertProfilePhoto('$_profileId', $newImageNameQuoted);");
                if ($result) {
                    echo json_encode('Successfully uploaded');
                } else {
                    echo json_encode('Image Procedure not successful');
                }
            }
            else if ($imgEntryType == 'event_cover_photo') {
                if ($result_thumb) {
                    $result = mysql_query("CALL createEvent($_businessId, $_businessPlaceId, '$eventTitle', '$description', '$eventDateTime', '$dressCode', '$dealsOnTheNight', '$extraInfo', $eventHasGuestList, $guestListMax, 0, $weekdayIndex, $weeksAhead, '$musicStyleIdString', $newImageNameQuoted, @_eventId)");
                    $sqlQuery2 = mysql_query("SELECT @_eventId");
                    $output = mysql_fetch_array($sqlQuery2)["@_eventId"];
                    echo json_encode($output);
                } else {
                    echo json_encode('Thumb image not uploaded');
                }
            }
            else if ($imgEntryType == 'offer_cover_photo') {
                if ($result_thumb) {
                    $result = mysql_query("CALL createOffer('$_offerTypeId', '$_offerSubCategoryId', '$_businessId', '$offerTitle', '$description', 0, '$startDateTime', $endDateTime, $weeksAhead, $weekdayIndex, $_eventId, $newImageNameQuoted, @_offerId);");
                    $sqlQuery2 = mysql_query("SELECT @_offerId");
                    $output = mysql_fetch_array($sqlQuery2)["@_offerId"];
                    echo json_encode($output);
                } else {
                    echo json_encode('Thumb image not uploaded');
                }
            }
            else if ($imgEntryType == 'movie_cover_photo') {
                if ($result_thumb) {
                    $result = mysql_query("CALL createMovie('$name', '$description', '$firstShowingDate', '$lastShowingDate', '$_movieStyleIdsString', '$movieTrailerLink', $newImageNameQuoted, @_movieId);");
                    $sqlQuery2 = mysql_query("SELECT @_movieId");
                    $output = mysql_fetch_array($sqlQuery2)["@_movieId"];
                    echo json_encode($output);
                } else {
                    echo json_encode('Thumb image not uploaded');
                }
            }
        } else {
            echo json_encode('Main image not uploaded');
        }
    }
?>
