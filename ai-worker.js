let model = null;
let labels = [];
let preprocess = "normalized";

async function boot() {
  try {
    importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
    await self.tf.setBackend("cpu");
    await self.tf.ready();
    const metadataResponse = await fetch("./custom-model/metadata.json", { cache: "no-store" });
    if (!metadataResponse.ok) throw new Error("metadata missing");
    const metadata = await metadataResponse.json();
    labels = metadata.labels || [];
    preprocess = metadata.preprocess || "normalized";
    if (!labels.length) throw new Error("labels missing");
    model = await self.tf.loadLayersModel("./custom-model/model.json");
    self.postMessage({ type: "ready", labels, preprocess });
  } catch (error) {
    self.postMessage({ type: "error", message: error?.message || "AI worker failed" });
  }
}

self.onmessage = async (event) => {
  const message = event.data || {};
  if (message.type !== "classify" || !model) return;

  let tensor;
  let prediction;
  try {
    tensor = self.tf.tidy(() => {
      const frame = self.tf.browser.fromPixels(message.imageData).toFloat();
      const prepared = preprocess === "embedded_mobilenet_v2"
        ? frame
        : frame.sub(127.5).div(127.5);
      return prepared.expandDims(0);
    });
    prediction = model.predict(tensor);
    const scores = Array.from(await prediction.data());
    const bestIndex = scores.indexOf(Math.max(...scores));
    self.postMessage({
      type: "result",
      id: message.id,
      label: labels[bestIndex],
      confidence: Math.round(scores[bestIndex] * 100)
    });
  } catch (error) {
    self.postMessage({ type: "result", id: message.id, error: error?.message || "classify failed" });
  } finally {
    tensor?.dispose();
    prediction?.dispose();
  }
};

boot();
