<?php
    require_once('../db-connect.php');
    
    $action = (empty($_GET['action'])) ? "": mysql_real_escape_string($_GET['action']);
    
    $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);

    if ($action == 'getMenuItemCategories') {
        $result = mysql_query("CALL getMenuItemCategories('$_businessId');");
    }
    elseif ($action == 'getMenuItemSubCategories') {
        $result = mysql_query("CALL getMenuItemSubCategories('$_businessId');");
    }
    elseif ($action == 'getMenuItems') {
        $_menuItemCategoryId = (empty($_GET['_menuItemCategoryId'])) ? "": mysql_real_escape_string($_GET['_menuItemCategoryId']);
        $_menuTypeId = (empty($_GET['_menuTypeId'])) ? "": mysql_real_escape_string($_GET['_menuTypeId']);
        
        $result = mysql_query("CALL getMenuItems('$_businessId','$_menuItemCategoryId', '$_menuTypeId');");
    }
    elseif ($action == 'getMenuItem') {
        $_menuItemId = (empty($_GET['_menuItemId'])) ? "": mysql_real_escape_string($_GET['_menuItemId']);
        
        $result = mysql_query("CALL getMenuItem('$_businessId','$_menuItemId');");
    }
    elseif ($action == 'getMenuItemsExtraOptions') {
        $_menuItemId = (empty($_GET['_menuItemId'])) ? "": mysql_real_escape_string($_GET['_menuItemId']);
        
        $result = mysql_query("CALL getMenuItemsExtraOptions('$_businessId','$_menuItemId');");
    }
    elseif ($action == 'getMenuOrdersForBusiness') {
        $orderType = (empty($_GET['orderType'])) ? "": mysql_real_escape_string($_GET['orderType']);
        
        $result = mysql_query("CALL getMenuOrdersForBusiness('$_businessId','$orderType');");
    }
    elseif ($action == 'getMenuOrderForBusiness') {
        $_menuOrderId = (empty($_GET['_menuOrderId'])) ? "": mysql_real_escape_string($_GET['_menuOrderId']);
        
        $result = mysql_query("CALL getMenuOrderForBusiness('$_menuOrderId');");
    }
    elseif ($action == 'getMenuOrdersForUser') {
        $_profileId = (empty($_GET['_profileId'])) ? "": mysql_real_escape_string($_GET['_profileId']);
        
        $result = mysql_query("CALL getMenuOrdersForUser('$_profileId');");
    }
    elseif ($action == 'getMenuItemCategoriesForBusiness') {
        $result = mysql_query("CALL getMenuItemCategoriesForBusiness('$_businessId');");
    }
    elseif ($action == 'getMenuItemCategoryDetailsForBusiness') {
        $_menuItemCategoryId = (empty($_GET['_menuItemCategoryId'])) ? "": mysql_real_escape_string($_GET['_menuItemCategoryId']);
        $result = mysql_query("CALL getMenuItemCategoryDetailsForBusiness('$_businessId', '$_menuItemCategoryId')");
    }
    elseif ($action == 'updateMenuItemCategoryDetailsForBusiness') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_menuItemCategoryId = $dataJsonDecode->_menuItemCategoryId;
        $catName = $dataJsonDecode->catName;
        $catName = str_replace("'", "\'", $catName);
        $description = $dataJsonDecode->description;
        $description = str_replace("'", "\'", $description);
        
        $result = mysql_query("CALL updateMenuItemCategory('$_businessId', '$_menuItemCategoryId', '$catName', '$description')");
    }
    elseif ($action == 'getMenuItemSubCategoriesForBusiness') {
        $result = mysql_query("CALL getMenuItemSubCategoriesForBusiness('$_businessId');");
    }
    elseif ($action == 'getMenuItemSubCategoryDetailsForBusiness') {
        $_menuItemSubCategoryId = (empty($_GET['_menuItemSubCategoryId'])) ? "": mysql_real_escape_string($_GET['_menuItemSubCategoryId']);
        $result = mysql_query("CALL getMenuItemSubCategoryDetailsForBusiness('$_businessId', '$_menuItemSubCategoryId')");
    }
    elseif ($action == 'updateMenuItemSubCategoryDetailsForBusiness') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_menuItemSubCategoryId = $dataJsonDecode->_menuItemSubCategoryId;
        $catName = $dataJsonDecode->catName;
        $catName = str_replace("'", "\'", $catName);
        $description = $dataJsonDecode->description;
        $description = str_replace("'", "\'", $description);
        
        $result = mysql_query("CALL updateMenuItemSubCategory('$_businessId', '$_menuItemSubCategoryId', '$catName', '$description')");
    }
    elseif ($action == 'getMenuTemplateOptionCategories') {
        $result = mysql_query("SELECT * FROM MenuExtraOptionCategory");
    }
    elseif ($action == 'getAllMenuItemTemplateOptionsForBusiness') {
        $result = mysql_query("CALL getAllMenuItemTemplateOptionsForBusiness('$_businessId');");
    }
    elseif ($action == 'getMenuItemTemplateOption') {
        $_optionId = (empty($_GET['_optionId'])) ? "": mysql_real_escape_string($_GET['_optionId']);
        
        $result = mysql_query("CALL getMenuItemTemplateOption('$_businessId', '$_optionId');");
    }
    elseif ($action == 'getAllMenuItemTags') {
        $result = mysql_query("SELECT * FROM MenuItemTag;");
    }
    elseif ($action == 'getMenuItemOptionsForBusiness') {
        $result = mysql_query("SELECT * FROM MenuExtraOption WHERE _businessId = '$_businessId'");
    }
    
    elseif ($action == 'acceptMenuOrder') {
        $_menuOrderId = (empty($_GET['_menuOrderId'])) ? "": mysql_real_escape_string($_GET['_menuOrderId']);
        
        $result = mysql_query("CALL acceptOrRejectMenuOrder('$_menuOrderId', 'Accept')");
    }
    elseif ($action == 'rejectMenuOrder') {
        $_menuOrderId = (empty($_GET['_menuOrderId'])) ? "": mysql_real_escape_string($_GET['_menuOrderId']);
        
        $result = mysql_query("CALL acceptOrRejectMenuOrder('$_menuOrderId', 'Reject')");
    }
    elseif ($action == 'acceptMenuOrderWithConditions') {
        $_menuOrderId = (empty($_GET['_menuOrderId'])) ? "": mysql_real_escape_string($_GET['_menuOrderId']);
        
        $result = mysql_query("CALL acceptOrRejectMenuOrder('$_menuOrderId', 'Accept with Conditions')");
    }
    elseif ($action == 'createMenuItem') {
        $_menuTypeId = (empty($_GET['_menuTypeId'])) ? "": mysql_real_escape_string($_GET['_menuTypeId']);
        $_menuItemCategoryId = (empty($_GET['_menuItemCategoryId'])) ? "": mysql_real_escape_string($_GET['_menuItemCategoryId']);
        $_menuItemSubCategoryId = (empty($_GET['_menuItemSubCategoryId'])) ? NULL: mysql_real_escape_string($_GET['_menuItemSubCategoryId']);
        $name = (empty($_GET['name'])) ? "": mysql_real_escape_string($_GET['name']);
        $price = (empty($_GET['price'])) ? "": mysql_real_escape_string($_GET['price']);
        $description = (empty($_GET['description']) || $_GET['description'] == undefined) ? "": mysql_real_escape_string($_GET['description']);
        
        $data = file_get_contents("php://input");
        $dataJsonDecode = json_decode($data);
        $appliedOptions = $dataJsonDecode->appliedOptions;
        $appliedTags = $dataJsonDecode->appliedTags;
        
        $result = mysql_query("INSERT INTO MenuItem (_menuTypeId, _businessId, _menuItemCategoryId, _menuItemSubCategoryId, Name, Price, Description) VALUES ('$_menuTypeId', '$_businessId','$_menuItemCategoryId', ".$_menuItemSubCategoryId.", '$name','$price','$description')");
        //print("INSERT INTO MenuItem (_menuTypeId, _businessId, _menuItemCategoryId, _menuItemSubCategoryId, Name, Price, Description) VALUES ('$_menuTypeId', '$_businessId','$_menuItemCategoryId', ".$_menuItemSubCategoryId.", '$name','$price','$description')");
        $_newMenuItemId = mysql_insert_id();
        
        foreach($appliedOptions as $value) {
            $_optionId = $value->_id;
            $result = mysql_query("INSERT INTO MenuItemMenuExtraOption (_menuItemId, _menuExtraOptionId) VALUES ('$_newMenuItemId','$_optionId')");
        }
        foreach($appliedTags as $value) {
            $_tagId = $value->_id;
            $result = mysql_query("INSERT INTO MenuItemMenuItemTag (_menuItemId, _menuItemTagId) VALUES ('$_newMenuItemId','$_tagId')");
        }
    }
    elseif ($action == 'updateMenuItem') {
        $_businessId = (empty($_GET['_businessId'])) ? "": mysql_real_escape_string($_GET['_businessId']);
        $_menuItemId = (empty($_GET['_menuItemId'])) ? "": mysql_real_escape_string($_GET['_menuItemId']);
        $_menuItemCatId = (empty($_GET['_menuItemCatId'])) ? "": mysql_real_escape_string($_GET['_menuItemCatId']);
        $_menuItemSubCatId = (empty($_GET['_menuItemSubCatId'])) ? "NULL": mysql_real_escape_string($_GET['_menuItemSubCatId']);
        $name = (empty($_GET['name'])) ? "": mysql_real_escape_string($_GET['name']);
        $price = (empty($_GET['price'])) ? "": mysql_real_escape_string($_GET['price']);
        $description = (empty($_GET['description']) || $_GET['description'] == undefined) ? "": mysql_real_escape_string($_GET['description']);
        
        $data = file_get_contents("php://input");
        $dataJsonDecode = json_decode($data);
        $appliedOptions = $dataJsonDecode->appliedOptions;
        $appliedTags = $dataJsonDecode->appliedTags;
        
        $result = mysql_query("UPDATE MenuItem SET Name = '$name', Price = '$price', Description = '$description', _menuItemCategoryId = '$_menuItemCatId', _menuItemSubCategoryId = $_menuItemSubCatId WHERE _id = '$_menuItemId' AND _businessId = '$_businessId'");
        
        $result2 = mysql_query("DELETE FROM MenuItemMenuExtraOption WHERE _menuItemId = '$_menuItemId'");
        $result3 = mysql_query("DELETE FROM MenuItemMenuItemTag WHERE _menuItemId = '$_menuItemId'");
        
        foreach($appliedOptions as $value) {
            $_optionId = $value->_id;
            $result = mysql_query("INSERT INTO MenuItemMenuExtraOption (_menuItemId, _menuExtraOptionId) VALUES ('$_menuItemId','$_optionId')");
        }
        foreach($appliedTags as $value) {
            $_tagId = $value->_id;
            $result = mysql_query("INSERT INTO MenuItemMenuItemTag (_menuItemId, _menuItemTagId) VALUES ('$_menuItemId','$_tagId')");
        }
    }
    elseif ($action == 'deleteMenuItemTemplateOptionOption') {
        $_optionId = (empty($_GET['_optionId'])) ? "": mysql_real_escape_string($_GET['_optionId']);
        
        $orderIndexResult = mysql_query("SELECT orderIndex as orderIndex FROM MenuExtraOptionOption WHERE _id = '$_optionId' limit 1");
        $value = mysql_fetch_object($orderIndexResult);
        $orderIndex = $value -> orderIndex;
        $_menuExtraOptionResult = mysql_query("SELECT _menuExtraOptionId as _menuExtraOptionId FROM MenuExtraOptionOption WHERE _id = '$_optionId' limit 1");
        $value = mysql_fetch_object($_menuExtraOptionResult);
        $_menuExtraOptionId = $value -> _menuExtraOptionId;
        
        $result = mysql_query("DELETE FROM MenuExtraOptionOption WHERE _id = '$_optionId'");
        $result2 = mysql_query("UPDATE MenuExtraOptionOption SET orderIndex = orderIndex - 1 WHERE orderIndex > $orderIndex AND _menuExtraOptionId = '$_menuExtraOptionId'");
    }
    elseif ($action == 'createMenuItemCategory') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $catName = $dataJsonDecode->catName;
        $catName = str_replace("'", "\'", $catName);
        $catDescription = $dataJsonDecode->catDescription;
        $catDescription = str_replace("'", "\'", $catDescription);

        $result = mysql_query("call createMenuItemCategory('$_businessId', '$catName', '$catDescription')");
    }
    elseif ($action == 'createMenuItemSubCategory') {
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $catName = $dataJsonDecode->catName;
        $catName = str_replace("'", "\'", $catName);
        $catDescription = $dataJsonDecode->catDescription;
        $catDescription = str_replace("'", "\'", $catDescription);
        
        $result = mysql_query("INSERT INTO MenuItemSubCategory (_businessId, name, description) VALUES ('$_businessId', '$catName', '$catDescription')");
    }
    elseif ($action == 'createMenuItemTemplateOptionOption') {
        $_optionId = (empty($_GET['_optionId'])) ? "": mysql_real_escape_string($_GET['_optionId']);
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $name = $dataJsonDecode->name;
        $name = str_replace("'", "\'", $name);
        $extraPrice = $dataJsonDecode->extraPrice;
        $orderIndex = $dataJsonDecode->orderIndex;
        
        $result = mysql_query("INSERT INTO MenuExtraOptionOption (_menuExtraOptionId, Name, ExtraPrice, orderIndex) VALUES ('$_optionId', '$name', '$extraPrice', '$orderIndex')");
        $newId = mysql_insert_id();
        $result2 = mysql_query("UPDATE MenuExtraOptionOption SET orderIndex = orderIndex + 1 WHERE orderIndex > $orderIndex - 1 AND _menuExtraOptionId = $_optionId AND _id != $newId");
    }
    elseif ($action == 'updateMenuItemTemplateOption') {
        $_catId = (empty($_GET['_catId'])) ? "": mysql_real_escape_string($_GET['_catId']);
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $_id = $dataJsonDecode->_id;
        $name = $dataJsonDecode->name;
        $name = str_replace("'", "\'", $name);
        $optionType = $dataJsonDecode->type;
        $priceRelevant = $dataJsonDecode->priceRelevant;
        $quantityRelevant = $dataJsonDecode->quantityRelevant;
        if ($priceRelevant == "") {
            $priceRelevant = 0;
        }
        if ($quantityRelevant == "") {
            $quantityRelevant = 0;
        }
        $optionChoices = $dataJsonDecode->options;
        
        $result = mysql_query("UPDATE MenuExtraOption SET Name = '$name', _menuExtraOptionCategoryId = '$_catId', Type = '$optionType', QuantityRelevant = '$quantityRelevant', PriceRelevant = '$priceRelevant' WHERE _id = '$_id' AND _businessId = '$_businessId'");
        
        foreach ($optionChoices as $value) {
            $_optionId = $value -> _id;
            $name = $value -> name;
            $name = str_replace("'", "\'", $name);
            $extraPrice = $value -> extraPrice;
            $orderIndex = $value -> orderIndex;
            $result = mysql_query("UPDATE MenuExtraOptionOption SET Name = '$name', ExtraPrice = '$extraPrice', orderIndex = '$orderIndex' WHERE _id = '$_optionId' AND _menuExtraOptionId = '$_id'");
        }
    }
    elseif ($action == 'createMenuItemTemplateOption') {
        $_catId = (empty($_GET['_catId'])) ? "": mysql_real_escape_string($_GET['_catId']);
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        $name = $dataJsonDecode->name;
        $name = str_replace("'", "\'", $name);
        $optionType = $dataJsonDecode->type;
        $priceRelevant = $dataJsonDecode->priceRelevant;
        $quantityRelevant = $dataJsonDecode->quantityRelevant;
        if ($priceRelevant == "") {
            $priceRelevant = 0;
        }
        if ($quantityRelevant == "") {
            $quantityRelevant = 0;
        }
        $optionChoices = $dataJsonDecode->options;
        
        $result = mysql_query("INSERT INTO MenuExtraOption (_businessId, Name, _menuExtraOptionCategoryId, Type, QuantityRelevant, PriceRelevant) VALUES ('$_businessId', '$name', '$_catId', '$optionType', '$quantityRelevant', '$priceRelevant')");
        
        $_menuExtraOptionId = mysql_insert_id();
        
        foreach ($optionChoices as $value) {
            $name = $value -> name;
            $name = str_replace("'", "\'", $name);
            $extraPrice = $value -> extraPrice;
            $orderIndex = $value -> orderIndex;
            $result = mysql_query("INSERT INTO MenuExtraOptionOption (_menuExtraOptionId, Name, ExtraPrice, orderIndex) VALUES ('$_menuExtraOptionId', '$name', '$extraPrice', '$orderIndex')");
        }
    }
    
    elseif ($action == 'createMenuOrder') {
        $_profileId = (empty($_GET['_profileId']) || $_GET['_profileId'] == 'null' || is_null($_GET['_profileId'])) ? "NULL": "'".mysql_real_escape_string($_GET['_profileId'])."'";
        
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
        
        if ($_profileId == "NULL") {
            $profileType = "Temp";
            $userObject = $dataJsonDecode->userObject;
            $userName = $userObject->name;
            $email = $userObject->email;
            $phone = $userObject->phone;
            $addressLine1 = $userObject->addressLine1;
            $fullAddressLine = $userObject->addressLine2;
            $postcode = $userObject->postcode;
            
            $_profileId = mysql_query("INSERT INTO TempProfile (name, email, phone, dateTimeCreated) VALUES ('$userName','$email','$phone',NOW())");
            $_profileId = mysql_insert_id();
            $_newPlaceId = mysql_query("INSERT INTO Place (addressLine1, addressLine2, postcode) VALUES ('$addressLine1','$fullAddressLine', '$postcode')");
            $_newPlaceId = mysql_insert_id();
            
            $query = mysql_query("INSERT INTO TempProfilePlace (_tempProfileId, _placeId) VALUES ('$_profileId', '$_newPlaceId')");
        }
        else {
            $profileType = "Normal";
        }
        
        $_menuOrderId = mysql_query("INSERT INTO MenuOrder (_orderedByProfileId, _businessId, orderedByProfileType, orderType, dateTimeCreated, readyToAccept) VALUES (".$_profileId.",'$_businessId', '$profileType', 'Collection', NOW(), 1);");
        $_menuOrderId = mysql_insert_id();
        
        
        $menuItems = $dataJsonDecode->menuItems;
        
        foreach ($menuItems as $value) {
            
            foreach ($value->item->itemsAddedToBasket as $item) {
            
                $finalQuantity = $item->quantity;
                $_id = $value->item->_id;
                $optionChoices = $item->optionChoices;
                $_menuOrderItemId = mysql_query("INSERT INTO MenuOrderItem (_menuOrderId, _menuItemId, quantity) VALUES ('$_menuOrderId','$_id','$finalQuantity')");
                $_menuOrderItemId = mysql_insert_id();
                
                if (count($optionChoices) > 0) {
                    foreach($item->optionChoices as $optionChoice) {
                        $_optionId = $optionChoice->_id;
                        $_chosenOptionId = $optionChoice->chosenOption->_id;
                        
                        //if chosenOption is single object and not array
                        $result = mysql_query("INSERT INTO MenuOrderItemChosenOption (_menuOrderItemId, _menuExtraOptionId, _menuExtraOptionChosenOptionId) VALUES ('$_menuOrderItemId', '$_optionId','$_chosenOptionId')");
                    }
                }
            }
        }
    }
    
        //print(json_encode($_usersId));
    if ($action != 'createMenuItemTemplateOption'
        && $action != 'createMenuOrder'
        && $action != 'updateMenuItemTemplateOption'
        && $action != 'createMenuItemTemplateOptionOption'
        && $action != 'createMenuItemSubCategory'
        && $action != 'createMenuItemCategory'
        && $action != 'deleteMenuItemTemplateOptionOption'
        && $action != 'updateMenuItem'
        && $action != 'createMenuItem'
        && $action != 'updateMenuItemCategory'
        && $action != 'updateMenuItemSubCategoryDetailsForBusiness') {
        while($row = mysql_fetch_assoc($result))
        $output[] = $row;
        
        //header('Content-Type: application/json');
        echo json_encode($output);
    }
    
    mysql_close();
?>
