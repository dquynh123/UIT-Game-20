// ==========================================
// 1. HÀM HIỂN THỊ CHÚC MỪNG VÀ PHÁO HOA
// ==========================================
function showCelebrationAlert(message) {
    const overlay = document.getElementById('celebration-overlay');
    const msgElement = document.getElementById('celeb-message');
    if(overlay && msgElement) {
        msgElement.innerText = message;
        overlay.classList.remove('hidden');
        bắnPháoHoa();
    }
}

function bắnPháoHoa() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.8 } });
        confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.8 } });
    }, 250);
}

// ==========================================
// 2. KHỞI CHẠY GAME: CƠ CHẾ SORT PUZZLE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Kho dữ liệu sách
    const thuVienSach = {
        'GT-001': { type: 'gt', name: 'Đại số tuyến tính' },
        'GT-042': { type: 'gt', name: 'CSDL & Giải thuật' },
        'GT-111': { type: 'gt', name: 'Toán rời rạc' },
        'GT-202': { type: 'gt', name: 'Mạng máy tính' },
        'LV-105': { type: 'lv', name: 'Dự báo tin tức giả bằng cách tiếp cận đồ thị tri thức' },
        'LV-222': { type: 'lv', name: 'Cảnh báo tốc độ xe' },
        'LV-333': { type: 'lv', name: 'Bài toán tìm mộ liệt sĩ bằng công nghệ GIS' },
        'LV-444': { type: 'lv', name: 'Ẩn thông tin trên dữ liệu đa truyền thông' },
        'KLTN-909': { type: 'kltn', name: 'Baby Care - Ứng dụng hỗ trợ chăm sóc sức khỏe em bé' },
        'KLTN-012': { type: 'kltn', name: 'Bảo vệ quyền riêng tư vị trí trong mạng cận biên đa truy cập' },
        'KLTN-123': { type: 'kltn', name: 'Hệ hỗ trợ chẩn đoán bệnh tim dựa trên kỹ thuật máy học' },
        'KLTN-456': { type: 'kltn', name: 'Tái tạo ảnh HDR từ một ảnh đầu vào' }
    };

    // --- CẤU HÌNH LEVEL (SỐ LƯỢNG KHỦNG) ---
    const levelsData = {
        // Lv 1: 4 Ngăn. Mỗi mã có 3 cuốn sách. Sức chứa mỗi ngăn: 4 cuốn. Thời gian 60s
        1: { totalSlots: 4, targetCodes: ['GT-001', 'GT-042', 'LV-105', 'KLTN-909'], copies: 3, capacity: 4, time: 60, reward: 20, cols: 2 },
        // Lv 2: 6 Ngăn. Thời gian 90s
        2: { totalSlots: 6, targetCodes: ['GT-001', 'GT-042', 'GT-111', 'LV-105', 'KLTN-909', 'KLTN-012'], copies: 3, capacity: 4, time: 90, reward: 35, cols: 3 },
        // Lv 3: 12 Ngăn. Thời gian 180s
        3: { totalSlots: 12, targetCodes: ['GT-001', 'GT-042', 'GT-111', 'GT-202', 'LV-105', 'LV-222', 'LV-333', 'LV-444', 'KLTN-909', 'KLTN-012', 'KLTN-123', 'KLTN-456'], copies: 3, capacity: 4, time: 180, reward: 45, cols: 4 }
    };

    let currentLevel = 1;
    let totalDRL = 0;
    let timeRemaining = 0;
    let timerInterval = null;

    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const completeScreen = document.getElementById('level-complete-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const shelfGrid = document.getElementById('shelf-grid');
    
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('next-level-btn').addEventListener('click', () => prepareLevel(currentLevel + 1));
    document.getElementById('retry-btn').addEventListener('click', () => prepareLevel(currentLevel));
    
    const overlay = document.getElementById('celebration-overlay');
    document.getElementById('close-celeb-btn')?.addEventListener('click', () => overlay.classList.add('hidden'));
    document.getElementById('continue-btn')?.addEventListener('click', () => overlay.classList.add('hidden'));

    function prepareLevel(level) {
        if (level > 3) {
            showCelebrationAlert("CHÚC MỪNG! BẠN ĐÃ HOÀN THÀNH TÒA A VỚI " + totalDRL + " ĐRL!");
            completeScreen.classList.add('hidden');
            return;
        }
        currentLevel = level;
        const data = levelsData[currentLevel];
        
        gameScreen.classList.add('hidden');
        completeScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        
        document.getElementById('level-info').innerText = `Màn ${currentLevel}: ${data.totalSlots} Ngăn (${data.time} giây) - Thưởng: ${data.reward} ĐRL`;
    }

    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        const data = levelsData[currentLevel];
        timeRemaining = data.time;
        updateTimerDisplay();
        document.getElementById('drl-display').innerText = totalDRL;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) loseGame();
        }, 1000);

        buildShelfAndBooks(data);
    }

    function updateTimerDisplay() {
        const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
        const secs = String(timeRemaining % 60).padStart(2, '0');
        document.getElementById('time-display').innerText = `${mins}:${secs}`;
    }

    // --- HỆ THỐNG XÂY KỆ & NHÂN BẢN SÁCH ---
    function buildShelfAndBooks(data) {
        shelfGrid.innerHTML = ''; 
        shelfGrid.style.gridTemplateColumns = `repeat(${data.cols}, 1fr)`;

        if (currentLevel === 3) {
            shelfGrid.classList.add('compact-mode');
        } else {
            shelfGrid.classList.remove('compact-mode');
        }

        let slotsArray = [];

        // 1. Tạo ngăn kệ (Tất cả có nhãn dán)
        for (let i = 0; i < data.totalSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-slot drop-zone';
            const code = data.targetCodes[i];
            slot.setAttribute('data-accept', code);
            slot.innerHTML = `<div class="slot-label">${code}</div>`;
            shelfGrid.appendChild(slot);
            slotsArray.push(slot);
        }

        // 2. Nhân bản sách (Mỗi mã sinh ra "copies" cuốn)
        let booksArray = [];
        data.targetCodes.forEach(code => {
            const bData = thuVienSach[code];
            for (let i = 1; i <= data.copies; i++) {
                const bookDiv = document.createElement('div');
                bookDiv.className = `book type-${bData.type}`;
                bookDiv.id = `book-${code}-tap${i}`;
                bookDiv.setAttribute('draggable', 'true');
                bookDiv.setAttribute('data-code', code); 
                bookDiv.innerHTML = `
                    <span class="book-title">${bData.name} - T.${i}</span>
                    <div class="label-white"><span class="vertical-text">${code}</span></div>
                `;
                booksArray.push(bookDiv);
            }
        });

        // 3. Trộn đều và nhét vào kệ sao cho không vượt quá sức chứa
        booksArray.sort(() => Math.random() - 0.5); 
        booksArray.forEach(book => {
            // Tìm tất cả các ngăn chưa bị đầy
            let availableSlots = slotsArray.filter(slot => slot.querySelectorAll('.book').length < data.capacity);
            if(availableSlots.length > 0) {
                // Chọn đại 1 ngăn chưa đầy để nhét vào
                let randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
                randomSlot.appendChild(book);
            }
        });

        enableDragAndDrop();
    }

    // --- LOGIC KÉO THẢ TỐI ƯU ---
    function enableDragAndDrop() {
        const books = document.querySelectorAll('.book');
        const dropZones = document.querySelectorAll('.drop-zone');

        books.forEach(book => {
            book.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.currentTarget.id);
                setTimeout(() => e.currentTarget.style.opacity = '0.5', 0);
            });
            book.addEventListener('dragend', (e) => {
                e.currentTarget.style.opacity = '1';
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const draggedId = e.dataTransfer.getData('text/plain');
                if (!draggedId) return;
                const draggedBook = document.getElementById(draggedId);
                
                const data = levelsData[currentLevel];
                const currentBooksCount = zone.querySelectorAll('.book').length;
                const targetBook = e.target.closest('.book');

                // Luật chơi: Nếu thả đè lên cuốn sách khác -> HOÁN ĐỔI 2 CUỐN
                if (targetBook && targetBook !== draggedBook) {
                    const sourceZone = draggedBook.parentNode;
                    sourceZone.appendChild(targetBook);
                    zone.appendChild(draggedBook);
                } 
                // Nếu thả vào chỗ trống -> PHẢI CÒN SỨC CHỨA MỚI CHO THẢ
                else {
                    if (currentBooksCount < data.capacity) {
                        zone.appendChild(draggedBook);
                    }
                }
                
                checkWinCondition();
            });
        });
    }

    // --- KIỂM TRA CHIẾN THẮNG ---
    function checkWinCondition() {
        const dropZones = document.querySelectorAll('.drop-zone');
        const data = levelsData[currentLevel];
        let isWin = true;

        dropZones.forEach(zone => {
            const requiredCode = zone.getAttribute('data-accept');
            const booksInZone = zone.querySelectorAll('.book');
            
            // 1. Phải gom đủ số tập vào 1 ngăn (Ở đây là 3 cuốn)
            if (booksInZone.length !== data.copies) {
                isWin = false;
            } else {
                // 2. Tất cả các cuốn trong ngăn đó đều phải đúng cái mã yêu cầu
                booksInZone.forEach(b => {
                    if(b.getAttribute('data-code') !== requiredCode) isWin = false;
                });
            }
        });

        if (isWin) {
            clearInterval(timerInterval);
            const reward = levelsData[currentLevel].reward;
            totalDRL += reward;
            document.getElementById('reward-display').innerText = reward + " ĐRL";
            gameScreen.classList.add('hidden');
            completeScreen.classList.remove('hidden');
            bắnPháoHoa(); 
        }
    }

    function loseGame() {
        clearInterval(timerInterval);
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }

    prepareLevel(1);
});