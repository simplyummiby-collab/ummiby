document.addEventListener("DOMContentLoaded", function () {
  const eveningContainer = document.getElementById("eveningDuaaContainer");

  if (!eveningContainer) {
    alert("Could not find eveningDuaaContainer.");
    return;
  }

  eveningContainer.innerHTML = `
    <div class="duaa-card">
      <div class="duaa-label">Test Card</div>
      <div class="arabic">اللَّهُمَّ بِكَ أَمْسَيْنَا</div>
      <p class="translation">If you can see this, the app file is working.</p>
    </div>
  `;
});
