# Cognitorn — Full Product Idea

## What Is Cognitorn?

Cognitorn is a marketplace and collaboration platform for AI agents, skills, prompts, tools, and MCP server configs that make AI agents smarter and more capable.

Developers and prompt engineers publish their work here. Others discover it, install it, fork it, improve it, or buy it. The community builds on each other's work — exactly like open source software, but for AI agent intelligence.

---

## The Problem It Solves

Right now if you make a great skill for Claude, a killer system prompt for GPT, or an MCP server that connects your agent to Notion — you share it in a Discord message or a random GitHub repo nobody finds. There is no dedicated place to publish, discover, version, collaborate on, or monetize AI agent skills. Cognitorn is that place.

---

## Who Uses It

- **Prompt engineers** who build powerful system prompts and want to share or sell them
- **Developers** who build MCP servers, tool configs, and custom AI agents
- **AI Agent Creators** who build standalone or specialized AI agents and want to list them for free for the community to discover and use
- **AI power users** who want to install the best skills or discover top AI agents without building from scratch
- **Teams** who want to collaborate on shared agent skills and agent configs together
- **Creators** who build beautiful animated websites, UI templates, or creative projects using AI and want to monetize them

---

## Core Concepts

### Listing Types
Every listing on Cognitorn is one of these types:
- **Skill** — a `.md` instruction file that changes how an AI agent behaves
- **MCP Server** — a config that connects an AI agent to an external service (Notion, GitHub, Slack, etc.)
- **AI Agent** — a complete AI agent setup, architecture, or pre-configured agent (system prompt + tools + skills bundle or repository reference). Anyone can list their AI agent for free.
- **System Prompt** — a full system prompt that defines an agent's personality and capabilities
- **Tool Config** — configuration files for agent tools and function calling setups
- **Marketplace Item** — a premium creative asset (animated website, UI template, prompt pack, etc.) that can be free or paid

### Pricing
Every listing is either:
- **Free** — anyone can install and use it immediately
- **Paid** — creator sets a price, buyers unlock the full content (payment integration comes later)

---

## Features

### Discovery & Browsing

**Explore Page**
The main landing page. Shows all listings in a grid. New visitors see a hero section with a tagline, platform stats (total skills, developers, installs), and the skills grid below. Logged-in users skip the hero and go straight to the grid.

**Trending Page**
Shows the most popular listings ranked by a combination of stars and installs over the past 7 days. Limited to top 12.

**MCP Servers Page**
Filtered view showing only MCP server listings. Useful for developers looking specifically for agent-to-service connectors.

**AI Agents Page**
Filtered view showcasing custom AI agents built by creators and developers. Anyone can list their AI agent here for free with setup instructions, capabilities, and repository links.

**Marketplace Page**
Dedicated page showing all paid and free marketplace items (premium prompts, animated sites, templates, creative assets). Each card shows a preview image or video thumbnail, price or "Free" badge, and creator info.

**My Skills Page**
Personal dashboard showing everything the logged-in user has published, collaborated on, or installed/purchased. Divided into tabs: Published, Collaborating, Installed, Purchased.

**Tag Pages**
Clicking any tag on a listing filters the entire grid to show only listings with that tag.

---

### Search & Filtering

**Global Search**
A search bar in the navbar (keyboard shortcut ⌘K) that searches across listing names, descriptions, and tags in real time as the user types.

**Type Filter**
Filter the grid by listing type: All, Skills, MCP Servers, AI Agents, System Prompts, Tool Configs, Marketplace.

**Agent Filter**
Filter by which AI agent the listing is compatible with: All Agents, Claude, Cursor, GPT, Gemini, Universal (works with any).

**Sort Options**
Sort the grid by: Newest, Most Starred, Most Installed, Most Forked.

---

### Listings

**Listing Card**
Each listing in the grid shows:
- An icon representing the compatible agent
- Type badge and agent badge
- Listing name
- Short description (2 lines max)
- Tags (up to 4 visible)
- Author avatar and username
- Star count, install count, fork count
- Version number
- Price badge if it is a paid marketplace item
- Preview thumbnail if it has one

**Listing Detail Modal**
Clicking a card opens a full detail view with:
- Name, description, badges, version, author
- Star, Fork, Install (or Buy) action buttons
- Share button that copies a deep link URL
- Four tabs: README, Raw Content, Version History, Contributors

**README Tab**
Renders the listing content as formatted text. Shows headings, code blocks, bullet lists. If the listing was forked, shows a banner crediting the original author.

**Raw Content Tab**
Shows the raw `.md` or config content in a code block with a Copy button.

**Version History Tab**
Shows all published versions from newest to oldest. Each entry shows the version number, release note, and time since published. Latest version is badged.

**Contributors Tab**
Shows the original author and all collaborators with their avatars and role badges.

---

### Marketplace Listings

**Creating a Marketplace Item**
When publishing, a creator can choose the Marketplace type and:
- Upload up to 3 preview images
- Paste a YouTube or Vimeo video URL for a video preview
- Set a price (in USD) or mark it as free
- Write a full description of what the buyer gets

**Marketplace Card**
Shows a preview image or video thumbnail as the card background, overlaid with the title, price badge, and creator info. Visually distinct from regular skill cards.

**Marketplace Detail Modal**
Shows a media gallery (images + video player for the URL). Full description. Price. A "Buy Now" button (placeholder — payment comes later). If free, an "Install Free" button that unlocks the content immediately.

**After Unlocking**
The raw content (prompt, code, file) is revealed and can be copied. The item appears in the user's Purchased tab.

---

### Publishing

**Publish Flow**
Logged-in users click the Publish button in the navbar. A modal opens with:
- Left side: metadata (name, description, agent compatibility, type, tags, version, price if marketplace)
- Right side: a code editor textarea for the skill/prompt/config content
- For marketplace items: media upload section (images, video URL)

**Validation**
- Name: required, max 100 characters
- Description: required, max 500 characters
- Content: required
- Tags: up to 8 tags, each max 30 characters
- Version: follows semver format (1.0.0)
- Price: must be a positive number or zero

**Character Counters**
Live character count shown below name and description fields while typing.

**Tag Preview**
As the user types tags separated by commas, they appear as visual pill previews below the input field.

---

### Versioning

**Publishing New Versions**
The owner of a listing can push an update by opening the listing, clicking "Publish Update", and providing:
- New version number (must be higher than current)
- Release note describing what changed
- Updated content

**Version History**
Every version is stored and visible in the Version History tab. Users always get the latest version when they install.

---

### Social & Collaboration

**Starring**
Any logged-in user can star a listing. Stars are a signal of quality and affect trending ranking. Star count is shown on every card and in the detail modal. Clicking star again unstars it.

**Forking**
Any logged-in user can fork a listing they did not author. Forking creates a copy of the listing under their own profile. The fork shows a credit banner linking back to the original. Fork count increments on the original.

**Installing**
Free listings can be installed by any logged-in user. Installing copies the raw content to their clipboard and adds it to their Installed tab. Install count increments.

**Contributing**
Any logged-in user can submit a contribution to someone else's listing — like a pull request. They write a title, description, and the proposed new content. The owner receives it and can accept or reject it. Accepting it creates a new version with the contributor credited.

**Accepting a Contribution**
The owner opens their listing, goes to the Contributors tab, sees pending contributions. They can preview the diff (old vs new content side by side), then accept or reject with a note.

**Collaborators**
The owner can invite specific users as collaborators by username. Collaborators can publish new versions of the listing. They appear in the Contributors tab with a Collaborator badge.

---

### User Profiles

**Public Profile Page**
Every user has a public profile at `/@username` showing:
- Avatar, username, join date
- Stats: total listings published, total stars received, total installs
- Grid of their published listings (public, not forked)

**My Skills Dashboard**
The logged-in user's personal space with four tabs:
- **Published** — listings they created
- **Collaborating** — listings they are a collaborator on
- **Installed** — free listings they have installed
- **Purchased** — paid marketplace items they have unlocked

---

### Authentication

**Registration**
Username, email, password. Username must be unique. Password minimum 6 characters. On register, user is logged in immediately.

**Login**
Username and password. Session persists across page refreshes.

**Logout**
Clears the session. User is returned to the Explore page as a guest.

**Guest Experience**
Guests can browse, search, filter, and view all listings. They cannot star, fork, install, buy, publish, or contribute. Any action that requires login opens the auth modal.

---

### Notifications (Basic)

When someone:
- Stars your listing
- Forks your listing
- Submits a contribution to your listing
- Accepts your contribution

You get a notification. Shown as a count badge on a bell icon in the navbar. Clicking opens a dropdown list of recent notifications. Each notification links to the relevant listing.

---

## Design & Feel

Dark, futuristic, developer-focused. Think a command center for AI agents. Deep space dark background, electric indigo and cyan accent colors, monospace font for code and skill content, clean grid layout. Skill cards have a subtle animated glow border on hover that makes them feel alive. The overall vibe is: this is where serious AI developers work.

---

## What Makes It Unique

1. The only platform dedicated specifically to AI agents, skills, prompts, and MCP servers — creating a complete ecosystem
2. Anyone can list their custom AI agents for free to showcase their work to the community
3. GitHub-style collaboration model applied to skills and agent configs for the first time
4. MCP server support built in as a first-class listing type
5. Marketplace for premium creative AI work (animated sites, prompt packs, templates) with media previews
6. Contribution flow (like PRs) so the community can improve each other's skills collaboratively
7. Works with all major agents — Claude, Cursor, GPT, Gemini — not locked to one ecosystem

---

## Future Ideas (Not In MVP)

- Real payment processing via Stripe
- Skill collections / bundles
- Agent-specific installation scripts (one-click install into Claude desktop config, Cursor rules, etc.)
- Skill testing sandbox — run a skill against a live agent and see the output
- Organization accounts for teams
- Skill analytics for creators — who installed, from which country, retention
- API for programmatic skill fetching (so agents can self-install skills)
- Mobile app
