/// <reference types="chrome" />
import { useState, useEffect, type ChangeEvent } from 'react';
import './App.css';

// 1. Описываем интерфейсы типов
interface Clue {
  id?: string;
  title: string;
  url: string;
  caseId?: string;
}

interface Case {
  id: string;
  title: string;
  clues?: Clue[];
}

interface StatusState {
  msg: string;
  color: string;
}

const API_URL = 'http://localhost:3000';

function App() {
  // React State
const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const [username, setUsername] = useState('')
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [newCaseTitle, setNewCaseTitle] = useState<string>('');
  const [status, setStatus] = useState<StatusState>({ msg: '', color: '' });

  // Вспомогательная функция для отображения статуса
  const showStatus = (msg: string, color: string) => {
    setStatus({ msg: `> ${msg}`, color });
  };
  const saveToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  
  // Формируем payload: если регистрация — передаем username, email, password
  const payload = isRegister 
    ? { username, email, password } 
    : { email, password };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // 👈 Раньше тут пропадал username
    });

    const data = await res.json();
    if (!res.ok) {
      // Если NestJS вернул массив ошибок от class-validator
      const errorMessage = Array.isArray(data.message) 
        ? data.message.join(', ') 
        : data.message;
      throw new Error(errorMessage || 'AUTH_FAILED');
    }

    // Сохраняем токен
    saveToken(data.access_token);
  } catch (err: any) {
    setError(err.message || 'AUTH_ERROR');
  }
};
  if (!token) {
    return (
      <div style={{ padding: 20, color: '#00ff66', backgroundColor: '#0a0a0a', fontFamily: 'monospace' }}>
        <h2>GHOST_COLLECTOR // AUTH</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: 10 }}>
    <label>USERNAME:</label><br />
    <input 
      type="text" 
      value={username} 
      onChange={(e) => setUsername(e.target.value)} 
      required 
    />
  </div>
          <div>
            <label>EMAIL:</label><br />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>PASSWORD:</label><br />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" style={{ marginTop: 15 }}>
            {isRegister ? 'REGISTER' : 'LOGIN'}
          </button>
        </form>
        <button 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ marginTop: 10, background: 'none', border: 'none', color: '#00ff66', cursor: 'pointer' }}
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    );
  }

  // --- 1. Загрузка списка кейсов ---
  const loadCases = async () => {
    try {
      const res = await fetch(`${API_URL}/cases`);
      if (!res.ok) throw new Error('Fetch failed');

      const data: Case[] = await res.json();
      setCases(data);

      if (data.length > 0) {
        // Если выбранного кейса нет или он был удален — ставим первый по умолчанию
        setSelectedCaseId((prev) => (prev ? prev : data[0].id));
      } else {
        setSelectedCaseId('');
      }
    } catch (err) {
      showStatus('ERR_CONNECTION_FAILED', '#ff3366');
    }
  };

  // Автоматический старт загрузки при монтировании компонента
  useEffect(() => {
    loadCases();
  }, []);

  // Находим текущий выбранный объект кейса
  const activeCase = cases.find((c) => c.id === selectedCaseId);

  // --- 2. Создание нового кейса (POST /cases) ---
  const handleCreateCase = async () => {
    const title = newCaseTitle.trim();
    if (!title) {
      showStatus('ENTER_CASE_NAME', '#ff3366');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cases`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: newCaseTitle,
  }),
})

      if (res.ok) {
        setNewCaseTitle('');
        showStatus('CASE_INITIALIZED', '#00ff66');
        await loadCases();
      } else {
        showStatus('ERR_CASE_CREATE_FAILED', '#ff3366');
      }
    } catch (err) {
      showStatus('ERR_SERVER_OFFLINE', '#ff3366');
    }
  };

  // --- 3. Сохранение текущей вкладки как улики (POST /clues) ---
  const handleDumpCurrentTab = async () => {
    if (!selectedCaseId) {
      showStatus('SELECT_OR_CREATE_CASE_FIRST', '#ff3366');
      return;
    }

    // Проверяем наличие chrome.tabs (безопасно для разработки в обычном браузере)
    if (typeof chrome === 'undefined' || !chrome?.tabs)  {
      showStatus('ERR_CHROME_API_NOT_AVAILABLE', '#ff3366');
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        showStatus('ERR_NO_ACTIVE_TAB', '#ff3366');
        return;
      }

      const res = await fetch(`${API_URL}/clues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tab.title || tab.url,
          url: tab.url,
          caseId: selectedCaseId,
        }),
      });

      if (res.ok) {
        showStatus('DUMP_SUCCESSFUL', '#00ff66');
        await loadCases(); // Обновляем список, чтобы улика сразу появилась
      } else {
        const errorData = await res.json();
        showStatus(`ERR: ${errorData.message || 'DUMP_FAILED'}`, '#ff3366');
      }
    } catch (err) {
      showStatus('ERR_SERVER_OFFLINE', '#ff3366');
    }
  };
  // Функция удаления улики
const deleteClue = async (clueId: string) => {
  if (!clueId) {
    showStatus('CLUE_ID_NOT_FOUND', '#ff3366');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/clues/${clueId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      showStatus('CLUE_DELETED_SUCCESSFULLY', '#00ff66');
      await loadCases(); // Обновляем список кейсов
    } else {
      const errorData = await res.json();
      showStatus(`ERR: ${errorData.message || 'DELETE_FAILED'}`, '#ff3366');
    }
  } catch (err) {
    showStatus('ERR_SERVER_OFFLINE', '#ff3366');
  }
};

  return (
    <div className="ghost-collector">
      {/* HEADER TITLE */}
      <h2>GHOST_COLLECTOR</h2>

      {/* SECTION 0 — SESSION CONTROL */}
      <div className="section section-header">
        <button onClick={handleLogout}>LOGOUT</button>
      </div>

      {/* SECTION 1 — SELECT ACTIVE CASE */}
      <div className="section">
        <h3>[01] SELECT_ACTIVE_CASE</h3>

        <select
          value={selectedCaseId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSelectedCaseId(e.target.value)
          }
        >
          {cases.length === 0 ? (
            <option value="">NO_CASES_FOUND</option>
          ) : (
            cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
                 
              </option>
            ))
          )}
        </select>

        <input
          type="text"
          placeholder="NEW_CASE_NAME..."
          value={newCaseTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewCaseTitle(e.target.value)
          }
        />
        <button id="actionBtn" onClick={handleCreateCase}>
          INITIALIZE_CASE
        </button>
        
      </div>

      {/* SECTION 2 — DATA CAPTURE */}
      <div className="section">
        <h3>[02] DATA_CAPTURE</h3>
        <button onClick={handleDumpCurrentTab}>
          DUMP_CURRENT_TAB_TO_CASE
        </button>
        {status.msg && (
          <div id="status" style={{ color: status.color, marginTop: '8px' }}>
            {status.msg}
          </div>
        )}
      </div>

      {/* SECTION 3 — CAPTURED CLUES LOG */}
      <div className="section">
        <h3>[03] CAPTURED_CLUES_LOG</h3>
        <ul>
          {!activeCase ||
          !activeCase.clues ||
          activeCase.clues.length === 0 ? (
            <li>NO_CLUES_ATTACHED</li>
          ) : (
            activeCase.clues.map((clue, idx) => (
              <li key={clue.id || idx}>
                <a href={clue.url} target="_blank" rel="noreferrer">
                  {clue.title || clue.url}
                </a>
                {/* if (clue.id) {
  deleteClue(clue.id)
} */}
                <button className='deleteButton' onClick={() => clue.id && deleteClue(clue.id)}>🗑️</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;