<?php
    require('../db-connect.php');
    
    $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);
    
    if ($action == 'getMessageGroups') {
        $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        $groupType = (empty($_GET['groupType'])) ? "": mysql_real_escape_string($_GET['groupType']);
        
        $result = mysql_query("CALL getMessageGroups('$_profileId', '$groupType');");
    }
    elseif ($action == 'getAllUserMessagesSummaryForUpdate') {
        $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        
        $result = mysql_query("CALL getAllUserMessagesSummaryForUpdate('$_profileId');");
    }
    elseif ($action == 'getUnreadUserMessagesSummaryForUpdate') {
        $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        
        $result = mysql_query("CALL getUnreadUserMessagesSummaryForUpdate('$_profileId');");
    }
    elseif ($action == 'getMessageGroupSummary') {
        $_usersProfileId = (empty($_GET['_usersProfileId'])) ? "": mysql_real_escape_string($_GET['_usersProfileId']);
        $_groupId = (empty($_GET['_groupId'])) ? "": mysql_real_escape_string($_GET['_groupId']);
        
        $result = mysql_query("CALL getMessageGroupSummary('$_usersProfileId','$_groupId');");
    }
    elseif ($action == 'getMessageGroup') {
        $_groupId = (empty($_GET['_groupId'])) ? "": mysql_real_escape_string($_GET['_groupId']);
        $_usersProfileId = (empty($_GET['_usersProfileId'])) ? "": mysql_real_escape_string($_GET['_usersProfileId']);
        $currentMessageIndex = (empty($_GET['currentMessageIndex'])) ? "": mysql_real_escape_string($_GET['currentMessageIndex']);
        if ($currentMessageIndex == 0) {
            $currentMessageIndex = 1844674407370955161;
        }
        $_firstMessageId = (empty($_GET['_firstMessageId'])) ? "": mysql_real_escape_string($_GET['_firstMessageId']);
        
        $result = mysql_query("CALL getMessageGroup('$_groupId', '$_usersProfileId', '$currentMessageIndex', '$_firstMessageId');");
    }
    elseif ($action == 'getMessageRecipientProfileIds') {
        $_messageGroupId = (empty($_GET['_messageGroupId'])) ? "": mysql_real_escape_string($_GET['_messageGroupId']);
        $_senderProfileId = (empty($_GET['_senderProfileId'])) ? "": mysql_real_escape_string($_GET['_senderProfileId']);
        
        $result = mysql_query("CALL getMessageRecipientProfileIds('$_messageGroupId', '$_senderProfileId');");
    }
    elseif ($action == 'getMessageDetails') {
        $_id = (empty($_GET['_id'])) ? "": mysql_real_escape_string($_GET['_id']);
        
        $result = mysql_query("CALL getMessageDetails($_id);");
    }
    elseif ($action == 'insertMessageReadReceipts') {
        $_groupId = (empty($_GET['_groupId'])) ? "": mysql_real_escape_string($_GET['_groupId']);
        $_usersProfileId = (empty($_GET['_usersProfileId'])) ? "": mysql_real_escape_string($_GET['_usersProfileId']);
        $_messageId = (empty($_GET['_messageId'])) ? "": mysql_real_escape_string($_GET['_messageId']);
        
        $result = mysql_query("CALL insertMessageReadReceipts($_groupId, $_usersProfileId, $_messageId);");
    }
    elseif ($action == 'addMessage') {
        $_groupId = (empty($_GET['_groupId'])) ? "": mysql_real_escape_string($_GET['_groupId']);
        $groupType = (empty($_GET['groupType'])) ? "": mysql_real_escape_string($_GET['groupType']);
        $_senderId = (empty($_GET['_senderId'])) ? "": mysql_real_escape_string($_GET['_senderId']);
        $messageText = (empty($_GET['messageText'])) ? "": mysql_real_escape_string($_GET['messageText']);
        $_relListingId = (empty($_GET['_relListingId'])) ? NULL: mysql_real_escape_string($_GET['_relListingId']);
        $relListingType = (empty($_GET['relListingType'])) ? NULL: mysql_real_escape_string($_GET['relListingType']);
        $profileIds = (empty($_GET['_profileIds'])) ? array() : ($_GET['_profileIds']);
        $profileIdString = implode(', ', $profileIds);
        
        if ($_groupId == "null") {
            $_groupId = mysql_query("INSERT INTO MessageGroup (name, dateTimeCreated, type) VALUES ('', NOW(), '$groupType');");
            $_groupId = mysql_insert_id();
            $resultPrepare = mysql_query("INSERT INTO MessageGroupParticipant (_messageGroupId, _participantProfileId)
                    SELECT '$_groupId', _id FROM Profile WHERE _id IN ($profileIdString)");
        }

        $result = mysql_query("CALL insertMessage('$_groupId', '$_senderId', '$messageText', $_relListingId, '$relListingType');");
    }
    elseif ($action == 'checkIfMessageGroupExists') {
        $profileIds = $_GET['_profiles'];
        $profileIdString = implode(', ', $profileIds);
        $profileCount = count($profileIds);
        
        $result = mysql_query("CALL checkIfMessageGroupExists('$profileIdString', $profileCount)");
        //print($result);
    }
    
    //print(json_encode($_usersId));
    while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
        header('Content-Type: application/json');
        echo json_encode($output);
            
mysql_close();
?>
