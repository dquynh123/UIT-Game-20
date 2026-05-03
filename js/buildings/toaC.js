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
        // Tắt Tòa C, mở màn hình VN
        toaCContainer.style.display = "none";
        toaCContainer.classList.remove("game-playing");

        const vnScreen = document.getElementById('vn-screen');
        if (vnScreen) vnScreen.style.display = 'block';

        let results = window.UITGameStats ? window.UITGameStats.stageResults : [];
        const totalTime = window.UITGameStats ? window.UITGameStats.getTimePlayedSeconds() : 0;
        const finalTotalScore = results.reduce((sum, item) => sum + item.score, 0);
        const playerName = localStorage.getItem('currentPlayerName') || "Sinh viên";

        // 1. CÁC KỊCH BẢN RẼ NHÁNH
        const storyNormalToaC = [
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
                text: "Giọng điệu này... cậu là người tự xưng là admin lúc nãy? Cho tôi thoát ra ngoài đi.", 
                bg: "", 
                sprite: "assets/images/test_main.png", 
                nextId: "c_03" 
            },

            { 
                id: "c_03", 
                name: "CTV BHTCNPM", 
                text: "Anh đã tìm lại được phần dữ liệu thanh xuân của mình rồi. Đến lúc phải tỉnh dậy để chạy deadline tiếp thôi, cựu sinh viên.", 
                bg: "", 
                sprite: "assets/images/chibi.png", 
                nextId: null 
            }
        ];

        const storyBadToaC = [
            { 
                id: "bad_01", 
                name: "", 
                text: "Âm thanh ồn ào náo nhiệt của sảnh Tòa C đột ngột tắt lịm đi. Không gian xung quanh dường như bị đóng băng, mọi sinh viên đứng im bất động.", 
                bg: "", 
                sprite: "", 
                nextId: "bad_02"
            },

            { 
                id: "bad_02", 
                name: "", 
                text: "Sảnh Tòa C bỗng trở nên rộng lớn và vắng lặng đến nghẹt thở. Dường như chỉ còn bạn và cậu CTV đối diện với nhau.",
                bg: "", 
                sprite: "", 
                nextId: "bad_03" 
            },

            { 
                id: "bad_03", 
                name: "", 
                text: "Cậu ta từ từ hạ poster xuống, đứng thẳng người. Nụ cười sự kiện tắt đi. Ánh mắt bỗng trở nên sâu thẳm, tĩnh lặng và lạnh lẽo — hệt như ánh mắt của Người Hướng Dẫn ở sảnh Tòa E.", 
                bg: "", 
                sprite: "assets/images/chibi.png", 
                nextId: "bad_04" 
            },

            { 
                id: "bad_04", 
                name: "CTV BHTCNPM", 
                text: "Dữ liệu không khớp. Anh đã quên hết những ký ức trước đây. Anh sẽ kẹt ở đây mãi mãi.", 
                bg: "", 
                sprite: "assets/images/test_guide.png", 
                nextId: "bad_05"
            },

            {
                id: "bad_05",
                name: "{PLAYER}",
                text: "Giọng điệu này... cậu là người tự xưng là admin lúc nãy? Đủ rồi, đừng có đùa. Tôi đã gom đủ 4 mảnh. Cho tôi thoát ra ngoài đi.",
                bg: "",
                sprite: "assets/images/test_main.png",
                nextId: "bad_06"
            },

            { 
                id: "bad_06", 
                name: "CTV BHTCNPM", 
                text: "Hahaha, đâu phải cứ có đủ 4 mảnh là được thả ra, haha..", 
                bg: "", 
                sprite: "assets/images/test_guide.png", 
                nextId: "bad_07"
            },

            {
                id: "bad_07",
                name: "{PLAYER}",
                text: "Cái gì",
                bg: "",
                sprite: "assets/images/test_main.png",
                nextId: null
            }
        ];

        // 2. XỬ LÝ LƯU ĐIỂM & BẢNG XẾP HẠNG
        const processEndingUI = async (isBadEnding) => {
            if (vnScreen) {
                vnScreen.style.display = 'none';
                vnScreen.classList.remove('light-glitch-effect'); 
            }

            try { await saveScore(playerName, finalTotalScore, totalTime, 1); } 
            catch (err) { console.error("Lỗi lưu điểm:", err); }

            try {
                const module = await import('../leaderboard.js');
                if (module && typeof module.showSummary === 'function') {
                    // Hiện bảng bình thường trước
                    module.showSummary(results, totalTime, finalTotalScore);

                    // Lời nguyền 1.5s
                    if (isBadEnding) {
                        setTimeout(() => {
                            //Âm thanh cho cái bxh của bad ending
                            try {
                                // Bạn đổi 'jumpscare.mp3' thành tên file âm thanh của bạn nhé
                                let cursedSound = new Audio('assets/sound/glitch_errorbxh.mp3'); 
                                cursedSound.volume = 1.0; // Âm lượng max
                                cursedSound.play();
                            } catch (e) {
                                console.log("Chưa tải được âm thanh hóa quỷ", e);
                            }
                            document.body.classList.add('cursed-mode');
                            const titles = document.querySelectorAll('.title, #summary-title');
                            titles.forEach(t => t.innerText = "⚠ LỖI: DỮ LIỆU BỊ GIAM GIỮ ⚠");

                            const btn = document.getElementById('btnShowLeaderboard') || document.getElementById('summary-action-btn');
                            if (btn) {
                                btn.innerText = "XÁC NHẬN KẸT LẠI (HOÀN THÀNH)";
                                const newBtn = btn.cloneNode(true);
                                btn.parentNode.replaceChild(newBtn, btn);
                                
                                newBtn.addEventListener('click', () => {
                                    document.getElementById('summaryScreen').classList.add('hidden');
                                    const globalOverlay = document.getElementById('global-summary-overlay');
                                    if(globalOverlay) globalOverlay.classList.add('hidden');
                                    document.body.classList.remove('cursed-mode');
                                    
                                    triggerBadEndingEffect();
                                });
                            }
                        }, 1500); 
                    }
                }
            } catch (e) { console.error(e); }
        };

        // 3. THỰC THI KIỂM TRA ĐIỂM
        if (typeof window.playVN === 'function') {
            if (finalTotalScore < 250) {
                if (vnScreen) vnScreen.classList.add('light-glitch-effect');
                window.playVN(storyBadToaC, "bad_01", () => processEndingUI(true));
            } else {
                window.playVN(storyNormalToaC, "c_01", () => processEndingUI(false));
            }
        }
    }; // <-- Đóng hàm proceedToNextPhase

    // 4. GỌI BẢNG TỔNG KẾT TÒA C ĐẦU TIÊN
    const isWin = (wrongCount < 5); 
    if (typeof window.showGlobalSummaryBoard === 'function') {
        window.showGlobalSummaryBoard("Tòa C", score, 0, isWin, proceedToNextPhase);
    } else {
        proceedToNextPhase();
    }
} // <-- Đóng hàm endGame

// ==============================================================
// HÀM HIỆU ỨNG BINARY CHẠY NGANG & GLITCH CẢNH 1 (CHỐT HẠ)
// ==============================================================
function triggerBadEndingEffect() {
    const errorScreen = document.getElementById('bad-ending-screen');
    const bgCodeLayer = document.getElementById('error-bg-code');
    const glitchLayer = document.getElementById('cyber-glitch-overlay'); 
    
    if (!errorScreen || !bgCodeLayer) return;

    // Hiển thị màn hình báo lỗi
    errorScreen.classList.remove('hidden');
    bgCodeLayer.innerHTML = ""; 

    try {
        let systemErrorSound = new Audio('assets/sound/glitch_badending.mp3'); // Sửa đường dẫn file ở đây
        systemErrorSound.volume = 0.8;
        systemErrorSound.play();
    } catch (e) {
        console.log("Chưa tải được âm thanh lỗi hệ thống", e);
    }

    // 1. TẠO BINARY CODE CHẠY NGANG
    const binBase = "01010011 01011001 01010011 01010100 01000101 01001101 00100000 01000101 01010010 01010010 01001111 01010010 "; 
    const longBin = binBase.repeat(40); // Độ dài chống cụt đuôi

    for (let i = 0; i < 40; i++) {
        const row = document.createElement('div');
        row.className = 'binary-row';
        row.innerText = longBin + longBin; 
        
        const speed = 3 + Math.random() * 3; // Tốc độ chạy random
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
        
        row.style.animation = `scrollBinary ${speed}s linear infinite ${direction}`;
        bgCodeLayer.appendChild(row);
    }

    // 2. TIMING FLOW: Chờ 1.5 giây thì gọi Glitch Cảnh 1 đè lên
    setTimeout(() => {
        if (glitchLayer) {
            glitchLayer.classList.add('active'); // Bật css gốc của cảnh 1
            glitchLayer.classList.add('active-max'); // Đẩy z-index lên thủng nóc
        }
        
        // Chờ thêm 1.5 giây giật lag màn hình rách thì sút về Menu
        setTimeout(() => {
            window.location.reload(); 
        }, 1500);

    }, 1500); 
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