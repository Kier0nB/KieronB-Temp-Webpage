const tasks = document.querySelectorAll('.task');
const total = tasks.length;
const completed = document.querySelectorAll('.task:checked').length;
const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

document.getElementById('progressBar').style.width = percent + '%';


function positionToggle() {
    const firstSection = document.querySelector('.bento-grid section');
    const toggle = document.querySelector('.theme-toggle');
    
    if (!firstSection || !toggle) return;
    
    const gapFromTop = firstSection.getBoundingClientRect().top;
    const toggleHeight = toggle.offsetHeight;
    
    // Centre the toggle vertically in the gap (accounting for its own height)
    const togglePosition = (gapFromTop - toggleHeight) / 2;
    
    toggle.style.top = togglePosition + 'px';
}

document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('darkmode');
});


positionToggle();

window.addEventListener('resize', positionToggle);