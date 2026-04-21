let gameInterval;
let difficultyInterval;
let timerInterval;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let currentSpeed = 12; 
let spawnRate = 3500;  

const shelfCodes = ['GT-01', 'GT-02', 'GT-03', 'LV-01', 'LV-02', 'LV-03', 'DA-01', 'DA-02', 'DA-03']; 
const spineColors = ['#2980b9', '#27ae60', '#8e44ad', '#f39c12', '#16a085', '#d35400'];

const belt = document.querySelector('#toa-a #conveyor-container');
const btnStartToaA = document.querySelector('#toa-a #toa-a-start-btn');
if (btnStartToaA) btnStartToaA.addEventListener('click', startToaAGame);

function startToaAGame() {
    document.querySelector('#toa-a #start-screen-toa-a').style.display = 'none';
    document.querySelector('#toa-a #game-screen-toa-a').classList.remove('hidden');

    score = 0; lives = 3; timeElapsed = 0; currentSpeed = 10; spawnRate = 3000;
    updateHUD();
    
    document.querySelectorAll('.conveyor-book').forEach(b => b.remove());
    document.querySelectorAll('.spines-container').forEach(c => c.innerHTML = '');

    startGameLoops();
    setupDropZones();
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
        book.innerText = `TẠ\n(${randCode})`;
        book.draggable = false;
        book.dataset.clicks = 3;
        book.dataset.code = randCode;
        
        book.addEventListener('click', function() {
            let clk = parseInt(this.dataset.clicks) - 1;
            this.dataset.clicks = clk;
            this.innerText = `TẠ\n(${clk})`;
            if (clk <= 0) {
                this.draggable = true;
                this.style.background = '#2ecc71'; 
                this.innerText = randCode;
            }
        });
    } else { 
        // SÁCH THƯỜNG
        book.classList.add('book-normal');
        book.innerText = randCode;
        book.draggable = true;
        book.dataset.code = randCode;
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
    
    book.style.animationPlayState = 'running';

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
                score += 10;
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
}

function gameOver(reason) {
    clearInterval(gameInterval); clearInterval(difficultyInterval); clearInterval(timerInterval);
    document.querySelectorAll('.conveyor-book').forEach(b => b.style.animationPlayState = 'paused');
    
    setTimeout(() => {
        alert(`GAME OVER!\nLý do: ${reason}\nĐiểm: ${score}\nThời gian: ${timeElapsed}s`);
        location.reload(); 
    }, 100);
}