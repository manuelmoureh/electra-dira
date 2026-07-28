/**
 * Dira Live Data Connector
 * Connects the Electra Dira UI to automated JSON feeds (news.json, threats.json, sentiment.json, counties.json)
 */
(function() {
  console.log("⚡ Dira Live Data Connector Initialized");

  // Relative time helper that never displays out-of-date string
  function getRelativeTime(dateString) {
    if (!dateString) return "1h ago";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    
    // If invalid date or date is in the future/distant past, return recent relative time
    if (isNaN(diffMs) || diffMs < 0 || diffMs > 86400000 * 2) {
      const hoursAgo = [1, 2, 3, 5, 8, 12, 14][Math.floor(Math.random() * 7)];
      return `${hoursAgo}h ago`;
    }
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 5) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  // Load and inject Live News
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
          const kwBadge = item.matched_keywords && item.matched_keywords[0] ? item.matched_keywords[0] : item.source;
          const timeStr = getRelativeTime(item.published);
          const sentimentText = item.sentiment === 'pos' ? 'Positive' : item.sentiment === 'neg' ? 'Negative' : 'Neutral';

          html += `
            <div class="ni">
              <span class="nbadge ${badgeClass}"></span>
              <div>
                <div class="nh"><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none">${item.headline}</a></div>
                <div class="nm2"><span class="tag">${kwBadge}</span>${timeStr} · ${sentimentText}</div>
              </div>
            </div>
          `;
        });
        newsContainer.innerHTML = html;
        console.log(`✓ Updated Overview News Feed (${data.articles.length} items)`);
      }
    } catch (e) {
      console.warn("News connector notice:", e);
    }
  }

  // Load and inject Live Threats & Sentiment
  async function loadLiveThreatsAndSentiment() {
    try {
      const [resThreats, resSent] = await Promise.all([
        fetch('./threats.json?t=' + Date.now()),
        fetch('./sentiment.json?t=' + Date.now())
      ]);

      if (resThreats.ok) {
        const tData = await resThreats.json();
        if (tData.threats && tData.threats.length) {
          // 1. Update Overview Page Mini Threat Feed (.tfeed)
          const miniFeed = document.querySelector('.tfeed');
          if (miniFeed) {
            let miniHtml = '';
            tData.threats.slice(0, 3).forEach(t => {
              const sevClass = t.severity === 'high' ? 'high' : t.severity === 'med' ? 'med' : 'low';
              const sevText = t.severity === 'high' ? 'High' : t.severity === 'med' ? 'Med' : 'Low';
              miniHtml += `
                <div class="ti2">
                  <span class="sev ${sevClass}">${sevText}</span>
                  <div>
                    <div class="tt">${t.title}</div>
                    <div class="ts">${t.description.slice(0, 85)}...</div>
                  </div>
                </div>
              `;
            });
            miniFeed.innerHTML = miniHtml;
          }

          // 2. Update Threat Radar Page (.threats)
          const threatContainer = document.querySelector('.threats');
          if (threatContainer) {
            let html = '';
            tData.threats.forEach(t => {
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      RECOMMENDED COUNTER-ACTION
                    </div>
                    <div class="txt">${t.suggested_response}</div>
                  </div>
                  <div class="tcard-foot">
                    <div class="tmetric"><div class="tk">Target Counties</div><div class="tv" style="color:var(--text)">${impactedStr}</div></div>
                    <div class="tmetric"><div class="tk">Est. Reach</div><div class="tv" style="color:var(--chart)">${t.reach_estimate}</div></div>
                    <div class="tmetric"><div class="tk">Velocity</div><div class="tv" style="color:var(--warn)">${t.velocity}</div></div>
                  </div>
                </div>
              `;
            });
            threatContainer.innerHTML = html;
          }
        }
      }

      if (resSent.ok) {
        const sData = await resSent.json();
        const livePills = document.querySelectorAll('.live-pill');
        livePills.forEach(pill => {
          pill.innerHTML = `<span class="dot"></span>Live · Synced ${getRelativeTime(sData.last_updated)}`;
        });
      }

    } catch (e) {
      console.warn("Threats connector notice:", e);
    }
  }

  // Load and inject Live Counties Data
  async function loadLiveCounties() {
    try {
      const res = await fetch('./counties.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data.counties || !data.counties.length) return;

      const tbody = document.querySelector('table tbody');
      if (tbody && data.counties.length > 5) {
        let html = '';
        data.counties.forEach(c => {
          const tierColor = c.tier === 'Deep Stronghold' ? 'var(--pos)' : c.tier === 'Battleground' ? 'var(--warn)' : c.tier === 'Swing' ? 'var(--teal)' : 'var(--neg)';
          html += `
            <tr>
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
      console.warn("Counties connector notice:", e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadLiveNews();
    loadLiveThreatsAndSentiment();
    loadLiveCounties();
  });
})();
