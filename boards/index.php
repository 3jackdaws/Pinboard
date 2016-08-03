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

function errorPage($message, $circle_symbol){
    $title = "Pinboard";
    echo web::head($title);
    echo "<body>";
    echo web::nav();
    ?>
    <div class="circle-lg">
        <?=$circle_symbol?>
    </div>
    <center>
        <h2>
            <?=$message?>
        </h2>
    </center>
    <?php
    exit();
}

function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require_once 'Pinboard.php';
require 'Components.php';
require_once 'Account.php';

if(!isset($_COOKIE['token'])){
    errorPage("You must be logged in to access this page.  Login <a href='/login'>here</a>.", "!!!");
}
$username=$_GET['user'];
$board_uid = $_GET['board'];

$user = new Account($_COOKIE['token']);
if($board_uid == "new"){
    $board_uid = Pinboard::createBoard($_GET['name']);
    $user->takeOwnershipOf($board_uid);
    header("Location: /boards/?user=" . $user->getUName() . "&board=" . $board_uid);
}else{
    $board = new Pinboard($board_uid);
    if(!$board->contains("participants", $user->getUName())){
        errorPage("You don't have access to this area.", ":(");
    }
}




$board = Pinboard::get($board_uid);

if($board['data'] == null){

}else{
    $title = $board['name'];
    echo web::head($title);
    echo "<body>";
    echo web::nav();
    Pinboard::writeBase($board_uid);
}
echo "<script>". $special ."</script>"
?>
</body>