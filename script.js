const tasks = document.querySelectorAll('.task');
const total = tasks.length;
const completed = document.querySelectorAll('.task:checked').length;
const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

document.getElementById('progressBar').style.width = percent + '%';