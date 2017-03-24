<?php
  $_profileId = $_GET['_profileId'];
  $firstName = $_GET['firstName'];
  $lastName = $_GET['lastName'];
  $addressLine1 = $_GET['addressLine1'];
  $addressline2 = $_GET['addressline2'];
  $town = $_GET['town'];
  $postCode = $_GET['postCode'];
  $description = $_GET['description'];
  $phone1 = $_GET['phone1'];
  $phone2 = $_GET['phone2'];
  $email1 = $_GET['email1'];
  $email2 = $_GET['email2'];


  $sql    = "INSERT INTO person
  			(_profileId, firstName, lastName, addressLine1, addressline2, town, postCode, description, phone1, phone2, email1, email2, isActive)
  			VALUES
  			($_profileId, $firstName, $lastName, $addressLine1, $addressline2, $town, $postCode, $description, $phone1, $phone2, $email1, $email2, 1)";

  $result = mysql_query($sql);
?>