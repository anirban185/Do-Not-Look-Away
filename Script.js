let selectLanguage = null;

const filenames = {
    javascript: 'editor.js',
    python: 'editor.py',
    'c++': 'editor.cpp',
    java: 'editor.java'
};

function startGame(lang) {
    selectLanguage = lang;

    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('topbar').classList.remove('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');

    document.getElementById('editorFilename').textContent = filenames[lang];

    loadPuzzle(puzzles[lang]);
}

const puzzles = {
    javascript: {
        lines: [
            'function getTotal(time) {',
            '  return items.length;',
            '}'
        ],
        buggyLine: 1,
        options: ['items.length', 'items.lenght()', 'items.count']
    },
    python: {
        lines: [
            'def get_total(items):',
            '    return items.length'
        ],
        buggyLine: 1,
        options: ['len(items)', 'items.lenght', 'items.lenght()']
    },
    'c++': {
        lines: [
            'int getTotal(vector<int> items) {',
            '  return items.lenght();',
            '}'
        ],
        buggyLine: 1,
        options: ['items.size()', 'items.lenght()', 'items.count()']
    },
    java: {
        lines: [
            'int getTotal(int[] items) {',
            '  return items.lenght;',
            '}'
        ],
        buggyLine: 1,
        options: ['items.lenght', 'items.lenght()', 'items.size()']
    }
};

function loadPuzzle(puzzle) {
    const box = document.getElementById('puzzleBox');
    box.innerHTML = '';

    puzzle.lines.forEach(function (line, i) {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('code-line');
        if (i == puzzle.buggyLine) {
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
        optionsDiv.appendChild(btn);
    });

    box.appendChild(optionsDiv);
}