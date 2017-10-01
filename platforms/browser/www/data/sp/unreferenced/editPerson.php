<?php
  $id = $_GET['id'];
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


  $sql    = "UPDATE person SET firstName = $firstName
                , lastName = $lastName
  							, addressLine1 = $addressLine1
  							, addressline2 = $addressline2
  							, town = $town
  							, postCode = $postCode
  							, description = $description
                , phone1 = $phone1
                , phone2 = $phone2
                , email1 = $email1
                , email2 = $email2
  			WHERE id = $id";

  $result = mysql_query($sql);
?>