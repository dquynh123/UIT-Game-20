// js/main.js

// 1. Nhập khẩu logic của các tòa nhà
import './buildings/toaA.js';
import './buildings/toaE.js';

/**
 * Hàm điều phối: Hiển thị một tòa nhà và ẩn tất cả các tòa khác
 * @param {string} buildingId - ID của div tòa nhà muốn hiện (vd: 'toa-e')
 */
window.switchBuilding = (buildingId) => {
    const allBuildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    
    allBuildings.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Nếu trùng ID thì hiện (block), không trùng thì ẩn (none)
            element.style.display = (id === buildingId) ? 'block' : 'none';
        }
    });

    console.log(`📡 Hệ thống: Đã chuyển sang ${buildingId.toUpperCase()}`);
};

// 2. KHỞI ĐỘNG GAME: Bắt đầu với tòa E
// Khi vừa load trang, chúng ta muốn người chơi ở tòa E trước
document.addEventListener('DOMContentLoaded', () => {
    window.switchBuilding('toa-e');
});