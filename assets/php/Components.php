<?php

class Web{
    public function head($title){
        ob_start();
        ?>

        <head>
            <meta charset="utf-8">
            <meta name="theme-color" content="#FFFFFF">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="The activities and projects of Ian Murphy">
            <meta name="version" content="0.1.0">
            <link rel="icon" href="">
            <title>
                <?=$title?>
            </title>
            <link href="/assets/css/bootstrap.min.css" rel="stylesheet">
            <link href="/assets/css/pinboard.css" rel="stylesheet">
            <script src="/assets/js/jquery.min.js"></script>
            <script src="/assets/js/bootstrap.min.js"></script>
            <script src="/assets/js/pinboard.js"></script>

        </head>

        <?php
        return ob_get_clean();
    }

    public function nav(){
        ob_start();
        ?>
        <nav class="navbar navbar-inverse navbar-fixed-top" >
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><span class="glyphicon glyphicon-blackboard" style="font-size: 24px"> </span> PINBOARD</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-left">
                    <li>
                        <div class="btn-group navbar-btn">
                            <button data-toggle="dropdown" class="btn btn-dark dropdown-toggle">Boards</button>
                            <ul class="dropdown-menu" style="margin-top: 13px;">
                                <li><a clahref="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                </ul>
            </div>
        </nav>
        <?php
        return ob_get_clean();
    }
}