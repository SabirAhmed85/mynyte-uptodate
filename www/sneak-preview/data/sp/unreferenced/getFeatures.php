<?php
  $sql    =   "SELECT * FROM business WHERE
                isFeature == 1 AND 
                isActive == 1
              UNION
              SELECT * FROM event WHERE
                isFeature == 1 AND
                isActive == 1";
                
  $result = mysql_query($sql);
?>