/// <reference types="chrome" />
import { useState, useEffect, type ChangeEvent } from 'react';
import './App.css';


interface Clue {
  id?: string;
  title: string;
  url: string;
  // caseId?: string;
  createdAt: string
}

interface Case {
  id: string;
  title: string;
  clues?: Clue[];
  tags?: string[];
  createdAt: string
}

interface StatusState {
  msg: string;
  color: string;
}

const API_URL = 'https://188.242.124.186';
// const API_URL = 'http://localhost:3000';

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
  const [caseTag, setNewCaseTag] = useState<string>('');





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
      <div style={{ 
  padding: 24, 
  color: '#e4e4e7', 
  backgroundColor: '#0d0d12', 
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  borderRadius: 12
}}>
  <h2 style={{ 
    fontSize: 15, 
    fontWeight: 600, 
    color: '#f4f4f5', 
    margin: '0 0 20px 0',
    borderBottom: '1px solid #1f1f27',
    paddingBottom: 14
  }}>
    Threadline// AUTH
  </h2>
  {error && (
    <div style={{ 
      color: '#f87171', 
      background: 'rgba(248, 113, 113, 0.08)',
      border: '1px solid #3f1f24',
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      marginBottom: 12
    }}>
      {error}
    </div>
  )}
  <form onSubmit={handleAuth}>
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#71717a', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        USERNAME:
      </label><br />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px 12px',
          marginTop: 6,
          background: '#16161d',
          border: '1px solid #26262f',
          borderRadius: 8,
          color: '#e4e4e7',
          fontSize: 13,
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#71717a', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        EMAIL:
      </label><br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px 12px',
          marginTop: 6,
          background: '#16161d',
          border: '1px solid #26262f',
          borderRadius: 8,
          color: '#e4e4e7',
          fontSize: 13,
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#71717a', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        PASSWORD:
      </label><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px 12px',
          marginTop: 6,
          background: '#16161d',
          border: '1px solid #26262f',
          borderRadius: 8,
          color: '#e4e4e7',
          fontSize: 13,
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
    <button 
      type="submit" 
      style={{ 
        marginTop: 8,
        width: '100%',
        padding: '11px 12px',
        background: '#6366f1',
        border: '1px solid #6366f1',
        borderRadius: 8,
        color: '#ffffff',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer'
      }}
    >
      {isRegister ? 'REGISTER' : 'LOGIN'}
    </button>
  </form>
  <button
    onClick={() => setIsRegister(!isRegister)}
    style={{ 
      marginTop: 14, 
      background: 'none', 
      border: 'none', 
      color: '#a5b4fc', 
      cursor: 'pointer',
      fontSize: 12,
      padding: 0,
      width: 'auto'
    }}
  >
    {isRegister ? 'Already have an account? Log in!' : 'No account? Register!'}
  </button>
</div>
    );
  }

  // --- 1. Загрузка списка кейсов ---
  const loadCases = async () => {
    try {
      const res = await fetch(`${API_URL}/cases`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
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
  if (token) {
    loadCases();
  }
}, [token]);
//  const loadClues = async () => {
//   try {
//     const res = await fetch(`${API_URL}/clues`);

//     if (!res.ok) {
//       throw new Error("Fetch failed");
//     }

//     const cluesData: Clue[] = await res.json();
//     setCluesState(cluesData); // ✅ Теперь точно работает
//   } catch (err) {
//     showStatus("ERR_CONNECTION_FAILED", "#ff3366");
//   }
// };

//  useEffect(() => {
//   loadClues();
// }, []);



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
          // tag: caseTag
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


  const handleAddTag = async (caseId: string, tag: string) => {
    const res = await fetch(`${API_URL}/cases/${caseId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tag,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add tag");
    }
        setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? { ...c, tags: [...(c.tags || []), tag.trim()] }
          : c
      )
    );

    return await res.json();
  };


  const deleteTag = async (caseId: string, tag: string) => {
    const res = await fetch(`${API_URL}/cases/${caseId}/tags`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tag,
      }),
    });
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? { ...c, tags: (c.tags || []).filter(t => t !== tag) }
          : c
      )
    );
    if (!res.ok) {
      throw new Error("Failed to add tag");
    }

    return await res.json();
  };


  // --- 3. Сохранение текущей вкладки как улики (POST /clues) ---
  const handleDumpCurrentTab = async () => {
    if (!selectedCaseId) {
      showStatus('SELECT_OR_CREATE_CASE_FIRST', '#ff3366');
      return;
    }

    // Проверяем наличие chrome.tabs (безопасно для разработки в обычном браузере)
    if (typeof chrome === 'undefined' || !chrome?.tabs) {
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
         headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
        body: JSON.stringify({
          title: tab.title || tab.url,
          url: tab.url,
          caseId: selectedCaseId,
        }),
      });

      if (res.ok) {
        showStatus('DUMP_SUCCESSFUL', '#00ff66');
        await loadCases(); // Обновляем список, чтобы улика сразу появилась
       
        // await loadClues()
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


// const handleCaptureScreenshot = () => {
//   console.log('📸 Делаем скриншот...');
  
//   // Делаем скриншот прямо здесь
//   chrome.tabs.captureVisibleTab(
//     { format: 'jpeg', quality: 80 },
//     async (dataUrl) => {
//       // Проверяем ошибку
//       if (chrome.runtime.lastError || !dataUrl) {
//         console.error('❌ Ошибка:', chrome.runtime.lastError?.message);
//         showStatus('❌ ' + (chrome.runtime.lastError?.message || 'Ошибка скриншота'), '#ff3366');
//         return;
//       }

//       console.log('✅ Скриншот сделан!');

//       // Отправляем на сервер
//       try {
//         const response = await fetch(`${API_URL}/clues`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             title: '[SCREENSHOT]',
//             url: dataUrl,
//             caseId: selectedCaseId,
//           }),
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('❌ Ошибка сервера:', response.status, errorText);
//           showStatus(`❌ Сервер: ${response.status}`, '#ff3366');
//           return;
//         }
        

//         // Успех!
//         // await loadClues()
//         console.log('✅ Скриншот отправлен!');
//         showStatus('✅ Скриншот сохранен!', '#00ff66');

//       } catch (error) {
//         console.error('❌ Ошибка отправки:', error);
//         showStatus('❌ Ошибка сети', '#ff3366');
//       }
//     }
//   );
// };



  return (
   <div className="ghost-collector">
      <h2>Threadline</h2>

      <div className="section section-header">
        <button onClick={handleLogout}>LOGOUT</button>
      </div>
      <div className="beetwener">
<div className="paySection">
  <h3>[04] GET_STATS</h3>
<p>
  {cases.map((c, id) => (
    <div style={{display:'flex', flexDirection:'column', gap: '10px'}}>
      <span key={id}>
      CREATED_AT:{new Date(c.createdAt).toLocaleString('ru-RU')}
    </span>
            <span>
        {c.clues?.length 
          ? `SOURCES: ${c.clues.length}` 
          : 'NO_SOURCES'}
      </span>
      <span>
        {c.tags?.length 
          ? `TAGS: ${c.tags.length}` 
          : 'NO_TAGS'}
      </span>
    </div>
    
  ))}
</p>



<h3>[05] GET_SOURCES</h3>
<ul style={{ 
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0px'
}}>
  {!activeCase || !activeCase.clues || activeCase.clues.length === 0 ? (
    <li style={{ 
      listStyle: 'none', 
      color: '#666',
      padding: '10px',
      textAlign: 'center',
      fontSize: '14px'
    }}>
      NO_SOURCES
    </li>
  ) : (
    [...activeCase.clues]
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
      .map((clue, idx, sortedArr) => {
      const isScreenshot = clue.url && clue.url.startsWith('data:');
      const isLast = idx === sortedArr.length - 1;
      return (
        <li key={clue.id || idx} style={{ 
          listStyle: 'none',
          padding: '6px 0 20px 0',
          position: 'relative',
          paddingLeft: '24px'
        }}>
          {/* NEW: точка графа */}
          <div style={{
            position: 'absolute',
            left: '0px',
            top: '4px',
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 6px #6366f1',
            zIndex: 2
          }} />

          {/* NEW: соединяющая линия вниз (кроме последнего элемента) */}
          {!isLast && (
            <div style={{
              position: 'absolute',
              left: '5px',
              top: '15px',
              bottom: '-14px',
              width: '1px',
              background: '#6366f1',
              zIndex: 1
            }} />
          )}

          {/* NEW: дата создания */}
          {clue.createdAt && (
            <div style={{
              fontSize: '9px',
              color: '#4a5a6a',
              marginBottom: '4px',
              letterSpacing: '0.5px'
            }}>
              {new Date(clue.createdAt).toLocaleString('ru-RU')}
            </div>
          )}

          {isScreenshot ? (
            <div style={{ marginBottom: '4px' }}>
              <img
                src={clue.url}
                alt={clue.title || 'Скриншот'}
                style={{ 
                  width: "100%",
                  maxWidth: "350px",
                  height: "auto",
                  maxHeight: "250px",
                  objectFit: "contain",
                  borderRadius: "6px",
                  cursor: 'pointer',
                  display: 'block'
                }}
                onClick={() => window.open(clue.url, '_blank')}
              />
              {clue.title && (
                <div style={{ 
                  fontSize: '11px', 
                  color: '#888', 
                  marginTop: '3px'
                }}>
                  {clue.title}
                </div>
              )}
            </div>
          ) : (
            
             <a href={clue.url}
              target="_blank"
              rel="noreferrer"
              style={{ 
                display: 'block',
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#64B5F6',
                fontSize: '13px',
                wordBreak: 'break-all'
              }}> 
            
              🔗 {clue.title || clue.url}
            </a>
            
          )}
            <button
            className='deleteButton'
            onClick={() => clue.id && deleteClue(clue.id)}
            style={{
              marginTop: '4px',
              background: 'transparent',
              color: '#ff6b6b',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🗑️ 
          </button>

        
        </li>
      );
    })
  )}
</ul>



 
  
</div>

<div className="mainSection">
      <div className="section">
        <h3>[01] SELECT_ACTIVE_FOLDER</h3>
        <select value={selectedCaseId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCaseId(e.target.value)}>
          {cases.length === 0 ? <option value="">NO_FOLDER_FOUND</option> : cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        {activeCase && (
          <div>
            <h4>TAGS:</h4>
            <div className="tags">
              {activeCase?.tags?.map(tag => (
                <span className="tag" key={tag}>
                  #{tag}
                  <button className="deleteButton" onClick={() => deleteTag(selectedCaseId, tag)}>🗑️</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <input type="text" placeholder="NEW_FOLDER_NAME..." value={newCaseTitle} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCaseTitle(e.target.value)} />
        <input type="text" placeholder="NEW_FOLDER_TAG..." value={caseTag} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCaseTag(e.target.value)} />
        <button id="actionBtn" onClick={handleCreateCase}>INITIALIZE_FOLDER</button>
        <button onClick={() => handleAddTag(selectedCaseId, caseTag)}>ADD_TAG</button>
      </div>

      {/* 🔥 ИЗМЕНЕННАЯ СЕКЦИЯ 2 — КНОПКИ В РЯД */}
      <div className="section">
        <h3>[02] DATA_CAPTURE</h3>
        <div className="capture-buttons">
          <button onClick={handleDumpCurrentTab}>DUMP_TAB</button>
          
        </div>
        {status.msg && <div id="status" style={{ color: status.color, marginTop: '8px' }}>{status.msg}</div>}
      </div>


      </div>
      </div>
    </div>
  );
}

export default App;