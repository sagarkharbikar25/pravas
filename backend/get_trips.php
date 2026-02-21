<?php

include "db.php";

$user_id = $_GET['user_id'];

$query = "SELECT * FROM trips WHERE user_id='$user_id'";

$result = pg_query($conn, $query);

$trips = array();

while ($row = pg_fetch_assoc($result)) {
    $trips[] = $row;
}

echo json_encode($trips);

?>