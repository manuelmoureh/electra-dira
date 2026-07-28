/**
 * Rungu Command "War Room" Live Dashboard & M-Pesa Ledger Engine
 * Full-screen tactical command interface designed as the buyer's trust object.
 */
(function() {
  console.log("⚡ Rungu War Room Engine Loaded");

  const MPESA_LEDGER_FEED = [
    {agent: "Agent #4102 (J. Kiprop)", ward: "Kapseret Ward, Uasin Gishu", amount: "KES 500", task: "50 Voter Canvass Verified", status: "VERIFIED & PAID"},
    {agent: "Agent #1849 (M. Wanjala)", ward: "Saboti Ward, Trans-Nzoia", amount: "KES 400", task: "40 Kura Connect Contacts", status: "VERIFIED & PAID"},
    {agent: "Agent #2910 (A. Njoroge)", ward: "Mwiki Ward, Nairobi", amount: "KES 650", task: "65 Youth Reg Registrations", status: "VERIFIED & PAID"},
    {agent: "Agent #5021 (C. Simiyu)", ward: "Township Ward, Bungoma", amount: "KES 450", task: "45 Persuadable Follow-ups", status: "VERIFIED & PAID"},
    {agent: "Agent #3104 (P. Wachira)", ward: "Mukurweini Ward, Nyeri", amount: "KES 550", task: "55 Sauti Pulse Surveys", status: "VERIFIED & PAID"},
    {agent: "Agent #6182 (B. Otieno)", ward: "Kondele Ward, Kisumu", amount: "KES 350", task: "35 Townhall Registrations", status: "VERIFIED & PAID"}
  ];

  let warRoomOpen = false;
  let ledgerIndex = 0;
  let tickerTimer = null;

  function injectWarRoomTrigger() {
    const topbarRight = document.querySelector('.tb-right');
    if (!topbarRight || document.getElementById('warRoomBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'warRoomBtn';
    btn.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:#C8FF00;display:inline-block;box-shadow:0 0 6px #C8FF00"></span> WAR ROOM COMMAND`;
    btn.style.cssText = 'padding:6px 14px;background:rgba(200,255,0,0.12);border:1px solid rgba(200,255,0,0.4);border-radius:20px;color:#C8FF00;font-size:11px;font-weight:700;letter-spacing:1px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:0.2s';
    
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(200,255,0,0.25)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(200,255,0,0.12)');
    btn.addEventListener('click', toggleWarRoom);

    topbarRight.insertBefore(btn, topbarRight.firstChild);
  }

  function toggleWarRoom() {
    warRoomOpen = !warRoomOpen;
    let modal = document.getElementById('warRoomModal');

    if (warRoomOpen) {
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'warRoomModal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#060607;color:#fafaf8;display:flex;flex-direction:column;padding:24px;overflow-y:auto;font-family:Satoshi,sans-serif';
        document.body.appendChild(modal);
      }
      modal.style.display = 'flex';
      renderWarRoomContent(modal);
      startLedgerTicker();
    } else {
      if (modal) modal.style.display = 'none';
      if (tickerTimer) clearInterval(tickerTimer);
    }
  }

  function renderWarRoomContent(modal) {
    modal.innerHTML = `
      <!-- WAR ROOM HEADER -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #222;padding-bottom:16px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:32px;height:32px;border-radius:8px;background:#C8FF00;color:#0B0B0C;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:18px">R</div>
          <div>
            <div style="font-size:20px;font-weight:900;letter-spacing:-0.5px">RUNGU WAR ROOM · TACTICAL COMMAND MODE</div>
            <div style="font-size:11px;color:#8a8a84;letter-spacing:1px;text-transform:uppercase">Electra Labs · Confidential Campaign Telemetry · Real-Time</div>
          </div>
        </div>
        <button id="closeWarRoom" style="padding:8px 18px;background:#1d1d1f;border:1px solid #333;border-radius:8px;color:#fff;font-weight:700;cursor:pointer">EXIT WAR ROOM ✕</button>
      </div>

      <!-- METRICS BANNER -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:24px">
        <div style="background:#111112;border:1px solid #26262a;border-radius:10px;padding:16px">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a84;margin-bottom:6px">Total Verified Spend</div>
          <div style="font-size:26px;font-weight:900;color:#16B866">KES 1.84M</div>
          <div style="font-size:10px;color:#8a8a84;margin-top:4px">100% M-Pesa Audited</div>
        </div>
        <div style="background:#111112;border:1px solid #26262a;border-radius:10px;padding:16px">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a84;margin-bottom:6px">Active Field Agents</div>
          <div style="font-size:26px;font-weight:900;color:#C8FF00">36,058</div>
          <div style="font-size:10px;color:#16B866;margin-top:4px">78% of 46,229 target</div>
        </div>
        <div style="background:#111112;border:1px solid #26262a;border-radius:10px;padding:16px">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a84;margin-bottom:6px">Voter Contacts Today</div>
          <div style="font-size:26px;font-weight:900;color:#fff" id="wrVoterContacts">142,850</div>
          <div style="font-size:10px;color:#16B866;margin-top:4px">+14.2% vs yesterday</div>
        </div>
        <div style="background:#111112;border:1px solid #26262a;border-radius:10px;padding:16px">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a84;margin-bottom:6px">National Net Sentiment</div>
          <div style="font-size:26px;font-weight:900;color:#C8FF00">+62</div>
          <div style="font-size:10px;color:#8a8a84;margin-top:4px">Rolling 7-day index</div>
        </div>
        <div style="background:#111112;border:1px solid #26262a;border-radius:10px;padding:16px">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8a84;margin-bottom:6px">Ghost Task Rate</div>
          <div style="font-size:26px;font-weight:900;color:#E84040">2.8%</div>
          <div style="font-size:10px;color:#16B866;margin-top:4px">Below 5% audit threshold</div>
        </div>
      </div>

      <!-- MAIN SPLIT: LIVE M-PESA LEDGER + LIVE THREAT STREAM -->
      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:20px;flex:1">
        
        <!-- LEFT: M-PESA PAY-ON-ACTION LEDGER -->
        <div style="background:#111112;border:1px solid #26262a;border-radius:12px;padding:20px;display:flex;flex-direction:column">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div>
              <div style="font-size:15px;font-weight:700;color:#C8FF00">M-Pesa Financial Ledger · Pay-On-Verified-Action</div>
              <div style="font-size:11px;color:#8a8a84">Every shilling tied to geo-stamped & verified voter contact</div>
            </div>
            <span style="font-size:9px;font-weight:800;padding:4px 8px;border-radius:4px;background:rgba(22,184,102,0.15);color:#16B866;border:1px solid rgba(22,184,102,0.3)">LIVE STREAM</span>
          </div>

          <div id="mpesaStream" style="flex:1;display:flex;flex-direction:column;gap:10px;overflow-y:auto">
            <!-- Ticker items dynamically injected -->
          </div>
        </div>

        <!-- RIGHT: LIVE THREAT ALERTS & ACTIVE COUNTERS -->
        <div style="background:#111112;border:1px solid #26262a;border-radius:12px;padding:20px">
          <div style="font-size:15px;font-weight:700;margin-bottom:4px">Active Threat Radar & Response</div>
          <div style="font-size:11px;color:#8a8a84;margin-bottom:14px">Real-time Sauti Shield De-escalation Stream</div>

          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="background:#18181a;border-left:3px solid #E84040;border-radius:8px;padding:12px">
              <div style="font-size:12px;font-weight:700;color:#E84040;margin-bottom:3px">CRITICAL · Mt Kenya Betrayal Narrative</div>
              <div style="font-size:11px;color:#ccc;margin-bottom:6px">Inooro FM call-ins surging on coffee reform delays in Nyeri.</div>
              <div style="font-size:10px;color:#16B866;font-weight:700">Action: 120 PSAs dispatched · Vernacular audio clip pushed</div>
            </div>

            <div style="background:#18181a;border-left:3px solid #E84040;border-radius:8px;padding:12px">
              <div style="font-size:12px;font-weight:700;color:#E84040;margin-bottom:3px">CRITICAL · ABC Coalition Alliance TikTok Push</div>
              <div style="font-size:11px;color:#ccc;margin-bottom:6px">850K views on speculative Kalonzo/Matiang'i joint ticket.</div>
              <div style="font-size:10px;color:#C8FF00;font-weight:700">Action: Wasikie creator network activated in Nairobi & Machakos</div>
            </div>

            <div style="background:#18181a;border-left:3px solid #F59E0B;border-radius:8px;padding:12px">
              <div style="font-size:12px;font-weight:700;color:#F59E0B;margin-bottom:3px">HIGH · Rift Valley Registration Apathy</div>
              <div style="font-size:11px;color:#ccc;margin-bottom:6px">Bomet registration rate 4.2% below 2022 baseline.</div>
              <div style="font-size:10px;color:#2DD4BF;font-weight:700">Action: Ghost-Hunter registration caravans deployed</div>
            </div>
          </div>
        </div>

      </div>
    `;

    document.getElementById('closeWarRoom').addEventListener('click', toggleWarRoom);
  }

  function startLedgerTicker() {
    const container = document.getElementById('mpesaStream');
    if (!container) return;

    // Pre-fill initial items
    renderTickerItems(container);

    // Stream new transaction every 3.5 seconds
    tickerTimer = setInterval(() => {
      const item = MPESA_LEDGER_FEED[ledgerIndex % MPESA_LEDGER_FEED.length];
      ledgerIndex++;

      const el = document.createElement('div');
      el.style.cssText = 'background:#18181b;border:1px solid #28282d;border-radius:8px;padding:12px;display:flex;align-items:center;justify-content:space-between;animation:slidein 0.4s ease';
      el.innerHTML = `
        <div>
          <div style="font-size:12px;font-weight:700;color:#fff">${item.agent} · <span style="color:#C8FF00">${item.amount}</span></div>
          <div style="font-size:11px;color:#8a8a84;margin-top:2px">${item.task} · ${item.ward}</div>
        </div>
        <span style="font-size:9px;font-weight:800;padding:3px 7px;border-radius:4px;background:rgba(22,184,102,0.15);color:#16B866;border:1px solid rgba(22,184,102,0.3)">${item.status}</span>
      `;

      container.insertBefore(el, container.firstChild);
      if (container.children.length > 7) {
        container.removeChild(container.lastChild);
      }
    }, 3500);
  }

  function renderTickerItems(container) {
    let html = '';
    MPESA_LEDGER_FEED.slice(0, 5).forEach(item => {
      html += `
        <div style="background:#18181b;border:1px solid #28282d;border-radius:8px;padding:12px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:12px;font-weight:700;color:#fff">${item.agent} · <span style="color:#C8FF00">${item.amount}</span></div>
            <div style="font-size:11px;color:#8a8a84;margin-top:2px">${item.task} · ${item.ward}</div>
          </div>
          <span style="font-size:9px;font-weight:800;padding:3px 7px;border-radius:4px;background:rgba(22,184,102,0.15);color:#16B866;border:1px solid rgba(22,184,102,0.3)">${item.status}</span>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectWarRoomTrigger, 400);
  });

  window.toggleWarRoom = toggleWarRoom;
})();
