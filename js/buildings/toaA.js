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
        name: "",
        text: "Main đang thong thả bước, tay sờ vào túi áo nơi có hai mảnh ký ức (E và A). Anh ngước nhìn lên tấm bảng chỉ dẫn “B1.20”,  “B5.02” Một cảm giác hoài niệm ùa về.",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: "test_02"
    },

    {
        id: "test_02",
        name: "{PLAYER}",
        text: "Tòa B này… hồi đó toàn lên đây học mấy môn đại cương. Rồi đợt đăng ký môn, cả lũ túm năm tụm bảy ngồi hành lang… ủa, khoan đã?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_03"
    },

    {
        id: "test_03",
        name: "",
        text: "Bỗng một bạn nữ từ phía cầu thang chạy xuống, tay ôm một xấp giấy tờ to hơn cả người, mắt nhìn chằm chằm vào điện thoại, vừa chạy vừa lẩm bẩm.",
        bg: "",
        sprite: "",
        nextId: "test_04"
    },

    {
        id: "test_04",
        name: "",
        text: "Giấy tờ bay tứ tung, điện thoại rơi “bịch” xuống sàn",
        bg: "",
        sprite: "",
        nextId: "test_05"
    },

    {
        id: "test_05",
        name: "{PLAYER}",
        text: "Úi! Em có sao không?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_06"
    },
    {
        id: "test_06",
        name: "Bạn nữ",
        text: "Dạ em xin lỗi anh! Em xin lỗi! Em mải nhìn điện thoại, không để ý. Trời ạ, giấy tờ bay hết rồi!",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_07"
    },
    {
        id: "test_07",
        name: "",
        text: "Main nhặt được một tờ giấy A4 ghi đầy chữ: “WISHLIST HỌC KỲ 2 - NĂM 1 - NGÀNH KỸ THUẬT PHẦN MỀM”. Bên cạnh có những dòng note nhỏ: 'Nhất định thứ 2 quyết tâm nghỉ!'",
        bg: "",
        sprite: "",
        nextId: "test_08"
    },
    {
        id: "test_08",
        name: "{PLAYER}",
        text: "Ủa, đây là… danh sách đăng ký môn học? Sao trông nhiều tín chỉ vậy.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_09"
    },
    {
        id: "test_09",
        name: "Bạn nữ",
        text: "Dạ, đấy là wishlist của em đó anh. Học kỳ này tụi em lần đầu được đăng ký học phần bỡ ngỡ quá. Anh xem, em đổ mồ hôi hột rồi đây này.",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_10"
    },
    {
        id: "test_10",
        name: "{PLAYER}",
        text: "Khổ thân. Mà em biết cách đăng ký chưa, hay là để anh hướng dẫn nhé. Xưa chưa có môn nào là anh mày không đăng ký được đâu.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_11"
    },
    {
        id: "test_11",
        name: "Bạn nữ",
        text: "Oaaa, tiền bối, tiền bối",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_12"
    },
    {
        id: "test_12",
        name: "{PLAYER}",
        text: "Để xem… em cho anh mượn cái laptop một tí, anh thử đăng ký giúp em xem còn tay nghề không.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_13"
    },
    {
        id: "test_13",
        name: "",
        text: "Cô bạn nữ đưa laptop - một chiếc máy cũ kỹ, dán đầy sticker “I love Code”, “Debug your life”, “Trễ deadline nhưng vẫn xinh”.",
        bg: "",
        sprite: "",
        nextId: "test_14"
    },
    {
        id: "test_14",
        name: "{PLAYER}",
        text: "Bây giờ em muốn ưu tiên môn nào trước?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_15"
    },
    {
        id: "test_15",
        name: "",
        text: "Màn hình laptop nháy đỏ, một thông báo lên: “LỖI HỆ THỐNG - KHÔNG THỂ ĐĂNG KÝ TRONG KHÔNG GIAN KÝ ỨC”. ",
        bg: "",
        sprite: "",
        nextId: "test_16"
    },
    {
        id: "test_16",
        name: "{PLAYER}",
        text: "Ủa sao kỳ vậy? Máy em bị sao vậy. Anh có làm gì đâu nhỉ?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_17"
    },
    {
        id: "test_17",
        name: "Bạn nữ",
        text: "Dạ?",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_18"
    },
    {
        id: "test_18",
        name: "Người hướng dẫn",
        text: "Chào mừng cựu sinh viên đến với khu vực tòa B. Anh thấy lỗi, đó là do anh - người đang bị kẹt - đang cố đăng ký môn trong server ký ức. Còn em ấy, em ấy đang ở thực tại chẳng thấy lỗi gì hết.",
        bg: "",
        sprite: "assets/images/test_guide.png",
        nextId: "test_19"
    },
    {
        id: "test_19",
        name: "{PLAYER}",
        text: "Rồi rồi, lại cái trò chỉ mình tôi thấy này nữa à? Thư viện biến thành băng chuyền, giờ đăng ký môn cũng báo lỗi?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_20"
    },
    {
        id: "test_20",
        name: "Người hướng dẫn",
        text: "Chính xác. Em sinh viên này chỉ nhìn thấy một màn hình đăng ký bình thường và nó đang tải chậm. Còn anh giờ sẽ thấy một mini game. ",
        bg: "",
        sprite: "assets/images/test_guide.png",
        noSkip: true,
        nextId: "test_21"
    },
    {
        id: "test_21",
        name: "Người hướng dẫn",
        text: "Trong game đó, anh phải click vào đúng các ô môn học còn chỉ tiêu, tránh các ô môn đã đủ, môn trùng lịch, và môn tiên quyết chưa học. ",
        bg: "",
        sprite: "assets/images/test_guide.png",
        noSkip: true,
        nextId: "test_22"
    },
    {
        id: "test_22",
        name: "Người hướng dẫn",
        text: " Mỗi lần click sai, anh mất 1 lượt. Có 10 lượt tối đa. Chơi xong, anh nhận mảnh ký ức. Còn em kia… em sẽ thấy máy em tự động chạy và đăng ký xong 4 môn. Có vấn đề gì không?",
        bg: "",
        sprite: "assets/images/test_guide.png",
        noSkip: true,
        nextId: "test_23"
    },
    {
        id: "test_23",
        name: "Bạn nữ",
        text: "Anh ơi… ai nói chuyện với ai mà em nghe không hiểu. Mà em có cần làm gì không ạ? Hay để em ra ngoài đợi?",
        bg: "",
        sprite: "assets/images/test_cothuthu.png",
        nextId: "test_24"
    },
    {
        id: "test_24",
        name: "{PLAYER}",
        text: "Em cứ đứng đó còn lại để anh lo!",
        bg: "",
        sprite: "assets/images/test_main.png",
        noSkip: true,
        nextId: null
    }
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