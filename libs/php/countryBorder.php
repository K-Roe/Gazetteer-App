<?php
use LDAP\Result;

// initiate error reporting
ini_set("display_error", "on");
error_reporting(E_ALL);


function borderList() {
$result = file_get_contents("../data/countryBorders.geo.json");
$data = json_decode($result)->features;



foreach ($data as $country) {
    $name = $country->properties->name;
    $code = $country->properties->iso_a2;
    $coord = $country->geometry;
    if($country->properties->iso_a2 ==  $_REQUEST["iso_a2"]){ 
        $border = [$name, $code, $coord];
    }

}


return json_encode($border);
}






header("Content-Type: application/json");



echo(borderList());











?>