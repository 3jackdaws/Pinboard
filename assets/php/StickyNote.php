<?php

/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/14/16
 * Time: 9:24 AM
 */
set_include_path(realpath($_SERVER['DOCUMENT_ROOT']) . '/assets/php');
require 'Module.php';

class StickyNote extends Module
{
    public function processIncomingModule($module_data)
    {
        $data = $this->normalizeZIndex($module_data);
        return $data;
    }

    private function normalizeZIndex($data){
        $largest = 0;
        uasort($data, function($a,$b){
            return $a['z'] <=> $b['z'];
        });
        $z = 1;
        foreach ($data as &$note){
            $note['z'] = $z++;
        }
        ob_start();
        var_dump($data);
        $str = ob_get_clean();
        $fp = fopen("/Users/ian/var_dump.txt", "w");
        fwrite($fp, $str);
        fclose($fp);
        return $data;
    }

}