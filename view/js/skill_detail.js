// ========================
// SKILL DETAIL MODAL & TAB RENDERER
// ========================

let currentViewingSkill = null;

function timeAgo(ts) {
  const s = Math.floor((Date.now() - (ts * 1000)) / 1000);
  if (s < 60) return `${Math.max(1, s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function formatNum(n) {
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return String(n);
}

function openSkillDetail(skill) {
  currentViewingSkill = skill;
  const modal = document.getElementById('skillModal');
  if (!modal) return;

  // Set form action skill IDs
  document.getElementById('starSkillId').value = skill.id;
  document.getElementById('forkSkillId').value = skill.id;
  document.getElementById('installSkillId').value = skill.id;

  // Update action buttons text/state
  const starBtn = document.getElementById('skillStarBtn');
  if (starBtn) starBtn.textContent = skill.is_starred ? '★ Unstar' : '☆ Star';

  document.getElementById('skillModalBadges').innerHTML = `
    <span class="badge badge-type-${skill.type}">${skill.type}</span>
    <span class="badge badge-agent">${skill.agent}</span>
    <span class="card-version">v${skill.version}</span>
  `;
  document.getElementById('skillModalName').textContent = skill.name;
  document.getElementById('skillModalDesc').textContent = skill.description;
  document.getElementById('skillModalAuthor').innerHTML = `
    <div class="author-avatar">${skill.author ? skill.author.avatar : '??'}</div>
    <span class="author-name" style="color:var(--text-2)">${skill.author ? skill.author.username : 'unknown'}</span>
    <span style="color:var(--text-3);font-size:12px">· published ${timeAgo(skill.created_at)}</span>
    <span style="color:var(--text-3);font-size:12px;margin-left:12px">☆ ${formatNum(skill.stars)}</span>
    <span style="color:var(--text-3);font-size:12px;margin-left:8px">⬇ ${formatNum(skill.installs)}</span>
  `;

  renderSkillTab('readme');

  // Tab switching
  document.querySelectorAll('.stab').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkillTab(btn.dataset.stab);
    };
  });

  modal.classList.add('open');
}

function renderSkillTab(tab) {
  if (!currentViewingSkill) return;
  const skill = currentViewingSkill;
  const content = document.getElementById('skillModalContent');
  if (!content) return;

  if (tab === 'readme') {
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
          <span class="version-num">v${v.version}</span>
          <span style="color:var(--text-2)">${v.note}</span>
          ${i===0 ? '<span class="version-latest">latest</span>' : ''}
          <span class="version-date">${timeAgo(v.created_at)}</span>
        </div>
      `).join('')
    }</div>`;
  }

  if (tab === 'contributors') {
    const author = skill.author;
    const collabs = skill.collaborators || [];

    content.innerHTML = `<div class="contributors-list">
      <div class="contributor-item">
        <div class="author-avatar" style="width:36px;height:36px;font-size:13px">${author ? author.avatar : '??'}</div>
        <div>
          <div style="font-weight:600;font-size:14px">${author ? author.username : 'unknown'}</div>
          <div style="font-size:12px;color:var(--text-3)">Author</div>
        </div>
        <span class="contributor-role">Author</span>
      </div>
      ${collabs.map(c => `
        <div class="contributor-item">
          <div class="author-avatar" style="width:36px;height:36px;font-size:13px">${c.avatar}</div>
          <div>
            <div style="font-weight:600;font-size:14px">${c.username}</div>
            <div style="font-size:12px;color:var(--text-3)">Collaborator</div>
          </div>
          <span class="contributor-role">Collaborator</span>
        </div>
      `).join('')}
    </div>`;
  }
}

// Bind skill cards click listener
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => {
      const data = card.dataset.skill;
      if (data) {
        try {
          const skill = JSON.parse(data);
          openSkillDetail(skill);
        } catch (e) {}
      }
    });
  });
});
