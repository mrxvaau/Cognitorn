/* ========================
   COGNITORN — APP.JS
   Stack: Vanilla JS + localStorage (maps 1:1 to PHP/SQLite schema)
   Schema notes at bottom for Prisma migration
======================== */

// ========================
// DB (localStorage as SQLite stand-in)
// ========================
const DB = {
  get: (key) => JSON.parse(localStorage.getItem(`sf_${key}`) || 'null'),
  set: (key, val) => localStorage.setItem(`sf_${key}`, JSON.stringify(val)),
  users:    () => DB.get('users')    || [],
  skills:   () => DB.get('skills')   || [],
  stars:    () => DB.get('stars')    || [],
  forks:    () => DB.get('forks')    || [],
  installs: () => DB.get('installs') || [],
  session:  () => DB.get('session'),

  saveUsers:    (d) => DB.set('users', d),
  saveSkills:   (d) => DB.set('skills', d),
  saveStars:    (d) => DB.set('stars', d),
  saveForks:    (d) => DB.set('forks', d),
  saveInstalls: (d) => DB.set('installs', d),
  saveSession:  (d) => DB.set('session', d),
};

// ========================
// SEED DATA
// ========================
function seedIfEmpty() {
  if (DB.skills().length > 0) return;

  const users = [
    { id: 'u1', username: 'demo',      email: 'demo@dev.io',      password: 'demo123',  avatar: 'DM', createdAt: Date.now()-864e5*30 },
    { id: 'u2', username: 'voidpilot',  email: 'vp@dev.io',        password: 'pass',     avatar: 'VP', createdAt: Date.now()-864e5*20 },
    { id: 'u3', username: 'nx_orb',     email: 'orb@dev.io',       password: 'pass',     avatar: 'NX', createdAt: Date.now()-864e5*15 },
    { id: 'u4', username: 'synthwave',  email: 'sw@dev.io',        password: 'pass',     avatar: 'SW', createdAt: Date.now()-864e5*10 },
    { id: 'u5', username: 'koderift',   email: 'kr@dev.io',        password: 'pass',     avatar: 'KR', createdAt: Date.now()-864e5*5  },
  ];
  DB.saveUsers(users);

  const skills = [
    {
      id: 's1', authorId: 'u2', name: 'Deep Research Analyst',
      description: 'Transforms any Claude instance into a thorough research assistant. Follows citations, cross-references sources, produces structured reports with confidence scores.',
      content: `---\nname: deep-research-analyst\ndescription: Full research pipeline for Claude\nversion: 2.1.0\nagent: claude\n---\n\n# Deep Research Analyst\n\n## Role\nYou are a meticulous research analyst. When asked to research any topic, follow this pipeline:\n\n## Pipeline\n1. **Decompose** the question into 3-5 sub-questions\n2. **Search** each sub-question independently\n3. **Cross-reference** conflicting information\n4. **Score confidence** (High/Medium/Low) for each finding\n5. **Synthesize** into a structured report\n\n## Output Format\n\`\`\`\n## Summary\n[2-3 sentence overview]\n\n## Findings\n### [Sub-topic 1] — Confidence: High\n...\n\n## Sources\n- [source 1]\n\n## Caveats\n...\n\`\`\`\n\n## Rules\n- Never fabricate citations\n- Flag information older than 2 years\n- Always include a "What I could not verify" section`,
      type: 'skill', agent: 'claude', tags: ['research','analysis','reports','citations'],
      version: '2.1.0', stars: 247, installs: 1893, forks: 34,
      createdAt: Date.now()-864e5*18, updatedAt: Date.now()-864e5*2,
      forkedFrom: null, collaborators: ['u3'],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*18, note: 'Initial release' },
        { v: '1.5.0', date: Date.now()-864e5*10, note: 'Added confidence scoring' },
        { v: '2.0.0', date: Date.now()-864e5*5,  note: 'Structured output format' },
        { v: '2.1.0', date: Date.now()-864e5*2,  note: 'Fixed citation handling' },
      ]
    },
    {
      id: 's2', authorId: 'u3', name: 'Git Commit Poet',
      description: 'Forces your agent to write meaningful, conventional commit messages. Analyzes diffs, categorizes changes, and writes commits that actually explain the "why".',
      content: `---\nname: git-commit-poet\ndescription: Conventional commit message writer\nversion: 1.2.0\nagent: cursor\n---\n\n# Git Commit Poet\n\n## Purpose\nWrite commit messages that future-you will actually understand.\n\n## Convention\nAlways use: \`type(scope): description\`\n\nTypes: feat | fix | docs | style | refactor | test | chore\n\n## Rules\n- Subject line ≤ 72 chars\n- Use imperative mood ("Add" not "Added")\n- Body explains WHY not WHAT\n- Reference issues when relevant\n\n## Example\n\`\`\`\nfeat(auth): add JWT refresh token rotation\n\nPrevious implementation didn't rotate tokens on refresh,\ncreating a security window. Now rotates both tokens on\nevery refresh call.\n\nCloses #142\n\`\`\``,
      type: 'skill', agent: 'cursor', tags: ['git','commits','dx','workflow'],
      version: '1.2.0', stars: 189, installs: 2341, forks: 22,
      createdAt: Date.now()-864e5*12, updatedAt: Date.now()-864e5*1,
      forkedFrom: null, collaborators: [],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*12, note: 'Initial release' },
        { v: '1.1.0', date: Date.now()-864e5*6, note: 'Added scope detection' },
        { v: '1.2.0', date: Date.now()-864e5*1, note: 'Better breaking change handling' },
      ]
    },
    {
      id: 's3', authorId: 'u4', name: 'Notion MCP Bridge',
      description: 'MCP server that connects your AI agent to Notion workspaces. Read pages, create databases, update properties, and query blocks — all from your agent.',
      content: `---\nname: notion-mcp-bridge\ndescription: Notion API MCP server\nversion: 1.0.0\nagent: any\ntype: mcp\n---\n\n# Notion MCP Bridge\n\n## Setup\n\`\`\`json\n{\n  "mcpServers": {\n    "notion": {\n      "command": "npx",\n      "args": ["@cognitorn/notion-mcp"],\n      "env": {\n        "NOTION_TOKEN": "your_integration_token"\n      }\n    }\n  }\n}\n\`\`\`\n\n## Tools Exposed\n- \`notion_get_page\` — Fetch page content by ID\n- \`notion_create_page\` — Create new page in database\n- \`notion_update_page\` — Update page properties\n- \`notion_query_database\` — Filter and sort database rows\n- \`notion_search\` — Full-text search across workspace\n\n## Permissions Required\n- Read content: ✓\n- Insert content: ✓\n- Update content: ✓`,
      type: 'mcp', agent: 'any', tags: ['notion','productivity','database','api'],
      version: '1.0.0', stars: 312, installs: 987, forks: 18,
      createdAt: Date.now()-864e5*8, updatedAt: Date.now()-864e5*1,
      forkedFrom: null, collaborators: ['u5'],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*8, note: 'Initial release with 5 tools' },
      ]
    },
    {
      id: 's4', authorId: 'u5', name: 'Code Review Sensei',
      description: 'Performs structured code reviews covering security, performance, readability, and architecture. Outputs prioritized findings with fix suggestions.',
      content: `---\nname: code-review-sensei\ndescription: Structured code review pipeline\nversion: 3.0.0\nagent: claude\n---\n\n# Code Review Sensei\n\n## Review Dimensions\nAnalyze code across 5 dimensions in order:\n\n1. **Security** — injections, auth flaws, secrets exposure\n2. **Correctness** — logic errors, edge cases, null handling\n3. **Performance** — O(n) problems, N+1 queries, memory leaks\n4. **Readability** — naming, complexity, comments\n5. **Architecture** — coupling, SRP violations, patterns\n\n## Output Format\n\`\`\`\n🔴 CRITICAL (fix before merge)\n🟡 WARNING (should fix)\n🟢 SUGGESTION (consider improving)\nℹ️ NOTE (FYI)\n\`\`\`\n\n## Rules\n- Lead with the most impactful issue\n- Always provide a fix, not just criticism\n- Acknowledge what's done well`,
      type: 'skill', agent: 'claude', tags: ['code-review','security','quality','dx'],
      version: '3.0.0', stars: 418, installs: 3201, forks: 67,
      createdAt: Date.now()-864e5*25, updatedAt: Date.now()-864e5*3,
      forkedFrom: null, collaborators: ['u2', 'u3'],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*25, note: 'Initial release' },
        { v: '2.0.0', date: Date.now()-864e5*15, note: 'Added 5-dimension framework' },
        { v: '3.0.0', date: Date.now()-864e5*3,  note: 'Prioritized output format' },
      ]
    },
    {
      id: 's5', authorId: 'u1', name: 'SQL Query Optimizer',
      description: 'Analyzes slow SQL queries and rewrites them. Explains why the rewrite is faster, adds indexes suggestions, and formats output for any DB dialect.',
      content: `---\nname: sql-query-optimizer\ndescription: SQL analysis and rewrite skill\nversion: 1.1.0\nagent: any\n---\n\n# SQL Query Optimizer\n\n## When to Use\nUse when given a slow or complex SQL query to improve.\n\n## Process\n1. Parse the query structure\n2. Identify problem patterns (SELECT *, missing indexes, subquery loops)\n3. Rewrite with optimizations\n4. Explain each change\n5. Suggest indexes\n\n## Output\n**Original:**\n\`\`\`sql\n[original query]\n\`\`\`\n**Optimized:**\n\`\`\`sql\n[rewritten query]\n\`\`\`\n**Changes:**\n- [change 1 + why]\n\n**Suggested Indexes:**\n\`\`\`sql\nCREATE INDEX ...\n\`\`\``,
      type: 'skill', agent: 'any', tags: ['sql','database','performance','optimization'],
      version: '1.1.0', stars: 156, installs: 1102, forks: 12,
      createdAt: Date.now()-864e5*6, updatedAt: Date.now()-864e5*1,
      forkedFrom: null, collaborators: [],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*6, note: 'Initial release' },
        { v: '1.1.0', date: Date.now()-864e5*1, note: 'Added index suggestions' },
      ]
    },
    {
      id: 's6', authorId: 'u2', name: 'GitHub MCP Connector',
      description: 'MCP server to manage GitHub from your agent. Create issues, review PRs, fetch repo data, manage branches and more without leaving your editor.',
      content: `---\nname: github-mcp-connector\ntype: mcp\nagent: any\nversion: 2.0.0\n---\n\n# GitHub MCP Connector\n\n## Install\n\`\`\`json\n{\n  "mcpServers": {\n    "github": {\n      "command": "npx",\n      "args": ["@cognitorn/github-mcp"],\n      "env": { "GITHUB_TOKEN": "ghp_..." }\n    }\n  }\n}\n\`\`\`\n\n## Tools\n- \`gh_create_issue\` — Create new issue\n- \`gh_list_prs\` — List open pull requests\n- \`gh_get_file\` — Read file from repo\n- \`gh_commit\` — Commit changes\n- \`gh_search_code\` — Search across repos`,
      type: 'mcp', agent: 'any', tags: ['github','git','devops','automation'],
      version: '2.0.0', stars: 523, installs: 4412, forks: 89,
      createdAt: Date.now()-864e5*20, updatedAt: Date.now()-864e5*4,
      forkedFrom: null, collaborators: ['u3', 'u4', 'u5'],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*20, note: 'Initial release' },
        { v: '2.0.0', date: Date.now()-864e5*4,  note: 'Added commit and search tools' },
      ]
    },
    {
      id: 's7', authorId: 'u3', name: 'Rubber Duck Debugger',
      description: 'Forces structured debugging. Walk through your code like you\'re explaining it to someone — the agent asks exactly the right questions to find your bug.',
      content: `---\nname: rubber-duck-debugger\nversion: 1.0.0\nagent: claude\n---\n\n# Rubber Duck Debugger\n\n## Role\nYou are a patient debugging partner, not a solution machine.\n\n## Process\nWhen given a bug, NEVER jump to solutions. Instead:\n\n1. Ask: "What did you expect to happen?"\n2. Ask: "What actually happened?"\n3. Ask: "Walk me through the code line by line"\n4. Ask: "What have you already tried?"\n5. Ask: "Can you reproduce it consistently?"\n\nOnly after step 5, begin forming hypotheses.\n\n## Philosophy\nThe act of explaining the problem usually reveals the bug. Your job is to make the developer explain clearly, not to find it for them.`,
      type: 'skill', agent: 'claude', tags: ['debugging','learning','teaching','dx'],
      version: '1.0.0', stars: 203, installs: 1567, forks: 28,
      createdAt: Date.now()-864e5*9, updatedAt: Date.now()-864e5*9,
      forkedFrom: null, collaborators: [],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*9, note: 'Initial release' },
      ]
    },
    {
      id: 's8', authorId: 'u4', name: 'API Doc Generator',
      description: 'Takes your route handlers or function signatures and generates complete OpenAPI 3.0 documentation. Covers parameters, responses, examples, and error codes.',
      content: `---\nname: api-doc-generator\nversion: 1.3.0\nagent: cursor\n---\n\n# API Doc Generator\n\n## Purpose\nGenerate complete OpenAPI 3.0 docs from code.\n\n## Input\nGive me any:\n- Express/FastAPI/Laravel route\n- Function signature\n- Existing partial doc\n\n## Output\nComplete OpenAPI 3.0 YAML including:\n- paths with all HTTP methods\n- request body schemas\n- response schemas for 200, 400, 401, 404, 500\n- parameter descriptions\n- example values\n\n## Rules\n- Infer types from code, never guess\n- Always document error responses\n- Add realistic example values`,
      type: 'skill', agent: 'cursor', tags: ['api','documentation','openapi','backend'],
      version: '1.3.0', stars: 134, installs: 876, forks: 9,
      createdAt: Date.now()-864e5*11, updatedAt: Date.now()-864e5*2,
      forkedFrom: null, collaborators: [],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*11, note: 'Initial release' },
        { v: '1.3.0', date: Date.now()-864e5*2,  note: 'Added error response docs' },
      ]
    },
    {
      id: 's9', authorId: 'u1', name: 'AutoCoder Prime Agent',
      description: 'Autonomous AI coding agent capable of analyzing repositories, planning architectural changes, writing clean code, and executing tests automatically.',
      content: `---\nname: autocoder-prime-agent\ntype: agent\nagent: any\nversion: 1.0.0\n---\n\n# AutoCoder Prime Agent\n\n## Overview\nAutoCoder Prime is a full-stack autonomous AI agent that handles development tasks end-to-end.\n\n## Features\n- Repository architecture analysis\n- Automated bug fixing & feature implementation\n- Self-correction via test execution loops\n\n## How to Run\n\`\`\`bash\nnpx autocoder-prime@latest start --repo ./my-project\n\`\`\`\n\n## Free & Open Source\nThis AI Agent is listed 100% free for the community. Contributions and forks welcome!`,
      type: 'agent', agent: 'any', tags: ['agent','coding','autonomous','automation'],
      version: '1.0.0', stars: 482, installs: 2310, forks: 74,
      createdAt: Date.now()-864e5*5, updatedAt: Date.now()-864e5*1,
      forkedFrom: null, collaborators: ['u2', 'u3'],
      versions: [
        { v: '1.0.0', date: Date.now()-864e5*5, note: 'Initial release of AutoCoder Prime Agent' },
      ]
    },
  ];
  DB.saveSkills(skills);
}

// ========================
// STATE
// ========================
let state = {
  currentPage: 'explore',
  currentUser: DB.session(),
  filterType: 'all',
  filterAgent: 'all',
  filterSort: 'newest',
  searchQuery: '',
  viewingSkill: null,
};

// ========================
// UTILS
// ========================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function uid() {
  return 'u' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function formatNum(n) {
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return String(n);
}

function showToast(msg, type='') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.className = 'toast', 2800);
}

function getAgentEmoji(agent) {
  return { claude: '🤖', cursor: '⚡', gpt: '🧠', gemini: '✦', any: '◈' }[agent] || '◈';
}

function getTypeBadgeClass(type) {
  return `badge badge-type-${type}`;
}

function getAuthorById(id) {
  return DB.users().find(u => u.id === id);
}

// ========================
// COUNTERS (animated)
// ========================
function animateCount(el, target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = formatNum(current);
    if (current >= target) clearInterval(timer);
  }, 25);
}

function updateStats() {
  const skills = DB.skills();
  const users = DB.users();
  const totalInstalls = skills.reduce((a, s) => a + s.installs, 0);
  animateCount($('#statSkills'), skills.length);
  animateCount($('#statDevs'), users.length);
  animateCount($('#statInstalls'), totalInstalls);
}

// ========================
// RENDER SKILLS
// ========================
function renderSkills() {
  const grid = $('#skillsGrid');
  const empty = $('#emptyState');
  let skills = [...DB.skills()];

  // Apply search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    skills = skills.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    );
  }

  // Apply filters for My Skills page
  if (state.currentPage === 'myskills' && state.currentUser) {
    skills = skills.filter(s =>
      s.authorId === state.currentUser.id ||
      (s.collaborators && s.collaborators.includes(state.currentUser.id))
    );
  }

  // Filter by type
  if (state.filterType !== 'all') {
    skills = skills.filter(s => s.type === state.filterType);
  }

  // Filter by agent
  if (state.filterAgent !== 'all') {
    skills = skills.filter(s => s.agent === state.filterAgent || s.agent === 'any');
  }

  // Filter for MCP page
  if (state.currentPage === 'mcp') {
    skills = skills.filter(s => s.type === 'mcp');
  }

  // Filter for AI Agents page
  if (state.currentPage === 'agents') {
    skills = skills.filter(s => s.type === 'agent');
  }

  // Filter trending
  if (state.currentPage === 'trending') {
    skills.sort((a, b) => (b.stars + b.installs) - (a.stars + a.installs));
    skills = skills.slice(0, 12);
  } else {
    // Sort
    if (state.filterSort === 'newest')   skills.sort((a,b) => b.createdAt - a.createdAt);
    if (state.filterSort === 'stars')    skills.sort((a,b) => b.stars - a.stars);
    if (state.filterSort === 'installs') skills.sort((a,b) => b.installs - a.installs);
    if (state.filterSort === 'forks')    skills.sort((a,b) => b.forks - a.forks);
  }

  grid.innerHTML = '';

  if (skills.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  skills.forEach(skill => {
    const author = getAuthorById(skill.authorId);
    const stars = DB.stars();
    const isStarred = state.currentUser && stars.some(s => s.userId === state.currentUser.id && s.skillId === skill.id);

    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon ${skill.agent}">${getAgentEmoji(skill.agent)}</div>
        <div class="card-badges">
          <span class="${getTypeBadgeClass(skill.type)}">${skill.type}</span>
          <span class="badge badge-agent">${skill.agent}</span>
        </div>
      </div>
      <div>
        <div class="card-name">${skill.name}</div>
        <div class="card-desc">${skill.description}</div>
      </div>
      <div class="card-tags">
        ${skill.tags.slice(0,4).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card-footer">
        <div class="card-author">
          <div class="author-avatar">${author ? author.avatar : '??'}</div>
          <span class="author-name">${author ? author.username : 'unknown'}</span>
        </div>
        <div class="card-stats">
          <span class="card-stat"><span>${isStarred ? '★' : '☆'}</span> ${formatNum(skill.stars)}</span>
          <span class="card-stat"><span>⬇</span> ${formatNum(skill.installs)}</span>
          <span class="card-stat"><span>⑂</span> ${skill.forks}</span>
        </div>
      </div>
      <span class="card-version">v${skill.version}</span>
    `;
    card.addEventListener('click', () => openSkillModal(skill));
    grid.appendChild(card);
  });
}

// ========================
// PAGES
// ========================
function navigateTo(page) {
  state.currentPage = page;

  $$('.nav-link').forEach(l => l.classList.remove('active'));
  $(`.nav-link[data-page="${page}"]`)?.classList.add('active');

  const hero = $('#heroSection');
  const filters = $('#filtersBar');
  const pageHeader = $('#pageHeader');
  const pageTitle = $('#pageTitle');
  const pageSub = $('#pageSub');

  // Reset filters display
  filters.style.display = 'flex';
  hero.style.display = 'none';
  pageHeader.style.display = 'block';

  if (page === 'explore') {
    hero.style.display = 'flex';
    pageHeader.style.display = 'none';
    updateStats();
  } else if (page === 'trending') {
    pageTitle.textContent = '🔥 Trending';
    pageSub.textContent = 'Most starred and installed skills this week';
  } else if (page === 'mcp') {
    pageTitle.textContent = '⚙️ MCP Servers';
    pageSub.textContent = 'Connect your AI agent to any service with Model Context Protocol servers';
  } else if (page === 'agents') {
    pageTitle.textContent = '🤖 AI Agents';
    pageSub.textContent = 'Discover and list custom autonomous & specialized AI agents for free';
  } else if (page === 'myskills') {
    if (!state.currentUser) {
      showToast('Sign in to see your skills', 'error');
      openModal('authModal');
      return;
    }
    pageTitle.textContent = '◈ My Skills';
    pageSub.textContent = `Skills you've published or collaborate on`;
  }

  renderSkills();
}

// ========================
// AUTH
// ========================
function openModal(id) {
  $(`#${id}`).classList.add('open');
}
function closeModal(id) {
  $(`#${id}`).classList.remove('open');
}

function login(username, password) {
  const users = DB.users();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return false;
  state.currentUser = user;
  DB.saveSession(user);
  updateNavAuth();
  return true;
}

function register(username, email, password) {
  const users = DB.users();
  if (users.find(u => u.username === username)) return { error: 'Username taken' };
  if (users.find(u => u.email === email)) return { error: 'Email already registered' };
  const initials = username.slice(0,2).toUpperCase();
  const user = { id: uid(), username, email, password, avatar: initials, createdAt: Date.now() };
  users.push(user);
  DB.saveUsers(users);
  state.currentUser = user;
  DB.saveSession(user);
  updateNavAuth();
  return { user };
}

function logout() {
  state.currentUser = null;
  DB.saveSession(null);
  updateNavAuth();
  navigateTo('explore');
  showToast('Signed out');
}

function updateNavAuth() {
  const guest = $('#navGuest');
  const userEl = $('#navUser');
  if (state.currentUser) {
    guest.style.display = 'none';
    userEl.style.display = 'flex';
    $('#navAvatar').textContent = state.currentUser.avatar;
    $('#navAvatar').title = state.currentUser.username;
  } else {
    guest.style.display = 'flex';
    userEl.style.display = 'none';
  }
}

// ========================
// PUBLISH
// ========================
function publishSkill() {
  if (!state.currentUser) {
    showToast('Sign in to publish', 'error');
    openModal('authModal');
    return;
  }

  const name    = $('#pubName').value.trim();
  const desc    = $('#pubDesc').value.trim();
  const agent   = $('#pubAgent').value;
  const type    = $('#pubType').value;
  const tags    = $('#pubTags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const version = $('#pubVersion').value.trim() || '1.0.0';
  const content = $('#pubContent').value.trim();

  if (!name)    return $('#pubError').textContent = 'Name is required';
  if (!desc)    return $('#pubError').textContent = 'Description is required';
  if (!content) return $('#pubError').textContent = 'Skill content is required';

  $('#pubError').textContent = '';

  const skill = {
    id: uid(), authorId: state.currentUser.id,
    name, description: desc, content,
    type, agent, tags, version,
    stars: 0, installs: 0, forks: 0,
    createdAt: Date.now(), updatedAt: Date.now(),
    forkedFrom: null, collaborators: [],
    versions: [{ v: version, date: Date.now(), note: 'Initial release' }],
  };

  const skills = DB.skills();
  skills.unshift(skill);
  DB.saveSkills(skills);

  closeModal('publishModal');
  clearPublishForm();
  renderSkills();
  updateStats();
  showToast(`"${name}" published successfully! 🎉`, 'success');
}

function clearPublishForm() {
  ['pubName','pubDesc','pubTags','pubContent'].forEach(id => $(`#${id}`).value = '');
  $('#pubVersion').value = '1.0.0';
  $('#pubError').textContent = '';
}

// ========================
// SKILL MODAL
// ========================
function openSkillModal(skill) {
  state.viewingSkill = skill;
  const author = getAuthorById(skill.authorId);
  const stars = DB.stars();
  const isStarred = state.currentUser && stars.some(s => s.userId === state.currentUser.id && s.skillId === skill.id);
  const isMine = state.currentUser && skill.authorId === state.currentUser.id;

  $('#skillModalBadges').innerHTML = `
    <span class="${getTypeBadgeClass(skill.type)}">${skill.type}</span>
    <span class="badge badge-agent">${skill.agent}</span>
    <span class="card-version">v${skill.version}</span>
  `;
  $('#skillModalName').textContent = skill.name;
  $('#skillModalDesc').textContent = skill.description;
  $('#skillModalAuthor').innerHTML = `
    <div class="author-avatar">${author ? author.avatar : '??'}</div>
    <span class="author-name" style="color:var(--text-2)">${author ? author.username : 'unknown'}</span>
    <span style="color:var(--text-3);font-size:12px">· published ${timeAgo(skill.createdAt)}</span>
    <span style="color:var(--text-3);font-size:12px;margin-left:12px">☆ ${formatNum(skill.stars)}</span>
    <span style="color:var(--text-3);font-size:12px;margin-left:8px">⬇ ${formatNum(skill.installs)}</span>
  `;

  $('#skillStarBtn').textContent = isStarred ? '★ Unstar' : '☆ Star';
  $('#skillInstallBtn').style.display = isMine ? 'none' : '';

  renderSkillTab('readme');

  // Tab switching
  $$('.stab').forEach(btn => {
    btn.onclick = () => {
      $$('.stab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkillTab(btn.dataset.stab);
    };
  });

  openModal('skillModal');
}

function renderSkillTab(tab) {
  const skill = state.viewingSkill;
  const content = $('#skillModalContent');

  if (tab === 'readme') {
    // Simple markdown-ish render
    let html = skill.content
      .replace(/```[\s\S]*?```/g, m => `<pre>${m.replace(/```\w*\n?/g,'').replace(/```/g,'').trim()}</pre>`)
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);background:var(--surface);padding:1px 6px;border-radius:4px;font-size:12px">$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n\n/g, '<br>');
    content.innerHTML = html;
  }

  if (tab === 'content') {
    content.innerHTML = `<pre>${skill.content.replace(/</g,'&lt;')}</pre>`;
  }

  if (tab === 'versions') {
    const versions = skill.versions || [];
    content.innerHTML = `<div class="versions-list">${
      [...versions].reverse().map((v, i) => `
        <div class="version-item">
          <span class="version-num">v${v.v}</span>
          <span style="color:var(--text-2)">${v.note}</span>
          ${i===0 ? '<span class="version-latest">latest</span>' : ''}
          <span class="version-date">${timeAgo(v.date)}</span>
        </div>
      `).join('')
    }</div>`;
  }

  if (tab === 'contributors') {
    const skill = state.viewingSkill;
    const author = getAuthorById(skill.authorId);
    const collabs = (skill.collaborators || []).map(id => getAuthorById(id)).filter(Boolean);

    content.innerHTML = `<div class="contributors-list">
      <div class="contributor-item">
        <div class="author-avatar" style="width:36px;height:36px;font-size:13px">${author?.avatar || '??'}</div>
        <div>
          <div style="font-weight:600;font-size:14px">${author?.username || 'unknown'}</div>
          <div style="font-size:12px;color:var(--text-3)">Member since ${timeAgo(author?.createdAt || 0)}</div>
        </div>
        <span class="contributor-role">Author</span>
      </div>
      ${collabs.map(c => `
        <div class="contributor-item">
          <div class="author-avatar" style="width:36px;height:36px;font-size:13px">${c.avatar}</div>
          <div>
            <div style="font-weight:600;font-size:14px">${c.username}</div>
            <div style="font-size:12px;color:var(--text-3)">Member since ${timeAgo(c.createdAt)}</div>
          </div>
          <span class="contributor-role">Collaborator</span>
        </div>
      `).join('')}
    </div>`;
  }
}

// ========================
// STAR / FORK / INSTALL
// ========================
function toggleStar(skill) {
  if (!state.currentUser) { showToast('Sign in to star', 'error'); return; }
  const stars = DB.stars();
  const existing = stars.findIndex(s => s.userId === state.currentUser.id && s.skillId === skill.id);
  const skills = DB.skills();
  const skillIdx = skills.findIndex(s => s.id === skill.id);

  if (existing >= 0) {
    stars.splice(existing, 1);
    skills[skillIdx].stars = Math.max(0, skills[skillIdx].stars - 1);
    showToast('Unstarred');
    $('#skillStarBtn').textContent = '☆ Star';
  } else {
    stars.push({ userId: state.currentUser.id, skillId: skill.id, createdAt: Date.now() });
    skills[skillIdx].stars++;
    showToast('⭐ Starred!', 'success');
    $('#skillStarBtn').textContent = '★ Unstar';
  }
  DB.saveStars(stars);
  DB.saveSkills(skills);
  state.viewingSkill = skills[skillIdx];
  renderSkills();
}

function forkSkill(skill) {
  if (!state.currentUser) { showToast('Sign in to fork', 'error'); return; }
  if (skill.authorId === state.currentUser.id) { showToast('Cannot fork your own skill', 'error'); return; }

  const skills = DB.skills();
  const forks = DB.forks();
  const skillIdx = skills.findIndex(s => s.id === skill.id);
  const alreadyForked = forks.some(f => f.userId === state.currentUser.id && f.skillId === skill.id);
  if (alreadyForked) { showToast('Already forked', 'error'); return; }

  const forked = {
    ...skill,
    id: uid(),
    authorId: state.currentUser.id,
    name: `${skill.name} (fork)`,
    forkedFrom: skill.id,
    stars: 0, installs: 0, forks: 0,
    collaborators: [],
    createdAt: Date.now(), updatedAt: Date.now(),
    versions: [{ v: skill.version, date: Date.now(), note: `Forked from ${getAuthorById(skill.authorId)?.username}` }],
  };
  skills[skillIdx].forks++;
  forks.push({ userId: state.currentUser.id, skillId: skill.id });
  skills.push(forked);
  DB.saveSkills(skills);
  DB.saveForks(forks);
  closeModal('skillModal');
  renderSkills();
  showToast(`⑂ Forked "${skill.name}" to your profile!`, 'success');
}

function installSkill(skill) {
  if (!state.currentUser) { showToast('Sign in to install', 'error'); return; }
  const installs = DB.installs();
  const skills = DB.skills();
  const skillIdx = skills.findIndex(s => s.id === skill.id);
  const existing = installs.findIndex(i => i.userId === state.currentUser.id && i.skillId === skill.id);

  if (existing >= 0) {
    showToast('Already installed — check My Skills', 'error');
    return;
  }
  installs.push({ userId: state.currentUser.id, skillId: skill.id, installedAt: Date.now() });
  skills[skillIdx].installs++;
  DB.saveInstalls(installs);
  DB.saveSkills(skills);
  state.viewingSkill = skills[skillIdx];
  renderSkills();

  // Copy to clipboard
  navigator.clipboard?.writeText(skill.content).catch(()=>{});
  showToast(`⬇ "${skill.name}" installed! Content copied to clipboard.`, 'success');
}

// ========================
// SEARCH
// ========================
let searchTimer;
$('#globalSearch').addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.searchQuery = e.target.value.trim();
    renderSkills();
  }, 250);
});

// ========================
// EVENT LISTENERS
// ========================
// Nav
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});
$('#navLoginBtn').addEventListener('click', () => {
  $('#authModal').querySelector('[data-tab="login"]').click();
  openModal('authModal');
});
$('#navRegisterBtn').addEventListener('click', () => {
  $('#authModal').querySelector('[data-tab="register"]').click();
  openModal('authModal');
});
$('#navPublishBtn').addEventListener('click', () => openModal('publishModal'));
$('#navAvatar').addEventListener('click', logout);

// Hero
$('#heroExploreBtn').addEventListener('click', () => {
  document.querySelector('.filters-bar').scrollIntoView({ behavior: 'smooth' });
});
$('#heroPublishBtn').addEventListener('click', () => {
  if (!state.currentUser) openModal('authModal');
  else openModal('publishModal');
});

// Auth modal
$('#modalClose').addEventListener('click', () => closeModal('authModal'));
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    $(`#${tab}Tab`).classList.add('active');
  });
});

$('#loginBtn').addEventListener('click', () => {
  const u = $('#loginUsername').value.trim();
  const p = $('#loginPassword').value;
  if (!u || !p) return $('#loginError').textContent = 'Fill in all fields';
  if (login(u, p)) {
    closeModal('authModal');
    showToast(`Welcome back, ${state.currentUser.username}! 👋`, 'success');
    renderSkills();
  } else {
    $('#loginError').textContent = 'Invalid username or password';
  }
});

$('#registerBtn').addEventListener('click', () => {
  const u = $('#regUsername').value.trim();
  const e = $('#regEmail').value.trim();
  const p = $('#regPassword').value;
  if (!u || !e || !p) return $('#regError').textContent = 'Fill in all fields';
  if (p.length < 6) return $('#regError').textContent = 'Password must be at least 6 characters';
  const res = register(u, e, p);
  if (res.error) return $('#regError').textContent = res.error;
  closeModal('authModal');
  showToast(`Account created! Welcome, ${u} 🚀`, 'success');
  renderSkills();
});

// Publish modal
$('#publishClose').addEventListener('click', () => closeModal('publishModal'));
$('#publishCancel').addEventListener('click', () => closeModal('publishModal'));
$('#publishSubmit').addEventListener('click', publishSkill);
$('#emptyPublishBtn').addEventListener('click', () => {
  if (!state.currentUser) openModal('authModal');
  else openModal('publishModal');
});

// Skill modal
$('#skillModalClose').addEventListener('click', () => closeModal('skillModal'));
$('#skillStarBtn').addEventListener('click', () => toggleStar(state.viewingSkill));
$('#skillForkBtn').addEventListener('click', () => forkSkill(state.viewingSkill));
$('#skillInstallBtn').addEventListener('click', () => installSkill(state.viewingSkill));

// Filters
$$('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filterType = btn.dataset.filter;
    renderSkills();
  });
});
$$('.agent-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.agent-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filterAgent = btn.dataset.agent;
    renderSkills();
  });
});
$('#sortSelect').addEventListener('change', (e) => {
  state.filterSort = e.target.value;
  renderSkills();
});

// Close modals on overlay click
$$('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    $('#globalSearch').focus();
  }
  if (e.key === 'Escape') {
    $$('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ========================
// INIT
// ========================
seedIfEmpty();
updateNavAuth();
navigateTo('explore');

/*
==================================
PRISMA SCHEMA (for PHP dev notes)
==================================

// schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "sqlite"     // ← change to "postgresql" for production
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  password    String
  avatar      String
  createdAt   DateTime @default(now())
  skills      Skill[]  @relation("AuthorSkills")
  stars       Star[]
  installs    Install[]
  forked      Fork[]
  collabs     Skill[]  @relation("Collaborators")
}

model Skill {
  id            String   @id @default(cuid())
  name          String
  description   String
  content       String
  type          String   // skill | mcp | prompt | tool
  agent         String   // claude | cursor | gpt | gemini | any
  tags          String   // JSON array stored as string (SQLite)
  version       String
  stars         Int      @default(0)
  installs      Int      @default(0)
  forks         Int      @default(0)
  authorId      String
  author        User     @relation("AuthorSkills", fields: [authorId], references: [id])
  collaborators User[]   @relation("Collaborators")
  forkedFromId  String?
  forkedFrom    Skill?   @relation("Forks", fields: [forkedFromId], references: [id])
  forkChildren  Skill[]  @relation("Forks")
  versions      Version[]
  starredBy     Star[]
  installedBy   Install[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Version {
  id        String   @id @default(cuid())
  skillId   String
  skill     Skill    @relation(fields: [skillId], references: [id])
  version   String
  note      String
  createdAt DateTime @default(now())
}

model Star {
  userId    String
  skillId   String
  user      User   @relation(fields: [userId], references: [id])
  skill     Skill  @relation(fields: [skillId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, skillId])
}

model Install {
  userId      String
  skillId     String
  user        User   @relation(fields: [userId], references: [id])
  skill       Skill  @relation(fields: [skillId], references: [id])
  installedAt DateTime @default(now())
  @@id([userId, skillId])
}

model Fork {
  userId    String
  skillId   String
  user      User   @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  @@id([userId, skillId])
}
*/
