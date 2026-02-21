<?php

include "db.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $trip_id = $_POST['trip_id'];
    $amount = $_POST['amount'];
    $category = $_POST['category'];

    $query = "INSERT INTO expenses (trip_id, amount, category)
              VALUES ('$trip_id', '$amount', '$category')";

    $result = pg_query($conn, $query);

    if ($result) {
        echo "Expense added";
    } else {
        echo "Expense failed";
    }

}

?>