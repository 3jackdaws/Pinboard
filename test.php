<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 5:35 PM
 */

?>
<head>
    <script src="assets/js/Comet.js"></script>
</head>
<body>


</body>
<script>
    var comet = [];
    window.addEventListener("load", function () {
        for (var i = 0; i<2; i++){
            var c = new Comet("/comet.php");
            c.onserverpush = function(data){
                document.body.innerHTML += data;
            };
            c.open("welcome=" + i);
            comet.push(c);
        }
    });
</script>
