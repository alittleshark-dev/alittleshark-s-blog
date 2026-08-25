const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = '浅色模式'; // 按钮文字变化
}

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '切换浅色';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '切换深色';
    }
});
