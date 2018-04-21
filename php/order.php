<?php
//setup the request, you can also use CURLOPT_URL
$ch = curl_init('http://localhost:4001/cart/addCart?menuID=' . $_GET['menuID'] . '&uid=' . $_GET['uid']);

// Returns the data/output as a string instead of raw data
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//Set your auth headers
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
    ));

// get stringified data/output. See CURLOPT_RETURNTRANSFER
$data = curl_exec($ch);

echo $data;

// get info about the request
$info = curl_getinfo($ch);

// close curl resource to free up system resources 
curl_close($ch)

?>
