<?php
$toastMessage = $_SESSION['toast'] ?? '';
unset($_SESSION['toast']);
unset($_SESSION['loginError']);
unset($_SESSION['regError']);
unset($_SESSION['pubError']);
unset($_SESSION['activeModal']);
?>

<!-- TOAST -->
<div class="toast <?php echo !empty($toastMessage) ? 'show' : ''; ?>" id="toast"><?php echo htmlspecialchars($toastMessage); ?></div>

<!-- CLIENT JAVASCRIPT INCLUDES (mvc-v3 Pattern) -->
<script src="js/main.js"></script>
<script src="js/auth.js"></script>
<script src="js/explore.js"></script>
<script src="js/publish.js"></script>
<script src="js/skill_detail.js"></script>
</body>
</html>
