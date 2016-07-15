<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 5:41 PM
 */

if(isset($_POST['welcome'])){
    sleep(rand(0,2));
    echo $_POST['welcome'] . " ";
}