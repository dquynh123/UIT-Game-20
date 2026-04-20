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
                    <div class="stat-box">ĐRL: <span id="drl-display" class="highlight">200</span></div>
                    <div class="stat-box">Lượt: <span id="turn-display">0/25</span></div>
                    <div class="stat-box">Vị trí: <span id="pos-display" class="highlight">1</span></div>
                </div>

                <div class="dice-controls">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px;">Chọn loại xúc xắc:</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn-dice" data-type="4" data-cost="3">🎲 D4 (-3)</button>
                        <button class="btn-dice" data-type="6" data-cost="5">🎲 D6 (-5)</button>
                        <button class="btn-dice" data-type="20" data-cost="25">🎲 D20 (-25)</button>
                    </div>
                </div>

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
        isGameOver: false
    };

    // 3. CẤU TRÚC DỮ LIỆU ĐIỀU HƯỚNG (Hash Map)
    // Key là ô hiện tại, Value là ô sẽ nhảy tới (Thang máy hoặc Cầu thang bộ)
    const portals = {
        4: 14, 9: 31, 40: 41, 58: 71, 67: 76, 87: 91, // Thang máy (Lên)
        17: 7, 45: 1, 53: 48, 64: 19, 74: 34, 105: 77, 119: 62 // Cầu thang bộ (Xuống)
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
    const displayDrl = document.getElementById('drl-display');
    const displayTurn = document.getElementById('turn-display');
    const displayPos = document.getElementById('pos-display');
    const displayFloor = document.getElementById('floor-display');
    const logArea = document.getElementById('action-log');
    const diceButtons = document.querySelectorAll('.btn-dice');

    // 5. LOGIC CHÍNH XỬ LÝ LƯỢT ĐI
function rollDice(diceType, cost) {
        if (state.isGameOver) return;

        // BƯỚC 1: KIỂM TRA XEM CÓ ĐỦ TIỀN MUA LOẠI XÚC XẮC VỪA CHỌN KHÔNG
        if (state.drl < cost) {
            // Kiểm tra xem liệu có còn đủ tiền cho loại rẻ nhất (D4 - giá 3) không
            if (state.drl < 3) {
                endGame("Bạn đã cạn kiệt ĐRL và không thể mua bất kỳ xúc xắc nào nữa!");
            } else {
                // Chỉ cảnh báo, không kết thúc game
                logArea.innerHTML = `<span style="color: orange;"> Bạn không đủ ĐRL cho D${diceType} (cần ${cost}). Hãy chọn loại rẻ hơn!</span>`;
            }
            return; // Thoát hàm, không thực hiện lượt đi này
        }

        // BƯỚC 2: NẾU ĐỦ TIỀN THÌ MỚI TRỪ ĐIỂM VÀ ĐI TIẾP
        state.drl -= cost;
        state.turns += 1;

        const rollResult = Math.floor(Math.random() * diceType) + 1;
        state.pos += rollResult;

        let logMsg = `Đổ D${diceType} ra ${rollResult}. Đi đến ô ${state.pos}.`;

        if (state.pos >= 120) {
            state.pos = 120;
            updateUI();
            endGame("CHÚC MỪNG! Bạn đã vào được Hội trường tòa E để tham dự seminar.");
            return;
        }

        if (portals[state.pos]) {
            const newPos = portals[state.pos];
            logMsg += newPos > state.pos ? ` 🚀 Thang máy lên ô ${newPos}!` : ` 🪜 Cầu thang xuống ô ${newPos}!`;
            state.pos = newPos;
        }

        logArea.innerText = logMsg;
        updateUI();

        // BƯỚC 3: KIỂM TRA ĐIỀU KIỆN KẾT THÚC VÒNG SAU KHI ĐI
        if (state.turns >= state.maxTurns) {
            endGame("Hết 25 lượt đi. Kết thúc vòng chạy!");
        } else if (state.drl < 3) {
            // Kiểm tra lại sau khi trừ điểm, nếu không còn đủ 3đ cho lượt sau thì nghỉ luôn
            endGame("Số ĐRL còn lại không đủ để thực hiện thêm lượt đi nào.");
        }
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

            // Ép tọa độ mới vào CSS của bé Chibi
            chibi.style.left = `${leftPercentage}%`;
            chibi.style.bottom = `${bottomPercentage}%`;
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
});