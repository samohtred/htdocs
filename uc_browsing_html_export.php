<html>
<head>
<title>Process Uploaded File</title>
</head>
<body>
<?php
  $postdata = file_get_contents("php://input");
  $fp = fopen("uc_browsing_tree_db_html.xml", "w");
  fwrite($fp, $postdata);
  fclose($fp);
  copy("uc_browsing_tree_db_html.xml","uc_browsing_tree_db.html");
?>
</body>
</html>