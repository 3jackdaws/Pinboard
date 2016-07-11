<?php

/**
 * Created by PhpStorm.
 * User: Ian Murphy
 * Date: 7/10/2016
 * Time: 10:05 PM
 */
class Database
{
    private static $_connection;
    private static function _instantiate(){
        self::$_connection = new PDO('mysql:host=localhost;dbname=pinboard', 'pinboard', '');
        date_default_timezone_set('America/Los_Angeles');
    }
    public static function connect(){
        if(self::$_connection instanceof PDO){
            
        }else{
            self::_instantiate();
        }
        return self::$_connection;
    }
}