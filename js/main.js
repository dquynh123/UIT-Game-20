// js/main.js
import { playVN } from './dialogue.js';
// 1. Khai báo các thành phần giao diện
const mainMenu = document.getElementById('main-menu');
const nameScreen = document.getElementById('name-screen');
const gameScene = document.getElementById('game-scene');
const fadeOverlay = document.getElementById('fade-overlay'); // Lớp phủ đen
const startBtn = document.getElementById('main-start-btn');
const enterBtn = document.getElementById('enter-btn');
const userInput = document.getElementById('user-name');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const leaderboardOverlay = document.getElementById('overlay');
// HỆ THỐNG ĐIỀU PHỐI CHUYỂN CẢNH (DÙNG CHUNG TOÀN GAME)
/**
 * @param {Function} action - Hành động thực hiện khi màn hình đã tối đen
 */
function sceneTransition(action) {
    // 1. Hiện lớp phủ đen (Fade Out)
    fadeOverlay.classList.add('active');
    // 2. Chờ màn hình đen hẳn (0.8s theo CSS) rồi thực hiện đổi nội dung
    setTimeout(() => {
        if (typeof action === 'function') action();
        // 3. Ẩn lớp phủ đen (Fade In màn hình mới)
        setTimeout(() => {
            fadeOverlay.classList.remove('active');
        }, 200); // Khoảng nghỉ ngắn
    }, 800);
}

// LOGIC MÀN HÌNH CHÍNH & NHẬP TÊN
// Chuyển từ Menu chính sang Màn nhập tên (Dùng hiệu ứng Slide + Fade cũ)
startBtn.addEventListener('click', () => {

    mainMenu.classList.add('fade-out-left');
    setTimeout(() => {
        mainMenu.style.display = 'none';
        nameScreen.classList.remove('hidden');
        userInput.focus();
    }, 800);
});

// Hàm xử lý khi vào Game (Đã dọn dẹp xung đột và tối ưu logic)
function handleStartGame() {
    const userName = userInput.value.trim();

    // 1. Kiểm tra tên trống
    if (userName === "") {
        alert("Vui lòng nhập tên để lưu ký ức nhé!");
        userInput.focus();
        return;
    }

    try {
        // 2. Lấy danh sách cũ từ kho lưu trữ
        let savedData = localStorage.getItem('allPlayers');
        let playerList = [];

        try {
            playerList = savedData ? JSON.parse(savedData) : [];
            if (!Array.isArray(playerList)) playerList = [];
        } catch (e) {
            playerList = [];
        }

        // 3. KIỂM TRA TRÙNG TÊN (Chốt chặn quan trọng)
        const isDuplicate = playerList.some(player => player.name.toLowerCase() === userName.toLowerCase());

        if (isDuplicate) {
            alert("Tên này đã có người sử dụng rồi, bạn chọn tên khác nhé!");
            userInput.value = "";
            userInput.focus();
            return; // Dừng lại ngay lập tức
        }

        // 4. NẾU HỢP LỆ -> LƯU THÔNG TIN
        localStorage.setItem('currentPlayerName', userName);

        const newSession = {
            name: userName,
            score: 0,
            time: new Date().toLocaleString(),
            timestamp: Date.now()
        };

        playerList.push(newSession);
        localStorage.setItem('allPlayers', JSON.stringify(playerList));
        localStorage.setItem('currentSessionId', newSession.timestamp);
        window.UITGameStats.startGame(); // Kích hoạt tính giờ và điểm

        // 5. HIỆU ỨNG CHUYỂN CẢNH "CHA CON"
        sceneTransition(() => {
            nameScreen.classList.add('hidden');
            gameScene.classList.remove('hidden');
            console.log("Người chơi hiện tại:", userName);

 // Kiểm tra và gọi hàm startGame
            if (typeof startGame === "function") {
                startGame();
            } else if (typeof window.startGame === "function") {
               window.startGame();
            }
        });
    } catch (err) {
        console.error("Lỗi hệ thống:", err);
        // Nếu có lỗi lưu trữ, vẫn cố gắng cho vào game để không chết nút
        sceneTransition(() => {
            nameScreen.classList.add('hidden');
            gameScene.classList.remove('hidden');
            if (typeof window.startGame === "function") {
                window.startGame();
            }
        });
    }
}

// Gán sự kiện
enterBtn.addEventListener('click', handleStartGame);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleStartGame();
});

// LOGIC QUẢN LÝ TÒA NHÀ & GAMEPLAY
import './buildings/toaA.js';
import './buildings/toaE.js';
import './buildings/toaC.js';
import './buildings/toaD.js';

/**
// --- HỆ THỐNG TỔNG ĐIỂM TOÀN CỤC ---  */
window.UITGameStats = {
    totalScore: 0,
    startTime: 0,
    stageResults: [], // MỚI: Mảng lưu điểm từng tòa

    startGame() {
        this.totalScore = 0;
        this.startTime = Date.now();
        this.stageResults = [];
        console.log("Hệ thống: Bắt đầu tính điểm và thời gian.");
    },
    // Thêm tham số stageName để biết điểm của tòa nào
    addScore(stageName, points) {
        this.totalScore += (Number(points) || 0);
        this.stageResults.push({ label: stageName, score: Number(points) || 0 });
        console.log(`Hệ thống: [${stageName}] +${points} ĐRL. Tổng: ${this.totalScore}`);
    },
    getTimePlayedSeconds() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
};

window.switchBuilding = (buildingId) => {
    sceneTransition(() => {
        const allBuildings = ['vn-screen','toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
        allBuildings.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = (id === buildingId) ? 'block' : 'none';
            }
        });
        console.log(`📡 Hệ thống: Đã chuyển sang ${buildingId.toUpperCase()}`);
    });
};

// ==========================================
// HÀM GỌI BẢNG TỔNG KẾT DÙNG CHUNG (GLOBAL)
// ==========================================
window.showGlobalSummaryBoard = function(stageName, currentScore, timeSec, isWin, nextActionCallback) {
    const overlay = document.getElementById('global-summary-overlay');
    const title = document.getElementById('summary-title');
    const stageEl = document.getElementById('summary-stage');
    const scoreEl = document.getElementById('summary-score');
    const totalScoreEl = document.getElementById('summary-total-score');
    const statusEl = document.getElementById('summary-status');
    const timeEl = document.getElementById('summary-time');
    const btn = document.getElementById('summary-action-btn');

    // 1. Điền dữ liệu
    stageEl.innerText = stageName;
    scoreEl.innerText = currentScore;
    
    // Xử lý thời gian (Nếu game không truyền timeSec vào thì hiện "--")
    if (timeSec && timeSec > 0) {
        timeEl.innerText = `${timeSec} giây`;
    } else {
        timeEl.innerText = `--`; // Dành cho Tòa C, E không có tổng thời gian cụ thể
    }

    // 2. Lấy tổng điểm từ UITGameStats
    let total = currentScore; 
    if (window.UITGameStats && typeof window.UITGameStats.totalScore !== 'undefined') {
        total = window.UITGameStats.totalScore;
    }
    totalScoreEl.innerText = total;

    // 3. DIỆN MẠO CHUNG (Bỏ điều kiện Thắng/Thua đi)
    title.innerText = "TỔNG KẾT";
    statusEl.innerText = "Thời gian";
    statusEl.style.color = "#1de9b6"; // Màu xanh ngọc chuẩn của form
    
    // 4. Xử lý nút bấm (Chống click đúp)
    btn.onclick = null; 
    btn.onclick = () => {
        overlay.classList.add('hidden'); // Ẩn bảng đi
        if (typeof nextActionCallback === 'function') {
            nextActionCallback(); // Gọi hàm đi tiếp
        }
    };

    // 5. Hiện bảng
    overlay.classList.remove('hidden');
};
//VISUAL NOVEL ==================
window.startGame = function() {
    console.log("Trò chơi bắt đầu! Đang tải kịch bản test...");
    const StoryToaE = [
        {
            id: "test_01",
            name: "Sinh viên ATTT Tài năng",
            text: "Anh lên Tòa E dự seminar hả? Sao nhìn anh ngơ ngác vậy?",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_02"
        },
        {
            id: "test_02",
            name: "{PLAYER}",
            text: "Ờm... tự nhiên chớp mắt cái thấy đứng đây. Có người bảo anh phải đi tìm mấy cái mảnh ký ức gì đó để tìm đường về.",
            bg: "",
            sprite: "assets/images/test_main.png", 
            nextId: "test_03"
        },
        {
            id: "test_03",
            name: "Sinh viên ATTT Tài năng",
            text: "Mảnh ký ức à? Nãy em thấy có ông anh nào cũng đáng ngờ như anh bấm thang máy lên tầng 12 ấy.",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_04" 
        },
        {
            id: "test_04",
            name: "Sinh viên ATTT Tài năng",
            text: "Tầng 12 á? Đùa à, chờ cái thang máy tòa E này chắc tới sáng mai mất.",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_05" 
        },
        {
            id: "test_05",
            name: "{PLAYER}",
            text: "Thì đặc sản trường mình mà anh!",
            bg: "",
            sprite: "assets/images/test_main.png",
            nextId: "test_06"
        },
        {
            id: "test_06",
            name: "Sinh viên ATTT Tài năng",
            text: "Ờm ở không gian này, anh không bấm thang máy bằng tay đâu, mà xài điểm rèn luyện. Anh có 150 điểm rèn luyện để tiêu! Anh phải bỏ điểm rèn luyện ra để tung xúc xắc test nhân phẩm. Có 3 loại xúc xắc cho anh chọn, 4 mặt, 6 mặt và 20 mặt tương ứng với 3, 5, 20 điểm rèn luyện. Và nhớ là anh có tối đa 25 lượt dùng xúc xắc nhé. Hên thì một phát lên mây, xu thì... anh tự hiểu ha. Chơi không?",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: null
        },
    ];

    playVN(StoryToaE, "test_01", () => {
        console.log("Hết hội thoại! Chuyển sang Tòa E...");
        window.switchBuilding('toa-e');
    });
};

// Khởi tạo mặc định khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo ban đầu các tòa nhà được setup đúng vị trí ẩn/hiện
    const allBuildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    allBuildings.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
});

window.playVN = playVN;

