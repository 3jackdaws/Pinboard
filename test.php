<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 5:35 PM
 */

?>
<head>
    <script src="assets/js/SlipStreamOld.js"></script>
</head>
<body>


</body>
<script>
    var mod_ss = new SlipStream("/echo.php");
    window.addEventListener("load", function () {
        mod_ss.register({hi:'cats'}, function(data){document.body.innerHTML+="Cats: " + data});
        mod_ss.register({one:'dogs'}, function(data){document.body.innerHTML+="Dogs: " + data});
        mod_ss.register({hello:'fish'}, function(data){document.body.innerHTML+="fish: " + data});
        mod_ss.open();
    });
</script>
