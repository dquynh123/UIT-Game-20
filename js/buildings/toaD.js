// ==========================================
// 1. KỊCH BẢN VÀ HÀM CHUYỂN SANG TÒA C
// ==========================================
const storyToaC = [
    //story nối tiếp tòa d
    {
        id: "c_01",
        name: "Bí thư Vũ",
        text: "Em cảm ơn anh nhiều lắm!",
        bg: "", 
        voice: "assets/voice/toaD/11.ogg",
        sprite: "assets/images/bithu.png",
        noSkip: true,
        nextId: "c_02"
    },
    {
        id: "c_02",
        name: "{PLAYER}",
        text: "Em làm tốt lắm rồi. Chỉ cần nhớ làm bí thư mà một mình quét sân cũng không sao, nhưng nhớ gọi điện kêu đồng đội phụ. Còn anh đi đây nhé.",
        bg: "",
        voice: "assets/voice/toaD/12.ogg",
        sprite: "assets/images/Main.png",
        nextId: "c_03"
    },
    {
        id: "c_03",
        name: "Bí thư Vũ",
        text: "Anh về dự kỷ niệm 20 năm nha! Lúc đó em sẽ khoe thành tích Đoàn của nhiệm kỳ em.",
        bg: "", 
        voice: "assets/voice/toaD/13.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "c_04"
    },
    {
        id: "c_04",
        name: "{PLAYER}",
        text: "Tòa C cuối cùng! Chắc là nơi mình lưu giữ những thứ quan trọng nhất.",
        bg: "",
        voice: "assets/voice/toaD/14.ogg",
        sprite: "assets/images/Main.png",
        nextId: "c_05"
    },
    {
        id: "c_05",
        name: "CTV BHT CNPM",
        text: "Anh trai ơi! Đi đâu mà vội mà vàng, ghé ngang gian hàng Ban Học Tập làm bài test kiến thức lấy quà không? Đang vắng khách quá nè!",
        bg: "",
        voice: "assets/voice/toaC/1.ogg",
        sprite: "assets/images/BHTCNPM.png",
        nextId: "c_06"
    },
    {
        id: "c_06",
        name: "{PLAYER}",
        text: "Anh đang kiếm đồ. Ở chỗ em có cái cục gì lấp lánh, phát sáng không?",
        bg: "",
        voice: "assets/voice/toaC/2.ogg",
        sprite: "assets/images/Main.png",
        nextId: "c_07"
    },
    {
        id: "c_07",
        name: "CTV BHT CNPM",
        text: "Có luôn! Tụi em có cái cúp mica gắn LED chớp tắt bao chói mắt! Nhưng mà muốn lấy thì khoai lắm nha.",
        bg: "",
        voice: "assets/voice/toaC/3.1.ogg",
        sprite: "assets/images/BHTCNPM.png",
        nextId: "c_08"
    },

    {
        id: "c_08",
        name: "CTV BHT CNPM",
        text: "Anh phải vượt qua thử thách 100 câu hỏi về lịch sử trường mình. Cảnh báo trước là đáp án bị hệ thống xáo trộn liên tục đó, anh phải thật tinh mắt mới chọn kịp.",
        bg: "",
        voice: "assets/voice/toaC/3.2.ogg",
        sprite: "assets/images/BHTCNPM.png",
        noSkip: true,
        nextId: "c_09"
    },
    {
        id: "c_09",
        name: "{PLAYER}",
        text: "100 câu à? Được. Anh sẵn sàng rồi.",
        bg: "",
        voice: "assets/voice/toaC/4.ogg",
        sprite: "assets/images/Main.png",
        nextId: "c_10"
    },
    {
        id: "c_10",
        name: "CTV BHT CNPM",
        text: "Chà, tự tin gớm ta! Để xem cựu sinh viên nhớ trường được bao nhiêu phần trăm nhé.",
        bg: "",
        voice: "assets/voice/toaC/5.ogg",
        sprite: "assets/images/BHTCNPM.png",
        noSkip: true,
        nextId: null
    },
];
window.storyToaC = storyToaC;
function transitionToToaC() {
    // Chạy máy đọc kịch bản Tòa C
    if (typeof window.playVN === 'function') {
        window.playVN(storyToaC, "c_01", () => {
            console.log("Đã đọc xong thoại Tòa C. Mở giao diện Tòa C...");
            
            // DÙNG LỆNH NÀY ĐỂ HỆ THỐNG TỰ ĐỘNG LƯU CHECKPOINT TÒA C
            if (typeof window.switchBuilding === 'function') {
                window.switchBuilding('toa-c');
            }
            
            // Chỉ bật màn hình Start Tòa C, giấu màn hình Game đi chờ người chơi bấm Bắt đầu
            const startScreenC = document.getElementById('start-screen-toa-c');
            const gameScreenC = document.getElementById('game-screen-toa-c');
            
            if (startScreenC) startScreenC.classList.remove('hidden');
            if (gameScreenC) gameScreenC.classList.add('hidden');
        });
    }
}
/*function transitionToToaC() {
    // 1. Ẩn toàn bộ giao diện Tòa D đi
    const toaD = document.getElementById('toa-d');
    if (toaD) toaD.style.display = 'none';

    // 2. Chạy máy đọc kịch bản Tòa C
    if (typeof window.playVN === 'function') {
        window.playVN(storyToaC, "c_01", () => {
            console.log("Đã đọc xong thoại Tòa C. Mở giao diện Tòa C...");
            
            // 3. Đọc xong thì ẩn màn hình VN, hiển thị Tòa C trực tiếp
            const vnScreen = document.getElementById('vn-screen');
            const toaC = document.getElementById('toa-c');
            
            if (vnScreen) vnScreen.style.display = 'none';
            if (toaC) toaC.style.display = 'block';
            
            // 4. Chỉ bật màn hình Start Tòa C, giấu màn hình Game đi chờ người chơi bấm Bắt đầu
            const startScreenC = document.getElementById('start-screen-toa-c');
            const gameScreenC = document.getElementById('game-screen-toa-c');
            
            if (startScreenC) startScreenC.classList.remove('hidden');
            if (gameScreenC) gameScreenC.classList.add('hidden');
        });
    }
}*/
/**
 * Tòa D - Typing game
 */

const canvasToaD = document.getElementById('gameCanvasToaD');
const ctxToaD = canvasToaD.getContext('2d');
const scoreElToaD = document.getElementById('score-toa-d');
const timerElToaD = document.getElementById('timer-toa-d');
const startScreenToaD = document.getElementById('start-screen-toa-d');
const endScreenToaD = document.getElementById('end-screen-toa-d');

const configToaD = {
    gameDuration: 120,
    spawnInterval: 1200, // Tăng tốc độ ra lá 
    maxLeavesAllowed: 12, 
    wordsEasy: ["dog", "cat", "sun", "fish", "bird", "tree", "home", "book", "pink", "blue", "red", "cloud", "phone", "chair", "table", "house", "river", "flower", "moon", "star", "start", "game"],
    wordsHard: ["university", "technology", "information", "celebration", "computer", "vietnam", "diversity", "education"]
};

let scoreToaD = 0;
let timeLeftToaD = configToaD.gameDuration;
let leavesToaD = [];
let gameIntervalToaD, spawnIntervalToaD, animationIdToaD;
let currentInput = "";
let isGameActive = false;

// Khởi tạo kích thước canvas
function resizeCanvasToaD() {
    canvasToaD.width = window.innerWidth;
    canvasToaD.height = window.innerHeight;
}
resizeCanvasToaD();
window.addEventListener('resize', resizeCanvasToaD);

class Leaf {
    constructor() {
        const isHard = Math.random() < 0.3; 
        this.type = isHard ? "hard" : "easy";
        this.word = isHard 
            ? configToaD.wordsHard[Math.floor(Math.random() * configToaD.wordsHard.length)]
            : configToaD.wordsEasy[Math.floor(Math.random() * configToaD.wordsEasy.length)];
        
        const margin = 150;
        this.x = Math.random() * (canvasToaD.width - 2 * margin) + margin;
        this.y = -120;
        this.stopY = Math.random() * (canvasToaD.height * 0.6) + (canvasToaD.height * 0.2);
        this.leafHalfLength = Math.max(45, (this.word.length * 10)); 
        this.leafWidth = 35 + (this.word.length * 2); 
        this.speed = this.type === "hard" ? Math.random() * 0.5 + 1.2 : Math.random() * 1.2 + 2.2;
        this.swingRange = this.type === "hard" ? 50 : 30;
        this.swingSpeed = 0.015;
        this.initialX = this.x;
        this.color = isHard ? "#d32f2f" : "#2e7d32"; 
        this.isGrounded = false;
        this.rotation = (Math.random() - 0.5) * 1; 
    }
    update() {
        if (!this.isGrounded) {
            this.y += this.speed;
            this.x = this.initialX + Math.sin(this.y * this.swingSpeed) * this.swingRange;
            if (this.y >= this.stopY) { this.y = this.stopY; this.isGrounded = true; }
        }
    }
    draw() {
        ctxToaD.save();
        ctxToaD.translate(this.x, this.y);
        ctxToaD.rotate(!this.isGrounded ? Math.sin(this.y * this.swingSpeed) * 0.5 : this.rotation);
        
        // Vẽ lá
        ctxToaD.fillStyle = this.color;
        ctxToaD.beginPath();
        ctxToaD.moveTo(0, -this.leafHalfLength); 
        ctxToaD.quadraticCurveTo(this.leafWidth, 0, 0, this.leafHalfLength);
        ctxToaD.quadraticCurveTo(-this.leafWidth, 0, 0, -this.leafHalfLength);
        ctxToaD.fill();
        
        // Vẽ chữ
        ctxToaD.rotate(Math.PI / 2);
        ctxToaD.fillStyle = "white";
        ctxToaD.font = "bold 18px 'Segoe UI', Arial";
        ctxToaD.textAlign = "center";
        ctxToaD.textBaseline = "middle";
        ctxToaD.fillText(this.word.toUpperCase(), 0, 0);
        ctxToaD.restore();
    }
}

function spawnLeaf() {
    if (!isGameActive) return;
    if (leavesToaD.length >= configToaD.maxLeavesAllowed) {
        showResultToaD("SÂN ĐÃ ĐẦY LÁ! Bạn đã không hoàn thành nhiệm vụ được giao.", false); 
        return;
    }
    leavesToaD.push(new Leaf());
}

window.addEventListener('keydown', (e) => {
    if (!isGameActive) return;

        // 1. CÁI LOA ĐỂ PHÁT TIẾNG
    const typeSoundToaD = new Audio('assets/sound/typing.mp3');
    typeSoundToaD.volume = 0.6; 

    // 2. BẮT SỰ KIỆN GÕ PHÍM (CHỐNG NHÂN BẢN 100%)
    if (!window.hasToaDKeyboardListener) {
        window.addEventListener('keydown', (e) => {
            // Nếu game chưa bắt đầu thì không làm gì cả
            if (!isGameActive) return;

            // Khắc tinh của việc nhấn đè phím
            if (e.repeat) return; 

            // --- PHÁT ÂM THANH KHI GÕ ---
            if (e.key === "Backspace" || (e.key.length === 1 && /[a-z]/i.test(e.key))) {
                typeSoundToaD.currentTime = 0; 
                typeSoundToaD.play().catch(err => {
                    console.log("Lỗi âm thanh: ", err);
                });
            }

            // --- LOGIC XỬ LÝ KHI NHẤP ENTER ---
            if (e.key === "Enter") {
                let foundIndex = leavesToaD.findIndex(l => l.word.toLowerCase() === currentInput.toLowerCase());
                
                if (foundIndex !== -1) {
                    let pts = (leavesToaD[foundIndex].type === "hard") ? 2 : 1;
                    scoreToaD = Math.min(100, scoreToaD + pts);
                    leavesToaD.splice(foundIndex, 1);
                    scoreElToaD.innerText = scoreToaD;
                    if (scoreToaD >= 100) showResultToaD("XUẤT SẮC! Đạt 100đ.", false);
                } else if (currentInput.length > 0) {
                    scoreToaD = Math.max(0, scoreToaD - 1);
                    scoreElToaD.innerText = scoreToaD;
                }
                currentInput = ""; 
                
            // --- LOGIC KHI XÓA CHỮ ---
            } else if (e.key === "Backspace") {
                currentInput = currentInput.slice(0, -1);
                
            // --- LOGIC KHI GÕ CHỮ A-Z ---
            } else if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
                currentInput += e.key;
            }
        });

        // Cắm biển báo: Đã gán sự kiện bắt phím thành công, cấm gán đè thêm!
        window.hasToaDKeyboardListener = true;
    }
});

function updateTimerToaD() {
    if (!isGameActive) return;
    timeLeftToaD--;
    let mins = Math.floor(timeLeftToaD / 60).toString().padStart(2, '0');
    let secs = (timeLeftToaD % 60).toString().padStart(2, '0');
    timerElToaD.innerText = `${mins}:${secs}`;
    if (timeLeftToaD <= 0) showResultToaD("CHIẾN THẮNG!", false);
}

function animateToaD() {
    if (!isGameActive) return; 
    
    ctxToaD.clearRect(0, 0, canvasToaD.width, canvasToaD.height);
    leavesToaD.forEach(leaf => { leaf.update(); leaf.draw(); });

    // Vẽ text input người dùng đang gõ
    ctxToaD.save();
    ctxToaD.fillStyle = "yellow";
    ctxToaD.font = "bold 32px Arial";
    ctxToaD.textAlign = "center";
    ctxToaD.fillText("> " + currentInput.toUpperCase() + " <", canvasToaD.width / 2, canvasToaD.height - 60);
    ctxToaD.restore();

    animationIdToaD = requestAnimationFrame(animateToaD);
}

function showResultToaD(message, isGameOver) {
    isGameActive = false; 
    cleanupToaD(); 
    
    let timePlayed = configToaD.gameDuration - timeLeftToaD;

    if (window.UITGameStats) {
        window.UITGameStats.addScore("Tòa D", scoreToaD);
    }
    
    if (typeof window.showGlobalSummaryBoard === 'function') {
        window.showGlobalSummaryBoard(
            "Tòa D", 
            scoreToaD, 
            timePlayed, 
            true, 
            transitionToToaC 
        );
    } else {
        // TRƯỜNG HỢP THẮNG: Lưu điểm và truyền hàm transitionToToaC để đi tiếp
        if (window.UITGameStats) {
            window.UITGameStats.addScore("Tòa D", scoreToaD);
        }
        
        if (typeof window.showGlobalSummaryBoard === 'function') {
            window.showGlobalSummaryBoard("Tòa D", scoreToaD, timePlayed, true, transitionToToaC);
        } else {
            transitionToToaC();
        }
    }
}

function cleanupToaD() {
    clearInterval(spawnIntervalToaD);
    clearInterval(gameIntervalToaD);
    if (animationIdToaD) {
        cancelAnimationFrame(animationIdToaD);
        animationIdToaD = null;
    }
    leavesToaD = [];
}

function initToaD() {
    cleanupToaD();
    
    // Đảm bảo các UI hiện hình
    const mainToaD = document.getElementById('toa-d');
    const uiToaD = document.getElementById('ui-toa-d');
    if (mainToaD) mainToaD.style.display = 'block';
    if (uiToaD) uiToaD.style.display = 'block';

    resizeCanvasToaD(); // Quan trọng: Đặt lại kích thước canvas trước khi vẽ
    isGameActive = true; 
    scoreToaD = 0;
    timeLeftToaD = configToaD.gameDuration;
    currentInput = "";
    scoreElToaD.innerText = "0";
    timerElToaD.innerText = "02:00"; 
    
    startScreenToaD.style.display = 'none';
    endScreenToaD.style.display = 'none';
    
    spawnIntervalToaD = setInterval(spawnLeaf, configToaD.spawnInterval);
    gameIntervalToaD = setInterval(updateTimerToaD, 1000);
    animateToaD();
}

// Gán sự kiện cho nút Start
const startBtn = document.getElementById('toa-d-start-btn');
if (startBtn) {
    startBtn.onclick = initToaD;
}

// Expose initToaD to global scope for callback usage
if (typeof window !== 'undefined') {
    window.initToaD = initToaD;
}
// HÀM RESET TÒA D KHI LOAD GAME
window.resetToaD = function() {
    isGameActive = false;
    cleanupToaD(); // Dọn sạch lá rụng dở dang
    currentInput = ""; // Xóa chữ gõ dở
    
    // Bật lại màn hình Start chờ người chơi
    const startScreenToaD = document.getElementById('start-screen-toa-d');
    const endScreenToaD = document.getElementById('end-screen-toa-d');
    if (startScreenToaD) startScreenToaD.style.display = 'block';
    if (endScreenToaD) endScreenToaD.style.display = 'none';
};