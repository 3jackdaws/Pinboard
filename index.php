<?php
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Components.php';
require 'Pinboard.php';


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

    </div>
</body>
<script>
    
</script>