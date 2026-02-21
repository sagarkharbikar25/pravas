<?php

include "db.php";

$user_id = $_GET['user_id'];

$conflicts = array();

$query1 = "SELECT COUNT(*) FROM trips WHERE user_id='$user_id'";
$result1 = pg_query($conn, $query1);

$total_trips = pg_fetch_result($result1, 0, 0);

if ($total_trips > 5) {
    $conflicts[] = "Too many trips planned";
}

$query2 = "SELECT SUM(amount)
           FROM expenses
           WHERE trip_id IN (
               SELECT id FROM trips WHERE user_id='$user_id'
           )";

$result2 = pg_query($conn, $query2);

$total_expense = pg_fetch_result($result2, 0, 0);

if ($total_expense > 20000) {
    $conflicts[] = "Budget exceeded safe limit";
}

echo json_encode($conflicts);

?>