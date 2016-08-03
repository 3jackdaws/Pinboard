<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
?>


<?=web::head("login")?>
<body>
    <?=web::nav()?>
    <div class="container" style="text-align: center">
        <h1 style="font-family: Serif">LOGIN</h1>
    </div>
</body>
