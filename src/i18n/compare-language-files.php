<?php

function getJson($lang)
{
    $data = file_get_contents("./$lang/index.json");
    $json = json_decode($data, true);
    return $json;
}

function array_diff_key_recursive ($a1, $a2) {
    $r = array();
    foreach($a1 as $k => $v) {
        if (is_array($v)) {
            $r[$k] = array_diff_key_recursive($a1[$k], $a2[$k]);
        } else {
            $r = @array_diff_key($a1, $a2);
        }
        if (is_array($r[$k]) && count($r[$k]) == 0) {
            unset($r[$k]);
        }
    }
    return $r;
}

$enus_json = getJson('en_US');

$dirs = array_filter(glob('*'), 'is_dir');

foreach ($dirs as $dir) {
    if ($dir != 'en_US') {
        print " ==== COMPARING $dir ====:\n";
        $json = getJson($dir);
        $difference = array_diff_key_recursive($enus_json, $json);
        if (count($difference) == 0) {
            print $dir . " has the correct number of keys!\n";
        } else {
            print $dir . " is missing the following keys:\n";
            print_r($difference);
        }
    }
}
