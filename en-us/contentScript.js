// Azure Naming Helper - Content Script (with others-selection)

let lastFocusedInput = null;
let quickMenuEl = null;

/* -------------------------------------------------------
   1) RESOURCE-SPECIFIC NAMING RULES (for validation)
--------------------------------------------------------- */

const RESOURCE_TYPES = {
  rg:   { allowHyphen: true,  forceLower: false, maxLength: 90 },
  vnet: { allowHyphen: true,  forceLower: false, maxLength: 64 },
  snet: { allowHyphen: true,  forceLower: false, maxLength: 80 },
  nsg:  { allowHyphen: true,  forceLower: false, maxLength: 80 },
  vm:   { allowHyphen: true,  forceLower: false, maxLength: 64 },
  aks:  { allowHyphen: true,  forceLower: false, maxLength: 63 },

  st:   { allowHyphen: false, forceLower: true,  maxLength: 24, invalidCharsRegex: /[^a-z0-9]/g },
  kv:   { allowHyphen: true,  forceLower: true,  maxLength: 24, invalidCharsRegex: /[^a-z0-9-]/g },
  law:  { allowHyphen: true,  forceLower: true,  maxLength: 63, invalidCharsRegex: /[^a-z0-9-]/g }
};

// same main types as in the context menu
const QUICK_TYPES_MAIN = {
  rg:   "Resource group (rg)",
  vnet: "Virtual network (vnet)",
  snet: "Subnet (snet)",
  vm:   "Virtual machine (vm)",
  nsg:  "Network security group (nsg)",
  st:   "Storage account (st)",
  kv:   "Key Vault (kv)",
  law:  "Log Analytics workspace (law)",
  aks:  "AKS cluster (aks)",
  app:  "App Service / Web App (app)",
  func: "Function app (func)",
  asp:  "App Service plan (asp)",

  pip:   "Public IP address (pip)",
  vpngw: "VPN gateway (vpngw)",
  agw:   "Application gateway (agw)",
  bas:   "Bastion (bas)",
  afw:   "Azure Firewall (afw)",
  afwp:  "Firewall policy (afwp)",
  rt:    "Route table (rt)",
  vwan:  "Virtual WAN (vwan)",
  vhub:  "Virtual hub (vhub)",
  lbi:   "Load balancer internal (lbi)",
  lbe:   "Load balancer external (lbe)",
  erc:   "ExpressRoute circuit (erc)",
  pdnsz: "Private DNS zone (pdnsz)",
  dnsz:  "DNS zone (dnsz)",
  asg:   "Application security group (asg)",

  vmss:  "Virtual machine scale set (vmss)",
  nic:   "Network interface (nic)",

  acr:   "Container Registry (acr)",
  aca:   "Container Apps (aca)",
  aci:   "Container instance (aci)",

  appi:  "Application Insights (appi)",
  evhns: "Event Hubs namespace (evhns)",
  evh:   "Event Hub (evh)",
  sbns:  "Service Bus namespace (sbns)",
  sbq:   "Service Bus queue (sbq)",

  cdb:   "Cosmos DB (cdb)",
  redis: "Redis cache (redis)",
  sql:   "SQL server (sql)",
  sqldb: "SQL database (sqldb)",
  adf:   "Data Factory (adf)",
  synw:  "Synapse workspace (synw)",

  oai:   "Azure OpenAI (oai)",
  srch:  "Azure AI Search (srch)",

  mg:    "Management group (mg)",
  sub:   "Subscription (sub)"
};

// other types: as in background.js
const QUICK_TYPES_DIVERS = {
  // KI & ML
  ais:   "Azure AI Services multiservice (ais)",
  aif:   "AI Foundry account (aif)",
  proj:  "AI Project (proj)",
  hub:   "AI Hub workspace (hub)",
  avi:   "Azure AI Video Indexer (avi)",
  mlw:   "Azure ML workspace (mlw)",
  bot:   "Bot Service (bot)",
  cv:    "Computer Vision (cv)",
  cm:    "Content Moderator (cm)",
  cs:    "Content Safety (cs)",
  cstv:  "Custom Vision prediction (cstv)",
  cstvt: "Custom Vision training (cstvt)",
  di:    "Document Intelligence (di)",
  face:  "Face API (face)",
  hi:    "Health Insights (hi)",
  ir:    "Immersive Reader (ir)",
  lang:  "Language (Text Analytics) (lang)",
  spch:  "Speech Services (spch)",
  trsl:  "Translator (trsl)",

  // Analytics & IoT
  as:     "Analysis Services (as)",
  dbac:   "Databricks access connector (dbac)",
  dbw:    "Databricks workspace (dbw)",
  dec:    "Data Explorer cluster (dec)",
  dedb:   "Data Explorer database (dedb)",
  dt:     "Digital Twins instance (dt)",
  asa:    "Stream Analytics (asa)",
  synplh: "Synapse private link hub (synplh)",
  syndp:  "Synapse dedicated SQL pool (syndp)",
  synsp:  "Synapse Spark pool (synsp)",
  fc:     "Fabric capacity (fc)",
  hadoop: "HDInsight Hadoop (hadoop)",
  hbase:  "HDInsight HBase (hbase)",
  kafka:  "HDInsight Kafka (kafka)",
  spark:  "HDInsight Spark (spark)",
  storm:  "HDInsight Storm (storm)",
  mls:    "HDInsight ML Services (mls)",
  iot:    "IoT Hub (iot)",
  provs:  "IoT Provisioning Service (provs)",
  pcert:  "IoT Provisioning cert (pcert)",
  pbi:    "Power BI embedded (pbi)",
  tsi:    "Time Series Insights (tsi)",

  // Compute & Web
  ase:   "App Service Environment (ase)",
  lt:    "Load Testing instance (lt)",
  avail: "Availability set (avail)",
  arcs:  "Azure Arc server (arcs)",
  arck:  "Azure Arc Kubernetes (arck)",
  pls:   "Arc private link scope (pls)",
  arcgw: "Azure Arc gateway (arcgw)",
  ba:    "Batch account (ba)",
  cld:   "Cloud service (cld)",
  acs:   "Communication Services (acs)",
  des:   "Disk encryption set (des)",
  gal:   "Gallery (gal)",
  host:  "Web hosting environment (host)",
  it:    "Image template (it)",
  osdisk:"Managed disk OS (osdisk)",
  disk:  "Managed disk data (disk)",
  ntf:   "Notification Hub (ntf)",
  ntfns: "Notification Hub namespace (ntfns)",
  ppg:   "Proximity placement group (ppg)",
  rpc:   "Restore point collection (rpc)",
  snap:  "Snapshot (snap)",
  stapp: "Static Web App (stapp)",
  mc:    "Maintenance configuration (mc)",
  stvm:  "Storage account for VM diag (stvm)",

  // Container extra
  npsystem: "AKS system node pool (npsystem)",
  np:       "AKS user node pool (np)",
  ca:       "Container Apps (ca)",
  cae:      "Container Apps env (cae)",
  caj:      "Container Apps job (caj)",
  cr:       "Container registry (cr)",
  ci:       "Container instance (ci)",
  sf:       "Service Fabric cluster (sf)",
  sfmc:     "Managed Service Fabric cluster (sfmc)",

  // Databases extra
  cosmos: "Cosmos DB SQL db (cosmos)",
  coscas: "Cosmos DB Cassandra (coscas)",
  cosmon: "Cosmos DB Mongo (cosmon)",
  cosno:  "Cosmos DB NoSQL (cosno)",
  costab: "Cosmos DB Table (costab)",
  cosgrm: "Cosmos DB Gremlin (cosgrm)",
  cospos: "Cosmos DB PostgreSQL (cospos)",
  amr:    "Azure Managed Redis (amr)",
  sqlja:  "SQL job agent (sqlja)",
  sqlep:  "SQL elastic pool (sqlep)",
  mysql:  "MySQL server (mysql)",
  psql:   "PostgreSQL server (psql)",
  sqlmi:  "SQL managed instance (sqlmi)",

  // Dev-Tools
  appcs: "App Configuration (appcs)",
  map:   "Maps account (map)",
  sigr:  "SignalR (sigr)",
  wps:   "Web PubSub (wps)",

  // DevOps
  amg:   "Azure Managed Grafana (amg)",

  // Integration
  apim:  "API Management (apim)",
  ia:    "Integration account (ia)",
  logic: "Logic App (logic)",
  sbt:   "Service Bus topic (sbt)",
  sbts:  "Service Bus topic subscription (sbts)",

  // Management & Governance
  aa:    "Automation account (aa)",
  ag:    "Action group (ag)",
  dcr:   "Data collection rule (dcr)",
  apr:   "Alert processing rule (apr)",
  dce:   "Data collection endpoint (dce)",
  script:"Deployment script (script)",
  log:   "Log Analytics workspace (log)",
  pack:  "Log Analytics query pack (pack)",
  pview: "Microsoft Purview (pview)",
  ts:    "Template spec (ts)",

  // Migration
  migr:  "Azure Migrate project (migr)",
  dms:   "Database Migration Service (dms)",
  rsv:   "Recovery Services vault (rsv)",

  // Networking extra
  cdnp:  "CDN profile (cdnp)",
  cdne:  "CDN endpoint (cdne)",
  con:   "Connection (con)",
  dnsfrs:"DNS forwarding ruleset (dnsfrs)",
  dnspr: "DNS Private Resolver (dnspr)",
  inep:  "DNS inbound endpoint (in)",
  outep: "DNS outbound endpoint (out)",
  erd:   "ExpressRoute Direct (erd)",
  ergw:  "ExpressRoute gateway (ergw)",
  afd:   "Front Door (afd)",
  fde:   "Front Door endpoint (fde)",
  fdfp:  "Front Door WAF policy (fdfp)",
  ipg:   "IP group (ipg)",
  ippre: "Public IP prefix (ippre)",
  rf:    "Route filter (rf)",
  rtserv:"Route server (rtserv)",
  se:    "Service endpoint policy (se)",
  traf:  "Traffic Manager profile (traf)",
  udr:   "User-defined route (udr)",
  vgw:   "VNet gateway (vgw)",
  vnm:   "Virtual Network Manager (vnm)",
  peer:  "VNet peering (peer)",
  nsp:   "Network security perimeter (nsp)",
  nw:    "Network Watcher (nw)",
  pl:    "Private link service (pl)",
  pep:   "Private endpoint (pep)",

  // Security
  kvmhsm:"Key Vault managed HSM (kvmhsm)",
  id:    "User-assigned managed identity (id)",
  sshkey:"SSH key (sshkey)",
  vpng:  "VPN gateway (vpng)",
  vcn:   "VPN connection (vcn)",
  vst:   "VPN site (vst)",
  waf:   "WAF policy (waf)",
  wafrg: "WAF rule group (wafrg)",

  // Storage
  bvault:"Backup vault (bvault)",
  bkpol: "Backup policy (bkpol)",
  share: "File share (share)",
  sss:   "Storage Sync Service (sss)",

  // Virtual Desktop
  vdpool:   "Virtual Desktop host pool (vdpool)",
  vdag:     "Virtual Desktop app group (vdag)",
  vdws:     "Virtual Desktop workspace (vdws)",
  vdscaling:"Virtual Desktop scaling plan (vdscaling)"
};

const defaultConfig = {
  env: "dev",
  location: "weu",
  application: "",
  resourceType: "rg",
  patterns: {}
};

/* -------------------------------------------------------
   2) LOAD CONFIG
--------------------------------------------------------- */

function loadConfig(callback) {
  chrome.storage.sync.get(["azureNamingConfig"], function(data) {
    var cfg = data.azureNamingConfig || {};
    if (!cfg.env) cfg.env = defaultConfig.env;
    cfg.location = cfg.location || cfg.company || defaultConfig.location;
    cfg.application = cfg.application || cfg.workload || defaultConfig.application;
    if (!cfg.resourceType) cfg.resourceType = defaultConfig.resourceType;
    if (!cfg.patterns) cfg.patterns = {};
    cfg.company = cfg.location;
    cfg.workload = cfg.application;
    callback(cfg);
  });
}

/* -------------------------------------------------------
   3) GENERATE NAME
--------------------------------------------------------- */

function generateRandomLetters(count) {
  var chars = "abcdefghijklmnopqrstuvwxyz";
  var result = "";
  for (var i = 0; i < count; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getPattern(typeKey, cfg) {
  if (cfg.patterns && cfg.patterns[typeKey]) {
    return cfg.patterns[typeKey];
  }
  return typeKey + "-{Env}-{Location}-{Application}-{Rand4}";
}

function enforceRules(typeKey, name) {
  var r = RESOURCE_TYPES[typeKey];
  if (!r) return name;
  var out = name.replace(/\s+/g, "");
  if (r.forceLower) out = out.toLowerCase();
  if (r.invalidCharsRegex) out = out.replace(r.invalidCharsRegex, "");
  if (r.allowHyphen === false) out = out.replace(/-/g, "");
  if (r.maxLength && out.length > r.maxLength) out = out.slice(0, r.maxLength);
  return out;
}

function applyPattern(typeKey, cfg) {
  var pattern = getPattern(typeKey, cfg);
  var n = pattern;

  n = n.replace(/{env}/gi, cfg.env);
  var loc = cfg.location || cfg.company || "loc";
  var app = cfg.application || cfg.workload || "app";

  n = n.replace(/{location}/gi, loc);
  n = n.replace(/{company}/gi, loc);
  n = n.replace(/{application}/gi, app);
  n = n.replace(/{workload}/gi, app);
  n = n.replace(/{rand4}/gi, generateRandomLetters(4));

  return enforceRules(typeKey, n);
}

/* -------------------------------------------------------
   4) FIELD-FILTER & SET
--------------------------------------------------------- */

function isGlobalSearchInput(el) {
  if (!el) return true;
  var aria = (el.getAttribute("aria-label") || "").toLowerCase();
  var ph = (el.getAttribute("placeholder") || "").toLowerCase();
  if (aria.indexOf("search") !== -1 || ph.indexOf("search") !== -1) return true;
  if (aria.indexOf("suchen") !== -1 || ph.indexOf("suchen") !== -1) return true;
  return false;
}

function setInputValue(val) {
  var el = lastFocusedInput;
  if (!el || !document.contains(el)) return false;
  if (isGlobalSearchInput(el)) return false;
  if (el.readOnly || el.disabled) return false;

  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    el.focus();
    el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  var role = el.getAttribute("role");
  if (role === "textbox" || el.isContentEditable) {
    el.focus();
    el.textContent = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  return false;
}

/* -------------------------------------------------------
   5) GENERATE & FILL
--------------------------------------------------------- */

function generateAndFill() {
  loadConfig(function(cfg) {
    var t = cfg.resourceType || "rg";
    var name = applyPattern(t, cfg);
    setInputValue(name);
  });
}

function generateAndFillForType(typeKeyOverride) {
  loadConfig(function(cfg) {
    var t = typeKeyOverride || cfg.resourceType || "rg";
    var name = applyPattern(t, cfg);
    setInputValue(name);
  });
}

/* -------------------------------------------------------
   6) FOCUS-HANDLER
--------------------------------------------------------- */

document.addEventListener("focusin", function(e) {
  var el = e.target;
  if (!el) return;

  if (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.getAttribute("role") === "textbox" ||
    el.isContentEditable
  ) {
    if (isGlobalSearchInput(el)) return;
    lastFocusedInput = el;
  }
}, true);

/* -------------------------------------------------------
   7) SHORTCUT: Strg + Alt + X
--------------------------------------------------------- */

document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.altKey && (e.key === "x" || e.key === "X")) {
    e.preventDefault();
    e.stopPropagation();
    generateAndFill();
  }
}, true);

/* -------------------------------------------------------
   8) FLOATING BUTTON + QUICK-MENU (inkl. Diverse)
--------------------------------------------------------- */

function closeQuickMenu() {
  if (quickMenuEl) {
    quickMenuEl.remove();
    quickMenuEl = null;
  }
}

function openQuickMenu() {
  if (quickMenuEl) {
    closeQuickMenu();
    return;
  }

  var menu = document.createElement("div");
  menu.id = "azure-naming-helper-menu";

  var s = menu.style;
  s.position = "fixed";
  s.bottom = "40px";
  s.right = "10px";
  s.zIndex = "999999";
  s.background = "#ffffff";
  s.border = "1px solid #ccc";
  s.borderRadius = "6px";
  s.padding = "4px 0";
  s.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  s.maxHeight = "320px";
  s.overflowY = "auto";
  s.minWidth = "260px";
  s.fontSize = "12px";

  function addItem(key, label, isMain) {
    var item = document.createElement("div");
    item.textContent = label;
    item.dataset.typeKey = key;
    var baseBg = isMain ? "#f3f9ff" : "#fff";

    item.style.padding = "4px 8px";
    item.style.cursor = "pointer";
    item.style.background = baseBg;

    item.addEventListener("mouseenter", function() {
      item.style.background = "#e5f1ff";
    });
    item.addEventListener("mouseleave", function() {
      item.style.background = baseBg;
    });

    item.addEventListener("click", function(e) {
      e.stopPropagation();
      generateAndFillForType(item.dataset.typeKey);
      closeQuickMenu();
    });

    menu.appendChild(item);
  }

  // Main-Types
  Object.entries(QUICK_TYPES_MAIN).forEach(([k, label]) => {
    addItem(k, label, true);
  });

  // Separator & Heading „Divers“
  var sep = document.createElement("div");
  sep.textContent = "— Divers —";
  sep.style.padding = "4px 8px";
  sep.style.fontSize = "11px";
  sep.style.color = "#555";
  sep.style.borderTop = "1px solid #ddd";
  sep.style.marginTop = "4px";
  sep.style.marginBottom = "2px";
  menu.appendChild(sep);

  // Divers-Types
  Object.entries(QUICK_TYPES_DIVERS).forEach(([k, label]) => {
    addItem(k, label, false);
  });

  document.body.appendChild(menu);
  quickMenuEl = menu;

  setTimeout(() => {
    document.addEventListener("click", handleOutsideClickOnce, { once: true });
  }, 0);
}

function handleOutsideClickOnce(e) {
  if (quickMenuEl && !quickMenuEl.contains(e.target)) {
    closeQuickMenu();
  }
}

function injectButton() {
  if (document.getElementById("azure-naming-helper-btn")) return;

  var b = document.createElement("button");
  b.id = "azure-naming-helper-btn";
  b.textContent = "AZ Name";

  var style = b.style;
  style.position = "fixed";
  style.bottom = "10px";
  style.right = "10px";
  style.zIndex = "999999";
  style.background = "#0078d4";
  style.color = "#fff";
  style.padding = "6px 10px";
  style.borderRadius = "6px";
  style.cursor = "pointer";
  style.border = "1px solid #0078d4";
  style.fontSize = "12px";

  b.onclick = function(e) {
    e.stopPropagation();
    openQuickMenu();
  };

  document.body.appendChild(b);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  injectButton();
} else {
  document.addEventListener("DOMContentLoaded", injectButton);
}

/* -------------------------------------------------------
   9) MESSAGE-HANDLER
--------------------------------------------------------- */

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
  if (msg.type === "fillName" && msg.value) {
    var ok = setInputValue(msg.value);
    if (respond) respond({ success: ok });
    return true;
  }

  if (msg.type === "generateForCurrentField") {
    generateAndFill();
    if (respond) respond({ success: true });
    return true;
  }

  if (msg.type === "generateForCurrentFieldWithType" && msg.resourceType) {
    generateAndFillForType(msg.resourceType);
    if (respond) respond({ success: true });
    return true;
  }

  if (msg.type === "getContext") {
    if (respond) respond({ resourceType: null });
    return true;
  }

  return false;
});
