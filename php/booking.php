<?php
//setup the request, you can also use CURLOPT_URL
$ch = curl_init('http://localhost:4001/booking/insBooking?uid=' . $_GET['uid'] . '&bookingdate=' . $_GET['bookingdate'] . '&bookingstarttime=' . $_GET['bookingstarttime'] . 
'&bookingfinishtime=' . $_GET['bookingfinishtime'] . '&bookingattendance=' . $_GET['bookingattendance']);

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
