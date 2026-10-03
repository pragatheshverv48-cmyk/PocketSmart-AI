/* PocketSmart AI - GitHub Pages Interactive Client-Side Engine */

const STORE_URLS = {
  "Amazon": "https://www.amazon.in/s?k=",
  "Flipkart": "https://www.flipkart.com/search?q=",
  "IKEA": "https://www.ikea.com/in/en/search/?q=",
  "Pepperfry": "https://www.pepperfry.com/site_product/search?q=",
  "Swiggy": "https://www.swiggy.com/search?query=",
  "Zomato": "https://www.zomato.com/search?q=",
  "OYO": "https://www.oyorooms.com/search?location=",
  "BookMyShow": "https://in.bookmyshow.com/explore/home?q=",
  "Tanishq": "https://www.tanishq.co.in/shop/",
  "CaratLane": "https://www.caratlane.com/search?q="
};

function getStoreLink(platform, query) {
  const base = STORE_URLS[platform] || STORE_URLS["Amazon"];
  return base + encodeURIComponent(query);
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-nav").forEach(el => el.classList.remove("active"));

  const targetPane = document.getElementById("pane-" + tabId);
  if (targetPane) {
    targetPane.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Highlight nav
  document.querySelectorAll(".tab-nav").forEach(link => {
    if (link.getAttribute("onclick") && link.getAttribute("onclick").includes(tabId)) {
      link.classList.add("active");
    }
  });

  if (tabId === "history") {
    renderHistory();
  }
}

// 🛋️ HOME PLANNER ENGINE
function addHomeItemRow() {
  const container = document.getElementById("homeItemsList");
  const div = document.createElement("div");
  div.className = "item-row";
  div.style.display = "flex";
  div.style.gap = "0.5rem";
  div.innerHTML = `
    <input type="text" class="form-control" placeholder="Item name (e.g. Bookshelf, Rug)" style="flex: 2;">
    <input type="number" class="form-control" value="1" min="1" max="10" style="width: 70px;">
    <button type="button" class="btn btn-outline btn-sm" onclick="this.parentElement.remove()" style="color: #f87171;">✕</button>
  `;
  container.appendChild(div);
}

function handleHomeSubmit(e) {
  e.preventDefault();
  const budget = parseFloat(document.getElementById("homeBudget").value) || 50000;
  const style = document.getElementById("homeStyle").value;
  
  const roomEls = document.querySelectorAll('input[name="room"]:checked');
  const rooms = Array.from(roomEls).map(cb => cb.value);

  const itemRows = document.querySelectorAll("#homeItemsList .item-row");
  const items = [];
  itemRows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const name = inputs[0].value.trim();
    const qty = parseInt(inputs[1].value, 10) || 1;
    if (name) items.push({ name, qty });
  });

  if (items.length === 0) {
    items.push({ name: "Living Room Sofa", qty: 1 }, { name: "Bed Frame", qty: 1 });
  }

  const platforms = ["IKEA", "Pepperfry", "Amazon", "Flipkart"];
  const allocPerItem = budget * 0.9 / items.length;
  let totalAllocated = 0;

  const recommendations = items.map((item, idx) => {
    const platform = platforms[idx % platforms.length];
    const unitPrice = Math.round((allocPerItem / item.qty) * (0.85 + (idx % 3) * 0.1));
    const totalPrice = unitPrice * item.qty;
    totalAllocated += totalPrice;

    return {
      item_name: `${style} ${item.name}`,
      category: rooms[idx % rooms.length] || "General Home",
      quantity: item.qty,
      unit_price: unitPrice,
      total_price: totalPrice,
      platform: platform,
      rating: (4.2 + (idx % 6) * 0.1).toFixed(1),
      description: `Ergonomic, high-durability ${item.name.toLowerCase()} curated for your ${style} aesthetic.`,
      store_url: getStoreLink(platform, `${style} ${item.name}`)
    };
  });

  const savings = Math.max(0, budget - totalAllocated);

  const plan = {
    id: Date.now(),
    type: "Home Interior",
    total_budget: budget,
    total_allocated: totalAllocated,
    savings_estimated: savings,
    summary: `Proportionately allocated ₹${totalAllocated.toLocaleString('en-IN')} across ${items.length} key furnishings for ${rooms.join(", ") || "Home"} under a ${style} aesthetic.`,
    recommendations: recommendations
  };

  savePlan(plan);
  displayResults(plan);
}

// 🎉 PARTY PLANNER ENGINE
function handlePartySubmit(e) {
  e.preventDefault();
  const budget = parseFloat(document.getElementById("partyBudget").value) || 30000;
  const guests = parseInt(document.getElementById("partyGuests").value, 10) || 20;
  const eventType = document.getElementById("partyType").value;
  const venue = document.getElementById("partyVenue").value;

  const cateringAmt = Math.round(budget * 0.45);
  const venueAmt = Math.round(budget * 0.28);
  const decorAmt = Math.round(budget * 0.15);
  const entAmt = Math.round(budget * 0.10);
  const totalAllocated = cateringAmt + venueAmt + decorAmt + entAmt;
  const perHead = Math.round(cateringAmt / guests);

  const recommendations = [
    {
      item_name: `${eventType} Feast Buffet (${guests} Pax)`,
      category: "Catering & Food (~45%)",
      total_price: Math.round(cateringAmt * 0.75),
      platform: "Swiggy",
      rating: "4.8",
      description: `Multi-course customized catering package valued at ₹${perHead}/head including starters and beverages.`,
      store_url: getStoreLink("Swiggy", `${eventType} catering party food`)
    },
    {
      item_name: "Celebration Cake & Artisanal Desserts",
      category: "Catering & Food",
      total_price: Math.round(cateringAmt * 0.25),
      platform: "Zomato",
      rating: "4.6",
      description: `Handcrafted theme cake and dessert platter delivered for ${guests} guests.`,
      store_url: getStoreLink("Zomato", "party theme cake desserts")
    },
    {
      item_name: `${venue} Space Booking`,
      category: "Venue & Stay (~28%)",
      total_price: venueAmt,
      platform: "OYO",
      rating: "4.4",
      description: `Air-conditioned event space suitable for ${guests} guests with dedicated seating and audio setup.`,
      store_url: getStoreLink("OYO", `${venue} party hall booking`)
    },
    {
      item_name: `${eventType} LED Fairy Lights & Balloon Garland Kit`,
      category: "Decor & Ambiance (~15%)",
      total_price: decorAmt,
      platform: "Amazon",
      rating: "4.5",
      description: "Complete thematic DIY decor kit with photo backdrop, balloon arch, and spotlights.",
      store_url: getStoreLink("Amazon", `${eventType} party decorations backdrop kit`)
    },
    {
      item_name: "Live DJ Audio System / Entertainment Passes",
      category: "Entertainment (~10%)",
      total_price: entAmt,
      platform: "BookMyShow",
      rating: "4.7",
      description: "Music and high-energy sound system setup for uninterrupted celebration.",
      store_url: getStoreLink("BookMyShow", "party DJ music live entertainment")
    }
  ];

  const plan = {
    id: Date.now(),
    type: "Party Planning",
    total_budget: budget,
    total_allocated: totalAllocated,
    savings_estimated: Math.max(0, budget - totalAllocated),
    guest_count: guests,
    summary: `Organized a ${eventType} for ${guests} guests at ₹${perHead}/guest catering budget, with proportionate shares for ${venue}, decor, and music.`,
    recommendations: recommendations
  };

  savePlan(plan);
  displayResults(plan);
}

// 💎 JEWELRY PLANNER ENGINE
let detectedOutfitColor = null;

function previewOutfitImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = document.getElementById("previewImg");
    img.src = event.target.result;
    document.getElementById("imagePreviewContainer").style.display = "block";

    // Detect color via canvas
    const tempImg = new Image();
    tempImg.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(tempImg, 0, 0, 50, 50);
      const pixel = ctx.getImageData(25, 25, 1, 1).data;
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      detectedOutfitColor = rgb;

      document.getElementById("detectedColorBox").innerHTML = `
        <span class="color-swatch" style="background-color: ${rgb};"></span>
        Detected Primary Outfit Tone: <strong>${rgb}</strong>
      `;
    };
    tempImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleJewelrySubmit(e) {
  e.preventDefault();
  const budget = parseFloat(document.getElementById("jewelryBudget").value) || 25000;
  const occasion = document.getElementById("jewelryOccasion").value;
  const style = document.getElementById("jewelryStyle").value;

  const necklaceAmt = Math.round(budget * 0.50);
  const earringsAmt = Math.round(budget * 0.30);
  const bangleAmt = Math.round(budget * 0.20);
  const totalAllocated = necklaceAmt + earringsAmt + bangleAmt;

  const recommendations = [
    {
      item_name: `${style} Choker / Statement Necklace`,
      category: "Neckpiece (50%)",
      total_price: necklaceAmt,
      platform: "Tanishq",
      rating: "4.9",
      description: `Exquisitely handcrafted centerpiece designed for ${occasion}, beautifully contrasting with your outfit palette.`,
      store_url: getStoreLink("Tanishq", `${style} necklace ${occasion}`)
    },
    {
      item_name: `${style} Matching Jhumkas / Drop Earrings`,
      category: "Earrings (30%)",
      total_price: earringsAmt,
      platform: "CaratLane",
      rating: "4.8",
      description: `Lightweight yet glamorous drop earrings with secure fastening for evening events.`,
      store_url: getStoreLink("CaratLane", `${style} earrings`)
    },
    {
      item_name: `Polki / Emerald Accent Bangle Pair`,
      category: "Wristwear (20%)",
      total_price: bangleAmt,
      platform: "Amazon",
      rating: "4.6",
      description: `Contemporary dual-tone cuff bracelets that tie your complete ethnic or party look together.`,
      store_url: getStoreLink("Amazon", `${style} bangles jewelry set`)
    }
  ];

  const plan = {
    id: Date.now(),
    type: "Jewelry Coordination",
    total_budget: budget,
    total_allocated: totalAllocated,
    savings_estimated: Math.max(0, budget - totalAllocated),
    summary: `Color-coordinated ${style} ornaments matching ${occasion} aesthetics within ₹${budget.toLocaleString('en-IN')} total spend.`,
    recommendations: recommendations
  };

  savePlan(plan);
  displayResults(plan);
}

// 📊 RESULTS DISPLAY
function displayResults(plan) {
  document.getElementById("resultsPill").innerText = `🤖 AI Recommendation Plan: ${plan.type}`;
  document.getElementById("resultsTitle").innerText = `${plan.type} Budget Plan`;
  document.getElementById("strategySummary").innerText = plan.summary;

  const summaryBar = document.getElementById("summaryBar");
  summaryBar.innerHTML = `
    <div class="stat-box">
      <div class="stat-label">Total Budget</div>
      <div class="stat-val" style="color: #a5b4fc;">₹${plan.total_budget.toLocaleString('en-IN')}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Total Allocated</div>
      <div class="stat-val" style="color: var(--success);">₹${plan.total_allocated.toLocaleString('en-IN')}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Estimated Savings</div>
      <div class="stat-val" style="color: var(--warning);">₹${plan.savings_estimated.toLocaleString('en-IN')}</div>
    </div>
    ${plan.guest_count ? `
      <div class="stat-box">
        <div class="stat-label">Guest Count</div>
        <div class="stat-val" style="color: var(--accent);">${plan.guest_count} pax</div>
      </div>
    ` : ''}
  `;

  const grid = document.getElementById("recommendationsGrid");
  grid.innerHTML = plan.recommendations.map(rec => `
    <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span class="platform-badge badge-${(rec.platform || 'amazon').toLowerCase()}">${rec.platform}</span>
          <span style="font-size: 0.85rem; color: #facc15;">★ ${rec.rating}</span>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.4rem;">${rec.item_name}</h4>
        <span style="display: inline-block; font-size: 0.8rem; background: rgba(255,255,255,0.06); padding: 0.2rem 0.5rem; border-radius: 4px; margin-bottom: 0.75rem; color: var(--text-muted);">
          📍 ${rec.category}
        </span>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">${rec.description}</p>
      </div>

      <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Est. Price</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--success);">₹${rec.total_price.toLocaleString('en-IN')}</div>
        </div>
        <a href="${rec.store_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          Buy on ${rec.platform} ↗
        </a>
      </div>
    </div>
  `).join("");

  switchTab("results");
}

// 💾 LOCALSTORAGE HISTORY
function savePlan(plan) {
  let history = JSON.parse(localStorage.getItem("pocketsmart_demo_history") || "[]");
  history.unshift(plan);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem("pocketsmart_demo_history", JSON.stringify(history));
}

function renderHistory() {
  const container = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("pocketsmart_demo_history") || "[]");

  if (history.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">No Saved Plans Yet</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Generate your first budget plan using Home, Party, or Jewelry planners!</p>
        <button onclick="switchTab('home')" class="btn btn-primary btn-sm">🛋️ Try Home Planner</button>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map(item => `
    <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
          <span class="brand-badge" style="background: var(--primary);">${item.type}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">📅 ${new Date(item.id).toLocaleDateString()}</span>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">
          Total Budget: <span style="color: #a5b4fc;">₹${item.total_budget.toLocaleString('en-IN')}</span>
        </h3>
        <p style="color: var(--text-sub); font-size: 0.95rem; margin-top: 0.25rem;">
          ${item.summary}
        </p>
      </div>

      <button class="btn btn-primary btn-sm" onclick='displayResults(${JSON.stringify(item)})'>
        View Plan &rarr;
      </button>
    </div>
  `).join("");
}

function clearHistory() {
  if (confirm("Are you sure you want to clear your saved plans?")) {
    localStorage.removeItem("pocketsmart_demo_history");
    renderHistory();
  }
}

function sharePlan() {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied to clipboard!");
}
