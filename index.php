<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';
$pb = new Pinboard();

?>
<?=web::head("Test")?>
<body>
    <?=web::nav()?>
    <div class="sticky-note-container module">
        <textarea class="sticky-note" readonly="readonly"></textarea>
        <a onclick="spawnCard(this)" href="javascript:;" style="color: white;position: absolute; bottom: 10px; right: 15px; text-shadow: 0 0 5px black"><span class="glyphicon glyphicon-plus-sign"></span></a>
    </div>
</body>