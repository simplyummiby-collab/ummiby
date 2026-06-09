document.addEventListener("DOMContentLoaded", function () {
  const sidebarMount = document.getElementById("sidebar");
  if (!sidebarMount) return;

  const path = window.location.pathname;

  const isRoot = !path.includes("/morning/") &&
                 !path.includes("/evening/") &&
                 !path.includes("/daily/") &&
                 !path.includes("/sleep/") &&
                 !path.includes("/kahf/") &&
                 !path.includes("/library/");

  const prefix = isRoot ? "" : "../";

  sidebarMount.innerHTML = `
    <aside class="sidebar">
      <div class="logo">
        <div class="mark">☾</div>
        <h1>ummiby</h1>
        <p>Remembrance</p>
      </div>

      <nav class="nav">
        <a class="${isRoot ? "active" : ""}" href="${prefix}index.html">🏠 Home</a>
        <a class="${path.includes("/morning/") ? "active" : ""}" href="${prefix}morning/">🌄 Morning Duaas</a>
        <a class="${path.includes("/evening/") ? "active" : ""}" href="${prefix}evening/">🌅 Evening Duaas</a>
        <a class="${path.includes("/daily/") ? "active" : ""}" href="${prefix}daily/">🌿 Daily Duaa</a>
        <a class="${path.includes("/sleep/") ? "active" : ""}" href="${prefix}sleep/">🌙 Before Sleep</a>
        <a class="${path.includes("/kahf/") ? "active" : ""}" href="${prefix}kahf/">📖 Suratul Kahf</a>
        <a class="${path.includes("/library/") ? "active" : ""}" href="${prefix}library/">▥ Islamic Library</a>
      </nav>

      <div class="sidebar-note">
        Those who believed (in the Oneness of Allâh - Islâmic Monotheism), and whose hearts find rest in the remembrance of Allâh: verily, in the remembrance of Allâh do hearts find rest
        <br><br>
        <strong>Qur’an 13:28</strong>
      </div>
    </aside>
  `;
});
