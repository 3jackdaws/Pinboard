<?php

class Web{
    public static function head($title){
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
            <script src="/assets/js/SlipStream.js"></script>
            <script src="/assets/js/sticky-note.js"></script>
            <script src="/assets/js/Pinboard.js"></script>

        </head>

        <?php
        return ob_get_clean();
    }

    public static function nav(){
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
                <a class="navbar-brand noselect" href="/"><span class="glyphicon glyphicon-blackboard" style="font-size: 24px"> </span> PINBOARD</a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-left">
                    <li>
                        <div class="btn-group navbar-btn">
                            <button id="context-button" data-toggle="dropdown" class="btn btn-dark dropdown-toggle">Log In <span class="glyphicon glyphicon-log-in"></span></button>
                            <ul id="context-menu" class="dropdown-menu context-menu" style="padding: 5px 0 5px 0; margin-top: 15px;">
                                <li>
                                    <?=web::login()?>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <div class="btn-group navbar-btn">
                            <a class="btn btn-dark dropdown-toggle" href="https://github.com/3jackdaws/Pinboard/issues">Submit a bug</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <?php
        return ob_get_clean();
    }

    public static function login(){
        ob_start();
        ?>
        <center>
            <form action="/" style="width: 200px;" method="POST">
                <input class="form-control" name="username" placeholder="Username" style="margin-top: 10px;"/>
                <input class="form-control" name="password" placeholder="Password" type="password" style="margin-top: 10px;"/>
                <button class="btn btn-default" style="margin-top: 15px;">Log In</button>
            </form>
        </center>
        <?php
        return ob_get_clean();
    }
}