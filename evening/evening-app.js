document.addEventListener("DOMContentLoaded", function () {
  const todayDate = document.getElementById("todayDate");
  const hijriDate = document.getElementById("hijriDate");
  const eveningContainer = document.getElementById("eveningDuaaContainer");

  if (todayDate) {
    todayDate.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  if (hijriDate) {
    try {
      hijriDate.textContent = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
    } catch {
      hijriDate.textContent = "Hijri date unavailable";
    }
  }

  if (!eveningContainer) {
    alert("Could not find eveningDuaaContainer.");
    return;
  }

  if (typeof eveningDuaas === "undefined") {
    eveningContainer.innerHTML = `
      <div class="duaa-card">
        <div class="duaa-label">Data file not loading</div>
        <p class="translation">Check that evening-data.js exists and is linked before evening-app.js.</p>
      </div>
    `;
    return;
  }

  renderEveningDuaas();

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
  <h3>${completedCount} of ${eveningDuaas.length} Read (${percent}%)</h3>
  <p>Your progress saves on this device until you reset it.</p>

  <div class="progress-bar">
    <div class="progress-fill" style="width: ${percent}%"></div>
  </div>

  ${completedCount === eveningDuaas.length ? `
    <div class="completion-message">
      Alhamdulillah. You completed today's Evening Duaas.
    </div>
  ` : ""}

  <button class="reader-btn" id="resetEveningProgressBtn">
    Reset Evening Progress
  </button>
`;

    eveningContainer.appendChild(progressBox);

    document
      .getElementById("resetEveningProgressBtn")
      .addEventListener("click", resetEveningProgress);

    eveningDuaas.forEach((duaa, index) => {
      const isRead = progress[index] === true;

      const card = document.createElement("div");
      card.className = "duaa-card";
      if (isRead) card.classList.add("read");

    card.innerHTML = `
  <div class="duaa-label">Duaa ${index + 1}</div>
<h3 class="duaa-title">${duaa.label || "Evening Duaa"}</h3>
${duaa.summary ? `
  <p class="duaa-summary">${duaa.summary}</p>
` : ""}

  ${duaa.count ? `<p class="reference"><strong>Repeat:</strong> ${duaa.count}</p>` : ""}

 <div class="arabic">
  ${(duaa.arabic || "")
    .split("\n")
    .map((line, i) => `
      <div class="arabic-line">
        <span class="ayah-number">${i + 1}</span>
        <span>${line}</span>
      </div>
    `)
    .join("")}
</div>

  ${duaa.transliteration ? `
    <div class="section-heading">Transliteration</div>
    <p class="translation">
      ${duaa.transliteration.replace(/\n/g, "<br>")}
    </p>
  ` : ""}

  <div class="section-heading">English Translation</div>
  <p class="translation">
    ${(duaa.translation || duaa.english || "").replace(/\n/g, "<br>")}
  </p>

  

  ${duaa.virtues ? `
  <div class="section-heading">Virtue</div>
  <p class="translation">
    ${duaa.virtues}
  </p>
` : ""}

  <p class="reference">
    <strong>${duaa.reference || ""}</strong>
    ${duaa.grade ? " — " + duaa.grade : ""}
  </p>

  <div class="read-row">
    <label class="read-check">
      <input 
        type="checkbox" 
        ${isRead ? "checked" : ""}
        data-index="${index}"
      >
      <span>Read</span>
    </label>
  </div>
`;      eveningContainer.appendChild(card);
    });

    document.querySelectorAll(".read-check input").forEach(input => {
      input.addEventListener("change", function () {
        toggleEveningRead(Number(this.dataset.index));
      });
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
});
