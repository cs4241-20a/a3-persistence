const highFrequencyThreshold = 15; // ~58 FPS
const lowFrequencyThreshold = 20; // ~50 FPS

const minDpr = 0.25;
const maxDpr = window.devicePixelRatio;
const deltaDpr = 0.2;

const relaxPeriod = 2000;
const accumulatorLength = 10;

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

  if (frequencyMedian > lowFrequencyThreshold && dpr > minDpr) {
    updateDpr(dpr, -deltaDpr, now);
  } else if (frequencyMedian < highFrequencyThreshold && dpr < maxDpr) {
    updateDpr(dpr, deltaDpr, now);
  }
}

function collectFrequency(frequency) {
  if (frequency > 0) {
    fpsText.innerHTML = Math.round(1 / (frequency / 1000));
    frequencyAccumulator.push(frequency);
  }

  if (frequencyAccumulator.length > accumulatorLength) {
    frequencyAccumulator.shift();
  }
}

function updateDpr(dpr, delta, now) {
  console.log("Low FPS, setting resolution factor to " + (dpr + delta));
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
