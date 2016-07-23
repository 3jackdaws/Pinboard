<?php
/**
 * Created by PhpStorm.
 * User: ian
 * Date: 7/22/16
 * Time: 9:45 PM
 */
$objs = json_decode("[{\"StickyNote\":\"0589c2c3-8bfd-da8e-4643-3428d4ba047a\"},{\"StickyNote\":\"37278564-bdf3-a6eb-8e32-4d85fb9c9067\"},{\"StickyNote\":\"dcaadead-0afd-ed50-b39a-cf2a52366174\"}]");
//var_dump($objs);
foreach ($objs as $ob) {
    foreach ($ob as $k=>$v) {
        echo $k . " ----- " . $v;
    }
}