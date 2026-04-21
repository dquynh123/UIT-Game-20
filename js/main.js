// js/main.js

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
            startGame(); 
        });
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

/**
 * Hiển thị một tòa nhà và ẩn tất cả các tòa khác (Kết hợp Fade cho mượt)
 */
window.switchBuilding = (buildingId) => {
    sceneTransition(() => {
        const allBuildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
        allBuildings.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = (id === buildingId) ? 'block' : 'none';
            }
        });
        console.log(`📡 Hệ thống: Đã chuyển sang ${buildingId.toUpperCase()}`);
    });
};

function startGame() {
    console.log("Trò chơi bắt đầu!");
    // Khởi đầu tại tòa E
    window.switchBuilding('toa-e');
}

// Khởi tạo mặc định khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo ban đầu các tòa nhà được setup đúng vị trí ẩn/hiện
    const allBuildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    allBuildings.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
});
