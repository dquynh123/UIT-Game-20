const vnScreen = document.getElementById('vn-screen');
const vnBg = document.getElementById('vn-background');
const vnSprite = document.getElementById('vn-sprite');
const vnName = document.getElementById('speaker-name');
const vnText = document.getElementById('dialogue-text');
const dialogueBox = document.getElementById('dialogue-box');
const choiceContainer = document.getElementById('choice-container');
const nextIndicator = document.getElementById('next-indicator');

let storyMap = {}; 
let currentLineId = null;
let isTyping = false;
let typeInterval;
let onStoryComplete = null;
let isWaitingForChoice = false;
let startLineTimeout = null;

let isAutoMode = false;
let isSkipMode = false;
let autoTimeout = null;
let skipInterval = null;
let dialogueHistory = []; // Cuốn sổ ghi chép lịch sử
let typingSpeed = 30;
let bgmVolume = 1.0; 
let voiceVolume = 1.0;


export function playVN(storyArray, startId, callback) {
    clearInterval(typeInterval);
    if (startLineTimeout) {
        clearTimeout(startLineTimeout);
        startLineTimeout = null;
    }
    storyMap = {};
    storyArray.forEach(line => { storyMap[line.id] = line; });
    currentLineId = startId;
    onStoryComplete = callback;

    if (vnSprite) vnSprite.classList.add('hidden');
    if (vnName) vnName.style.display = 'none';
    if (vnText) vnText.innerHTML = '';
    
    // 1. ÉP BẬT MÀN HÌNH HỘI THOẠI LÊN NGAY
    const vnScreen = document.getElementById('vn-screen');
    if (vnScreen) {
        vnScreen.style.display = 'block';
    }
    
    // 2. ÉP TẮT TẤT CẢ TÒA NHÀ KHÁC
    const buildings = ['toa-a', 'toa-b', 'toa-c', 'toa-d', 'toa-e'];
    buildings.forEach(id => {
        let el = document.getElementById(id);
        if(el) el.style.display = 'none';
    });

    // 3. Hiện chữ (chặn race-condition khi người chơi click rất sớm)
    const initialLineId = startId;
    startLineTimeout = setTimeout(() => {
        startLineTimeout = null;
        if (currentLineId === initialLineId && !isTyping && vnText && vnText.innerHTML === '') {
            showLine(initialLineId);
        }
    }, 200);
    dialogueHistory = []; // Xóa trắng sổ tay khi bắt đầu cảnh VN mới
}

function showLine(lineId) {
    clearInterval(typeInterval);
    const line = storyMap[lineId];
    if (!line) { 
        if (onStoryComplete) {
            const tempCb = onStoryComplete;
            onStoryComplete = null; // THÊM DÒNG NÀY (Xóa trí nhớ callback)
            tempCb();
        }
        return;
    }
    // BỨC TƯỜNG CHỐNG SKIP: ÉP DỪNG Ở CÂU HƯỚNG DẪN
    if (line.noSkip) {
        if (isSkipMode || isAutoMode) {
            isSkipMode = false;
            isAutoMode = false; // Tắt luôn Auto để người chơi không bị trôi mất chữ
            
            // Cập nhật lại màu sắc của nút
            if (typeof updateMenuUI === 'function') updateMenuUI();
            
            // Xóa vòng lặp tua nhanh
            if (typeof skipInterval !== 'undefined') clearInterval(skipInterval);
            if (typeof autoTimeout !== 'undefined') clearTimeout(autoTimeout);
        }
    }
    currentLineId = lineId;

    choiceContainer.innerHTML = '';
    choiceContainer.classList.add('hidden');
    nextIndicator.style.display = 'block';
    isWaitingForChoice = false;

    let speaker = line.name;
    if (speaker === "") {
        // TRƯỜNG HỢP: Lời dẫn truyện (Tên rỗng)
        vnName.style.display = 'none'; // Ẩn luôn bảng tên
        vnText.classList.add('narration-text');
    } else {
        // TRƯỜNG HỢP: Có nhân vật nói chuyện
        if (speaker === "{PLAYER}") {
            speaker = localStorage.getItem('currentPlayerName') || "Main";
        }
        vnName.style.display = 'block'; // Bật bảng tên lên
        vnName.innerText = speaker;
        vnText.classList.remove('narration-text');
    }

    if (line.bg) vnBg.style.backgroundImage = `url(${line.bg})`;
    if (line.sprite) {
        // Kiểm tra xem có phải là đang đổi sang một nhân vật khác không
        // So sánh src hiện tại với src mới (dùng getAttribute để lấy đường dẫn tương đối gốc)
        if (vnSprite.getAttribute('src') !== line.sprite) {
            
            // 1. Áp hiệu ứng làm mờ và lùi lại cho nhân vật cũ
            vnSprite.classList.add('sprite-changing');
            
            // 2. Đợi 150 mili-giây (cho nhân vật cũ mờ hẳn) rồi mới đổi ảnh mới
            setTimeout(() => {
                vnSprite.src = line.sprite;
                // Xóa hiệu ứng mờ đi -> Nhân vật mới sẽ lướt vào và sáng lên
                vnSprite.classList.remove('sprite-changing');
                vnSprite.classList.remove('hidden');
            }, 150);
        } else {
            // Nếu vẫn là nhân vật cũ (ví dụ đổi biểu cảm), thì chỉ cần hiện bình thường
            vnSprite.classList.remove('hidden');
            vnSprite.classList.remove('sprite-changing');
        }
    } else {
        vnSprite.classList.add('hidden');
    }
    
    let rawText = line.text.replace(/{PLAYER}/g, localStorage.getItem('currentPlayerName') || "Main");
    dialogueHistory.push({ name: speaker, text: rawText });
    // 1. TẮT giọng nói của câu thoại ngay trước đó 
    if (window.currentVoice) {
        window.currentVoice.pause();       // Dừng phát
        window.currentVoice.currentTime = 0; // Tua về số 0
    }

    // 2. PHÁT giọng nói của câu mới này (nếu kịch bản có file voice)
    if (line.voice) {
        window.currentVoice = new Audio(line.voice);
        window.currentVoice.volume = voiceVolume; // Áp mức âm lượng từ Menu Cài đặt
        window.currentVoice.play().catch(e => console.log("Chưa thể phát giọng nói: ", e));
    }
    // 3. PHÁT HIỆU ỨNG ÂM THANH (SFX)
    if (line.sfx) {
        let sfxAudio = new Audio(line.sfx);
        
        // Mức âm lượng bắt đầu (mặc định là 100%, nếu kịch bản có yêu cầu thì chỉnh theo kịch bản)
        sfxAudio.volume = line.sfxVolume !== undefined ? line.sfxVolume : 1.0; 
        
        if (line.sfxLoop) {
            sfxAudio.loop = true;
        }

        // Lưu lại để lát nữa chuyển sang Minigame có thể gọi ra để tắt
        window.currentSFX = sfxAudio; 
        
        sfxAudio.play().catch(e => console.log("Chưa thể phát SFX: ", e));

        // 🌟 TÍNH NĂNG MỚI: TỰ ĐỘNG HẠ ÂM LƯỢNG (FADE) 🌟
        if (line.sfxFadeTo !== undefined) {
            // Chờ 2.5 giây (2500ms) để người chơi cảm nhận độ ồn
            setTimeout(() => {
                // Sau đó bắt đầu hạ nhỏ dần mỗi 150 mili-giây
                let fadeInterval = setInterval(() => {
                    if (sfxAudio.volume > line.sfxFadeTo) {
                        sfxAudio.volume = Math.max(line.sfxFadeTo, sfxAudio.volume - 0.05); // Giảm dần
                    } else {
                        clearInterval(fadeInterval); // Khi chạm mốc 15% thì giữ nguyên luôn
                    }
                }, 150); 
            }, 2500); 
        }
    }
    typeWriter(rawText, line);
}

function typeWriter(text, lineData) {
    clearInterval(typeInterval);
    isTyping = true;
    vnText.innerHTML = "";
    let charIndex = 0;

    typeInterval = setInterval(() => {
        vnText.innerHTML += text.charAt(charIndex);
        charIndex++;
        if (charIndex >= text.length) {
            clearInterval(typeInterval);
            isTyping = false;
            checkChoices(lineData); 
            
            // --- SỬA LỖI AUTO Ở ĐÂY ---
            if (isAutoMode && !isWaitingForChoice) {
                autoTimeout = setTimeout(() => {
                    if (isAutoMode) goNextLine(); // Gọi hàm qua câu thay vì mô phỏng click
                }, 1500);
            }
        }
    }, typingSpeed);
}
function checkChoices(lineData) {
    if (lineData.choices && lineData.choices.length > 0) {
        isWaitingForChoice = true;
        nextIndicator.style.display = 'none'; 
        choiceContainer.classList.remove('hidden');
        
        lineData.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'uit-choice-btn';
            btn.innerText = `> ${choice.text}`;
            btn.onclick = (e) => {       // SỬA THÀNH ONCLICK Ở ĐÂY
                e.stopPropagation(); 
                showLine(choice.nextId); 
            };
            choiceContainer.appendChild(btn);
        });
    }
}

// Hàm chuyên dụng để nhảy sang câu tiếp theo
function goNextLine() {
    const currentLine = storyMap[currentLineId];
    if (currentLine && currentLine.nextId) {
        showLine(currentLine.nextId);
    } else {
        // Trường hợp hết thoại
        if (onStoryComplete) {
            const tempCb = onStoryComplete;
            onStoryComplete = null; 
            tempCb();
        }
    }
}

dialogueBox.onclick = (e) => {
    if (isWaitingForChoice) return; 

    // Kiểm tra biến e.isTrusted: 
    // - true: Là con người thực sự dùng tay bấm chuột
    // - false: Là code tự động chạy
    if (e && e.isTrusted === true) {
        // Chỉ tắt Auto/Skip nếu NGƯỜI CHƠI TỰ TAY BẤM
        if (isAutoMode || isSkipMode) {
            isAutoMode = false;
            isSkipMode = false;
            updateMenuUI();
        }
    }

    if (autoTimeout) clearTimeout(autoTimeout);

    const currentLine = storyMap[currentLineId];
    if (!currentLine) return;
    
    if (isTyping) {
        clearInterval(typeInterval);
        vnText.innerHTML = currentLine.text.replace(/{PLAYER}/g, localStorage.getItem('currentPlayerName') || "Main");
        isTyping = false;
        checkChoices(currentLine);
        
        if (isAutoMode && !isWaitingForChoice) {
            autoTimeout = setTimeout(() => {
                if (isAutoMode) goNextLine();
            }, 1500);
        }
    } else {
        goNextLine(); // Thay vì showLine(...) thì gọi thẳng hàm tổng
    }
};

// ============================================================
// HỖ TRỢ PHÍM TẮT (ENTER / SPACE) ĐỂ CHUYỂN THOẠI
// ============================================================
document.addEventListener('keydown', function(event) {
    // 1. Kiểm tra xem màn hình hội thoại (VN Screen) có đang được bật hay không
    const vnScreen = document.getElementById('vn-screen');
    const isVnActive = vnScreen && vnScreen.style.display === 'block';

    // 2. Nếu đang trong game và người chơi bấm phím Enter (hoặc phím Cách - Space)
    if (isVnActive && (event.key === 'Enter' || event.code === 'Space')) {
        
        // Ngăn trình duyệt tự động cuộn trang khi bấm phím Space
        event.preventDefault(); 
        
        // 3. Chặn không cho ấn qua nếu đang có câu hỏi/lựa chọn hiện ra
        if (isWaitingForChoice) return;
        
        // 4. Kích hoạt y hệt như hành động click chuột vào khung thoại
        dialogueBox.click();
    }
});

// ============================================================
// HỆ THỐNG MENU ĐIỀU KHIỂN NHANH (QUICK MENU)
// ============================================================

// 1. NGĂN CHẶN LỖI CLICK NÚT MÀ BỊ NHẢY THOẠI
const quickMenuButtons = ['btn-log', 'btn-auto', 'btn-skip', 'btn-hide'];

quickMenuButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        // e.stopPropagation() là bùa chú giúp click vào nút thì chỉ nút nhận, 
        // không bị "thủng" xuống cái dialogue-box bên dưới
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
        });
    }
});

// 2. CODE TÍNH NĂNG NÚT [HIDE] - ẨN GIAO DIỆN
const btnHide = document.getElementById('btn-hide');
if (btnHide) {
    btnHide.onclick = (e) => {
        e.stopPropagation(); // Khóa nổi bọt
        
        // Ẩn hộp thoại đi một cách mượt mà
        dialogueBox.style.opacity = '0';
        dialogueBox.style.pointerEvents = 'none'; // Khóa click vào hộp thoại ẩn
        
        // Bật chế độ: Click vào bất cứ đâu trên màn hình thì hiện lại UI
        setTimeout(() => {
            const vnScreen = document.getElementById('vn-screen');
            
            const restoreUI = () => {
                dialogueBox.style.opacity = '1';
                dialogueBox.style.pointerEvents = 'auto';
                
                // Hiện xong thì gỡ sự kiện click này đi để game chạy bình thường lại
                vnScreen.removeEventListener('click', restoreUI);
            };
            
            vnScreen.addEventListener('click', restoreUI);
        }, 100); 
        // Dùng setTimeout 100ms để tránh việc cái click vào nút Hide vừa rồi 
        // bị tính luôn thành click để hiện lại UI
    };
}

// LOGIC CHO NÚT AUTO VÀ SKIP

const btnAuto = document.getElementById('btn-auto');
const btnSkip = document.getElementById('btn-skip');

// Hàm đổi màu nút khi bật/tắt (Bật lên thì sáng màu xanh lên)
function updateMenuUI() {
    if (btnAuto) {
        btnAuto.style.color = isAutoMode ? '#00d2ff' : 'rgba(255, 255, 255, 0.6)';
        btnAuto.style.textShadow = isAutoMode ? '0 0 10px rgba(0, 210, 255, 0.8)' : 'none';
    }
    if (btnSkip) {
        btnSkip.style.color = isSkipMode ? '#00d2ff' : 'rgba(255, 255, 255, 0.6)';
        btnSkip.style.textShadow = isSkipMode ? '0 0 10px rgba(0, 210, 255, 0.8)' : 'none';
    }
}

// BẤM NÚT AUTO
if (btnAuto) {
    btnAuto.onclick = (e) => {
        e.stopPropagation();
        isAutoMode = !isAutoMode; // Bật/Tắt Auto
        isSkipMode = false;       // Tắt Skip (nếu đang bật)
        updateMenuUI();

        // Nếu đang bật Auto mà chữ đã gõ xong, cho nó tự nhảy luôn
        if (isAutoMode && !isTyping && !isWaitingForChoice) {
            goNextLine();
        }
    };
}

// BẤM NÚT SKIP
if (btnSkip) {
    btnSkip.onclick = (e) => {
        e.stopPropagation();
        isSkipMode = !isSkipMode; // Bật/Tắt Skip
        isAutoMode = false;       // Tắt Auto (nếu đang bật)
        updateMenuUI();

        if (isSkipMode) {
            // Chạy vòng lặp tàng hình: Ép game click chuột liên tục mỗi 100ms
            skipInterval = setInterval(() => {
                if (isSkipMode && !isWaitingForChoice) {
                    // Gọi showLine thay vì click để vượt rào (bypass) hàm onclick khóa Auto ở trên
                    const currentLine = storyMap[currentLineId];
                    if (currentLine && currentLine.nextId) {
                         showLine(currentLine.nextId);
                    } else {
                         // Nếu hết thoại thì ấn cái cuối để kết thúc
                         dialogueBox.click();
                    }
                } else if (isWaitingForChoice) {
                    // GẶP CÂU HỎI LỰA CHỌN -> TỰ ĐỘNG PHANH GẤP TẮT SKIP
                    isSkipMode = false;
                    updateMenuUI();
                    clearInterval(skipInterval);
                }
            }, 80); // Tốc độ tua: 80 mili-giây qua 1 câu
        } else {
            clearInterval(skipInterval);
        }
    };
}

// ============================================================
// LOGIC CHO NÚT LOG (LỊCH SỬ)
// ============================================================
const btnLog = document.getElementById('btn-log');
const logScreen = document.getElementById('vn-log-screen');
const logContent = document.getElementById('log-content-area');
const closeLogBtn = document.getElementById('close-log-btn');

if (btnLog && logScreen) {
    btnLog.onclick = (e) => {
        e.stopPropagation();

        // 1. Tạm tắt Auto/Skip nếu đang chạy để người chơi đọc lịch sử cho yên tâm
        if (isAutoMode || isSkipMode) {
            isAutoMode = false;
            isSkipMode = false;
            updateMenuUI();
        }

        // 2. Xóa sạch rác trong bảng Log cũ
        logContent.innerHTML = '';

        // 3. Lôi cuốn sổ tay ra chép từng dòng vào bảng
        dialogueHistory.forEach(item => {
            const logDiv = document.createElement('div');
            logDiv.className = 'log-item';

            if (item.name === "") { // Lời dẫn truyện
                logDiv.innerHTML = `<div class="log-narration">${item.text}</div>`;
            } else { // Có tên nhân vật
                logDiv.innerHTML = `
                    <div class="log-name">${item.name}</div>
                    <div class="log-text">${item.text}</div>
                `;
            }
            logContent.appendChild(logDiv);
        });

        // 4. Bật sáng màn hình Log lên
        logScreen.classList.add('active');

        // 5. Tự động cuộn chuột xuống dòng dưới cùng (dòng mới nhất)
        setTimeout(() => {
            logContent.scrollTop = logContent.scrollHeight;
        }, 50);
    };

    // LOGIC NÚT DẤU X ĐỂ ĐÓNG BẢNG LOG
    closeLogBtn.onclick = (e) => {
        e.stopPropagation();
        logScreen.classList.remove('active');
    };
}

// ============================================================
// LOGIC CHO NÚT MENU / CÀI ĐẶT
// ============================================================
const btnMenu = document.getElementById('btn-menu');
const menuScreen = document.getElementById('vn-menu-screen');
const closeMenuBtn = document.getElementById('close-menu-btn');
const speedSlider = document.getElementById('text-speed-slider');
const bgmSlider = document.getElementById('bgm-volume-slider'); 
const voiceSlider = document.getElementById('voice-volume-slider'); 

if (btnMenu && menuScreen) {
    btnMenu.onclick = (e) => {
        e.stopPropagation();
        
        // Tắt Auto/Skip để người chơi rảnh tay chỉnh chọt
        if (isAutoMode || isSkipMode) {
            isAutoMode = false;
            isSkipMode = false;
            updateMenuUI();
        }

        // Bật bảng Menu lên
        menuScreen.classList.add('active');
    };

    closeMenuBtn.onclick = (e) => {
        e.stopPropagation();
        menuScreen.classList.remove('active');
    };

    // 1. Kéo thanh Tốc độ chữ
    if (speedSlider) {
        speedSlider.oninput = (e) => {
            typingSpeed = parseInt(e.target.value); 
        };
    }

    // 2. Kéo thanh Âm lượng Nhạc (BGM)
    if (bgmSlider) {
        bgmSlider.oninput = (e) => {
            // Giá trị slider từ 0-100, chia 100 để ra số 0.0 -> 1.0 cho Audio
            bgmVolume = parseInt(e.target.value) / 100;
            
            // MẸO: Nếu bạn có file nhạc nền tên là 'bgmAudio' đang phát, 
            // bạn có thể thêm dòng: if (bgmAudio) bgmAudio.volume = bgmVolume;
        };
    }

    // 3. Kéo thanh Âm lượng Giọng nói (Voice)
    if (voiceSlider) {
        voiceSlider.oninput = (e) => {
            voiceVolume = parseInt(e.target.value) / 100;
            
            // Cập nhật âm lượng ngay lập tức nếu nhân vật đang nói dở
            if (window.currentVoice) {
                window.currentVoice.volume = voiceVolume;
            }
        };
    }
    // Khóa toàn bộ các thao tác click chuột trên Màn hình Menu, không cho lọt xuống khung thoại
    menuScreen.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    menuScreen.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
}