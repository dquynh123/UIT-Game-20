const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const timerBar = document.getElementById("timer-progress");
const overlay = document.getElementById("overlay-text");
const header = document.getElementById("header");
const toaCContainer = document.getElementById("toa-c");

// Giữ nguyên các import cần thiết cho việc lưu điểm
import { saveScore } from '../firebase.js';

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

// KHỞI TẠO GAME - GIỮ NGUYÊN
function startToaCGame() {
    endGame.isLocked = false;
    score = 0; currentLevel = 0; wrongCount = 0;
    if(scoreEl) scoreEl.innerText = score;
    toaCContainer.classList.add("game-playing");
    header.style.display = "block";
    
    if (typeof uitQuizBank !== 'undefined') {
        playingQuestions = [...uitQuizBank].sort(() => Math.random() - 0.5).slice(0, 10);
        initLevel();
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }
}

// Cảm biến - GIỮ NGUYÊN
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
            if (toaCContainer.style.display === 'block' && gameState === "MENU") {
                startToaCGame();
            }
        }
    });
});
if (toaCContainer) observer.observe(toaCContainer, { attributes: true });

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
            hit: false 
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
    if (gameState === "END") return;
    score = Math.max(0, score - 5);
    wrongCount++;
    scoreEl.innerText = score;
    showOverlay(`SAI RỒI! (${wrongCount}/5)`, "#e74c3c");
    toaCContainer.classList.add("shake");
    setTimeout(() => toaCContainer.classList.remove("shake"), 200);
    if (wrongCount >= 5) {
        gameState = "END"; 
        if (gameInterval) clearInterval(gameInterval);
        setTimeout(() => {
            endGame(); 
        }, 1500);
    }
}

// HÀM ENDGAME - ĐÃ ĐƯỢC CHỈNH SỬA LỖI CHUYỂN MÀN HÌNH
function endGame() {
    if (endGame.isLocked) return; 
    endGame.isLocked = true;

    gameState = "END";
    if (gameInterval) clearInterval(gameInterval);
    if (animationId) cancelAnimationFrame(animationId);
    boxes = []; 
    
    if (window.UITGameStats) {
        window.UITGameStats.addScore("Tòa C", score);
    }
    const proceedToNextPhase = () => {
        // Lúc này mới tắt Tòa C đi để lộ màn hình thoại VN
        toaCContainer.style.display = "none";
        toaCContainer.classList.remove("game-playing");
        
        const storySauToaC = [
            {
                id: "c_01",
                name: "CTV BHTCNPM",
                text: "Dữ liệu đã khớp. Anh nhớ rất kỹ nơi này... dù đã rời đi từ lâu.",
                bg: "",
                sprite: "assets/images/chibi.png",
                nextId: "c_02"
            },

            {
                id: "c_02",
                name: "{PLAYER}",
                text: "Giọng điệu này... cậu là người tự xưng là admin lúc nãy? Thôi được rồi, trò chơi kết thúc. Tôi đã gom đủ 4 mảnh. Cho tôi thoát ra ngoài đi.",
                bg: "",
                sprite: "assets/images/test_main.png",
                nextId: "c_03"
            },

            {
                id: "c_03",
                name: "CTV BHTCNPM",
                text: "Anh cứ tưởng hệ thống bắt anh đi gom ký ức sao? Không đâu... Là tự tâm trí anh đang nhớ lại những gì nó không muốn quên đi thôi",
                bg: "",
                sprite: "assets/images/chibi.png",
                nextId: "c_04"
            },

            {
                id: "c_04",
                name: "CTV BHTCNPM",
                text: "Anh đã tìm lại được phần dữ liệu thanh xuân của mình rồi. Đến lúc phải tỉnh dậy để chạy deadline tiếp thôi, cựu sinh viên.",
                bg: "",
                sprite: "assets/images/chibi.png",
                nextId: null
            }

        ];

        // Hàm callback sau khi đọc xong hội thoại sẽ lưu điểm và hiện Bảng Xếp Hạng Cuối Cùng
        const showLeaderboardAfterDialogue = async () => {
            const vnScreen = document.getElementById('vn-screen');
            if (vnScreen) vnScreen.style.display = 'none';

            let results = window.UITGameStats ? window.UITGameStats.stageResults : [];
            const totalTime = window.UITGameStats ? window.UITGameStats.getTimePlayedSeconds() : 0;
            const finalTotalScore = results.reduce((sum, item) => sum + item.score, 0);
            const playerName = localStorage.getItem('currentPlayerName') || "Sinh viên";

            // Thử lưu điểm vào Firebase
            try {
                await saveScore(playerName, finalTotalScore, totalTime, 1);
            } catch (err) {
                console.error("Lỗi khi lưu điểm vào Firebase:", err);
            }

            // LUÔN LUÔN gọi chuyển màn hình Summary Cuối Game của team bạn
            try {
                const module = await import('../leaderboard.js');
                if (module && typeof module.showSummary === 'function') {
                    module.showSummary(results, totalTime, finalTotalScore);
                } else {
                    console.error("Không tìm thấy hàm showSummary trong file leaderboard.js");
                }
            } catch (importErr) {
                console.error("Lỗi khi import file leaderboard.js:", importErr);
            }
        };

        // Bắt đầu chạy hội thoại kết thúc
        if (typeof window.playVN === 'function') {
            window.playVN(storySauToaC, "c_end_01", showLeaderboardAfterDialogue);
        } else {
            showLeaderboardAfterDialogue();
        }
    };

    // 3. HIỆN BẢNG TỔNG KẾT TÒA C
    // Xác định Thắng/Thua: Bị phạt dưới 5 lần = Thắng, từ 5 lần trở lên = Thua
    const isWin = (wrongCount < 5); 
    
    if (typeof window.showGlobalSummaryBoard === 'function') {
        // Truyền hàm proceedToNextPhase vào để nó chạy khi bấm nút
        window.showGlobalSummaryBoard("Tòa C", score, 0, isWin, proceedToNextPhase);
    } else {
        proceedToNextPhase(); // Backup lỡ JS không load kịp
    }
}

function update() {
    if (gameState === "SHUFFLING") boxes.forEach(b => b.x += (b.targetX - b.x) * 0.1);
    
    if (gameState === "FALLING") {
        boxes.forEach(b => {
            if (gameState !== "FALLING" || b.hit) return; 

            b.y += b.speed;
            
            if (b.y + b.h > player.y && b.y < player.y + player.h && 
                b.x + b.w > player.x && b.x < player.x + player.w) {
                
                b.hit = true; 
                gameState = "SHOW_RESULT";

                if (b.isCorrect) { 
                    score += 10; 
                    showOverlay("+10", "#2ecc71"); 
                    scoreEl.innerText = score;
                    setTimeout(nextStep, 1500);
                } else { 
                    handleWrong();
                    if(wrongCount < 5){
                        setTimeout(nextStep, 1500);
                    }
                }
            }
        });

        if (gameState === "FALLING" && boxes.length > 0 && boxes.every(b => b.y > canvas.height && !b.hit)) {
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