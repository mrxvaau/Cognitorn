# Cognitorn — Build Phases
## Instructions for Antigravity (Gemini 2.5 Pro)

---

## How to Use This File

At the start of every session say:
> "Read IDEA.md, TECH.md, and PHASES.md. We are on **Phase X**. Execute it fully."

Each phase is self-contained. Complete one fully before starting the next.
At the end of each phase there is a **✅ DONE WHEN** checklist — verify all items before moving on.

The draft frontend files (`index.html`, `style.css`, `app.js`) are the visual reference.
Preserve all UI and design from the draft. Only replace the data layer (localStorage) with real PHP/SQLite.

---

## Phase Overview

| # | Name | What Gets Built |
|---|------|-----------------|
| 0 | Foundation | Folder structure, DB schema, seed data, PHP helpers |
| 1 | Auth Backend | PHP auth API — login, register, logout, session |
| 2 | Auth Frontend | Connect login/register UI to PHP API |
| 3 | Skills Backend | PHP skills API — list, get, stats, create, delete |
| 4 | Skills Frontend | Replace localStorage skills with real API fetch |
| 5 | Social Actions | Stars, forks, installs — PHP + frontend |
| 6 | Contributions | Submit, review, accept, reject contributions |
| 7 | Collaborators | Invite/remove collaborators, update_version |
| 8 | Marketplace | Paid listings, image upload, video preview, Buy flow |
| 9 | My Skills Dashboard | 4-tab dashboard: Published, Collaborating, Installed, Purchased |
| 10 | Notifications | Bell icon, notification list, unread count, mark read |
| 11 | User Profiles | Public profile page at /@username |
| 12 | Search & Filter | Tag click filter, infinite scroll, pagination |
| 13 | Polish | Error states, empty states, form validation, responsive, titles |
| 14 | Prisma Schema | PostgreSQL-ready Prisma schema + migration notes |

---

---

# PHASE 0 — Foundation

**What this phase builds:**
Project scaffold, DB schema, seed data, PHP connection singleton, shared helpers, middleware.

---

## Prompt:

```
You are building Cognitorn — a GitHub-style marketplace for AI agent skills.
Read IDEA.md for the full product vision and TECH.md for the complete technical spec.

Tech stack: HTML + CSS + Vanilla JS frontend, PHP 8.1+ backend, SQLite via PDO.
No frameworks. No composer. No npm. Pure PHP files.

The draft files index.html, style.css, and app.js already exist — do NOT touch them in this phase.

TASK: Build the project foundation.

Step 1 — Create this folder structure (empty folders get a .gitkeep):
  cognitorn/
  ├── api/           (empty)
  ├── db/
  ├── middleware/
  ├── uploads/
  └── prisma/        (empty)

Step 2 — Create db/schema.sql
  Use the exact schema from TECH.md (all 9 tables).
  All CREATE TABLE statements use IF NOT EXISTS.

Step 3 — Create db/connect.php
  - Define constant DB_PATH = __DIR__ . '/cognitorn.db'
  - Create function getDB(): PDO
    * Singleton — store in static variable
    * On first call: create PDO connection to DB_PATH
    * Set PDO options: ERRMODE_EXCEPTION, DEFAULT_FETCH_MODE ASSOC
    * Run PRAGMA foreign_keys = ON
    * Read and execute db/schema.sql to create tables
    * Return the PDO instance
  - Create function generateId(string $prefix): string
    * Returns $prefix . '_' . bin2hex(random_bytes(8))
  - Create function jsonResponse(array $data, int $status = 200): never
    * Sets Content-Type: application/json, http_response_code, echoes json_encode, exits
  - Create function jsonError(string $message, int $status = 400): never
    * Calls jsonResponse(['error' => $message], $status)
  - Create function buildSkillResponse(array $row, PDO $db, ?string $uid = null): array
    * Decodes tags from JSON string to PHP array
    * Fetches author: SELECT id, username, avatar FROM users WHERE id = author_id
    * Fetches collaborators: SELECT u.id, u.username, u.avatar FROM collaborators c JOIN users u ON c.user_id = u.id WHERE c.skill_id = ?
    * Fetches versions: SELECT id, version, note, created_at FROM skill_versions WHERE skill_id = ? ORDER BY created_at ASC
    * Counts pending_contributions: SELECT COUNT(*) FROM contributions WHERE skill_id = ? AND status = 'pending'
    * If $uid provided: checks is_starred (stars table), is_installed (installs table where is_purchase=0), is_purchased (installs table where is_purchase=1)
    * Casts: is_free to bool, price to float, preview_images to decoded JSON array
    * Returns merged array with all fields

Step 4 — Create middleware/auth_check.php
  - Calls session_start() if not already started
  - If $_SESSION['user_id'] is not set: call jsonError('Unauthorized', 401)
  - Otherwise: set $current_user_id = $_SESSION['user_id']

Step 5 — Create a standard header block as a comment in connect.php:
  Each api/*.php file must start with:
  header('Content-Type: application/json');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
  session_start();
  require_once __DIR__ . '/../db/connect.php';

Step 6 — Create db/seed.sql
  Insert 5 users and 8 skills matching the seedIfEmpty() function in app.js.
  Users: demo (password_hash of 'demo123'), voidpilot, nx_orb, synthwave, koderift (all hash of 'pass').
  Avatar = first 2 chars of username uppercased.
  Skills: Deep Research Analyst, Git Commit Poet, Notion MCP Bridge, Code Review Sensei,
          SQL Query Optimizer, GitHub MCP Connector, Rubber Duck Debugger, API Doc Generator.
  For each skill insert into skill_versions (at least 1 version entry).
  For Code Review Sensei and GitHub MCP Connector: insert collaborator rows.

Step 7 — Create setup.php in project root:
  - Require db/connect.php (this creates tables automatically)
  - Check if users table is empty
  - If empty: read and execute db/seed.sql line by line
  - Output JSON: {"ok": true, "message": "Cognitorn ready. Demo: demo / demo123"}
  - If already seeded: {"ok": true, "message": "Already set up."}
  - Safe to run multiple times

Step 8 — Create README.md:
  - What Cognitorn is (one paragraph)
  - Requirements: PHP 8.1+, SQLite3, PDO, PDO_SQLite extensions
  - Setup: php -S localhost:8000 then visit http://localhost:8000/setup.php
  - Demo login: demo / demo123
```

**✅ DONE WHEN:**
- [ ] All folders exist
- [ ] db/schema.sql has all 9 tables
- [ ] db/connect.php has getDB(), generateId(), jsonResponse(), jsonError(), buildSkillResponse()
- [ ] middleware/auth_check.php exists
- [ ] db/seed.sql has 5 users and 8 skills
- [ ] Running `php setup.php` outputs "Cognitorn ready" without errors
- [ ] Running `php setup.php` a second time outputs "Already set up"

---

---

# PHASE 1 — Auth Backend

**What this phase builds:**
`api/auth.php` — login, register, logout, me endpoints.

---

## Prompt:

```
Cognitorn Phase 1. Phase 0 (foundation) is complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build api/auth.php

Rules:
- Start with the standard header block (defined in Phase 0 comments in connect.php)
- Route via ?action= query param
- Parse POST body: $body = json_decode(file_get_contents('php://input'), true) ?? []
- Use generateId(), jsonResponse(), jsonError() from db/connect.php
- Wrap all logic in try/catch — catch returns jsonError($e->getMessage(), 500)

ACTION: login (POST ?action=login)
  - Require: username, password (jsonError 400 if missing)
  - SELECT * FROM users WHERE username = ?
  - If no user: jsonError('Invalid username or password', 401)
  - password_verify($body['password'], $row['password_hash']) — if false: same error
  - $_SESSION['user_id'] = $row['id']
  - jsonResponse(['user' => [id, username, email, avatar, created_at]])

ACTION: register (POST ?action=register)
  - Require: username, email, password
  - Validate password length >= 6: jsonError('Password must be at least 6 characters', 400)
  - Check username taken: SELECT id FROM users WHERE username = ?
    If found: jsonError('Username already taken', 400)
  - Check email taken: SELECT id FROM users WHERE email = ?
    If found: jsonError('Email already registered', 400)
  - $id = generateId('u')
  - $avatar = strtoupper(substr($username, 0, 2))
  - $hash = password_hash($password, PASSWORD_BCRYPT)
  - INSERT INTO users (id, username, email, password_hash, avatar, created_at) VALUES (...)
  - $_SESSION['user_id'] = $id
  - jsonResponse(['user' => [id, username, email, avatar, created_at]])

ACTION: logout (POST ?action=logout)
  - session_destroy()
  - jsonResponse(['ok' => true])

ACTION: me (GET ?action=me)
  - If !$_SESSION['user_id']: jsonError('Not authenticated', 401)
  - SELECT id, username, email, avatar, created_at FROM users WHERE id = ?
  - If not found: jsonError('User not found', 404)
  - jsonResponse(['user' => $row])

Default: jsonError('Unknown action', 400)
```

**✅ DONE WHEN:**
- [ ] POST to api/auth.php?action=login with `{"username":"demo","password":"demo123"}` returns user object
- [ ] POST to api/auth.php?action=register with new credentials creates user and returns it
- [ ] POST to api/auth.php?action=login with wrong password returns 401
- [ ] POST to api/auth.php?action=register with taken username returns specific error
- [ ] GET to api/auth.php?action=me after login returns the logged-in user
- [ ] GET to api/auth.php?action=me without login returns 401

---

---

# PHASE 2 — Auth Frontend

**What this phase builds:**
Connects the existing login/register modal UI in `app.js` to the PHP auth API.

---

## Prompt:

```
Cognitorn Phase 2. Phases 0-1 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Update app.js to use api/auth.php instead of localStorage for authentication.

IMPORTANT: Keep ALL existing UI code, DOM manipulation, modal logic, and event listeners unchanged.
Only replace the data layer for authentication.

Changes to make in app.js:

1. Add a global API helper at the top of the file (after state object):
   async function apiFetch(url, options = {}) {
     const defaults = { credentials: 'include', headers: {} };
     if (options.body) defaults.headers['Content-Type'] = 'application/json';
     const res = await fetch(url, { ...defaults, ...options, headers: { ...defaults.headers, ...(options.headers || {}) } });
     const data = await res.json();
     if (!res.ok) {
       // Handle common errors
       if (res.status === 401) { state.currentUser = null; updateNavAuth(); }
       throw { status: res.status, message: data.error || 'Request failed', data };
     }
     return data;
   }

2. Replace the login() function with async loginUser(username, password):
   - POST to 'api/auth.php?action=login' with JSON body {username, password}
   - On success: state.currentUser = data.user, updateNavAuth(), return {ok: true}
   - On error: return {ok: false, error: err.message}

3. Replace the register() function with async registerUser(username, email, password):
   - POST to 'api/auth.php?action=register' with JSON body
   - On success: state.currentUser = data.user, updateNavAuth(), return {ok: true}
   - On error: return {ok: false, error: err.message}

4. Replace the logout() function with async logoutUser():
   - POST to 'api/auth.php?action=logout'
   - state.currentUser = null, updateNavAuth()

5. Add async initSession():
   - GET 'api/auth.php?action=me'
   - If ok: state.currentUser = data.user, updateNavAuth()
   - If error (401): state.currentUser = null (silent, expected for guests)

6. Update the #loginBtn event listener:
   - Make handler async
   - const result = await loginUser(u, p)
   - if result.ok: closeModal, showToast, renderSkills()
   - else: show result.error in #loginError

7. Update the #registerBtn event listener:
   - Make handler async
   - const result = await registerUser(u, e, p)
   - if result.ok: closeModal, showToast, renderSkills()
   - else: show result.error in #regError

8. Update the #navAvatar click to call await logoutUser() then navigateTo('explore').

9. Replace the synchronous init block at the bottom with:
   (async () => {
     await initSession();
     navigateTo('explore');
   })();
   Keep seedIfEmpty() call BEFORE initSession() — skills still use localStorage for now.

DO NOT change index.html or style.css.
DO NOT change anything related to skills rendering yet.
```

**✅ DONE WHEN:**
- [ ] Login with demo/demo123 works and persists on page refresh
- [ ] Register creates a new account and logs in
- [ ] Wrong password shows error in modal (not a JS console error)
- [ ] Duplicate username shows specific error message
- [ ] Logout clears nav and returns to guest state
- [ ] Page refresh keeps user logged in (PHP session persists)

---

---

# PHASE 3 — Skills Backend

**What this phase builds:**
`api/skills.php` — list, get, stats, create, update_version, delete.

---

## Prompt:

```
Cognitorn Phase 3. Phases 0-2 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build api/skills.php

Standard header block at top. Route via ?action=. Use helpers from connect.php.

ACTION: list (GET ?action=list) — public
  Build SQL query dynamically:
  Base: SELECT s.*, u.username as author_username, u.avatar as author_avatar
        FROM skills s JOIN users u ON s.author_id = u.id

  Apply filters in order:
  1. page=mcp → WHERE s.type = 'mcp'
  2. page=marketplace → WHERE s.type = 'marketplace'
  3. page=trending → no type filter, sort = stars_count + installs_count DESC, LIMIT 12
  4. page=myskills → require auth, WHERE (s.author_id = $uid OR s.id IN (SELECT skill_id FROM collaborators WHERE user_id = $uid))
  5. type param (if not 'all' and page not already set type): WHERE s.type = ?
  6. agent param (if not 'all'): WHERE (s.agent = ? OR s.agent = 'any')
  7. q param: WHERE (s.name LIKE ? OR s.description LIKE ? OR s.tags LIKE ?) — use %q%
  8. sort: newest=created_at DESC, stars=stars_count DESC, installs=installs_count DESC, forks=forks_count DESC
  9. Pagination: LIMIT $per_page OFFSET (($page_num - 1) * $per_page), defaults: per_page=24, page_num=1

  Also run a COUNT(*) query with same filters (no LIMIT) for total.
  For each row call buildSkillResponse($row, $db, $uid_if_logged_in).
  Return: {skills: [...], total: N, page: $page_num, per_page: $per_page, has_more: ($offset + count < total)}

ACTION: get (GET ?action=get&id=X) — public
  - SELECT * FROM skills WHERE id = ?
  - If not found: jsonError('Skill not found', 404)
  - Return {skill: buildSkillResponse($row, $db, $uid_if_logged_in)}

ACTION: stats (GET ?action=stats) — public
  - Return {
      skills_count: SELECT COUNT(*) FROM skills,
      users_count: SELECT COUNT(*) FROM users,
      total_installs: SELECT COALESCE(SUM(installs_count), 0) FROM skills
    }

ACTION: create (POST ?action=create) — requires auth (include auth_check.php)
  Input: {name, description, content, type, agent, tags (array), version, price, is_free, preview_video}
  Validate:
  - name: required, trim, max 100 chars
  - description: required, trim, max 500 chars
  - content: required
  - type: must be in ['skill','mcp','agent','prompt','tool','marketplace']
  - agent: must be in ['claude','cursor','gpt','gemini','any']
  - tags: array, filter empty, max 8, each max 30 chars, json_encode for storage
  - version: required, default '1.0.0'
  - price: floatval, default 0
  - is_free: if price > 0 and !is_free, set is_free=0; otherwise 1

  $id = generateId('s'), $now = time()
  INSERT INTO skills (all fields)
  INSERT INTO skill_versions (generateId('v'), $id, $version, 'Initial release', $content, $now)
  Return {skill: buildSkillResponse(...)}

ACTION: update_version (POST ?action=update_version) — requires auth
  Input: {id, version, note, content}
  - Fetch skill — if not found: 404
  - Check author_id OR collaborators: if not owner or collaborator: 403
  - Validate new version > current version (string semver compare)
  - INSERT INTO skill_versions (new id, skill_id, version, note, content, time())
  - UPDATE skills SET version=?, content=?, updated_at=? WHERE id=?
  - Return {skill: buildSkillResponse(...)}

ACTION: delete (POST ?action=delete) — requires auth
  Input: {id}
  - Fetch skill — verify author_id === $current_user_id (else 403)
  - DELETE FROM skills WHERE id=? (cascades to all related tables via ON DELETE CASCADE)
  - Return {ok: true}

Default: jsonError('Unknown action', 400)
```

**✅ DONE WHEN:**
- [ ] GET api/skills.php?action=list returns all 8 seeded skills
- [ ] GET api/skills.php?action=list&type=mcp returns only MCP skills
- [ ] GET api/skills.php?action=list&q=research returns matching skills
- [ ] GET api/skills.php?action=get&id=s1 returns full skill with author, collaborators, versions
- [ ] GET api/skills.php?action=stats returns correct counts
- [ ] POST create (logged in) creates a new skill and returns it
- [ ] POST delete by non-owner returns 403

---

---

# PHASE 4 — Skills Frontend

**What this phase builds:**
Replace localStorage skills with real API fetch in `app.js`. Add skeleton loaders.

---

## Prompt:

```
Cognitorn Phase 4. Phases 0-3 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Update app.js to fetch skills from api/skills.php and update style.css with skeleton styles.

RULES:
- Keep all skill card HTML structure identical to current
- skill.author is now {id, username, avatar} object — use skill.author.username, skill.author.avatar
- Make renderSkills() async
- Remove seedIfEmpty() call from init
- Skill objects from API have is_starred, is_installed, is_purchased booleans

CHANGES TO app.js:

1. Make renderSkills() async:

async function renderSkills() {
  if (state.loading) return;
  state.loading = true;

  const grid = $('#skillsGrid');
  const empty = $('#emptyState');

  // Show skeleton if page 1 (fresh load)
  if (state.page === 1) {
    grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
    empty.style.display = 'none';
  }

  // Build query params
  const params = new URLSearchParams({
    action: 'list',
    type: state.filterType,
    agent: state.filterAgent,
    sort: state.filterSort,
    q: state.searchQuery,
    page: state.currentPage,
    page_num: state.page,
    per_page: 24,
  });

  try {
    const data = await apiFetch(`api/skills.php?${params}`);
    state.hasMore = data.has_more;

    if (state.page === 1) grid.innerHTML = '';

    if (data.skills.length === 0 && state.page === 1) {
      empty.style.display = 'flex';
      state.loading = false;
      return;
    }
    empty.style.display = 'none';

    data.skills.forEach(skill => {
      const card = createSkillCard(skill);
      grid.appendChild(card);
    });
  } catch (err) {
    if (state.page === 1) grid.innerHTML = '';
    showToast('Failed to load skills', 'error');
  }

  state.loading = false;
}

2. Extract card creation into createSkillCard(skill) function.
   Update to use skill.author.username and skill.author.avatar instead of getAuthorById().
   Keep all other card HTML identical to current draft.
   is_starred determines ★ vs ☆ on the star count.

3. Update updateStats() to fetch from api/skills.php?action=stats.

4. Add infinite scroll:
   window.addEventListener('scroll', () => {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
       if (state.hasMore && !state.loading) {
         state.page++;
         renderSkills();
       }
     }
   });

5. Reset pagination on filter change:
   Any time filterType, filterAgent, filterSort, searchQuery, or currentPage changes:
   state.page = 1; state.hasMore = false;
   then call renderSkills().

6. Update openSkillModal(skill):
   After opening modal, re-fetch fresh data:
   const fresh = await apiFetch(`api/skills.php?action=get&id=${skill.id}`);
   state.viewingSkill = fresh.skill;
   renderSkillTab('readme');

7. Update navigateTo() — after setting state.currentPage, reset state.page = 1.

8. Update init IIFE — remove seedIfEmpty():
   (async () => {
     await initSession();
     navigateTo('explore');
   })();

9. Update the URL deep link handler (check for ?skill= on load):
   const urlSkillId = new URLSearchParams(window.location.search).get('skill');
   if (urlSkillId) {
     const res = await apiFetch(`api/skills.php?action=get&id=${urlSkillId}`);
     if (res.skill) openSkillModal(res.skill);
   }

CHANGES TO style.css — add skeleton loader styles:

.skeleton-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  height: 220px;
  overflow: hidden;
  position: relative;
}
.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
```

**✅ DONE WHEN:**
- [ ] Skills grid loads from PHP/SQLite (not localStorage)
- [ ] Skeleton cards show during fetch
- [ ] Type filter (skill/mcp/etc.) filters correctly via server
- [ ] Agent filter works
- [ ] Sort works (newest, stars, installs, forks)
- [ ] Search filters results
- [ ] Page refresh shows same skills (not from localStorage seed)
- [ ] Stats numbers come from API

---

---

# PHASE 5 — Social Actions (Stars, Forks, Installs)

**What this phase builds:**
`api/stars.php`, `api/forks.php`, `api/installs.php` and their frontend connections.

---

## Prompt:

```
Cognitorn Phase 5. Phases 0-4 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build 3 PHP API files and update app.js social action functions.

--- FILE: api/stars.php ---
Standard header. Require auth_check.php for all actions.

ACTION: toggle (POST ?action=toggle)
  Input: {skill_id}
  Validate skill_id exists (SELECT id FROM skills WHERE id=?) — 404 if not.
  Use DB transaction:
  BEGIN TRANSACTION
    SELECT 1 FROM stars WHERE user_id=? AND skill_id=?
    If exists:
      DELETE FROM stars WHERE user_id=? AND skill_id=?
      UPDATE skills SET stars_count = MAX(0, stars_count - 1) WHERE id=?
      $starred = false
    Else:
      INSERT INTO stars (user_id, skill_id, created_at) VALUES (?, ?, time())
      UPDATE skills SET stars_count = stars_count + 1 WHERE id=?
      $starred = true
      INSERT INTO notifications (generateId('n'), skill.author_id, 'star', $current_user_id, skill_id, NULL, 0, time())
      — only if author_id !== $current_user_id
  COMMIT
  SELECT stars_count FROM skills WHERE id=?
  jsonResponse(['starred' => $starred, 'count' => $count])

--- FILE: api/forks.php ---
Standard header. Require auth_check.php.

ACTION: fork (POST ?action=fork)
  Input: {skill_id}
  Fetch original skill — 404 if not found.
  If original.author_id === $current_user_id: jsonError('Cannot fork your own skill', 400)
  Check forks table: if exists: jsonError('Already forked', 400)
  $original_author = SELECT username FROM users WHERE id = original.author_id
  $new_id = generateId('s')
  $now = time()

  BEGIN TRANSACTION
    INSERT INTO skills:
      id=$new_id, author_id=$current_user_id,
      name=original.name + ' (fork)',
      description, content, type, agent, tags, version: copied from original
      price=0, is_free=1, preview_images='[]', preview_video='',
      stars_count=0, installs_count=0, forks_count=0,
      forked_from=original.id,
      created_at=$now, updated_at=$now
    INSERT INTO skill_versions (generateId('v'), $new_id, original.version, 'Forked from @'.$original_author.username, original.content, $now)
    INSERT INTO forks (user_id=$current_user_id, skill_id=original.id, created_at=$now)
    UPDATE skills SET forks_count = forks_count + 1 WHERE id=original.id
    INSERT INTO notifications (generateId('n'), original.author_id, 'fork', $current_user_id, original.id, NULL, 0, $now)
    — only if author_id !== $current_user_id
  COMMIT

  $new_skill = SELECT * FROM skills WHERE id=$new_id
  jsonResponse(['skill' => buildSkillResponse($new_skill, $db, $current_user_id)])

--- FILE: api/installs.php ---
Standard header. Require auth_check.php.

ACTION: install (POST ?action=install)
  Input: {skill_id}
  Fetch skill — 404 if not found.
  $is_purchase = skill.is_free ? 0 : 1
  Check installs table: if already installed:
    jsonResponse(['ok' => false, 'already_installed' => true, 'content' => skill.content])
  INSERT INTO installs (user_id, skill_id, is_purchase=$is_purchase, installed_at=time())
  UPDATE skills SET installs_count = installs_count + 1 WHERE id=?
  jsonResponse(['ok' => true, 'already_installed' => false, 'content' => skill.content, 'is_purchase' => $is_purchase])

--- UPDATES TO app.js ---

Update toggleStar(skill):
  If not logged in: showToast('Sign in to star', 'error'); openModal('authModal'); return
  const data = await apiFetch('api/stars.php?action=toggle', { method:'POST', body: JSON.stringify({skill_id: skill.id}) })
  Update state.viewingSkill.stars_count = data.count
  Update state.viewingSkill.is_starred = data.starred
  Update star button text: data.starred ? '★ Unstar' : '☆ Star'
  Re-render the card in grid (find by id and update just the star count span)

Update forkSkill(skill):
  If not logged in: prompt auth; return
  Try apiFetch fork
  On success: showToast('⑂ Forked! Find it in My Skills'), closeModal('skillModal'), state.page=1, renderSkills()
  On error: showToast(err.message, 'error')

Update installSkill(skill):
  If not logged in: prompt auth; return
  const data = await apiFetch('api/installs.php?action=install', { method:'POST', body: JSON.stringify({skill_id: skill.id}) })
  navigator.clipboard?.writeText(data.content).catch(()=>{})
  if data.already_installed: showToast('Already installed — content copied to clipboard')
  else if data.is_purchase: showToast('🛒 Unlocked! Content copied to clipboard', 'success')
  else: showToast('⬇ Installed! Content copied to clipboard', 'success')
  Update state.viewingSkill.is_installed = true
  Update install button to show "✓ Installed" (disabled)
```

**✅ DONE WHEN:**
- [ ] Star button toggles, count updates in real time, persists on refresh
- [ ] Cannot star own skill (or at minimum notification not sent to self)
- [ ] Fork creates a copy under logged-in user's profile
- [ ] Cannot fork own skill — shows error toast
- [ ] Cannot fork same skill twice — shows error toast
- [ ] Install copies content to clipboard and shows toast
- [ ] Already installed shows appropriate toast
- [ ] Paid item install shows "Unlocked" toast

---

---

# PHASE 6 — Contributions (Pull Request Flow)

**What this phase builds:**
`api/contributions.php` — submit, list, accept, reject. Contributions UI in skill modal.

---

## Prompt:

```
Cognitorn Phase 6. Phases 0-5 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build the contribution (pull-request-style) system.

--- FILE: api/contributions.php ---
Standard header.

ACTION: submit (POST ?action=submit) — requires auth
  Input: {skill_id, title, description, proposed_content}
  Validate: all fields required; title max 100 chars; description max 500 chars
  Cannot contribute to own skill: if skill.author_id === $current_user_id: 403
  $id = generateId('c')
  INSERT INTO contributions (id, skill_id, author_id=$current_user_id, title, description, proposed_content, status='pending', review_note='', created_at=time(), reviewed_at=NULL)
  INSERT INTO notifications for skill owner: type='contribution_received', from_user_id=$current_user_id
  Return {contribution: {id, skill_id, author:{...}, title, description, proposed_content, status, review_note, created_at}}

ACTION: list (GET ?action=list&skill_id=X) — public
  Return accepted contributions for a skill (status='accepted')
  Include author: join users
  Return {contributions: [...]}

ACTION: list_pending (GET ?action=list_pending&skill_id=X) — requires auth, must own skill
  Return all pending contributions for skill
  Verify skill.author_id === $current_user_id OR $current_user_id in collaborators
  Return {contributions: [...]}

ACTION: accept (POST ?action=accept) — requires auth
  Input: {contribution_id, version, note}
  Fetch contribution — 404 if not found
  Fetch skill — verify owner/collaborator — 403 if not
  Validate version > current skill version
  BEGIN TRANSACTION
    INSERT INTO skill_versions (new id, skill_id, version, note, proposed_content, time())
    UPDATE skills SET version=?, content=?, updated_at=? WHERE id=?
    UPDATE contributions SET status='accepted', review_note=?, reviewed_at=? WHERE id=?
    INSERT INTO notifications for contribution.author_id: type='contribution_accepted'
  COMMIT
  Return {skill: buildSkillResponse(...)}

ACTION: reject (POST ?action=reject) — requires auth
  Input: {contribution_id, note}
  Fetch contribution and verify owner/collaborator
  UPDATE contributions SET status='rejected', review_note=?, reviewed_at=? WHERE id=?
  INSERT INTO notifications for contribution.author_id: type='contribution_rejected'
  Return {ok: true}

--- FRONTEND UPDATES ---

1. Add a 5th tab to the skill modal: "Contributions"
   Add to the .skill-modal-tabs HTML in index.html: <button class="stab" data-stab="contributions">Contributions</button>
   Add handler in renderSkillTab('contributions').

2. renderSkillTab('contributions') for non-owners:
   - Show a "Submit Contribution" button
   - Below: list of accepted contributions fetched from api/contributions.php?action=list&skill_id=X
   - Each item shows: contributor avatar, title, description, version it was accepted as, time ago

3. "Submit Contribution" button opens an inline form in the modal:
   - Title input
   - Description textarea
   - Proposed content textarea (pre-filled with current skill content for editing)
   - Submit button → POST to api/contributions.php?action=submit
   - On success: showToast('Contribution submitted!', 'success'), hide form

4. renderSkillTab('contributions') for owners:
   - Show two sections: "Pending Review" and "Accepted"
   - Fetch pending: api/contributions.php?action=list_pending&skill_id=X
   - For each pending contribution show:
     * Contributor info, title, description, time ago
     * "View Diff" button: shows side-by-side current content vs proposed content in two <pre> blocks
     * "Accept" button: opens mini-form for version + release note → POST accept
     * "Reject" button: opens mini-form for rejection note → POST reject
   - Count badge on the Contributions tab: show pending_contributions count from skill object

5. Add CSS for the contribution UI:
   .contrib-item { border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; }
   .contrib-diff { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
   .diff-old { background: rgba(255,68,102,0.05); border: 1px solid rgba(255,68,102,0.2); border-radius: var(--radius); padding: 12px; }
   .diff-new { background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2); border-radius: var(--radius); padding: 12px; }
   pre inside diff blocks: font-family: var(--font-mono); font-size: 11px; white-space: pre-wrap; color: var(--text-2);
```

**✅ DONE WHEN:**
- [ ] Non-owner can submit a contribution
- [ ] Cannot contribute to own skill
- [ ] Owner sees pending contributions count badge on tab
- [ ] Owner can view diff (old vs new) for each pending contribution
- [ ] Owner can accept — creates new version, updates skill content
- [ ] Owner can reject with a note
- [ ] Contributor sees accepted contributions list
- [ ] Contribution status updates reflected immediately in UI

---

---

# PHASE 7 — Collaborators

**What this phase builds:**
`api/collaborators.php` — invite, remove, list. Collaborator management in skill modal.

---

## Prompt:

```
Cognitorn Phase 7. Phases 0-6 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build the collaborator invitation system.

--- FILE: api/collaborators.php ---
Standard header.

ACTION: invite (POST ?action=invite) — requires auth
  Input: {skill_id, username}
  Fetch skill — verify $current_user_id === skill.author_id (only owner can invite) — 403 if not
  Find user by username — 404 if not found
  Cannot invite yourself: if found_user.id === $current_user_id: 400
  Check already collaborator: if exists in collaborators table: 400 'Already a collaborator'
  INSERT INTO collaborators (user_id=found_user.id, skill_id, invited_by=$current_user_id, created_at=time())
  INSERT INTO notifications: type='collaborator_invite', for found_user.id
  Return {ok: true, user: {id, username, avatar}}

ACTION: remove (POST ?action=remove) — requires auth
  Input: {skill_id, user_id}
  Fetch skill — verify owner — 403 if not
  Cannot remove yourself (owner): if user_id === $current_user_id: 400
  DELETE FROM collaborators WHERE user_id=? AND skill_id=?
  Return {ok: true}

ACTION: list (GET ?action=list&skill_id=X) — public
  SELECT u.id, u.username, u.avatar, c.created_at
  FROM collaborators c JOIN users u ON c.user_id = u.id
  WHERE c.skill_id = ?
  Return {collaborators: [...]}

--- FRONTEND UPDATES ---

1. Update the Contributors tab in skill modal renderSkillTab('contributors'):
   - Always show author first with "Author" badge (indigo)
   - Show all collaborators with "Collaborator" badge (dim)
   - If logged-in user is the owner: show a small "✕" remove button next to each collaborator
   - Below the list (owner only): "Invite Collaborator" input + button
     * Input: username to invite
     * On submit: POST api/collaborators.php?action=invite
     * On success: add new collaborator to list, showToast('@username is now a collaborator', 'success')
     * On error: showToast(err.message, 'error')
   - Remove button: POST api/collaborators.php?action=remove, remove from list on success

2. Update buildSkillResponse references:
   The skill.collaborators array is already returned by the API via buildSkillResponse.
   After invite/remove, re-fetch the skill and re-render the tab.
```

**✅ DONE WHEN:**
- [ ] Owner can invite a user by username
- [ ] Invited user appears in Contributors tab
- [ ] Cannot invite yourself
- [ ] Cannot invite same user twice
- [ ] Owner can remove a collaborator
- [ ] Collaborator appears in skill's collaborators list across all users
- [ ] Non-owner cannot invite or remove

---

---

# PHASE 8 — Marketplace

**What this phase builds:**
Marketplace listing type, image uploads, video preview, paid/free toggle, Buy flow, Marketplace page.

---

## Prompt:

```
Cognitorn Phase 8. Phases 0-7 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build the Marketplace feature — premium listings with media previews and pricing.

--- FILE: api/uploads.php ---
Standard header. Require auth_check.php.

ACTION: image (POST ?action=image)
  Receives multipart form data with file field 'file'
  Validate:
  - File exists in $_FILES['file']
  - MIME type is image/jpeg, image/png, image/gif, or image/webp
  - File size < 5MB (5 * 1024 * 1024 bytes)
  Generate filename: generateId('img') . '.' . extension
  Move to uploads/ directory (use __DIR__ . '/../uploads/')
  Return {url: '/uploads/' . $filename}

--- PUBLISH MODAL UPDATES (index.html) ---

Add to the publish modal left side (below tags field), shown only when type=marketplace:
  <div class="form-group marketplace-only" style="display:none">
    <label>Price (USD) <span class="hint">— set 0 for free</span></label>
    <input type="number" id="pubPrice" placeholder="0.00" min="0" step="0.01" value="0" />
  </div>
  <div class="form-group marketplace-only" style="display:none">
    <label>Preview Images <span class="hint">(up to 3)</span></label>
    <div class="image-upload-area" id="imageUploadArea">
      <span>Click or drag images here</span>
      <input type="file" id="imageFileInput" accept="image/*" multiple style="display:none" />
    </div>
    <div class="image-previews" id="imagePreviews"></div>
  </div>
  <div class="form-group marketplace-only" style="display:none">
    <label>Preview Video URL <span class="hint">(YouTube or Vimeo)</span></label>
    <input type="text" id="pubVideoUrl" placeholder="https://youtube.com/watch?v=..." />
  </div>

Show/hide .marketplace-only elements when #pubType changes to/from 'marketplace'.

--- APP.JS UPDATES ---

1. Publish flow: when type=marketplace:
   - Read price from #pubPrice
   - Upload images via apiFetch (FormData POST to api/uploads.php?action=image) before submit
   - Collect image URLs into array
   - Include price, is_free (price==0), preview_images (array), preview_video in create payload

2. Add image upload logic:
   - #imageUploadArea click → trigger #imageFileInput
   - On file select: for each file (max 3), POST FormData to api/uploads.php?action=image
   - Show uploaded image as thumbnail in #imagePreviews with a remove ✕ button
   - Track uploaded URLs in an array (state.uploadedImages)

3. Add Marketplace page to navigation:
   In index.html navbar add: <a class="nav-link" data-page="marketplace">Marketplace</a>
   In navigateTo(): add case 'marketplace' — title "🛒 Marketplace", sub "Premium prompts, animated sites & creative AI assets"

4. Marketplace skill card:
   If skill.type === 'marketplace' AND skill.preview_images.length > 0:
   Render a special card variant with the first image as a background thumbnail.
   Add a price badge: if skill.is_free: "Free" (green), else "$X.XX" (amber).

5. Update installSkill() for marketplace:
   - If skill.is_free === false: button shows "🛒 Buy — $X.XX" (placeholder, no real payment)
   - Clicking Buy: show a modal/toast: "Payment coming soon! For now, unlocking for free."
   - Then proceed with normal install flow (unlock content)

6. Skill detail modal for marketplace:
   - If skill.preview_images.length > 0: show an image gallery above the tabs
     Simple horizontal scroll of img tags: <img src="..." style="height:200px;border-radius:8px;object-fit:cover">
   - If skill.preview_video: show a video embed below images
     Extract video ID from YouTube/Vimeo URL and render iframe

--- CSS UPDATES (style.css) ---

.marketplace-card { position: relative; overflow: hidden; }
.marketplace-card .card-thumb { width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-lg) var(--radius-lg) 0 0; margin: -20px -20px 12px; width: calc(100% + 40px); }
.price-badge-free { background: rgba(0,255,136,0.15); color: var(--green); border: 1px solid rgba(0,255,136,0.3); }
.price-badge-paid { background: rgba(255,179,71,0.15); color: var(--amber); border: 1px solid rgba(255,179,71,0.3); }
.image-upload-area { border: 2px dashed var(--border); border-radius: var(--radius); padding: 24px; text-align: center; cursor: pointer; color: var(--text-3); transition: border-color 0.2s; }
.image-upload-area:hover { border-color: var(--indigo); color: var(--text-2); }
.image-previews { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.image-preview-thumb { position: relative; width: 64px; height: 64px; border-radius: 6px; overflow: hidden; }
.image-preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
.image-preview-thumb .remove-img { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.skill-gallery { display: flex; gap: 8px; overflow-x: auto; padding: 16px 28px; border-bottom: 1px solid var(--border); }
.skill-gallery img { height: 180px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.skill-video { padding: 0 28px 16px; }
.skill-video iframe { width: 100%; height: 280px; border-radius: var(--radius); border: 1px solid var(--border); }
```

**✅ DONE WHEN:**
- [ ] Marketplace page shows in nav and filters to marketplace type
- [ ] Publish form shows price + image + video fields when type=marketplace
- [ ] Image upload works and shows thumbnail previews
- [ ] Marketplace card shows image thumbnail and price badge
- [ ] Free marketplace item installs normally
- [ ] Paid item shows "Buy" button and placeholder toast
- [ ] Skill modal shows image gallery and embedded video

---

---

# PHASE 9 — My Skills Dashboard

**What this phase builds:**
4-tab My Skills dashboard: Published, Collaborating, Installed, Purchased.

---

## Prompt:

```
Cognitorn Phase 9. Phases 0-8 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build the full My Skills dashboard with 4 tabs.

--- BACKEND: api/users.php ---
Standard header.

ACTION: my_skills (GET ?action=my_skills&tab=X) — requires auth
  tab = published | collaborating | installed | purchased (default: published)

  published:
    SELECT * FROM skills WHERE author_id = $current_user_id ORDER BY created_at DESC
    
  collaborating:
    SELECT s.* FROM skills s
    JOIN collaborators c ON s.id = c.skill_id
    WHERE c.user_id = $current_user_id
    ORDER BY s.updated_at DESC

  installed:
    SELECT s.* FROM skills s
    JOIN installs i ON s.id = i.skill_id
    WHERE i.user_id = $current_user_id AND i.is_purchase = 0
    ORDER BY i.installed_at DESC

  purchased:
    SELECT s.* FROM skills s
    JOIN installs i ON s.id = i.skill_id
    WHERE i.user_id = $current_user_id AND i.is_purchase = 1
    ORDER BY i.installed_at DESC

  For each row: buildSkillResponse($row, $db, $current_user_id)
  Return {skills: [...]}

ACTION: profile (GET ?action=profile&username=X) — public
  SELECT id, username, avatar, created_at FROM users WHERE username = ?
  If not found: 404
  SELECT * FROM skills WHERE author_id = user.id AND forked_from IS NULL ORDER BY stars_count DESC
  Stats:
    total_skills: COUNT(*)
    total_stars: SUM(stars_count)
    total_installs: SUM(installs_count)
  Return {user: {...}, skills: [...], stats: {...}}

--- FRONTEND: My Skills page ---

1. In index.html, add tab buttons inside the My Skills page area (shown when currentPage=myskills):
   <div class="myskills-tabs" id="mySkillsTabs" style="display:none">
     <button class="mstab active" data-tab="published">Published</button>
     <button class="mstab" data-tab="collaborating">Collaborating</button>
     <button class="mstab" data-tab="installed">Installed</button>
     <button class="mstab" data-tab="purchased">Purchased</button>
   </div>

2. Show #mySkillsTabs when currentPage=myskills, hide otherwise.

3. navigateTo('myskills'):
   - Show the tab bar
   - Fetch from api/users.php?action=my_skills&tab={state.mySkillsTab}
   - Render in skills grid

4. Tab click:
   $$('.mstab').forEach(btn => btn.onclick = () => {
     $$('.mstab').forEach(b => b.classList.remove('active'));
     btn.classList.add('active');
     state.mySkillsTab = btn.dataset.tab;
     state.page = 1;
     renderMySkills();
   });

5. async renderMySkills():
   Show skeleton, fetch api/users.php?action=my_skills&tab={state.mySkillsTab}
   Render cards same as explore grid.
   
   For tab=published: show a delete button (⋯ menu) on cards the user owns.
   
   Empty states per tab:
   - published: "You haven't published any skills yet" + Publish button
   - collaborating: "You're not collaborating on any skills yet"
   - installed: "You haven't installed any skills yet" + Explore button
   - purchased: "You haven't purchased anything yet" + Marketplace button

6. Delete flow (published tab):
   Add a ⋯ button top-right of each owned card.
   On click (stopPropagation): show inline confirm overlay on the card: "Delete?" [Yes] [No]
   On Yes: POST api/skills.php?action=delete {id}
   On success: animate card out (opacity 0, height 0, 300ms), remove from DOM, showToast('Skill deleted')

--- CSS for My Skills tabs ---
.myskills-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--surface); border-radius: 8px; padding: 3px; width: fit-content; }
.mstab { padding: 7px 18px; border-radius: 6px; font-size: 13px; font-weight: 500; color: var(--text-3); background: transparent; transition: all 0.15s; }
.mstab.active { background: var(--bg-3); color: var(--text); }
.card-delete-btn { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); color: var(--text-3); font-size: 14px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s; z-index: 2; }
.skill-card:hover .card-delete-btn { opacity: 1; }
.card-confirm { position: absolute; inset: 0; background: rgba(8,11,20,0.92); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; z-index: 3; }
.card-confirm p { color: var(--text); font-weight: 600; }
.card-confirm .confirm-btns { display: flex; gap: 8px; }
```

**✅ DONE WHEN:**
- [ ] My Skills page shows 4 tabs
- [ ] Published tab shows user's own skills
- [ ] Collaborating tab shows skills user collaborates on
- [ ] Installed tab shows free installs
- [ ] Purchased tab shows paid unlocks
- [ ] Empty states show correctly for each tab
- [ ] Delete flow works with confirmation and animation
- [ ] Switching tabs re-fetches correct data

---

---

# PHASE 10 — Notifications

**What this phase builds:**
Bell icon in navbar, notification dropdown, unread count badge, mark as read.

---

## Prompt:

```
Cognitorn Phase 10. Phases 0-9 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build the notifications system.

--- BACKEND: api/notifications.php ---
Standard header. All actions require auth.

ACTION: list (GET ?action=list)
  SELECT n.*, u.username as from_username, u.avatar as from_avatar,
         s.name as skill_name
  FROM notifications n
  JOIN users u ON n.from_user_id = u.id
  LEFT JOIN skills s ON n.skill_id = s.id
  WHERE n.user_id = $current_user_id
  ORDER BY n.created_at DESC
  LIMIT 20
  
  For each notification build a human-readable message string:
  - star: "{from_username} starred your skill {skill_name}"
  - fork: "{from_username} forked your skill {skill_name}"
  - contribution_received: "{from_username} submitted a contribution to {skill_name}"
  - contribution_accepted: "Your contribution to {skill_name} was accepted"
  - contribution_rejected: "Your contribution to {skill_name} was rejected"
  - collaborator_invite: "{from_username} invited you to collaborate on {skill_name}"
  
  unread_count: SELECT COUNT(*) FROM notifications WHERE user_id=? AND is_read=0
  Return {notifications: [...with message field], unread_count: N}

ACTION: mark_read (POST ?action=mark_read)
  Input: {id} OR {all: true}
  If all: UPDATE notifications SET is_read=1 WHERE user_id=$current_user_id
  Else: UPDATE notifications SET is_read=1 WHERE id=? AND user_id=$current_user_id
  Return {ok: true}

--- FRONTEND UPDATES ---

1. Add bell icon to navbar in index.html (inside #navUser div, before avatar):
   <div class="nav-bell" id="navBell" style="display:none">
     <button class="bell-btn" id="bellBtn">🔔</button>
     <span class="bell-badge" id="bellBadge" style="display:none">0</span>
     <div class="notif-dropdown" id="notifDropdown" style="display:none">
       <div class="notif-header">
         <span>Notifications</span>
         <button id="markAllRead">Mark all read</button>
       </div>
       <div class="notif-list" id="notifList"></div>
     </div>
   </div>

2. In updateNavAuth():
   - If logged in: show #navBell
   - If logged out: hide #navBell

3. async function loadNotifications():
   GET api/notifications.php?action=list
   state.notifications = data.notifications
   state.unreadCount = data.unread_count
   Update bell badge: if > 0 show count, if 0 hide badge

4. Poll notifications every 30 seconds when logged in:
   setInterval(() => { if (state.currentUser) loadNotifications() }, 30000)
   Also call on login.

5. Bell button click:
   Toggle #notifDropdown visibility
   If opening: call loadNotifications(), render list, mark visible ones as read
   Close on click outside

6. Render notification list:
   Each item: avatar circle (from_avatar), message text, time ago
   Unread items have a left border in indigo color
   If list empty: "No notifications yet" in dim text
   Each item is clickable: if skill_id exists, open that skill modal

7. #markAllRead button:
   POST api/notifications.php?action=mark_read {all: true}
   Re-render list with all items showing as read

--- CSS ---
.nav-bell { position: relative; }
.bell-btn { background: transparent; border: none; font-size: 18px; cursor: pointer; padding: 6px; border-radius: 6px; transition: background 0.15s; }
.bell-btn:hover { background: var(--surface); }
.bell-badge { position: absolute; top: 0; right: 0; background: var(--red); color: white; font-size: 10px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }
.notif-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 320px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: 0 16px 48px rgba(0,0,0,0.4); z-index: 200; overflow: hidden; }
.notif-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 13px; font-weight: 600; }
.notif-header button { font-size: 11px; color: var(--indigo); background: transparent; border: none; cursor: pointer; }
.notif-list { max-height: 360px; overflow-y: auto; }
.notif-item { display: flex; gap: 10px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-left: 3px solid transparent; }
.notif-item:hover { background: var(--surface); }
.notif-item.unread { border-left-color: var(--indigo); background: rgba(108,99,255,0.05); }
.notif-msg { font-size: 12px; color: var(--text-2); line-height: 1.5; flex: 1; }
.notif-time { font-size: 11px; color: var(--text-3); white-space: nowrap; }
```

**✅ DONE WHEN:**
- [ ] Bell icon shows in navbar when logged in
- [ ] Unread count badge appears with correct number
- [ ] Starring someone's skill creates a notification for the skill owner
- [ ] Forking creates a notification
- [ ] Contributing creates a notification
- [ ] Accepting/rejecting a contribution notifies the contributor
- [ ] Dropdown opens and shows notifications with human-readable messages
- [ ] Mark all read clears badge and removes unread styling
- [ ] Clicking notification opens the related skill

---

---

# PHASE 11 — User Profiles

**What this phase builds:**
Public profile pages at `/@username`. Stats, published skills grid.

---

## Prompt:

```
Cognitorn Phase 11. Phases 0-10 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Build public user profile pages.

--- BACKEND ---
api/users.php already has profile action from Phase 9.
Verify it returns: {user: {id, username, avatar, created_at}, skills: [...], stats: {total_skills, total_stars, total_installs}}

--- FRONTEND ---

1. Add profile page rendering in app.js:

async function navigateToProfile(username) {
  state.currentPage = 'profile';
  state.viewingProfile = username;
  
  // Update URL without reload
  history.pushState({}, '', `/@${username}`);
  document.title = `@${username} — Cognitorn`;
  
  // Hide filters bar, show page header
  $('#filtersBar').style.display = 'none';
  $('#heroSection').style.display = 'none';
  $('#pageHeader').style.display = 'block';
  $('#mySkillsTabs').style.display = 'none';
  
  // Show profile header
  $('#profileHeader').style.display = 'block';
  
  try {
    const data = await apiFetch(`api/users.php?action=profile&username=${encodeURIComponent(username)}`);
    
    // Render profile header
    $('#profileAvatar').textContent = data.user.avatar;
    $('#profileUsername').textContent = '@' + data.user.username;
    $('#profileJoined').textContent = 'Joined ' + timeAgo(data.user.created_at);
    $('#profileStatSkills').textContent = data.stats.total_skills;
    $('#profileStatStars').textContent = formatNum(data.stats.total_stars || 0);
    $('#profileStatInstalls').textContent = formatNum(data.stats.total_installs || 0);
    
    // Render skills
    const grid = $('#skillsGrid');
    grid.innerHTML = '';
    data.skills.forEach(skill => grid.appendChild(createSkillCard(skill)));
    
    if (data.skills.length === 0) {
      $('#emptyState').style.display = 'flex';
      // Custom empty text: "@username hasn't published any skills yet"
    }
  } catch (err) {
    showToast('Profile not found', 'error');
    navigateTo('explore');
  }
}

2. Add profile header HTML to index.html (after .hero, before .filters-bar):
<div class="profile-header" id="profileHeader" style="display:none">
  <div class="profile-avatar-lg" id="profileAvatar"></div>
  <div class="profile-info">
    <h2 class="profile-username" id="profileUsername"></h2>
    <span class="profile-joined" id="profileJoined"></span>
  </div>
  <div class="profile-stats">
    <div class="profile-stat"><span id="profileStatSkills">0</span><label>Skills</label></div>
    <div class="profile-stat"><span id="profileStatStars">0</span><label>Stars</label></div>
    <div class="profile-stat"><span id="profileStatInstalls">0</span><label>Installs</label></div>
  </div>
</div>

3. Make author username on skill cards clickable:
   In createSkillCard(): wrap author name in a span with data-username attribute
   Add event listener (delegated): if click target has data-username, call navigateToProfile(username), stopPropagation

4. Handle browser back button:
   window.addEventListener('popstate', () => {
     const path = window.location.pathname;
     if (path.startsWith('/@')) {
       navigateToProfile(path.slice(2));
     } else {
       navigateTo('explore');
     }
   });

5. On page load: check if URL is /@username and navigate to profile.

--- CSS ---
.profile-header { display: flex; align-items: center; gap: 24px; padding: 40px 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
.profile-avatar-lg { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--indigo), var(--cyan)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 24px; color: white; box-shadow: 0 0 24px rgba(108,99,255,0.4); flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-username { font-family: var(--font-display); font-size: 24px; font-weight: 700; }
.profile-joined { color: var(--text-3); font-size: 13px; }
.profile-stats { display: flex; gap: 24px; }
.profile-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.profile-stat span { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text); }
.profile-stat label { font-size: 11px; color: var(--text-3); }
```

**✅ DONE WHEN:**
- [ ] Clicking author username on a skill card navigates to their profile
- [ ] Profile shows avatar, username, join date, 3 stats
- [ ] Profile shows their published skills (not forks) in a grid
- [ ] URL changes to /@username
- [ ] Direct URL visit (/@voidpilot) loads profile correctly
- [ ] Browser back button works
- [ ] Non-existent username shows error and redirects to explore

---

---

# PHASE 12 — Search, Filter & Infinite Scroll Polish

**What this phase builds:**
Tag click filtering, URL-synced filters, verified infinite scroll, search polish.

---

## Prompt:

```
Cognitorn Phase 12. Phases 0-11 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Polish search, filtering, tag click, and infinite scroll.

1. Tag click filtering:
   In createSkillCard(): make each .tag span clickable.
   On click (stopPropagation so card modal doesn't open):
   - Set state.searchQuery = tag text
   - Update #globalSearch input value to show the tag
   - state.page = 1
   - renderSkills()
   Add visual: active tag (matching current search) gets a highlighted style

2. Sync filter state to URL query params (no page reload):
   After any filter change, call:
   function syncFiltersToURL() {
     const params = new URLSearchParams();
     if (state.filterType !== 'all') params.set('type', state.filterType);
     if (state.filterAgent !== 'all') params.set('agent', state.filterAgent);
     if (state.filterSort !== 'newest') params.set('sort', state.filterSort);
     if (state.searchQuery) params.set('q', state.searchQuery);
     if (state.currentPage !== 'explore') params.set('page', state.currentPage);
     const qs = params.toString();
     history.replaceState({}, '', qs ? '?' + qs : window.location.pathname);
   }
   
   On page load, read URL params and restore filter state before renderSkills().

3. Search debounce — already implemented, verify it is 300ms and clears state.page = 1.

4. Add a "Clear search" X button inside the search input that shows when searchQuery is not empty:
   Clicking it: state.searchQuery = '', $('#globalSearch').value = '', state.page=1, renderSkills()

5. Loading spinner for infinite scroll:
   Add below .skills-grid in index.html:
   <div class="scroll-loader" id="scrollLoader" style="display:none">
     <div class="scroll-spinner"></div>
   </div>
   Show during infinite scroll page fetch (not initial load), hide after.
   CSS: .scroll-loader { display:flex; justify-content:center; padding: 32px; }
        .scroll-spinner { width:24px; height:24px; border:2px solid var(--border); border-top-color: var(--indigo); border-radius:50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

6. End of results indicator:
   When has_more=false and page > 1: show a subtle "— end of results —" text below grid.
   Hide when loading new page filter.

7. Keyboard navigation:
   Escape: close any open modal
   Already implemented — verify it works for all 4 modals (auth, publish, skill detail, any new ones).
```

**✅ DONE WHEN:**
- [ ] Clicking any tag filters grid to that tag
- [ ] Active tag is highlighted in card
- [ ] Filter state persists in URL (shareable filtered links)
- [ ] Infinite scroll loads more cards on scroll to bottom
- [ ] Loading spinner shows during scroll-load
- [ ] "End of results" shows when no more items
- [ ] Clear search X button appears and clears search
- [ ] Escape key closes all modals

---

---

# PHASE 13 — Polish, Error States & Final Touches

**What this phase builds:**
Error states, empty states per page, form validation UX, responsive mobile fixes, document titles.

---

## Prompt:

```
Cognitorn Phase 13. Phases 0-12 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Final polish pass across the whole application.

1. apiFetch() error handling — update to show contextual toasts:
   catch block in apiFetch:
   - 401: state.currentUser=null, updateNavAuth(), showToast('Session expired — please sign in again', 'error')
   - 403: showToast('You don\'t have permission to do that', 'error')
   - 404: showToast('Not found', 'error')
   - 500: showToast('Server error — please try again', 'error')
   - Network error (fetch fails entirely): showToast('No connection', 'error')

2. Empty states per page — update #emptyState to be dynamic:
   function showEmptyState(page, tab='') {
     const configs = {
       explore: { icon:'◈', title:'No skills here yet', sub:'Be the first to publish', btn:'+ Publish Skill', action: ()=>openModal('publishModal') },
       explore_search: { icon:'⌕', title:'No skills match your search', sub:'Try different keywords or clear the search', btn:'Clear Search', action: clearSearch },
       mcp: { icon:'⚙️', title:'No MCP servers yet', sub:'Publish the first MCP server config', btn:'+ Publish MCP', action: ()=>openModal('publishModal') },
       marketplace: { icon:'🛒', title:'Marketplace is empty', sub:'List the first premium skill or template', btn:'+ List Item', action: ()=>openModal('publishModal') },
       trending: { icon:'🔥', title:'Nothing trending yet', sub:'Star skills to help them trend' },
       myskills_published: { icon:'🤖', title:'No skills published yet', sub:'Publish your first skill to get started', btn:'+ Publish Skill', action: ()=>openModal('publishModal') },
       myskills_collaborating: { icon:'◈', title:'Not collaborating anywhere', sub:'Get invited by a skill owner to collaborate' },
       myskills_installed: { icon:'⬇', title:'Nothing installed yet', sub:'Explore skills and install them', btn:'Explore Skills', action: ()=>navigateTo('explore') },
       myskills_purchased: { icon:'🛒', title:'No purchases yet', sub:'Browse the marketplace', btn:'Visit Marketplace', action: ()=>navigateTo('marketplace') },
     };
     const key = page === 'myskills' ? `myskills_${tab}` : (state.searchQuery ? `${page}_search` : page);
     const c = configs[key] || configs.explore;
     // Render into #emptyState with icon, title, sub, optional button
   }

3. Form validation UX in publish modal:
   - Name field: live char count display (e.g. "47/100") — red when over limit
   - Description: live char count (e.g. "120/500")
   - Tags: on comma input, parse and show tag pills below field. Show count "6/8 tags"
   - Content: line count in bottom-right corner of textarea
   - Version: validate semver pattern on blur (X.Y.Z) — show inline error if wrong format
   - Price: show "Free" label inline when 0, show "$X.XX" when > 0

4. Document title updates:
   Set document.title in navigateTo():
   explore    → 'Cognitorn — GitHub for AI Agent Skills'
   trending   → 'Trending — Cognitorn'
   mcp        → 'MCP Servers — Cognitorn'
   agents     → 'AI Agents — Cognitorn'
   marketplace→ 'Marketplace — Cognitorn'
   myskills   → 'My Skills — Cognitorn'
   
   In openSkillModal(): document.title = skill.name + ' — Cognitorn'
   In closeModal('skillModal'): restore previous page title

5. Mobile responsive fixes:
   Add to style.css @media (max-width: 768px):
   - Bottom nav bar instead of top nav links:
     .mobile-bottom-nav { display:flex; position:fixed; bottom:0; left:0; right:0; z-index:100;
       background: rgba(8,11,20,0.95); backdrop-filter:blur(20px);
       border-top: 1px solid var(--border); padding: 8px 0 env(safe-area-inset-bottom); }
     .mobile-nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
       padding: 6px; color:var(--text-3); font-size:10px; font-weight:500; cursor:pointer; }
     .mobile-nav-item.active { color:var(--indigo); }
     .mobile-nav-item .mni-icon { font-size:20px; }
   - main gets padding-bottom:80px on mobile
   - .publish-grid: single column
   - .skill-modal-tabs: overflow-x: auto, no wrap
   - .hero-title: font-size: 32px
   - .nav-search: display:none on mobile (use a search icon that expands it)

6. Confirm all modals close on Escape key and overlay click.

7. Add loading="lazy" to all img tags.

8. setup.php should also check PHP extension requirements and warn if any are missing:
   Check: extension_loaded('pdo'), extension_loaded('pdo_sqlite'), extension_loaded('sqlite3')
   If any missing: return {ok:false, error:'Missing PHP extension: ...'}
```

**✅ DONE WHEN:**
- [ ] Network errors show friendly toasts (not JS console errors)
- [ ] Every page/tab has a correct empty state with icon, text, and action button
- [ ] Publish form shows live char counts
- [ ] Tags show as pills as you type
- [ ] Document title changes on every page
- [ ] Skill modal title updates document title
- [ ] Mobile bottom nav bar shows on small screens
- [ ] All modals close on Escape and overlay click
- [ ] setup.php warns about missing PHP extensions

---

---

# PHASE 14 — Prisma Schema (Production-Ready)

**What this phase builds:**
`prisma/schema.prisma` for PostgreSQL migration. Migration notes. Final README update.

---

## Prompt:

```
Cognitorn Phase 14. All phases 0-13 complete.
Read IDEA.md, TECH.md, and PHASES.md for full context.

TASK: Create the Prisma schema and finalize project documentation.

1. Create prisma/schema.prisma with:
   - provider = "postgresql"
   - All models matching the SQLite schema exactly
   - Enums: SkillType (skill, mcp, agent, prompt, tool, marketplace), AgentType (claude, cursor, gpt, gemini, any), NotifType, ContribStatus
   - tags as String[] (PostgreSQL native array, not JSON string)
   - preview_images as String[] (same)
   - All foreign keys with onDelete: Cascade where SQLite schema has ON DELETE CASCADE
   - All @map() decorators for snake_case column names
   - All @@map() for table names
   - Proper @default(now()) for timestamps
   - @updatedAt for updated_at on Skill model

2. Create prisma/MIGRATION_NOTES.md:
   Step-by-step guide for migrating from SQLite to PostgreSQL:
   1. Install Node.js and run: npm init -y && npm install prisma @prisma/client
   2. Copy prisma/schema.prisma to your project
   3. Set DATABASE_URL in .env: postgresql://user:password@localhost:5432/cognitorn
   4. Run: npx prisma migrate dev --name init
   5. Data migration notes:
      - tags: stored as JSON string in SQLite, native array in PostgreSQL
        Migration script: UPDATE skills SET tags = array(SELECT json_array_elements_text(tags::json))
      - preview_images: same treatment
      - IDs: SQLite uses custom generateId(), Prisma uses cuid() — existing IDs are valid strings, no change needed
   6. Run: npx prisma generate
   7. Replace PHP backend with Node.js/Express or Next.js using @prisma/client
   8. Stripe integration point: add Payment model and webhook handler

3. Update README.md (final version):
   # Cognitorn
   GitHub for AI Agent Skills — Publish, fork, and collaborate on skills for Claude, Cursor, GPT, and more.

   ## Features
   - List custom AI agents for free to showcase to the community
   - Publish skills, MCP servers, AI agents, system prompts, and marketplace items
   - Star, fork, install, and contribute to listings
   - Collaborator system for team-owned skills
   - Marketplace with image/video previews and pricing
   - Notification system for social actions
   - Public user profiles

   ## Tech Stack
   - Frontend: HTML, CSS, Vanilla JavaScript
   - Backend: PHP 8.1+
   - Database: SQLite (Prisma/PostgreSQL-ready)

   ## Requirements
   - PHP 8.1+
   - Extensions: pdo, pdo_sqlite, sqlite3, gd, fileinfo

   ## Setup
   1. Clone / download the project
   2. Run: php -S localhost:8000
   3. Visit: http://localhost:8000/setup.php
   4. Visit: http://localhost:8000

   ## Demo Account
   - Username: demo
   - Password: demo123

   ## Production Migration
   See prisma/MIGRATION_NOTES.md for PostgreSQL migration guide.
```

**✅ DONE WHEN:**
- [ ] prisma/schema.prisma is valid Prisma schema (no syntax errors)
- [ ] All 9 tables are represented as Prisma models
- [ ] Enums are defined for all CHECK constraints
- [ ] prisma/MIGRATION_NOTES.md has clear step-by-step migration guide
- [ ] README.md is complete and accurate
- [ ] Running npx prisma validate on the schema passes (if Node.js available)
