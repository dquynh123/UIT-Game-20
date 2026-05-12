const StoryToaD = [
    {
        id: "test_01",
        name: "",
        text: "Main bước ra từ hành lang Tòa B, tay cầm chìa khóa Tòa D vừa nhận được.",
        bg: "",
        sprite: "",
        nextId: "test_02"
    },

    {
        id: "test_02",
        name: "{PLAYER}",
        text: "Tòa D… hồi xưa toàn lên đây họp Đoàn, làm báo cáo, phát động phong trào. Mà sao giờ vắng lặng thế này?",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_03"
    },

    {
        id: "test_03",
        name: "Bí thư đoàn",
        text: "Anh… anh có phải là anh {PLAYER} không ạ? Hồi trước làm Bí thư Đoàn khoa CNPM ấy?",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_04"
    },

    {
        id: "test_04",
        name: "{PLAYER}",
        text: "Ủa, em biết anh? Anh nhìn em… cũng quen mắt nhưng mà chưa nhớ ra.",
        bg: "",
        sprite: "assets/images/test_main.png",
        nextId: "test_05"
    },

    {
        id: "test_05",
        name: "Bí thư đoàn",
        text: "Trời ạ, đúng anh thật rồi! Em tên Vũ, khoá… 2022 ạ! Hồi em năm nhất, anh đang năm bốn. Hôm đó anh ngầu lắm. Anh không nhớ em, nhưng em nhớ anh rõ lắm ý",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_06"
    },

    {
        id: "test_06",
        name: "{PLAYER}",
        text: "À Vũ à, anh nhớ ra rồi.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_07"
    },

    {
        id: "test_07",
        name: "Bí thư Vũ",
        text: "Dạ, hôm nay là ngày Chủ Nhật Xanh của trường, lẽ ra có mười mấy đứa tình nguyện viên. Mà tự nhiên sáng nay tụi nó kêu mưa, kêu nắng, rồi đứa thì ngủ quên… cuối cùng chỉ còn một mình em.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_08"
    },
    {
        id: "test_08",
        name: "Bí thư Vũ",
        text: "Cái sân này, em quét từ 7h sáng, quét mãi không hết, vì gió cứ thổi lá từ khắp nơi sang.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_09"
    },
    {
        id: "test_09",
        name: "Bí thư Vũ",
        text: "Mới nãy em còn tự nhủ: “Giá mà hồi xưa anh {PLAYER} còn làm Bí thư, chắc ảnh kéo cả đội đến giúp”.",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_10"
    },
    {
        id: "test_10",
        name: "{PLAYER}",
        text: "Em nịnh đấy à? Mà em có thấy cái gì lấp lánh ở đây không?",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_11"
    },
    {
        id: "test_11",
        name: "Bí thư Vũ",
        text: "Dạ không ạ. Anh giúp em một tay với, em còn deadline DEVO Challenge nữa huhu",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_12"
    },
    {
        id: "test_12",
        name: "",
        text: "Bỗng nhiên, những chiếc lá khô trên sân bắt đầu phát sáng nhè nhẹ",
        bg: "",
        sprite: "",
        nextId: "test_13"
    },
    {
        id: "test_13",
        name: "{PLAYER}",
        text: "Ủa khoan...",
        bg: "",
        sprite: "assets/images/chibi.png",
        nextId: "test_14"
    },
    {
        id: "test_14",
        name: "Người hướng dẫn",
        text: "Chào mừng cựu sinh viên đã đến với Tòa D. ^ ^ lại một mini game nhỏ nữa đây một bàn phím ảo xuất hiện, và anh phải gõ nhanh những từ ngữ xuất hiện trên màn hình. Mỗi từ đúng, một chiếc lá thật ngoài sân biến mất. Anh có 2 phút, chơi không?",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: null
    }
];

// ==========================================
// 2. HÀM CHUYỂN CẢNH (THOẠI -> GAME TÒA D)
// ==========================================
function transitionToToaD() {
    // Ẩn Tòa B đi
    document.getElementById('toa-b').style.display = 'none';

    // Chạy máy đọc kịch bản Tòa D
    if (typeof window.playVN === 'function') {
        window.playVN(StoryToaD, "test_01", () => {
            console.log("Đã đọc xong thoại Tòa D. Mở giao diện Tòa D...");
            
            // Ẩn vn-screen, hiển thị toa-d trực tiếp
            const vnScreen = document.getElementById('vn-screen');
            const toaD = document.getElementById('toa-d');
            
            if (vnScreen) vnScreen.style.display = 'none';
            if (toaD) toaD.style.display = 'block';
            
            // === ĐOẠN SỬA MỚI: CHỈ BẬT MÀN HÌNH START, KHÔNG TỰ CHẠY GAME ===
            const startScreenD = document.getElementById('start-screen-toa-d');
            const gameScreenD = document.getElementById('game-screen-toa-d');
            
            // Đảm bảo Màn hình Start hiện ra, và Màn hình Game bị ẩn đi
            if (startScreenD) startScreenD.classList.remove('hidden');
            if (gameScreenD) gameScreenD.classList.add('hidden');
            
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

    let toaB_Instance = null;

    // Khi bấm "BẮT ĐẦU" -> Chuyển thẳng vào game (bỏ màn hình hướng dẫn)
    if (btnStartB) {
        btnStartB.addEventListener('click', () => {
            startScreenB.classList.add('hidden');
            gameScreenB.classList.remove('hidden');
            
            // Chỉ khởi tạo game 1 lần duy nhất
            if (!toaB_Instance) {
                toaB_Instance = new ToaBGame('game-container');
                toaB_Instance.startGame();
            } else {
                // Nếu đã có instance rồi (chơi lại), thì gọi hàm reset
                toaB_Instance.currentRound = 0;
                toaB_Instance.drl = 0;
                toaB_Instance.startGame();
            }
        });
    }
});