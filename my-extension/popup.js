// const API_URL = 'http://localhost:3000';

// document.addEventListener('DOMContentLoaded', async () => {
//   const caseSelect = document.getElementById('caseSelect');
//   const newCaseInput = document.getElementById('newCaseInput');
//   const createCaseBtn = document.getElementById('createCaseBtn');
//   const actionBtn = document.getElementById('actionBtn');
//   const linksList = document.getElementById('linksList');
//   const statusDiv = document.getElementById('status');

//   let loadedCases = [];

//   // --- 1. Функция загрузки всех кейсов с NestJS ---
//   async function loadCases() {
//     try {
//       const res = await fetch(`${API_URL}/cases`);
//       loadedCases = await res.json();

//       caseSelect.innerHTML = '';

//       if (loadedCases.length === 0) {
//         caseSelect.innerHTML = '<option value="">NO_CASES_FOUND</option>';
//         linksList.innerHTML = '<li>NO_DATA</li>';
//         return;
//       }

//       loadedCases.forEach(c => {
//         const opt = document.createElement('option');
//         opt.value = c.id;
//         opt.textContent = c.title;
//         caseSelect.appendChild(opt);
//       });

//       // Отображаем улики первого кейса в списке
//       renderCluesForSelectedCase();
//     } catch (err) {
//       showStatus('ERR_CONNECTION_FAILED', '#ff3366');
//     }
//   }

//   // --- 2. Функция отображения улик для выбранного кейса ---
//   function renderCluesForSelectedCase() {
//     const selectedCaseId = caseSelect.value;
//     linksList.innerHTML = '';

//     const foundCase = loadedCases.find(c => c.id === selectedCaseId);

//     if (!foundCase || !foundCase.clues || foundCase.clues.length === 0) {
//       linksList.innerHTML = '<li>NO_CLUES_ATTACHED</li>';
//       return;
//     }

//     foundCase.clues.forEach(clue => {
//       const li = document.createElement('li');
//       const a = document.createElement('a');
//       a.href = clue.url;
//       a.target = '_blank';
//       a.textContent = clue.title || clue.url;
//       li.appendChild(a);
//       linksList.appendChild(li);
//     });
//   }

//   // При смене выборки в <select> обновляем список улик
//   caseSelect.addEventListener('change', renderCluesForSelectedCase);

//   // --- 3. Создание нового кейса (POST /cases) ---
//   createCaseBtn.addEventListener('click', async () => {
//     const title = newCaseInput.value.trim();
//     if (!title) {
//       showStatus('ENTER_CASE_NAME', '#ff3366');
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/cases`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title }),
//       });

//       if (res.ok) {
//         newCaseInput.value = '';
//         showStatus('CASE_INITIALIZED', '#00ff66');
//         await loadCases(); // Перезагружаем список
//       } else {
//         showStatus('ERR_CASE_CREATE_FAILED', '#ff3366');
//       }
//     } catch (err) {
//       showStatus('ERR_SERVER_OFFLINE', '#ff3366');
//     }
//   });

//   // --- 4. Сохранение текущей вкладки как улики (POST /clues) ---
//   actionBtn.addEventListener('click', async () => {
//     const caseId = caseSelect.value;
//     if (!caseId) {
//       showStatus('SELECT_OR_CREATE_CASE_FIRST', '#ff3366');
//       return;
//     }

//     // Запрашиваем URL и Заголовок активной вкладки Chrome
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     if (!tab || !tab.url) {
//       showStatus('ERR_NO_ACTIVE_TAB', '#ff3366');
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/clues`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: tab.title || tab.url,
//           url: tab.url,
//           caseId: caseId,
//         }),
//       });

//       if (res.ok) {
//         showStatus('DUMP_SUCCESSFUL', '#00ff66');
//         await loadCases(); // Обновляем список, чтобы улика сразу появилась в логе
//       } else {
//         const errorData = await res.json();
//         showStatus(`ERR: ${errorData.message || 'DUMP_FAILED'}`, '#ff3366');
//       }
//     } catch (err) {
//       showStatus('ERR_SERVER_OFFLINE', '#ff3366');
//     }
//   });

//   // Вспомогательная функция для статуса
//   function showStatus(msg, color) {
//     statusDiv.textContent = `> ${msg}`;
//     statusDiv.style.color = color;
//   }

//   // Старт: загружаем кейсы при открытии
//   loadCases();
// });