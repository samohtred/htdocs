<html>
<head>
<title>Process Uploaded File</title>
</head>
<body>
<?php
  $postdata = file_get_contents("php://input");
  $fp = fopen("db_init.xml", "w");
  fwrite($fp, $postdata);
  fclose($fp);
?>
</body>
</html>