<?php
use LDAP\Result;

// initiate error reporting
ini_set("display_error", "on");
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// pull in the API with the parameters needed 
$url="https://api.openweathermap.org/data/2.5/weather?q=" . $_REQUEST["q"] . "&appid=e469f25915efc3b095e7819247243814&units=metric";



// initiate the cURL object
$ch= curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);


// execute the cURL and store the results in $result
$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output["status"]["code"] = "200";
$output["status"]["name"] = "ok";
$output["status"]["discription"] = "success";
$output["status"]["returnedIn"] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output["data"] = $decode; 

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);







?>