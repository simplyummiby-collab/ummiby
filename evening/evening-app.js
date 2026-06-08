const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};

document.getElementById("todayDate").textContent =
  new Date().toLocaleDateString("en-US", dateOptions);

try {
  document.getElementById("hijriDate").textContent =
    new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
} catch {
  document.getElementById("hijriDate").textContent = "Hijri date unavailable";
}

const eveningContainer = document.getElementById("eveningDuaaContainer");

function showError(message) {
  eveningContainer.innerHTML = `
    <div class="duaa-card">
      <div class="duaa-label">Something needs fixing</div>
      <p class="translation">${message}</p>
    </div>
  `;
}

if (!eveningContainer) {
  alert("Missing eveningDuaaContainer in evening/index.html");
}

if (typeof eveningDuaas === "undefined") {
  showError("The file evening-data.js is not loading, or the variable eveningDuaas is missing.");
} else if (!Array.isArray(eveningDuaas)) {
  showError("eveningDuaas exists, but it is not an array.");
} else if (eveningDuaas.length === 0) {
  showError("eveningDuaas is loading, but it has no duaas inside.");
} else {
  renderEveningDuaas();
}

function getEveningProgress() {
  return JSON.parse(localStorage.getItem("eveningDuaaProgress")) || {};
}

function saveEveningProgress(progress) {
  localStorage.setItem("eveningDuaaProgress", JSON.stringify(progress));
}

function renderEveningDuaas() {
  const progress = getEveningProgress();
  eveningContainer.innerHTML = "";

  const completedCount = eveningDuaas.filter((_, index) => progress[index]).length;
  const percent = Math.round((completedCount / eveningDuaas.length) * 100);

  const progressBox = document.createElement("div");
  progressBox.className = "progress-box page-title";
  progressBox.innerHTML = `
    <h3>${completedCount} of ${eveningDuaas.length} Read</h3>
    <p>Your progress saves on this device until you reset it.</p>

    <div class="progress-bar">
      <div class="progress-fill" style="width: ${percent}%"></div>
    </div>

    <button class="reader-btn" onclick="resetEveningProgress()">Reset Evening Progress</button>
  `;

  eveningContainer.appendChild(progressBox);

  eveningDuaas.forEach((duaa, index) => {
    const isRead = progress[index] === true;

    const card = document.createElement("div");
    card.className = "duaa-card";
    if (isRead) card.classList.add("read");

    card.innerHTML = `
      <div class="duaa-label">${duaa.label || "Evening Duaa"}</div>

      <label class="read-check">
        <input 
          type="checkbox" 
          ${isRead ? "checked" : ""}
          onchange="toggleEveningRead(${index})"
        >
        <span>Read</span>
      </label>

      ${duaa.count ? `<p class="reference"><strong>Repeat:</strong> ${duaa.count}</p>` : ""}

      <div class="arabic">${duaa.arabic || ""}</div>

      ${duaa.transliteration ? `<p class="translation"><strong>Transliteration:</strong><br>${duaa.transliteration.replace(/\n/g, "<br>")}</p>` : ""}

      <p class="translation">${(duaa.translation || "").replace(/\n/g, "<br>")}</p>

      ${duaa.summary ? `<p class="translation"><strong>Summary:</strong> ${duaa.summary}</p>` : ""}

      ${duaa.virtues ? `<p class="translation"><strong>Virtue:</strong> ${duaa.virtues}</p>` : ""}

      <p class="reference"><strong>${duaa.reference || ""}</strong> ${duaa.grade ? " — " + duaa.grade : ""}</p>
    `;

    eveningContainer.appendChild(card);
  });
}

function toggleEveningRead(index) {
  const progress = getEveningProgress();
  progress[index] = !progress[index];
  saveEveningProgress(progress);
  renderEveningDuaas();
}

function resetEveningProgress() {
  localStorage.removeItem("eveningDuaaProgress");
  renderEveningDuaas();
}
