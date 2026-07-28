/**
 * Dira Live Data Connector
 * Connects all 9 Electra Modules to live data feeds and dynamic event listeners.
 */
(function() {
  console.log("⚡ Dira Live Connector Loaded (9-Module Engine)");

  async function loadLiveNews() {
    try {
      const res = await fetch('./news.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data.articles || !data.articles.length) return;

      const newsContainer = document.querySelector('.news');
      if (newsContainer) {
        let html = '';
        data.articles.slice(0, 6).forEach(item => {
          const badgeClass = item.sentiment === 'pos' ? 'nbadge-pos' : item.sentiment === 'neg' ? 'nbadge-neg' : 'nbadge-neu';
          const tagLabel = item.matched_keywords && item.matched_keywords[0] ? item.matched_keywords[0] : item.source;
          const pubStr = item.published || "2h ago";
          const sentimentText = item.sentiment === 'pos' ? 'Positive' : item.sentiment === 'neg' ? 'Negative' : 'Neutral';

          html += `
            <div class="ni">
              <span class="nbadge ${badgeClass}"></span>
              <div>
                <div class="nh"><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;font-weight:600">${item.headline}</a></div>
                <div class="nm2"><span class="tag">${tagLabel}</span>${pubStr} · ${sentimentText}</div>
              </div>
            </div>
          `;
        });
        newsContainer.innerHTML = html;
      }
    } catch (e) {
      console.warn("News connector notice:", e);
    }
  }

  async function loadLiveThreats() {
    try {
      const res = await fetch('./threats.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data.threats || !data.threats.length) return;

      // Overview page mini threat feed
      const miniFeed = document.querySelector('.tfeed');
      if (miniFeed) {
        let miniHtml = '';
        data.threats.slice(0, 3).forEach(t => {
          const sevClass = t.severity === 'high' ? 'high' : t.severity === 'med' ? 'med' : 'low';
          const sevText = t.severity === 'high' ? 'High' : t.severity === 'med' ? 'Med' : 'Low';
          miniHtml += `
            <div class="ti2">
              <span class="sev ${sevClass}">${sevText}</span>
              <div>
                <div class="tt">${t.title}</div>
                <div class="ts">${t.description.slice(0, 95)}...</div>
              </div>
            </div>
          `;
        });
        miniFeed.innerHTML = miniHtml;
      }

      // Sauti Shield page full threat cards
      const threatCards = document.getElementById('threatCards');
      if (threatCards) {
        let html = '';
        data.threats.forEach(t => {
          const sevClass = t.severity === 'high' ? 'high' : t.severity === 'med' ? 'med' : 'low';
          const impactedStr = t.impacted_counties ? t.impacted_counties.join(' · ') : 'National';
          html += `
            <div class="tcard ${sevClass}">
              <div class="tcard-h">
                <div class="tcard-t">${t.title}</div>
                <span class="sev ${sevClass}">${t.severity_label}</span>
              </div>
              <div class="tcard-d">${t.description}</div>
              <div class="tcard-resp">
                <div class="lbl">
                  <span style="width:5px;height:5px;border-radius:50%;background:#C8FF00;display:inline-block"></span>
                  AI-DRAFTED STRATEGIC RESPONSE
                </div>
                <div class="txt">${t.suggested_response}</div>
              </div>
              <div class="tcard-foot">
                <div class="tmetric"><div class="tk">Geographic Scope</div><div class="tv">${impactedStr}</div></div>
                <div class="tmetric"><div class="tk">Est. Reach</div><div class="tv" style="color:var(--chart)">${t.reach_estimate}</div></div>
                <div class="tmetric"><div class="tk">Velocity</div><div class="tv" style="color:var(--warn)">${t.velocity}</div></div>
              </div>
            </div>
          `;
        });
        threatCards.innerHTML = html;
      }
    } catch (e) {
      console.warn("Threats connector notice:", e);
    }
  }

  async function loadDiraTable() {
    try {
      const res = await fetch('./counties.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data.counties || !data.counties.length) return;

      const tbody = document.getElementById('diraTable') || document.querySelector('table tbody');
      if (tbody) {
        let html = '';
        data.counties.forEach(c => {
          const tierColor = c.tier === 'Deep Stronghold' ? 'var(--pos)' : c.tier === 'Battleground' ? 'var(--warn)' : c.tier === 'Swing' ? 'var(--teal)' : 'var(--neg)';
          html += `
            <tr style="cursor:pointer" title="Click to open Ward Intelligence Drilldown">
              <td>${c.name} <span style="font-size:10px;color:var(--muted);margin-left:4px">#${c.code}</span></td>
              <td>${c.voters.toLocaleString()}</td>
              <td class="cell-hi" style="color:${tierColor}">${c.uda_share}%</td>
              <td style="color:${c.swing.startsWith('+') ? 'var(--pos)' : 'var(--neg)'}">${c.swing}</td>
              <td><span style="font-size:10px;padding:3px 7px;border-radius:4px;border:1px solid var(--border);color:${tierColor}">${c.tier}</span></td>
              <td style="font-size:11px;color:var(--muted2)">${c.status}</td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
      }
    } catch (e) {
      console.warn("Dira table connector notice:", e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadLiveNews();
    loadLiveThreats();
    loadDiraTable();
  });
})();
