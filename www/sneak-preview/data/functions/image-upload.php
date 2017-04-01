<?php
    //Allow Headers
    require_once('../db-connect.php');
    $action = $_GET['action'];
    $platform = ($_GET["platform"] == undefined) ? 'non-android': $_GET["platform"];

    if ($action == 'uploadImage') {
        $config["quality"] = 120; //jpeg quality
        
        $imgEntryType = $_POST["imgEntryType"];
        $_profileId = $_POST["_profileId"];
        $startX = $_POST["startX"];
        $startY = $_POST["startY"];
        $xDist = $_POST["xDist"];
        $yDist = $_POST["yDist"];

        $images = ($platform == 'android') ? $_FILES["fileUpload"]: $_FILES["files"];
        $imageName = ($platform == 'android') ? $images["name"]: $images["name"][0];
        $imageTmpName = ($platform == 'android') ? $images["tmp_name"]: $images["tmp_name"][0];
        $imageType = ($platform == 'android') ? $images["type"]: $images["type"][0];

        if ($imgEntryType == 'event_cover_photo') {
            $_businessPlaceId = $_POST["_businessPlaceId"];
            $eventTitle = $_POST["eventTitle"];
            $eventTitle = str_replace("'", "\'", $eventTitle);
            $description = ($_POST["description"] == undefined) ? '': $_POST["description"];
            $description = str_replace("'", "\'", $description);
            $eventDateTime = $_POST["eventDateTime"];
            $dressCode = ($_POST["dressCode"] == undefined) ? '': $_POST["dressCode"];
            $dressCode = str_replace("'", "\'", $dressCode);
            $eventHasGuestList = ($_POST["eventHasGuestList"] == undefined) ? '': $_POST["eventHasGuestList"];
            $guestListMax = $_POST["guestListMax"];
            $dealsOnTheNight = ($_POST["dealsOnTheNight"] == undefined) ? '': $_POST["dealsOnTheNight"];
            $dealsOnTheNight = str_replace("'", "\'", $dealsOnTheNight);
            $extraInfo = ($_POST["extraInfo"] == undefined) ? '': $_POST["extraInfo"];
            $extraInfo = str_replace("'", "\'", $extraInfo);
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
            $offerTitle = str_replace("'", "\'", $offerTitle);
            $description = $_POST["description"];
            $description = str_replace("'", "\'", $description);
            $startDateTime = $_POST["startDateTime"];
            $endDateTime = ($_POST["endDateTime"] == 0) ? "NULL": "'".mysql_real_escape_string($_POST["endDateTime"])."'";;
            $weeksAhead = $_POST["weeksAhead"];
            $weekdayIndex = $_POST["weekdayIndex"];
            $_eventId = $_POST["_eventId"];
        }
        else if ($imgEntryType == 'movie_cover_photo') {
            $data               = file_get_contents("php://input");
            $dataJsonDecode     = json_decode($data);
            
            $name = $_POST["movieTitle"];
            $name = str_replace("'", "\'", $name);
            $description = $_POST["description"];
            $description = str_replace("'", "\'", $description);
            $firstShowingDate = $_POST["firstShowingDate"];
            $lastShowingDate = $_POST["lastShowingDate"];
            $movieTrailerLink = $_POST["movieTrailerLink"];
            $movieStyleIdString = $_POST["movieStyleIdString"];
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

        if ($imgEntryType == 'cover_photo' || $imgEntryType == 'profile_photo' || $imgEntryType == 'event_cover_photo' || $imgEntryType == 'movie_cover_photo' || ($imgEntryType == 'offer_cover_photo' && !empty($imageName))) {
            $data = getimagesize($imageTmpName);
            $imgName = $imageName;
            $newImageName = $_profileId."_".$_imageId."_".$imgName;
            $newImageNameQuoted = "'".$_profileId."_".$_imageId."_".$imgName."'";
            $mainUploadDir = $uploadDir.$newImageName;
            $thumbUploadDir = $uploadDir."thumbnail/".$newImageName;

            switch($imageType){
                case 'image/png':
                    $img_res =  imagecreatefrompng($imageTmpName);
                    $file_extension = ".png";
                    break;
                case 'image/gif':
                   $img_res = imagecreatefromgif($imageTmpName);
                   $file_extension = ".gif";
                   break;
                case 'image/jpeg': 
                case 'image/pjpeg':
                    $img_res = imagecreatefromjpeg($imageTmpName);
                    $file_extension = ".jpg";
                    break;
                default:
                    $img_res = 0;
            }
            
            function image_fix_orientation($image, $filename) {
                $image = imagerotate($image, array_values([0, 0, 0, 180, 0, 0, -90, 0, 90])[@exif_read_data($filename)['Orientation'] ?: 0], 0);
            }

            image_fix_orientation($img_res, $imageTmpName);
            $canvas = imagecreatetruecolor($xDist, $yDist);
            $resample = imagecopyresampled($canvas, $img_res, 0, 0, $startX, $startY, $xDist, $yDist, $xDist, $yDist);

            if($resample){
                
                switch($imageType){
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
                    switch($imageType){
                        case 'image/png':
                            $thumb_res = imagecreatefrompng($imageTmpName);
                            break;
                        case 'image/gif':
                            $thumb_res = imagecreatefromgif($imageTmpName);
                            break;
                        case 'image/jpeg': 
                        case 'image/pjpeg':
                            $thumb_res = imagecreatefromjpeg($imageTmpName);
                            break;
                        default:
                            $thumb_res = 0;
                    }
                    
                    image_fix_orientation($thumb_res, $imageTmpName);
                    $thumb_dest = imagecreatetruecolor(320, 320*(640/960));
                    $resample_thumb = imagecopyresized($thumb_dest, $thumb_res, 0, 0, 0, 0, 320, 320*(640/960), $data[0], $data[1]);
                    
                    switch($imageType){
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
        else if ($imgEntryType == 'offer_cover_photo' && empty($imageName)) {
            $newImageNameQuoted = "''";
            $result = 1;
            $result_thumb = true;
        }
        else {
            $uploadDir = $_SERVER['DOCUMENT_ROOT']."/sneak-preview/img/user_images/".$uploadFolder."/";
            
            //Move your files into upload folder
            $imgName = $imageName;
            $newImageName = $_profileId."_".$_imageId."_".$imgName;
            $newImageNameQuoted = "'".$_profileId."_".$_imageId."_".$imgName."'";
            $result = move_uploaded_file($imageTmpName, $uploadDir.$newImageName);
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
                    $result = mysql_query("CALL createMovie('$name', '$description', '$firstShowingDate', '$lastShowingDate', '$movieStyleIdString', '$movieTrailerLink', $newImageNameQuoted, @_movieId);");
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
