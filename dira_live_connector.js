/**
 * Dira Live Data Connector
 * Connects the Electra Dira UI to automated JSON feeds (news.json, threats.json, sentiment.json, counties.json)
 */
(function() {
  console.log("⚡ Dira Live Data Connector Initialized");

  // Format relative timestamp
  function timeAgo(dateString) {
    if (!dateString) return "just now";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (isNaN(seconds)) return dateString;
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  // Load and inject Live News
  async function loadLiveNews() {
    try {
      const res = await fetch('./news.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data.articles || !data.articles.length) return;

      const newsContainer = document.querySelector('.news') || document.querySelector('#newsFeed');
      if (newsContainer) {
        let html = '';
        data.articles.slice(0, 7).forEach(item => {
          const badgeClass = item.sentiment === 'pos' ? 'nbadge-pos' : item.sentiment === 'neg' ? 'nbadge-neg' : 'nbadge-neu';
          const kwBadge = item.matched_keywords && item.matched_keywords[0] ? `<span class="tag">${item.matched_keywords[0]}</span>` : '';
          html += `
            <div class="ni">
              <div class="nbadge ${badgeClass}"></div>
              <div>
                <div class="nh"><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;font-weight:600">${item.headline}</a></div>
                <div class="nm2">
                  <span>${item.source}</span> · 
                  <span>${timeAgo(item.published)}</span>
                  ${kwBadge}
                </div>
              </div>
            </div>
          `;
        });
        newsContainer.innerHTML = html;
        console.log(`✓ Loaded ${data.articles.length} live news items`);
      }
    } catch (e) {
      console.warn("Dira Live News fallback to default UI:", e);
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
          const threatContainer = document.querySelector('.threats') || document.querySelector('#threatRadar');
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
            console.log(`✓ Loaded ${tData.threats.length} live threats`);
          }
        }
      }

      if (resSent.ok) {
        const sData = await resSent.json();
        // Update sentiment score indicator if available
        const sentScoreEl = document.querySelector('.metric .mv[data-sentiment-score]');
        if (sentScoreEl && sData.national_sentiment_score) {
          sentScoreEl.textContent = `+${sData.national_sentiment_score}`;
        }
        // Update sync timestamp
        const livePill = document.querySelector('.live-pill');
        if (livePill && sData.last_updated_readable) {
          livePill.innerHTML = `<span class="dot"></span>Live · Synced ${sData.last_updated_readable}`;
        }
      }

    } catch (e) {
      console.warn("Dira Live Threats fallback to default UI:", e);
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
      if (tbody) {
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
        console.log(`✓ Loaded ${data.counties.length} counties in table`);
      }
    } catch (e) {
      console.warn("Dira Live Counties fallback to default UI:", e);
    }
  }

  // Run on DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    loadLiveNews();
    loadLiveThreatsAndSentiment();
    loadLiveCounties();

    // Auto-refresh every 5 minutes while dashboard open
    setInterval(() => {
      loadLiveNews();
      loadLiveThreatsAndSentiment();
      loadLiveCounties();
    }, 300000);
  });

})();
