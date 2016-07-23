<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';


?>
<?=web::head("Test")?>
<body>
    <?=web::nav()?>

    <div class="container" style="text-align: center">
        <button class="btn btn-primary" href="/boards/index.php?board=new">Create New Pinboard</button>
    </div>
</body>
<script>
    
</script>