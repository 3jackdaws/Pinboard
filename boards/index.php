<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/22/16
 * Time: 9:18 AM
 */

/**
 * Load board from get variable
 */

set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Pinboard.php';
require 'Components.php';
foreach($_GET as $key=>$value)break;
$board_uid = $key;

if($board_uid == "new" or $board_uid == ""){
    $board_uid = Database::getGUID();
    $data = [];
    $data['name'] = "New Board";
    $data['owner'] = "None";
    $data['participants'] = "All";
    $data['data'] = null;
    Pinboard::update($board_uid, $data);
}
$board = Pinboard::get($board_uid);



?>
<?=web::head($board['name'])?>
<body>
<?=web::nav()?>
<?=Pinboard::writeBase($board_uid)?>
</body>