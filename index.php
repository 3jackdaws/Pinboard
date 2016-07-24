<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';


?>
<?=web::head("Test")?>
<body>
    <?=web::nav()?>

    <div class="container" style="text-align: center">
        <div class="jumbotron">
            <h1>Welcome to Pinboard</h1>
            <h3>Pinboard allows you to create a spot to organize a group.  Try creating a board!</h3>
        </div>
        <center>
        <form class="form-inline" action="/boards/" method="get" style="">
            <div class="form-group-lg">



            <div class = "input-group">
                <input class="form-control input-lg" name="new" placeholder="Board Name" style="margin: 0"/>
                <span class = "input-group-btn" style="margin-top: 10px;">
                    <button class = "btn btn-default btn-lg" type = "submit">
                        Go!
                    </button>
                </span>

            </div>
        </form>

        </center>
    </div>
</body>
<script>
    
</script>