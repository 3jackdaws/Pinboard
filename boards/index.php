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

function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Pinboard.php';
require 'Components.php';
foreach($_GET as $key=>$value)break;
$board_uid = $key;

if($board_uid == null){
    header("Location: /");
}

if($board_uid == "new"){
    $board_uid = clean($value);
    $b = Pinboard::get($board_uid);
    if($b['data'] == null){
        $data = [];
        $data['name'] = "New Board";
        $data['owner'] = "None";
        $data['participants'] = "All";
        $data['data'] = null;
        Pinboard::update($board_uid, $data);
        header("Location: /boards/?".$board_uid);
    }else{
        $special = "alert('That board already exists!');";
    }

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
echo "<script>". $special ."</script>"
?>
</body>