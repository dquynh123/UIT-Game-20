import { fetchLeaderboard } from "./firebase.js";

const summaryScreen = document.getElementById("summaryScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");
const overlay = document.getElementById("overlay"); // Lớp nền đen mờ chung

let isReady = false;
let hasAnimatedLeaderboard = false;

/* HIỆU ỨNG HOA ANH ĐÀO */
function petal(x, y) {
  const p = document.createElement("div");
  p.className = "petal";
  p.innerText = "🌸";
  p.style.left = x + "px";
  p.style.top = y + "px";
  p.style.fontSize = `${Math.random() * 10 + 12}px`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1500);
}

document.addEventListener("mousemove", (e) => {
  if (!isReady) return;
  
  // Chỉ rơi hoa khi đang ở màn hình Summary hoặc Leaderboard
  if (document.querySelector('#summaryScreen.show') || document.querySelector('#leaderboardScreen.show')) {
    if (Math.random() > 0.7) petal(e.clientX, e.clientY);
  }
});

/* 🔄 CHUYỂN MÀN HÌNH OVERLAY MƯỢT MÀ */
export function switchScreen(activeScreen) {

  const screens = [
    document.getElementById("main-menu"),
    document.getElementById("name-screen"),
    document.getElementById("game-scene"),
    document.getElementById("summaryScreen"),
    document.getElementById("leaderboardScreen")
  ];

  screens.forEach(screen => {
    if (!screen) return;

    screen.classList.remove("show");
    screen.classList.add("hidden");
  });

  activeScreen.classList.remove("hidden");

  requestAnimationFrame(() => {
    activeScreen.classList.add("show");
  });
}

/* 🎉 HIỂN THỊ MÀN HÌNH TỔNG KẾT (SUMMARY) */
export function showSummary(stageResults, totalTimeSeconds, totalScore) {
  // Bật overlay đen mờ chung của game
  if(overlay) {
    overlay.classList.remove("hidden");
    overlay.classList.add("show");
  }

  const box = document.getElementById("summaryRows");
  if(!box) return;
  box.innerHTML = "";

  // Vẽ từng hàng điểm
  stageResults.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "row";
    div.innerHTML = `
      <div style="font-weight: bold; opacity: 0.8">Chặng ${i + 1}</div>
      <div>${r.label}</div>
      <div style="text-align: right; font-weight: bold">${r.score}</div>
    `;
    box.appendChild(div);
    // Delay animation từng hàng
    setTimeout(() => div.classList.add("show"), i * 150);
  });

  // Hàng tổng điểm
  setTimeout(() => {
    const t = document.createElement("div");
    t.className = "row total-row show";
    t.innerHTML = `
      <div>★</div>
      <div>TỔNG ĐIỂM</div>
      <div style="text-align: right">${totalScore}</div>
    `;
    box.appendChild(t);
  }, stageResults.length * 150 + 200);

  // Cập nhật thời gian
  if(document.getElementById("summaryTime")) {
      const mins = Math.floor(totalTimeSeconds / 60);
      const secs = totalTimeSeconds % 60;
      const timeText = mins > 0 ? `${mins} phút ${secs > 0 ? secs + " giây" : ""}` : `${secs} giây`;
      document.getElementById("summaryTime").textContent = timeText; 
  }

  // Hiện màn hình
  switchScreen(summaryScreen);
}

/* 🏆 SỰ KIỆN NÚT BẤM (BẮT CLICK TOÀN TRANG MÀ KHÔNG CẦN CHỜ LOAD DOM) */
document.addEventListener("click", async (e) => {
    // Tìm xem người chơi có click trúng 1 trong 3 nút này không
    const btnShow = e.target.closest("#btnShowLeaderboard");
    const btnTopLeft = e.target.closest("#top-left-leaderboard-btn");
    const btnBack = e.target.closest("#btnBackToSummary");

    // --- Hàm xử lý tải bảng xếp hạng chung ---
    async function openLeaderboardAction(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "⏳ Đang tải...";
        btn.disabled = true;

        const data = await fetchLeaderboard();
        displayLeaderboard(data, localStorage.getItem("currentPlayerName"));

        switchScreen(document.getElementById("leaderboardScreen"));
        btn.innerHTML = originalText;
        btn.disabled = false;
    }

    // 1. Nếu bấm từ màn hình Tổng kết
    if (btnShow) {
        await openLeaderboardAction(btnShow);
        const backBtn = document.getElementById("btnBackToSummary");
        if (backBtn) {
            backBtn.dataset.source = "summary";
            backBtn.textContent = "🔙 QUAY LẠI TỔNG KẾT";
        }
    }

    // 2. Nếu bấm từ Menu chính (Góc trái trên)
    if (btnTopLeft) {
        await openLeaderboardAction(btnTopLeft);
        const backBtn = document.getElementById("btnBackToSummary");
        if (backBtn) {
            backBtn.dataset.source = "main";
            backBtn.textContent = "🔙 QUAY LẠI MENU";
        }
    }

    // 3. Xử lý logic Nút Quay Lại
    if (btnBack) {
        if (btnBack.dataset.source === "main") {
            switchScreen(document.getElementById("main-menu"));
            
            // THÊM THÔNG BÁO Ở ĐÂY (Dùng setTimeout để đợi màn hình chuyển xong mới báo)
            setTimeout(() => {
                alert("🌸 Con chuột của bạn đã bị dính hoa anh đào!");
            }, 500); 

        } else {
            switchScreen(document.getElementById("summaryScreen"));
        }
    }
});

/* 📊 RENDER LEADERBOARD */
export function displayLeaderboard(data, currentPlayerName) {
  const box = document.getElementById("leaderboardRows");
  if(!box) return;
  box.innerHTML = ""; 

  if (data.length === 0) {
    box.innerHTML = '<div style="text-align:center; padding: 20px; opacity: 0.7">Chưa có dữ liệu nào.</div>';
    return;
  }

  data.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "row";

    if (i === 0) row.classList.add("gold");
    else if (i === 1) row.classList.add("silver");
    else if (i === 2) row.classList.add("bronze");
    
    if (p.name === currentPlayerName || p.name === "Bạn") row.classList.add("you");

    row.innerHTML = `
      <div style="font-weight: bold; font-size: 18px">#${i + 1}</div>
      <div>${p.name}</div>
      <div style="text-align: right; font-weight: bold">${p.score.toLocaleString()}</div>
    `;

    row.onclick = () => openProfile(p, i + 1);
    box.appendChild(row);

    if (!hasAnimatedLeaderboard) {
      setTimeout(() => row.classList.add("show"), i * 100);
    } else {
      row.classList.add("show");
    }
  });

  hasAnimatedLeaderboard = true;
  isReady = true;
}

/* 👤 MỞ MODAL PROFILE */
function openProfile(p, rank) {
  const playerModal = document.getElementById("playerModal");
  if(!playerModal) return;

  document.getElementById("playerName").innerHTML = p.name; 
  const badge = document.getElementById("rankBadge");
  badge.textContent = `Hạng #${rank}`;

  const mins = Math.floor(p.timeSeconds / 60);
  const secs = p.timeSeconds % 60;
  
  const timeLabel = mins > 0 ? `${mins} phút ${secs > 0 ? secs + " giây" : ""}` : `${secs} giây`;
  document.getElementById("playerInfo").innerHTML = `
    Điểm: <b>${p.score.toLocaleString()}</b><br>
    Thời gian: <b>${timeLabel}</b><br>
    Lần chơi thứ: <b>${p.playCount}</b>
  `;

  playerModal.classList.add("show");
}

/* TẮT MODAL PROFILE */
document.addEventListener('click', (e) => {
  if (e.target.id === "playerModal") {
    e.target.classList.remove("show");
  }
});

/* ✨ HIỆU ỨNG CHUỘT CHỈ CHẠY KHI ĐANG MỞ LEADERBOARD/SUMMARY */
document.addEventListener("mousemove", (e) => {
  if (!isReady) return;
  if (Math.random() > 0.3) return; 
  petal(e.clientX, e.clientY);
});