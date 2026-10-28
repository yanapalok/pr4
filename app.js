
const audio   = document.querySelector('#audio');
const playBtn = document.querySelector('#play');
const nowText = document.querySelector('#now');
const rows    = [...document.querySelectorAll('.track')];
let current   = -1;

function select(i) {
    if (i < 0 || i >= rows.length) return;
    current = i;
    rows.forEach(r => r.classList.remove('active'));
    rows[i].classList.add('active');
    nowText.textContent = rows[i].querySelector('.track-name').textContent;
    audio.src = rows[i].dataset.src + '.mp3';
    audio.play().catch(() => {});
}

function togglePlay() {
    if (current < 0) select(0);
    else if (audio.paused) audio.play();
    else audio.pause();
}

rows.forEach((row, i) => row.addEventListener('click', () => select(i)));          
playBtn.addEventListener('click', togglePlay);
document.querySelector('#prev').addEventListener('click', () => select(current - 1));
document.querySelector('#next').addEventListener('click', () => select(current + 1));
audio.addEventListener('ended', () => select(current + 1));
audio.addEventListener('play',  () => { playBtn.textContent = '❚❚'; });
audio.addEventListener('pause', () => { playBtn.textContent = '▶'; });


const themeBtn   = document.querySelector('#theme-toggle');
const themeLabel = document.querySelector('#theme-label');

function updateThemeButton() {
    const light = document.body.classList.contains('light-theme');
    themeLabel.textContent = light ? 'Темна' : 'Світла';
    themeBtn.setAttribute('aria-pressed', light);
}

try {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }
} catch (e) {}
updateThemeButton();

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    updateThemeButton();
    try {
        localStorage.setItem('theme',
            document.body.classList.contains('light-theme') ? 'light' : 'dark');
    } catch (e) {}
});


const form      = document.querySelector('#subscribe-form');
const nameInput = document.querySelector('#sub-name');
const mailInput = document.querySelector('#sub-email');
const statusMsg = document.querySelector('#form-status');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


function getError(field) {
    if (field === nameInput) {
        const v = nameInput.value.trim();
        if (!v) return 'Введіть ім’я';
        if (v.length < 2) return 'Мінімум 2 символи';
    }
    if (field === mailInput) {
        const v = mailInput.value.trim();
        if (!v) return 'Введіть email';
        if (!emailRe.test(v)) return 'Невірний email';
    }
    return '';
}

function showError(field) {
    const msg = getError(field);
    document.querySelector('#err-' + field.id.replace('sub-', '')).textContent = msg;
    field.classList.toggle('invalid', msg !== '');
    field.setAttribute('aria-invalid', msg !== '');
    return msg === '';
}

[nameInput, mailInput].forEach(field => {
    field.addEventListener('blur', () => showError(field));            
    field.addEventListener('input', () => {                            
        statusMsg.textContent = '';
        if (field.classList.contains('invalid')) showError(field);     
    });
});

form.addEventListener('submit', event => {                             
    event.preventDefault();                                            

    const results = [nameInput, mailInput].map(showError);
    if (results.includes(false)) {
        statusMsg.textContent = '';
        form.querySelector('.invalid').focus();
        return;
    }

    const name = nameInput.value.trim();
    form.reset();
    statusMsg.textContent = 'Дякуємо, ' + name + '! Ви підписані.';
    alert('Дякуємо, ' + name + '! Ми повідомимо вас про нові релізи.'); 
});


document.addEventListener('keydown', event => {
    const typing = event.target.closest('input, textarea, select, button, audio');

    
    if (event.key === 'Escape' && form.contains(event.target)) {
        form.reset();
        form.querySelectorAll('.error').forEach(e => { e.textContent = ''; });
        form.querySelectorAll('.invalid').forEach(i => i.classList.remove('invalid'));
        statusMsg.textContent = '';
        event.target.blur();
        return;
    }

    if (typing) return;   

    if (event.code === 'Space') {          
        event.preventDefault();
        togglePlay();
    } else if (event.key === 'ArrowRight') {
        select(current + 1);
    } else if (event.key === 'ArrowLeft') {
        select(current - 1);
    }
});


const toTop = document.querySelector('#to-top');

window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 200);
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});