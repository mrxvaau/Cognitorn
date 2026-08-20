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

-- Installs
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

-- Contributions
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
