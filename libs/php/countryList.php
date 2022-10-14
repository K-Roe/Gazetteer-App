<?php
use LDAP\Result;

// initiate error reporting
ini_set("display_error", "on");
error_reporting(E_ALL);




function countryList() {
$result = file_get_contents("../data/countryBorders.geo.json");
$data = json_decode($result)->features;
$countries = [];


foreach ($data as $country) {
    $name = $country->properties->name;
    $code = $country->properties->iso_a2;
    array_push($countries, [$name, $code]);
}
    return json_encode($countries) ;
}



header("Content-Type: application/json");


echo countryList()






?>