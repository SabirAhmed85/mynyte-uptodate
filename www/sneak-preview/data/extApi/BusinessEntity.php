<?php

  require_once('db-connect-test.php');
    
  $action = $_GET['action'];
  $callback = $_GET['action'];

  $data               = file_get_contents("php://input");
  $dataJsonDecode     = json_decode($data);

  if ($action == 'addBusinessEntityItem') {
    $_businessId = $_GET['_businessId'];
    $businessEntityItemName = $_GET['businessEntityItemName'];
    $nameValuePairString = $_GET['nameValuePairString'];
    
    /*
    addBusinessEntityItem Method Parameters:
      - _Business Id (_id of business which owns the item Model)
      - Business Entity Item Name (VARCHAR(1000))
      - Stringified Object of Properties to filter by (VARCHAR(100000)) | NULL if n/a

      Example: CALL addBusinessEntityItem(1, "Apppointment Booking", "[['Related Business Entity Item Appointment Type':='Process Serving Job']],[['_Related User Account Id':='19']]");

    */
      //echo 'CALL addBusinessEntityItem('.$_businessId.', "'.$businessEntityItemName.'", "'.$nameValuePairString.'")';
    $result = mysql_query('CALL addBusinessEntityItem('.$_businessId.', "'.$businessEntityItemName.'", "'.$nameValuePairString.'")');
  }

  else if ($action == 'getBusinessEntityItems') {
    $_businessId = $_GET['_businessId'];
    $businessEntityItemType = $_GET['businessEntityItemType'];
    $businessEntityItemType = (!isset($_GET['businessItemPropertyString'])) ? $businessEntityItemType: "'".$businessEntityItemType."'";
    $businessItemPropertyString = (!isset($_GET['businessItemPropertyString'])) ? 'NULL' : '"'.$_GET['businessItemPropertyString'].'"';
    $_relatedViewModelId = (!isset($_GET['_relatedViewModelId'])) ? 'NULL' : $_GET['_relatedViewModelId'];
    $extraFiltersString = (!isset($_GET['extraFiltersString'])) ? 'NULL' : '"'.$_GET['extraFiltersString'].'"';

    /*
    getBusinessEntityItems Method Parameters:
      - _businessId (_id of business which owns the item Model)
      - Business Entity Item Name (VARCHAR(1000))
      - Stringified Object of Properties to return (VARCHAR(100000)) | NULL if n/a
      - _Related View Model Id (INT(11)) | NULL if n/a
      - Stringified Object of Properties to filter by (VARCHAR(100000)) | NULL if n/a

      Example: CALL getBusinessEntityItems(1, "Apppointment Booking", NULL, NULL, "[['Status':='Incomplete']],[['Date Created':>'2017-05-01']]");

    */
    //echo 'CALL getBusinessEntityItems('.$_businessId.', "'.$businessEntityItemType.'", '.$businessItemPropertyString.', '.$_relatedViewModelId.', '.$extraFiltersString.')';
    $result = mysql_query('CALL getBusinessEntityItems('.$_businessId.', "'.$businessEntityItemType.'", '.$businessItemPropertyString.', '.$_relatedViewModelId.', '.$extraFiltersString.')');
  }

  else if ($action == 'getBusinessEntityItemsMeta') {
    $_businessId = $_GET['_businessId'];
    $_businessEntityItemId = $_GET['_businessEntityItemId'];
    $_relatedViewModelId = (!isset($_GET['_relatedViewModelId'])) ? 'NULL' : $_GET['_relatedViewModelId'];
    
    /*
    getBusinessEntityItemsMeta Method Parameters:
      - _Business Id (_id of business which owns the item)
      - _Business Entity Item Id (VARCHAR(1000))
      - _Related View Model Id (INT(11)) | NULL if n/a

      Example: CALL getBusinessEntityItemsMeta(1, 2, 12);

    */

    $result = mysql_query('CALL getBusinessEntityItemsMeta('.$_businessId.', '.$_businessEntityItemId.', '.$_relatedViewModelId.')');
  }

  else if ($action == 'getBusinessEntityItemModel') {
    $_businessId = $_GET['_businessId'];
    $businessEntityItemType = $_GET['businessEntityItemType'];
    $extraFiltersString = (isset($_GET['extraFiltersString'])) ? ('"'.$_GET['extraFiltersString'].'"'): 'NULL';
    $_relatedViewModelId = (isset($_GET['_relatedViewModelId'])) ? ('"'.$_GET['_relatedViewModelId'].'"'): 'NULL';
    /*
    getBusinessEntityItemModel Method Parameters:
      - _Business Id (_id of business which owns the item)
      - _Business Entity Item Type (VARCHAR(1000))
      - Stringified Object of Properties to filter by (VARCHAR(100000)) | NULL if n/a
      - _Related View Model Id (INT(11)) | NULL if n/a

      Example: CALL getBusinessEntityItemModel(1, "Appointment Booking", "[['Related Business Entity Item Appointment Type':='Process Serving Job']]", NULL);

    */
    //echo 'CALL getBusinessEntityItemModel('.$_businessId.', "'.$businessEntityItemType.'", '.$extraFiltersString.', '.$_relatedViewModelId.');';
    $result = mysql_query('CALL getBusinessEntityItemModel('.$_businessId.', "'.$businessEntityItemType.'", '.$extraFiltersString.', '.$_relatedViewModelId.');');
  }

  else if ($action == 'updateBusinessEntityItem') {
    $_businessId = $_GET['_businessId'];
    $_businessEntityItemId = $_GET['_businessEntityItemId'];
    $updateString = $_GET['updateString'];
    
    /*
    updateBusinessEntityItem Method Parameters:
      - _Business Id (_id of business which owns the item)
      - _Business Entity Item Id (VARCHAR(1000))
      - Stringified Object of Properties to update (VARCHAR(100000))

      Example: CALL updateBusinessEntityItem(1, 2, "[['Status':='Complete']],[['Date Completed':=NOW()]]");

    */

    $result = mysql_query('CALL updateBusinessEntityItem('.$_businessId.', "'.$_businessEntityItemId.'", "'.$updateString.'");');
  }

  else if ($action == 'deleteBusinessEntityItem') {
    $_businessId = $_GET['_businessId'];
    $_businessEntityItemId = $_GET['_businessEntityItemId'];
    
    /*
    deleteBusinessEntityItem Method Parameters:
      - _Business Id (_id of business which owns the item)
      - _Business Entity Item Id (VARCHAR(1000))

      Example: CALL deleteBusinessEntityItem(1, 2);

    */

    $result = mysql_query("CALL deleteBusinessEntityItem($_businessId, $_businessEntityItemId");
  }

  else if ($action == 'logInBusinessUserAccount') {
    $_businessId = $_GET['_businessId'];
    $email = $_GET['email'];
    $hash = $_GET['hash'];
    $_relatedViewModelId = $_GET['_relatedViewModelId'];
    
    /*
    logInBusinessUserAccount Method Parameters:
      - _Business Id (_id of business which owns the user Account)
      - Email Address (VARCHAR(1000))
      - Hash (VARCHAR(10000))

      Example: CALL logInBusinessUserAccount(1, "sam@something.com", "sdinqwndiqwnd");

    */

    $result_prep = mysql_query("CALL logInBusinessUserAccount($_businessId, $email, $hash");

    $_userId = $result_prep[0]["@_userId"];

    $result = mysql_query("CALL getBusinessEntityItemsMeta($_businessId, $_userId, $_relatedViewModelId");
  }

  else if ($action == 'createLiveChatMessageGroup') {
    /*
    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);
    
    $_personProfileId = $_GET['_personProfileId;
    $_businessId = $_GET['_businessId;
    */

    $result = mysql_query("CALL createLiveChatMessageGroup(853, 1);");
    
    while($row = mysql_fetch_assoc($result))
      $output[] = $row;

    shuffle($output);
    echo json_encode($output[0]["@_messageGroupId"]);
  }

  while($row = mysql_fetch_assoc($result))
      $output[] = $row;

    header("Content-Type: application/json");
    echo $action.'({items:'.json_encode($output).'})';

  mysql_close();
?>
