const StoryToaD = [
    {
        id: "d_01",
        name: "",
        text: "{PLAYER} bước ra từ hành lang Tòa B, tay cầm chìa khóa Tòa D vừa nhận được.",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: "d_02"
    },

    {
        id: "d_02",
        name: "{PLAYER}",
        text: "Tòa D… hồi xưa toàn lên đây họp Đoàn, làm báo cáo, phát động phong trào. Mà sao giờ vắng lặng thế này?",
        bg: "",
        voice: "assets/voice/toaD/1.ogg",
        sprite: "assets/images/Main.png",
        nextId: "d_03"
    },

    {
        id: "d_03",
        name: "Bí thư đoàn",
        text: "Anh… anh có phải là anh {PLAYER} không ạ? Hồi trước làm Bí thư Đoàn khoa CNPM ấy?",
        bg: "",
        voice: "assets/voice/toaD/2.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_04"
    },

    {
        id: "d_04",
        name: "{PLAYER}",
        text: "Ủa, em biết anh? Anh nhìn em… cũng quen mắt nhưng mà chưa nhớ ra.",
        bg: "",
        voice: "assets/voice/toaD/3.ogg",
        sprite: "assets/images/Main.png",
        nextId: "d_05"
    },

    {
        id: "d_05",
        name: "Bí thư đoàn",
        text: "Trời ạ, đúng anh thật rồi! Em tên Vũ, khoá… 2022 ạ! Hồi em năm nhất, anh đang năm bốn. Hôm đó anh ngầu lắm. Anh không nhớ em, nhưng em nhớ anh rõ lắm ý.",
        bg: "",
        voice: "assets/voice/toaD/4.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_06"
    },

    {
        id: "d_06",
        name: "{PLAYER}",
        text: "À Vũ à, anh nhớ ra rồi.",
        bg: "",
        voice: "assets/voice/toaD/5.ogg",
        sprite: "assets/images/Main.png",
        nextId: "d_07"
    },

    {
        id: "d_07",
        name: "Bí thư Vũ",
        text: "Dạ, hôm nay là ngày Chủ Nhật Xanh của trường, lẽ ra có mười mấy đứa tình nguyện viên. Mà tự nhiên sáng nay tụi nó kêu mưa, kêu nắng, rồi đứa thì ngủ quên… cuối cùng chỉ còn một mình em.",
        bg: "",
        voice: "assets/voice/toaD/6.1.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_08"
    },
    {
        id: "d_08",
        name: "Bí thư Vũ",
        text: "Cái sân này, em quét từ 7h sáng, quét mãi không hết, vì gió cứ thổi lá từ khắp nơi sang.",
        bg: "",
        voice: "assets/voice/toaD/6.2.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_09"
    },
    {
        id: "d_09",
        name: "Bí thư Vũ",
        text: "Mới nãy em còn tự nhủ: “Giá mà hồi xưa anh {PLAYER} còn làm Bí thư, chắc ảnh kéo cả đội đến giúp”.",
        bg: "",
        voice: "assets/voice/toaD/6.3.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_10"
    },
    {
        id: "d_10",
        name: "{PLAYER}",
        text: "Em nịnh đấy à? Mà em có thấy cái gì lấp lánh ở đây không?",
        bg: "",
        voice: "assets/voice/toaD/7.ogg",
        sprite: "assets/images/Main.png",
        nextId: "d_11"
    },
    {
        id: "d_11",
        name: "Bí thư Vũ",
        text: "Dạ không ạ. Anh giúp em một tay với, em còn deadline DEVO Challenge nữa huhu.",
        bg: "",
        voice: "assets/voice/toaD/8.ogg",
        sprite: "assets/images/bithu.png",
        nextId: "d_12"
    },
    {
        id: "d_12",
        name: "",
        text: "Bỗng nhiên, những chiếc lá khô trên sân bắt đầu phát sáng nhè nhẹ.",
        bg: "",
        sprite: "",
        nextId: "d_13"
    },
    {
        id: "d_13",
        name: "{PLAYER}",
        text: "Ủa khoan...",
        bg: "",
        voice: "assets/voice/toaD/9.ogg",
        sprite: "assets/images/Main.png",
        nextId: "d_14"
    },
    {
        id: "d_14",
        name: "Người hướng dẫn",
        text: "Chào mừng cựu sinh viên đã đến với Tòa D. ^ ^ lại một mini game nhỏ nữa đây một bàn phím ảo xuất hiện, và anh phải gõ nhanh những từ ngữ xuất hiện trên màn hình. Mỗi từ đúng, một chiếc lá thật ngoài sân biến mất. Anh có 2 phút, chơi không?",
        bg: "",
        voice: "assets/voice/toaD/10.ogg",
        sprite: "",
        noSkip: true,
        nextId: null
    }
];
window.StoryToaD = StoryToaD;
// ==========================================
// 2. HÀM CHUYỂN CẢNH (THOẠI -> GAME TÒA D)
// ==========================================
function transitionToToaD() {
    let overlay = document.getElementById('fade-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'fade-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'black', zIndex: '10000', opacity: '0',
            transition: 'opacity 0.6s ease-in-out', pointerEvents: 'none'
        });
        document.body.appendChild(overlay);
    }

    const vnScreen = document.getElementById('vn-screen');
    const toaB = document.getElementById('toa-b');

    if (typeof window.playVN === 'function') {
        if (vnScreen) vnScreen.style.display = 'flex';

        window.playVN(StoryToaD, "d_01", () => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';

            setTimeout(() => {
                
                document.body.style.backgroundColor = 'black'; 
                
                const startScreenD = document.getElementById('start-screen-toa-d');
                if (startScreenD) {
                    startScreenD.style.backgroundColor = 'black'; // Ép nền đen cho màn Start
                    startScreenD.classList.remove('hidden');
                }

                if (toaB) toaB.style.display = 'none';
                if (typeof window.switchBuilding === 'function') {
                    window.switchBuilding('toa-d');
                }
                if (vnScreen) vnScreen.style.display = 'none';
                if (document.getElementById('game-screen-toa-d')) {
                    document.getElementById('game-screen-toa-d').classList.add('hidden');
                }

                // --- SAVE GAME ---
                if (window.saveGameData) {
                    window.saveGameData({
                        currentBuilding: 'toa-d',
                        currentStep: 'START_GAME_D'
                    });
                }

                setTimeout(() => {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        document.body.style.backgroundColor = ''; 
                    }, 1000);
                }, 500); 

            }, 600); 
        });
    }
}

const COURSE_LIST = [
    "SS003 - Tư tưởng Hồ Chí Minh", "SS007 - Triết học Mác - Lênin", "SS008 - Kinh tế chính trị Mác - Lênin", 
    "SS009 - Chủ nghĩa xã hội khoa học", "SS010 - Lịch sử Đảng Cộng sản Việt Nam", "SS006 - Pháp luật đại cương", 
    "MA006 - Giải tích", "MA003 - Đại số tuyến tính", "MA004 - Cấu trúc rời rạc", "MA005 - Xác suất thống kê", 
    "IT001 - Nhập môn Lập trình", "PE231 - Giáo dục thể chất 1", "PE232 - Giáo dục thể chất 2", 
    "IT002 - Lập trình hướng đối tượng", "IT003 - Cấu trúc dữ liệu và giải thuật", "IT004 - Cơ sở dữ liệu", 
    "IT005 - Nhập môn mạng máy tính", "IT007 - Hệ điều hành", "IT012 - Tổ chức và cấu trúc máy tính II", 
    "IT008 - Lập trình trực quan", "SE100 - Phương pháp phát triển phần mềm hướng đối tượng", 
    "SE104 - Nhập môn công nghệ phần mềm", "SE359 - DevOps trong Phát triển Phần mềm", 
    "SE102 - Nhập môn phát triển game", "SE115 - Phát triển game với Unity", 
    "SE116 - Phát triển kỹ năng lập trình Game ứng dụng trong thực tế", "SE114 - Nhập môn ứng dụng di động", 
    "SE360 - Điện toán đám mây và phát triển ứng dụng hướng dịch vụ", 
    "SE301 - Phát triển phần mềm mã nguồn mở", "SE330 - Ngôn ngữ lập trình Java", "SE332 - Chuyên đề CSDL nâng cao", 
    "SE334 - Các phương pháp lập trình", "SE347 - Công nghệ Web và ứng dụng", "SE350 - Chuyên đề E-learning", 
    "SE343 - Công nghệ Portal", "SE357 - Kỹ thuật phân tích yêu cầu", "SE325 - Chuyên đề J2EE", 
    "SE101 - Phương pháp mô hình hóa", "SE106 - Đặc tả hình thức", "SE214 - Công nghệ phần mềm chuyên sâu", 
    "SE314 - Công nghệ game 3D", "SE409 - Phát triển dự án Game"
];

// Cấu hình 4 vòng chơi
const ROUNDS_CONFIG = [
    { grid: 2, totalCards: 4, wishlistCount: 2, memorizeTime: 4000, playTime: 6 },  // Vòng 1: chỉ 2 môn
    { grid: 3, totalCards: 9, wishlistCount: 4, memorizeTime: 8000, playTime: 12 }, // Vòng 2: chỉ 4 môn
    { grid: 4, totalCards: 16, wishlistCount: 6, memorizeTime: 12000, playTime: 18 }, // Vòng 3: chỉ 6 môn
    { grid: 5, totalCards: 25, wishlistCount: 8, memorizeTime: 30000, playTime: 24 } // Vòng 4: chỉ 8 môn
];

class ToaBGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentRound = 0;
        this.drl = 0;
        this.isPlaying = false;
        this.timer = null;
        this.timeLeft = 0;
        this.wishlist = [];
        this.foundCount = 0;
        
        this.buildHTML();
        // Don't auto-start! Wait for user to click play button
    }

    // Start the game when user clicks play button
    startGame() {
        this.startRound();
    }

    buildHTML() {
        this.container.innerHTML = `
            <div id="toaB-game-wrapper">
                <div id="board-section">
                    <h2>ĐĂNG KÝ HỌC PHẦN</h2>
                    <div id="msg-overlay">Chuẩn bị...</div>
                    <div id="grid-container"></div>
                </div>
                <div id="ui-section">
                    <div class="status-bar">
                        <h2>Vòng: <span id="ui-round">1/4</span></h2>
                        <h2>ĐRL: <span id="ui-drl" class="highlight">0</span></h2>
                        <h2>Thời gian: <span id="ui-time">0</span>s</h2>
                    </div>
                    <div id="wishlist-container">
                        <h3>Wishlist Đăng ký</h3>
                        <div id="wishlist-items"></div>
                    </div>
                </div>
            </div>
        `;
    }

    startRound() {
        if (this.currentRound >= ROUNDS_CONFIG.length) {
            this.endGame();
            return;
        }

        const config = ROUNDS_CONFIG[this.currentRound];
        this.isPlaying = false;
        this.foundCount = 0;
        
        document.getElementById('ui-round').innerText = `${this.currentRound + 1}/4`;
        document.getElementById('ui-time').innerText = config.playTime;
        let countdownTime = config.memorizeTime / 1000;
        document.getElementById('msg-overlay').innerText = `Hãy ghi nhớ vị trí môn học trong ${countdownTime}s!`;

        const countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime > 0) {
          document.getElementById('msg-overlay').innerText = `Hãy ghi nhớ vị trí môn học trong ${countdownTime}s!`;
        }
}, 1000);

        // 1. Random chọn môn học cho bàn cờ
        let shuffledCourses = [...COURSE_LIST].sort(() => 0.5 - Math.random());
        let boardCourses = shuffledCourses.slice(0, config.totalCards);
        
        // 2. Random chọn wishlist từ các môn đã có trên bàn cờ
        let shuffledBoard = [...boardCourses].sort(() => 0.5 - Math.random());
        this.wishlist = shuffledBoard.slice(0, config.wishlistCount);

        this.renderWishlist();
        this.renderBoard(boardCourses, config.grid);

        // Hiển thị thẻ lúc đầu (ngửa)
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.add('flipped'));

        // When flipping cards after memorize time:
        setTimeout(() => {
            clearInterval(countdownInterval);
            cards.forEach(card => card.classList.remove('flipped'));
            this.startGameplay(config.playTime);
        }, config.memorizeTime);
    }

    renderBoard(courses, gridCols) {
        const grid = document.getElementById('grid-container');
        grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        grid.innerHTML = '';

        courses.forEach((course, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.course = course;
            
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back"><div class="subject-id">${course.split(' - ')[0]}</div><div class="subject-name">${course.split(' - ')[1]}</div></div>
                </div>
            `;

            cardElement.addEventListener('click', () => this.handleCardClick(cardElement, course));
            grid.appendChild(cardElement);
        });
    }

    renderWishlist() {
        const container = document.getElementById('wishlist-items');
        container.innerHTML = '';
        this.wishlist.forEach(course => {
            const item = document.createElement('div');
            item.className = 'wishlist-item';
            item.id = `wl-${this.getCleanId(course)}`;
            item.innerText = course;
            container.appendChild(item);
        });
    }

    getCleanId(str) {
        return str.replace(/[^a-zA-Z0-9]/g, '');
    }

    startGameplay(playTime) {
        this.isPlaying = true;
        this.timeLeft = playTime;
        document.getElementById('msg-overlay').innerText = "Nhanh tay lật đúng Wishlist!";
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('ui-time').innerText = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.finishRound("Hết giờ!");
            }
        }, 1000);
    }

    handleCardClick(card, course) {
        if (!this.isPlaying || card.classList.contains('flipped')) return;

        card.classList.add('flipped');

        if (this.wishlist.includes(course)) {
            // Lật Đúng
            card.classList.add('matched');
            this.drl += 10;
            this.foundCount++;
            
            const wlItem = document.getElementById(`wl-${this.getCleanId(course)}`);
            if(wlItem) wlItem.classList.add('found');

            this.updateUI();

            if (this.foundCount === this.wishlist.length) {
                clearInterval(this.timer);
                this.finishRound("Tuyệt vời! Đã đăng ký đủ môn.");
            }
        } else {
            // Lật Sai
            card.classList.add('wrong');
            this.drl -= 5;
            this.updateUI();

            // Tạm thời khóa thẻ khác và úp thẻ sai lại sau 1s
            this.isPlaying = false;
            setTimeout(() => {
                card.classList.remove('flipped', 'wrong');
                this.isPlaying = true;
            }, 800);
        }
    }

    updateUI() {
        const drlElement = document.getElementById('ui-drl');
        drlElement.innerText = this.drl;
        
        // Cập nhật màu sắc dựa trên điểm số
        if (this.drl < 0) {
            drlElement.style.color = "#e53e3e"; // Màu đỏ khi âm điểm
        } else {
            drlElement.style.color = "#38a169"; // Màu xanh lá khi >= 0
        }
    }

    finishRound(msg) {
        this.isPlaying = false;
        document.getElementById('msg-overlay').innerText = msg;
        
        // Đợi 2s rồi qua vòng
        setTimeout(() => {
            this.currentRound++;
            this.startRound();
        }, 2000);
    }

    endGame() {
        this.isPlaying = false;
        if(this.timer) clearInterval(this.timer);
        
        // Đảm bảo overall không bị âm
        this.drl = Math.max(0, this.drl);
        this.updateUI();
        if (window.UITGameStats) {
            window.UITGameStats.addScore("Tòa B", this.drl);
        }
        console.log("Kết thúc Tòa B. Hiện bảng tổng kết...");
        if (typeof window.showGlobalSummaryBoard === 'function') {
            window.showGlobalSummaryBoard("Tòa B", this.drl, 0, true, transitionToToaD);
        } else {
            transitionToToaD(); // Backup lỡ lỗi
        }
    }
}

// Cách gọi:
// Bạn chỉ cần tạo sẵn <div id="game-container"></div> trong file HTML chính
// Sau đó gọi: new ToaBGame('game-container');

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các element của Tòa B
    const startScreenB = document.getElementById('start-screen-toa-b');
    const gameScreenB = document.getElementById('game-screen-toa-b');
    const btnStartB = document.getElementById('toa-b-start-btn');

    // Đưa instance ra toàn cục để hệ thống có thể can thiệp
    window.toaB_Instance = null;

    // Khi bấm "BẮT ĐẦU" -> Chuyển thẳng vào game
    if (btnStartB) {
        btnStartB.addEventListener('click', () => {
            startScreenB.classList.add('hidden');
            gameScreenB.classList.remove('hidden');
            
            if (!window.toaB_Instance) {
                window.toaB_Instance = new ToaBGame('game-container');
                window.toaB_Instance.startGame();
            } else {
                // Nếu đã có instance rồi (chơi lại / reset), thì dọn dẹp bộ đếm giờ cũ
                if (window.toaB_Instance.timer) clearInterval(window.toaB_Instance.timer);
                window.toaB_Instance.currentRound = 0;
                window.toaB_Instance.drl = 0;
                window.toaB_Instance.startGame();
            }
        });
    }
});

// ==========================================
// HÀM RESET TÒA B KHI LOAD GAME
// ==========================================
window.resetToaB = function() {
    // 1. Tắt game đang chạy dở
    if (window.toaB_Instance) {
        window.toaB_Instance.isPlaying = false;
        if (window.toaB_Instance.timer) clearInterval(window.toaB_Instance.timer);
    }

    // 2. Bật lại màn hình Start chờ người chơi
    const startScreenB = document.getElementById('start-screen-toa-b');
    const gameScreenB = document.getElementById('game-screen-toa-b');
    if (startScreenB) startScreenB.classList.remove('hidden');
    if (gameScreenB) gameScreenB.classList.add('hidden');
};