<?php
  $messageGroupId = $_GET['messageGroupId'];
  $senderId = $_GET['senderId'];
  $receiverId = $_GET['receiverId'];
  $text = $_GET['text'];
  $messageType = $_GET['messageType'];
  $relatedItem = $_GET['relatedItem'];
  $relatedItemType = $_GET['relatedItemType'];
  
  if (!isset($messageGroupId)) {
    $createMsgGroupSql    =
        "INSERT INTO messageGroup
        (_senderProfileId, _receiverProfileId, messageText, dateTime, messageType, relListing)
        VALUES
        ($senderId, $receiverId, $text, Date.now(), $messageType)
  
        $messageGroupId = mysqli_insert_id();
  
        INSERT INTO messageGroupParticipant
        (_messageGroupId, _participantProfileId)
        VALUES
        ($messageGroupId, $senderId)
  
        INSERT INTO messageGroupParticipant
        (_messageGroupId, _participantProfileId)
        VALUES
        ($messageGroupId, $receiverId)";
      
    $createMsgGroupResult = mysql_query($createMsgGroupSql);
  }


  $sql    = "INSERT INTO message
  			(_messageGroupId, messageType, messageText, dateTime, relatedItem, relatedItemType)
  			VALUES
  			($messageGroupId, $messageType, $text, Date.now(), $relatedItem, $relatedItemType)";

  $result = mysql_query($sql);
?>