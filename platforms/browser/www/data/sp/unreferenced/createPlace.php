<?php
  $name = $_GET['name'];
  $_businessId = $_GET['_businessId'];
  $addressLine1 = $_GET['addressLine1'];
  $addressLine2 = $_GET['addressLine2'];
  $town = $_GET['town'];
  $postCode = $_GET['postCode'];


  $sql    = "INSERT INTO place
  			(name, _businessId, addressLine1, addressLine2, town, postCode)
  			VALUES
  			($name, $_businessId, $addressLine1, $addressLine2, $town, $postCode)";

  $result = mysql_query($sql);
?>