let glitchInterval; // Biến lưu bộ đếm rung lắc
let gameInterval;
let difficultyInterval;
let timerInterval;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let currentSpeed = 12; 
let spawnRate = 3500; 
let sortedBooks = 0;
let isTransitioningToToaB = false;
//kịch bản hội thoại tòa b
const StoryToaB = [
    {
        id: "test_01",
        name: "{PLAYER}",
        text: "Ây da, anh xin lỗi, để anh nhặt phụ. Ủa... tờ này là danh sách môn học em muốn đăng ký kỳ này hả?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_02"
    },

    {
        id: "test_02",
        name: "Bạn gái Truyền thông",
        text: "Dạ vâng wishlist của em đó anh... Tới giờ mở form đăng ký rồi mà wifi bên này rớt hoài, em đang tính chạy đi kiếm chỗ mạng mạnh hơn.",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_03"
    },

    {
        id: "test_03",
        name: "{PLAYER}",
        text: "Khổ sở y chang hồi xưa. Bấm F5 gãy cả nút F5 vẫn đăng ký không kịp. Đưa đây anh thao tác thử xem tay nghề còn bén không.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_04"
    },

    {
        id: "test_04",
        name: "Bạn gái Truyền thông",
        text: "Anh canh kỹ nha, lật sai ô môn học là bị trừ điểm rèn luyện đó. Cứu em nha anh, học kỳ này em đang thiếu ĐRL trầm trọng luôn á!",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_05"
    },

    {
        id: "test_05",
        name: "{PLAYER}",
        text: "Ụa? Hả? Cái gì? Từ t…",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: null
    },
];

const shelfCodes = ['HDH', 'MMT', 'DSTT', 'CSDL', 'CNPM', 'NMPTGame', 'TTNT', 'DSA', 'VDK']; 

const bookImages = {
    'HDH': 'assets/images/hdh_gt.png',
    'MMT': 'assets/images/mmt_gt.png',
    'DSTT': 'assets/images/DSTT_gt.png',
    'CSDL': 'assets/images/CSDL_gt.png',
    'CNPM': 'assets/images/CNPM_gt.png',
    'NMPTGame': 'assets/images/ptg_gt.png',
    'TTNT': 'assets/images/TTNT.png',
    'DSA': 'assets/images/DSA.png',
    'VDK': 'assets/images/VDK.png',
    // ... bổ sung đủ 9 môn vào đây ...
};

const spineColors = ['#2980b9', '#27ae60', '#8e44ad', '#f39c12', '#16a085', '#d35400'];

const belt = document.querySelector('#toa-a #conveyor-container');

const btnStartToaA = document.querySelector('#toa-a #toa-a-start-btn');

// Nút Bắt đầu Tòa A: Chuyển thẳng vào game luôn
if (btnStartToaA) {
    btnStartToaA.addEventListener('click', () => {
        startToaAGame(); 
    });
}

setupDropZones();

function startToaAGame() {
    isTransitioningToToaB = false;
    document.querySelector('#toa-a #start-screen-toa-a').style.display = 'none';
    document.querySelector('#toa-a #game-screen-toa-a').classList.remove('hidden');

    score = 0; lives = 3; timeElapsed = 0; currentSpeed = 10; spawnRate = 3000;
    sortedBooks = 0;

    updateHUD();
    
    document.querySelectorAll('.conveyor-book').forEach(b => b.remove());
    document.querySelectorAll('.spines-container').forEach(c => c.innerHTML = '');

    startGameLoops();
    //setupDropZones();
}

function startGameLoops() {
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval); clearInterval(glitchInterval);

    timerInterval = setInterval(() => {
        timeElapsed++;
        document.querySelector('#toa-a #time-display').innerText = timeElapsed;
    }, 1000);

    gameInterval = setInterval(spawnBook, spawnRate);

    // Mỗi 12 giây tăng tốc 1 lần
    difficultyInterval = setInterval(() => {
        if (currentSpeed > 4) currentSpeed -= 1; 
        if (spawnRate > 1000) spawnRate -= 200;   
        clearInterval(gameInterval);
        gameInterval = setInterval(spawnBook, spawnRate);
    }, 12000); 

    // QUAN TRỌNG NHẤT: Cứ mỗi 15 giây (15000ms) là động đất!
    glitchInterval = setInterval(() => {
        triggerGlitchEvent();
    }, 15000);
}

function spawnBook() {
    const book = document.createElement('div');
    book.className = 'conveyor-book';
    book.style.setProperty('--speed', `${currentSpeed}s`);
    
    const randType = Math.floor(Math.random() * 10); 
    const randCode = shelfCodes[Math.floor(Math.random() * shelfCodes.length)];
    
    // Tỉ lệ sinh sách: 20% Cũ, 20% Tạ, 60% Thường
    if (randType >= 8) { 
        // BẪY: SÁCH CŨ
        book.classList.add('book-old'); 
        book.innerText = `SÁCH\nCŨ`; 
        book.draggable = true; 
        book.dataset.code = "OLD"; 
    } else if (randType >= 6 && randType <= 7) { 
        // SÁCH NẶNG (TẠ)
        book.classList.add('book-heavy', 'book-heavy-image');
        book.draggable = false;
        book.dataset.clicks = 3;
        book.dataset.code = randCode;

        // Xóa sạch nội dung cũ trước khi thêm nhãn mới
        book.innerHTML = ""; 
        const clicksSpan = document.createElement('span');
        clicksSpan.className = 'clicks-text';
        clicksSpan.innerHTML = `Sách Dày<br>(3 click)`;
        book.appendChild(clicksSpan);

        book.addEventListener('click', function() {
            let clk = parseInt(this.dataset.clicks) - 1;
            this.dataset.clicks = clk;
            
            const clicksTextSpan = this.querySelector('span.clicks-text');
            if (clicksTextSpan) clicksTextSpan.innerHTML = `Sách Dày<br>(${clk} click)`;
            
            if (clk <= 0) {
                this.draggable = true;
                if (clicksTextSpan) clicksTextSpan.remove();
                
                // QUAN TRỌNG: Lột bỏ ảnh "Sách Dày" để hiện ảnh "Môn học thật"
                this.classList.remove('book-heavy-image'); 
                
                if (bookImages[randCode]) {
                    this.style.backgroundImage = `url(${bookImages[randCode]})`;
                    this.style.backgroundSize = "100% 100%";
                    this.style.backgroundColor = "transparent";
                    this.style.border = "none";
                } else {
                    this.innerText = randCode;
                    this.style.backgroundColor = "#3498db"; 
                    this.style.backgroundImage = "none";
                }
            }
        });
    } else { 
        // SÁCH THƯỜNG
        book.classList.add('book-normal');
        book.dataset.code = randCode;
        book.draggable = true;
        
        // KIỂM TRA XEM ĐÃ CÓ ẢNH CHO MÔN NÀY CHƯA
        if (bookImages[randCode]) {
            // Nếu CÓ ảnh -> Hiện ảnh, giấu chữ
            book.innerText = ""; 
            book.style.backgroundImage = `url(${bookImages[randCode]})`;
            book.style.backgroundSize = "100% 100%";
            book.style.backgroundRepeat = "no-repeat";
            book.style.backgroundColor = "transparent";
            book.style.border = "none";
            book.style.boxShadow = "none";
        } else {
            // Nếu CHƯA CÓ ảnh -> Hiện màu xanh dương cứu viện và in chữ ra
            book.innerText = randCode;
            book.style.backgroundColor = "#3498db"; // Màu xanh dương
            book.style.color = "white";
            book.style.border = "2px solid #2980b9";
            // Xóa background image lỗi đi (nếu có)
            book.style.backgroundImage = "none";
        }
    }

    book.addEventListener('animationend', () => {
        if (document.getElementById(uniqueId)) {
            book.remove();
            
            // Nếu là Sách Cũ (Bug) rơi xuống vực -> An toàn, không bị phạt!
            if (book.dataset.code === "OLD") {
                console.log("Đã tiêu hủy một 'Bug' an toàn!");
                // Bạn có thể cho score++ ở đây nếu muốn thưởng điểm vì tính kiên nhẫn
            } 
            // Nếu là sách xịn (Ký ức) mà để trôi mất -> Trừ 1 mạng!
            else {
                loseLife("Một mảnh ký ức cốt lõi đã rơi xuống Hư Không!");
            }
        }
    });

    book.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('bookType', book.dataset.code);
        book.id = 'dragging-' + Date.now();
        book.style.animationPlayState = 'paused';
    });

    book.addEventListener('dragend', () => {
        // Nếu thả hụt ra ngoài (không vào rổ), sách sẽ tự chạy tiếp
        if (document.getElementById(book.id)) {
            book.style.animationPlayState = 'running';
        }
    });
    
    const uniqueId = 'book-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    book.id = uniqueId;

    // 2. Chèn sách vào băng chuyền trước
    belt.appendChild(book);

    // 3. ÉP TRÌNH DUYỆT PHẢI CHẠY (Đây là mẹo để fix lỗi đứng yên)
    // Chúng ta dùng requestAnimationFrame để đợi trình duyệt sẵn sàng rồi mới kích hoạt chạy
    requestAnimationFrame(() => {
        book.style.animationPlayState = 'running';
    });

    // 4. Cập nhật lại logic rơi vực để không bị mất mạng oan
    book.addEventListener('animationend', () => {
        // Chỉ phạt nếu sách thực sự vẫn còn nằm trong băng chuyền
        if (document.getElementById(uniqueId)) {
            book.remove();
            loseLife("Một cuốn sách đã rơi xuống vực!");
        }
    });
}

function setupDropZones() {
    const zones = document.querySelectorAll('#toa-a .drop-zone');
    zones.forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const bookType = e.dataTransfer.getData('bookType');
            const targetType = zone.getAttribute('data-accept');
            const draggedBook = document.querySelector(`[id^="dragging-"]`);

            // LUẬT TỬ THẦN: Thả Sách Cũ lên các kệ Kỹ Năng -> GAME OVER
            if (bookType === "OLD") {
                if(draggedBook) draggedBook.remove();
                gameOver("HỆ THỐNG SỤP ĐỔ!\nBạn đã đưa 'Bug' (sách cũ) vào ma trận lưu trữ!");
                return;
            }

            if (bookType === targetType) {
                // Thả đúng!
                sortedBooks++;
                score = sortedBooks;
                updateHUD();
                
                // Nếu thả lên kệ (không phải thùng rác) -> Vẽ gáy sách
                if (targetType !== "OLD") {
                    const spinesContainer = zone.querySelector('.spines-container');
                    const newSpine = document.createElement('div');
                    newSpine.className = 'book-spine';
                    newSpine.style.backgroundColor = spineColors[Math.floor(Math.random() * spineColors.length)];
                    newSpine.style.height = (Math.random() * 20 + 80) + '%';
                    spinesContainer.appendChild(newSpine);
                }

                if(draggedBook) draggedBook.remove();
                
            } else {
                loseLife("Xếp sai vị trí!");
                if(draggedBook) draggedBook.style.animationPlayState = 'running'; 
            }
        });
    });
}

function loseLife(reason) {
    lives--;
    updateHUD();
    console.log("Cảnh báo: " + reason);
    if (lives <= 0) gameOver("Bạn đã hết mạng!");
}

function updateHUD() {
    document.querySelector('#toa-a #score-display').innerText = score;
    document.querySelector('#toa-a #life-display').innerText = lives;

    const sortedElem = document.querySelector('#toa-a #sorted-display');
    if (sortedElem) {
        sortedElem.innerText = sortedBooks;
    }
}

function gameOver(reason) {
    clearInterval(glitchInterval);
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval);
    document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
    
    // Đảm bảo tắt rung lắc và nháy đỏ khi thua
    const gameScreen = document.querySelector('#toa-a #game-screen-toa-a');
    const shelfGrid = document.querySelector('#toa-a #complex-shelves-grid');
    if(gameScreen) gameScreen.classList.remove('glitch-red-screen');
    if(shelfGrid) shelfGrid.classList.remove('shaking-shelf');
    
    if (window.UITGameStats) {
        window.UITGameStats.addScore("Tòa A", score);
    }
    
    setTimeout(() => {
        // Dọn sạch sách cũ để game không bị nặng
        document.querySelectorAll('.conveyor-book').forEach(b => b.remove());
        document.querySelectorAll('.spines-container').forEach(c => c.innerHTML = '');
        
        console.log("Kết thúc Tòa A (Lý do: " + reason + "). Hiện bảng tổng kết...");
        
        // SỬA Ở ĐÂY: Gọi Bảng Tổng Kết thay vì chuyển thẳng
        // Tham số: Tên Tòa, Điểm, Thời gian, Thắng/Thua (false = thua), Hàm đi tiếp
        if (typeof window.showGlobalSummaryBoard === 'function') {
            window.showGlobalSummaryBoard("Tòa A", score, timeElapsed, false, transitionToToaB);
        } else {
            // Backup phòng hờ lỡ file main.js bị lỗi chưa load kịp
            transitionToToaB();
        }
        
    }, 500); // Đợi 0.5 giây rồi mới hiện bảng
}
// 1. HÀM CHUYỂN TIẾP (Sau này sẽ gọi khi bấm nút trên Bảng Tổng Kết)
function transitionToToaB() {
    if (isTransitioningToToaB) return;
    isTransitioningToToaB = true;

    // Chạy hội thoại Tòa B
    if (typeof window.playVN === 'function') {
        window.playVN(StoryToaB, "test_01", () => {
            // Đọc xong thì vào game Tòa B
            window.switchBuilding('toa-b');
            if (typeof ToaBGame !== 'undefined') new ToaBGame('game-container');
        });
    }
}

function winGameToaA() {
    clearInterval(glitchInterval);
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval); 
    document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
    
    // Đảm bảo tắt rung lắc và nháy đỏ khi thắng
    const gameScreen = document.querySelector('#toa-a #game-screen-toa-a');
    const shelfGrid = document.querySelector('#toa-a #complex-shelves-grid');
    if(gameScreen) gameScreen.classList.remove('glitch-red-screen');
    if(shelfGrid) shelfGrid.classList.remove('shaking-shelf');
    
    if (window.UITGameStats) {
        window.UITGameStats.addScore("Tòa A", score); 
    }
    
    setTimeout(() => {
        // Dọn sạch sách cũ
        document.querySelectorAll('.conveyor-book').forEach(b => b.remove());
        document.querySelectorAll('.spines-container').forEach(c => c.innerHTML = '');
        
        console.log("Chiến thắng Tòa A. Hiện bảng tổng kết...");
        
        // SỬA Ở ĐÂY: Tham số isWin truyền vào là 'true'
        if (typeof window.showGlobalSummaryBoard === 'function') {
            window.showGlobalSummaryBoard("Tòa A", score, timeElapsed, true, transitionToToaB);
        } else {
            transitionToToaB();
        }
        
    }, 500);
}
function triggerGlitchEvent() {
    const gameScreen = document.querySelector('#toa-a #game-screen-toa-a');
    const shelfGrid = document.querySelector('#toa-a #complex-shelves-grid');
    
    // Bật hiệu ứng: Nháy đỏ + Rung tủ
    if(gameScreen) gameScreen.classList.add('glitch-red-screen');
    if(shelfGrid) shelfGrid.classList.add('shaking-shelf');
    
    // Hẹn giờ đúng 6 giây sau thì tắt hiệu ứng đi
    setTimeout(() => {
        if(gameScreen) gameScreen.classList.remove('glitch-red-screen');
        if(shelfGrid) shelfGrid.classList.remove('shaking-shelf');
    }, 6000);
}

/*
// ==========================================
// TỰ ĐỘNG PAUSE/RESUME GAME KHI CHUYỂN TAB (TÒA A)
// ==========================================
document.addEventListener("visibilitychange", () => {
    const gameScreenA = document.querySelector('#toa-a #game-screen-toa-a');
    // Chỉ can thiệp nếu người chơi đang ở trong màn hình chơi game Tòa A
    if (gameScreenA && !gameScreenA.classList.contains('hidden') && lives > 0) {
        
        if (document.hidden) {
            // KHI SANG TAB KHÁC: Dừng đồng hồ, dừng sinh sách, tạm dừng băng chuyền
            clearInterval(gameInterval);
            clearInterval(difficultyInterval);
            clearInterval(timerInterval);
            clearInterval(glitchInterval);
            document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
            console.log("Tòa A: Đã tạm dừng game vì chuyển tab.");
        } else {
            // KHI QUAY LẠI: Chạy tiếp đồng hồ và băng chuyền
            startGameLoops(); 
            document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'running');
            console.log("Tòa A: Đã tiếp tục game.");
        }
    }
}); */