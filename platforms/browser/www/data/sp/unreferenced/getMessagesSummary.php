<?php
  $id = $_GET['id'];
  
  $sql    = "SELECT * FROM messageGroup mg
            LEFT JOIN message m ON m._messageGroupId = m.id
            GROUP BY mg.id
            WHERE m._participantProfileId = $id";

/*
    BASIC WITHOUT MESSAGE GROUPS JUST IN CASE
 
  $sql    = "SELECT * FROM message m
            LEFT JOIN profile p ON p.id == m._senderProfileId
            GROUP BY p.id
            WHERE m._receiverProfileId = $id
            OR m._senderProfileId = $id";
*/

  $result = mysql_query($sql);
?>