document.addEventListener('DOMContentLoaded', () => {
    // Lấy cái vỏ rỗng từ index.html
    const container = document.getElementById('toa-e');
    if (!container) return;
// 1. TỰ ĐỘNG BƠM GIAO DIỆN VÀO KHUNG (Bố cục Trái - Phải mới)
container.innerHTML = `
        <div class="game-wrapper-e">
            <div class="left-column">
                <div id="visual-board" class="visual-board">
                    <img id="chibi-player" src="assets/images/chibi.png" class="chibi" alt="chibi">
                    <div id="grid-overlay" style="display: contents;"></div>
                </div>
            </div>

            <div class="right-column">
                
                <div class="glass-panel">
                    
                    <h2 id="floor-display" class="floor-title">Tầng 1: Sảnh chính tòa E</h2>
                    
                    <div class="stats-panel">
                        <div class="stat-box">ĐRL: <span id="drl-display-e" class="highlight">200</span></div>
                        <div class="stat-box">Lượt: <span id="turn-display-e">0/25</span></div>
                        <div class="stat-box">Vị trí: <span id="pos-display-e" class="highlight">1</span></div>
                    </div>

                    <div class="dice-controls">
                        <p style="text-align: center; font-weight: bold; margin-bottom: 5px;">Chọn loại xúc xắc:</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button class="btn-dice" data-type="4" data-cost="3">🎲 D4 (-3)</button>
                            <button class="btn-dice" data-type="6" data-cost="5">🎲 D6 (-5)</button>
                            <button class="btn-dice" data-type="20" data-cost="25">🎲 D20 (-25)</button>
                        </div>
                    </div>

                    <div class="dice-visualizer">
                        <div id="dice-face" class="dice-face">🎲</div>
                    </div>

                    <div id="action-log" class="action-log">Nhật ký: Sẵn sàng!</div>
                
                </div> 
                </div>
        </div>
    `;

    // 2. KHỞI TẠO TRẠNG THÁI GAME
    let state = {
        pos: 1,
        drl: 200,
        turns: 0,
        maxTurns: 25,
        isGameOver: false,
        isRolling: false,
        isNight: false,
        dayNightCycle: 0
    };

    // 3. CẤU TRÚC DỮ LIỆU ĐIỀU HƯỚNG (Hash Map)
    // Key là ô hiện tại, Value là ô sẽ nhảy tới (Thang máy lên hoặc xuống)
    const portals = {
        4: 14, 9: 31, 40: 41, 67: 76, 87: 91, // Thang máy (Lên)
        17: 7, 45: 1, 53: 48, 64: 19, 74: 34, 105: 77, 119: 62 // Thang máy (Xuống)
    };

    // 4. LOGIC XÁC ĐỊNH TẦNG THEO VỊ TRÍ
    function getFloorName(pos) {
        if (pos <= 5) return "Tầng 1: Sảnh chính tòa E";
        if (pos <= 7) return "Tầng 1: Phòng họp";
        if (pos <= 8) return "Tầng 1: Phòng Không gian Anh Ngữ";
        if (pos <= 10) return "Tầng 1: Trung tâm Ngoại ngữ";
        if (pos <= 15) return "Tầng 2: Văn phòng các chương trình đặc biệt";
        if (pos <= 17) return "Tầng 2: Ban Quản lý cơ sở";
        if (pos <= 20) return "Tầng 2: Các phòng học"; // Qua nửa tầng 2
        if (pos <= 40) return `Tầng ${Math.ceil(pos/10)}: Các phòng học`;
        if (pos <= 45) return "Tầng 5: Khoa Khoa học máy tính";
        if (pos <= 50) return "Tầng 5: MMLab UIT";
        if (pos <= 60) return "Tầng 6: Khoa Kỹ thuật máy tính";
        if (pos <= 70) return "Tầng 7: Khoa Công nghệ phần mềm";
        if (pos <= 80) return "Tầng 8: Khoa Mạng máy tính và truyền thông";
        if (pos <= 85) return "Tầng 8: Phòng Thí nghiệm An toàn Thông tin";
        if (pos <= 90) return "Tầng 9: Khoa Hệ thống thông tin";
        if (pos <= 95) return "Tầng 9: Phòng Thí nghiệm Hệ thống thông tin";
        if (pos <= 100) return "Tầng 10: Khoa Khoa học và Kỹ thuật thông tin";
        if (pos <= 110) return "Tầng 11: Khu vực doanh nghiệp nghiên cứu";
        if (pos <= 119) return "Tầng 12: Phòng quay phim";
        return "Tầng 12: Hội trường tòa E";
    }

    // Kết nối DOM
    const displayDrl = document.getElementById('drl-display-e');
    const displayTurn = document.getElementById('turn-display-e');
    const displayPos = document.getElementById('pos-display-e');
    const displayFloor = document.getElementById('floor-display');
    const logArea = document.getElementById('action-log');
    const diceButtons = document.querySelectorAll('.btn-dice');
    const visualBoard = document.getElementById('visual-board');

    // HÀM TOGGLE CHU KỲ NGÀY/ĐÊM
    function toggleDayNightCycle() {
        const cycleNum = state.dayNightCycle;
        const timeOfDay = state.isNight ? 'ỐI! CHUYỆN GÌ ĐÃ XẢY RA?' : 'SÁNG LẠI RỒI!';
        const message = state.isNight ? '"Hệ thống đã cúp điện toàn bộ đèn tòa E!"' : '"Cảm ơn phòng kỹ thuật đã bật lại đèn cho tòa E!"';
        const prompt = '<br><strong style="color: #00529C; font-size: 16px;">👉 Hãy chọn xúc xắc để tiếp tục!</strong>';
        
        if (visualBoard) {
            if (state.isNight) {
                visualBoard.classList.add('night-mode');
                let powerOnSound = new Audio('assets/sound/switch.ogg');
                powerOnSound.volume = 0.8;
                powerOnSound.play().catch(e => console.log("Lỗi âm thanh bật đèn: ", e));
            } else {
                visualBoard.classList.remove('night-mode');
                // 💡 CHÈN ÂM THANH BẬT ĐÈN VÀO ĐÂY:
                let powerOnSound = new Audio('assets/sound/switch.ogg');
                powerOnSound.volume = 0.8;
                powerOnSound.play().catch(e => console.log("Lỗi âm thanh bật đèn: ", e));
            }
        }
        
        logArea.innerHTML = `<strong style="color: #120736; font-size: 18px;">${timeOfDay}</strong><br><em style="color: #323232;">${message}</em>${prompt}`;
    }

    // 5. LOGIC CHÍNH XỬ LÝ LƯỢT ĐI
function rollDice(diceType, cost) {
        if (state.isGameOver || state.isRolling) return;

        // 1. KIỂM TRA ĐIỀU KIỆN
        if (state.drl < cost) {
            if (state.drl < 3) {
                endGame("Bạn đã hết sạch ĐRL và không thể mua bất kỳ xúc xắc nào nữa!");
            } else {
                logArea.innerHTML = `<span style="color: orange;"> Bạn không đủ ĐRL cho D${diceType} (cần ${cost}). Hãy chọn loại rẻ hơn!</span>`;
            }
            return; 
        }

        // 2. KHỞI ĐỘNG XÚC XẮC
        state.drl -= cost;
        state.turns += 1;
        // THÊM CODE PHÁT ÂM THANH XÚC XẮC VÀO ĐÂY
        let diceSound = new Audio('assets/sound/dice.mp3');
        diceSound.play().catch(e => console.log("Lỗi âm thanh: ", e));
        // Kiểm tra nếu đạt 10 lượt để kích hoạt chu kỳ ngày/đêm
        const isNightCycleTriggered = state.turns % 10 === 0;
        if (isNightCycleTriggered) {
            state.isNight = !state.isNight;
            state.dayNightCycle = Math.floor(state.turns / 10);
        }
        
        state.isRolling = true; 
        diceButtons.forEach(btn => btn.style.opacity = '0.5'); 
        updateUI(); 

        const diceFace = document.getElementById('dice-face');
        if (diceFace) diceFace.classList.add('rolling');
        
        // Always show rolling message immediately
        logArea.innerHTML = `<em>Đang xóc D${diceType}... Cầu trời khấn phật...</em>`;

        const rollDelay = 1000;

        let rollInterval;
        setTimeout(() => {
            rollInterval = setInterval(() => {
                let tempNum = Math.floor(Math.random() * diceType) + 1;
                if (diceFace) diceFace.innerHTML = `${tempNum}`;
            }, 50);
        }, 0);

        // 3. XỬ LÝ DI CHUYỂN BẰNG ASYNC/AWAIT
        // Thêm chữ "async" trước function để dùng được lệnh chờ "await"
        setTimeout(async () => {
            clearInterval(rollInterval); 
            if (diceFace) diceFace.classList.remove('rolling'); 
            
            const rollResult = Math.floor(Math.random() * diceType) + 1;
            if (diceFace) {
                diceFace.innerHTML = `${rollResult}`; 
                diceFace.style.color = "#FF7F00";
            }

            let targetPos = state.pos + rollResult;
            if (targetPos > 120) targetPos = 120; // Giới hạn mốc 120

            // ----------------------------------------------------
            // KỊCH BẢN 1: ĐI BỘ TỪNG Ô MỘT
            // ----------------------------------------------------
            logArea.innerHTML = `Đổ ra <strong>${rollResult}</strong>. Đang di chuyển...`;
            for (let current = state.pos + 1; current <= targetPos; current++) {
                state.pos = current;
                updateUI(); // Vừa cập nhật số ở bảng điều khiển, vừa ép Chibi nhích đi
                await new Promise(resolve => setTimeout(resolve, 300)); // Đợi 0.3s cho mỗi bước
            }

            let logMsg = `Đổ D${diceType} ra <strong>${rollResult}</strong>. Đi đến ô ${state.pos}.`;

            if (state.pos === 120) {
                logArea.innerHTML = logMsg;
                endGame("CHÚC MỪNG! Bạn đã vào được Hội trường tòa E để tham dự seminar!");
                
                
                return;
            }

            // ----------------------------------------------------
            // KỊCH BẢN 2: KIỂM TRA ĐẠP TRÚNG PORTAL (Thang máy / Cầu thang)
            // ----------------------------------------------------
            if (portals[state.pos]) {
                const newPos = portals[state.pos];
                const chibi = document.getElementById('chibi-player');

                if (newPos > state.pos) {
                    // PHẦN A: THANG MÁY (Tàng hình rồi dịch chuyển)
                    logMsg += `<br>Tinh! Cửa thang máy đi lên mở ra, bạn thong thả đi đến ô ${newPos}!`;
                    logArea.innerHTML = logMsg; 
                    
                    if (chibi) chibi.style.opacity = '0'; // Tàng hình
                    await new Promise(resolve => setTimeout(resolve, 400)); // Đợi Chibi mờ hẳn đi

                    // Tắt hiệu ứng trượt mượt để dịch chuyển tức thời
                    if (chibi) chibi.style.transition = 'none'; 
                    state.pos = newPos;
                    updateUI(); // Cắm Chibi xuống tọa độ mới lúc đang tàng hình

                    // Bật lại hiệu ứng và cho xuất hiện
                    await new Promise(resolve => setTimeout(resolve, 50)); // Chờ code load
                    if (chibi) chibi.style.transition = 'left 0.3s linear, bottom 0.3s linear, opacity 0.4s ease';
                    if (chibi) chibi.style.opacity = '1'; // Hiện hình
                    await new Promise(resolve => setTimeout(resolve, 400)); // Đợi Chibi rõ nét hẳn

                } else {
                    // PHẦN B: CẦU THANG (Trượt thẳng đường chim bay)
                    logMsg += `<br>Tinh? Bạn bị hệ thống lôi vào thang máy và phải xuống ô ${newPos}!`;
                    logArea.innerHTML = logMsg;

                    if (chibi) chibi.style.opacity = '0'; // Tàng hình
                    await new Promise(resolve => setTimeout(resolve, 400)); // Đợi Chibi mờ hẳn đi

                    // Tắt hiệu ứng trượt mượt để dịch chuyển tức thời
                    if (chibi) chibi.style.transition = 'none'; 
                    state.pos = newPos;
                    updateUI(); // Cắm Chibi xuống tọa độ mới lúc đang tàng hình

                    // Bật lại hiệu ứng và cho xuất hiện
                    await new Promise(resolve => setTimeout(resolve, 50)); // Chờ code load
                    if (chibi) chibi.style.transition = 'left 0.3s linear, bottom 0.3s linear, opacity 0.4s ease';
                    if (chibi) chibi.style.opacity = '1'; // Hiện hình
                    await new Promise(resolve => setTimeout(resolve, 400)); // Đợi Chibi rõ nét hẳn
                }
            } else {
                logArea.innerHTML = logMsg; // Nếu ô thường thì in log bình thường
            }

            // Show day/night cycle message if triggered
            if (isNightCycleTriggered) {
                await new Promise(resolve => setTimeout(resolve, 800));
                toggleDayNightCycle();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before allowing next roll
            }

            // 4. KẾT THÚC LƯỢT VÀ MỞ KHÓA NÚT
            state.isRolling = false;
            diceButtons.forEach(btn => btn.style.opacity = '1');
            updateUI(); 

            if (state.turns >= state.maxTurns) {
                endGame("Hết 25 lượt đi. Kết thúc vòng chạy!");
            } else if (state.drl < 3) {
                endGame("Số ĐRL còn lại không đủ để thực hiện thêm lượt đi nào.");
            }

        }, rollDelay); 
    }

function updateUI() {
        displayDrl.innerText = state.drl;
        displayTurn.innerText = `${state.turns}/${state.maxTurns}`;
        displayPos.innerText = state.pos;
        displayFloor.innerText = getFloorName(state.pos);

        // -- LOGIC DI CHUYỂN CHIBI NẰM Ở ĐÂY --
        const chibi = document.getElementById('chibi-player');
        if (chibi) {
            // Giả sử bản đồ có 10 cột, 12 hàng. Ô số 1 ở góc DƯỚI CÙNG BÊN TRÁI.
            // Tính toán vị trí cột (X) và hàng (Y) hiện tại
            let currentCell = state.pos - 1; // Trừ 1 để dễ tính toán mảng bắt đầu từ 0
            
            let col = currentCell % 10;      // Lấy phần dư để ra số thứ tự cột (0 đến 9)
            let row = Math.floor(currentCell / 10); // Lấy phần nguyên để ra số thứ tự hàng (0 đến 11)

            // Lưu ý quy luật Zig-zag của trò Rắn & Thang:
            // Hàng chẵn (0, 2, 4...) đi từ trái qua phải.
            // Hàng lẻ (1, 3, 5...) đi ngược từ phải qua trái.
            if (row % 2 !== 0) {
                col = 9 - col; // Đảo ngược hướng đi
            }

            // Quy đổi ra phần trăm (%) để áp dụng vào CSS (Mỗi ô chiếm 10% chiều ngang, ~8.33% chiều dọc)
            let leftPercentage = col * 10; 
            let bottomPercentage = row * (100 / 12); 

            // CỘNG THÊM OFFSET ĐỂ CĂN GIỮA
            // 1.5 là bù trừ chiều ngang, 1.25 là bù trừ chiều dọc
            chibi.style.left = `${leftPercentage + 1.5}%`;
            chibi.style.bottom = `${bottomPercentage + 1.25}%`;
        }
    }

    function endGame(reason) {
        state.isGameOver = true;
        let finalScore = state.pos; 
        
        if (state.pos === 120) {
            finalScore = 120 + state.drl; // Về đích
        }

        logArea.innerHTML = `<strong style="color:red;">${reason}</strong><br>Tổng điểm của bạn: <strong>${finalScore}</strong>`;
        
        // Disable các nút xúc xắc
        diceButtons.forEach(btn => btn.disabled = true);
        if (window.UITGameStats) {
            window.UITGameStats.addScore("Tòa E", finalScore);
        }
        // GỌI BẢNG TỔNG KẾT DÙNG CHUNG
        setTimeout(() => {
            // Xác định thắng/thua dựa trên vị trí. (VD: Nếu đến đích 120 là thắng, ngược lại là thua)
            const isWin = (state.pos === 120); 
            // Tạm thời để thời gian là 0 nếu Tòa E không đếm ngược thời gian
            const timePlayed = 0; 
            
            if (typeof window.showGlobalSummaryBoard === 'function') {
                window.showGlobalSummaryBoard("Tòa E", finalScore, timePlayed, isWin, transitionToToaA);
            } else {
                 // Backup phòng hờ lỡ file main.js bị lỗi chưa load kịp
                transitionToToaA();
            }
        }, 1500); // 1.5 giây chờ để đọc log trước khi hiện bảng
    }

    // Gắn sự kiện cho các nút xúc xắc
    diceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = parseInt(btn.getAttribute('data-type'));
            const cost = parseInt(btn.getAttribute('data-cost'));
            rollDice(type, cost);
        });
    });

    // -- HÀM TẠO LƯỚI BẢN ĐỒ (DEBUG GRID) --
    // Giúp Artist vẽ map dễ dàng và kiểm tra đường đi
    function drawGrid() {
        const gridOverlay = document.getElementById('grid-overlay');
        // Vòng lặp vẽ từ trên xuống dưới (Hàng 12 xuống Hàng 1) vì HTML render từ trên xuống
        for (let row = 11; row >= 0; row--) {
            for (let col = 0; col <= 9; col++) {
                let cellDiv = document.createElement('div');
                cellDiv.className = 'debug-cell';
                
                // Tính ngược lại con số của ô đó để in ra màn hình
                let cellNumber;
                if (row % 2 === 0) { // Hàng chẵn (đi từ trái qua phải)
                    cellNumber = row * 10 + col + 1;
                } else { // Hàng lẻ (đi từ phải qua trái)
                    cellNumber = row * 10 + (9 - col) + 1;
                }
                
                cellDiv.innerText = cellNumber;
                gridOverlay.appendChild(cellDiv);
            }
        }
    }
    
    // Chạy hàm vẽ lưới
    drawGrid();

    // --- HỆ THỐNG IDLE ANIMATION (HÀNH ĐỘNG NGẪU NHIÊN KHI ĐỨNG YÊN) ---
    
    // Danh sách các "tuyệt chiêu" đã định nghĩa bên CSS
    const idleClasses = ['idle-spin', 'idle-jump', 'idle-nod', 'idle-flatten', 'idle-flip', 'idle-panic'];
    
    // Cứ mỗi 3 giây (3000ms), đạo diễn sẽ xem xét cho diễn 1 lần
    setInterval(() => {
        const chibi = document.getElementById('chibi-player');
        
        // NGUYÊN TẮC 1: Đang đổ xúc xắc, đang chạy, hoặc game over thì KHÔNG DIỄN
        if (state.isGameOver || state.isRolling || !chibi) return;

        // NGUYÊN TẮC 2: Tỉ lệ 50% là đứng im cho tự nhiên, 50% mới làm hành động
        // (Để tránh việc bé Chibi bị tăng động, múa may liên tục)
        if (Math.random() > 0.5) return; 

        // Bốc thăm ngẫu nhiên 1 trong 3 hành động
        const randomAction = idleClasses[Math.floor(Math.random() * idleClasses.length)];

        // Hô "Action!": Gắn class vào để Chibi diễn
        chibi.classList.add(randomAction);

        // Hô "Cắt!": Xóa class đi sau khi diễn xong (0.8 giây) để lần sau diễn tiếp được
        setTimeout(() => {
            if (chibi) chibi.classList.remove(randomAction);
        }, 800);

    }, 3000);

    updateUI();


});
// KỊCH BẢN CHUYỂN TỪ TÒA E SANG HỘI THOẠI TÒA A
const storyToaA = [
    {
        id: "ht_00",
        name: "{PLAYER}",
        text: "Ra đây là mảnh ký ức. Nhìn nó cứ như viên kẹo ngậm hồi bé, thèm quá... à không, chắc mình không nên thử.",
        bg: "",
        voice: "assets/voice/toaE/1_sautoaE.ogg",
        sprite: "assets/images/test_main.png",
        noSkip: true,
        nextId: "ht_01"
    },
    {
        id: "ht_01",
        name: "{PLAYER}",
        text: "Chìa khóa Tòa A? Vậy giờ phải đi qua thư viện tòa A thôi nhỉ?",
        bg: "",
        voice: "assets/voice/toaE/2_sautoaE.ogg",
        sprite: "assets/images/test_main.png",
        noSkip: true,
        nextId: "a_00" 
    },
    {
        // CÂU 0: CẢNH INTRO ẢO (Không có người nói, chỉ có tiếng máy móc)
        id: "a_00",
        name: "",
        text: "{PLAYER} bước qua cánh cửa kính của thư viện Tòa A. Băng chuyền công nghiệp khổng lồ chạy rầm rầm, sách rơi như nước lũ.",
        bg: "",
        sfx: "assets/sound/conveyor.ogg", 
        sfxLoop: true,          // Bật lặp lại liên tục
        sfxVolume: 0.8,         // Bắt đầu ồn ào ở mức 80% (0.8)
        sfxFadeTo: 0.2,
        sfxLoop: true,
        sprite: "",
        nextId: "ht_02" 
    },
    {
        id: "ht_02",
        name: "{PLAYER}",
        text: "Cái quái gì thế này? Hồi xưa thư viện tòa A yên tĩnh lắm mà ?",
        bg: "",
        sprite: "assets/images/test_main.png",
        voice: "assets/voice/toaA/1_toaA.ogg",
        noSkip: true,
        nextId: "ht_03" 
    },
    {
        id: "ht_03",
        name: "CTV CNPM",
        text: "Anh ơi, anh ơi! Rảnh không anh, qua cứu em với! Tự nhiên hôm nay thư viện nhập sách nhiều quá em xếp không kịp, sắp bị đè bẹp tới nơi rồi!",
        bg: "",
        voice: "assets/voice/toaA/2_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_04" 
    },
    {
        id: "ht_04",
        name: "{PLAYER}",
        text: "Từ từ đã nhóc. Thư viện gì mà chơi nguyên cái băng chuyền công nghiệp thế này? Giải thích cho anh với.",
        bg: "",
        voice: "assets/voice/toaA/3_toaA.ogg",
        sprite: "assets/images/test_main.png",
        nextId: "ht_05" 
    },
    {
        id: "ht_05",
        name: "CTV CNPM",
        text: "Dạ chuyện là em đăng ký làm cộng tác viên thư viện. Sáng nay trường về lô sách mới, sách cần xếp lên kệ nhiều như núi ý!",
        bg: "",
        voice: "assets/voice/toaA/4_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_06" 
    },

    {
        id: "ht_06",
        name: "{PLAYER}",
        text: "Àaaaaaaa. Mà nãy giờ em có thấy cái gì phát sáng rớt quanh đây không?",
        bg: "",
        voice: "assets/voice/toaA/5_toaA.ogg",
        sprite: "assets/images/test_main.png",
        nextId: "ht_07"
    },

    {
        id: "ht_07",
        name: "CTV CNPM",
        text: "Dạ? Em nãy giờ chỉ thấy toàn là sách thôi. Mà hình như thỉnh thoảng em cũng thấy mấy đốm sáng bay bay. Chắc tại phân loại sách nhiều quá mờ cả mắt rồi.",
        bg: "",
        voice: "assets/voice/toaA/6_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_08"
    },

    {
        id: "ht_08",
        name: "Người hướng dẫn",
        text: "Cậu sinh viên kia mắt không có vấn đề đâu. Cũng chẳng có băng chuyền nào ở đây cả. Thư viện hoàn toàn bình thường.",
        bg: "",
        voice: "assets/voice/toaA/7_toaA.ogg",
        sprite: "",
        nextId: "ht_09"
    },
    {
        id: "ht_09",
        name: "{PLAYER}",
        text: "Thế cái đống máy móc đang chạy rầm rầm này là do tôi tự tưởng tượng ra hả?",
        bg: "",
        voice: "assets/voice/toaA/8_toaA.ogg",
        sprite: "assets/images/test_main.png",
        nextId: "ht_10"
    },
    {
        id: "ht_10",
        name: "Người hướng dẫn",
        text: "Đúng rồi đấy. Không gian này đang phản chiếu tâm lý của anh.",
        bg: "",
        voice: "assets/voice/toaA/9.1_toaA.ogg",
        sprite: "",
        nextId: "ht_11"
    },
    {
        id: "ht_11",
        name: "Người hướng dẫn",
        text: "Mấy năm nay đi làm, anh lúc nào cũng thấy công việc chạy liên tục như một dây chuyền không có điểm dừng.",
        bg: "",
        voice: "assets/voice/toaA/9.2_toaA.ogg",
        sprite: "",
        nextId: "ht_12"
    },
    {
        id: "ht_12",
        name: "Người hướng dẫn",
        text: "Anh quen sống khô khan như một cỗ máy rồi, nên khi bộ não load dữ liệu khu vực này, nó tự động biến thư viện thành một cái xưởng luôn.",
        bg: "",
        voice: "assets/voice/toaA/9.3_toaA.ogg",
        sprite: "",
        nextId: "ht_13"
    },
    {
        id: "ht_13",
        name: "Người hướng dẫn",
        text: "Muốn lấy được Mảnh ký ức thì xắn tay áo lên giúp cậu sinh viên kia xếp sách đi.",
        bg: "",
        voice: "assets/voice/toaA/9.4_toaA.ogg",
        sprite: "",
        nextId: "ht_14"
    },
    {
        id: "ht_14",
        name: "{PLAYER}",
        text: "...Bệnh nghề nghiệp nặng tới mức mang cả dây chuyền vào trong tưởng tượng. Chịu luôn rồi.",
        bg: "",
        voice: "assets/voice/toaA/10_toaA.ogg",
        sprite: "assets/images/test_main.png",
        nextId: "ht_15"
    },
    {
        id: "ht_15",
        name: "CTV CNPM",
        text: "Ôi anh ơi một xe tải sách tới nữa rồi kìa huhu.",
        bg: "",
        voice: "assets/voice/toaA/11.1_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_16"
    },
    {
        id: "ht_16",
        name: "CTV CNPM",
        text: "Anh ráng nhặt sách rồi xếp vào đúng 9 cái kệ đằng kia nha. Đừng để rớt cuốn nào đấy, rớt là em bị thủ thư la mất!",
        bg: "",
        voice: "assets/voice/toaA/11.2_toaA.ogg",
        sprite: "assets/images/chibi.png",
        noSkip: true,
        nextId: "ht_17"
    },
    {
        id: "ht_17",
        name: "{PLAYER}",
        text: "Chuyện nhỏ. Phân loại 9 kệ đúng không? Tới đây... Ủa khoan, sao mấy cuốn sách bám đầy bụi này nặng thế? Anh nhấc không lên!",
        bg: "",
        voice: "assets/voice/toaA/12_toaA.ogg",
        sprite: "assets/images/test_main.png",
        noSkip: true,
        nextId: "ht_18"
    },
    {
        id: "ht_18",
        name: "CTV CNPM",
        text: "Sao em biết được???",
        bg: "",
        voice: "assets/voice/toaA/13_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_19"
    },
    {
        id: "ht_19",
        name: "Người hướng dẫn",
        text: "À quên nhắc! Mấy cuốn Sách Dày đó là chồng sách bị buộc vào nhau đó. Anh phải gỡ nó ra (click 3 lần) thì mới đưa lên kệ được! Và nhớ là đừng chạm vào Sách cũ nhé!",
        bg: "",
        voice: "assets/voice/toaA/14_toaA.ogg",
        sprite: "",
        noSkip: true,
        nextId: "ht_20"
    },
    {
        id: "ht_20",
        name: "{PLAYER}",
        text: "Gỡ nó ra. Rõ rồi. Và không động vào sách cũ. Okay luôn!",
        bg: "",
        voice: "assets/voice/toaA/15_toaA.ogg",
        sprite: "assets/images/test_main.png",
        nextId: "ht_21"
    },
    {
        id: "ht_21",
        name: "CTV CNPM",
        text: "Anh sẵn sàng chưa? Thêm xe tải sách thứ ba rồi kìaaa!!",
        bg: "",
        voice: "assets/voice/toaA/16_toaA.ogg",
        sprite: "assets/images/chibi.png",
        nextId: "ht_22"
    },
    {
        id: "ht_22",
        name: "{PLAYER}",
        text: "Được rồi. Bắt đầu thôi!",
        bg: "",
        voice: "assets/voice/toaA/17_toaA.ogg",
        sprite: "assets/images/test_main.png",
        noskip: true,
        nextId: null
    }
];
let hasTransitionedToToaA = false;
function transitionToToaA() {
    if (hasTransitionedToToaA) return;
    hasTransitionedToToaA = true;

    // 1. TẠO TẤM RÈM ĐEN (FADE TO BLACK)
    let overlay = document.getElementById('transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'transition-overlay';
        // Ép CSS trực tiếp bằng JS để bạn không phải đụng vào file CSS
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: black; z-index: 9999; opacity: 0;
            transition: opacity 0.8s ease-in-out; pointer-events: none;
        `;
        document.body.appendChild(overlay);
    }

    // 2. KÉO RÈM XUỐNG (Màn hình từ từ tối đen trong 0.8s)
    // Dùng setTimeout nhỏ để trình duyệt kịp nhận diện tấm rèm trước khi làm mờ
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    // 3. THAY ĐỒ TRONG BÓNG TỐI (Đợi 850ms cho rèm đen hẳn rồi mới xử lý giao diện)
    setTimeout(() => {
        // Tắt Tòa E
        const toaE = document.getElementById('toa-e');
        if (toaE) toaE.style.display = 'none';

        // Bật màn hình Hội thoại lên
        const vnScreen = document.getElementById('vn-screen');
        if (vnScreen) {
            // Dọn sạch chữ cũ của hội thoại trước
            const textElements = vnScreen.querySelectorAll('p, span, h2, h3, div[id*="text"], div[id*="name"], div[class*="text"], div[class*="name"]');
            textElements.forEach(el => el.innerHTML = "");
            
            vnScreen.style.opacity = '1'; // Đảm bảo màn hình rõ nét
            vnScreen.style.display = 'block';
        }

        // Kích hoạt hội thoại Tòa A
        if (typeof window.playVN === 'function') {
            window.playVN(storyToaA, "ht_00", () => {
                // Khi đọc xong hội thoại Tòa A thì nhảy vào game
                if (typeof window.switchBuilding === 'function') {
                    window.switchBuilding('toa-a');
                }
            });
        }

        // 4. KÉO RÈM LÊN (Màn hình từ từ sáng lên, lộ ra hộp thoại Tòa A)
        // Chờ thêm 100ms cho file playVN kịp render chữ và ảnh rồi mới kéo rèm
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 100);

    }, 850); // Khớp với thời gian 0.8s kéo rèm + 50ms delay
}