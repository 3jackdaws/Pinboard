<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/12/16
 * Time: 2:28 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Database.php';
require 'StickyNote.php';


/**
 * mod_access.php
 * Use this to fetch, and update modules
 * required parameters are:
 *          action
 *          class
 *          module
 * Optional:
 *          data
 */

$action         = $_POST['action'];
$module_guid    = $_POST['module'];
$class          = $_POST['class'];
$response       = [];

$mod_instance = null;

switch(strtolower($class)){
    case 'stickynote':
    {
        $mod_instance = new StickyNote();
        break;
    }
    default:
    {
        die("No module with that type is available");
    }
}




switch ($action){
    case "get":
    {
        $module = $mod_instance->get($module_guid);
        $response['payload'] = $mod_instance->processOutgoingModule($module);
        if($response['payload'] == null) {
            $response['error'] = true;
            $response['message'][] = "No module with that MID was found";
        }
        break;
    }
    case "update":
    {
        $data = $_POST['data'];
        $mod_instance->update($module_guid, $class, $data);
        $response['message'] = "Saved";
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
    $data_json = json_encode($data);
    $statement = Database::connect()->prepare($sql);
    $statement->bindParam(':guid', $guid);
    $statement->bindParam(':type', $type);
    $statement->bindParam(':belongs_to', $belongs_to);
    $statement->bindParam(':data', $data_json);
    $statement->execute();
}