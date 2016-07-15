<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 5:35 PM
 */

?>
<head>
    <script src="assets/js/SlipStream.js"></script>
</head>
<body>


</body>
<script>
    var mod_ss = [];
    window.addEventListener("load", function () {
        for (var i = 0; i<1; i++){
            var c = new SlipStream("/ss.php");
            c.onserverpush = function(data){
                document.body.innerHTML += data;
            };
            c.open("module=left" );
        }
    });
</script>
