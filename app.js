import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const DEFAULT_CLOUD_API_URL = "https://serverless.roboflow.com/waste-classification-uwqfy/1";

const cases = [
  { name: "Paper", type: "Recyclable", route: "recycle", confidence: 96, icon: "recycle", rule: "Paper detected. Recycle bin opens.", weight: 0.01, fillImpact: 0.8, quantity: 1 },
  { name: "Notebook", type: "Recyclable", route: "recycle", confidence: 94, icon: "recycle", rule: "Notebook detected. Recycle bin opens.", weight: 0.18, fillImpact: 4.2, quantity: 1 },
  { name: "Cardboard", type: "Recyclable", route: "recycle", confidence: 95, icon: "recycle", rule: "Cardboard detected. Recycle bin opens.", weight: 0.12, fillImpact: 4, quantity: 1 },
  { name: "Plastic Bottle", type: "Recyclable", route: "recycle", confidence: 95, icon: "recycle", rule: "Plastic bottle detected. Recycle bin opens.", weight: 0.04, fillImpact: 2.5, quantity: 1 },
  { name: "Hard Plastic Container", type: "Recyclable", route: "recycle", confidence: 93, icon: "recycle", rule: "Hard plastic container detected. Recycle bin opens.", weight: 0.08, fillImpact: 3, quantity: 1 },
  { name: "Steel Bottle", type: "Recyclable", route: "recycle", confidence: 93, icon: "recycle", rule: "Steel bottle detected. Recycle bin opens.", weight: 0.28, fillImpact: 2.8, quantity: 1 },
  { name: "Sip Bottle Cup", type: "Recyclable", route: "recycle", confidence: 92, icon: "recycle", rule: "Sipper bottle or cup detected. Recycle bin opens.", weight: 0.05, fillImpact: 2.2, quantity: 1 },
  { name: "Glass Bottle", type: "Recyclable", route: "recycle", confidence: 94, icon: "recycle", rule: "Glass bottle detected. Recycle bin opens.", weight: 0.32, fillImpact: 3, quantity: 1 },
  { name: "Metal Can", type: "Recyclable", route: "recycle", confidence: 94, icon: "recycle", rule: "Metal can detected. Recycle bin opens.", weight: 0.06, fillImpact: 1.5, quantity: 1 },
  { name: "Food Waste", type: "Organic", route: "organic", confidence: 94, icon: "leaf", rule: "Food waste detected. Organic bin opens.", weight: 0.25, fillImpact: 3.5, quantity: 1 },
  { name: "Banana Peel", type: "Organic", route: "organic", confidence: 93, icon: "leaf", rule: "Banana peel detected. Organic bin opens.", weight: 0.05, fillImpact: 2, quantity: 1 },
  { name: "Apple", type: "Organic", route: "organic", confidence: 93, icon: "leaf", rule: "Apple detected. Organic bin opens.", weight: 0.15, fillImpact: 2.5, quantity: 1 },
  { name: "Chip Packet", type: "Non-Recyclable", route: "reject", confidence: 91, icon: "trash-2", rule: "Chip packet detected. Non-recycle bin opens.", weight: 0.02, fillImpact: 1.5, quantity: 1 },
  { name: "Biscuit Packet", type: "Non-Recyclable", route: "reject", confidence: 91, icon: "trash-2", rule: "Biscuit packet detected. Non-recycle bin opens.", weight: 0.02, fillImpact: 1.6, quantity: 1 },
  { name: "Plastic Cover", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Plastic cover detected. Non-recycle bin opens.", weight: 0.01, fillImpact: 1.2, quantity: 1 },
  { name: "Pen", type: "Non-Recyclable", route: "reject", confidence: 89, icon: "trash-2", rule: "Pen detected. Non-recycle bin opens.", weight: 0.01, fillImpact: 0.7, quantity: 1 },
  { name: "Rubber", type: "Non-Recyclable", route: "reject", confidence: 89, icon: "trash-2", rule: "Rubber or eraser detected. Non-recycle bin opens.", weight: 0.02, fillImpact: 0.9, quantity: 1 },
  { name: "Phone", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Phone or e-waste detected. Non-recycle bin opens.", weight: 0.18, fillImpact: 2.4, quantity: 1 },
  { name: "Phone Case", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Phone case detected. Non-recycle bin opens.", weight: 0.04, fillImpact: 1.2, quantity: 1 },
  { name: "Battery", type: "Non-Recyclable", route: "reject", confidence: 91, icon: "trash-2", rule: "Battery detected. Non-recycle bin opens for safe manual handling.", weight: 0.03, fillImpact: 0.8, quantity: 1 },
  { name: "Shoe", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Shoe detected. Non-recycle bin opens.", weight: 0.7, fillImpact: 6, quantity: 1 },
  { name: "Broken Slipper", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Broken slipper detected. Non-recycle bin opens.", weight: 0.32, fillImpact: 4.8, quantity: 1 },
  { name: "Rubber Slipper", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Rubber slipper detected. Non-recycle bin opens.", weight: 0.28, fillImpact: 4.3, quantity: 1 },
  { name: "Leather Slipper", type: "Non-Recyclable", route: "reject", confidence: 90, icon: "trash-2", rule: "Leather slipper detected. Non-recycle bin opens.", weight: 0.38, fillImpact: 4.9, quantity: 1 },
  { name: "Cloth", type: "Non-Recyclable", route: "reject", confidence: 89, icon: "trash-2", rule: "Cloth detected. Non-recycle bin opens.", weight: 0.25, fillImpact: 4, quantity: 1 },
  { name: "Mixed Covered Bag", type: "Warning", route: "warning", confidence: 62, icon: "triangle-alert", rule: "Covered or mixed waste detected. Warning beep only. No bin opens.", weight: 0, fillImpact: 0, quantity: 1 }
];

const state = {
  route: "idle",
  current: cases[0],
  busy: false,
  liveAi: false,
  model: null,
  modelType: "",
  modelLoading: false,
  modelLoadPromise: null,
  aiWorker: null,
  aiWorkerReady: false,
  aiWorkerError: "",
  aiRequestId: 0,
  aiPending: new Map(),
  cloudApi: {
    url: localStorage.getItem("ecoSortApiUrl") || DEFAULT_CLOUD_API_URL,
    key: localStorage.getItem("ecoSortApiKey") || "",
    enabled: Boolean((localStorage.getItem("ecoSortApiUrl") || DEFAULT_CLOUD_API_URL) && localStorage.getItem("ecoSortApiKey"))
  },
  customLabels: [],
  customPreprocess: "normalized",
  lastLiveClass: "",
  lastLiveAt: 0,
  liveInferencing: false,
  liveCandidateName: "",
  liveCandidateCount: 0,
  levels: { recycle: 0, organic: 0, reject: 0 },
  weights: { recycle: 0, organic: 0, reject: 0 },
  lastIncrease: null,
  warningCount: 0,
  warningLog: [],
  reports: [],
  fullAlerts: [],
  acknowledgedAlerts: []
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const scriptLoads = {};
const scanCanvas = document.createElement("canvas");
scanCanvas.width = 224;
scanCanvas.height = 224;
const scanCtx = scanCanvas.getContext("2d", { willReadFrequently: true });

const titles = {
  control: "Live Automatic Sorting",
  twin: "Smart Bin Simulator",
  percentage: "Bin Percentage Monitor",
  reset: "Reset Cleaned Bins",
  report: "Collection Report",
  hardware: "Hardware Signal Monitor"
};

function loadExternalScript(src) {
  if (scriptLoads[src]) return scriptLoads[src];
  scriptLoads[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      if (existing.dataset.loaded === "true") resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptLoads[src];
}

const els = {
  screenTitle: $("#screenTitle"),
  views: $$(".view"),
  navItems: $$(".nav-item"),
  cameraButton: $("#cameraButton"),
  liveAiButton: $("#liveAiButton"),
  cameraFeed: $("#cameraFeed"),
  cameraState: $("#cameraState"),
  modelState: $("#modelState"),
  sampleRow: $("#sampleRow"),
  objectName: $("#objectName"),
  decisionText: $("#decisionText"),
  decisionCard: $("#decisionCard"),
  routeName: $("#routeName"),
  routeRule: $("#routeRule"),
  confidenceValue: $("#confidenceValue"),
  confidenceBar: $("#confidenceBar"),
  boxLabel: $("#boxLabel"),
  detectBox: $("#detectBox"),
  timeline: $("#timeline"),
  notification: $("#notification"),
  noticeTitle: $("#noticeTitle"),
  noticeText: $("#noticeText"),
  themeButton: $("#themeButton"),
  autoDemo: $("#autoDemo"),
  visualTwin: $("#visualTwin"),
  wasteDrop: $("#wasteDrop"),
  recycleLevel: $("#recycleLevel"),
  organicLevel: $("#organicLevel"),
  rejectLevel: $("#rejectLevel"),
  recycleLevelBar: $("#recycleLevelBar"),
  organicLevelBar: $("#organicLevelBar"),
  rejectLevelBar: $("#rejectLevelBar"),
  recycleWeight: $("#recycleWeight"),
  organicWeight: $("#organicWeight"),
  rejectWeight: $("#rejectWeight"),
  servoState: $("#servoState"),
  buzzerState: $("#buzzerState"),
  sensorState: $("#sensorState"),
  alertState: $("#alertState"),
  acceptAlerts: $("#acceptAlerts"),
  alertList: $("#alertList"),
  resetBins: $("#resetBins"),
  resetRecycle: $("#resetRecycle"),
  resetOrganic: $("#resetOrganic"),
  resetReject: $("#resetReject"),
  downloadReport: $("#downloadReport"),
  reportResetCount: $("#reportResetCount"),
  reportWarningCount: $("#reportWarningCount"),
  reportLastReset: $("#reportLastReset"),
  reportTable: $("#reportTable"),
  cloudAiState: $("#cloudAiState"),
  apiUrlInput: $("#apiUrlInput"),
  apiKeyInput: $("#apiKeyInput"),
  saveApiSettings: $("#saveApiSettings")
};

if (window.lucide) window.lucide.createIcons();
els.modelState.textContent = "AI ready on demand";
hydrateApiSettings();

function showView(id) {
  els.views.forEach((view) => view.classList.toggle("active", view.id === id));
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === id));
  els.screenTitle.textContent = titles[id];
  if (id !== "control") tickNotify(`${titles[id]} opened`, "Page switched successfully.", "page");
  requestAnimationFrame(resizeScene);
}

function buildSamples() {
  els.sampleRow.innerHTML = cases.map((item) => `
    <button class="sample" data-name="${item.name}">
      <strong>${item.name}</strong>
      <span>${item.type}</span>
    </button>
  `).join("");
  els.sampleRow.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = cases.find((entry) => entry.name === button.dataset.name);
      tickNotify(`${item.name} selected`, `${item.type} route simulation started.`, "sample");
      detectWaste(item);
    });
  });
}

function hydrateApiSettings() {
  if (els.apiUrlInput) els.apiUrlInput.value = state.cloudApi.url;
  if (els.apiKeyInput) els.apiKeyInput.value = state.cloudApi.key;
  updateCloudAiState();
}

function saveApiSettings() {
  const url = normalizeCloudApiUrl(els.apiUrlInput?.value.trim() || DEFAULT_CLOUD_API_URL);
  const key = els.apiKeyInput?.value.trim() || "";
  state.cloudApi = { url, key, enabled: Boolean(url && key) };
  if (els.apiUrlInput) els.apiUrlInput.value = url;
  if (url) localStorage.setItem("ecoSortApiUrl", url);
  else localStorage.removeItem("ecoSortApiUrl");
  if (key) localStorage.setItem("ecoSortApiKey", key);
  else localStorage.removeItem("ecoSortApiKey");
  updateCloudAiState();
  tickNotify(state.cloudApi.enabled ? "Cloud AI saved" : "Cloud AI disabled", state.cloudApi.enabled ? "Live AI will use the API first." : "Local Live AI fallback is active.", "save");
}

function normalizeCloudApiUrl(value) {
  const endpoint = value.trim();
  if (!endpoint) return DEFAULT_CLOUD_API_URL;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) return endpoint.replace(/\/$/, "");
  const modelId = endpoint.includes("/") ? endpoint : `${endpoint}/1`;
  return `https://serverless.roboflow.com/${modelId}`.replace(/\/$/, "");
}

function updateCloudAiState() {
  if (!els.cloudAiState) return;
  els.cloudAiState.textContent = state.cloudApi.enabled ? "Cloud API enabled" : "Local + optional cloud API";
}

function toggleTheme() {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
  tickNotify("Theme changed", `${document.body.dataset.theme === "dark" ? "Dark" : "Light"} mode enabled.`, "theme");
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    els.cameraFeed.srcObject = stream;
    await els.cameraFeed.play();
    els.cameraFeed.classList.add("active");
    els.cameraState.textContent = "Laptop webcam live";
  notify("Camera online", "Now show the waste item in front of the laptop camera.", "normal");
    tickNotify("Camera started", "Webcam feed is ready.", "camera");
  } catch {
    els.cameraState.textContent = "Simulator mode";
    notify("Camera simulator active", "Browser camera permission is blocked, so demo buttons simulate AI detection.", "warning");
    playSound("warning");
  }
}

async function ensureModelReady() {
  if (state.model) return true;
  if (state.modelLoadPromise) return state.modelLoadPromise;

  state.modelLoading = true;
  els.modelState.textContent = "Loading AI";
  els.liveAiButton.disabled = true;
  await new Promise((resolve) => requestAnimationFrame(resolve));

  state.modelLoadPromise = loadBrowserModel()
    .then((ready) => ready)
    .finally(() => {
      state.modelLoading = false;
      state.modelLoadPromise = null;
      els.liveAiButton.disabled = false;
    });

  return state.modelLoadPromise;
}

async function loadBrowserModel() {
  startAiWorkerInBackground();
  state.model = { vision: true };
  state.modelType = "vision-lite";
  els.modelState.textContent = "Fast Live AI ready";
  notify("Fast Live AI ready", "Camera vision is active now. Trained AI will join automatically when the worker finishes loading.", "normal");
  return true;
}

function startAiWorkerInBackground() {
  if (!window.Worker || state.aiWorker || state.aiWorkerReady) return;
  try {
    const worker = new Worker("./ai-worker.js?v=worker-2");
    state.aiWorker = worker;
    worker.onmessage = (event) => {
      const message = event.data || {};
      if (message.type === "ready") {
        state.aiWorkerReady = true;
        state.customLabels = message.labels || [];
        state.customPreprocess = message.preprocess || "normalized";
        state.model = { worker: true };
        state.modelType = "custom-worker";
        els.modelState.textContent = "Custom AI ready";
        notify("Custom AI model ready", "Trained model is now running in the background worker.", "normal");
        return;
      }
      if (message.type === "result") {
        const pending = state.aiPending.get(message.id);
        if (!pending) return;
        state.aiPending.delete(message.id);
        pending(message);
        return;
      }
      if (message.type === "error") {
        state.aiWorkerError = message.message || "AI worker failed";
        els.modelState.textContent = "Fast Live AI";
      }
    };
    worker.onerror = (error) => {
      state.aiWorkerError = error?.message || "AI worker script failed";
      els.modelState.textContent = "Fast Live AI";
    };
  } catch (error) {
    state.aiWorkerError = error?.message || "AI worker could not start";
  }
}

async function loadCustomModel() {
  if (!window.Worker) return false;
  return new Promise((resolve) => {
    try {
      els.modelState.textContent = "Loading AI worker";
      const worker = new Worker("./ai-worker.js?v=worker-2");
      let settled = false;
      const finish = (ready) => {
        if (settled) return;
        settled = true;
        resolve(ready);
      };
      const timeout = setTimeout(() => {
        state.aiWorkerError = "AI model loading is taking too long. Refresh and try again.";
        worker.terminate();
        finish(false);
      }, 120000);

      worker.onmessage = (event) => {
        const message = event.data || {};
        if (message.type === "ready") {
          clearTimeout(timeout);
          state.aiWorker = worker;
          state.aiWorkerReady = true;
          state.customLabels = message.labels || [];
          state.customPreprocess = message.preprocess || "normalized";
          state.model = { worker: true };
          state.modelType = "custom-worker";
          els.modelState.textContent = "Custom AI ready";
          notify("Custom AI model ready", "AI runs in background worker, so UI stays smooth.", "normal");
          finish(true);
          return;
        }
        if (message.type === "result") {
          const pending = state.aiPending.get(message.id);
          if (!pending) return;
          state.aiPending.delete(message.id);
          pending(message);
          return;
        }
        if (message.type === "error") {
          state.aiWorkerError = message.message || "AI worker failed";
          clearTimeout(timeout);
          worker.terminate();
          finish(false);
        }
      };
      worker.onerror = (error) => {
        state.aiWorkerError = error?.message || "AI worker script failed";
        clearTimeout(timeout);
        worker.terminate();
        finish(false);
      };
    } catch (error) {
      state.aiWorkerError = error?.message || "AI worker could not start";
      resolve(false);
    }
  });
}

async function toggleLiveAi() {
  if (state.liveAi) {
    state.liveAi = false;
    state.liveCandidateName = "";
    state.liveCandidateCount = 0;
    els.liveAiButton.innerHTML = '<i data-lucide="brain-circuit"></i>Live AI';
    if (window.lucide) window.lucide.createIcons();
    notify("Live AI paused", "Simulator buttons are still available.", "normal");
    tickNotify("Live AI paused", "Camera detection stopped.", "aiOff");
    return;
  }
  if (!els.cameraFeed.classList.contains("active")) await startCamera();
  const modelReady = await ensureModelReady();
  if (!modelReady || !state.model) {
    notify("Simulator mode ready", "Model is not ready, but sample buttons can still run the full animation demo.", "warning");
    return;
  }
  state.liveAi = true;
  state.liveCandidateName = "";
  state.liveCandidateCount = 0;
  els.liveAiButton.innerHTML = '<i data-lucide="pause"></i>Live AI On';
  if (window.lucide) window.lucide.createIcons();
  notify("Live AI enabled", "Show bottle, banana or apple to the webcam.", "normal");
  tickNotify("Live AI enabled", "Scanning one object cycle now.", "aiOn");
  liveDetectLoop();
}

async function liveDetectLoop() {
  if (!state.liveAi || !state.model || state.busy) {
    if (state.liveAi) setTimeout(liveDetectLoop, 800);
    return;
  }
  if (els.cameraFeed.readyState >= 2) {
    if (state.modelType === "custom" || state.modelType === "custom-worker" || state.modelType === "vision-lite") {
      if (state.liveInferencing) {
        setTimeout(liveDetectLoop, 900);
        return;
      }
      state.liveInferencing = true;
      const mapped = await classifyCustomFrame();
      state.liveInferencing = false;
      const now = Date.now();
      if (mapped && isStableLiveDetection(mapped) && (mapped.name !== state.lastLiveClass || now - state.lastLiveAt > 5200)) {
        state.lastLiveClass = mapped.name;
        state.lastLiveAt = now;
        await detectWaste(mapped);
      }
      setTimeout(liveDetectLoop, 1200);
      return;
    }
    const predictions = await state.model.detect(els.cameraFeed);
    const best = predictions.filter((p) => p.score > 0.55).sort((a, b) => b.score - a.score)[0];
    if (best) {
      const mapped = mapPrediction(best);
      const now = Date.now();
      if (mapped && (mapped.name !== state.lastLiveClass || now - state.lastLiveAt > 5500)) {
        state.lastLiveClass = mapped.name;
        state.lastLiveAt = now;
        mapped.confidence = Math.round(best.score * 100);
        await detectWaste(mapped);
      }
    }
  }
  setTimeout(liveDetectLoop, 1000);
}

async function classifyCustomFrame() {
  if (state.cloudApi.enabled) {
    const cloudResult = await classifyWithCloudApi();
    if (cloudResult) return cloudResult;
  }
  if (state.modelType === "vision-lite") return classifyVisionLite();
  if (state.modelType === "custom-worker") return classifyWithWorker();
  if (!window.tf) return null;
  const video = els.cameraFeed;
  const tensor = window.tf.tidy(() => {
    const frame = window.tf.browser.fromPixels(video);
    const [height, width] = frame.shape;
    const cropWidth = Math.floor(width * 0.68);
    const cropHeight = Math.floor(height * 0.62);
    const left = Math.floor((width - cropWidth) / 2);
    const top = Math.floor((height - cropHeight) / 2);
    const crop = frame
      .slice([top, left, 0], [cropHeight, cropWidth, 3])
      .resizeBilinear([224, 224])
      .toFloat();
    const prepared = state.customPreprocess === "embedded_mobilenet_v2"
      ? crop
      : crop.sub(127.5).div(127.5);
    return prepared.expandDims(0);
  });
  const prediction = state.model.predict(tensor);
  const scores = Array.from(await prediction.data());
  tensor.dispose();
  prediction.dispose();
  await window.tf.nextFrame();
  const bestIndex = scores.indexOf(Math.max(...scores));
  const confidence = Math.round(scores[bestIndex] * 100);
  if (confidence < 86) return null;
  const label = state.customLabels[bestIndex];
  const mapped = mapCustomLabel(label);
  if (!mapped) return null;
  return { ...mapped, confidence };
}

async function classifyWithWorker() {
  if (!state.aiWorkerReady || !state.aiWorker || !scanCtx) return null;
  const imageData = captureScanImageData();
  if (!imageData) return null;
  const id = state.aiRequestId += 1;
  const response = await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      state.aiPending.delete(id);
      resolve(null);
    }, 5000);
    state.aiPending.set(id, (message) => {
      clearTimeout(timeout);
      resolve(message);
    });
    state.aiWorker.postMessage({ type: "classify", id, imageData });
  });
  if (!response || response.error || response.confidence < 86) return null;
  const mapped = mapCustomLabel(response.label);
  if (!mapped) return null;
  return { ...mapped, confidence: response.confidence };
}

function captureScanImageData() {
  const video = els.cameraFeed;
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) return null;
  const cropWidth = Math.floor(width * 0.68);
  const cropHeight = Math.floor(height * 0.62);
  const left = Math.floor((width - cropWidth) / 2);
  const top = Math.floor((height - cropHeight) / 2);
  scanCtx.clearRect(0, 0, 224, 224);
  scanCtx.drawImage(video, left, top, cropWidth, cropHeight, 0, 0, 224, 224);
  return scanCtx.getImageData(0, 0, 224, 224);
}

async function classifyWithCloudApi() {
  if (!state.cloudApi.url || !state.cloudApi.key || !scanCtx) return null;
  const imageData = captureScanImageData();
  if (!imageData) return null;
  scanCtx.putImageData(imageData, 0, 0);
  const imageBase64 = scanCanvas.toDataURL("image/jpeg", 0.86).split(",")[1];
  const endpoint = normalizeCloudApiUrl(state.cloudApi.url);
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${endpoint}${separator}api_key=${encodeURIComponent(state.cloudApi.key)}`;
  try {
    els.modelState.textContent = "Cloud AI scanning";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: imageBase64
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const result = await response.json();
    const predictions = Array.isArray(result.predictions) ? result.predictions : [];
    const best = predictions
      .filter((prediction) => (prediction.confidence ?? prediction.score ?? 0) > 0.25)
      .sort((a, b) => (b.confidence ?? b.score ?? 0) - (a.confidence ?? a.score ?? 0))[0];
    if (!best) return null;
    const label = best.class || best.label || best.name || "";
    const mapped = mapCustomLabel(label);
    if (!mapped && isBroadCloudWasteLabel(label)) return null;
    if (!mapped) return null;
    const confidence = Math.round((best.confidence ?? best.score ?? 0.86) * 100);
    els.modelState.textContent = "Cloud AI active";
    return { ...mapped, confidence: Math.max(70, Math.min(99, confidence)) };
  } catch (error) {
    state.aiWorkerError = error?.message || "Cloud API failed";
    els.modelState.textContent = "Fast Live AI";
    return null;
  }
}

function isBroadCloudWasteLabel(label = "") {
  const normalized = label.toLowerCase();
  return ["trash", "waste", "garbage", "litter", "other", "unknown"].some((word) => normalized.includes(word));
}

function classifyVisionLite() {
  const imageData = captureScanImageData();
  if (!imageData) return null;
  const data = imageData.data;
  let bright = 0;
  let yellow = 0;
  let red = 0;
  let green = 0;
  let brown = 0;
  let bluePlastic = 0;
  let colorful = 0;
  let orangeFood = 0;
  let onionFood = 0;
  let darkPrint = 0;
  let darkObject = 0;
  let grayObject = 0;
  const total = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    if (r > 150 && g > 150 && b > 145 && sat < 68) bright += 1;
    if (r > 135 && g > 105 && b < 95 && r > b + 45) yellow += 1;
    if (r > 125 && g < 105 && b < 105 && r > g + 30) red += 1;
    if (g > 120 && r < 125 && b < 120) green += 1;
    if (r > 85 && r < 175 && g > 45 && g < 130 && b < 105 && r > g + 18) brown += 1;
    if (b > 115 && g > 90 && r < 145 && b > r + 18) bluePlastic += 1;
    if (sat > 85 && max > 95) colorful += 1;
    if (r > 145 && g > 55 && g < 145 && b < 95 && r > g + 25) orangeFood += 1;
    if (r > 105 && g > 50 && b > 65 && r > g + 22 && b > g - 6 && max < 190) onionFood += 1;
    if (max < 95 && sat > 20) darkPrint += 1;
    if (max < 95) darkObject += 1;
    if (max > 82 && max < 170 && sat < 38) grayObject += 1;
  }

  const ratios = {
    bright: bright / total,
    yellow: yellow / total,
    red: red / total,
    green: green / total,
    brown: brown / total,
    bluePlastic: bluePlastic / total,
    colorful: colorful / total,
    orangeFood: orangeFood / total,
    onionFood: onionFood / total,
    darkPrint: darkPrint / total,
    darkObject: darkObject / total,
    grayObject: grayObject / total
  };

  const foodSignal = Math.max(ratios.red, ratios.green, ratios.orangeFood, ratios.onionFood);
  const packetSignal = ratios.colorful + ratios.darkPrint + ratios.bluePlastic;
  const plainPaperSignal = ratios.bright > 0.32 && ratios.colorful < 0.12 && ratios.bluePlastic < 0.1;
  const cardboardSignal = ratios.brown > 0.08 && ratios.bright < 0.56 && ratios.colorful < 0.14;
  const printedPacketSignal = ratios.bright > 0.2 && (ratios.darkPrint > 0.075 || ratios.colorful > 0.13 || ratios.bluePlastic > 0.09) && !plainPaperSignal && !cardboardSignal;
  const transparentBundleSignal = ratios.bright > 0.16 && ratios.grayObject > 0.16 && ratios.darkObject > 0.045 && packetSignal > 0.12;

  if (transparentBundleSignal || (packetSignal > 0.34 && ratios.bright > 0.12 && ratios.darkObject > 0.04)) {
    return withVisionConfidence("Mixed Covered Bag", packetSignal, 93);
  }
  if (printedPacketSignal || (packetSignal > 0.28 && ratios.bright > 0.18)) return withVisionConfidence("Chip Packet", packetSignal, 90);
  if (ratios.yellow > 0.09) return withVisionConfidence("Banana Peel", ratios.yellow, 91);
  if (foodSignal > 0.025 && ratios.bright < 0.62) return withVisionConfidence("Food Waste", foodSignal, 90);
  if (plainPaperSignal || ratios.bright > 0.48) return withVisionConfidence("Paper", ratios.bright, 92);
  if (cardboardSignal) return withVisionConfidence("Cardboard", ratios.brown, 90);
  if (ratios.bluePlastic > 0.1) return withVisionConfidence("Plastic Bottle", ratios.bluePlastic, 88);
  if (ratios.colorful > 0.22 && ratios.bright < 0.38) return withVisionConfidence("Chip Packet", ratios.colorful, 88);
  if (ratios.darkObject > 0.26) return withVisionConfidence("Phone Case", ratios.darkObject, 89);
  if (ratios.grayObject > 0.28 && ratios.bright < 0.32) return withVisionConfidence("Battery", ratios.grayObject, 88);
  if (ratios.bright > 0.34 && packetSignal < 0.16) return withVisionConfidence("Paper", ratios.bright, 92);
  return null;
}

function withVisionConfidence(name, ratio, base) {
  const item = cases.find((entry) => entry.name === name);
  if (!item) return null;
  return { ...item, confidence: Math.min(98, Math.round(base + ratio * 18)) };
}

function isStableLiveDetection(mapped) {
  if (state.liveCandidateName === mapped.name) {
    state.liveCandidateCount += 1;
  } else {
    state.liveCandidateName = mapped.name;
    state.liveCandidateCount = 1;
  }
  return state.liveCandidateCount >= 2;
}

function mapCustomLabel(label = "") {
  const normalized = label.toLowerCase().replace(/[_-]/g, " ").trim();
  const aliases = {
    paper: "Paper",
    note: "Notebook",
    notebook: "Notebook",
    "note book": "Notebook",
    book: "Notebook",
    diary: "Notebook",
    cardboard: "Cardboard",
    "cardboard box": "Cardboard",
    plastic: "Plastic Bottle",
    bottle: "Plastic Bottle",
    "plastic bottle": "Plastic Bottle",
    "hard plastic": "Hard Plastic Container",
    "hard plastic container": "Hard Plastic Container",
    container: "Hard Plastic Container",
    "steel bottle": "Steel Bottle",
    "metal bottle": "Steel Bottle",
    flask: "Steel Bottle",
    sipper: "Sip Bottle Cup",
    "sip bottle": "Sip Bottle Cup",
    "sip bottle cup": "Sip Bottle Cup",
    cup: "Sip Bottle Cup",
    glass: "Glass Bottle",
    "glass bottle": "Glass Bottle",
    metal: "Metal Can",
    can: "Metal Can",
    "metal can": "Metal Can",
    food: "Food Waste",
    "food waste": "Food Waste",
    banana: "Banana Peel",
    "banana peel": "Banana Peel",
    apple: "Apple",
    packet: "Chip Packet",
    "chip packet": "Chip Packet",
    "wheat packet": "Chip Packet",
    biscuit: "Biscuit Packet",
    "biscuit packet": "Biscuit Packet",
    "biscuit cover": "Biscuit Packet",
    wrapper: "Biscuit Packet",
    "snack wrapper": "Chip Packet",
    "plastic bag": "Plastic Cover",
    "plastic cover": "Plastic Cover",
    "transparent cover": "Plastic Cover",
    cover: "Mixed Covered Bag",
    pen: "Pen",
    rubber: "Rubber",
    eraser: "Rubber",
    phone: "Phone",
    mobile: "Phone",
    "mobile phone": "Phone",
    "phone case": "Phone Case",
    battery: "Battery",
    shoe: "Shoe",
    slipper: "Shoe",
    "broken slipper": "Broken Slipper",
    "rubber slipper": "Rubber Slipper",
    "leather slipper": "Leather Slipper",
    leather: "Leather Slipper",
    footwear: "Shoe",
    sandal: "Shoe",
    cloth: "Cloth",
    textile: "Cloth",
    bag: "Mixed Covered Bag",
    mixed: "Mixed Covered Bag",
    "mixed covered bag": "Mixed Covered Bag",
    unknown: "Mixed Covered Bag"
  };
  const caseName = aliases[normalized] || label;
  return cases.find((item) => item.name.toLowerCase() === caseName.toLowerCase());
}

function mapPrediction(prediction) {
  const label = prediction.class.toLowerCase();
  if (["bottle", "cup", "book"].includes(label)) return { ...cases.find((item) => item.name === "Plastic Bottle"), name: label === "book" ? "Paper" : "Plastic Bottle" };
  if (["banana", "apple"].includes(label)) return { ...cases.find((item) => item.name === (label === "banana" ? "Banana Peel" : "Apple")) };
  if (["handbag", "suitcase", "backpack"].includes(label)) return { ...cases.find((item) => item.name === "Mixed Covered Bag") };
  return null;
}

async function detectWaste(item) {
  if (state.busy) return;
  const wasLiveAi = state.liveAi;
  if (wasLiveAi) {
    state.liveAi = false;
    state.liveCandidateName = "";
    state.liveCandidateCount = 0;
    els.liveAiButton.innerHTML = '<i data-lucide="brain-circuit"></i>Live AI';
    if (window.lucide) window.lucide.createIcons();
  }
  state.busy = true;
  state.current = item;
  state.route = item.route;

  updateDecision(item, "scanning");
  playSound(item.route === "warning" ? "warning" : "detect");
  addEvent(`Camera detected ${item.name}`, item.type);
  await wait(450);

  if (item.route === "warning") {
    sceneApi.warning();
    updateHardware("No servo movement", "Warning beep", "Manual checking required");
    notify("Warning: mixed covered waste", "Object looks combined/covered. No bin will open. Ask person to separate waste.", "warning");
    recordWarning(item);
    playWarningSix();
    state.busy = false;
    showView("control");
    return;
  }

  if (willBinOverflow(item)) {
    const label = labelFor(item.route);
    sceneApi.full(item.route);
    updateHardware("Servo blocked", "Full-bin warning beep", `${label} bin full`);
    notify(`${label} bin full`, `${item.name} cannot be accepted. Please use/reset after collection.`, "warning");
    addFullAlert(item.route, `${label} bin is full. ${item.name} was rejected by safety logic.`);
    playWarningSix();
    showView("alerts");
    state.busy = false;
    return;
  }

  showView("twin");
  sceneApi.highlight(item.route);
  updateHardware(`${labelFor(item.route)} servo preparing`, "Detection beep", "3 ultrasonic sensors reading");
  notify(`${item.type} detected`, `Automatic route selected: ${labelFor(item.route)} bin.`, "normal");
  await wait(520);

  playSound("servo");
  sceneApi.open(item.route);
  updateHardware(`${labelFor(item.route)} lid open`, "Servo sound", "Storage level updating");
  await wait(980);

  sceneApi.drop(item.route);
  increaseStorage(item.route, item.weight);
  playSound("success");
  addEvent(`${labelFor(item.route)} bin opened`, `${state.levels[item.route]}% filled`);
  await wait(item.route === "reject" ? 1350 : 1120);

  sceneApi.close();
  updateHardware("Servo locked", "Success beep", "3 bins online");
  await wait(450);
  showView("percentage");
  animateLastIncrease();
  addEvent("Percentage page opened", `${labelFor(item.route)} storage updated`);
  state.busy = false;
  if (wasLiveAi) notify("Sorting cycle complete", "Live AI paused. Show the next object and tap Live AI again.", "normal");
}

function updateDecision(item) {
  const isWarning = item.route === "warning";
  els.objectName.textContent = item.name;
  els.decisionText.textContent = item.rule;
  els.routeName.textContent = isWarning ? "Do not open any bin" : `${labelFor(item.route)} Bin`;
  els.routeRule.textContent = isWarning ? "Warning buzzer only" : "Auto servo route enabled";
  els.confidenceValue.textContent = `${item.confidence}%`;
  els.confidenceBar.style.width = `${item.confidence}%`;
  els.boxLabel.textContent = `${item.name} ${item.confidence}%`;
  els.detectBox.classList.toggle("warning", isWarning);
  els.decisionCard.className = `decision-card ${isWarning ? "warning" : item.route}`;
  els.decisionCard.querySelector("i")?.setAttribute("data-lucide", item.icon);
  if (window.lucide) window.lucide.createIcons();
}

function increaseStorage(route, weight) {
  const item = state.current;
  const quantity = item.quantity ?? 1;
  const before = state.levels[route];
  const impact = calculateFillImpact(item, quantity);
  const addedWeight = +((item.weight ?? weight) * quantity).toFixed(2);
  state.levels[route] = roundLevel(Math.min(100, state.levels[route] + impact));
  state.weights[route] = +(state.weights[route] + addedWeight).toFixed(2);
  state.lastIncrease = { route, before, after: state.levels[route], beforeWeight: +(state.weights[route] - addedWeight).toFixed(2), afterWeight: state.weights[route] };
  updateStorage();
  if (state.levels[route] >= 85) {
    notify(`${labelFor(route)} bin full`, `Ultrasonic sensor reads ${state.levels[route]}%. Empty this bin before next collection.`, "warning");
    updateHardware("Servo locked", "Full-bin warning beep", `${labelFor(route)} bin full`);
    sceneApi.full(route);
    addFullAlert(route, `${labelFor(route)} bin reached ${formatPercent(state.levels[route])}.`);
    playSound("warning");
  }
  if (allBinsFull()) addFullAlert("all", "All 3 bins are full. Stop collection until bins are cleaned.");
}

function isBinFull(route) {
  return state.levels[route] >= 100;
}

function willBinOverflow(item) {
  if (item.route === "warning") return false;
  return state.levels[item.route] + calculateFillImpact(item, item.quantity ?? 1) > 100;
}

function allBinsFull() {
  return ["recycle", "organic", "reject"].every((route) => state.levels[route] >= 100);
}

function calculateFillImpact(item, quantity = 1) {
  return roundLevel((item.fillImpact ?? 1) * quantity);
}

function roundLevel(value) {
  return Math.round(value * 10) / 10;
}

function formatPercent(value) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

function updateStorage() {
  els.recycleLevel.textContent = formatPercent(state.levels.recycle);
  els.organicLevel.textContent = formatPercent(state.levels.organic);
  els.rejectLevel.textContent = formatPercent(state.levels.reject);
  els.recycleLevelBar.style.width = `${state.levels.recycle}%`;
  els.organicLevelBar.style.width = `${state.levels.organic}%`;
  els.rejectLevelBar.style.width = `${state.levels.reject}%`;
  els.recycleWeight.textContent = `${state.weights.recycle} kg`;
  els.organicWeight.textContent = `${state.weights.organic} kg`;
  els.rejectWeight.textContent = `${state.weights.reject} kg`;
  els.resetRecycle.textContent = formatPercent(state.levels.recycle);
  els.resetOrganic.textContent = formatPercent(state.levels.organic);
  els.resetReject.textContent = formatPercent(state.levels.reject);
  ["recycle", "organic", "reject"].forEach((route) => {
    $(`.storage-card.${route}`).classList.toggle("full", state.levels[route] >= 85);
    $(`.storage-card.${route}`).style.setProperty("--level", `${state.levels[route]}%`);
  });
  sceneApi.setFill(state.levels);
}

function animateLastIncrease() {
  const change = state.lastIncrease;
  if (!change) return;
  const map = {
    recycle: { label: els.recycleLevel, bar: els.recycleLevelBar, weight: els.recycleWeight, card: $(".storage-card.recycle") },
    organic: { label: els.organicLevel, bar: els.organicLevelBar, weight: els.organicWeight, card: $(".storage-card.organic") },
    reject: { label: els.rejectLevel, bar: els.rejectLevelBar, weight: els.rejectWeight, card: $(".storage-card.reject") }
  };
  const target = map[change.route];
  if (!target) return;
  target.label.textContent = formatPercent(change.before);
  target.bar.style.width = `${change.before}%`;
  target.card.style.setProperty("--level", `${change.before}%`);
  target.weight.textContent = `${change.beforeWeight} kg`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.bar.style.width = `${change.after}%`;
      target.card.style.setProperty("--level", `${change.after}%`);
      target.weight.textContent = `${change.afterWeight} kg`;
      animateNumber(target.label, change.before, change.after, 1800);
    });
  });
}

function animateNumber(element, from, to, duration) {
  const start = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = roundLevel(from + (to - from) * eased);
    element.textContent = formatPercent(value);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function recordWarning(item) {
  const now = new Date();
  state.warningCount += 1;
  state.warningLog.push({
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    item: item.name,
    reason: "Mixed or covered waste"
  });
  renderReports();
}

function addFullAlert(route, message) {
  const existingOpen = state.fullAlerts.some((alert) => alert.route === route && !alert.accepted);
  if (existingOpen) return;
  const now = new Date();
  state.fullAlerts.unshift({
    id: Date.now(),
    route,
    bin: route === "all" ? "All bins" : `${labelFor(route)} bin`,
    message,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    accepted: false
  });
  const openRoutes = new Set(state.fullAlerts.filter((alert) => !alert.accepted && alert.route !== "all").map((alert) => alert.route));
  const hasAllAlert = state.fullAlerts.some((alert) => !alert.accepted && alert.route === "all");
  if (openRoutes.size === 3 && !hasAllAlert) {
    const allNow = new Date();
    state.fullAlerts.unshift({
      id: Date.now() + 1,
      route: "all",
      bin: "All bins",
      message: "All 3 bins are full. Stop collection until bins are cleaned.",
      date: allNow.toLocaleDateString(),
      time: allNow.toLocaleTimeString(),
      accepted: false
    });
  }
  renderAlerts();
}

function renderAlerts() {
  const openAlerts = state.fullAlerts.filter((alert) => !alert.accepted);
  if (!openAlerts.length) {
    els.alertList.innerHTML = `<div class="alert-empty">No active full-bin alerts</div>`;
    return;
  }
  els.alertList.innerHTML = openAlerts.map((alert) => `
    <div class="alert-item">
      <div>
        <strong>${alert.bin}</strong>
        <span>${alert.message}</span>
        <span>${alert.date} ${alert.time}</span>
      </div>
      <b>FULL</b>
    </div>
  `).join("");
}

function acceptAlerts() {
  state.fullAlerts.forEach((alert) => alert.accepted = true);
  document.querySelectorAll(".designer-bin").forEach((bin) => bin.classList.remove("full-alert"));
  renderAlerts();
  tickNotify("Alerts accepted", "Full-bin messages cleared from active list.", "alert");
  showView("control");
}

function resetAllBins() {
  const now = new Date();
  const report = {
    id: state.reports.length + 1,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    recycle: state.levels.recycle,
    organic: state.levels.organic,
    reject: state.levels.reject,
    recycleWeight: state.weights.recycle,
    organicWeight: state.weights.organic,
    rejectWeight: state.weights.reject,
    warningCount: state.warningCount
  };
  state.reports.unshift(report);
  state.levels = { recycle: 0, organic: 0, reject: 0 };
  state.weights = { recycle: 0, organic: 0, reject: 0 };
  state.fullAlerts = [];
  state.acknowledgedAlerts = [];
  document.querySelectorAll(".designer-bin").forEach((bin) => bin.classList.remove("full-alert"));
  updateStorage();
  renderAlerts();
  renderReports();
  notify("Bins cleaned and reset", "Previous percentage values were saved into report history.", "normal");
  tickNotify("Report saved", "Bins reset to 0% after report generation.", "reset");
  addEvent("All bins reset", `${report.date} ${report.time}`);
  showView("report");
}

function renderReports() {
  els.reportResetCount.textContent = state.reports.length;
  els.reportWarningCount.textContent = state.warningCount;
  els.reportLastReset.textContent = state.reports[0] ? `${state.reports[0].date} ${state.reports[0].time}` : "-";
  const header = `
    <div class="report-row header">
      <span>Date</span><span>Time</span><span>Recycle</span><span>Organic</span><span>Reject</span><span>Warnings</span><span>Action</span>
    </div>`;
  const rows = state.reports.map((report) => `
    <div class="report-row" data-report-id="${report.id}">
      <strong>${report.date}</strong>
      <strong>${report.time}</strong>
      <span>${report.recycle}% / ${report.recycleWeight}kg</span>
      <span>${report.organic}% / ${report.organicWeight}kg</span>
      <span>${report.reject}% / ${report.rejectWeight}kg</span>
      <span>${report.warningCount}</span>
      <button class="delete-report" data-report-id="${report.id}">Delete</button>
    </div>`).join("");
  const warnings = state.warningLog.slice(0, 6).map((warning) => `
    <div class="report-row">
      <strong>${warning.date}</strong>
      <strong>${warning.time}</strong>
      <span>${warning.item}</span>
      <span>${warning.reason}</span>
      <span>-</span>
      <span>Warning</span>
      <span>-</span>
    </div>`).join("");
  const fullAlerts = state.fullAlerts.slice(0, 6).map((alert) => `
    <div class="report-row">
      <strong>${alert.date}</strong>
      <strong>${alert.time}</strong>
      <span>${alert.bin}</span>
      <span>${alert.message}</span>
      <span>-</span>
      <span>Full</span>
      <span>-</span>
    </div>`).join("");
  els.reportTable.innerHTML = header + (rows || `<div class="event"><strong>No reset reports yet</strong><span>Clean bin and press reset</span></div>`) + warnings + fullAlerts;
  els.reportTable.querySelectorAll(".delete-report").forEach((button) => {
    button.addEventListener("click", () => deleteReport(Number(button.dataset.reportId)));
  });
}

function deleteReport(id) {
  state.reports = state.reports.filter((report) => report.id !== id);
  renderReports();
  tickNotify("Report deleted", "Selected report removed.", "delete");
}

function downloadReportCsv() {
  const lines = [
    ["EcoSort Nexus Collection Report"],
    [`Generated`, new Date().toLocaleString()],
    [],
    ["Reset Date", "Reset Time", "Recycle %", "Recycle kg", "Organic %", "Organic kg", "Non-Recycle %", "Non-Recycle kg", "Warning Count"]
  ];
  state.reports.forEach((report) => {
    lines.push([report.date, report.time, report.recycle, report.recycleWeight, report.organic, report.organicWeight, report.reject, report.rejectWeight, report.warningCount]);
  });
  lines.push([]);
  lines.push(["Warning Date", "Warning Time", "Item", "Reason"]);
  state.warningLog.forEach((warning) => lines.push([warning.date, warning.time, warning.item, warning.reason]));
  lines.push([]);
  lines.push(["Full Alert Date", "Full Alert Time", "Bin", "Message", "Accepted"]);
  state.fullAlerts.forEach((alert) => lines.push([alert.date, alert.time, alert.bin, alert.message, alert.accepted ? "yes" : "no"]));
  const csv = lines.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ecosort-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  tickNotify("Report downloaded", "CSV report file generated.", "download");
}

function tickNotify(title, text, sound = "tick") {
  els.noticeTitle.textContent = `✓ ${title}`;
  els.noticeText.textContent = text;
  els.notification.classList.remove("warning");
  els.notification.classList.add("success");
  playSound(sound);
  setTimeout(() => els.notification.classList.remove("success"), 700);
}

function updateHardware(servo, buzzer, sensor) {
  els.servoState.textContent = servo;
  els.buzzerState.textContent = buzzer;
  els.sensorState.textContent = sensor;
  els.alertState.textContent = sensor.includes("full") || buzzer.includes("Warning") ? "Warning" : "Normal";
}

function notify(title, text, type) {
  els.noticeTitle.textContent = title;
  els.noticeText.textContent = text;
  els.notification.classList.toggle("warning", type === "warning");
}

function addEvent(title, meta) {
  const row = document.createElement("div");
  row.className = "event";
  row.innerHTML = `<strong>${title}</strong><span>${meta}</span>`;
  els.timeline.prepend(row);
  while (els.timeline.children.length > 6) els.timeline.lastElementChild.remove();
}

async function runAutoDemo() {
  tickNotify("Auto demo started", "Recycle, organic and non-recycle cycles will run.", "demo");
  const queue = [
    cases.find((item) => item.name === "Plastic Bottle"),
    cases.find((item) => item.name === "Banana Peel"),
    cases.find((item) => item.name === "Chip Packet")
  ];
  for (const item of queue) {
    await detectWaste(item);
    await wait(2300);
  }
  tickNotify("Auto demo complete", "All three routes were tested.", "success");
}

function labelFor(route) {
  return route === "recycle" ? "Recycle" : route === "organic" ? "Organic" : "Non-Recycle";
}

function playSound(type) {
  const audio = new AudioContext();
  const gain = audio.createGain();
  gain.gain.value = 0.18;
  gain.connect(audio.destination);
  const notes = {
    detect: [720, 920],
    servo: [260, 330, 420],
    success: [620, 820, 1040],
    warning: [170, 130, 170, 110],
    tick: [820, 1080],
    page: [520, 760],
    camera: [680, 880, 1160],
    aiOn: [540, 760, 980],
    aiOff: [440, 320],
    sample: [760, 640, 880],
    save: [700, 940, 1280],
    reset: [420, 620, 840],
    download: [880, 1120],
    delete: [260, 190],
    alert: [520, 520, 720],
    theme: [620, 820],
    demo: [480, 640, 800, 960]
  }[type] || [600];
  notes.forEach((freq, index) => {
    const osc = audio.createOscillator();
    osc.type = type === "success" ? "sine" : "square";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(audio.currentTime + index * 0.11);
    osc.stop(audio.currentTime + index * 0.11 + 0.08);
  });
  setTimeout(() => audio.close().catch(() => {}), 900);
}

function playWarningSix() {
  let count = 0;
  const timer = setInterval(() => {
    playSound("warning");
    count += 1;
    if (count >= 6) clearInterval(timer);
  }, 260);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let renderer;
let scene;
let camera;
const bins = {};
let waste = [];
let particles;
const sceneApi = {};

function setupScene() {
  const canvas = $("#binScene");
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-4.6, 4.6, 3.1, -3.1, 0.1, 100);
  camera.position.set(0, 0.35, 10);
  camera.lookAt(0, 0.35, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a2530, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.4);
  key.position.set(4, 8, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7de3ff, 2.4);
  rim.position.set(-5, 3, -5);
  scene.add(rim);

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 6.2),
    new THREE.MeshBasicMaterial({ color: 0x101923, transparent: true, opacity: 0.18 })
  );
  backdrop.position.z = -0.62;
  scene.add(backdrop);

  [
    { key: "recycle", x: -2.55, label: "RECYCLE", color: 0x48e6c6 },
    { key: "organic", x: 0, label: "ORGANIC", color: 0xb8f56d },
    { key: "reject", x: 2.55, label: "NON-RECYCLE", color: 0x9ab8ff }
  ].forEach((spec) => {
    bins[spec.key] = createBin(spec);
    scene.add(bins[spec.key].group);
  });

  particles = new THREE.Group();
  scene.add(particles);

  sceneApi.highlight = (route) => {
    Object.entries(bins).forEach(([key, bin]) => bin.targetGlow = key === route ? 3.4 : 0.55);
    setVisualBin(route, "active");
  };
  sceneApi.open = (route) => {
    Object.entries(bins).forEach(([key, bin]) => bin.targetOpen = key === route ? -1.85 : 0);
    setVisualBin(route, "opening");
  };
  sceneApi.close = () => {
    Object.values(bins).forEach((bin) => { bin.targetOpen = 0; bin.targetGlow = 0.8; bin.fullPulse = false; });
    document.querySelectorAll(".designer-bin").forEach((bin) => bin.classList.remove("active", "opening", "full"));
    els.visualTwin?.classList.remove("drop-recycle", "drop-organic", "drop-reject");
  };
  sceneApi.warning = () => {
    Object.values(bins).forEach((bin) => { bin.targetOpen = 0; bin.targetGlow = 0.25; bin.fullPulse = true; });
    document.querySelectorAll(".designer-bin").forEach((bin) => bin.classList.remove("active", "opening"));
  };
  sceneApi.full = (route) => {
    if (route === "all") {
      Object.keys(bins).forEach((key) => sceneApi.full(key));
      return;
    }
    bins[route].fullPulse = true;
    bins[route].targetGlow = 4.2;
    document.querySelector(`.designer-bin.${route}`)?.classList.add("full", "full-alert");
  };
  sceneApi.drop = (route) => {
    createDrop(route);
    els.visualTwin?.classList.remove("drop-recycle", "drop-organic", "drop-reject");
    setDropTarget(route);
    void els.visualTwin?.offsetWidth;
    els.visualTwin?.classList.add(`drop-${route}`);
  };
  sceneApi.setFill = (levels) => Object.entries(levels).forEach(([key, level]) => bins[key].targetFill = Math.max(0.04, level / 100));

  resizeScene();
  animate();
}

function setVisualBin(route, mode) {
  document.querySelectorAll(".designer-bin").forEach((bin) => {
    const active = bin.dataset.bin === route;
    bin.classList.toggle("active", active);
    if (!active) bin.classList.remove("opening");
  });
  if (mode === "opening") document.querySelector(`.designer-bin.${route}`)?.classList.add("opening");
}

function setDropTarget(route) {
  const stage = els.visualTwin;
  const bin = document.querySelector(`.designer-bin.${route}`);
  if (!stage || !bin) return;
  const stageRect = stage.getBoundingClientRect();
  const binRect = bin.getBoundingClientRect();
  const stageCenter = stageRect.left + stageRect.width / 2;
  const binCenter = binRect.left + binRect.width / 2;
  stage.style.setProperty("--drop-x", `${Math.round(binCenter - stageCenter)}px`);
}

function createBin({ key, x, label, color }) {
  const group = new THREE.Group();
  group.position.x = x;
  const bodyMat = new THREE.MeshPhysicalMaterial({ color, metalness: 0.04, roughness: 0.34, clearcoat: 0.82, clearcoatRoughness: 0.18, transparent: true, opacity: 0.88 });
  const body = new THREE.Mesh(roundedRectGeometry(1.55, 2.45, 0.22, 0.34), bodyMat);
  body.position.y = -0.16;
  group.add(body);

  const fill = new THREE.Mesh(
    roundedRectGeometry(1.24, 1.74, 0.24, 0.22),
    new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.43, roughness: 0.2, clearcoat: 0.7 })
  );
  fill.scale.y = state.levels[key] / 100;
  fill.position.y = -1.02 + (1.72 * fill.scale.y) / 2;
  group.add(fill);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.38, 0.58),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
  );
  glass.position.set(0, -0.7, 0.13);
  group.add(glass);

  const lowerBand = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.36),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
  );
  lowerBand.position.set(0, -1.08, 0.135);
  group.add(lowerBand);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 1.6, 36),
    new THREE.MeshPhysicalMaterial({ color, metalness: 0.08, roughness: 0.28, clearcoat: 0.8, transparent: true, opacity: 0.62 })
  );
  rim.rotation.z = Math.PI / 2;
  rim.position.set(-0.14, 1.28, 0.09);
  rim.scale.z = 1;
  group.add(rim);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 1.26, 0.08);
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1.72, 36),
    new THREE.MeshPhysicalMaterial({ color: 0x86e9d1, metalness: 0.08, roughness: 0.22, clearcoat: 0.8, transparent: true, opacity: 0.76 })
  );
  lid.rotation.z = Math.PI / 2;
  lid.position.set(0, 0, 0.03);
  lidPivot.add(lid);
  group.add(lidPivot);

  const servo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.76, 24),
    new THREE.MeshStandardMaterial({ color: 0xdce9f2, metalness: 0.85, roughness: 0.2 })
  );
  servo.rotation.z = Math.PI / 2;
  servo.position.set(0.62, 1.47, 0.2);
  group.add(servo);

  const led = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.035, 14, 96),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3 })
  );
  led.position.set(0.5, 1.5, 0.24);
  group.add(led);

  const frontGlow = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.018, 10, 80),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.34 })
  );
  frontGlow.position.set(0, 0.25, 0.16);
  group.add(frontGlow);

  const labelTexture = createLabel(label);
  const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 0.34), new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true }));
  labelMesh.position.set(0, -0.62, 0.155);
  group.add(labelMesh);

  return { group, fill, lidPivot, servo, led, frontGlow, targetOpen: 0, targetGlow: 0.8, targetFill: state.levels[key] / 100, fullPulse: false };
}

function roundedRectGeometry(width, height, depth, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 18 });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function createLabel(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 48px Inter, Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, 320, 105);
  return new THREE.CanvasTexture(canvas);
}

function createDrop(route) {
  const bin = bins[route];
  const color = route === "recycle" ? 0x48e6c6 : route === "organic" ? 0xb8f56d : 0x9ab8ff;
  const item = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.22 + Math.random() * 0.08, 2),
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, clearcoat: 0.8 })
  );
  item.position.set(bin.group.position.x, 2.7, 0.25);
  item.userData = { vy: -0.02, life: 0, floor: -0.5 + Math.random() * 0.28 };
  scene.add(item);
  waste.push(item);

  for (let i = 0; i < 20; i += 1) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.018 + Math.random() * 0.015, 8, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    p.position.copy(item.position);
    p.userData = { life: 1, vx: (Math.random() - 0.5) * 0.05, vy: Math.random() * 0.06, vz: (Math.random() - 0.5) * 0.05 };
    particles.add(p);
  }
}

function resizeScene() {
  if (!renderer) return;
  const rect = renderer.domElement.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const aspect = rect.width / rect.height;
  camera.left = -3.75 * aspect;
  camera.right = 3.75 * aspect;
  camera.top = 3.0;
  camera.bottom = -3.0;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height, false);
}

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  Object.values(bins).forEach((bin, index) => {
    bin.lidPivot.rotation.z += ((bin.targetOpen * 0.38) - bin.lidPivot.rotation.z) * 0.075;
    bin.lidPivot.position.y += ((bin.targetOpen ? 1.56 : 1.26) - bin.lidPivot.position.y) * 0.075;
    bin.servo.rotation.z = Math.PI / 2 - bin.lidPivot.rotation.z * 0.8;
    const pulse = bin.fullPulse ? Math.sin(t * 14) * 1.1 + 1.2 : Math.sin(t * 2 + index) * 0.2;
    bin.led.material.emissiveIntensity += (bin.targetGlow + pulse - bin.led.material.emissiveIntensity) * 0.08;
    bin.frontGlow.material.opacity += (0.24 + bin.targetGlow * 0.08 - bin.frontGlow.material.opacity) * 0.08;
    bin.fill.scale.y += (bin.targetFill - bin.fill.scale.y) * 0.06;
    bin.fill.position.y = -1.02 + (1.72 * bin.fill.scale.y) / 2;
    bin.group.position.y = Math.sin(t * 1.3 + index) * 0.012;
  });

  waste.forEach((item) => {
    item.userData.life += 0.018;
    item.userData.vy -= 0.001;
    item.position.y += item.userData.vy;
    item.rotation.x += 0.04;
    item.rotation.y += 0.05;
    if (item.position.y < item.userData.floor) item.userData.vy *= -0.22;
  });
  waste = waste.filter((item) => {
    if (item.userData.life > 4.5) {
      scene.remove(item);
      return false;
    }
    return true;
  });

  particles.children.forEach((p) => {
    p.userData.life -= 0.018;
    p.position.x += p.userData.vx;
    p.position.y += p.userData.vy;
    p.position.z += p.userData.vz;
    p.userData.vy -= 0.002;
    p.material.opacity = Math.max(0, p.userData.life);
  });
  particles.children.filter((p) => p.userData.life <= 0).forEach((p) => particles.remove(p));

  renderer.render(scene, camera);
}

els.navItems.forEach((item) => item.addEventListener("click", () => showView(item.dataset.view)));
els.cameraButton.addEventListener("click", startCamera);
els.liveAiButton.addEventListener("click", toggleLiveAi);
els.themeButton.addEventListener("click", toggleTheme);
els.autoDemo.addEventListener("click", runAutoDemo);
els.resetBins.addEventListener("click", resetAllBins);
els.downloadReport.addEventListener("click", downloadReportCsv);
els.acceptAlerts.addEventListener("click", acceptAlerts);
els.saveApiSettings?.addEventListener("click", saveApiSettings);
window.addEventListener("resize", resizeScene);

buildSamples();
setupScene();
updateStorage();
renderReports();
renderAlerts();
addEvent("System ready", "Waiting for camera input");

window.ecoDebugSetLevel = (route, level) => {
  if (!(route in state.levels)) return;
  state.levels[route] = roundLevel(Math.max(0, Math.min(100, level)));
  updateStorage();
};
