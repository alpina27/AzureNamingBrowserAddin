// Azure Naming Helper - Popup

// Ressourcetyp-Definitions according to CAF-Abbeviations & naming rules
const RESOURCE_TYPES = {
  // Management & Organization
  rg:   { label: "Resource group", allowHyphen: true,  forceLower: false, maxLength: 90 },
  mg:   { label: "Management group", allowHyphen: true, forceLower: false },
  sub:  { label: "Subscription (logisch)", allowHyphen: true, forceLower: false },

  // Network
  vnet:  { label: "Virtual network", allowHyphen: true,  forceLower: false, maxLength: 64 },
  snet:  { label: "Subnet", allowHyphen: true,  forceLower: false, maxLength: 80 }, // vorher 'subnet'
  vwan:  { label: "Virtual WAN", allowHyphen: true,  forceLower: false },
  vhub:  { label: "Virtual hub", allowHyphen: true,  forceLower: false },
  ngw:   { label: "NAT gateway", allowHyphen: true,  forceLower: false },
  agw:   { label: "Application gateway", allowHyphen: true,  forceLower: false },
  bas:   { label: "Bastion", allowHyphen: true,  forceLower: false },
  afw:   { label: "Azure Firewall", allowHyphen: true,  forceLower: false },
  afwp:  { label: "Azure Firewall policy", allowHyphen: true, forceLower: false },
  nsg:   { label: "Network security group", allowHyphen: true,  forceLower: false, maxLength: 80 },
  asg:   { label: "Application security group", allowHyphen: true, forceLower: false, maxLength: 80 },
  rt:    { label: "Route table", allowHyphen: true,  forceLower: false },
  pip:   { label: "Public IP address", allowHyphen: true,  forceLower: false, maxLength: 80 },
  lbi:   { label: "Load balancer (internal)", allowHyphen: true, forceLower: false },
  lbe:   { label: "Load balancer (external)", allowHyphen: true, forceLower: false },
  erc:   { label: "ExpressRoute circuit", allowHyphen: true, forceLower: false },
  vpngw: { label: "VPN gateway", allowHyphen: true, forceLower: false },
  pdnsz: { label: "Private DNS zone", allowHyphen: true, forceLower: false, maxLength: 63 },
  dnsz:  { label: "DNS zone", allowHyphen: true,  forceLower: false, maxLength: 63 },

  // Compute
  vm:   { label: "Virtual machine", allowHyphen: true, forceLower: false, maxLength: 64 },
  vmss: { label: "Virtual machine scale set", allowHyphen: true, forceLower: false, maxLength: 64 },
  nic:  { label: "Network interface", allowHyphen: true, forceLower: false },

  // Container
  aks:  { label: "AKS cluster", allowHyphen: true, forceLower: false },
  acr:  { label: "Container Registry", allowHyphen: true, forceLower: true, maxLength: 50, invalidCharsRegex: /[^a-z0-9-]/g },
  aca:  { label: "Container Apps", allowHyphen: true, forceLower: false },
  aci:  { label: "Container instance", allowHyphen: true, forceLower: false },

  // App Services
  app:  { label: "App Service (Web App)", allowHyphen: true, forceLower: true },
  asp:  { label: "App Service plan", allowHyphen: true, forceLower: true },
  func: { label: "Function app", allowHyphen: true, forceLower: true },

  // Storage
  st:   { label: "Storage account", allowHyphen: false, forceLower: true, maxLength: 24, invalidCharsRegex: /[^a-z0-9]/g },
  dls:  { label: "Data Lake Storage account", allowHyphen: false, forceLower: true, maxLength: 24, invalidCharsRegex: /[^a-z0-9]/g },

  // Data & Insights
  kv:   { label: "Key Vault", allowHyphen: true,  forceLower: true, maxLength: 24, invalidCharsRegex: /[^a-z0-9-]/g },
  law:  { label: "Log Analytics workspace", allowHyphen: true, forceLower: true, maxLength: 63, invalidCharsRegex: /[^a-z0-9-]/g },
  appi: { label: "Application Insights", allowHyphen: true, forceLower: false },
  evhns:{ label: "Event Hubs namespace", allowHyphen: true, forceLower: false, maxLength: 63 },
  evh:  { label: "Event Hub", allowHyphen: true, forceLower: false },
  sbns: { label: "Service Bus namespace", allowHyphen: true, forceLower: false, maxLength: 50 },
  sbq:  { label: "Service Bus queue", allowHyphen: true, forceLower: false },
  cdb:  { label: "Cosmos DB account", allowHyphen: true, forceLower: true, invalidCharsRegex: /[^a-z0-9-]/g },
  redis:{ label: "Azure Cache for Redis", allowHyphen: true, forceLower: true, maxLength: 63, invalidCharsRegex: /[^a-z0-9-]/g },
  sql:  { label: "SQL server", allowHyphen: true, forceLower: true, maxLength: 63, invalidCharsRegex: /[^a-z0-9-]/g },
  sqldb:{ label: "SQL database", allowHyphen: true, forceLower: false },

  // Data & Analytics
  adf:  { label: "Data Factory", allowHyphen: true, forceLower: false },
  synw: { label: "Synapse workspace", allowHyphen: true, forceLower: true, maxLength: 50, invalidCharsRegex: /[^a-z0-9-]/g },

  // AI
  oai:  { label: "Azure OpenAI", allowHyphen: true, forceLower: false },
  srch: { label: "Azure AI Search", allowHyphen: true, forceLower: false }
};

const defaultConfig = {
  env: "dev",
  location: "weu",
  application: "",
  resourceType: "rg",
  patterns: {}
};

function loadConfig(callback) {
  chrome.storage.sync.get(["azureNamingConfig"], (data) => {
    const cfg = data.azureNamingConfig || {};

    // Backwards-Compatibility: map previous filled values like company/workload 
    cfg.env = cfg.env || "dev";
    cfg.location = cfg.location || cfg.company || "weu";
    cfg.application = cfg.application || cfg.workload || "";

    cfg.resourceType = cfg.resourceType || "rg";
    cfg.patterns = cfg.patterns || {};

    // keep values from older fields consistent
    cfg.company = cfg.location;
    cfg.workload = cfg.application;

    callback(cfg);
  });
}

function saveConfig(cfg, callback) {
  chrome.storage.sync.set({ azureNamingConfig: cfg }, () => {
    if (callback) callback();
  });
}

function generateRandomLetters(length) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

function getPatternForType(typeKey, cfg) {
  if (cfg.patterns && cfg.patterns[typeKey]) {
    return cfg.patterns[typeKey];
  }
  // Default-Pattern now with location & application
  return `${typeKey}-{Env}-{Location}-{Application}-{Rand4}`;
}

function enforceResourceRules(typeKey, name) {
  const def = RESOURCE_TYPES[typeKey];
  if (!def) return name;

  let result = name.replace(/\s+/g, "");

  if (def.forceLower) result = result.toLowerCase();
  if (def.invalidCharsRegex) result = result.replace(def.invalidCharsRegex, "");
  if (def.allowHyphen === false) result = result.replace(/-/g, "");
  if (def.maxLength && result.length > def.maxLength) result = result.substring(0, def.maxLength);

  return result;
}

function applyPattern(pattern, cfg, resourceTypeKey) {
  let name = pattern;

  name = name.replace(/{type}/gi, resourceTypeKey);
  name = name.replace(/{env}/gi, cfg.env);

  // New: Location / Application, but maintain support for old placeholders
  const loc = cfg.location || cfg.company || "loc";
  const app = cfg.application || cfg.workload || "app";

  name = name.replace(/{location}/gi, loc);
  name = name.replace(/{company}/gi, loc); // Backwards-Compatibility

  name = name.replace(/{application}/gi, app);
  name = name.replace(/{workload}/gi, app); // Backwards-Compatibility

  name = name.replace(/{rand4}/gi, generateRandomLetters(4));

  return enforceResourceRules(resourceTypeKey, name);
}

document.addEventListener("DOMContentLoaded", () => {
  const resourceTypeEl = document.getElementById("resourceType");
  const patternEl = document.getElementById("pattern");
  const envEl = document.getElementById("env");
  const locationEl = document.getElementById("location");
  const applicationEl = document.getElementById("application");
  const saveBtn = document.getElementById("saveConfig");
  const generateBtn = document.getElementById("generate");
  const resultEl = document.getElementById("result");

  // Dropdown befüllen
  Object.entries(RESOURCE_TYPES).forEach(([key, def]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${key} – ${def.label}`;
    resourceTypeEl.appendChild(opt);
  });

  loadConfig((cfg) => {
    resourceTypeEl.value = cfg.resourceType;
    envEl.value = cfg.env;
    locationEl.value = cfg.location;
    applicationEl.value = cfg.application;
    patternEl.value = getPatternForType(cfg.resourceType, cfg);

    resourceTypeEl.addEventListener("change", () => {
      patternEl.value = getPatternForType(resourceTypeEl.value, cfg);
    });
  });

  saveBtn.addEventListener("click", () => {
    loadConfig((cfg) => {
      const type = resourceTypeEl.value;

      cfg.resourceType = type;
      cfg.env = envEl.value.trim() || cfg.env;
      cfg.location = locationEl.value.trim() || cfg.location;
      cfg.application = applicationEl.value.trim() || cfg.application;

      // update old Fieldss
      cfg.company = cfg.location;
      cfg.workload = cfg.application;

      cfg.patterns[type] = patternEl.value.trim();

      saveConfig(cfg, () => {
        saveBtn.textContent = "Saved ✓";
        setTimeout(() => (saveBtn.textContent = "Save configuration"), 1200);
      });
    });
  });

  generateBtn.addEventListener("click", () => {
    loadConfig((cfg) => {
      const type = resourceTypeEl.value;

      cfg.env = envEl.value.trim() || cfg.env;
      cfg.location = locationEl.value.trim() || cfg.location;
      cfg.application = applicationEl.value.trim() || cfg.application;

      const pattern = getPatternForType(type, cfg);
      const generated = applyPattern(pattern, cfg, type);

      resultEl.value = generated;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0]) return;
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "fillName", value: generated }
        );
      });
    });
  });
});
