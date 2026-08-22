let selectLanguage = null;

let currentNight = 1;
let nightQueue = [];
let queueIndex = 0;

let closeness = 0;
let inReflection = false;
let closenessInterval = null;

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
        reflectionTracking();
        closenessInterval = setInterval(tickCloseness, 100);
    }

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
            options: ['items.length', 'items.lenght()', 'items.count'],
            answer: 'items.length'
        },
        {
            lines: [
                'for (let i = 0; i <= fruits.length; i++) {',
                '  console.log(fruits[i]);',
                '}'
            ],
            buggyLine: 0,
            options: ['i < fruits.length', 'i <= fruits.length', 'i < fruits.length()'],
            answer: 'i < fruits.length'
        },
        {
            lines: [
                'if (fruit = "Apple") {',
                '  console.log("found it");',
                '}'
            ],
            buggyLine: 0,
            options: ['fruit === "Apple"', 'fruit = "Apple"', 'fruit == "Apple"'],
            answer: 'fruit === "Apple"'
        }
    ],
    python: [
        {
            lines: [
                'message = "hello world"',
                'print(message.uper())'
            ],
            buggyLine: 1,
            options: ['message.upper()', 'message.uper()', 'message.Upper()'],
            answer: 'message.upper()'
        },
        {
            lines: [
                'for i in range(len(items) + 1):',
                '    print(items[i])'
            ],
            buggyLine: 0,
            options: ['range(len(items))', 'range(len(items) + 1)', 'range(items.length)'],
            answer: 'range(len(items))'
        },
        {
            lines: [
                'if password = "1234":',
                '    print("correct")'
            ],
            buggyLine: 0,
            options: ['password == "1234"', 'password = "1234"', 'password === "1234"'],
            answer: 'password == "1234"'
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
            options: ['items.size()', 'items.length()', 'items.count()'],
            answer: 'items.size()'
        },
        {
            lines: [
                'for (int i = 0; i <= numbers.size(); i++) {',
                '  cout << numbers[i];',
                '}'
            ],
            buggyLine: 0,
            options: ['i < numbers.size()', 'i <= numbers.size()', 'i < numbers.size'],
            answer: 'i < numbers.size()'
        },
        {
            lines: [
                'if (a = b) {',
                '  cout << "equal";',
                '}'
            ],
            buggyLine: 0,
            options: ['a == b', 'a = b', 'a === b'],
            answer: 'a == b'
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
            options: ['items.length', 'items.lenght()', 'items.size()'],
            answer: 'items.length'
        },
        {
            lines: [
                'for (int i = 0; i <= arr.length; i++) {',
                '  System.out.println(arr[i]);',
                '}'
            ],
            buggyLine: 0,
            options: ['i < arr.length', 'i <= arr.length', 'i < arr.length()'],
            answer: 'i < arr.length'
        },
        {
            lines: [
                'if (name == "Alex") {',
                '  System.out.println("hi Alex");',
                '}'
            ],
            buggyLine: 0,
            options: ['name.equals("Alex")', 'name == "Alex"', 'name = "Alex"'],
            answer: 'name.equals("Alex")'
        }
    ]
};

function startNight() {
    document.getElementById('nightLabel').textContent = 'night ' + currentNight;

    closeness = 0;
    updateClosenessBar();

    const puzzleCount = Math.min(currentNight, puzzles[selectLanguage].length);
    nightQueue = puzzles[selectLanguage].slice(0, puzzleCount);
    queueIndex = 0;

    loadPuzzle(nightQueue[queueIndex]);
}

function loadPuzzle(puzzle) {
    const box = document.getElementById('puzzleBox');
    box.innerHTML = '';

    puzzle.lines.forEach(function (line, i) {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('code-line');
        if (i === puzzle.buggyLine) {
            lineDiv.classList.add('buggy');
        }
        lineDiv.textContent = line;
        box.appendChild(lineDiv);
    });

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    puzzle.options.forEach(function (opt) {
        const btn = document.createElement('button');
        btn.classList.add('options-btn');
        btn.textContent = opt;

        btn.addEventListener('click', function () {
            checkAnswer(btn, opt, puzzle.answer);
        });

        optionsDiv.appendChild(btn);
    });

    box.appendChild(optionsDiv);
}

function checkAnswer(btn, picked, correct) {
    const allButtons = btn.parentElement.querySelectorAll('.options-btn');
    allButtons.forEach(function (b) {
        b.disabled = true;
    });

    if (picked === correct) {
        btn.classList.add('correct');

        setTimeout(function () {
            nextPuzzle();
        }, 600);
    } else {
        btn.classList.add('wrong');

        setTimeout(function () {
            btn.classList.remove('wrong');
            allButtons.forEach(function (b) {
                b.disabled = false;
            });
        }, 500);
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

function reflectionTracking() {
    const relfWindow = document.querySelector('.reflection-window');

    relfWindow.addEventListener('mouseenter', function () {
        inReflection = true;
    });

    relfWindow.addEventListener('mouseleave', function () {
        inReflection = false;
    });
}

function tickCloseness() {
    if (inReflection) {
        closeness -= 2;
    } else {
        closeness += 0.6;
    }

    if (closeness > 100) {
        closeness = 100;
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