// --- CONFIGURATION ---
// Define the specific behavior and theme for each tab
const TABS = {
    'home': {
        title: "Smart Home",
        desc: "Domestic environment monitoring active.",
        // Sounds that trigger RED ALERT in Home mode
        alerts: ["smoke", "alarm", "breaking", "glass", "knock", "cry", "sob", "drill", "hammer"], 
        icon: "fa-house-chimney",
        theme: "home" // No specific class (uses default)
    },
    'industrial': {
        title: "Industrial Ops",
        desc: "Machinery health & hazard tracking system.",
        alerts: ["explosion", "burst", "alarm", "siren", "fire"], 
        icon: "fa-industry",
        theme: "industrial" // Triggers yellow theme
    },
    'surveillance': {
        title: "Surveillance Feed",
        desc: "Restricted area intrusion detection.",
        alerts: ["breaking", "glass", "scream", "shout", "gunshot", "slam"],
        icon: "fa-user-secret",
        theme: "surveillance" // Triggers hacker green theme
    },
    'public': {
        title: "Public Safety",
        desc: "Urban emergency response unit.",
        alerts: ["siren", "gunshot", "explosion", "scream", "crash"],
        icon: "fa-truck-medical",
        theme: "public" // Triggers blue theme
    }
};

let currentTab = 'home';
let lastEvent = "";

// Set initial clock
updateClock();

// --- TAB SWITCHING LOGIC ---
function setTab(tabKey) {
    currentTab = tabKey;
    const config = TABS[tabKey];
    
    // 1. Apply Theme Class to Body
    // We remove all other theme classes first
    document.body.classList.remove('industrial', 'surveillance', 'public');
    if (config.theme !== 'home') {
        document.body.classList.add(config.theme);
    }

    // 2. Update Sidebar Active State
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // 3. Update Text Content with Fade Effect
    const titleEl = document.getElementById('tab-title');
    const descEl = document.getElementById('tab-desc');
    
    titleEl.innerText = config.title;
    descEl.innerText = config.desc;
    
    // 4. Reset Icon
    document.getElementById('main-icon').innerHTML = `<i class="fa-solid ${config.icon}"></i>`;

    // 5. Clear Log for cleanliness
    document.getElementById('log-list').innerHTML = '';
}

// --- MAIN LOOP ---
function updateUI() {
    fetch('/status')
        .then(res => res.json())
        .then(data => {
            const eventRaw = data.event;
            const eventLower = eventRaw.toLowerCase();
            const conf = data.confidence;
            
            const tabConfig = TABS[currentTab];
            
            // Check if sound is in the ALERT list for this specific tab
            const isAlert = tabConfig.alerts.some(kw => eventLower.includes(kw));

            // DOM Elements
            const nameEl = document.getElementById('event-name');
            const barEl = document.getElementById('conf-bar');
            const iconEl = document.getElementById('main-icon');
            const confText = document.getElementById('conf-text');
            
            // Threshold: Only show if confidence is > 30%
            if (conf > 30) {
                nameEl.innerText = eventRaw;
                confText.innerText = conf + "% Confidence";
                barEl.style.width = conf + "%";
                
                if (isAlert) {
                    // --- DANGER STATE (Always Red) ---
                    // We temporarily override the theme accent color using inline styles
                    nameEl.style.color = "#ff4757"; 
                    iconEl.style.color = "#ff4757";
                    barEl.style.backgroundColor = "#ff4757";
                    
                    iconEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                    iconEl.classList.add('shake');
                    
                    if (lastEvent !== eventRaw) addLog(eventRaw, data.timestamp, true);
                } else {
                    // --- NORMAL STATE (Uses Theme Color) ---
                    // Reset inline styles to let CSS variables take over
                    nameEl.style.color = ""; 
                    iconEl.style.color = ""; 
                    barEl.style.backgroundColor = "";
                    
                    iconEl.innerHTML = `<i class="fa-solid ${tabConfig.icon}"></i>`;
                    iconEl.classList.remove('shake');
                    
                    if (lastEvent !== eventRaw) addLog(eventRaw, data.timestamp, false);
                }
                lastEvent = eventRaw;
            } else {
                // --- IDLE STATE ---
                barEl.style.width = "2%";
                nameEl.innerText = "Listening...";
                nameEl.style.color = "rgba(255,255,255,0.3)";
                iconEl.classList.remove('shake');
                confText.innerText = "Standing by...";
            }
        })
        .catch(err => console.error("Server error:", err));
}

function addLog(text, time, isAlert) {
    const list = document.getElementById('log-list');
    const item = document.createElement('li');
    if (isAlert) item.classList.add('alert');
    
    item.innerHTML = `
        <span>${isAlert ? '⚠️ ' : ''}${text}</span> 
        <span>${time}</span>
    `;
    
    list.prepend(item);
    
    // Keep list short (max 10 items)
    if (list.children.length > 10) {
        list.removeChild(list.lastChild);
    }
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}

// Update clock every second
setInterval(updateClock, 1000);

// Poll backend every 500ms
setInterval(updateUI, 500);