<?php

$apiKey = "d2b9af8880ab93059c8a6550a8b962d7";
$location = $_GET['location'];

$url = "https://api.openweathermap.org/data/2.5/weather?q=$location&appid=$apiKey&units=metric";

$response = file_get_contents($url);

echo $response;

?>