let gameInterval;
let difficultyInterval;
let timerInterval;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let currentSpeed = 12; 
let spawnRate = 3500; 
let sortedBooks = 0;

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
const btnPlayToaA = document.querySelector('#toa-a #toa-a-play-btn');

// Nút ở Màn hình 1: Chuyển sang bảng hướng dẫn
if (btnStartToaA) {
    btnStartToaA.addEventListener('click', () => {
        document.querySelector('#toa-a #start-screen-toa-a').style.display = 'none';
        
        const instructionScreen = document.querySelector('#toa-a #instruction-screen-toa-a');
        instructionScreen.classList.remove('hidden');
        instructionScreen.style.display = 'flex';
    });
}

// Nút ở Bảng hướng dẫn: Vào game thật sự
if (btnPlayToaA) {
    btnPlayToaA.addEventListener('click', () => {
        document.querySelector('#toa-a #instruction-screen-toa-a').style.display = 'none';
        startToaAGame(); // Gọi hàm chạy game
    });
}

setupDropZones();

function startToaAGame() {
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
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval);

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
        book.classList.add('book-heavy');
        book.innerText = 'Sách Dày\n(3 click)';
        book.draggable = false;
        book.dataset.clicks = 3;
        book.dataset.code = randCode;
        
        book.addEventListener('click', function() {
            let clk = parseInt(this.dataset.clicks) - 1;
            this.dataset.clicks = clk;
            
            // Giấu tên sách đi, chỉ hiện số click còn lại để tạo bất ngờ
            this.innerText = `Sách Dày\n(${clk} click)`;
            
            if (clk <= 0) {
                this.draggable = true;

                if (bookImages[randCode]) {
                    // Nếu CÓ ảnh -> Hiện ảnh, giấu chữ, xóa viền
                    this.innerText = ""; 
                    this.style.backgroundImage = `url(${bookImages[randCode]})`;
                    this.style.backgroundSize = "100% 100%";
                    this.style.backgroundRepeat = "no-repeat";
                    this.style.backgroundColor = "transparent";
                    this.style.border = "none";
                    this.style.boxShadow = "none";
                } else {
                    // Phao cứu sinh nếu thiếu ảnh
                    this.innerText = randCode;
                    this.style.backgroundColor = "#3498db"; 
                    this.style.color = "white";
                    this.style.border = "2px solid #2980b9";
                    this.style.backgroundImage = "none";
                }
                
                // Đã xóa 2 dòng code cũ cản trở việc hiện ảnh ở đây!
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
        if (document.getElementById(book.id)) {
            book.remove();
            loseLife("Sách đã rơi xuống vực!");
        }
        /*book.remove();
        loseLife("Sách đã rơi xuống vực!");*/
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
            if (bookType === "OLD" && targetType !== "OLD") {
                if(draggedBook) draggedBook.remove();
                gameOver("BẠN ĐÃ ĐẠP BẪY!\nThủ thư phát hiện bạn xếp sách cũ lên kệ mới!");
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
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval);
    document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
    
    setTimeout(() => {
        // 1. Đổi chữ thông báo cho tích cực hơn
        alert(`KẾT THÚC CA LÀM!\nLý do: ${reason}\nSố sách hoàn thành: ${sortedBooks}\nThời gian: ${timeElapsed}s`);
        
        // 2. Dọn sạch sách cũ để game không bị nặng
        document.querySelectorAll('.conveyor-book').forEach(b => b.remove());
        document.querySelectorAll('.spines-container').forEach(c => c.innerHTML = '');
        
        // 3. Ẩn Tòa A
        document.querySelector('#toa-a').style.display = 'none';
        
        // 4. Mở Tòa C
        const toaB = document.querySelector('#toa-b');
        if (toaB) {
            toaB.style.display = 'block'; 
            new ToaBGame('game-container');
        }
    }, 100);
}

function winGameToaA() {
    // 1. Dừng mọi hoạt động của game
    clearInterval(gameInterval); 
    clearInterval(difficultyInterval); 
    clearInterval(timerInterval);
    document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
    
    // 2. Chờ 0.5s rồi hiện thông báo chúc mừng
    setTimeout(() => {
        alert(`🎉 XUẤT SẮC! 🎉\nBạn đã phân loại thành công 45 cuốn sách!\nTổng điểm: ${score}\nThời gian: ${timeElapsed}s`);
        
        // 3. Tắt màn hình game Tòa A
        document.querySelector('#toa-a').style.display = 'none';
        
        // CÁCH 1: Nếu muốn chuyển sang Tòa B luôn
        document.querySelector('#toa-c').style.display = 'block'; 
        
        // CÁCH 2: Nếu muốn quay lại hộp thoại hội thoại để nhân vật nói chuyện tiếp
        // document.querySelector('#vn-screen').classList.remove('hidden');
        // playVN("kich_ban_sau_khi_thang_toa_A"); 
        
    }, 500);
}