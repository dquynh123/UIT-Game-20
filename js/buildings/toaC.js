// Database câu hỏi Tòa C (Đã bổ sung thêm nội dung đa dạng về UIT)
const allQuestions = [
    // Level 1: 1 điểm (Dễ)
    { q: "Màu áo truyền thống của sinh viên UIT là gì?", a: ["Trắng - Xanh dương", "Đỏ - Xanh dương", "Trắng - Xanh lá", "Vàng - Xanh dương"], correct: "Trắng - Xanh dương", level: 1 },
    { q: "UIT là thành viên của hệ thống đại học nào?", a: ["ĐHQG-HCM", "ĐH Đà Nẵng", "ĐH Huế", "ĐH Thái Nguyên"], correct: "ĐHQG-HCM", level: 1 },
    { q: "Cổng chính UIT nằm trên đường nào?", a: ["Xa lộ Hà Nội", "Nguyễn Du", "Hàn Thuyên", "Lê Duẩn"], correct: "Hàn Thuyên", level: 1 },
    { q: "Tòa nhà nào được khánh thành gần đây nhất?", a: ["Tòa E", "Tòa C", "Tòa B", "Tòa A"], correct: "Tòa E", level: 1 },
    { q: "UIT có bao nhiêu khoa đào tạo chính?", a: ["6 khoa", "4 khoa", "5 khoa", "7 khoa"], correct: "6 khoa", level: 1 },
    { q: "Đâu là tên một khoa tại UIT?", a: ["Kỹ thuật Phần mềm", "Kỹ thuật Xây dựng", "Kinh tế đối ngoại", "Luật quốc tế"], correct: "Kỹ thuật Phần mềm", level: 1 },
    { q: "Ký túc xá gần UIT nhất là?", a: ["KTX Khu B", "KTX Khu A", "KTX 135", "KTX Cỏ May"], correct: "KTX Khu B", level: 1 },

    // Level 3: 3 điểm (Trung bình)
    { q: "Thư viện UIT nằm ở tầng mấy của tòa nhà A?", a: ["Tầng 1", "Tầng 2", "Tầng 3", "Tầng 4"], correct: "Tầng 1", level: 3 },
    { q: "UIT thành lập vào ngày tháng năm nào?", a: ["08/06/2006", "10/05/2006", "20/11/2006", "30/04/2006"], correct: "08/06/2006", level: 3 },
    { q: "Tên tiếng Anh chính thức của UIT là gì?", a: ["University of Information Technology", "University of Computer Science", "IT University", "VNU-HCM University"], correct: "University of Information Technology", level: 3 },
    { q: "Slogan nổi tiếng của UIT là gì?", a: ["Khơi dậy tiềm năng", "Vững kiến thức, sáng tương lai", "Học tập vì ngày mai", "Tiên phong, sáng tạo, phụng sự"], correct: "Tiên phong, sáng tạo, phụng sự", level: 3 },
    { q: "Năm 2026 là kỷ niệm bao nhiêu năm thành lập UIT?", a: ["20 năm", "15 năm", "25 năm", "10 năm"], correct: "20 năm", level: 3 },
    { q: "Phòng Công tác Sinh viên nằm ở tòa nhà nào?", a: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"], correct: "Tòa A", level: 3 },

    // Level 5: 5 điểm (Khó)
    { q: "Khoa nào có số lượng sinh viên đông nhất UIT hiện nay?", a: ["KTPM", "KHMT", "HTTT", "MMT&TT"], correct: "KTPM", level: 5 },
    { q: "Linh vật chính thức (Mascot) của UIT là gì?", a: ["Gấu trúc (UIT Panda)", "Sói Xám", "Đại bàng", "Mèo máy"], correct: "Gấu trúc (UIT Panda)", level: 5 },
    { q: "Tòa nhà nào được mệnh danh là 'tòa nhà học thuật' cao nhất?", a: ["Tòa E", "Tòa C", "Tòa B", "Tòa A"], correct: "Tòa E", level: 5 },
    { q: "Đâu là tên giải bóng đá thường niên lớn nhất của UIT?", a: ["UIT Championship", "UIT Cup", "UIT League", "UIT Premier League"], correct: "UIT League", level: 5 },
    { q: "Hiệu trưởng đầu tiên của UIT là ai?", a: ["GS.TS. Nguyễn Thanh Sơn", "GS.TS. Trần Chí Đạo", "PGS.TS. Huỳnh Quyết Thắng", "GS.TS. Hoàng Kiếm"], correct: "GS.TS. Hoàng Kiếm", level: 5 }
];

let gameQuestions = [];
let currentIdx = 0;
let score = 0;
let timer;
let timeLeft = 10;
let canClick = true;

/**
 * Khởi tạo dữ liệu câu hỏi theo tỷ lệ 4-3-3
 */
function prepareQuestions() {
    const lv1 = allQuestions.filter(q => q.level === 1).sort(() => Math.random() - 0.5).slice(0, 4);
    const lv2 = allQuestions.filter(q => q.level === 3).sort(() => Math.random() - 0.5).slice(0, 3);
    const lv3 = allQuestions.filter(q => q.level === 5).sort(() => Math.random() - 0.5).slice(0, 3);
    
    gameQuestions = [...lv1, ...lv2, ...lv3].sort(() => Math.random() - 0.5);
    currentIdx = 0;
    score = 0;
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.innerText = score;
}

/**
 * Hiển thị câu hỏi lên màn hình
 */
function renderQuestion() {
    if (currentIdx >= gameQuestions.length) {
        endGame();
        return;
    }

    canClick = true;
    const data = gameQuestions[currentIdx];
    const qText = document.getElementById('question-text');
    const btnContainer = document.getElementById('answer-buttons');

    if (qText) qText.innerText = data.q;
    if (btnContainer) {
        btnContainer.innerHTML = '';
        let shuffledAnswers = [...data.a].sort(() => Math.random() - 0.5);
        
        shuffledAnswers.forEach(text => {
            const button = document.createElement('button');
            button.innerText = text;
            button.classList.add('answer-btn');
            button.onclick = () => checkAnswer(button, text, data.correct);
            btnContainer.appendChild(button);
        });
    }
    
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    const timerEl = document.getElementById('timer-display');
    if (timerEl) timerEl.innerText = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null, null, gameQuestions[currentIdx].correct);
        }
    }, 1000);
}

function checkAnswer(selectedBtn, selectedText, correctValue) {
    if (!canClick) return;
    canClick = false;
    clearInterval(timer);

    if (selectedText === correctValue) {
        if (selectedBtn) selectedBtn.classList.add('correct');
        score += gameQuestions[currentIdx].level;
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.innerText = score;
    } else {
        if (selectedBtn) selectedBtn.classList.add('wrong');
        const allBtns = document.querySelectorAll('.answer-btn');
        allBtns.forEach(btn => {
            if (btn.innerText === correctValue) btn.classList.add('correct');
        });
    }

    setTimeout(() => {
        currentIdx++;
        renderQuestion();
    }, 1500);
}

function endGame() {
    const qText = document.getElementById('question-text');
    const btnContainer = document.getElementById('answer-buttons');
    const quizContainer = document.querySelector('.quiz-container');
    const questionSection = document.querySelector('.question-section');

    // 1. Hiện thông báo kết thúc
    if (qText) {
        qText.innerHTML = `XUẤT SẮC!<br>Bạn đã hoàn thành Tòa C với ${score} điểm!`;
    }

    // 2. Xóa sạch các nút đáp án
    if (btnContainer) {
        btnContainer.innerHTML = ''; 
        btnContainer.style.display = 'none'; // Ẩn hẳn vùng chứa nút để không chiếm diện tích
    }

    // 3. ÉP KHUNG CHỈ CÒN MÀU XANH
    if (quizContainer && questionSection) {
        // Bo góc lại cho phần xanh vì lúc này nó là phần duy nhất còn lại
        questionSection.style.borderRadius = '25px'; 
        
        // Thu nhỏ chiều cao cái khung tổng lại cho vừa vặn với thông báo
        quizContainer.style.height = '350px'; 
        
        // Loại bỏ phần nền trắng (nếu có) bằng cách ép border-radius đồng bộ
        quizContainer.style.borderRadius = '25px';
    }

    // 4. Kích hoạt pháo hoa (giữ nguyên code cũ của bạn)
    var duration = 3 * 1000; 
    var end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3742fa', '#7158e2'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3742fa', '#7158e2'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // 👇 THÊM ĐOẠN CODE CHUYỂN TÒA VÀO ĐÂY 👇
    setTimeout(() => {
        // 1. Ẩn Tòa C đi
        document.querySelector('#toa-c').style.display = 'none';
        
        // 2. Hiện Tòa D lên
        const toaD = document.querySelector('#toa-d');
        if (toaD) {
            toaD.style.display = 'block';
            
            // 3. Khởi động game Tòa D (Hỏi team xem hàm chạy Tòa D tên là gì thì bỏ dấu // ở trước đi nhé)
            // startToaDGame(); 
        }
    }, 3500); // Hẹn giờ 3.5 giây (Để pháo hoa bắn 3s xong, ngắm thêm 0.5s rồi mới qua màn)
}

/**
 * Hệ thống tự động kích hoạt khi Tòa C được hiển thị
 */
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (mutation.target.style.display === "block") {
                console.log("🚀 Tòa C kích hoạt!");
                prepareQuestions();
                renderQuestion();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toaCNode = document.getElementById('toa-c');
    if (toaCNode) {
        observer.observe(toaCNode, { attributes: true });
    }
});