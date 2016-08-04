<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';
require_once 'Account.php';

if(isset($_COOKIE['token'])){
    $useracc = new Account($_COOKIE['token']);
//    error_log("COOKIE");
}
if(isset($_POST['username'])){
    $user = $_POST['username'];
    $password = $_POST['password'];
    $useracc = new Account(null);
    $token = $useracc->getTokenFromCredentials($user, $password);
    error_log($token);
    setcookie("token", $token, strtotime("+1 month"), '/');
    header("Location: /");
}

?>
<?=web::head("Pinboard")?>
<body>
    <?=web::nav()?>

    <div class="container" style="text-align: center; margin-top: 50px;">
        <div class="module" style="height: auto;background-color: white ;padding: 50px;">
            <h1>Welcome to</h1>
            <div class="mod-label" style=" position: relative; background-color: #1E60FF; font-size: 200px; color: rgba(30,96,255,0.4);">PINBOARD</div>
            <h3>Pinboard allows you to create a spot to organize a group.  Try creating a board!</h3>
            <center>
                <form class="form-inline" action="/boards/" method="get" style="margin-top: 50px;">
                    <div class="form-group-lg">
                        <div class = "input-group">
                            <input class="form-control input-lg" name="name" placeholder="Board Name" style="margin: 0"/>
                            <input type="hidden" value="<?=$useracc->getToken()?>" name="utoken">
                            <input type="hidden" value="new" name="board">
                            <span class = "input-group-btn" style="margin-top: 10px;">
                                <button class = "btn btn-default btn-lg" type = "submit">
                                    Go!
                                </button>
                            </span>
                        </div>
                </form>

            </center>
        </div>

    </div>

</body>
<?=$useracc->writeJSVars()?>
<script>
    function createAnchor(text, onclick){
        var a = document.createElement('a');
        a.innerHTML = text;
        a.onclick = onclick;
        return a;
    }



    function createHR(){
        return document.createElement('hr');
    }

    function createLabel(text){
        var li = document.createElement('li');
        li.innerHTML = text;
        return li;
    }

    window.addEventListener("load",function () {
        var numboards = user.boards.length;
        var boards = [];
        var mblabel = createLabel("Your Boards");
        boards.push(mblabel);
        for(var i = 0; i<numboards; i++){
            var board = user.boards[i];
            boards.push(createAnchor(user.bnames[i], function () {
                window.location = "/boards/?user=" + user.uname + "&board=" + board;
            }));
//            console.log(user.bnames[i]);
        }


        changeLoginContext(user.uname, boards);
    });
    </script>