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

    currentLineId = lineId;

    choiceContainer.innerHTML = '';
    choiceContainer.classList.add('hidden');
    nextIndicator.style.display = 'block';
    isWaitingForChoice = false;

    let speaker = line.name;
    if (speaker === "{PLAYER}") speaker = localStorage.getItem('currentPlayerName') || "Main";
    if (speaker) {
        vnName.style.display = 'block';
        vnName.innerText = speaker;
    } else {
        vnName.style.display = 'none';
    }

    if (line.bg) vnBg.style.backgroundImage = `url(${line.bg})`;
    if (line.sprite) {
        vnSprite.src = line.sprite;
        vnSprite.classList.remove('hidden');
    } else {
        vnSprite.classList.add('hidden');
    }
    
    let rawText = line.text.replace(/{PLAYER}/g, localStorage.getItem('currentPlayerName') || "Main");
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
        }
    }, 30);
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

dialogueBox.onclick = () => {
    if (isWaitingForChoice) return; 

    const currentLine = storyMap[currentLineId];
    if (!currentLine) return;
    if (isTyping) {
        clearInterval(typeInterval);
        vnText.innerHTML = currentLine.text.replace(/{PLAYER}/g, localStorage.getItem('currentPlayerName') || "Main");
        isTyping = false;
        checkChoices(currentLine);
    } else {
        showLine(currentLine.nextId);
    }
};