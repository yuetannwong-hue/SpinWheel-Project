const wheel = document.getElementById('wheel');
const optionInput = document.getElementById('optionInput');
const addButton = document.getElementById('addButton');
const clearButton = document.getElementById('clearButton');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('resultDisplay');
const optionsList = document.getElementById('optionsList');

let options = [];
let currentRotation = 0;

function getColor(i) {
    return `hsl(${(i * 137.5) % 360}, 75%, 55%)`; 
}

function drawWheel() {
    optionsList.innerHTML = "";
    options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `<span>${opt}</span><button class="delete-btn" onclick="deleteOption(${i})">X</button>`;
        optionsList.appendChild(div);
    });

    if (options.length === 0) {
        wheel.innerHTML = "";
        wheel.style.background = "#95a5a6";
        return;
    }

    const sliceDeg = 360 / options.length;
    let colorSlices = options.map((_, i) => `${getColor(i)} ${i * sliceDeg}deg ${(i + 1) * sliceDeg}deg`);
    wheel.style.background = `conic-gradient(${colorSlices.join(', ')})`;

    wheel.innerHTML = "";
    options.forEach((opt, i) => {
        const textDiv = document.createElement('div');
        textDiv.className = 'slice-text';
        
        const sliceDeg = 360 / options.length;
        const midPoint = (i * sliceDeg) + (sliceDeg / 2);
        
        textDiv.style.transform = `rotate(${midPoint}deg) `;
        
        const span = document.createElement('span');
        span.textContent = opt;

        span.style.transform = `rotate(180deg)`;
        
        textDiv.appendChild(span);
        wheel.appendChild(textDiv);
    });
}

function deleteOption(index) {
    options.splice(index, 1);
    resultDisplay.innerText = "Updated";
    drawWheel();
}

addButton.addEventListener('click', () => {
    const text = optionInput.value.trim();
    if (text) {
        options.push(text);
        optionInput.value = "";
        resultDisplay.innerText = "Ready";
        drawWheel();
    }
});

optionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addButton.click(); });

clearButton.addEventListener('click', () => {
    options = [];
    currentRotation = 0;
    wheel.style.transform = `rotate(0deg)`;
    resultDisplay.innerText = "Cleared";
    drawWheel();
});

spinButton.addEventListener('click', () => {
    if (options.length < 2) {
        alert("Add at least 2 choices!");
        return;
    }

    // 1. Choose winner FIRST
    const winningIndex = Math.floor(Math.random() * options.length);
    const sliceDeg = 360 / options.length;

    // 2. Math to put winner at the top arrow (270 degrees)
    const winnerCenterRelative = (winningIndex * sliceDeg) + (sliceDeg / 2);
    const targetRotation = 270 - winnerCenterRelative;
    
    // 3. Keep spinning forward
    const extraSpins = 3600; 
    currentRotation += extraSpins + (targetRotation - (currentRotation % 360) + 360) % 360;

    wheel.style.transform = `rotate(${currentRotation}deg)`;
    resultDisplay.innerText = "Spinning...";

    setTimeout(() => {
        resultDisplay.innerText = `Result: ${options[winningIndex]}`;
        resultDisplay.style.transform = "scale(1.2)";
        setTimeout(() => { resultDisplay.style.transform = "scale(1)"; }, 200);
    }, 4000);
});