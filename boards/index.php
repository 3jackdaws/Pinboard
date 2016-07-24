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

if($board_uid == null){
    header("Location: /");
}

if($board_uid == "new"){
    $board_uid = $value;
    $data = [];
    $data['name'] = "New Board";
    $data['owner'] = "None";
    $data['participants'] = "All";
    $data['data'] = null;
    Pinboard::update($board_uid, $data);
    header("Location: /boards/?".$board_uid);
}
$board = Pinboard::get($board_uid);

if($board['data'] == null){
    $title = "Pinboard";
    echo web::head($title);
    echo "<body>";
    echo web::nav();
    ?>
    <div class="circle-lg">
        ???
    </div>
    <center>
        <h2>
            Sorry, that board couldn't be found
        </h2>
    </center>
    <?php
}else{
    $title = $board_uid;
    echo web::head($title);
    echo "<body>";
    echo web::nav();
    Pinboard::writeBase($board_uid);
}
?>
</body>