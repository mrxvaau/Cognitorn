<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../model/Skill.php';

$userId = $_SESSION['user_id'] ?? null;
$currentPage = $_SESSION['current_page'] ?? ($_GET['page'] ?? 'explore');
$filterType = $_SESSION['filter_type'] ?? ($_GET['type'] ?? 'all');
$filterAgent = $_SESSION['filter_agent'] ?? ($_GET['agent'] ?? 'all');
$filterSort = $_SESSION['filter_sort'] ?? ($_GET['sort'] ?? 'newest');
$searchQuery = $_SESSION['search_query'] ?? ($_GET['q'] ?? '');

if (!isset($skills)) {
    $skills = getFilteredSkills($filterType, $filterAgent, $filterSort, $searchQuery, $currentPage, $userId);
}
if (!isset($stats)) {
    $stats = getPlatformStats();
}

include __DIR__ . '/Header.php';
?>

<!-- MAIN -->
<main class="main">

  <!-- HERO (shown on explore page) -->
  <section class="hero" id="heroSection" style="<?php echo $currentPage === 'explore' ? 'display:flex' : 'display:none'; ?>">
    <div class="hero-eyebrow">
      <span class="pulse-dot"></span>
      <span>Open Platform for AI Agent Skills</span>
    </div>
    <h1 class="hero-title">
      The <span class="gradient-text">GitHub</span><br/>
      for AI Agent Skills
    </h1>
    <p class="hero-sub">Publish, fork, and install skills for Claude, Cursor, GPT and more. Collaborate with developers worldwide to build better AI agents.</p>
    <div class="hero-actions">
      <button class="btn-primary lg" id="heroExploreBtn">Explore Skills →</button>
      <button class="btn-ghost lg" id="heroPublishBtn">Publish Your First Skill</button>
    </div>
    <div class="hero-stats">
      <div class="stat"><span class="stat-num" id="statSkills"><?php echo number_format($stats['skills_count']); ?></span><span class="stat-label">Skills</span></div>
      <div class="stat-div"></div>
      <div class="stat"><span class="stat-num" id="statDevs"><?php echo number_format($stats['users_count']); ?></span><span class="stat-label">Developers</span></div>
      <div class="stat-div"></div>
      <div class="stat"><span class="stat-num" id="statInstalls"><?php echo number_format($stats['total_installs']); ?></span><span class="stat-label">Installs</span></div>
    </div>
  </section>

  <!-- FILTERS -->
  <div class="filters-bar" id="filtersBar">
    <div class="filter-tabs" id="filterTabs">
      <a href="../controller/ExploreController.php?type=all" class="filter-tab <?php echo $filterType === 'all' ? 'active' : ''; ?>">All</a>
      <a href="../controller/ExploreController.php?type=skill" class="filter-tab <?php echo $filterType === 'skill' ? 'active' : ''; ?>">Skills</a>
      <a href="../controller/ExploreController.php?type=mcp" class="filter-tab <?php echo $filterType === 'mcp' ? 'active' : ''; ?>">MCP Servers</a>
      <a href="../controller/ExploreController.php?type=agent" class="filter-tab <?php echo $filterType === 'agent' ? 'active' : ''; ?>">AI Agents</a>
      <a href="../controller/ExploreController.php?type=prompt" class="filter-tab <?php echo $filterType === 'prompt' ? 'active' : ''; ?>">Prompts</a>
      <a href="../controller/ExploreController.php?type=tool" class="filter-tab <?php echo $filterType === 'tool' ? 'active' : ''; ?>">Tools</a>
    </div>
    <div class="filter-agents" id="filterAgents">
      <a href="../controller/ExploreController.php?agent=all" class="agent-pill <?php echo $filterAgent === 'all' ? 'active' : ''; ?>">All Agents</a>
      <a href="../controller/ExploreController.php?agent=claude" class="agent-pill <?php echo $filterAgent === 'claude' ? 'active' : ''; ?>">Claude</a>
      <a href="../controller/ExploreController.php?agent=cursor" class="agent-pill <?php echo $filterAgent === 'cursor' ? 'active' : ''; ?>">Cursor</a>
      <a href="../controller/ExploreController.php?agent=gpt" class="agent-pill <?php echo $filterAgent === 'gpt' ? 'active' : ''; ?>">GPT</a>
      <a href="../controller/ExploreController.php?agent=any" class="agent-pill <?php echo $filterAgent === 'any' ? 'active' : ''; ?>">Universal</a>
    </div>
    <div class="filter-sort">
      <select id="sortSelect" onchange="location = '../controller/ExploreController.php?sort=' + this.value;">
        <option value="newest" <?php echo $filterSort === 'newest' ? 'selected' : ''; ?>>Newest</option>
        <option value="stars" <?php echo $filterSort === 'stars' ? 'selected' : ''; ?>>Most Starred</option>
        <option value="installs" <?php echo $filterSort === 'installs' ? 'selected' : ''; ?>>Most Installed</option>
        <option value="forks" <?php echo $filterSort === 'forks' ? 'selected' : ''; ?>>Most Forked</option>
      </select>
    </div>
  </div>

  <!-- PAGE TITLE -->
  <?php if ($currentPage !== 'explore'): ?>
  <div class="page-header" id="pageHeader">
    <h2 class="page-title" id="pageTitle">
      <?php
      if ($currentPage === 'trending') echo '🔥 Trending';
      elseif ($currentPage === 'mcp') echo '⚙️ MCP Servers';
      elseif ($currentPage === 'agents') echo '🤖 AI Agents';
      elseif ($currentPage === 'myskills') echo '◈ My Skills';
      ?>
    </h2>
    <p class="page-sub" id="pageSub">
      <?php
      if ($currentPage === 'trending') echo 'Most starred and installed skills this week';
      elseif ($currentPage === 'mcp') echo 'Connect your AI agent to any service with Model Context Protocol servers';
      elseif ($currentPage === 'agents') echo 'Discover and list custom autonomous & specialized AI agents for free';
      elseif ($currentPage === 'myskills') echo "Skills you've published or collaborate on";
      ?>
    </p>
  </div>
  <?php endif; ?>

  <!-- SKILLS GRID -->
  <div class="skills-grid" id="skillsGrid">
    <?php foreach ($skills as $skill): ?>
      <?php
      $agentEmoji = ['claude' => '🤖', 'cursor' => '⚡', 'gpt' => '🧠', 'gemini' => '✦', 'any' => '◈'][$skill['agent']] ?? '◈';
      $skillJson = htmlspecialchars(json_encode($skill), ENT_QUOTES, 'UTF-8');
      ?>
      <div class="skill-card" data-skill="<?php echo $skillJson; ?>">
        <div class="card-top">
          <div class="card-icon <?php echo htmlspecialchars($skill['agent']); ?>"><?php echo $agentEmoji; ?></div>
          <div class="card-badges">
            <span class="badge badge-type-<?php echo htmlspecialchars($skill['type']); ?>"><?php echo htmlspecialchars($skill['type']); ?></span>
            <span class="badge badge-agent"><?php echo htmlspecialchars($skill['agent']); ?></span>
          </div>
        </div>
        <div>
          <div class="card-name"><?php echo htmlspecialchars($skill['name']); ?></div>
          <div class="card-desc"><?php echo htmlspecialchars($skill['description']); ?></div>
        </div>
        <div class="card-tags">
          <?php foreach (array_slice($skill['tags'], 0, 4) as $tag): ?>
            <span class="tag"><?php echo htmlspecialchars($tag); ?></span>
          <?php endforeach; ?>
        </div>
        <div class="card-footer">
          <div class="card-author">
            <div class="author-avatar"><?php echo htmlspecialchars($skill['author']['avatar'] ?? '??'); ?></div>
            <span class="author-name"><?php echo htmlspecialchars($skill['author']['username'] ?? 'unknown'); ?></span>
          </div>
          <div class="card-stats">
            <span class="card-stat"><span><?php echo !empty($skill['is_starred']) ? '★' : '☆'; ?></span> <?php echo number_format($skill['stars']); ?></span>
            <span class="card-stat"><span>⬇</span> <?php echo number_format($skill['installs']); ?></span>
            <span class="card-stat"><span>⑂</span> <?php echo number_format($skill['forks']); ?></span>
          </div>
        </div>
        <span class="card-version">v<?php echo htmlspecialchars($skill['version']); ?></span>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- EMPTY STATE -->
  <div class="empty-state" id="emptyState" style="<?php echo count($skills) === 0 ? 'display:flex' : 'display:none'; ?>">
    <div class="empty-icon">◈</div>
    <h3>No skills found</h3>
    <p>Be the first to publish a skill here.</p>
    <button class="btn-primary" id="emptyPublishBtn">+ Publish Skill</button>
  </div>

</main>

<?php include __DIR__ . '/Footer.php'; ?>
