<?php
  while ($row = mysql_fetch_assoc($result))
    $output[] = $row;
  print(json_encode($output));
  mysql_close();
?>