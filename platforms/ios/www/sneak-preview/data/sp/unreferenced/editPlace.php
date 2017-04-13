<?php
  $id = $_GET['id'];
  $_businessId = $_GET['_businessId'];
  $name = $_GET['name'];
  $addressLine1 = $_GET['addressLine1'];
  $addressLine2 = $_GET['addressLine2'];
  $town = $_GET['town'];
  $postCode = $_GET['postCode'];


  $sql    = "UPDATE place SET name = $name
                , _businessId = $_businessId
  							, addressLine1 = $addressLine1
  							, addressLine2 = $addressLine2
  							, town = $town
  							, postCode = $postCode
  			WHERE id = $id";

  $result = mysql_query($sql);
?>