let selectLanguage = null;

let currentNight = 1;
let nightQueue = [];
let queueIndex = 0;

let closeness = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let closenessInterval = null;

const torchRadius = 200;

const filenames = {
    javascript: 'editor.js',
    python: 'editor.py',
    'c++': 'editor.cpp',
    java: 'editor.java'
};

function startGame(lang) {
    selectLanguage = lang;
    currentNight = 1;

    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('topbar').classList.remove('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');

    document.getElementById('editorFilename').textContent = filenames[lang];

    if (!closenessInterval) {
        torchTracking();
        closenessInterval = setInterval(tickCloseness, 100);
    }

    document.getElementById('dark').classList.remove('hidden');
    document.getElementById('glow').classList.remove('hidden');

    startNight();
}

const puzzles = {
    javascript: [
        {
            lines: [
                'function getTotal(items) {',
                '  return items.lenght;',
                '}'
            ],
            buggyLine: 1,
            answer: '  return items.length;'
        },
        {
            lines: [
                'for (let i = 0; i <= fruits.length; i++) {',
                '  console.log(fruits[i]);',
                '}'
            ],
            buggyLine: 0,
            answer: 'for (let i = 0; i < fruits.length; i++) {'
        },
        {
            lines: [
                'if (fruit = "Apple") {',
                '  console.log("found it");',
                '}'
            ],
            buggyLine: 0,
            answer: 'if (fruit === "Apple") {'
        },
        {
            lines: [
                'let result = 0 / 0;',
                'if (result == NaN) {',
                '  console.log("invalid");',
                '}'
            ],
            buggyLine: 1,
            answer: 'if (Number.isNaN(result)) {'
        },
        {
            lines: [
                'let arr = [1, 2, 3];',
                'console.log(arr[3]);'
            ],
            buggyLine: 1,
            answer: 'console.log(arr[2]);'
        },
        {
            lines: [
                'function square(x) {',
                '  x * x;',
                '}'
            ],
            buggyLine: 1,
            answer: '  return x * x;'
        },
        {
            lines: [
                'let name = "Sam";',
                'console.log("hi " + Name);'
            ],
            buggyLine: 1,
            answer: 'console.log("hi " + name);'
        }
    ],
    python: [
        {
            lines: [
                'message = "hello world"',
                'print(message.uper())'
            ],
            buggyLine: 1,
            answer: 'print(message.upper())'
        },
        {
            lines: [
                'for i in range(len(items) + 1):',
                '    print(items[i])'
            ],
            buggyLine: 0,
            answer: 'for i in range(len(items)):'
        },
        {
            lines: [
                'if password = "1234":',
                '    print("correct")'
            ],
            buggyLine: 0,
            answer: 'if password == "1234":'
        },
        {
            lines: [
                'age = 20',
                'if age >= 18:',
                '    print("adult"'
            ],
            buggyLine: 1,
            answer: 'if age >= 18:'
        },
        {
            lines: [
                'nums = [1, 2, 3]',
                'print(nums[3])'
            ],
            buggyLine: 1,
            answer: 'print(nums[2])'
        },
        {
            lines: [
                'def add(a, b):',
                '    retun a + b'
            ],
            buggyLine: 1,
            answer: '    return a + b'
        },
        {
            lines: [
                'name = input("your name: ")',
                'print("hi " + Name)'
            ],
            buggyLine: 1,
            answer: 'print("hi " + name)'
        }
    ],
    'c++': [
        {
            lines: [
                'int getTotal(vector<int> items) {',
                '  return items.length();',
                '}'
            ],
            buggyLine: 1,
            answer: '  return items.size();'
        },
        {
            lines: [
                'for (int i = 0; i <= numbers.size(); i++) {',
                '  cout << numbers[i];',
                '}'
            ],
            buggyLine: 0,
            answer: 'for (int i = 0; i < numbers.size(); i++) {'
        },
        {
            lines: [
                'if (a = b) {',
                '  cout << "equal";',
                '}'
            ],
            buggyLine: 0,
            answer: 'if (a == b) {'
        },
        {
            lines: [
                'int x = 5',
                'cout << x;'
            ],
            buggyLine: 0,
            answer: 'int x = 5;'
        },
        {
            lines: [
                'int arr[5] = {1, 2, 3, 4, 5};',
                'int last = arr[5];'
            ],
            buggyLine: 1,
            answer: 'int last = arr[4];'
        },
        {
            lines: [
                'int square(int x) {',
                '  x * x;',
                '}'
            ],
            buggyLine: 1,
            answer: 'return x * x;'
        }
    ],
    java: [
        {
            lines: [
                'int getTotal(int[] items) {',
                '  return items.lenght;',
                '}'
            ],
            buggyLine: 1,
            answer: '  return items.length;'
        },
        {
            lines: [
                'for (int i = 0; i <= arr.length; i++) {',
                '  System.out.println(arr[i]);',
                '}'
            ],
            buggyLine: 0,
            answer: 'for (int i = 0; i < arr.length; i++) {'
        },
        {
            lines: [
                'if (name == "Alex") {',
                '  System.out.println("hi Alex");',
                '}'
            ],
            buggyLine: 0,
            answer: 'if (name.equals("Alex")) {'
        },
        {
            lines: [
                'int x = 5',
                'System.out.println(x);'
            ],
            buggyLine: 0,
            answer: 'int x = 5;'
        },
        {
            lines: [
                'int[] arr = {1, 2, 3, 4, 5};',
                'int last = arr[5];'
            ],
            buggyLine: 1,
            answer: 'int last = arr[4];'
        },
        {
            lines: [
                'int square(int x) {',
                '  x * x;',
                '}'
            ],
            buggyLine: 1,
            answer: '  return x * x;'
        }
    ]
};

function shuffleArray(arr) {
    const shuffled = arr.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }

    return shuffled;
}

function startNight() {
    document.getElementById('nightLabel').textContent = 'night ' + currentNight;

    closeness = 0;
    updateClosenessBar();

    const puzzleCount = Math.min(currentNight, puzzles[selectLanguage].length);
    nightQueue = shuffleArray(puzzles[selectLanguage]).slice(0, puzzleCount);
    queueIndex = 0;

    loadPuzzle(nightQueue[queueIndex]);
}

function loadPuzzle(puzzle) {
    const box = document.getElementById('puzzleBox');
    box.innerHTML = '';

    puzzle.lines.forEach(function (line, i) {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('code-line');
        lineDiv.textContent = line;

        if (i === puzzle.buggyLine) {
            lineDiv.classList.add('buggy');

            lineDiv.addEventListener('click', function () {
                openFixInput(lineDiv, puzzle);
            });
        }

        box.appendChild(lineDiv);
    });

    updateProgressLabel();
}

function updateProgressLabel() {
    document.getElementById('puzzleProgress').textContent = 'puzzle' + (queueIndex + 1) + '/' + nightQueue.length;
}

function openFixInput(lineDiv, puzzle) {
    if (lineDiv.querySelector('input')) {
        return;
    }

    const currentLine = puzzle.lines[puzzle.buggyLine];

    lineDiv.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('fix-input');
    input.value = currentLine;

    lineDiv.appendChild(input);

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            checkAnswer(lineDiv, input, puzzle);
        }
    });
}

function checkAnswer(lineDiv, input, puzzle) {
    const typed = input.value.trim();
    const correct = puzzle.answer.trim();

    if (typed === correct) {
        input.disabled = true;

        lineDiv.classList.remove('wrong');
        lineDiv.classList.remove('buggy');
        lineDiv.classList.add('correct');

        setTimeout(function () {
            nextPuzzle();
        }, 600);
    } else {
        lineDiv.classList.add('wrong');

        setTimeout(function () {
            lineDiv.classList.remove('wrong');
        }, 400);

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}

function nextPuzzle() {
    queueIndex++;

    if (queueIndex < nightQueue.length) {
        loadPuzzle(nightQueue[queueIndex]);
    } else {
        nightComplete();
    }
}

function nightComplete() {
    document.getElementById('survivedLabel').textContent = 'survived: ' + currentNight;

    currentNight++;
    startNight();
}

function torchTracking() {
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.documentElement.style.setProperty('--x', mouseX + 'px');
        document.documentElement.style.setProperty('--y', mouseY + 'px');
    });

    document.addEventListener('mouseleave', function () {
        document.body.classList.add('noTorch');
    });

    document.addEventListener('mouseenter', function () {
        document.body.classList.remove('noTorch');
    });
}

function torchOnFigure() {
    const figure = document.getElementById('figure');
    const rect = figure.getBoundingClientRect();
    const figureX = rect.left + rect.width / 2;
    const figureY = rect.top + rect.height / 2;

    const dx = mouseX - figureX;
    const dy = mouseY - figureY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < torchRadius;
}

function tickCloseness() {
    if (torchOnFigure()) {
        closeness -= 2;
    } else {
        closeness += 0.6;
    }

    if (closeness > 100) {
        closeness = 100;
    }

    if (closeness < 0) {
        closeness = 0;
    }

    updateClosenessBar();

    if (closeness >= 100) {
        triggerJumpscare();
    }
}

function updateClosenessBar() {
    document.getElementById('closenessFill').style.width = closeness + '%';

    const figure = document.getElementById('figure');
    figure.style.opacity = 0.3 + (closeness / 100) * 0.6;
    figure.style.transform = 'translateX(-50%) scale(' + (1 + closeness / 150) + ')';
}

function triggerJumpscare() {
    document.getElementById('jumpscare').classList.remove('hidden');
    document.getElementById('jumpscare').style.display = 'flex';

    setTimeout(function () {
        document.getElementById('jumpscare').style.display = 'none';
        startNight();
    }, 1500);
}