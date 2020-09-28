const highFrequencyThreshold = 1000/60.0; // ~58 FPS
const lowFrequencyThreshold = 1000/50.0; // ~50 FPS

const minDpr = 0.25;
const maxDpr = window.devicePixelRatio;
const deltaDpr = 0.1;

const relaxPeriod = 1000;
const accumulatorLength = 20;

let frameTimestamp = performance.now();
let frequencyAccumulator = [];
let lastUpdatedAt = null;

const fpsText = document.getElementById("fps");

let renderer;

function setup(rendererIn) {
  renderer = rendererIn;
}

function updateDynamic(timestamp = performance.now()) {
  monitor(frameTimestamp, timestamp);
  frameTimestamp = timestamp;
}

function monitor(frameTimestamp, now) {
  collectFrequency(now - frameTimestamp);
  // accumulator is not fully filled
  if (frequencyAccumulator.length < accumulatorLength) {
    return;
  }

  // an update happened recently
  if (now - lastUpdatedAt < relaxPeriod) {
    return;
  }

  const dpr = renderer.getPixelRatio();
  const frequencyMedian = median(frequencyAccumulator);

  fpsText.textContent = Math.round(1000.0 / frequencyMedian);

  if (frequencyMedian > lowFrequencyThreshold && dpr > minDpr) {
    console.log("Low FPS, setting resolution factor to " + (dpr - deltaDpr));
    updateDpr(dpr, -deltaDpr, now);
  } else if (frequencyMedian < highFrequencyThreshold && dpr < maxDpr) {
    console.log("High FPS, setting resolution factor to " + (dpr + deltaDpr));
    updateDpr(dpr, deltaDpr, now);
  }
}

function collectFrequency(frequency) {
  if (frequency > 0) {
    frequencyAccumulator.push(frequency);
  }

  if (frequencyAccumulator.length > accumulatorLength) {
    frequencyAccumulator.shift();
  }
}

function updateDpr(dpr, delta, now) {
  renderer.setPixelRatio(dpr + delta);
  frequencyAccumulator = [];
  lastUpdatedAt = now;
}

function median(elements) {
  const indexOfMin = elements.indexOf(Math.min(elements));
  const indexOfMax = elements.indexOf(Math.max(elements));
  const noMinMax = elements.filter(
    (_, index) => index !== indexOfMin && index !== indexOfMax
  );

  return average(noMinMax);
}

function average(elements) {
  return elements.reduce((sum, value) => sum + value, 0) / elements.length;
}
