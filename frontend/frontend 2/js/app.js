// ---------- Tabs ----------
const tabButtons = document.querySelectorAll(".tabbtn");
const pages = {
  home: document.getElementById("page-home"),
  trips: document.getElementById("page-trips"),
  chats: document.getElementById("page-chats"),
  profile: document.getElementById("page-profile"),
};

function openPage(key){
  tabButtons.forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabbtn[data-page="${key}"]`)?.classList.add("active");

  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[key].classList.add("active");

  // close any open subpages when switching tabs
  closeAllSubpages();
}

tabButtons.forEach(btn => btn.addEventListener("click", () => openPage(btn.dataset.page)));

document.getElementById("btnMiniProfile").addEventListener("click", () => openPage("profile"));

// ---------- Quick Weather (emoji cycle) ----------
const wEmoji = document.getElementById("wEmoji");
const wText = document.getElementById("wText");
const weatherStates = [
  { e: "☀️", t: "Sunny" },
  { e: "☁️", t: "Cloudy" },
  { e: "🌧️", t: "Rain" },
];
let wIdx = 0;
function setWeather(i){ wEmoji.textContent = weatherStates[i].e; wText.textContent = weatherStates[i].t; }
document.getElementById("qWeather").addEventListener("click", () => { wIdx = (wIdx+1)%weatherStates.length; setWeather(wIdx); });
setWeather(0);

// ---------- Settings Modal + Dark mode ----------
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const saveSettings = document.getElementById("saveSettings");
const themeToggle = document.getElementById("themeToggle");
const cycleWeather = document.getElementById("cycleWeather");

function showModal(){ modal.classList.add("show"); }
function hideModal(){ modal.classList.remove("show"); }

document.getElementById("qSettings").addEventListener("click", showModal);
document.getElementById("openSettingsFromProfile").addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
saveSettings.addEventListener("click", hideModal);
modal.addEventListener("click", (e)=>{ if(e.target===modal) hideModal(); });

themeToggle.addEventListener("change", ()=> document.body.classList.toggle("dark", themeToggle.checked));
cycleWeather.addEventListener("click", ()=>{ wIdx=(wIdx+1)%weatherStates.length; setWeather(wIdx); });

// ---------- SOS ----------
document.getElementById("qSOS").addEventListener("click", () => openSubpage("sub-sos"));
document.getElementById("sendSOS")?.addEventListener("click", () => alert("SOS sent (prototype demo). Location shared!"));

// ---------- Subpage navigation ----------
const subpages = [
  "sub-expenses","sub-booking","sub-hotels","sub-location","sub-itinerary","sub-conflict","sub-sos",
  "sub-profileInfo","sub-emergency",
  "tripDetails","chatBox"
].map(id => document.getElementById(id)).filter(Boolean);

function closeAllSubpages(){
  subpages.forEach(s => s.classList.add("hidden"));
}
function openSubpage(id){
  closeAllSubpages();
  document.getElementById(id).classList.remove("hidden");
  // scroll into view for better app feel
  document.getElementById(id).scrollIntoView({behavior:"smooth", block:"start"});
}

// back buttons
document.querySelectorAll("[data-back]").forEach(btn=>{
  btn.addEventListener("click", ()=> closeAllSubpages());
});

// home feature open
document.querySelectorAll("[data-open]").forEach(el=>{
  el.addEventListener("click", ()=>{
    const key = el.dataset.open;

    const map = {
      expenses: "sub-expenses",
      booking: "sub-booking",
      hotels: "sub-hotels",
      location: "sub-location",
      itinerary: "sub-itinerary",
      conflict: "sub-conflict",
      sosPage: "sub-sos",
      profileInfo: "sub-profileInfo",
      emergency: "sub-emergency",
    };

    if(map[key]) openSubpage(map[key]);
  });
});

// open trip from home
document.getElementById("openGoaTrip").addEventListener("click", ()=> openPage("trips"));
document.getElementById("shareTrip").addEventListener("click", ()=> alert("Share Trip (prototype): link + permissions"));

// ---------- Trips detail (only when click) ----------
const TRIPS = {
  goa: { title:"Goa", meta:"12 Mar – 16 Mar • Running", hotel:"Seaside Inn, Calangute", expense:"₹8,160", members:"Anushka, Sagar, Bhumika, Hitesh, Anjali", bookings:"Train + Hotel" },
  pune:{ title:"Pune", meta:"20 Feb – 22 Feb • Completed", hotel:"City Center Lodge", expense:"₹4,900", members:"Anushka, Sagar, Bhumika", bookings:"Bus + Hotel" },
  future:{ title:"Next Trip", meta:"Planned • Dates to be set", hotel:"Not booked", expense:"₹0", members:"—", bookings:"Pending" }
};
const tripTitle = document.getElementById("tripTitle");
const tripMeta  = document.getElementById("tripMeta");
const tripHotel = document.getElementById("tripHotel");
const tripExpense = document.getElementById("tripExpense");
const tripMembers = document.getElementById("tripMembers");
const tripBookings = document.getElementById("tripBookings");

document.querySelectorAll(".big-trip-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    const key = card.dataset.trip;
    const t = TRIPS[key];
    if(!t) return;

    tripTitle.textContent = t.title;
    tripMeta.textContent = t.meta;
    tripHotel.textContent = t.hotel;
    tripExpense.textContent = t.expense;
    tripMembers.textContent = t.members;
    tripBookings.textContent = t.bookings;

    openSubpage("tripDetails");
  });
});

// ---------- Booking mode details ----------
const modeTitle = document.getElementById("modeTitle");
const modeBody = document.getElementById("modeBody");

const MODE = {
  bus:   { t:"Bus Details",   b:"Bus: VRL • 12 Mar • 09:30 AM • Nagpur → Goa • Seat: A12" },
  train: { t:"Train Details", b:"Train: Goa Express • 12 Mar • 08:10 AM • Coach: S2 • Seat: 21" },
  plane: { t:"Plane Details", b:"Flight: AI-402 • 12 Mar • 06:45 AM • Terminal 1 • Seat: 14C" },
};

document.querySelectorAll("[data-mode]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const k = btn.dataset.mode;
    modeTitle.textContent = MODE[k].t;
    modeBody.textContent  = MODE[k].b;
  });
});

// ---------- Expenses: Members + Add spend + Split ----------
const members = ["Anushka","Sagar","Bhumika","Hitesh","Anjali"];
const memberChips = document.getElementById("memberChips");
const paidBySelect = document.getElementById("expPaidBy");
const expTitle = document.getElementById("expTitle");
const expAmount = document.getElementById("expAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");
const splitSummary = document.getElementById("splitSummary");

let expenses = [
  { title:"Lunch", amount:900, paidBy:"Anushka" },
  { title:"Taxi", amount:600, paidBy:"Sagar" },
];

function renderMembers(){
  memberChips.innerHTML = members.map(m=>`<span class="chip">${m}</span>`).join("");
  paidBySelect.innerHTML = members.map(m=>`<option value="${m}">${m}</option>`).join("");
}

function renderExpenses(){
  expenseList.innerHTML = "";
  expenses.forEach((e, idx)=>{
    const div = document.createElement("div");
    div.className = "li";
    div.innerHTML = `${e.title} • ₹${e.amount} <small>paid by ${e.paidBy}</small>`;
    expenseList.appendChild(div);
  });
}

function computeSplit(){
  const total = expenses.reduce((s,e)=>s+e.amount, 0);
  const per = total / members.length;

  const paid = Object.fromEntries(members.map(m=>[m,0]));
  expenses.forEach(e => paid[e.paidBy] += e.amount);

  // balance = paid - per ; + means should receive, - means owes
  const balance = Object.fromEntries(members.map(m=>[m, +(paid[m]-per).toFixed(2)]));
  // create owes list
  const debtors = members.filter(m=>balance[m]<0).map(m=>({m, amt:-balance[m]}));
  const creditors = members.filter(m=>balance[m]>0).map(m=>({m, amt:balance[m]}));

  const lines = [];
  lines.push(`<div class="li">Total: ₹${total.toFixed(0)} • Per person: ₹${per.toFixed(0)}</div>`);

  // settle
  let i=0,j=0;
  const settle = [];
  while(i<debtors.length && j<creditors.length){
    const payAmt = Math.min(debtors[i].amt, creditors[j].amt);
    settle.push(`${debtors[i].m} pays ₹${payAmt.toFixed(0)} to ${creditors[j].m}`);
    debtors[i].amt -= payAmt;
    creditors[j].amt -= payAmt;
    if(debtors[i].amt <= 0.01) i++;
    if(creditors[j].amt <= 0.01) j++;
  }

  settle.forEach(s => lines.push(`<div class="li">${s}</div>`));
  splitSummary.innerHTML = lines.join("");
}

addExpenseBtn.addEventListener("click", ()=>{
  const title = expTitle.value.trim() || "Expense";
  const amount = Number(expAmount.value);
  const paidBy = paidBySelect.value;

  if(!amount || amount <= 0){
    alert("Enter a valid amount.");
    return;
  }

  expenses.push({ title, amount, paidBy });
  expTitle.value = "";
  expAmount.value = "";

  renderExpenses();
  computeSplit();
});

// init expenses screen data
renderMembers();
renderExpenses();
computeSplit();

// ---------- Chats: Trip -> Person -> Chat ----------
const peopleList = document.getElementById("peopleList");
const chatTripSelect = document.getElementById("chatTripSelect");
const chatBox = document.getElementById("chatBox");
const chatWith = document.getElementById("chatWith");
const chatTripName = document.getElementById("chatTripName");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendMsg = document.getElementById("sendMsg");

const PEOPLE = ["Anushka","Sagar","Bhumika","Hitesh","Anjali"];

function renderPeople(){
  peopleList.innerHTML = "";
  PEOPLE.forEach(name=>{
    const btn = document.createElement("button");
    btn.className = "row-card";
    btn.innerHTML = `<div><div class="row-title">${name}</div><div class="muted">Tap to chat</div></div><div class="chev">›</div>`;
    btn.addEventListener("click", ()=>{
      openSubpage("chatBox");
      chatWith.textContent = "Chat with " + name;
      chatTripName.textContent = "Trip: " + (chatTripSelect.value === "goa" ? "Goa" : "Pune");
      chatMessages.innerHTML = `
        <div class="msg">Hi! Plan confirm?</div>
        <div class="msg me">Yes ✅</div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    peopleList.appendChild(btn);
  });
}
renderPeople();

document.querySelectorAll("[data-back-chat]").forEach(btn=>{
  btn.addEventListener("click", ()=> chatBox.classList.add("hidden"));
});

sendMsg.addEventListener("click", ()=>{
  const t = chatInput.value.trim();
  if(!t) return;
  const div = document.createElement("div");
  div.className = "msg me";
  div.textContent = t;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value = "";
});