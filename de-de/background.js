// Azure Naming Helper - Background (Service Worker)

// Haupt-Typen (häufig genutzt) – bleiben wie bisher
const CONTEXT_TYPES_MAIN = {
  // Häufig
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

  // Netzwerk erweitert
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

  // Compute erweitert
  vmss:  "Virtual machine scale set (vmss)",
  nic:   "Network interface (nic)",

  // Container
  acr:   "Container Registry (acr)",
  aca:   "Container Apps (aca)",
  aci:   "Container instance (aci)",

  // Monitoring / Messaging
  appi:  "Application Insights (appi)",
  evhns: "Event Hubs namespace (evhns)",
  evh:   "Event Hub (evh)",
  sbns:  "Service Bus namespace (sbns)",
  sbq:   "Service Bus queue (sbq)",

  // Datenbanken & Analytics
  cdb:   "Cosmos DB (cdb)",
  redis: "Redis cache (redis)",
  sql:   "SQL server (sql)",
  sqldb: "SQL database (sqldb)",
  adf:   "Data Factory (adf)",
  synw:  "Synapse workspace (synw)",

  // AI / Search
  oai:   "Azure OpenAI (oai)",
  srch:  "Azure AI Search (srch)",

  // Management / Sub
  mg:    "Management group (mg)",
  sub:   "Subscription (sub)"
};

// Zusätzliche Typen aus der MS-Liste → Untermenü „Divers“
const CONTEXT_TYPES_DIVERS = {
  // KI & ML (zusätzlich zu oai/srch)
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
  pbi:    "Power BI embedded capacity (pbi)",
  tsi:    "Time Series Insights env (tsi)",

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

  // Container (MS-Liste, zusätzlich zu aks/acr/aca/aci)
  npsystem: "AKS system node pool (npsystem)",
  np:       "AKS user node pool (np)",
  ca:       "Container Apps (ca)",
  cae:      "Container Apps environment (cae)",
  caj:      "Container Apps job (caj)",
  cr:       "Container registry (cr)",
  ci:       "Container instance (ci)",
  sf:       "Service Fabric cluster (sf)",
  sfmc:     "Managed Service Fabric cluster (sfmc)",

  // Cosmos & Datenbanken
  cosmos: "Cosmos DB SQL database (cosmos)",
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

  // Developer Tools
  appcs: "App Configuration store (appcs)",
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
  pview: "Microsoft Purview account (pview)",
  ts:    "Template spec (ts)",

  // Migration
  migr:  "Azure Migrate project (migr)",
  dms:   "Database Migration Service (dms)",
  rsv:   "Recovery Services vault (rsv)",

  // Networking (zusätzlich zu den Main-Typen)
  cdnp:  "CDN profile (cdnp)",
  cdne:  "CDN endpoint (cdne)",
  con:   "Connection (con)",
  dnsfrs:"DNS forwarding ruleset (dnsfrs)",
  dnspr: "DNS Private Resolver (dnspr)",
  inep:  "DNS resolver inbound endpoint (in)",   // 'in' umbenannt -> inep
  outep: "DNS resolver outbound endpoint (out)", // 'out' umbenannt -> outep
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
  vpng:  "VPN gateway (Hub) (vpng)",
  vcn:   "VPN connection (vcn)",
  vst:   "VPN site (vst)",
  waf:   "Web Application Firewall policy (waf)",
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

// Kontextmenüs beim Installieren / Aktualisieren anlegen
chrome.runtime.onInstalled.addListener(() => {
  // Root-Menü
  chrome.contextMenus.create({
    id: "azureNamingRoot",
    title: "Azure Naming",
    contexts: ["editable"],
    documentUrlPatterns: ["https://portal.azure.com/*"]
  });

  // Haupt-Typen direkt unter Root
  Object.entries(CONTEXT_TYPES_MAIN).forEach(([key, label]) => {
    chrome.contextMenus.create({
      id: "azureNaming_" + key,
      parentId: "azureNamingRoot",
      title: label,
      contexts: ["editable"],
      documentUrlPatterns: ["https://portal.azure.com/*"]
    });
  });

  // Untermenü „Divers“
  chrome.contextMenus.create({
    id: "azureNaming_divers",
    parentId: "azureNamingRoot",
    title: "Divers",
    contexts: ["editable"],
    documentUrlPatterns: ["https://portal.azure.com/*"]
  });

  Object.entries(CONTEXT_TYPES_DIVERS).forEach(([key, label]) => {
    chrome.contextMenus.create({
      id: "azureNaming_divers_" + key,
      parentId: "azureNaming_divers",
      title: label,
      contexts: ["editable"],
      documentUrlPatterns: ["https://portal.azure.com/*"]
    });
  });
});

// Klick behandeln → Content Script soll für den gewählten Typ generieren
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  if (info.menuItemId && info.menuItemId.startsWith("azureNaming_")) {
    let typeKey = null;

    if (info.menuItemId.startsWith("azureNaming_divers_")) {
      typeKey = info.menuItemId.replace("azureNaming_divers_", "");
    } else {
      typeKey = info.menuItemId.replace("azureNaming_", "");
    }

    chrome.tabs.sendMessage(
      tab.id,
      {
        type: "generateForCurrentFieldWithType",
        resourceType: typeKey
      },
      () => {}
    );
  }
});
