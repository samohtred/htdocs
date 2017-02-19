<html>
<head>
<title>Process Uploaded File</title>
</head>
<body>
<?php
  error_reporting(E_ALL);
  ini_set('display_errors', TRUE);
  $postdata = file_get_contents("php://input");

  $empfaenger="allusion@gmx.de";
  $betreff="X-Tree-M Error Report";
  $text=$postdata;
  $from="x-tree-m";
  mail($empfaenger, $betreff, $text, $from);

?>
</body>
</html>