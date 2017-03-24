<?php
    require_once('../db-connect.php');
    
  if (isset($_GET['action'])) {
  
    $businessType = mysql_real_escape_string($_GET['businessType']);
    $town = mysql_real_escape_string($_GET['town']);
    $companyName = mysql_real_escape_string($_GET['companyName']);
    $name = mysql_real_escape_string($_GET['name']);
    $role = ($_GET['role'] == undefined) ? "": mysql_real_escape_string($_GET['role']);
    $email = ($_GET['email'] == undefined) ? "": mysql_real_escape_string($_GET['email']);
    $website = ($_GET['website'] == undefined) ? "": mysql_real_escape_string($_GET['website']);
    $note = ($_GET['note'] == undefined) ? "": mysql_real_escape_string($_GET['note']);
    $phone = ($_GET['phone'] == undefined) ? "": mysql_real_escape_string($_GET['phone']);
    
    $_businessTypeIdQuery = mysql_query("SELECT _id as _id FROM BusinessType WHERE name = '$businessType' LIMIT 1");
    $_businessTypeId = mysql_fetch_array($_businessTypeIdQuery)["_id"];
    
    $_townIdQuery = mysql_query("SELECT _id as _id FROM Town WHERE name = '$town' LIMIT 1");
    $_townId = mysql_fetch_array($_townIdQuery)["_id"];
    
    if (is_null($_businessTypeId) || empty($_businessTypeId)) {
        $_businessTypeIdQuery = mysql_query("INSERT INTO BusinessType (name) VALUES ('$businessType');");
        $_businessTypeId = mysql_query("SELECT _id as _id FROM `BusinessType` ORDER BY _id DESC LIMIT 1");
        $_businessTypeId = mysql_fetch_array($_businessTypeId)["_id"];
    }
    
    if (is_null($_townId) || empty($_townId)) {
        $_townIdQuery = mysql_query("INSERT INTO Town (name) VALUES ('$town');");
        $_townId = mysql_query("SELECT _id as _id FROM `Town` ORDER BY _id DESC LIMIT 1");
        $_townId = mysql_fetch_array($_townId)["_id"];
    }
    
    if (($_GET['action']) == 'add') {
        $sql    = "INSERT INTO `Contact` (_townId, _businessTypeId, companyName, name, role, phone, email, website, note) VALUES ('$_townId', '$_businessTypeId', '$companyName', '$name', '$role', '$phone', '$email', '$website', '$note')";
        print($sql);
    }
    elseif (($_GET['action']) == 'edit') {
        $contactId = ($_GET['contactId']);
        $sql    = "UPDATE `Contact` SET _businessTypeId = '$_businessTypeId', _townId = '$_townId', companyName = '$companyName', name = '$name', role = '$role', phone = '$phone', email = '$email', website = '$website', note = '$note' WHERE _id = '$contactId'";
        print("UPDATE `Contact` SET _businessTypeId = '$_businessTypeId', _townId = '$_townId', companyName = '$companyName', name = '$name', role = '$role', phone = '$phone', email = '$email', website = '$website', note = '$note' WHERE _id = '$contactId'");
    }
  }
  else {
  
    if (isset($_GET['contactId'])) {
        $contactId = (mysql_real_escape_string($_GET['contactId']));
        $sql    = "SELECT `Contact`.*, `Town`.name as town, `BusinessType`.name as businessType FROM `Contact` LEFT JOIN `Town` ON `Town`._id = `Contact`._townId LEFT JOIN `BusinessType` ON `BusinessType`._id = `Contact`._businessTypeId WHERE `Contact`._id = '$contactId' LIMIT 1";
    }
    else {
        $sql    = "SELECT `Contact`.*, `Town`.name as town, `BusinessType`.name as businessType FROM `Contact` LEFT JOIN `Town` ON `Town`._id = `Contact`._townId LEFT JOIN `BusinessType` ON `BusinessType`._id = `Contact`._businessTypeId";
    }
  }
  
  $result = mysql_query($sql);
  
  while($row = mysql_fetch_assoc($result))
    $output[] = $row;
    
  //header('Content-Type: application/json');
  echo json_encode($output);
  
  mysql_close();
?>