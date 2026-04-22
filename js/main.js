// js/main.js
import { playVN } from './dialogue.js';
// 1. Khai báo các thành phần giao diện
const mainMenu = document.getElementById('main-menu');
const nameScreen = document.getElementById('name-screen');
const gameScene = document.getElementById('game-scene');
const fadeOverlay = document.getElementById('fade-overlay'); // Lớp phủ đen

const startBtn = document.getElementById('main-start-btn'); 
const enterBtn = document.getElementById('enter-btn');
const userInput = document.getElementById('user-name');

// HỆ THỐNG ĐIỀU PHỐI CHUYỂN CẢNH (DÙNG CHUNG TOÀN GAME)
/**
 * @param {Function} action - Hành động thực hiện khi màn hình đã tối đen
 */
function sceneTransition(action) {
    // 1. Hiện lớp phủ đen (Fade Out)
    fadeOverlay.classList.add('active');

    // 2. Chờ màn hình đen hẳn (0.8s theo CSS) rồi thực hiện đổi nội dung
    setTimeout(() => {
        if (typeof action === 'function') action();

        // 3. Ẩn lớp phủ đen (Fade In màn hình mới)
        setTimeout(() => {
            fadeOverlay.classList.remove('active');
        }, 200); // Khoảng nghỉ ngắn
    }, 800);
}

// LOGIC MÀN HÌNH CHÍNH & NHẬP TÊN
// Chuyển từ Menu chính sang Màn nhập tên (Dùng hiệu ứng Slide + Fade cũ)

startBtn.addEventListener('click', () => {

    mainMenu.classList.add('fade-out-left');
    setTimeout(() => {

        mainMenu.style.display = 'none';

        nameScreen.classList.remove('hidden');

        userInput.focus();

    }, 800);

});



// Hàm xử lý khi vào Game (Sử dụng hệ thống Fade đen mới)

function handleStartGame() {
    const userName = userInput.value.trim();

    if (userName !== "") {
        localStorage.setItem('currentPlayerName', userName);
        
        // Gọi hệ thống chuyển cảnh mờ dần sang màn chơi game
        sceneTransition(() => {
            nameScreen.classList.add('hidden'); 
            gameScene.classList.remove('hidden'); 
            console.log("Người chơi:", localStorage.getItem('currentPlayerName'));
            window.startGame(); 
        });
        try {
            // 1. Lấy danh sách cũ từ kho lưu trữ
            let savedData = localStorage.getItem('allPlayers');
            let playerList = [];
            
            try {
                playerList = savedData ? JSON.parse(savedData) : [];
                if (!Array.isArray(playerList)) playerList = [];
            } catch (e) {
                playerList = [];
            }

            // 2. KIỂM TRA TRÙNG TÊN
            const isDuplicate = playerList.some(player => player.name.toLowerCase() === userName.toLowerCase());

            if (isDuplicate) {
                alert("Tên này đã có người sử dụng rồi, bạn chọn tên khác nhé!");
                userInput.value = ""; 
                userInput.focus();
                return; // Dừng lại, không cho vào game
            }

            // 3. Nếu không trùng, tiến hành lưu thông tin
            localStorage.setItem('currentPlayerName', userName);
            
            const newSession = {
                name: userName,
                score: 0,
                time: new Date().toLocaleString(),
                timestamp: Date.now() 
            };

            playerList.push(newSession);
            localStorage.setItem('allPlayers', JSON.stringify(playerList));
            localStorage.setItem('currentSessionId', newSession.timestamp);

            // 4. Hiệu ứng chuyển cảnh vào game
            sceneTransition(() => {
                nameScreen.classList.add('hidden'); 
                gameScene.classList.remove('hidden'); 
                console.log("Người chơi hiện tại:", userName);
                startGame(); 
            });

        } catch (err) {
            console.error("Lỗi hệ thống:", err);
            // Nếu có lỗi lưu trữ, vẫn cho người dùng vào game để tránh kẹt nút
            sceneTransition(() => {
                nameScreen.classList.add('hidden'); 
                gameScene.classList.remove('hidden'); 
                startGame(); 
            });
        }
    } else {
        alert("Vui lòng nhập tên để lưu ký ức nhé!");
    }
}

enterBtn.addEventListener('click', handleStartGame);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleStartGame();
});

// LOGIC QUẢN LÝ TÒA NHÀ & GAMEPLAY

import './buildings/toaA.js';
import './buildings/toaE.js';
import './buildings/toaC.js';
import './buildings/toaD.js'; 

/**
 * Hiển thị một tòa nhà và ẩn tất cả các tòa khác (Kết hợp Fade cho mượt)
 */
window.switchBuilding = (buildingId) => {
    sceneTransition(() => {
        const allBuildings = ['vn-screen','toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
        allBuildings.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = (id === buildingId) ? 'block' : 'none';
            }
        });
        console.log(`📡 Hệ thống: Đã chuyển sang ${buildingId.toUpperCase()}`);
    });
};

//VISUAL NOVEL ==================
window.startGame = function() {
    console.log("Trò chơi bắt đầu! Đang tải kịch bản test...");
    
    const testStory = [
        {
            id: "test_01",
            name: "",
            text: "Đây là màn hình test hệ thống Visual Novel của team...",
            bg: "",
            sprite: "",
            nextId: "test_02"
        },
        {
            id: "test_02",
            name: "Sinh viên ATTT Tài năng",
            text: "Chào {PLAYER}, nhìn anh có vẻ đã 'tốt nghiệp' từ lâu rồi nhỉ? Anh đã làm xong minigame băng chuyền chưa?",
            bg: "",
            sprite: "assets/images/chibi.png", // Bạn có thể xóa dòng này nếu không muốn hiện cái đầu
            nextId: "test_03"
        },
        {
            id: "test_03",
            name: "{PLAYER}",
            text: "Tôi chưa làm xong, code còn đang lỗi tè le đây này! Giúp tôi fix bug để tôi qua Tòa A với!",
            bg: "",
            sprite: "assets/images/test_main.png",
            nextId: "test_04" // 👉 KHÔNG DÙNG CHOICES NỮA, TRỎ THẲNG SANG CÂU TIẾP THEO
        },
        {
            id: "test_04",
            name: "Sinh viên ATTT Tài năng",
            text: "Ok ông anh. Fix xong rồi đó, anh đi thẳng qua sảnh Tòa A nhé. Chúc may mắn!",
            bg: "",
            sprite: "assets/images/chibi.png",
            nextId: "end_test" // 👉 TRỎ THẲNG ĐẾN KẾT THÚC
        },
        {
            id: "end_test",
            name: "Hệ thống",
            text: "[Hệ thống] Đang chuyển cảnh sang Minigame Tòa A...",
            bg: "",
            sprite: "assets/images/test_main.png",
            nextId: null // Bắt buộc phải có null ở câu cuối để game biết đường tắt hộp thoại
        }
    ];

    playVN(testStory, "test_01", () => {
        console.log("Hết hội thoại! Chuyển sang Tòa E...");
        window.switchBuilding('toa-e'); 
    });
};

// Khởi tạo mặc định khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo ban đầu các tòa nhà được setup đúng vị trí ẩn/hiện
    const allBuildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    allBuildings.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
});
