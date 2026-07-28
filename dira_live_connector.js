/**
 * Dira Live Data Connector
 * Enhances Electra Dira UI with live polling, threat radar, and political intelligence feeds.
 */
(function() {
  console.log("⚡ Dira Live Data Connector Initialized");

  // Update Overview Subtitle to reflect combined baseline (TIFA + Infotrak)
  function updateOverviewBaseline() {
    const pageSub = document.getElementById('pageSub');
    if (pageSub && (pageSub.textContent.includes('TIFA') || pageSub.textContent.includes('National picture'))) {
      pageSub.textContent = 'National picture · Combined TIFA May 2026 (24%) & Infotrak July 2026 (32%) baseline · live monitoring';
    }
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
          const tagLabel = item.matched_keywords && item.matched_keywords[0] ? item.matched_keywords[0] : item.source;
          const pubStr = item.published || "Recent";
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
          // Mini Feed on Overview
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
                    <div class="ts">${t.description.slice(0, 95)}...</div>
                  </div>
                </div>
              `;
            });
            miniFeed.innerHTML = miniHtml;
          }

          // Full Threats Page
          const threatCards = document.getElementById('threatCards') || document.querySelector('.threats');
          if (threatCards) {
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
        }
      }

      if (resSent.ok) {
        const sData = await resSent.json();
        const livePill = document.querySelector('.live-pill');
        if (livePill) {
          livePill.innerHTML = `<span class="dot"></span>Live monitoring · Synced Today`;
        }
      }
    } catch (e) {
      console.warn("Threats connector notice:", e);
    }
  }

  // Run on DOM Loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateOverviewBaseline();
    loadLiveNews();
    loadLiveThreatsAndSentiment();
  });
})();
