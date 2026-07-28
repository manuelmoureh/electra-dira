/**
 * Sauti AI Counter-Narrative Generator Engine
 * Allows campaign leadership to simulate real-time AI counter-strategy generation across Kenyan dialects.
 */
(function() {
  console.log("🛡️ Sauti AI Counter-Narrative Engine Loaded");

  const STRATEGY_PRESETS = {
    "gachagua": {
      title: "Mt Kenya Regional Betrayal Narrative",
      dialects: {
        kikuyu: "“Ruto ti wakuuria muingi; nĩ we wathĩku na wĩra wa mawĩra ma coffee na barabara njerũ.” (Focus: Coffee payout metrics & infrastructure investment factsheet)",
        swahili: "Ukweli wa Maendeleo Mt Kenya: Barabara za KES 42B na Miradi ya Kahawa inayotekelezwa sasa.",
        sheng: "Wacha propaganda mob! Cheki mashinani ground gredi zinajengwa vibaya sana."
      },
      channels: ["Inooro FM", "Coro FM", "Kameme FM", "WhatsApp Broadcast Groups (Nyeri, Kiambu, Murang'a)"],
      action: "Deploy 120 Kikuyu-speaking I-Force PSAs to churches & coffee collection centers; push 90-sec audio clips to Inooro morning show."
    },
    "tax": {
      title: "Cost of Living & Finance Bill Narrative",
      dialects: {
        swahili: "Kilio cha Wananchi kimesikizwa: Mfuko wa Hustler KES 60B umewikia zaidi ya Wakenya Milioni 18 bila dhamana.",
        sheng: "Hustler Fund inakujia moja kwa moja kwa simu yako — zero collateral, zero middlemen.",
        luo: "Piny ni gi teko, koro mwandu ma Hustler Fund chopo ne joko mabor."
      },
      channels: ["Radio Citizen", "Milele FM", "TikTok Creator Network", "WhatsApp Groups"],
      action: "Launch Wasikie creator push featuring micro-entrepreneurs showcasing Hustler Fund success; SMS factsheets to persuadable voters."
    },
    "unity": {
      title: "ABC Coalition Unity Speculation",
      dialects: {
        kalenjin: "Taa kokwetab chogo bo Ruto; kerik kibagenge bo kokwet nyo po UDA ne toror.",
        kamba: "Kalonzo na Matiang'i maimanya utethyo wa mwaitu; Ruto niwakuia nthi yitu utethyo wa vata.",
        swahili: "Muungano wa Wapinzani hauna mwelekeo — Ruto ndiye kiongozi pekee aliye na mpango thabiti."
      },
      channels: ["Musyi FM", "Kass FM", "West FM", "Vernacular Radio Call-ins"],
      action: "Highlight internal opposition ticket rivalries on radio talk shows; formalize Western running-mate play with ANC/Ford-Kenya leaders."
    }
  };

  function renderSautiGenerator() {
    const threatsPage = document.getElementById('threats');
    if (!threatsPage) return;

    let labContainer = document.getElementById('sautiLab');
    if (!labContainer) {
      labContainer = document.createElement('div');
      labContainer.id = 'sautiLab';
      labContainer.className = 'card';
      labContainer.style.cssText = 'margin-bottom:22px;border:1px solid var(--chart);background:rgba(200,255,0,0.03);padding:20px;';
      
      threatsPage.insertBefore(labContainer, threatsPage.firstChild);
    }

    labContainer.innerHTML = `
      <div class="card-h">
        <div class="t" style="color:var(--chart);display:flex;align-items:center;gap:8px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          SAUTI AI COUNTER-NARRATIVE LABORATORY
        </div>
        <div class="meta" style="color:var(--pos)">Interactive Vernacular Counter-Tactics Engine</div>
      </div>
      <p style="font-size:12px;color:var(--muted2);margin-bottom:14px">
        Select an opposition threat or enter a custom narrative to watch Sauti generated multi-lingual counter-narratives, radio scripts, and ground actions in real time.
      </p>

      <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
        <button class="sauti-btn" data-key="gachagua" style="padding:8px 14px;background:#1d1d1f;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px;font-weight:600;cursor:pointer">
          🛡️ Mt Kenya Defection Rumor
        </button>
        <button class="sauti-btn" data-key="tax" style="padding:8px 14px;background:#1d1d1f;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px;font-weight:600;cursor:pointer">
          💸 Cost of Living / Tax Attack
        </button>
        <button class="sauti-btn" data-key="unity" style="padding:8px 14px;background:#1d1d1f;border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px;font-weight:600;cursor:pointer">
          🤝 Coalition Alliance Rumor
        </button>
      </div>

      <div id="sautiOutput" style="background:#0e0e0f;border:1px solid var(--border);border-radius:10px;padding:16px;display:none">
        <div id="sautiTitle" style="font-size:14px;font-weight:700;color:var(--chart);margin-bottom:10px"></div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div style="background:#141416;border:1px solid #242428;border-radius:8px;padding:12px">
            <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Kikuyu / Vernacular FM Script</div>
            <div id="sautiKikuyu" style="font-size:12px;color:var(--text);line-height:1.5"></div>
          </div>
          <div style="background:#141416;border:1px solid #242428;border-radius:8px;padding:12px">
            <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Sheng / WhatsApp Broadcast Draft</div>
            <div id="sautiSheng" style="font-size:12px;color:var(--text);line-height:1.5"></div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:14px">
          <div>
            <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Target FM Stations</div>
            <div id="sautiChannels" style="display:flex;gap:6px;flex-wrap:wrap"></div>
          </div>
          <div>
            <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:6px">Recommended I-Force Field Action</div>
            <div id="sautiAction" style="font-size:11.5px;color:var(--pos);font-weight:600"></div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    labContainer.querySelectorAll('.sauti-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const preset = STRATEGY_PRESETS[key];
        if (!preset) return;

        // Highlight active button
        labContainer.querySelectorAll('.sauti-btn').forEach(b => {
          b.style.background = '#1d1d1f';
          b.style.borderColor = 'var(--border)';
        });
        btn.style.background = 'rgba(200,255,0,0.15)';
        btn.style.borderColor = 'var(--chart)';

        // Populate output
        const output = document.getElementById('sautiOutput');
        output.style.display = 'block';
        document.getElementById('sautiTitle').textContent = `⚡ AI Counter-Tactics: ${preset.title}`;
        document.getElementById('sautiKikuyu').textContent = preset.dialects.kikuyu || preset.dialects.kalenjin;
        document.getElementById('sautiSheng').textContent = preset.dialects.sheng || preset.dialects.swahili;
        document.getElementById('sautiAction').textContent = preset.action;

        const chanEl = document.getElementById('sautiChannels');
        chanEl.innerHTML = preset.channels.map(ch => `<span class="tag" style="background:#1c1c20;color:var(--text);border-color:#333">${ch}</span>`).join('');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Initial check or hook onto threats page render
    setTimeout(renderSautiGenerator, 500);
  });

  window.renderSautiGenerator = renderSautiGenerator;
})();
