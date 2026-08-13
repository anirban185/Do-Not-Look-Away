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
}