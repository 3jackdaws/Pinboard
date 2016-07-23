<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 7:54 PM
 */
class SlipStream
{
    private $_registered;
    private $_contacted;
    private $_response;
    public function __construct()
    {
    }

    public function register($type, $function){
        $this->_registered[$type] = $function;
    }

    public function accept(){
        $objs = json_decode($_POST['sp']);
        error_log($_POST['sp']);
        foreach ($objs as $ob) {
            foreach ($ob as $type=>$uid) {
                $this->_contacted[$uid] = $type;
            }
        }
        do{
            foreach($this->_contacted as $mid=>$type){
                $this->_response[$mid] = $this->_registered[$type]($mid);
                if($this->_response[$mid]) error_log($mid);
            }
            usleep(100000);
        }while(!$this->shouldPush());

        echo json_encode($this->_response);
    }

    private function shouldPush(){
        foreach ($this->_response as $reg=>$val){
            if($val != null) return true;
        }
    }
}