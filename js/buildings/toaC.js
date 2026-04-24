const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const timerBar = document.getElementById("timer-progress");
const overlay = document.getElementById("overlay-text");
const startMenu = document.getElementById("start-menu");
const endScreen = document.getElementById("end-screen");
const scoreValueEnd = document.querySelector(".score-value");
const startBtn = document.getElementById("start-btn");
const header = document.getElementById("header");
const toaCContainer = document.getElementById("toa-c");

let currentLevel = 0, score = 0, wrongCount = 0;
let gameState = "MENU", boxes = [], playingQuestions = [];
let gameInterval, animationId;
let player = { x: 0, y: 0, w: 150, h: 25 };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height - 70;
}
window.addEventListener("resize", resize);
resize();

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lines = [];
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    let startY = y - ((lines.length - 1) * lineHeight) / 2;
    for(let k = 0; k < lines.length; k++) {
        context.fillText(lines[k], x, startY + (k * lineHeight));
    }
}

// KHỞI TẠO GAME
startBtn.addEventListener("click", () => {
    score = 0; currentLevel = 0; wrongCount = 0;
    scoreEl.innerText = score;
    toaCContainer.classList.add("game-playing");
    startMenu.style.display = "none";
    endScreen.style.display = "none";
    header.style.display = "block";
    
    if (typeof uitQuizBank !== 'undefined') {
        playingQuestions = [...uitQuizBank].sort(() => Math.random() - 0.5).slice(0, 10);
        initLevel();
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }
});

function initLevel() {
    if (gameInterval) clearInterval(gameInterval);
    const data = playingQuestions[currentLevel];
    questionEl.innerText = `Câu ${currentLevel + 1}: ${data.q}`;
    let opts = [...data.options].sort(() => Math.random() - 0.5);
    boxes = [];
    gameState = "READING";

    opts.forEach((opt, i) => {
        boxes.push({
            text: opt,
            x: (canvas.width / (opts.length + 1)) * (i + 1) - 90,
            y: 220,
            w: 180, h: 90,
            targetX: (canvas.width / (opts.length + 1)) * (i + 1) - 90,
            speed: 3.5 + Math.random() * 2,
            isCorrect: opt === data.correct,
            hit: false // Biến khóa để fix lỗi 92/5
        });
    });

    let startTime = Date.now();
    gameInterval = setInterval(() => {
        if (["END", "SHOW_RESULT", "FALLING"].includes(gameState)) return;
        let elapsed = Date.now() - startTime;
        if (timerBar) timerBar.style.width = Math.max(0, 100 - (elapsed / 10000) * 100) + "%";

        if (elapsed >= 5000 && gameState === "READING") {
            gameState = "SHUFFLING";
            let xPos = boxes.map(b => b.x).sort(() => Math.random() - 0.5);
            boxes.forEach((b, i) => b.targetX = xPos[i]);
            showOverlay("XÁO TRỘN!", "#f1c40f");
        }
        if (elapsed >= 10000) {
            gameState = "FALLING";
            showOverlay("HỨNG!", "#2ecc71");
        }
    }, 50);
}

function handleWrong() {
    score = Math.max(0, score - 5);
    wrongCount++;
    scoreEl.innerText = score;
    showOverlay(`SAI RỒI! (${wrongCount}/5)`, "#e74c3c");
    toaCContainer.classList.add("shake");
    setTimeout(() => toaCContainer.classList.remove("shake"), 200);
    
    if (wrongCount >= 5) {
        // Nếu sai 5 câu thì dừng ngay lập tức
        backToMenu();
    }
}

function backToMenu() {
    if (gameInterval) clearInterval(gameInterval);
    if (animationId) cancelAnimationFrame(animationId);
    
    gameState = "MENU";
    header.style.display = "none";
    endScreen.style.display = "none";
    startMenu.style.display = "flex";
    toaCContainer.classList.remove("game-playing");
    
    // Reset các biến hiển thị
    score = 0;
    wrongCount = 0;
    scoreEl.innerText = "0";
    if (timerBar) timerBar.style.width = "100%";
    
    alert("Ký ức quá tải! Bạn đã sai 5 lần.");
}

function endGame() {
    gameState = "END";
    if (gameInterval) clearInterval(gameInterval);
    questionEl.innerText = "HOÀN THÀNH XUẤT SẮC!";
    if (timerBar) timerBar.style.width = "0%";
    endScreen.style.display = "flex";
    scoreValueEnd.innerText = score;
    boxes = [];
}

function update() {
    if (gameState === "SHUFFLING") boxes.forEach(b => b.x += (b.targetX - b.x) * 0.1);
    
    if (gameState === "FALLING") {
        boxes.forEach(b => {
            if (b.hit) return; // Nếu ô này đã tính va chạm rồi thì bỏ qua

            b.y += b.speed;
            
            // Va chạm với thanh player
            if (b.y + b.h > player.y && b.y < player.y + player.h && 
                b.x + b.w > player.x && b.x < player.x + player.w) {
                
                b.hit = true; // Khóa lại ngay lập tức

                if (b.isCorrect) { 
                    score += 10; 
                    showOverlay("+10", "#2ecc71"); 
                    scoreEl.innerText = score;
                    gameState = "SHOW_RESULT";
                    setTimeout(nextStep, 1500);
                } else { 
                    handleWrong();
                    if (wrongCount < 5) {
                        gameState = "SHOW_RESULT";
                        setTimeout(nextStep, 1500);
                    }
                }
            }
        });

        // Nếu tất cả các ô rơi mất tiêu mà chưa hứng được
        if (boxes.length > 0 && boxes.every(b => b.y > canvas.height && !b.hit)) {
            gameState = "SHOW_RESULT";
            handleWrong();
            if (wrongCount < 5) {
                setTimeout(nextStep, 1500);
            }
        }
    }
}

function nextStep() {
    currentLevel++; 
    if (currentLevel < playingQuestions.length) initLevel(); 
    else endGame();
}

function animate() {
    if (gameState === "MENU") return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState !== "END") {
        ctx.fillStyle = "#e94560";
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }

    boxes.forEach(b => {
        ctx.fillStyle = (gameState === "SHOW_RESULT") ? (b.isCorrect ? "#2ecc71" : "#e74c3c") : 
                        (["READING"].includes(gameState) ? "white" : "#16213e");
        ctx.fillRect(b.x, b.y, b.w, b.h);
        
        if (["READING", "SHOW_RESULT"].includes(gameState)) {
            ctx.fillStyle = "#1a1a2e";
            ctx.font = "bold 15px Arial";
            ctx.textAlign = "center";
            wrapText(ctx, b.text, b.x + b.w/2, b.y + b.h/2, b.w - 20, 18);
        } else {
            ctx.strokeStyle = "#00d2ff"; 
            ctx.strokeRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = "#00d2ff"; 
            ctx.font = "bold 35px Arial";
            ctx.fillText("?", b.x + b.w/2, b.y + b.h/2 + 10);
        }
    });

    update();
    animationId = requestAnimationFrame(animate);
}

function showOverlay(txt, color) {
    overlay.innerText = txt; 
    overlay.style.color = color; 
    overlay.style.opacity = 1;
    if (gameState !== "END") setTimeout(() => overlay.style.opacity = 0, 1000);
}

window.addEventListener("mousemove", (e) => {
    if (gameState !== "END" && gameState !== "MENU") {
        player.x = e.clientX - player.w/2;
    }
});