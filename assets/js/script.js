// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================
// LAST_RESULT is declared in src/calculator.js as a global variable
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);

    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    let result = evaluateExpression(normalizedExpression);
    console.log("Calculated result for expression:", expression, "->", result);

    return result;
  } catch (e) {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) return;
    const display = document.getElementById("result"); 
    // Calculate result
    let result = calculateExpression(currentExpression);
    result = String(result);

    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ===============================
// 📷 CAM FEATURE — Camera & OCR
// ===============================

var cameraStream = null;
var facingMode = 'environment';

function openCamera() {
  var modal = document.getElementById('cameraModal');
  modal.classList.add('open');
  document.getElementById('cameraResult').style.display = 'none';
  document.getElementById('cameraStatus').textContent = 'Starting camera...';
  try {
    startCamera();
  } catch (e) {
    document.getElementById('cameraStatus').textContent = 'Camera error: ' + e.message;
  }
}

function closeCamera() {
  stopCamera();
  var modal = document.getElementById('cameraModal');
  modal.classList.remove('open');
}

function toggleCamera() {
  facingMode = (facingMode === 'environment') ? 'user' : 'environment';
  stopCamera();
  startCamera();
}

function startCamera() {
  if (cameraStream) stopCamera();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    document.getElementById('cameraStatus').textContent = 'Camera requires HTTPS. Open this page using HTTPS or a supported browser.';
    return;
  }

  var constraints = {
    video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      cameraStream = stream;
      var video = document.getElementById('cameraPreview');
      video.srcObject = stream;
      document.getElementById('cameraStatus').textContent = 'Camera ready. Point at an equation and capture.';
    })
    .catch(function (err) {
      document.getElementById('cameraStatus').textContent = 'Camera error: ' + err.message;
    });
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(function (track) { track.stop(); });
    cameraStream = null;
  }
}

function captureEquation() {
  var video = document.getElementById('cameraPreview');
  var canvas = document.getElementById('cameraCanvas');
  var status = document.getElementById('cameraStatus');
  var capBtn = document.getElementById('captureBtn');

  if (!video.videoWidth) {
    status.textContent = 'Camera not ready. Please wait.';
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = canvas.toDataURL('image/png');

  status.textContent = 'Processing... Running OCR on captured image.';
  capBtn.disabled = true;

  Tesseract.recognize(imageData, 'eng', {
    logger: function (m) {
      if (m.status === 'recognizing text') {
        status.textContent = 'Recognizing... ' + Math.round(m.progress * 100) + '%';
      }
    }
  }).then(function (result) {
    capBtn.disabled = false;
    var text = result.data.text.trim();
    text = text.replace(/\s+/g, '');

    if (!text) {
      status.textContent = 'No equation detected. Try again.';
      return;
    }

    text = text.replace(/x/g, '*')
               .replace(/×/g, '*')
               .replace(/÷/g, '/')
               .replace(/−/g, '-')
               .replace(/,/g, '');

    document.getElementById('recognizedEquation').textContent = text;

    var calcResult = calculateExpression(text);

    document.getElementById('equationResult').textContent = calcResult;
    document.getElementById('cameraResult').style.display = 'block';
    status.textContent = 'Equation solved!';

    currentExpression = text;
    updateResult();
  }).catch(function (err) {
    capBtn.disabled = false;
    status.textContent = 'OCR Error: ' + err.message;
  });
}