<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';
$pb = new Pinboard();

?>
<?=web::head("Test")?>
<body>
    <?=web::nav()?>


</body>