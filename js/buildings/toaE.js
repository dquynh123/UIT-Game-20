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

                <div class="dice-controls">

                <div id="action-log" class="action-log">Nhật ký: Sẵn sàng!</div>
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
        if (pos <= 10) return "Tầng 1: Sảnh chính tòa E";
        if (pos <= 15) return "Tầng 2: Tầng 2 tòa E";
        if (pos <= 20) return "Tầng 2: Thư viện tòa E"; // Qua nửa tầng 2
        if (pos <= 40) return `Tầng ${Math.ceil(pos/10)}: Các phòng học`;
        if (pos <= 50) return "Tầng 5: Khoa Khoa học máy tính";
        if (pos <= 55) return "Tầng 5: MMLab UIT";
        if (pos <= 60) return "Tầng 6: Khoa Kỹ thuật máy tính";
        if (pos <= 70) return "Tầng 7: Khoa Công nghệ phần mềm";
        if (pos <= 80) return "Tầng 8: Khoa Mạng máy tính và truyền thông";
        if (pos <= 90) return "Tầng 9: Khoa Hệ thống thông tin";
        if (pos <= 100) return "Tầng 10: Khoa Khoa học và Kỹ thuật thông tin";
        if (pos <= 110) return "Tầng 11: Khu vực doanh nghiệp nghiên cứu";
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
            } else {
                visualBoard.classList.remove('night-mode');
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
                
                // --- BƯỚC 2 NẰM Ở ĐÂY ---
                // Sau khi báo thắng, đếm ngược 3 giây (3000ms) rồi tự động bay sang Tòa A
                setTimeout(() => {
                    transitionToToaA();
                }, 3000);
                
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
        let finalScore = state.pos; // Mặc định điểm bằng vị trí hiện tại
        
        if (state.pos === 120) {
            finalScore = 120 + state.drl; // Về đích
        }

        logArea.innerHTML = `<strong style="color:red;">${reason}</strong><br>Tổng điểm của bạn: <strong>${finalScore}</strong>`;
        
        // Disable các nút xúc xắc
        diceButtons.forEach(btn => btn.disabled = true);
        // Chuyển thử qua a
        transitionToToaA();
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

function transitionToToaA() {
    // Gọi hàm điều phối toàn cục từ main.js
    if (typeof window.switchBuilding === 'function') {
        window.switchBuilding('toa-a');
        
        // Nếu tòa A có hàm bắt đầu game riêng, hãy gọi nó ở đây
        // Ví dụ: if (typeof window.initToaA === 'function') window.initToaA();
    }
}