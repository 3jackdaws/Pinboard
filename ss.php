<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 5:41 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'SlipStream.php';
require_once 'Database.php';
date_default_timezone_set('America/Los_Angeles');
$time = date('Y-m-d G:i:s');
$sql = "SELECT * FROM modules WHERE guid=:guid AND updated > :timestamp;";
$statement = Database::connect()->prepare($sql);
$statement->bindParam(":guid", $_POST['module']);
$statement->bindParam(":timestamp", $time);
do{
    usleep(100000);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
}while(count($result) == 0 );
//var_dump($_POST);
echo json_encode($result);



