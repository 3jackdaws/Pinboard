<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/12/16
 * Time: 2:28 PM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Database.php';
require_once 'Pinboard.php';


/**
 * board_access.php
 * Use this to fetch, and update boards
 * required parameters are:
 *          action
 *          board
 * Optional:
 *          data
 */

$action     = $_POST['action'];
$utoken     = $_POST['utoken'];
$guid       = $_POST['board'];
$response   = [];

switch ($action){
    case "get":
    {
        $module = Pinboard::get($guid);
        echo json_encode($module);
        break;
    }
    case "update":
    {
        $data = $_POST['data'];
        $response['saved'] = Pinboard::update($guid, $data);
        echo json_encode($response);
        break;
    }
    case "delete":
    {
        $response['deleted'] = Pinboard::delete($guid);
        echo json_encode($response);
        break;
    }
    default:
    {

    }

}
