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

        // 3. KIỂM TRA TRÙNG TÊN 
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

        // 5. HIỆU ỨNG CHUYỂN CẢNH 
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

// ==========================================
// 1. KỊCH BẢN CẢNH 1 & 2 (Đã bỏ thẻ HTML rườm rà)
// ==========================================
const storyScene1 = [
    {
        id: "s1_01",
        name: "",
        text: "Thành phố về đêm hắt ánh đèn qua cửa sổ... Main ngồi gục trước màn hình máy tính, mặt bơ phờ. Giao diện chằng chịt code đỏ chót báo lỗi.",
        bg: "", 
        sprite: "",
        nextId: "s1_02"
    },
    {
        id: "s1_02",
        name: "",
        text: "*Ting!* *Ting!* *Ting!* Tiếng thông báo tin nhắn công việc, email kêu liên tục. Giữa một nùi thông báo, một email popup lên: 'UIT 20th – Thư mời...'",
        bg: "",
        sprite: "",
        nextId: "s1_03"
    },
    {
        id: "s1_03",
        name: "{PLAYER}",
        text: "(lẩm bẩm) UIT...?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s1_04"
    },
    {
        id: "s1_04",
        name: "",
        text: "Cậu rê chuột click vào email. Màn hình máy tính đột ngột chớp tắt, rồi tối sầm lại.",
        bg: "",
        sprite: "",
        nextId: "s1_05"
    },
    {
        id: "s1_05",
        name: "{PLAYER}",
        text: "Ụa máy tính bị gì v…",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: null // Kích hoạt hiệu ứng Nổ
    }
];

// Kịch bản Cảnh 2: Gặp Admin ở UIT
const storyScene2_UIT = [
    // --- PHẦN GẶP ADMIN Ở SÂN TRƯỜNG ---
    {
        id: "s2_01",
        name: "",
        text: "Main từ từ mở mắt. Cảnh vật quen thuộc hiện ra: Khuôn viên UIT. Nhưng trời đứng bóng, không gian im lìm không một tiếng động, không một bóng người.",
        bg: "", // Ảnh sân trường
        sprite: "",
        nextId: "s2_02"
    },
    {
        id: "s2_02",
        name: "{PLAYER}",
        text: "(Ngơ ngác xoa đầu) Ủa... đây là trường mình mà? Sao vắng hoe vậy?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_03"
    },
    {
        id: "s2_03",
        name: "Người Hướng Dẫn",
        text: "Chào. Lạc đường hả?",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_04"
    },
    {
        id: "s2_04",
        name: "Người Hướng Dẫn",
        text: "Bình tĩnh nào, cứ coi tôi là admin tạm thời của khu vực này đi. Anh đã vô tình đăng nhập vào một server được tạo nên từ ký ức của sinh viên trường mình...",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_05"
    },
    {
        id: "s2_05",
        name: "Người Hướng Dẫn",
        text: "Anh phải đi nhặt lại mấy mảnh ký ức đang rơi tứ tung ở các tòa nhà. Gom đủ thì về nhà ngủ tiếp. Không thì... ở lại đây học lại từ năm nhất nha.",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_06"
    },
    {
        id: "s2_06",
        name: "Người Hướng Dẫn",
        text: "Bắt đầu từ Tòa E nhé. Chúc may mắn.",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_07"
    },

    // --- PHẦN GẶP SINH VIÊN ATTT Ở TÒA E ---
    {
        id: "s2_07",
        name: "",
        text: "Main ngó nghiêng quanh sảnh thang máy Tòa E thì thấy một cậu Sinh viên An Toàn Thông Tin (ATTT) đang đứng bấm điện thoại.",
        bg: "", 
        sprite: "",
        nextId: "s2_08"
    },
    {
        id: "s2_08",
        name: "Sinh viên ATTT",
        text: "(Ngước lên nhìn) Anh lên Tòa E dự seminar hả? Sao nhìn anh ngơ ngác vậy?",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_09"
    },
    {
        id: "s2_09",
        name: "{PLAYER}",
        text: "Ờm... tự nhiên chớp mắt cái thấy đứng đây. Có người bảo anh phải đi tìm mấy cái mảnh ký ức gì đó để tìm đường về.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_10"
    },
    {
        id: "s2_10",
        name: "Sinh viên ATTT",
        text: "Mảnh ký ức à? Nãy em thấy có ông anh mặc áo hoodie bí ẩn cũng đáng ngờ như anh bấm thang máy lên tầng 12 ấy.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_11"
    },
    {
        id: "s2_11",
        name: "{PLAYER}",
        text: "Tầng 12 á? Đùa à, chờ cái thang máy tòa E này chắc tới sáng mai mất.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_12"
    },
    {
        id: "s2_12",
        name: "Sinh viên ATTT",
        text: "Thì đặc sản trường mình mà anh! Ờm... ở không gian này, anh không bấm thang máy bằng tay đâu, mà xài Điểm rèn luyện.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_13"
    },
    {
        id: "s2_13",
        name: "Sinh viên ATTT",
        text: "Anh có 200 điểm rèn luyện để tiêu! Anh phải bỏ điểm rèn luyện ra để tung xúc xắc test nhân phẩm. Có 3 loại xúc xắc cho anh chọn, 4 mặt, 6 mặt và 20 mặt tương ứng với 3, 5, 25 điểm rèn luyện. Và nhớ là anh có tối đa 25 lượt dùng xúc xắc nhé. Hên thì một phát lên mây, xu thì... anh tự hiểu ha. Chơi không?",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: null
    }
];

window.startGame = function() {
    
    // 1. Bơm cấu trúc HTML Glitch vào Web
    if (!document.getElementById('cyber-glitch-overlay')) {
        const glitchHTML = `
            <div id="cyber-glitch-overlay">
                <div class="glitch-tear tear-1"></div>
                <div class="glitch-tear tear-2"></div>
                <div class="glitch-tear tear-3"></div>
            </div>
            <div id="whiteout-overlay"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', glitchHTML);
    }

    const glitchLayer = document.getElementById('cyber-glitch-overlay');
    const whiteoutLayer = document.getElementById('whiteout-overlay');
    const vnScreen = document.getElementById('vn-screen'); // Lấy cả màn hình để làm rung lắc

    // 2. CHẠY KỊCH BẢN CẢNH 1
    playVN(storyScene1, "s1_01", () => {
        let glitchSound = new Audio('assets/sound/glitch_canh1.mp3'); // SỬA TÊN FILE TẠI ĐÂY
        glitchSound.volume = 1.0; // Chỉnh âm lượng (từ 0.0 đến 1.0)
        glitchSound.play();       // Lệnh phát nhạc!
        // --> BẠN PLAY SOUND GLITCH CỦA BẠN Ở ĐÂY <--
        // let glitchSound = new Audio('assets/sounds/glitch_distort.mp3'); 
        // glitchSound.play();

        console.log("Kích hoạt Glitch!");
        
        // HIỆU ỨNG 1: Rung lắc nguyên cả màn hình game
        vnScreen.classList.add('screen-shake');
        
        // HIỆU ỨNG 2: Bật các vệt rách màu RGB và chớp tắt âm bản
        glitchLayer.classList.add('active');
        
        // ĐỂ NÓ GIẬT TRONG 1.5 GIÂY RỒI NỔ FLASHBANG
        setTimeout(() => {
            console.log("Nổ Flashbang chói lóa!");
            whiteoutLayer.classList.add('trigger-flashbang');
            
            // Tắt hết Glitch và Rung lắc khi màn hình đã trắng xóa
            glitchLayer.classList.remove('active');
            vnScreen.classList.remove('screen-shake');

            // TRONG LÚC MÀN HÌNH TRẮNG: Load Cảnh 2
            setTimeout(() => {
                
                playVN(storyScene2_UIT, "s2_01", () => {
                    window.switchBuilding('toa-e');
                });

                // Từ từ làm mờ Flashbang trong 3 giây, lộ ra cảnh sân trường tĩnh lặng
                whiteoutLayer.style.transition = "opacity 3s ease-in-out"; 
                whiteoutLayer.classList.remove('trigger-flashbang');
                
            }, 500); 
            
        }, 1500); // Khoảng thời gian giật lag
    });
};
window.playVN = playVN;

