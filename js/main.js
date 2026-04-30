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

//VISUAL NOVEL ==================
window.startGame = function() {
    console.log("Trò chơi bắt đầu! Đang tải kịch bản test...");
    const StoryToaE = [
        {
            id: "test_01",
            name: "Sinh viên ATTT Tài năng",
            text: "Lại thêm một ông nữa lạc vào đây à? Nhìn bộ đồ với cái mặt này... chắc anh 'ra trường' mấy mùa quýt rồi nhỉ?",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_02"
        },
        {
            id: "test_02",
            name: "{PLAYER}",
            text: "Ý là bảo tôi già chứ gì? Mà đúng thật, tôi đến đây không phải để học mà đang tìm đường về qua mấy cái mảnh ký ức quái ác này đây.",
            bg: "",
            sprite: "assets/images/test_main.png", // Bạn có thể xóa dòng này nếu không muốn hiện cái đầu
            nextId: "test_03"
        },
        {
            id: "test_03",
            name: "Sinh viên ATTT Tài năng",
            text: "Ký ức à... Nếu là mấy thứ nặng nề ấy thì chắc nó vẫn nằm trên tầng 12 thôi. Nhưng nói trước, thang bộ tòa này 'ám' lắm, anh già rồi thì leo từ tốn thôi, coi chừng đứt hơi giữa chừng.",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_04" // 👉 KHÔNG DÙNG CHOICES NỮA, TRỎ THẲNG SANG CÂU TIẾP THEO
        },
        {
            id: "test_04",
            name: "Sinh viên ATTT Tài năng",
            text: "Mà cũng đúng thôi, cái tòa E này nó thế. Muốn biết mình là ai, muốn nhìn cho rõ cái tương lai mờ mịt phía trước thì cứ phải lết lên đến cái đỉnh cao nhất kia kìa. Đứng trên ấy gió lộng, nhìn xuống thấy người ta bé như kiến, lúc đấy mới thấy mấy cái rắc rối dưới này chả là gì.",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "test_05" // 👉 TRỎ THẲNG ĐẾN KẾT THÚC
        },
        {
            id: "test_05",
            name: "{PLAYER}",
            text: "Nói thì hay lắm, nhưng giờ đường xá trong đầu tôi nó cứ mờ mịt thế này, biết lối nào mà leo?",
            bg: "",
            sprite: "assets/images/test_main.png",
            nextId: "test_06"
        },
        {
            id: "test_06",
            name: "Sinh viên ATTT Tài năng",
            text: "Dùng 'Điểm rèn luyện' (ĐRL) của anh đi. Đó là loại vật phẩm trao đổi duy nhất có giá trị ở đây. Anh có thể chọn tung xúc xắc an toàn, hoặc đánh cược tất cả để tiến nhanh hơn. Nhưng cẩn thận... cái thang máy tòa này nó ảo lắm, lên nhanh được thì rơi tự do cũng nhanh lắm đấy. Cân nhắc cho kỹ.",
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

