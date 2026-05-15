import { saveScore } from './firebase.js';

// --- HÀM PHỤ TRỢ: Chơi âm thanh an toàn, chặn mọi lỗi đỏ Console ---
const safePlayAudio = (src, isLoop = false) => {
    try {
        const audio = new Audio(src);
        audio.loop = isLoop;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { /* Bỏ qua lỗi nếu thiếu file */ });
        }
        return audio;
    } catch(e) { return null; }
};

// ---------------------------------------------------------
// 1. DỮ LIỆU KỊCH BẢN HỘI THOẠI
// ---------------------------------------------------------
const storyBadToaC = [
    { 
        id: "bad_01", 
        name: "", 
        text: "Âm thanh ồn ào náo nhiệt của sảnh Tòa C đột ngột tắt lịm đi như ai đó vừa rút phích cắm điện. ", 
        bg: "", 
        sprite: "", 
        noSkip: true,
        nextId: "bad_02" 
    },
    { 
        id: "bad_02", 
        name: "", 
        text: "Sảnh Tòa C bỗng trở nên rộng lớn và vắng lặng đến nghẹt thở. Dường như chỉ còn bạn và cậu CTV đối diện với nhau.", 
        bg: "", 
        sprite: "", 
        nextId: "bad_03" 
    },
    { 
        id: "bad_03", 
        name: "", 
        text: "Cậu CTV BHT CNPM không còn dáng vẻ lăng xăng, nhiệt tình ban nãy. Cậu ta từ từ hạ chiếc micro xuống, đứng thẳng người.", 
        bg: "", 
        sprite: "", 
        nextId: "bad_04" 
    },
    { 
        id: "bad_04", 
        name: "", 
        text: "Khi cậu ta ngẩng lên, ánh mắt bỗng trở nên sâu thẳm, tĩnh lặng và lạnh lẽo — hệt như ánh mắt của Người Hướng Dẫn trong thang máy Tòa E lúc đầu.", 
        bg: "", 
        sprite: "", 
        nextId: "bad_05" 
    },
    { 
        id: "bad_05", 
        name: "CTV BHTCNPM", 
        text: "Dữ liệu không khớp. Anh đã quên hết những ký ức trước đây. Anh sẽ kẹt ở đây mãi mãi.", 
        bg: "", 
        voice: "assets/voice/ending/5_bad.ogg",
        sprite: "assets/images/Đậu đậu.png", 
        noSkip: true,
        nextId: null
    }
];

const storyTrueToaC_Part1 = [
    { 
        id: "true_01", 
        name: "", 
        text: "Âm thanh ồn ào náo nhiệt của sảnh Tòa C đột ngột tắt lịm đi như ai đó vừa rút phích cắm điện. Không gian xung quanh đóng băng hoàn toàn", 
        bg: "", 
        sprite: "", 
        noSkip: true,
        nextId: "true_02" 
    },
    { 
        id: "true_02", 
        name: "", 
        text: "Cậu CTV BHTCNPM không còn dáng vẻ lăng xăng ban nãy. Cậu ta đứng thẳng người. Ánh mắt bỗng trở nên sâu thẳm hệt như Người Hướng Dẫn ở sảnh Tòa E.", 
        bg: "", 
        sprite: "assets/images/chibi.png", 
        noSkip: true,
        nextId: "true_03" 
    },
    { 
        id: "true_03", 
        name: "CTV BHTCNPM", 
        text: "Dữ liệu đã khớp. Anh nhớ rất kỹ nơi này... dù đã rời đi từ lâu.", 
        bg: "", 
        voice: "assets/voice/ending/1.ogg",
        sprite: "assets/images/chibi.png", 
        noSkip: true,
        nextId: "true_04" 
    },
    { 
        id: "true_04", 
        name: "{PLAYER}", 
        text: "Cái giọng điệu này... Cậu là cái hệ thống admin lúc nãy? Thôi được rồi, trò chơi kết thúc. Tôi đã gom đủ 4 mảnh. Mở cửa cho tôi thoát ra khỏi đây", 
        bg: "", 
        voice: "assets/voice/ending/2.ogg",
        sprite: "assets/images/Main.png", 
        noSkip: true,
        nextId: "true_05" 
    },
    { 
        id: "true_05", 
        name: "CTV BHTCNPM", 
        text: "Anh cứ tưởng hệ thống bắt anh đi gom ký ức sao? Không đâu... Là tự tâm trí anh đang nhớ lại những gì nó không muốn quên đi thôi.", 
        bg: "", 
        voice: "assets/voice/ending/3.ogg",
        sprite: "assets/images/chibi.png", 
        noSkip: true,
        nextId: null
    }
];

const storyTrueToaC_Part2 = [
    { 
        id: "true_07", 
        name: "CTV BHTCNPM", 
        text: "Anh đã khôi phục xong toàn bộ dữ liệu thanh xuân của mình rồi. Đến lúc phải tỉnh dậy để chạy deadline tiếp thôi, cựu sinh viên.", 
        bg: "", 
        sprite: "assets/images/chibi.png", 
        voice: "assets/voice/ending/4.ogg",
        noSkip: true,
        nextId: null 
    }
];

const storyVanPhong = [
    { 
        id: "vp_01", 
        name: "", 
        text: "Tiếng điện thoại iPhone 17 reng inh ỏi. ", 
        bg: "", 
        sprite: "", 
        noSkip: true,
        nextId: "vp_02" 
    },
    { 
        id: "vp_02",
        name: "", 
        text: "Anh chớp mắt, dụi mặt. Quanh quẩn chỉ là tiếng còi xe, tiếng gà gáy bên ngoài và ánh đèn phòng.", 
        bg: "", 
        sprite: "", 
        nextId: "vp_03" 
    },
    { 
        id: "vp_03", 
        name: "", 
        text: "Trên màn hình máy tính vẫn là đống code báo lỗi đỏ chót từ hôm qua.", 
        bg: "", 
        sprite: "", 
        nextId: "vp_04"
    },
    {
        id: "vp_04",
        name: "",
        text: "Anh bấm Ctrl+S lưu đống code lại, tắt hết tab làm việc rồi chuyển sang tab một tab Email.",
        bg: "",
        sprite: "",
        nextId: "vp_05"
    },
    {
        id: "vp_05",
        name: "",
        text: "Đó là email có tiêu đề: 'Thư ngỏ: Mời anh/chị Cựu sinh viên về thăm trường và làm diễn giả Lễ Kỷ niệm 20 năm UIT'. Thời gian là từ tháng 5",
        bg: "",
        sprite: "",
        nextId: "vp_06",
    },
    {
        id: "vp_06",
        name: "",
        text: "Sáng sớm hôm sau. Một chiếc taxi đỗ xịch trước cổng trường UIT.",
        bg: "",
        sprite: "",
        nextId: "vp_07"
    },
    {
        id: "vp_07",
        name: "",
        text: "Không còn là chiều không gian ảo mộng nữa, mà là thực tại ngập tràn sức sống.",
        bg: "",
        sprite: "",
        noSkip: true,
        nextId: null
    }
];
// BƠM DỮ LIỆU ENDING RA TOÀN CỤC ĐỂ MAIN.JS GỌI ĐƯỢC
window.storyBadToaC = storyBadToaC;
window.storyTrueToaC_Part1 = storyTrueToaC_Part1;
window.storyTrueToaC_Part2 = storyTrueToaC_Part2;
window.storyVanPhong = storyVanPhong;
window.showEndCredits = showEndCredits; // Cho phép gọi hàm chạy Credit
// ---------------------------------------------------------
// 2. CÁC HÀM HIỆU ỨNG KỸ XẢO
// ---------------------------------------------------------
export function disintegrateToCode(targetElement) {
    if (!targetElement) return;
    targetElement.classList.add('sprite-disintegrate');
    const rect = targetElement.getBoundingClientRect();
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('span');
            particle.className = 'binary-particle';
            particle.innerText = Math.random() > 0.5 ? '0' : '1';
            const startX = rect.left + (Math.random() * rect.width);
            const startY = rect.top + (Math.random() * rect.height);
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            const drift = (Math.random() - 0.5) * 50; 
            particle.style.setProperty('--drift', `${drift}px`);
            const duration = 1.5 + Math.random() * 1.5; 
            particle.style.animationDuration = `${duration}s`;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), duration * 1000);
        }, Math.random() * 2000);
    }
}

export function triggerBadEndingEffect() {
    const errorScreen = document.getElementById('bad-ending-screen');
    const bgCodeLayer = document.getElementById('error-bg-code');
    const glitchLayer = document.getElementById('cyber-glitch-overlay'); 
    
    if (!errorScreen || !bgCodeLayer) return;
    errorScreen.classList.remove('hidden');
    bgCodeLayer.innerHTML = ""; 

    safePlayAudio('assets/sound/glitch_badending.mp3', true);

    const binBase = "01010011 01011001 01010011 01010100 01000101 01001101 00100000 01000101 01010010 01010010 01001111 01010010 "; 
    const longBin = binBase.repeat(40); 
    for (let i = 0; i < 40; i++) {
        const row = document.createElement('div');
        row.className = 'binary-row';
        row.innerText = longBin + longBin; 
        const speed = 3 + Math.random() * 3; 
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
        row.style.animation = `scrollBinary ${speed}s linear infinite ${direction}`;
        bgCodeLayer.appendChild(row);
    }
    setTimeout(() => {
        if (glitchLayer) glitchLayer.classList.add('active', 'active-max'); 
        setTimeout(() => window.location.reload(), 5000);
    }, 1500); 
}

// ---------------------------------------------------------
// 3. HÀM ĐIỀU HƯỚNG CHÍNH
// ---------------------------------------------------------
export const handleGameEnding = async (finalTotalScore, isWin, playerName, totalTime, results) => {
    const vnScreen = document.getElementById('vn-screen');

    const cleanUpOverlays = () => {
        const mergeScreen = document.getElementById('memory-merge-screen');
        const flashbang = document.getElementById('merge-flashbang');
        if (mergeScreen) { mergeScreen.style.display = 'none'; mergeScreen.classList.add('hidden'); }
        if (flashbang) { flashbang.style.display = 'none'; flashbang.classList.remove('trigger-flash'); }
    };

    const hijackFinalLeaderboardButton = (isBadEnding) => {
        const targetText = isBadEnding ? "XÁC NHẬN KẸT LẠI" : "NGHE MÁY (TỈNH DẬY)";

        window.bxhHuntInterval = setInterval(() => {
            if (isBadEnding) {
                document.querySelectorAll('#leaderboardScreen .title, #leaderboardScreen h2, .leaderboard-header, #global-summary-overlay .title').forEach(t => t.innerText = "⚠ LỖI DỮ LIỆU: KHÔNG THỂ THOÁT ⚠");
            }

            const leaderboardUI = document.getElementById('leaderboardScreen') || 
                                  document.getElementById('global-summary-overlay') || 
                                  document.querySelector('.leaderboard-container');
            
            if (leaderboardUI && leaderboardUI.style.display !== 'none' && !leaderboardUI.classList.contains('hidden')) {
                const actionButtons = leaderboardUI.querySelectorAll('button, .btn, .uit-btn, .close-btn');
                actionButtons.forEach(btn => {
                    if (btn.innerText !== targetText) {
                        btn.innerText = targetText;
                        btn.style.pointerEvents = 'auto'; 
                        btn.style.zIndex = '99999'; 
                    }
                });
            }
        }, 500); 

        const globalClickHandler = (e) => {
            if ((e.target.innerText && e.target.innerText.includes(targetText)) || 
                (e.target.closest('button') && e.target.closest('button').innerText.includes(targetText))) {
                
                e.preventDefault();
                e.stopPropagation(); 

                clearInterval(window.bxhHuntInterval);
                document.removeEventListener('click', globalClickHandler, true);

                // 1. DỌN SẠCH UI RÁC CỦA BXH
                const screensToKill = ['summaryScreen', 'leaderboardScreen', 'global-summary-overlay', 'memory-merge-screen', 'merge-flashbang', 'whiteout-overlay', 'overlay', 'fade-overlay'];
                screensToKill.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.display = 'none';
                        el.style.opacity = '0';
                        el.classList.remove('show', 'active', 'trigger-flash');
                        el.classList.add('hidden');
                    }
                });
                document.querySelectorAll('.petal').forEach(p => p.remove());

                // 2. TẮT ÂM THANH
                if (window.phoneRingSound) { window.phoneRingSound.pause(); window.phoneRingSound.currentTime = 0; }
                if (window.cursedBgm) { window.cursedBgm.pause(); window.cursedBgm.currentTime = 0; }

                // 🌟 BƯỚC QUAN TRỌNG NHẤT BẠN ĐÃ THIẾU: BẬT LẠI GAME-SCENE 🌟
                const gameScene = document.getElementById('game-scene');
                if (gameScene) {
                    gameScene.classList.remove('hidden');
                    gameScene.classList.add('show');
                    gameScene.style.display = 'block';
                }

                if (isBadEnding) {
                    document.body.classList.remove('cursed-mode');
                    const injectedCSS = document.getElementById('cursed-override-css');
                    if(injectedCSS) injectedCSS.remove();
                    triggerBadEndingEffect(); 
                } else {
                    // 3. GỌI LỆNH CHUYỂN CẢNH GỐC CỦA GAME (Để game reset lại trạng thái)
                    if (typeof window.switchBuilding === 'function') {
                        window.switchBuilding('vn-screen');
                    }

                    // 4. CHỜ ĐÚNG 800ms ĐỂ MÀN HÌNH CHUYỂN XONG RỒI MỚI IN CHỮ
                    setTimeout(() => {
                        const vn = document.getElementById('vn-screen');
                        if (vn) {
                            vn.style.display = 'block';
                            vn.style.width = '100vw';   
                            vn.style.height = '100vh';  
                            vn.style.position = 'fixed';
                            vn.style.top = '0';
                            vn.style.left = '0';
                            vn.style.backgroundColor = '#05050a'; // Nền đen sâu thẳm
                            vn.style.backgroundImage = 'none';
                            vn.style.zIndex = '99990';
                            vn.classList.remove('hidden', 'light-glitch-effect');
                        }

                        // Bơm CSS ép chữ hiện lên xuyên rào cản
                        const forceStyle = document.createElement('style');
                        forceStyle.id = 'force-vn-style';
                        // Bơm CSS để tạo bối cảnh thế giới thực
                        forceStyle.innerHTML = `
                            /* 🛑 ẨN TẤT CẢ ẢNH NHÂN VẬT & HIỆU ỨNG THẾ GIỚI ẢO */
                            #vn-sprite, .vn-sprite, img[id*="sprite"], .petal, #overlay {
                                display: none !important;
                                opacity: 0 !important;
                                visibility: hidden !important;
                                width: 0 !important;
                                height: 0 !important;
                            }
                            
                            /* ĐỔI MÀU NỀN CỦA GIAO DIỆN VN SANG MÀU ĐEN (thay vì nền hồng f0cbcb mặc định) */
                            #vn-screen { 
                                background-color: #05050a !important; 
                                background-image: none !important; 
                            }
                        `;
                        document.head.appendChild(forceStyle);

                        const sprite = document.getElementById('vn-sprite');
                        if (sprite) {
                            sprite.classList.remove('sprite-disintegrate');
                            sprite.style.display = 'none';
                            sprite.style.opacity = '1';
                        }

                        // CHẠY THOẠI SAU KHI SÂN KHẤU ĐÃ BẬT ĐÈN
                        if (typeof window.playVN === 'function') {
                            window.playVN(storyVanPhong, "vp_01", () => {
                                if (vn) vn.style.display = 'none';
                                
                                // TOÀN BỘ KÝ ỨC ĐÃ XONG. BÂY GIỜ LÀ LÚC CHẠY CREDIT! 🚀
                                if (typeof showEndCredits === 'function') {
                                    showEndCredits();
                                }
                            });
                        }
                    }, 800); // <-- Trái tim của sự mượt mà nằm ở 800ms này!
                }
            }
        };
        document.addEventListener('click', globalClickHandler, true);
    };

    // ======= KỊCH BẢN 1: BAD ENDING =======
    if (finalTotalScore < 0) { 
        if (vnScreen) vnScreen.classList.add('light-glitch-effect');
        if (typeof window.playVN === 'function') {
            window.playVN(storyBadToaC, "bad_01", async () => {
                
                if (vnScreen) {
                    vnScreen.style.display = 'none';
                    vnScreen.classList.remove('light-glitch-effect'); 
                }
                cleanUpOverlays(); 

                try { await saveScore(playerName, finalTotalScore, totalTime, 1); } catch (err) {}

                try {
                    const module = await import('./leaderboard.js'); 
                    if (module && typeof module.showSummary === 'function') {
                        module.showSummary(results, totalTime, finalTotalScore);

                        setTimeout(() => {
                            window.cursedBgm = safePlayAudio('assets/sound/glitch_errorbxh.mp3', true);

                            const style = document.createElement('style');
                            style.id = 'cursed-override-css';
                            style.innerHTML = `
                                /* 🛑 GIAO DIỆN BAD ENDING GỐC CỦA BẠN 🛑 */
                                #summaryScreen, #leaderboardScreen, .leaderboard-container, .summary-board {
                                    background: #110000 !important; background-image: none !important; box-shadow: 0 0 30px #ff0000, inset 0 0 50px #ff0000 !important; color: #ff3333 !important; border: 2px solid #ff0000 !important;
                                }
                                #summaryScreen *, #leaderboardScreen * { 
                                    color: #ff3333 !important; border-color: #550000 !important; font-family: monospace !important; text-shadow: 2px 2px 0px #000 !important; 
                                }
                                .leaderboard-row { background: #220000 !important; }

                                /* 🔥 NGOẠI LỆ: ÉP TÊN CỦA BẠN SÁNG LÊN GIỮA BIỂN MÁU 🔥 */
                                #leaderboardScreen .you, .leaderboard-row.you, .row.you {
                                    background: #550000 !important; /* Đỏ đậm hơn để tách biệt */
                                    border: 1px dashed #ff3333 !important;
                                }
                                #leaderboardScreen .you *, .leaderboard-row.you *, .row.you * {
                                    color: #ffffff !important; /* Chữ màu trắng bóc */
                                    text-shadow: 0 0 8px #ff0000 !important; /* Tỏa sáng viền đỏ */
                                    font-weight: bold !important;
                                }
                            `;
                            document.head.appendChild(style);
                            document.body.classList.add('cursed-mode');
                            document.querySelectorAll('.title, #summary-title').forEach(t => t.innerText = "⚠ LỖI: DỮ LIỆU BỊ GIAM GIỮ ⚠");
                        }, 1500);

                        hijackFinalLeaderboardButton(true);
                    }
                } catch (e) { console.error("Lỗi:", e); }
            });
        }
    } 
    // ======= KỊCH BẢN 2: TRUE ENDING =======
    else {
        if (typeof window.playVN === 'function') {
            window.playVN(storyTrueToaC_Part1, "true_01", () => {
                window.playVN(storyTrueToaC_Part2, "true_07", () => {
                    
                    const vnBox = document.querySelector('.uit-dialogue-box');
                    if (vnBox) vnBox.style.display = 'none';

                    const mergeScreen = document.getElementById('memory-merge-screen');
                    const container = document.querySelector('.merge-container');
                    const flashbang = document.getElementById('merge-flashbang');
                    
                    if(mergeScreen) {
                        mergeScreen.style.display = 'flex'; 
                        mergeScreen.classList.remove('hidden');
                        mergeScreen.classList.add('is-merging-bg'); 
                    }
                    if(container) {
                        container.classList.remove('is-floating');
                        container.classList.add('is-merging');
                    }

                    setTimeout(() => {
                        if(flashbang) {
                            flashbang.style.display = 'block'; 
                            flashbang.classList.add('trigger-flash');
                        }

                        safePlayAudio('assets/sound/boom.mp3');
                        safePlayAudio('assets/sound/flashhit.mp3');
                        
                        setTimeout(async () => {
                            cleanUpOverlays();
                            if (vnScreen) vnScreen.style.display = 'none';
                            try { await saveScore(playerName, finalTotalScore, totalTime, 1); } catch (err) {}

                            try {
                                const module = await import('./leaderboard.js');
                                if (module && typeof module.showSummary === 'function') {
                                    module.showSummary(results, totalTime, finalTotalScore);

                                    window.phoneRingSound = safePlayAudio('assets/sound/phone_ring.mp3', true);

                                    hijackFinalLeaderboardButton(false);
                                }
                            } catch (e) { console.error("Lỗi:", e); }

                        }, 1500); 
                    }, 5000); 
                });

                setTimeout(() => {
                    const vnSprite = document.getElementById('vn-sprite');
                    disintegrateToCode(vnSprite); 
                }, 100);
            });
        }
    }
};

// Hàm kích hoạt màn hình Credit
function showEndCredits() {
    const creditScreen = document.getElementById('credit-screen');
    const thankYou = document.getElementById('thank-you-screen');
    
    if (creditScreen) {
        creditScreen.classList.remove('hidden');
        console.log("Đang chạy Credit...");
    }

    // Phát nhạc Credit
    try {
        const creditMusic = new Audio('assets/sound/credit.mp3');
        creditMusic.volume = 0.8;
        creditMusic.play().catch(e => console.warn("Không tìm thấy file nhạc: assets/sound/credit.mp3"));
    } catch (e) {
        console.error("Lỗi âm thanh:", e);
    }

    // Đợi đúng 28 giây (khớp với animation CSS)
    setTimeout(() => {
        if (thankYou) {
            thankYou.classList.remove('hidden');
            // Dùng setTimeout nhỏ để trigger hiệu ứng transition mờ dần
            setTimeout(() => {
                thankYou.classList.add('show');
                console.log("Đã hiện màn hình Cảm ơn!");
            }, 100);
        }
    }, 28000); 
}