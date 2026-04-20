// Đảm bảo mảng questions đã có dữ liệu
const questions = [
    { q: "UIT được thành lập vào năm nào?", a: ["2006", "2005", "2007", "2008"], correct: "2006" },
    { q: "Linh vật của UIT là gì?", a: ["Cú", "Mèo", "Rồng", "Gấu trúc"], correct: "Gấu trúc" },
    { q: "Tòa nhà nào cao nhất UIT?", a: ["Tòa E", "Tòa C", "Tòa B", "Tòa A"], correct: "Tòa E" }
];

let shuffledQuestions, currentQuestionIndex;

window.startToaCGame = () => {
    console.log("Game Tòa C bắt đầu...");
    const quizContainer = document.getElementById('toa-c');
    if (quizContainer) quizContainer.classList.remove('hidden');

    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    setNextQuestion();
};

function setNextQuestion() {
    const btnContainer = document.getElementById('answer-buttons');
    const qText = document.getElementById('question-text');
    
    // Xóa đáp án cũ
    btnContainer.innerHTML = '';
    
    let currentQ = shuffledQuestions[currentQuestionIndex];
    qText.innerText = currentQ.q;

    // Tạo 4 ô đáp án
    currentQ.a.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('answer-btn');
        button.onclick = () => {
            if(answer === currentQ.correct) alert("Đúng rồi!");
            else alert("Sai rồi!");
            
            currentQuestionIndex++;
            if (currentQuestionIndex < shuffledQuestions.length) setNextQuestion();
            else alert("Hoàn thành tòa C!");
        };
        btnContainer.appendChild(button);
    });
}