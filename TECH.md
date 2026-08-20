# Cognitorn — Technical Specification

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (no frameworks) |
| Backend | PHP 8.1+ (no frameworks — pure PHP) |
| Database | SQLite via PHP PDO |
| Future DB | PostgreSQL via Prisma (schema included in Phase 10) |
| File storage | Local filesystem (uploads/ folder) for images |
| Sessions | PHP native sessions |
| Password hashing | PHP password_hash() / password_verify() with BCRYPT |

No npm. No composer. No build tools. Pure files served by PHP built-in server or Apache/Nginx.

---

## File Structure (Final)

```
cognitorn/
├── index.html
├── style.css
├── app.js
├── setup.php                    ← One-time setup: creates DB + seeds data
├── README.md
│
├── api/
│   ├── auth.php                 ← login, register, logout, me
│   ├── skills.php               ← list, get, create, update, delete, stats
│   ├── stars.php                ← toggle star
│   ├── forks.php                ← fork a listing
│   ├── installs.php             ← install / unlock
│   ├── contributions.php        ← submit, list, accept, reject
│   ├── collaborators.php        ← invite, remove
│   ├── users.php                ← profile, my_skills
│   ├── notifications.php        ← list, mark_read
│   └── uploads.php              ← image upload handler
│
├── db/
│   ├── schema.sql
│   ├── seed.sql
│   ├── connect.php              ← PDO singleton + auto-runs schema on first connect
│   └── cognitorn.db            ← auto-created by connect.php
│
├── middleware/
│   └── auth_check.php           ← session guard — sets $current_user_id or returns 401
│
├── uploads/
│   └── .gitkeep                 ← marketplace preview images stored here
│
└── prisma/
    ├── schema.prisma
    └── MIGRATION_NOTES.md
```

---

## Database Schema (SQLite)

```sql
-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Skills / Listings
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK(type IN ('skill','mcp','agent','prompt','tool','marketplace')),
  agent TEXT NOT NULL CHECK(agent IN ('claude','cursor','gpt','gemini','any')),
  tags TEXT NOT NULL DEFAULT '[]',
  version TEXT NOT NULL DEFAULT '1.0.0',
  price REAL NOT NULL DEFAULT 0,
  is_free INTEGER NOT NULL DEFAULT 1,
  preview_images TEXT NOT NULL DEFAULT '[]',
  preview_video TEXT NOT NULL DEFAULT '',
  stars_count INTEGER DEFAULT 0,
  installs_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  forked_from TEXT REFERENCES skills(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Skill Versions
CREATE TABLE IF NOT EXISTS skill_versions (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  note TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Stars
CREATE TABLE IF NOT EXISTS stars (
  user_id TEXT NOT NULL REFERENCES users(id),
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id)
);

-- Installs (free) and Purchases (paid) — unified table
CREATE TABLE IF NOT EXISTS installs (
  user_id TEXT NOT NULL REFERENCES users(id),
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  is_purchase INTEGER NOT NULL DEFAULT 0,
  installed_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id)
);

-- Forks
CREATE TABLE IF NOT EXISTS forks (
  user_id TEXT NOT NULL REFERENCES users(id),
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id)
);

-- Collaborators
CREATE TABLE IF NOT EXISTS collaborators (
  user_id TEXT NOT NULL REFERENCES users(id),
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, skill_id)
);

-- Contributions (like pull requests)
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposed_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected')),
  review_note TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK(type IN ('star','fork','contribution_received','contribution_accepted','contribution_rejected','collaborator_invite')),
  from_user_id TEXT NOT NULL REFERENCES users(id),
  skill_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  contribution_id TEXT REFERENCES contributions(id) ON DELETE CASCADE,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

---

## API Contract

All endpoints return `Content-Type: application/json`.
All POST bodies sent as JSON (`Content-Type: application/json`).
Auth state via PHP sessions (cookie-based).
All protected endpoints include `middleware/auth_check.php` which sets `$current_user_id`.

---

### api/auth.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| login | POST | No | `{username, password}` | `{user}` or `{error}` |
| register | POST | No | `{username, email, password}` | `{user}` or `{error}` |
| logout | POST | No | — | `{ok: true}` |
| me | GET | No | — | `{user}` or `{error: "Not authenticated"}` |

---

### api/skills.php

| Action | Method | Auth | Input/Params | Output |
|--------|--------|------|-------------|--------|
| list | GET | No | `?type=&agent=&sort=&q=&page=&page_num=&per_page=` | `{skills, total, has_more}` |
| get | GET | No | `?id=` | `{skill}` |
| stats | GET | No | — | `{skills_count, users_count, total_installs}` |
| create | POST | Yes | `{name, description, content, type, agent, tags, version, price, is_free, preview_video}` | `{skill}` |
| update_version | POST | Yes | `{id, version, note, content}` | `{skill}` |
| delete | POST | Yes | `{id}` | `{ok: true}` |

**list query params:**
- `type` — skill / mcp / agent / prompt / tool / marketplace / all (default: all)
- `agent` — claude / cursor / gpt / gemini / any / all (default: all). When agent filter is set, returns agent=X OR agent=any
- `sort` — newest / stars / installs / forks (default: newest)
- `q` — search string across name, description, tags
- `page` — explore / trending / mcp / marketplace / myskills (affects filtering logic)
- `page_num` — integer, default 1 (for pagination)
- `per_page` — integer, default 24, max 48

---

### api/stars.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| toggle | POST | Yes | `{skill_id}` | `{starred: bool, count: int}` |

---

### api/forks.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| fork | POST | Yes | `{skill_id}` | `{skill}` or `{error}` |

---

### api/installs.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| install | POST | Yes | `{skill_id}` | `{ok: bool, already_installed: bool, is_purchase: bool}` |

Paid items: install endpoint records as is_purchase=1. Content still returned (no real payment).

---

### api/contributions.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| submit | POST | Yes | `{skill_id, title, description, proposed_content}` | `{contribution}` |
| list | GET | No | `?skill_id=` | `{contributions: [...]}` |
| list_pending | GET | Yes | `?skill_id=` (must own skill) | `{contributions: [...]}` |
| accept | POST | Yes | `{contribution_id, version, note}` | `{skill}` |
| reject | POST | Yes | `{contribution_id, note}` | `{ok: true}` |

---

### api/collaborators.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| invite | POST | Yes | `{skill_id, username}` | `{ok: true}` or `{error}` |
| remove | POST | Yes | `{skill_id, user_id}` | `{ok: true}` |
| list | GET | No | `?skill_id=` | `{collaborators: [...]}` |

---

### api/users.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| profile | GET | No | `?username=` | `{user, skills, stats}` |
| my_skills | GET | Yes | `?tab=published/collaborating/installed/purchased` | `{skills: [...]}` |

---

### api/notifications.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| list | GET | Yes | — | `{notifications: [...], unread_count: int}` |
| mark_read | POST | Yes | `{id}` or `{all: true}` | `{ok: true}` |

---

### api/uploads.php

| Action | Method | Auth | Input | Output |
|--------|--------|------|-------|--------|
| image | POST | Yes | multipart form: `file` | `{url: "/uploads/filename.jpg"}` |

Max file size: 5MB. Allowed types: jpg, png, gif, webp.
Saves to `/uploads/` with a unique filename.

---

## Skill / Listing Object Shape (JSON)

```json
{
  "id": "s_abc123",
  "author_id": "u_xyz",
  "author": {
    "id": "u_xyz",
    "username": "voidpilot",
    "avatar": "VP"
  },
  "name": "Deep Research Analyst",
  "description": "Transforms any Claude instance into a thorough research assistant.",
  "content": "---\nname: deep-research-analyst\n---\n\n# Instructions...",
  "type": "skill",
  "agent": "claude",
  "tags": ["research", "analysis", "reports", "citations"],
  "version": "2.1.0",
  "price": 0,
  "is_free": true,
  "preview_images": [],
  "preview_video": "",
  "stars_count": 247,
  "installs_count": 1893,
  "forks_count": 34,
  "forked_from": null,
  "collaborators": [
    { "id": "u_abc", "username": "nx_orb", "avatar": "NX" }
  ],
  "versions": [
    { "id": "v_1", "version": "1.0.0", "note": "Initial release", "created_at": 1700000000 },
    { "id": "v_2", "version": "2.1.0", "note": "Fixed citation handling", "created_at": 1710000000 }
  ],
  "pending_contributions": 2,
  "is_starred": false,
  "is_installed": false,
  "is_purchased": false,
  "created_at": 1700000000,
  "updated_at": 1710000000
}
```

---

## Notification Object Shape

```json
{
  "id": "n_abc",
  "type": "star",
  "from_user": { "id": "u_xyz", "username": "voidpilot", "avatar": "VP" },
  "skill": { "id": "s_abc", "name": "Deep Research Analyst" },
  "is_read": false,
  "created_at": 1710000000,
  "message": "voidpilot starred your skill Deep Research Analyst"
}
```

---

## Contribution Object Shape

```json
{
  "id": "c_abc",
  "skill_id": "s_abc",
  "author": { "id": "u_xyz", "username": "voidpilot", "avatar": "VP" },
  "title": "Add examples section",
  "description": "Added 3 real-world examples to the README",
  "proposed_content": "---\nname: ...\n---\n\n# Updated content...",
  "status": "pending",
  "review_note": "",
  "created_at": 1710000000,
  "reviewed_at": null
}
```

---

## Frontend State Object

```javascript
const state = {
  currentPage: 'explore',       // explore | trending | mcp | marketplace | myskills
  currentUser: null,            // user object or null
  filterType: 'all',
  filterAgent: 'all',
  filterSort: 'newest',
  searchQuery: '',
  page: 1,                      // current pagination page
  hasMore: false,               // for infinite scroll
  loading: false,               // prevents double fetches
  viewingSkill: null,           // currently open skill in modal
  mySkillsTab: 'published',     // published | collaborating | installed | purchased
  notifications: [],
  unreadCount: 0,
};
```

---

## Helper Functions Required in PHP

### `buildSkillResponse($row, $db, $current_user_id = null)`
Shared helper — defined in `db/connect.php` or `api/skills.php` and required by other API files.

Takes a raw DB row and returns the full skill object as an array:
- Decodes `tags` from JSON string to array
- Fetches `author` from users table
- Fetches `collaborators` (join collaborators + users tables)
- Fetches `versions` from skill_versions ordered by created_at ASC
- If `$current_user_id` provided: checks `is_starred`, `is_installed`, `is_purchased`
- Counts `pending_contributions` from contributions table where status='pending'
- Casts `is_free` to bool, `price` to float
- Decodes `preview_images` from JSON string to array

### `generateId($prefix)`
Returns `$prefix . '_' . bin2hex(random_bytes(8))` — unique ID generator.

### `jsonResponse($data, $status = 200)`
Sets Content-Type header, http_response_code, echoes json_encode($data), exits.

### `jsonError($message, $status = 400)`
Calls `jsonResponse(['error' => $message], $status)`.

---

## Seed Data

5 users, 8 skills (see IDEA.md for the skill list). Demo account: `demo` / `demo123`.

Password for `demo`: bcrypt hash of `demo123`
Password for all others: bcrypt hash of `pass`

All seed skills are type=skill or type=mcp, is_free=1, price=0.
At least 2 skills have collaborators.
Each skill has 1-4 version history entries.

---

## Environment

**Development:**
```bash
php -S localhost:8000
```
Visit `http://localhost:8000/setup.php` once to initialize DB and seed data.

**PHP requirements:**
- PHP 8.1+
- SQLite3 extension enabled
- PDO extension enabled
- PDO_SQLite driver enabled
- GD extension (for image uploads)
- fileinfo extension (for MIME type checking)

**Headers every API file must set:**
```php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
session_start();
```

---

## Prisma Schema Location

`prisma/schema.prisma` — mirrors the SQLite schema exactly but uses PostgreSQL types:
- `TEXT[]` for tags instead of JSON string
- `@default(cuid())` for IDs instead of custom generator
- Proper `enum` types for skill type (skill, mcp, agent, prompt, tool, marketplace) and agent
- All `ON DELETE CASCADE` relationships preserved as `onDelete: Cascade`

Switch from SQLite to PostgreSQL: change `provider = "sqlite"` to `provider = "postgresql"` in datasource block and run `npx prisma migrate dev`.
