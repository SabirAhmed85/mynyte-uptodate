<?php
    $action = $_GET['action'];
    
    if ($action == 'scanFilesInDirectory') {
        $filePath = $_GET['filePath'];
        
        echo json_encode(scandir('../../../'.$filePath.'/'));
    }
?>
