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

// ==========================================
// 1. KỊCH BẢN CẢNH 1 & 2 
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
        text: "Tiếng thông báo tin nhắn công việc, email kêu liên tục. Giữa một nùi thông báo, một email popup lên: 'UIT 20th - Thư mời...'",
        bg: "",
        sprite: "",
        nextId: "s1_03"
    },
    {
        id: "s1_03",
        name: "{PLAYER}",
        text: " UIT...?",
        voice: "assets/voice/voice1_scene1.ogg",
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
        voice: "assets/voice/voice2_scene1.ogg",
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
        text: "Ủa... đây là trường mình mà? Sao vắng hoe vậy?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_03"
    },
    {
        id: "s2_03",
        name: "Người Hướng Dẫn",
        text: "Chào bạn. Lạc đường hả?",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_04"
    },
    {
        id: "s2_04",
        name: "{PLAYER}",
        text: "Ai, Ai vậy?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_05"
    },
    {
        id: "s2_05",
        name: "Người Hướng Dẫn",
        text: "Bình tĩnh nào, cứ coi tôi là admin tạm thời của khu vực này đi. ",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_06"
    },
    {
        id: "s2_06",
        name: "Người Hướng Dẫn",
        text: "Lúc anh click vào cái mail đó, anh đã vô tình đăng nhập vào một không gian đặc biệt... ",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_07"
    },
    {
        id: "s2_07",
        name: "Người Hướng Dẫn",
        text: "Nơi này giống như một cái server được tạo nên từ chính những ký ức của hàng ngàn sinh viên trường mình suốt 20 năm qua vậy. Và hiện tại, anh đang kẹt trong server đó",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_08"
    },

    {
        id: "s2_08",
        name: "{PLAYER}",
        text: "Hả? Cái gì cơ? Server ? Ký ức ? Tôi có đang nằm mơ không vậy?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_09"
    },

    {
        id: "s2_09",
        name: "{PLAYER}",
        text: "Ui đau thật",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_10"
    },

    {
        id: "s2_10",
        name: "Người Hướng Dẫn",
        text: "Cứ cho là anh đang mơ đi. Ở đây logic đời thực không xài được đâu. Mấy tòa nhà này không chỉ là cục bê tông, mà nó chứa cả bộ nhớ kỷ niệm của bao nhiêu khóa sinh viên đấy. Giờ thì... anh cũng kẹt lại trong mớ dữ liệu đó rồi.",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_11"
    },

    {
        id: "s2_11",
        name: "{PLAYER}",
        text: "Vậy rốt cuộc làm sao để thoát ra?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_12"
    },

    {
        id: "s2_12",
        name: "Người Hướng Dẫn",
        text: "Anh phải đi nhặt lại mấy mảnh ký ức đang rơi tứ tung ở các tòa nhà. Gom đủ thì về nhà ngủ tiếp. Không thì...",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_13"
    },

    {
        id: "s2_13",
        name: "{PLAYER}",
        text: "Thì thì sao cơ???",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_14"
    },

    {
        id: "s2_14",
        name: "Người Hướng Dẫn",
        text: "Thì reset tài khoản, ở lại đây học lại từ năm nhất tới già chứ sao .",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_15"
    },

     {
        id: "s2_15",
        name: "{PLAYER}",
        text: "Đi làm chạy deadline chưa đủ khổ hay sao trời, tới giờ đi ngủ rồi mà còn...",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_16"
    },

    {
        id: "s2_16",
        name: "Người Hướng Dẫn",
        text: "Bắt đầu từ Tòa E nhé. Lên hội trường, có người đang đợi anh đấy. Chúc may mắn .",
        bg: "",
        sprite: "assets/images/test_guide.png", 
        nextId: "s2_17"
    },

    // --- PHẦN GẶP SINH VIÊN TTDPT Ở TÒA E ---
    {
        id: "s2_17",
        name: "",
        text: "Main bước vào thang máy tòa E",
        bg: "", 
        sprite: "",
        nextId: "s2_18"
    },
    {
        id: "s2_18",
        name: "Sinh viên TTĐPT",
        text: "Anh lên tầng mấy ạ? Để em bấm cho.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_19"
    },
    {
        id: "s2_19",
        name: "{PLAYER}",
        text: "Bấm giùm anh tầng 12 với.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_20"
    },
    {
        id: "s2_20",
        name: "Sinh viên TTĐPT",
        text: "Lạ thật, chẳng có đèn nào sáng. Em thử tầng 5, tầng 8 cũng không được. Chắc thang máy hỏng rồi anh ạ.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_21"
    },

    {
        id: "s2_21",
        name: "Sinh viên TTĐPT",
        text: "Trời ạ, thang máy Tòa E nổi tiếng chậm, nhưng hôm nay nó ngủ luôn à? Em còn phải lên nghe seminar, trễ là mất điểm danh.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_22"
    },

    {
        id: "s2_22",
        name: "{PLAYER}",
        text: "Hồi anh học cỡ sáu bảy năm trước, thang này đã chậm rồi. Mà em học khoa gì?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_23"
    },
    {
        id: "s2_23",
        name: "Sinh viên TTĐPT",
        text: "Dạ em học Truyền thông đa phương tiện, năm nhất. Còn anh? Nhìn anh… không giống sinh viên lắm.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_24"
    },
    {
        id: "s2_24",
        name: "{PLAYER}",
        text: "Anh học Kỹ thuật phần mềm. Cựu sinh viên khóa 2018. Ra trường cũng ngót nghét năm năm rồi, tự nhiên lạc vào đây.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_25"
    },
    {
        id: "s2_25",
        name: "Sinh viên TTĐPT",
        text: "Ối, senpai khóa 2018 cơ à? Trông anh trẻ thật đấy!",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_25"
    },
    {
        id: "s2_25",
        name: "Người hướng dẫn",
        text: "Chào mừng cựu sinh viên khoa Công nghệ phần mềm. Tôi là hệ thống hướng dẫn. Ở không gian này, muốn lên tầng thì không bấm bằng tay đâu - phải xài Điểm Rèn Luyện. Anh có 200 ĐRL để tiêu đấy",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: "s2_26"
    },
    {
        id: "s2_26",
        name: "Sinh viên TTĐPT",
        text: "Ai nói thế? Loa tự nhiên phát ra giọng lạ. Anh có nghe thấy không ạ? Hay em bị ảo giác?",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "s2_27"
    },
    {
        id: "s2_27",
        name: "{PLAYER}",
        text: "Có. Là cái hệ thống hướng dẫn đấy. Hồi nãy anh gặp rồi. Có vẻ chỉ mình anh mới tương tác được.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "s2_28"
    },
    {
        id: "s2_28",
        name: "Người hướng dẫn",
        text: "Chính xác. Chỉ cựu sinh viên đang kẹt mới được tôi hướng dẫn. Nào, anh hãy dùng ĐRL để tung xúc xắc test nhân phẩm. ",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: "s2_39"
    },
    {
        id: "s2_39",
        name: "Người hướng dẫn",
        text: "Ba loại: 4 mặt (tốn 3 ĐRL), 6 mặt (tốn 5 ĐRL) và 20 mặt (tốn 25 ĐRL). Nhớ là anh có tối đa 25 lượt. Hên thì một phát lên luôn, xu thì… anh tự hiểu. Chọn đi.",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: null
    }
];

window.startGame = function() {
    window.currentCheckpoint = "scene1";
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
                    window.currentCheckpoint = "toa-e";
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

// ==========================================
// HỆ THỐNG LƯU / TẢI GAME (CHECKPOINT SYSTEM)
// ==========================================
const SAVE_KEY = "UIT_VN_SAVEDATA";

// Biến này sẽ nhớ xem người chơi đang ở giai đoạn nào của game
window.currentCheckpoint = "scene1"; 

// 1. HÀM LƯU GAME
window.saveGameProgress = () => {
    // Thu thập dữ liệu hiện tại
    const gameData = {
        playerName: localStorage.getItem('currentPlayerName') || "Bạn",
        stats: window.UITGameStats, // Lưu toàn bộ điểm rèn luyện và lịch sử
        checkpoint: window.currentCheckpoint // Lưu mốc cốt truyện
    };

    // Nén thành chuỗi và cất vào LocalStorage
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    alert("💾 Đã lưu tiến trình game thành công!");
};

// 2. HÀM TẢI GAME
window.loadGameProgress = () => {
    const savedString = localStorage.getItem(SAVE_KEY);
    
    if (!savedString) {
        alert("❌ Không tìm thấy dữ liệu lưu nào!");
        return;
    }

    // Giải nén dữ liệu
    const gameData = JSON.parse(savedString);

    // Bơm dữ liệu ngược lại vào game
    localStorage.setItem('currentPlayerName', gameData.playerName);
    if (gameData.stats) {
        window.UITGameStats.totalScore = gameData.stats.totalScore || 0;
        window.UITGameStats.stageResults = gameData.stats.stageResults || [];
    }
    window.currentCheckpoint = gameData.checkpoint;

    // Đóng bảng Menu Cài đặt
    const menuScreen = document.getElementById('vn-menu-screen');
    if (menuScreen) menuScreen.classList.remove('active');

    // Tắt Menu ngoài cùng, ép bật vào Game Scene
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('name-screen').classList.add('hidden');
    document.getElementById('game-scene').classList.remove('hidden');

    alert(`📂 Đã tải lại game! Bắt đầu từ mốc: ${window.currentCheckpoint}\nĐiểm Rèn Luyện hiện tại: ${window.UITGameStats.totalScore}`);

    // DỌN SẠCH CÁC MÀN HÌNH CŨ
    const allScreens = ['vn-screen', 'toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    allScreens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // KHỞI ĐỘNG LẠI TỪ MỐC ĐÃ LƯU
    resumeFromCheckpoint(window.currentCheckpoint);
};

// 3. HÀM ĐIỀU PHỐI ĐỂ MỞ ĐÚNG CHỖ ĐANG CHƠI DỞ
function resumeFromCheckpoint(checkpoint) {
    if (checkpoint === "scene1") {
        // Trở lại ngay đầu game
        if (typeof window.startGame === 'function') window.startGame();
    } 
    else if (checkpoint === "toa-e") {
        // Đang chơi dở mini-game Tòa E
        window.switchBuilding('toa-e');
    }
    else if (checkpoint === "toa-a") {
        // Đang ở Tòa A
        window.switchBuilding('toa-a');
    }
    // Bạn có thể thêm các if-else khác cho Tòa B, C, D ở đây
}

// 4. GẮN LỆNH VÀO 2 NÚT BẤM BẠN ĐÃ TẠO SẴN Ở HTML
document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btn-save-game');
    const btnLoad = document.getElementById('btn-load-game');
    const btnContinue = document.getElementById('main-continue-btn'); // Nút Tiếp tục ở Main Menu

    // --- ĐOẠN KIỂM TRA DỮ LIỆU CŨ (BƯỚC 2) ---
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData && btnContinue) {
        // Nếu có dữ liệu cũ, hiện nút Tiếp tục lên
        btnContinue.classList.remove('hidden');
        btnContinue.style.display = 'block';
        
        // Khi bấm nút Tiếp tục ở màn hình chính, gọi hàm Load
        btnContinue.onclick = () => {
            window.loadGameProgress();
        };
    }
    // ----------------------------------------

    // Gắn lệnh cho nút Lưu/Tải bên trong Menu Cài đặt
    if (btnSave) btnSave.addEventListener('click', window.saveGameProgress);
    if (btnLoad) btnLoad.addEventListener('click', window.loadGameProgress);
});