<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 7:54 PM
 */
class SlipStream
{

    public $onconnect;
    public $sendcondition;

    public function __construct()
    {
    }

    public function accept(){
        
    }

    public function send($data){
        echo json_encode($data);
    }

}