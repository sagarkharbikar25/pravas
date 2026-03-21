const STORAGE_KEYS = {
  APP: "pravaas_app_data"
};

function getDefaultAppData() {
  return {
    user: {
      name: "",
      email: "",
      phone: "",
      language: "English",
      notifications: true,
      mutedUntil: null,
      theme: "light"
    },
    trips: [],
    groups: [],
    inviteFriendLink: ""
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP);
    if (!raw) {
      const defaults = getDefaultAppData();
      saveAppData(defaults);
      return defaults;
    }

    const parsed = JSON.parse(raw);
    return {
      ...getDefaultAppData(),
      ...parsed,
      user: {
        ...getDefaultAppData().user,
        ...(parsed.user || {})
      },
      trips: Array.isArray(parsed.trips) ? parsed.trips : [],
      groups: Array.isArray(parsed.groups) ? parsed.groups : []
    };
  } catch (error) {
    const defaults = getDefaultAppData();
    saveAppData(defaults);
    return defaults;
  }
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(data));
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}