<?php
  $_profileId = $_GET['_profileId'];
  $businessName = $_GET['businessName'];
  $description = $_GET['description'];
  $phone1 = $_GET['phone1'];
  $phone2 = $_GET['phone2'];
  $email1 = $_GET['email1'];
  $email2 = $_GET['email2'];


  $sql    = "INSERT INTO business 
  			(_profileId, businessName, description, phone1, phone2, email1, email2, isActive, isFeature)
  			VALUES
  			($_profileId, $businessName, $description, $phone1, $phone2, $email1, $email2, 1, 0)";

  $result = mysql_query($sql);
?>