<?php

include "db.php";

$user_id = $_GET['user_id'];
$location = $_GET['location'];

$apiKey = "YOUR_API_KEY";

$url = "https://api.openweathermap.org/data/2.5/weather?q=$location&appid=$apiKey&units=metric";

$response = file_get_contents($url);
$data = json_decode($response, true);

$weather = $data['weather'][0]['main'];

$risk = "Low";

if ($weather == "Rain" || $weather == "Storm") {
    $risk = "High";
}

$query = "SELECT SUM(amount)
          FROM expenses
          WHERE trip_id IN (
              SELECT id FROM trips WHERE user_id='$user_id'
          )";

$result = pg_query($conn, $query);

$total_expense = pg_fetch_result($result, 0, 0);

if ($total_expense > 10000) {
    $risk = "Medium";
}

$output = array(
    "weather" => $weather,
    "total_expense" => $total_expense,
    "risk_level" => $risk
);

echo json_encode($output);

?>