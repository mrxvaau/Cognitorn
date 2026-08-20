<?php
session_start();
session_destroy();

session_start();
$_SESSION['toast'] = 'Signed out';
header('Location: ../view/index.php');
exit();
