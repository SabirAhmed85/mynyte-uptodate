<?php
  $intended_environment = 'Staging';

  $http_origin = $_SERVER['HTTP_ORIGIN'];
  $httpUrl = ($intended_environment == 'Staging') ? "https://www.mynyte.co.uk/staging": "https://www.mynyte.co.uk";

  if ($http_origin == $httpUrl) {
    header("Access-Control-Allow-Origin: $http_origin");
  }

  $db_host = "localhost";

  $db_uid = "qxiryynz_mynyteuser";

  $db_pass = "wM)Ln8-Q2o6g";

  //$db_name = ($intended_environment == 'Staging') ? "qxiryynz_MyNyte_Staging": "qxiryynz_mynyte";
  $db_name = ($intended_environment == 'Staging') ? "qxiryynz_mynyte": "qxiryynz_mynyte";
?>