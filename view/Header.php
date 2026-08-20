<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$isLoggedIn = !empty($_SESSION['isLoggedIn']);
$user = $_SESSION['user'] ?? null;
$username = $_SESSION['username'] ?? '';
$avatar = $_SESSION['avatar'] ?? '??';
$activeModal = $_SESSION['activeModal'] ?? '';
$activeTab = $_SESSION['activeTab'] ?? 'login';

$loginError = $_SESSION['loginError'] ?? '';
$loginUsername = $_SESSION['loginUsername'] ?? '';
$regError = $_SESSION['regError'] ?? '';
$pubError = $_SESSION['pubError'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cognitorn — GitHub for AI Agent Skills</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../style.css" />
</head>
<body>

<!-- GRID BACKGROUND -->
<div class="bg-grid"></div>
<div class="bg-orb orb-1"></div>
<div class="bg-orb orb-2"></div>

<!-- AUTH MODAL -->
<div class="modal-overlay <?php echo $activeModal === 'auth' ? 'open' : ''; ?>" id="authModal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-logo">
        <span class="logo-icon">⬡</span>
        <span>Cognitorn</span>
      </div>
      <button class="modal-close" id="modalClose">✕</button>
    </div>
    <div class="modal-tabs">
      <button class="tab-btn <?php echo $activeTab === 'login' ? 'active' : ''; ?>" data-tab="login">Sign In</button>
      <button class="tab-btn <?php echo $activeTab === 'register' ? 'active' : ''; ?>" data-tab="register">Create Account</button>
    </div>

    <div class="tab-content <?php echo $activeTab === 'login' ? 'active' : ''; ?>" id="loginTab">
      <form method="post" action="../controller/LoginController.php" onsubmit="return validateAuth(this)">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" id="loginUsername" placeholder="your_handle" value="<?php echo htmlspecialchars($loginUsername); ?>" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" id="loginPassword" placeholder="••••••••" />
        </div>
        <div class="form-error" id="loginError"><?php echo htmlspecialchars($loginError); ?></div>
        <button type="submit" class="btn-primary full" id="loginBtn">Sign In →</button>
      </form>
      <p class="demo-hint">Demo: <code>demo</code> / <code>demo123</code></p>
    </div>

    <div class="tab-content <?php echo $activeTab === 'register' ? 'active' : ''; ?>" id="registerTab">
      <form method="post" action="../controller/RegisterController.php" onsubmit="return validateRegister(this)">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" id="regUsername" placeholder="your_handle" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" id="regEmail" placeholder="you@dev.io" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" id="regPassword" placeholder="••••••••" />
        </div>
        <div class="form-error" id="regError"><?php echo htmlspecialchars($regError); ?></div>
        <button type="submit" class="btn-primary full" id="registerBtn">Create Account →</button>
      </form>
    </div>
  </div>
</div>

<!-- PUBLISH MODAL -->
<div class="modal-overlay <?php echo $activeModal === 'publish' ? 'open' : ''; ?>" id="publishModal">
  <div class="modal modal-lg">
    <div class="modal-header">
      <h3>Publish New Skill</h3>
      <button class="modal-close" id="publishClose">✕</button>
    </div>
    <form method="post" action="../controller/PublishController.php" onsubmit="return validatePublish(this)">
      <div class="publish-grid">
        <div class="publish-left">
          <div class="form-group">
            <label>Skill Name</label>
            <input type="text" name="name" id="pubName" placeholder="e.g. Deep Research Analyst" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" id="pubDesc" placeholder="What does this skill do? When should an agent use it?" rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Compatible Agent</label>
              <select name="agent" id="pubAgent">
                <option value="claude">Claude</option>
                <option value="cursor">Cursor</option>
                <option value="gpt">GPT / OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="any">Any Agent</option>
              </select>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select name="type" id="pubType">
                <option value="skill">Skill (.md)</option>
                <option value="mcp">MCP Server</option>
                <option value="agent">AI Agent</option>
                <option value="prompt">System Prompt</option>
                <option value="tool">Tool Config</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Tags <span class="hint">(comma separated)</span></label>
            <input type="text" name="tags" id="pubTags" placeholder="research, web, analysis, coding" />
          </div>
          <div class="form-group">
            <label>Version</label>
            <input type="text" name="version" id="pubVersion" placeholder="1.0.0" value="1.0.0" />
          </div>
        </div>
        <div class="publish-right">
          <div class="form-group flex-1">
            <label>Skill Content <span class="hint">(.md or config)</span></label>
            <textarea name="content" id="pubContent" class="code-editor" placeholder="---
name: your-skill-name
description: What this skill does
---

# Your Skill

## Instructions
Write your skill instructions here..." rows="16"></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="form-error" id="pubError"><?php echo htmlspecialchars($pubError); ?></div>
        <button type="button" class="btn-ghost" id="publishCancel">Cancel</button>
        <button type="submit" class="btn-primary" id="publishSubmit">Publish Skill →</button>
      </div>
    </form>
  </div>
</div>

<!-- SKILL DETAIL MODAL -->
<div class="modal-overlay" id="skillModal">
  <div class="modal modal-xl">
    <div class="skill-modal-header" id="skillModalHeader">
      <div class="skill-modal-meta">
        <div class="skill-modal-badges" id="skillModalBadges"></div>
        <h2 id="skillModalName"></h2>
        <p id="skillModalDesc"></p>
        <div class="skill-modal-author" id="skillModalAuthor"></div>
      </div>
      <div class="skill-modal-actions">
        <form method="post" action="../controller/StarController.php" style="display:inline">
          <input type="hidden" name="skill_id" id="starSkillId" value="" />
          <button type="submit" class="btn-ghost" id="skillStarBtn">☆ Star</button>
        </form>
        <form method="post" action="../controller/ForkController.php" style="display:inline">
          <input type="hidden" name="skill_id" id="forkSkillId" value="" />
          <button type="submit" class="btn-ghost" id="skillForkBtn">⑂ Fork</button>
        </form>
        <form method="post" action="../controller/InstallController.php" style="display:inline">
          <input type="hidden" name="skill_id" id="installSkillId" value="" />
          <button type="submit" class="btn-primary" id="skillInstallBtn">⬇ Install</button>
        </form>
        <button class="modal-close" id="skillModalClose">✕</button>
      </div>
    </div>
    <div class="skill-modal-body">
      <div class="skill-modal-tabs">
        <button class="stab active" data-stab="readme">README</button>
        <button class="stab" data-stab="content">Raw Content</button>
        <button class="stab" data-stab="versions">Versions</button>
        <button class="stab" data-stab="contributors">Contributors</button>
      </div>
      <div class="skill-modal-content" id="skillModalContent"></div>
    </div>
  </div>
</div>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="nav-left">
    <div class="nav-logo">
      <span class="logo-icon">⬡</span>
      <span class="logo-text">Cognitorn</span>
    </div>
    <div class="nav-links">
      <a class="nav-link <?php echo ($_SESSION['current_page'] ?? 'explore') === 'explore' ? 'active' : ''; ?>" href="../controller/ExploreController.php?page=explore">Explore</a>
      <a class="nav-link <?php echo ($_SESSION['current_page'] ?? '') === 'trending' ? 'active' : ''; ?>" href="../controller/ExploreController.php?page=trending">Trending</a>
      <a class="nav-link <?php echo ($_SESSION['current_page'] ?? '') === 'mcp' ? 'active' : ''; ?>" href="../controller/ExploreController.php?page=mcp">MCP Servers</a>
      <a class="nav-link <?php echo ($_SESSION['current_page'] ?? '') === 'agents' ? 'active' : ''; ?>" href="../controller/ExploreController.php?page=agents">AI Agents</a>
      <a class="nav-link <?php echo ($_SESSION['current_page'] ?? '') === 'myskills' ? 'active' : ''; ?>" href="../controller/ExploreController.php?page=myskills">My Skills</a>
    </div>
  </div>
  <div class="nav-right">
    <form method="get" action="../controller/ExploreController.php" class="nav-search" id="searchForm">
      <span class="search-icon">⌕</span>
      <input type="text" name="q" placeholder="Search skills, agents, tags..." id="globalSearch" value="<?php echo htmlspecialchars($_SESSION['search_query'] ?? ''); ?>" />
      <span class="search-kbd">⌘K</span>
    </form>
    <div id="navGuest" style="<?php echo $isLoggedIn ? 'display:none' : 'display:flex'; ?>">
      <button class="btn-ghost" id="navLoginBtn">Sign In</button>
      <button class="btn-primary" id="navRegisterBtn">Get Started</button>
    </div>
    <div id="navUser" style="<?php echo $isLoggedIn ? 'display:flex' : 'display:none'; ?>">
      <button class="btn-ghost" id="navPublishBtn">+ Publish</button>
      <a href="../controller/LogoutController.php" style="text-decoration:none">
        <div class="nav-avatar" id="navAvatar" title="<?php echo htmlspecialchars($username); ?> (Click to Logout)"><?php echo htmlspecialchars($avatar); ?></div>
      </a>
    </div>
  </div>
</nav>
