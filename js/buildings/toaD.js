/**
 * Tòa D - Typing Game Logic (Integrated Version)
 */

// Lấy các Element dựa trên ID mới trong file Index tổng
const canvasToaD = document.getElementById('gameCanvasToaD');
const ctxToaD = canvasToaD.getContext('2d');
const scoreElToaD = document.getElementById('score-toa-d');
const timerElToaD = document.getElementById('timer-toa-d');

const startScreenToaD = document.getElementById('start-screen-toa-d');
const startBtnToaD = document.getElementById('toa-d-start-btn');
const endScreenToaD = document.getElementById('end-screen-toa-d');
const finalScoreElToaD = document.getElementById('final-score-toa-d');
const finalMsgElToaD = document.getElementById('final-msg-toa-d');
const toToaCBtn = document.getElementById('to-toa-c-btn');

const configToaD = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    initialSpawnRate: 1000, 
    minSpawnRate: 300,      
    gameDuration: 60,
    alphabet: "abcdefghijklmnopqrstuvwxyz"
};

let scoreToaD = 0;
let timeLeftToaD = configToaD.gameDuration;
let leavesToaD = [];
let currentSpawnRateToaD = configToaD.initialSpawnRate;
let spawnTimeoutToaD;
let gameIntervalToaD;
let animationIdToaD;

canvasToaD.width = configToaD.canvasWidth;
canvasToaD.height = configToaD.canvasHeight;

class Leaf {
    constructor() {
        this.char = configToaD.alphabet[Math.floor(Math.random() * configToaD.alphabet.length)];
        // Chỉnh lại biên x để lá to không bị xuất hiện sát mép (60 -> 120)
        this.x = Math.random() * (canvasToaD.width - 120) + 60;
        this.y = -100; // Để lá bắt đầu rơi từ cao hơn do kích thước lớn
        
        let speedBonus = 0;
        if (scoreToaD > 10) {
            speedBonus = (scoreToaD - 10) * 0.2; 
        }
        
        this.speed = (Math.random() * 2 + 1) + speedBonus;
        this.color = this.speed > 5 ? "#d32f2f" : "#2e7d32"; 
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * 0.02) * 2;
    }

    draw() {
        ctxToaD.save();
        ctxToaD.translate(this.x, this.y);
        ctxToaD.rotate(Math.sin(this.y * 0.05));
        
        ctxToaD.fillStyle = this.color;
        ctxToaD.beginPath();
        
        // --- CHỈNH KÍCH THƯỚC ---
        ctxToaD.moveTo(0, -40); 
        ctxToaD.quadraticCurveTo(40, 0, 0, 50); 
        ctxToaD.quadraticCurveTo(-40, 0, 0, -40); 
        // ---------------------------------------
        
        ctxToaD.fill();
        
        ctxToaD.fillStyle = "white";
        // Tăng font chữ lên một chút (22px -> 30px) để cân đối với lá to
        ctxToaD.font = "bold 30px Arial"; 
        ctxToaD.textAlign = "center";
        ctxToaD.textBaseline = "middle";
        ctxToaD.fillText(this.char.toUpperCase(), 0, 0);
        ctxToaD.restore();
    }
}

function spawnLeaf() {
    leavesToaD.push(new Leaf());

    if (scoreToaD > 10) {
        currentSpawnRateToaD = Math.max(configToaD.minSpawnRate, configToaD.initialSpawnRate - ((scoreToaD - 10) * 50));
    } else {
        currentSpawnRateToaD = configToaD.initialSpawnRate;
    }
    
    spawnTimeoutToaD = setTimeout(spawnLeaf, currentSpawnRateToaD);
}

function updateTimerToaD() {
    timeLeftToaD--;
    const mins = Math.floor(timeLeftToaD / 60).toString().padStart(2, '0');
    const secs = (timeLeftToaD % 60).toString().padStart(2, '0');
    timerElToaD.innerText = `${mins}:${secs}`;
    
    if (timeLeftToaD <= 0) {
        showResultToaD("HẾT GIỜ! Thử thách đã kết thúc.");
    }
}

// HÀM QUAN TRỌNG: Dọn dẹp mọi thứ của Tòa D trước khi sang tòa khác
function cleanupToaD() {
    clearTimeout(spawnTimeoutToaD);
    clearInterval(gameIntervalToaD);
    cancelAnimationFrame(animationIdToaD);
    leavesToaD = [];
    ctxToaD.clearRect(0, 0, canvasToaD.width, canvasToaD.height);
}

function showResultToaD(message) {
    cleanupToaD(); // Gọi hàm dọn dẹp
    
    finalMsgElToaD.innerText = message;
    finalScoreElToaD.innerText = scoreToaD;
    endScreenToaD.style.display = 'block';

    toToaCBtn.onclick = () => { 
        endScreenToaD.style.display = 'none';
        if (typeof window.switchBuilding === 'function') {
            window.switchBuilding('toa-c'); 
        }
    };
}

function animateToaD() {
    ctxToaD.clearRect(0, 0, canvasToaD.width, canvasToaD.height);
    for (let i = leavesToaD.length - 1; i >= 0; i--) {
        leavesToaD[i].update();
        leavesToaD[i].draw();
        if (leavesToaD[i].y > canvasToaD.height + 50) {
            leavesToaD.splice(i, 1);
        }
    }
    animationIdToaD = requestAnimationFrame(animateToaD);
}

window.addEventListener('keydown', (e) => {
    // CHẶN: Chỉ xử lý nếu Tòa D đang hiển thị và bảng kết quả đang đóng
    const toaD = document.getElementById('toa-d');
    if (toaD.style.display === 'none' || endScreenToaD.style.display === 'block') return;

    const key = e.key.toLowerCase();
    let targetIndex = -1;
    let maxY = -1;

    for (let i = 0; i < leavesToaD.length; i++) {
        if (leavesToaD[i].char === key && leavesToaD[i].y > maxY) {
            maxY = leavesToaD[i].y;
            targetIndex = i;
        }
    }

    if (targetIndex !== -1) {
        leavesToaD.splice(targetIndex, 1);
        scoreToaD = Math.min(40, scoreToaD + 1); 
        scoreElToaD.innerText = scoreToaD;

        if (scoreToaD >= 40) {
            showResultToaD("CHÚC MỪNG! Bạn đã hoàn thành Tòa D.");
        }
    }
});

function initToaD() {
    cleanupToaD(); // Đảm bảo không có game nào đang chạy đè lên
    
    startScreenToaD.style.display = 'none';
    endScreenToaD.style.display = 'none'; // Ẩn màn hình kết thúc nếu chơi lại
    scoreToaD = 0;
    scoreElToaD.innerText = scoreToaD;
    timeLeftToaD = configToaD.gameDuration;
    timerElToaD.innerText = "01:00";
    
    spawnLeaf();
    gameIntervalToaD = setInterval(updateTimerToaD, 1000);
    animateToaD();
}

startBtnToaD.addEventListener('click', initToaD);

window.addEventListener('resize', () => {
    canvasToaD.width = window.innerWidth;
    canvasToaD.height = window.innerHeight;
});