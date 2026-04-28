// leaderboard.js — Render leaderboard từ Firestore data

let hasAnimated = false;

/**
 * Hiển thị leaderboard
 * @param {Array} data - Mảng object từ Firestore (đã sort đúng thứ tự)
 * @param {string} currentPlayerName - Tên người chơi hiện tại để highlight
 */
export function displayLeaderboard(data, currentPlayerName) {
  const board = document.getElementById("leaderboard");
  board.innerHTML = '<div class="title">🏆 BẢNG XẾP HẠNG</div>';

  if (data.length === 0) {
    board.innerHTML += '<div class="empty-msg">Chưa có dữ liệu nào.</div>';
    return;
  }

  data.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "row";

    // Top 3 styling
    if (i === 0) row.classList.add("top1");
    else if (i === 1) row.classList.add("top2");
    else if (i === 2) row.classList.add("top3");

    // Highlight người chơi hiện tại
    const isCurrentPlayer = p.name === currentPlayerName;
    if (isCurrentPlayer) row.classList.add("you-are-here");

    // Format thời gian từ giây → "X phút Y giây"
    const mins = Math.floor(p.timeSeconds / 60);
    const secs = p.timeSeconds % 60;
    const timeLabel = mins > 0 ? `${mins} phút ${secs > 0 ? secs + " giây" : ""}` : `${secs} giây`;

    row.innerHTML = `
      <div class="col-rank">#${i + 1}</div>
      <div class="col-name">
        ${p.name}
        ${isCurrentPlayer ? '<span class="you-badge">Bạn</span>' : ''}
      </div>
      <div class="col-score">${p.score.toLocaleString()}</div>
    `;

    board.appendChild(row);

    // Stagger animation chỉ lần đầu
    if (!hasAnimated) {
      setTimeout(() => row.classList.add("show"), i * 150);
    } else {
      row.classList.add("show");
    }

    row.onclick = () => openProfile(p, i + 1, timeLabel);
  });

  hasAnimated = true;
}

function openProfile(p, rank, timeLabel) {
  document.getElementById("playerName").innerText = p.name;
  document.getElementById("rankBadge").innerText = `Hạng #${rank}`;
  document.getElementById("playerInfo").innerHTML = `
    Điểm: <b>${p.score.toLocaleString()}</b><br>
    Thời gian: <b>${timeLabel}</b><br>
    Lần chơi thứ: <b>${p.playCount}</b>
  `;
  document.getElementById("playerModal").classList.add("show");
}