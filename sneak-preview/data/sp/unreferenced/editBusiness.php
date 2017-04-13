<?php
  $id = $_GET['id'];
  $businessName = $_GET['businessName'];
  $description = $_GET['description'];
  $phone1 = $_GET['phone1'];
  $phone2 = $_GET['phone2'];
  $email1 = $_GET['email1'];
  $email2 = $_GET['email2'];


  $sql    = "UPDATE business SET businessName = $businessName
  							, description = $description
                , phone1 = $phone1
                , phone2 = $phone2
                , email1 = $email1
                , email2 = $email2,
                , isActive = 1
  			WHERE id = $id";

  $result = mysql_query($sql);
?>