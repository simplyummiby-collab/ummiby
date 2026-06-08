document.addEventListener("DOMContentLoaded", function () {
  const todayDate = document.getElementById("todayDate");
  const hijriDate = document.getElementById("hijriDate");
  const morningContainer = document.getElementById("morningDuaaContainer");

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

  if (!morningContainer) {
    alert("Could not find morningDuaaContainer.");
    return;
  }

  if (typeof morningDuaas === "undefined") {
    morningContainer.innerHTML = `
      <div class="duaa-card">
        <div class="duaa-label">Data file not loading</div>
        <p class="translation">Check that morning-data.js exists and is linked before morning-app.js.</p>
      </div>
    `;
    return;
  }

  function getTodayKey(baseKey) {
    const today = new Date().toISOString().slice(0, 10);
    return `${baseKey}_${today}`;
  }

  function getMorningProgress() {
    return JSON.parse(localStorage.getItem(getTodayKey("morningDuaaProgress"))) || {};
  }

  function saveMorningProgress(progress) {
    localStorage.setItem(getTodayKey("morningDuaaProgress"), JSON.stringify(progress));
  }

  function renderMorningDuaas() {
    const progress = getMorningProgress();
    morningContainer.innerHTML = "";

    const completedCount = morningDuaas.filter((_, index) => progress[index]).length;
    const percent = Math.round((completedCount / morningDuaas.length) * 100);

    const progressBox = document.createElement("div");
    progressBox.className = "progress-box page-title";

    progressBox.innerHTML = `
      <h3>${completedCount} of ${morningDuaas.length} Read (${percent}%)</h3>
      <p>Your progress saves for today and resets automatically tomorrow.</p>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>

      ${completedCount === morningDuaas.length ? `
        <div class="completion-message">
          🎉 Alhamdulillah. You completed today's Morning Duaas.
        </div>
      ` : ""}

      <div class="progress-actions split">
        <button class="reader-btn subtle-btn" id="resetMorningProgressBtn">Reset</button>
        <button class="reader-btn" id="continueReadingBtn">Go to Next Unread</button>
      </div>
    `;

    morningContainer.appendChild(progressBox);

    document
      .getElementById("resetMorningProgressBtn")
      .addEventListener("click", resetMorningProgress);

    document
      .getElementById("continueReadingBtn")
      .addEventListener("click", continueReading);

    morningDuaas.forEach((duaa, index) => {
      const isRead = progress[index] === true;

      const card = document.createElement("div");
      card.className = "duaa-card";
      card.setAttribute("data-duaa-index", index);

      if (isRead) card.classList.add("read");

      card.innerHTML = `
        <div class="duaa-label">Duaa ${index + 1}</div>

        <h3 class="duaa-title">${duaa.label || "Morning Duaa"}</h3>

        ${duaa.summary ? `
          <p class="duaa-summary">${duaa.summary}</p>
        ` : ""}

        ${duaa.count ? `
          <p class="reference"><strong>Repeat:</strong> ${duaa.count}</p>
        ` : ""}

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

        ${duaa.explore?.length ? `
          <div class="section-heading">📚 Explore</div>

          <div class="explore-links">
            ${duaa.explore.map(item => `
              <a href="${item.url}" target="_blank" class="explore-link">
                ${
                  item.type === "audio" ? "🎧" :
                  item.type === "video" ? "🎥" :
                  item.type === "benefit" ? "💡" :
                  item.type === "reading" ? "📖" :
                  "🔗"
                }
                ${item.title}
              </a>
            `).join("")}
          </div>
        ` : ""}

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
      `;

      morningContainer.appendChild(card);
    });

    document.querySelectorAll(".read-check input").forEach(input => {
      input.addEventListener("change", function () {
        toggleMorningRead(Number(this.dataset.index));
      });
    });
  }

  function toggleMorningRead(index) {
    const progress = getMorningProgress();
    progress[index] = !progress[index];
    saveMorningProgress(progress);
    renderMorningDuaas();
  }

  function resetMorningProgress() {
    localStorage.removeItem(getTodayKey("morningDuaaProgress"));
    renderMorningDuaas();
  }

  function continueReading() {
    const progress = getMorningProgress();
    const firstUnreadIndex = morningDuaas.findIndex((_, index) => !progress[index]);

    if (firstUnreadIndex === -1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const firstUnreadCard = document.querySelector(
      `[data-duaa-index="${firstUnreadIndex}"]`
    );

    if (firstUnreadCard) {
      const yOffset = -170;
      const y =
        firstUnreadCard.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }

  renderMorningDuaas();
});
