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
require_once 'Module.php';


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
        $mod_instance = new Module();
    }
}




switch ($action){
    case "get":
    {
        $module = $mod_instance->get($module_guid);
        echo json_encode($mod_instance->processOutgoingModule($module));
        break;
    }
    case "update":
    {
        $data = $_POST['data'];

        $mod_instance->processIncomingModule($data);
        $response['saved'] = $mod_instance->update($module_guid, $class, $data);

        echo json_encode($response);
        break;
    }
    case "put":
    {
        $data = $_POST['data'];
        break;
    }
    case "delete":
    {
        $mod_instance->delete($module_guid);
        break;
    }
    default:
    {

    }

}
