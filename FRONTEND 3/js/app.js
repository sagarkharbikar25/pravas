let appData = loadAppData();

const appState = {
  activeMainPageId: "homePage",
  selectedTripId: null,
  selectedGroupId: null
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function showPage(pageId) {
  qsa(".app-page").forEach((page) => page.classList.remove("active"));
  const page = qs(`#${pageId}`);
  if (page) page.classList.add("active");
}

function showMainPage(pageId) {
  appState.activeMainPageId = pageId;
  showPage(pageId);
  qsa(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTripEmoji(name) {
  const city = (name || "").toLowerCase();
  if (city.includes("goa")) return "🏖️";
  if (city.includes("manali")) return "⛰️";
  if (city.includes("jaipur")) return "🏰";
  if (city.includes("mumbai")) return "🌆";
  if (city.includes("delhi")) return "🏙️";
  if (city.includes("kerala")) return "🌴";
  if (city.includes("kashmir")) return "❄️";
  if (city.includes("agra")) return "🕌";
  return "📍";
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "Dates not added";
  if (startDate && endDate) return `${startDate} → ${endDate}`;
  return startDate || endDate;
}

function getTripStatus(trip) {
  const today = new Date().toISOString().slice(0, 10);
  if (trip.startDate && trip.endDate) {
    if (trip.startDate <= today && trip.endDate >= today) return "current";
    if (trip.startDate > today) return "future";
    if (trip.endDate < today) return "past";
  }
  return "future";
}

function saveAndRefresh() {
  saveAppData(appData);
  renderAll();
}

function getSelectedTrip() {
  return appData.trips.find((trip) => trip.id === appState.selectedTripId);
}

function getSelectedGroup() {
  return appData.groups.find((group) => group.id === appState.selectedGroupId);
}

function getTotalExpense(expenses) {
  return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
}

/* =========================
   HOME
========================= */

function renderCurrentTripCard() {
  const currentTrip = appData.trips.find((trip) => getTripStatus(trip) === "current");

  if (!currentTrip) {
    qs("#currentTripName").textContent = "Create your first trip";
    qs("#currentTripDates").textContent = "Tap to create a trip";
    qs("#currentTripEmoji").textContent = "✨";
    qs("#currentTripPeople").textContent = "People: 0";
    return;
  }

  qs("#currentTripName").textContent = currentTrip.name;
  qs("#currentTripDates").textContent = formatDateRange(currentTrip.startDate, currentTrip.endDate);
  qs("#currentTripEmoji").textContent = getTripEmoji(currentTrip.name);
  qs("#currentTripPeople").textContent = `People: ${currentTrip.peopleCount || 1}`;
}

function bindHomeEvents() {
  qs("#currentTripCard").addEventListener("click", () => {
    const currentTrip = appData.trips.find((trip) => getTripStatus(trip) === "current");
    if (!currentTrip) {
      showPage("createTripPage");
      return;
    }
    openTripDetail(currentTrip.id);
  });

  qs("#goExpenseFromHome").addEventListener("click", () => {
    const currentTrip = appData.trips.find((trip) => getTripStatus(trip) === "current");
    if (!currentTrip) return showPage("createTripPage");
    openExpensePage(currentTrip.id);
  });

  qs("#goBookingFromHome").addEventListener("click", () => {
    const currentTrip = appData.trips.find((trip) => getTripStatus(trip) === "current");
    if (!currentTrip) return showPage("createTripPage");
    openBookingFolder(currentTrip.id);
  });

  qs("#goTripFromHome").addEventListener("click", () => showMainPage("tripsPage"));
  qs("#goChatsFromHome").addEventListener("click", () => showMainPage("chatsPage"));
  qs("#openAiPanelBtn").addEventListener("click", () => showPage("aiPanelPage"));

  qs("#openWeatherBtn").addEventListener("click", () => showPage("weatherPage"));
  qs("#openWeatherFeatureBtn").addEventListener("click", () => showPage("weatherPage"));

  qs("#openLocationBtn").addEventListener("click", () => showPage("locationPage"));
  qs("#openLocationFeatureBtn").addEventListener("click", () => showPage("locationPage"));

  qs("#openSettingsBtn").addEventListener("click", () => showMainPage("profilePage"));
  qs("#openSOSBtn").addEventListener("click", () => {
    alert("SOS action placeholder. Emergency API or contact flow can be attached later.");
  });
}

/* =========================
   TRIPS
========================= */

function createTripCardHTML(trip, showMenu) {
  return `
    <button class="trip-card" data-trip-id="${trip.id}">
      <div class="trip-card-left">
        <div class="trip-card-title">${getTripEmoji(trip.name)} ${escapeHTML(trip.name)}</div>
        <div class="trip-card-sub">${escapeHTML(formatDateRange(trip.startDate, trip.endDate))}</div>
        <div class="trip-card-sub">People: ${trip.peopleCount || 1}</div>
      </div>
      ${showMenu ? `<button class="trip-card-menu" data-trip-menu="${trip.id}" type="button">⋮</button>` : ""}
    </button>
  `;
}

function bindTripCardEvents() {
  qsa(".trip-card[data-trip-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-trip-menu]")) return;
      openTripDetail(card.dataset.tripId);
    });
  });

  qsa("[data-trip-menu]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const tripId = btn.dataset.tripMenu;
      const ok = confirm("Delete this trip?");
      if (!ok) return;

      appData.trips = appData.trips.filter((trip) => trip.id !== tripId);
      appData.groups = appData.groups.filter((group) => group.cityTripId !== tripId);
      saveAndRefresh();
    });
  });
}

function renderTripsMainPage() {
  const currentWrap = qs("#tripsCurrentWrap");
  const futureWrap = qs("#tripsFutureWrap");

  const currentTrips = appData.trips.filter((trip) => getTripStatus(trip) === "current");
  const futureTrips = appData.trips.filter((trip) => getTripStatus(trip) === "future");

  currentWrap.innerHTML = "";
  futureWrap.innerHTML = "";

  if (!currentTrips.length) {
    currentWrap.innerHTML = `<button class="outline-btn" id="createCurrentTripBtn">Create your first trip</button>`;
    qs("#createCurrentTripBtn").addEventListener("click", () => showPage("createTripPage"));
  } else {
    currentTrips.forEach((trip) => {
      currentWrap.insertAdjacentHTML("beforeend", createTripCardHTML(trip, false));
    });
  }

  if (!futureTrips.length) {
    futureWrap.innerHTML = `<button class="outline-btn" id="createFutureTripBtn">+ Add Trip</button>`;
    qs("#createFutureTripBtn").addEventListener("click", () => showPage("createTripPage"));
  } else {
    futureTrips.forEach((trip) => {
      futureWrap.insertAdjacentHTML("beforeend", createTripCardHTML(trip, true));
    });
    futureWrap.insertAdjacentHTML("beforeend", `<button class="outline-btn" id="extraAddTripBtn">+ Add Another Trip</button>`);
    qs("#extraAddTripBtn").addEventListener("click", () => showPage("createTripPage"));
  }

  bindTripCardEvents();
}

function renderPastTripsPage() {
  const wrap = qs("#pastTripsWrap");
  const pastTrips = appData.trips.filter((trip) => getTripStatus(trip) === "past");
  wrap.innerHTML = "";

  if (!pastTrips.length) {
    wrap.innerHTML = `<div class="profile-card">No past trips yet.</div>`;
    return;
  }

  pastTrips.forEach((trip) => {
    wrap.insertAdjacentHTML("beforeend", createTripCardHTML(trip, true));
  });

  bindTripCardEvents();
}

function createTripFromForm() {
  const type = qs("#tripTypeInput").value.trim();
  const name = qs("#tripNameInput").value.trim();
  const startDate = qs("#tripStartDateInput").value;
  const endDate = qs("#tripEndDateInput").value;
  const budget = Number(qs("#tripBudgetInput").value || 0);
  const peopleCount = Number(qs("#tripPeopleCountInput").value || 1);

  if (!name) {
    alert("Enter trip name.");
    return;
  }

  const newTrip = {
    id: createId("trip"),
    type,
    name,
    startDate,
    endDate,
    budget,
    peopleCount,
    expenses: [],
    hotel: null,
    transport: null,
    documents: []
  };

  appData.trips.push(newTrip);

  qs("#tripNameInput").value = "";
  qs("#tripStartDateInput").value = "";
  qs("#tripEndDateInput").value = "";
  qs("#tripBudgetInput").value = "";
  qs("#tripPeopleCountInput").value = "";

  saveAndRefresh();
  openTripDetail(newTrip.id);
}

function bindTripsEvents() {
  qs("#openPastTripsBtn").addEventListener("click", () => showPage("pastTripsPage"));
  qs("#createTripBtn").addEventListener("click", createTripFromForm);
}

/* =========================
   TRIP DETAIL
========================= */

function openTripDetail(tripId) {
  const trip = appData.trips.find((item) => item.id === tripId);
  if (!trip) return;

  appState.selectedTripId = tripId;
  qs("#tripDetailTitle").textContent = trip.name;
  qs("#tripDetailSubtitle").textContent = trip.type === "state" ? "State Trip" : "City Trip";
  qs("#tripDetailEmoji").textContent = getTripEmoji(trip.name);
  qs("#tripDetailCityName").textContent = trip.name;
  qs("#tripDetailDates").textContent = formatDateRange(trip.startDate, trip.endDate);
  qs("#tripDetailPeopleCount").textContent = `People: ${trip.peopleCount || 1}`;
  qs("#tripBudgetSummaryText").textContent = trip.budget ? `Budget: ₹${trip.budget}` : "No budget set";
  qs("#tripExpensePreview").textContent = `Total expense: ₹${getTotalExpense(trip.expenses)}`;

  showPage("tripDetailPage");
}

function bindTripDetailEvents() {
  qs("#openExpensePageBtn").addEventListener("click", () => {
    if (!appState.selectedTripId) return;
    openExpensePage(appState.selectedTripId);
  });

  qs("#openBookingFolderBtn").addEventListener("click", () => {
    if (!appState.selectedTripId) return;
    openBookingFolder(appState.selectedTripId);
  });

  qs("#openLinkedGroupBtn").addEventListener("click", () => {
    const trip = getSelectedTrip();
    if (!trip) return;

    const group = appData.groups.find(
      (item) => item.city.toLowerCase() === trip.name.toLowerCase()
    );

    if (!group) {
      alert("No linked group found for this trip city. Create one first.");
      return;
    }

    openChatRoom(group.id);
  });
}

/* =========================
   EXPENSES
========================= */

function calculateSettlements(expenses, peopleCount) {
  if (!expenses.length || peopleCount <= 0) return [];

  const paidMap = {};
  expenses.forEach((exp) => {
    const payer = exp.paidBy.trim();
    if (!paidMap[payer]) paidMap[payer] = 0;
    paidMap[payer] += Number(exp.amount);
  });

  const participants = Object.keys(paidMap);
  if (!participants.length) return [];

  const total = getTotalExpense(expenses);
  const share = total / peopleCount;

  const creditors = [];
  const debtors = [];

  Object.keys(paidMap).forEach((name) => {
    const bal = +(paidMap[name] - share).toFixed(2);
    if (bal > 0) creditors.push({ name, amount: bal });
  });

  const otherPeopleCount = Math.max(peopleCount - participants.length, 0);
  for (let i = 1; i <= otherPeopleCount; i++) {
    debtors.push({ name: `Member ${i}`, amount: +share.toFixed(2) });
  }

  participants.forEach((name) => {
    const spent = paidMap[name];
    const bal = +(share - spent).toFixed(2);
    if (bal > 0) debtors.push({ name, amount: bal });
  });

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: +amount.toFixed(2)
    });

    debtors[i].amount = +(debtors[i].amount - amount).toFixed(2);
    creditors[j].amount = +(creditors[j].amount - amount).toFixed(2);

    if (debtors[i].amount <= 0) i++;
    if (creditors[j].amount <= 0) j++;
  }

  return settlements;
}

function openExpensePage(tripId) {
  appState.selectedTripId = tripId;
  const trip = getSelectedTrip();
  if (!trip) return;

  qs("#expensePageTripName").textContent = trip.name;
  qs("#totalExpenseValue").textContent = `₹${getTotalExpense(trip.expenses)}`;
  qs("#expensePeopleCount").textContent = `${trip.peopleCount || 1}`;

  renderExpensePage(trip);
  showPage("expensePage");
}

function renderExpensePage(trip) {
  const listWrap = qs("#expenseListWrap");
  const settlementWrap = qs("#expenseSettlementWrap");
  listWrap.innerHTML = "";
  settlementWrap.innerHTML = "";

  if (!trip.expenses.length) {
    listWrap.innerHTML = `<div class="expense-item">No expenses added yet.</div>`;
    settlementWrap.innerHTML = `<div class="settlement-item">No settlements yet.</div>`;
    return;
  }

  trip.expenses.forEach((expense) => {
    listWrap.insertAdjacentHTML("beforeend", `
      <div class="expense-item">
        <strong>${escapeHTML(expense.title)}</strong>
        <div class="expense-subtext">₹${expense.amount} paid by ${escapeHTML(expense.paidBy)}</div>
      </div>
    `);
  });

  const settlementLines = calculateSettlements(trip.expenses, Number(trip.peopleCount || 1));

  if (!settlementLines.length) {
    settlementWrap.innerHTML = `<div class="settlement-item">Settlement not available yet.</div>`;
  } else {
    settlementLines.forEach((line) => {
      settlementWrap.insertAdjacentHTML("beforeend", `
        <div class="settlement-item">
          <strong>${escapeHTML(line.from)} pays ₹${line.amount}</strong>
          <div class="expense-subtext">to ${escapeHTML(line.to)}</div>
        </div>
      `);
    });
  }
}

function bindExpenseEvents() {
  qs("#addExpenseBtn").addEventListener("click", () => {
    const trip = getSelectedTrip();
    if (!trip) return;

    const title = qs("#expenseTitleInput").value.trim();
    const amount = Number(qs("#expenseAmountInput").value);
    const paidBy = qs("#expensePaidByInput").value.trim();

    if (!title || !amount || !paidBy) {
      alert("Fill all expense fields.");
      return;
    }

    trip.expenses.push({
      id: createId("expense"),
      title,
      amount,
      paidBy
    });

    qs("#expenseTitleInput").value = "";
    qs("#expenseAmountInput").value = "";
    qs("#expensePaidByInput").value = "";

    saveAndRefresh();
    openExpensePage(trip.id);
  });
}

/* =========================
   BOOKING / HOTEL / TRANSPORT / DOC
========================= */

function openBookingFolder(tripId) {
  appState.selectedTripId = tripId;
  const trip = getSelectedTrip();
  if (!trip) return;

  qs("#bookingFolderTripName").textContent = trip.name;
  qs("#hotelPreviewText").textContent = trip.hotel ? `${trip.hotel.name} • ₹${trip.hotel.price}` : "Open hotel file";
  qs("#transportPreviewText").textContent = trip.transport ? `${trip.transport.mode} • ${trip.transport.details}` : "Open transport file";
  showPage("bookingFolderPage");
}

function openHotelPage() {
  const trip = getSelectedTrip();
  if (!trip) return;
  qs("#hotelPageTripName").textContent = trip.name;
  qs("#hotelInfoWrap").textContent = trip.hotel ? `${trip.hotel.name} • ₹${trip.hotel.price}` : "No hotel saved yet.";
  showPage("hotelPage");
}

function openTransportPage() {
  const trip = getSelectedTrip();
  if (!trip) return;
  qs("#transportPageTripName").textContent = trip.name;
  qs("#transportInfoWrap").textContent = trip.transport ? `${trip.transport.mode} • ${trip.transport.details}` : "No transport saved yet.";
  showPage("transportPage");
}

function openDocumentPage() {
  const trip = getSelectedTrip();
  if (!trip) return;
  qs("#documentPageTripName").textContent = trip.name;
  qs("#documentInfoWrap").textContent = trip.documents.length ? trip.documents.join(", ") : "No document uploaded yet.";
  showPage("documentPage");
}

function bindBookingEvents() {
  qs("#openHotelPageBtn").addEventListener("click", openHotelPage);
  qs("#openTransportPageBtn").addEventListener("click", openTransportPage);
  qs("#openDocumentPageBtn").addEventListener("click", openDocumentPage);

  qs("#saveHotelBtn").addEventListener("click", () => {
    const trip = getSelectedTrip();
    if (!trip) return;

    const name = qs("#hotelNameInput").value.trim();
    const price = Number(qs("#hotelPriceInput").value || 0);
    if (!name || !price) return alert("Enter hotel name and price.");

    trip.hotel = { name, price };
    qs("#hotelNameInput").value = "";
    qs("#hotelPriceInput").value = "";
    saveAndRefresh();
    openHotelPage();
  });

  qs("#saveTransportBtn").addEventListener("click", () => {
    const trip = getSelectedTrip();
    if (!trip) return;

    const mode = qs("#transportModeInput").value;
    const details = qs("#transportDetailsInput").value.trim();
    if (!details) return alert("Enter transport details.");

    trip.transport = { mode, details };
    qs("#transportDetailsInput").value = "";
    saveAndRefresh();
    openTransportPage();
  });

  qs("#shareTicketBtn").addEventListener("click", () => {
    const trip = getSelectedTrip();
    if (!trip) return;
    const shareText = `Share options for ${trip.name}: Group / WhatsApp / Mail / Drive`;
    alert(shareText);
  });
}

/* =========================
   CHATS
========================= */

function renderGroupsList() {
  const wrap = qs("#groupsListWrap");
  wrap.innerHTML = "";

  if (!appData.groups.length) {
    wrap.innerHTML = `<div class="profile-card">No groups yet. Create your first group.</div>`;
    return;
  }

  appData.groups.forEach((group) => {
    const lastMsg = group.messages.length ? group.messages[group.messages.length - 1].text : "No messages yet";
    wrap.insertAdjacentHTML("beforeend", `
      <button class="group-card" data-group-id="${group.id}">
        <div class="group-name">${escapeHTML(group.name)}</div>
        <div class="group-city">${escapeHTML(group.city)}</div>
        <div class="group-city">${escapeHTML(lastMsg)}</div>
      </button>
    `);
  });

  qsa("[data-group-id]").forEach((card) => {
    card.addEventListener("click", () => openChatRoom(card.dataset.groupId));
  });
}

function createGroupFromForm() {
  const name = qs("#groupNameInput").value.trim();
  const city = qs("#groupCityInput").value.trim();
  const membersRaw = qs("#groupMembersInput").value.trim();

  if (!name || !city) {
    alert("Enter group name and city name.");
    return;
  }

  const members = membersRaw
    ? membersRaw.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const linkedTrip = appData.trips.find((trip) => trip.name.toLowerCase() === city.toLowerCase());

  const group = {
    id: createId("group"),
    name,
    city,
    cityTripId: linkedTrip ? linkedTrip.id : null,
    members,
    messages: [],
    media: [],
    inviteLink: `pravaas://invite/${createId("invite")}`
  };

  appData.groups.push(group);

  qs("#groupNameInput").value = "";
  qs("#groupCityInput").value = "";
  qs("#groupMembersInput").value = "";

  saveAndRefresh();
  openChatRoom(group.id);
}

function openChatRoom(groupId) {
  const group = appData.groups.find((item) => item.id === groupId);
  if (!group) return;

  appState.selectedGroupId = groupId;
  qs("#chatRoomGroupName").textContent = group.name;
  qs("#chatRoomCityName").textContent = group.city;
  qs("#chatSearchInput").value = "";
  renderChatMessages(group);
  showPage("chatRoomPage");
}

function renderChatMessages(group, searchTerm = "") {
  const wrap = qs("#chatMessagesWrap");
  wrap.innerHTML = "";

  let messages = [...group.messages];
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    messages = messages.filter((msg) => msg.text.toLowerCase().includes(term));
  }

  if (!messages.length) {
    wrap.innerHTML = `<div class="chat-bubble">No messages found.</div>`;
    return;
  }

  messages.forEach((message) => {
    wrap.insertAdjacentHTML("beforeend", `
      <div class="chat-bubble ${message.sender === "You" ? "me" : ""}">
        <div class="chat-name">${escapeHTML(message.sender)}</div>
        <div class="chat-msg">${escapeHTML(message.text)}</div>
      </div>
    `);
  });
}

function sendChatMessage(textOverride = null) {
  const group = getSelectedGroup();
  if (!group) return;

  const input = qs("#chatMessageInput");
  const text = textOverride ?? input.value.trim();
  if (!text) return;

  group.messages.push({
    id: createId("msg"),
    sender: "You",
    text
  });

  if (textOverride === null) input.value = "";
  saveAndRefresh();
  openChatRoom(group.id);
}

function openGroupInfoPage() {
  const group = getSelectedGroup();
  if (!group) return;

  qs("#groupInfoName").textContent = group.name;
  qs("#groupInfoCity").textContent = group.city;
  qs("#groupInviteLink").textContent = group.inviteLink || "-";
  qs("#groupInfoMembers").textContent = group.members.length ? group.members.join(", ") : "No members added";
  qs("#groupMediaInfo").textContent = group.media.length ? group.media.join(", ") : "No shared files yet.";
  showPage("groupInfoPage");
}

function bindChatsEvents() {
  qs("#openCreateGroupBtn").addEventListener("click", () => showPage("createGroupPage"));
  qs("#createGroupBtn").addEventListener("click", createGroupFromForm);
  qs("#sendChatBtn").addEventListener("click", () => sendChatMessage());
  qs("#openGroupInfoBtn").addEventListener("click", openGroupInfoPage);

  qs("#sendImageBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    group.media.push("Image shared");
    sendChatMessage("🖼️ Image shared");
  });

  qs("#sendDocBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    group.media.push("Document shared");
    sendChatMessage("📄 Document shared");
  });

  qs("#sendVoiceBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    group.media.push("Voice note shared");
    sendChatMessage("🎤 Voice note shared");
  });

  qs("#chatSearchInput").addEventListener("input", (e) => {
    const group = getSelectedGroup();
    if (!group) return;
    renderChatMessages(group, e.target.value);
  });

  qs("#addMemberBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    const name = qs("#addMemberInput").value.trim();
    if (!name) return alert("Enter member name.");
    if (!group.members.includes(name)) group.members.push(name);
    qs("#addMemberInput").value = "";
    saveAndRefresh();
    openGroupInfoPage();
  });

  qs("#removeMemberBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    const name = qs("#removeMemberInput").value.trim();
    if (!name) return alert("Enter member name.");
    group.members = group.members.filter((member) => member.toLowerCase() !== name.toLowerCase());
    qs("#removeMemberInput").value = "";
    saveAndRefresh();
    openGroupInfoPage();
  });

  qs("#regenInviteLinkBtn").addEventListener("click", () => {
    const group = getSelectedGroup();
    if (!group) return;
    group.inviteLink = `pravaas://invite/${createId("invite")}`;
    saveAndRefresh();
    openGroupInfoPage();
  });

  qs("#openCallBtn").addEventListener("click", () => {
    alert("Call feature UI placeholder. Real call integration needs backend/service.");
  });
}

/* =========================
   PROFILE
========================= */

function applyTheme() {
  document.body.classList.toggle("dark-theme", appData.user.theme === "dark");
}

function renderProfile() {
  qs("#profileName").textContent = appData.user.name || "User";
  qs("#profileEmail").textContent = appData.user.email || "Not set";
  qs("#profilePhone").textContent = appData.user.phone || "Not set";
  qs("#profileLanguage").textContent = appData.user.language || "English";
  qs("#profileTheme").textContent = appData.user.theme === "dark" ? "Dark" : "Light";

  qs("#notificationStatusText").textContent = appData.user.notifications ? "On" : "Off";
  qs("#notificationMuteText").textContent = appData.user.mutedUntil || "Not muted";

  qs("#storageTripsCount").textContent = String(appData.trips.length);
  qs("#storageGroupsCount").textContent = String(appData.groups.length);
  qs("#storageMessagesCount").textContent = String(
    appData.groups.reduce((sum, group) => sum + group.messages.length, 0)
  );

  qs("#inviteFriendLinkText").textContent = appData.inviteFriendLink || "Not generated yet.";

  applyTheme();
}

function bindProfileEvents() {
  qs("#openNotificationPageBtn").addEventListener("click", () => showPage("notificationPage"));
  qs("#openThemePageBtn").addEventListener("click", () => showPage("themePage"));
  qs("#openInvitePageBtn").addEventListener("click", () => showPage("invitePage"));
  qs("#openLanguagePageBtn").addEventListener("click", () => showPage("languagePage"));
  qs("#openStoragePageBtn").addEventListener("click", () => showPage("storagePage"));

  qs("#toggleNotificationsBtn").addEventListener("click", () => {
    appData.user.notifications = !appData.user.notifications;
    saveAndRefresh();
    showPage("notificationPage");
  });

  qsa(".mute-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mins = Number(btn.dataset.mute);
      const until = new Date(Date.now() + mins * 60000);
      appData.user.mutedUntil = until.toLocaleString();
      saveAndRefresh();
      showPage("notificationPage");
    });
  });

  qs("#setLightThemeBtn").addEventListener("click", () => {
    appData.user.theme = "light";
    saveAndRefresh();
    showPage("themePage");
  });

  qs("#setDarkThemeBtn").addEventListener("click", () => {
    appData.user.theme = "dark";
    saveAndRefresh();
    showPage("themePage");
  });

  qsa(".lang-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      appData.user.language = btn.dataset.lang;
      saveAndRefresh();
      showPage("languagePage");
    });
  });

  qs("#generateInviteFriendBtn").addEventListener("click", () => {
    appData.inviteFriendLink = `pravaas://friend-invite/${createId("friend")}`;
    saveAndRefresh();
    showPage("invitePage");
  });
}

/* =========================
   BACK / NAV
========================= */

function bindBackButtons() {
  qsa("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.back;
      if (mode === "main") return showMainPage(appState.activeMainPageId);
      if (mode === "trip") return showPage("tripDetailPage");
      if (mode === "chat") return showPage("chatRoomPage");
      if (mode === "booking") return showPage("bookingFolderPage");
    });
  });
}

function bindBottomNav() {
  qsa(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showMainPage(btn.dataset.page));
  });
}

/* =========================
   RENDER
========================= */

function renderAll() {
  appData = loadAppData();
  renderCurrentTripCard();
  renderTripsMainPage();
  renderPastTripsPage();
  renderGroupsList();
  renderProfile();
}

/* =========================
   INIT
========================= */

function initApp() {
  bindBottomNav();
  bindBackButtons();
  bindHomeEvents();
  bindTripsEvents();
  bindTripDetailEvents();
  bindExpenseEvents();
  bindBookingEvents();
  bindChatsEvents();
  bindProfileEvents();

  renderAll();
  showMainPage("homePage");
}

document.addEventListener("DOMContentLoaded", initApp);