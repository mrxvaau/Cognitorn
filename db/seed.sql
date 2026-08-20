-- SEED USERS
INSERT INTO users (id, username, email, password_hash, avatar, created_at) VALUES
('u1', 'demo', 'demo@dev.io', '$2y$12$SeVzlcaoCDsSSmxRAvnqKupwAgumLaJjE12pLULmRi25XCegNd1mS', 'DM', 1700000000),
('u2', 'voidpilot', 'vp@dev.io', '$2y$12$ZLxY.G3rwzIiTRd37TDTG.PpAUzKK/SXqBw/2HU0OWwblSssfJwrm', 'VP', 1700000000),
('u3', 'nx_orb', 'orb@dev.io', '$2y$12$ZLxY.G3rwzIiTRd37TDTG.PpAUzKK/SXqBw/2HU0OWwblSssfJwrm', 'NX', 1700000000),
('u4', 'synthwave', 'sw@dev.io', '$2y$12$ZLxY.G3rwzIiTRd37TDTG.PpAUzKK/SXqBw/2HU0OWwblSssfJwrm', 'SW', 1700000000),
('u5', 'koderift', 'kr@dev.io', '$2y$12$ZLxY.G3rwzIiTRd37TDTG.PpAUzKK/SXqBw/2HU0OWwblSssfJwrm', 'KR', 1700000000);

-- SEED SKILLS
INSERT INTO skills (id, author_id, name, description, content, type, agent, tags, version, price, is_free, stars_count, installs_count, forks_count, created_at, updated_at) VALUES
('s1', 'u2', 'Deep Research Analyst', 'Transforms any Claude instance into a thorough research assistant. Follows citations, cross-references sources, produces structured reports with confidence scores.', '---
name: deep-research-analyst
description: Full research pipeline for Claude
version: 2.1.0
agent: claude
---

# Deep Research Analyst

## Role
You are a meticulous research analyst. When asked to research any topic, follow this pipeline:

## Pipeline
1. **Decompose** the question into 3-5 sub-questions
2. **Search** each sub-question independently
3. **Cross-reference** conflicting information
4. **Score confidence** (High/Medium/Low) for each finding
5. **Synthesize** into a structured report', 'skill', 'claude', '["research","analysis","reports","citations"]', '2.1.0', 0, 1, 247, 1893, 34, 1700000000, 1700000000),

('s2', 'u3', 'Git Commit Poet', 'Forces your agent to write meaningful, conventional commit messages. Analyzes diffs, categorizes changes, and writes commits that actually explain the "why".', '---
name: git-commit-poet
description: Conventional commit message writer
version: 1.2.0
agent: cursor
---

# Git Commit Poet

## Purpose
Write commit messages that future-you will actually understand.

## Convention
Always use: `type(scope): description`', 'skill', 'cursor', '["git","commits","dx","workflow"]', '1.2.0', 0, 1, 189, 2341, 22, 1700000000, 1700000000),

('s3', 'u4', 'Notion MCP Bridge', 'MCP server that connects your AI agent to Notion workspaces. Read pages, create databases, update properties, and query blocks — all from your agent.', '---
name: notion-mcp-bridge
description: Notion API MCP server
version: 1.0.0
agent: any
type: mcp
---

# Notion MCP Bridge

## Setup
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@cognitorn/notion-mcp"]
    }
  }
}
```', 'mcp', 'any', '["notion","productivity","database","api"]', '1.0.0', 0, 1, 312, 987, 18, 1700000000, 1700000000),

('s4', 'u5', 'Code Review Sensei', 'Performs structured code reviews covering security, performance, readability, and architecture. Outputs prioritized findings with fix suggestions.', '---
name: code-review-sensei
description: Structured code review pipeline
version: 3.0.0
agent: claude
---

# Code Review Sensei

## Review Dimensions
Analyze code across 5 dimensions: Security, Correctness, Performance, Readability, Architecture.', 'skill', 'claude', '["code-review","security","quality","dx"]', '3.0.0', 0, 1, 418, 3201, 67, 1700000000, 1700000000),

('s5', 'u1', 'SQL Query Optimizer', 'Analyzes slow SQL queries and rewrites them. Explains why the rewrite is faster, adds indexes suggestions, and formats output for any DB dialect.', '---
name: sql-query-optimizer
description: SQL analysis and rewrite skill
version: 1.1.0
agent: any
---

# SQL Query Optimizer

Rewrite slow queries with optimization explanations and suggested indexes.', 'skill', 'any', '["sql","database","performance","optimization"]', '1.1.0', 0, 1, 156, 1102, 12, 1700000000, 1700000000),

('s6', 'u2', 'GitHub MCP Connector', 'MCP server to manage GitHub from your agent. Create issues, review PRs, fetch repo data, manage branches and more without leaving your editor.', '---
name: github-mcp-connector
type: mcp
agent: any
version: 2.0.0
---

# GitHub MCP Connector

Connect your AI agent to GitHub repository tools.', 'mcp', 'any', '["github","git","devops","automation"]', '2.0.0', 0, 1, 523, 4412, 89, 1700000000, 1700000000),

('s7', 'u3', 'Rubber Duck Debugger', 'Forces structured debugging. Walk through your code like you are explaining it to someone — the agent asks exactly the right questions to find your bug.', '---
name: rubber-duck-debugger
version: 1.0.0
agent: claude
---

# Rubber Duck Debugger

Patient debugging partner that asks step-by-step questions.', 'skill', 'claude', '["debugging","learning","teaching","dx"]', '1.0.0', 0, 1, 203, 1567, 28, 1700000000, 1700000000),

('s8', 'u4', 'API Doc Generator', 'Takes your route handlers or function signatures and generates complete OpenAPI 3.0 documentation. Covers parameters, responses, examples, and error codes.', '---
name: api-doc-generator
version: 1.3.0
agent: cursor
---

# API Doc Generator

Generate complete OpenAPI 3.0 documentation from code.', 'skill', 'cursor', '["api","documentation","openapi","backend"]', '1.3.0', 0, 1, 134, 876, 9, 1700000000, 1700000000),

('s9', 'u1', 'AutoCoder Prime Agent', 'Autonomous AI coding agent capable of analyzing repositories, planning architectural changes, writing clean code, and executing tests automatically.', '---
name: autocoder-prime-agent
type: agent
agent: any
version: 1.0.0
---

# AutoCoder Prime Agent

Full-stack autonomous AI agent that handles development tasks end-to-end.', 'agent', 'any', '["agent","coding","autonomous","automation"]', '1.0.0', 0, 1, 482, 2310, 74, 1700000000, 1700000000);

-- SEED SKILL VERSIONS
INSERT INTO skill_versions (id, skill_id, version, note, content, created_at) VALUES
('v1_1', 's1', '1.0.0', 'Initial release', 'Initial version of Deep Research Analyst', 1700000000),
('v1_2', 's1', '2.1.0', 'Fixed citation handling', 'Updated Deep Research Analyst instructions', 1700000000),
('v2_1', 's2', '1.0.0', 'Initial release', 'Initial version of Git Commit Poet', 1700000000),
('v3_1', 's3', '1.0.0', 'Initial release with 5 tools', 'Initial Notion MCP Bridge config', 1700000000),
('v4_1', 's4', '1.0.0', 'Initial release', 'Initial version of Code Review Sensei', 1700000000),
('v5_1', 's5', '1.0.0', 'Initial release', 'Initial version of SQL Query Optimizer', 1700000000),
('v6_1', 's6', '1.0.0', 'Initial release', 'Initial GitHub MCP connector', 1700000000),
('v7_1', 's7', '1.0.0', 'Initial release', 'Initial Rubber Duck Debugger', 1700000000),
('v8_1', 's8', '1.0.0', 'Initial release', 'Initial API Doc Generator', 1700000000),
('v9_1', 's9', '1.0.0', 'Initial release of AutoCoder Prime Agent', 'Initial AutoCoder Prime Agent', 1700000000);

-- SEED COLLABORATORS
INSERT INTO collaborators (user_id, skill_id, invited_by, created_at) VALUES
('u3', 's1', 'u2', 1700000000),
('u2', 's4', 'u5', 1700000000),
('u3', 's6', 'u2', 1700000000);
