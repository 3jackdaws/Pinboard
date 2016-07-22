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
$ss = new SlipStream();
$ss->register("StickyNote", function ($mid) use ($time){
    $sql = "SELECT * FROM modules WHERE guid=:guid AND updated > :timestamp;";
    $statement = Database::connect()->prepare($sql);
    $statement->bindParam(":guid", $mid);
    $statement->bindParam(":timestamp", $time);
    if(!$statement->execute()) $time = "Error";
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    if(count($result) > 0){
        $mod = $result[0];
        $mod['data'] = json_decode($mod['data']);
        return $mod;
    }
    else return null;
});

$ss->accept();



