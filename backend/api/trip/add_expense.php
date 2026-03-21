<?php

include "../utils/db.php";

header("Content-Type: application/json");

// 🔥 Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $trip_id = $data['trip_id'];
    $title = $data['title'];
    $amount = $data['amount'];
    $paid_by = $data['paid_by'];

    $query = "INSERT INTO expenses (trip_id, title, amount, paid_by)
              VALUES ('$trip_id', '$title', '$amount', '$paid_by')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo json_encode([
            "status" => "success",
            "message" => "Expense added"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Expense failed"
        ]);
    }
}
?>