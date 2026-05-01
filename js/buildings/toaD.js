// ==========================================
// 1. KỊCH BẢN VÀ HÀM CHUYỂN SANG TÒA C
// ==========================================
const storyToaC = [
    //story nối tiếp tòa d
    {
        id: "c_01",
        name: "Bí thư đoàn",
        text: "Wow anh siêu thế!",
        bg: "", 
        sprite: "assets/images/chibi.png",
        nextId: "c_02"
    },
    {
        id: "c_02",
        name: "{PLAYER}",
        text: "Ờm... chuyện nhỏ he he. Giờ anh đi đâu tiếp được?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "c_03"
    },

    {
        id: "c_03",
        name: "Bí thư đoàn",
        text: "Anh qua Tòa C đi, bên đó Ban học tập Công nghệ phần mềm đang tổ chức đố vui có thưởng nghe đồn vui lắm!",
        bg: "", 
        sprite: "assets/images/chibi.png",
        nextId: "c_04"
    },

    {
        id: "c_04",
        name: "CTV BHTCNPM",
        text: "Anh trai ơi! Vô test nhân phẩm 100 câu hỏi lịch sử UIT lấy quà không? Gian hàng vắng lặng quá!",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "c_05"
    },

    {
        id: "c_05",
        name: "{PLAYER}",
        text: "Chỗ em có phần thưởng nào là cái cục phát sáng không?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "c_06"
    },

    {
        id: "c_06",
        name: "CTV BHTCNPM",
        text: "Có luôn! Cúp mica gắn LED bao chói mắt! Nhưng mà không dễ đâu nha. Anh tự tin nhớ hết thông tin trường mình không? Cảnh báo nhỏ cho anh là mấy đáp án sẽ bị xáo trộn đó nên anh phải thật tinh mắt nhé.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "c_07"
    },

    {
        id: "c_07",
        name: "{PLAYER}",
        text: "Okay, triển luôn",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: null
    }
];

function transitionToToaC() {
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
}
/**
 * Tòa D - English Cleaning Game (Bản Fix Triệt Để)
 */

const canvasToaD = document.getElementById('gameCanvasToaD');
const ctxToaD = canvasToaD.getContext('2d');
const scoreElToaD = document.getElementById('score-toa-d');
const timerElToaD = document.getElementById('timer-toa-d');
const startScreenToaD = document.getElementById('start-screen-toa-d');
const endScreenToaD = document.getElementById('end-screen-toa-d');

const configToaD = {
    gameDuration: 60,
    spawnInterval: 1500, // Tăng tốc độ ra lá một chút cho kịch tính
    maxLeavesAllowed: 12, 
    wordsEasy: ["dog", "cat", "sun", "fish", "bird", "tree", "home", "book", "pink", "blue"],
    wordsHard: ["university", "technology", "information", "celebration", "computer", "vietnam"]
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
        showResultToaD("THUA CUỘC! Sân đã đầy lá.", true);
        return;
    }
    leavesToaD.push(new Leaf());
}

window.addEventListener('keydown', (e) => {
    if (!isGameActive) return;

    if (e.key === "Enter") {
        let foundIndex = leavesToaD.findIndex(l => l.word.toLowerCase() === currentInput.toLowerCase());
        if (foundIndex !== -1) {
            let pts = (leavesToaD[foundIndex].type === "hard") ? 5 : 2;
            scoreToaD = Math.min(100, scoreToaD + pts);
            leavesToaD.splice(foundIndex, 1);
            scoreElToaD.innerText = scoreToaD;
            if (scoreToaD >= 100) showResultToaD("XUẤT SẮC! Đạt 100đ.", false);
        } else if (currentInput.length > 0) {
            scoreToaD = Math.max(0, scoreToaD - 1);
            scoreElToaD.innerText = scoreToaD;
        }
        currentInput = "";
    } else if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
    } else if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        currentInput += e.key;
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
    // Tính thời gian đã chơi (60s trừ đi thời gian còn lại)
    let timePlayed = configToaD.gameDuration - timeLeftToaD;

    if (isGameOver) {
        // TRƯỜNG HỢP THUA: Báo lỗi và truyền hàm initToaD để chơi lại
        if (typeof window.showGlobalSummaryBoard === 'function') {
            window.showGlobalSummaryBoard("Tòa D", scoreToaD, timePlayed, false, initToaD);
        } else {
            initToaD();
        }
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
    
    /*const finalMsg = document.getElementById('final-msg-toa-d');
    const finalScore = document.getElementById('final-score-toa-d');
    const actionBtn = document.getElementById('to-toa-c-btn');
    const overlay = document.getElementById('fade-overlay');
    const uiToaD = document.getElementById('ui-toa-d'); 

    finalMsg.innerText = message;
    finalScore.innerText = scoreToaD;
    endScreenToaD.style.display = 'block';

    if (isGameOver) {
        actionBtn.innerText = "CHƠI LẠI";
        actionBtn.onclick = () => {
            initToaD(); // Gọi trực tiếp hàm init để reset game
        };
    } else {
        if (window.UITGameStats) {
            window.UITGameStats.addScore("Tòa D", scoreToaD);
        }
        actionBtn.innerText = "TIẾP TỤC";
        actionBtn.onclick = () => {
            actionBtn.disabled = true;

            // 1. Phủ đen
            if (overlay) {
                overlay.style.opacity = "1";
                overlay.style.pointerEvents = "all";
            }

            // 2. Dọn dẹp để tránh nháy ảnh mờ
            setTimeout(() => {
                ctxToaD.clearRect(0, 0, canvasToaD.width, canvasToaD.height);
                if (uiToaD) uiToaD.style.display = 'none';
                endScreenToaD.style.display = 'none';
                transitionToToaC();

                // 4. Mở mắt
                setTimeout(() => {
                    if (overlay) {
                        overlay.style.opacity = "0";
                        overlay.style.pointerEvents = "none";
                    }
                    actionBtn.disabled = false;
                }, 800); 
            }, 500); 
        };
    }*/
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
    timerElToaD.innerText = "01:00"; 
    
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