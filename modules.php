<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/12/16
 * Time: 2:28 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Database.php';

$action = $_POST['action'];
$module_guid = $_POST['module'];
$response = [];
switch ($action){
    case "get":
    {
        $response['payload'] = getModule($module_guid);
        break;
    }
    case "update":
    {
        $data = $_POST['data'];
        updateModule($module_guid, $data);
        break;
    }
    case "put":
    {
        $data = $_POST['data'];
        break;
    }
    case "delete":
    {
        break;
    }
    default:
    {

    }
}

echo json_encode($response);

function getModule($guid){
    $sql = "SELECT * FROM modules WHERE guid=:guid;";
    $statement = Database::connect()->prepare($sql);
    $statement->bindParam(':guid', $guid);
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC)[0];
}

function updateModule($guid, $data){
    $sql = "INSERT INTO modules (guid, type, belongs_to, data) VALUES(:guid, :type, :belongs_to, :data) ON DUPLICATE KEY UPDATE    
                type=:type, belongs_to=:belongs_to, data=:data;";
    $statement = Database::connect()->prepare($sql);
    $statement->bindParam(':guid', $guid);
    $statement->bindParam(':type', $type);
    $statement->bindParam(':belongs_to', $belongs_to);
    $statement->bindParam(':data', json_encode($data));
    $statement->execute();
}