<html>
<head>
<title>Process Uploaded File</title>
</head>
<body>
<?php
  $postdata = file_get_contents("php://input");
  $fp = fopen("uc_browsing_tree_db.xml", "w");
  fwrite($fp, $postdata);
  fclose($fp);
?>
</body>
</html>