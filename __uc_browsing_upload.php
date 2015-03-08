<?php
  ini_set('display_errors', 'On');
  error_reporting(E_ALL);
  $test = "Das ist ein Test";
  $db_name = "";
  $content = "";
  var_dump($test);
//  if (isset($_POST['db_name'])) {
      $db_name = $_POST['db_name'];             // get data
//  }
//  else
//  {
//    echo '<p>$db_name not set !</p>';  
//  }
  var_dump($db_name);  
//  if (isset($_POST['content'])) {
      $content = $_POST['content'];
//  }
//  else
//  {
//    echo '<p>$content not set !</p>';  
//  }
  var_dump($content);  
  $fp = fopen($db_name, "w"); //  
  fwrite($fp, $content + $content);
  fclose($fp);
?>
