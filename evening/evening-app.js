
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
    }).format(new Date()) + " AH";
} catch {
  document.getElementById("hijriDate").textContent = "Hijri date unavailable";
}

const eveningContainer = document.getElementById("eveningDuaaContainer");

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
      <div class="duaa-label">${duaa.label}</div>

      <label class="read-check">
        <input 
          type="checkbox" 
          ${isRead ? "checked" : ""}
          onchange="toggleEveningRead(${index})"
        >
        <span>Read</span>
      </label>

      <div class="arabic">${duaa.arabic}</div>
      <p class="translation">${duaa.translation}</p>
      <p class="reference"><strong>${duaa.reference}</strong></p>
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

renderEveningDuaas();
