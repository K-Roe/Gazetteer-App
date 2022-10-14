<?php
use LDAP\Result;

// initiate error reporting
ini_set("display_error", "on");
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// pull in the API with the parameters needed 
$url="https://api.opencagedata.com/geocode/v1/json?&q=" . $_REQUEST["q"] . "&key=7203cfe2e8db4f6cbe7c5d423164ffb8&limit=1";



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