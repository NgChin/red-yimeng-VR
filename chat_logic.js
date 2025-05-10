let currentCharacter = '毛泽东';
let language = 'zh';
let chatHistory = [];

const texts = {
  zh: {
    title: '红色沂蒙纪念馆',
    subtitle: '红色VR体验厅之与革命人物面对面对话系统',
    inputPlaceholder: '请输入您的问题...',
    send: '发送',
    langLabel: '语言选择：',
    characterLabel: '人物选择：',
    characters: ['毛泽东', '周恩来', '彭德怀', '其他人物正在添加中'],
    langOptions: ['中文', 'English', '更多语言支持正在开发中'],
    moreCharactersAlert: 'AI对话系统目前正在建设中\n其他人物目前正在陆续添加\n谢谢您的理解。',
    moreLanguagesAlert: 'AI对话系统目前正在建设中\n其他相关语言支持正在努力添加\n谢谢您的理解。'
  },
  en: {
    title: 'Red Yimeng Memorial Hall',
    subtitle: 'Red VR Experience: Face-to-Face Dialogues with Revolutionary Figures',
    inputPlaceholder: 'Enter your question...',
    send: 'Send',
    langLabel: 'Language:',
    characterLabel: 'Figure:',
    characters: ['Mao Zedong', 'Zhou Enlai', 'Peng Dehuai', 'More figures coming soon'],
    langOptions: ['中文', 'English', 'More languages coming soon'],
    moreCharactersAlert: 'AI Dialogue System under construction\nMore figures are being added\nThank you for your understanding.',
    moreLanguagesAlert: 'AI Dialogue System under construction\nAdditional language support is in progress\nThank you for your understanding.'
  }
};

const keywordResponses = {
  zh: {
    毛泽东: {
      革命: '革命不是请客吃饭，而是一个阶级推翻另一个阶级的斗争。',
      群众: '人民，只有人民，才是创造世界历史的动力。',
      实事求是: '实事求是，是我们党的思想路线的核心。',
      你好: '你好，同志，我是毛泽东。',
	  你是谁:'你好，我是毛泽东。'
    },
    周恩来: {
      外交: '外交工作要讲究策略，要坚定也要灵活。',
      青年: '为中华之崛起而读书。',
      团结: '团结是我们取得胜利的基础。',
      你好: '你好，同志，我是周恩来。',
	  你是谁:'你好，我是周恩来。'
    },
    彭德怀: {
      军队: '军队是为人民服务的武装力量。',
      战争: '我们不怕战争，但也不轻易发动战争。',
      原则: '我宁愿站着死，也不跪着生。',
      你好: '你好，同志，我是彭德怀。',
	  你是谁:'你好，我是彭德怀。'
    }
  },
  en: {
    'Mao Zedong': {
      revolution: 'Mao Zedong: Revolution is not a dinner party, it is a violent struggle of one class overthrowing another.',
      people: 'Mao Zedong: The people, and the people alone, are the motive force in the making of world history.',
      truth: 'Mao Zedong: Seek truth from facts—that is the core of our line.',
      Hello: 'Hi, comrade. I am Mao Zedong.',
	  'who are you': 'Hello, comrade. I am Mao Zedong.'
    },
    'Zhou Enlai': {
      diplomacy: 'Zhou Enlai: Diplomacy requires both firmness and flexibility.',
      youth: 'Zhou Enlai: I studied for the rise of China.',
      unity: 'Zhou Enlai: Unity is the cornerstone of our success.',
      Hello: 'Hi, comrade. I am Zhou Enlai.',
	  'who are you': 'Hello, comrade. I am Zhou Enlai.'
    },
    'Peng Dehuai': {
      army: 'Peng Dehuai: The army is the armed force to serve the people.',
      war: 'Peng Dehuai: We do not fear war, but we do not initiate it lightly.',
      principle: 'Peng Dehuai: I’d rather die standing than live kneeling.',
      Hello: 'Hi, comrade. I am Peng Dehuai.',
	  'who are you': 'Hello, comrade. I am Peng Dehuai.'
    }
  }
};

// 智谱大模型 API 调用
async function callZhipuAPI(prompt) {
  const apiKey = '10d0fd55357546cd927e961c9b056f9c.cdBimK2fbRVwSXaQ'; // 替换为你的 API 密钥
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  const systemPrompt = language === 'zh'
    ? `你现在就是${currentCharacter}本人。回答时不要自称为助手，也不要使用“作为${currentCharacter}”这类开场白，请直接、自然地用${currentCharacter}的语气回答用户的问题。`
    : `You are now ${currentCharacter} in person. Do not say "As ${currentCharacter}" or refer to yourself as an assistant. Answer questions directly and naturally in the tone and style of ${currentCharacter}, as if you are speaking your own thoughts.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [
        { role: "system", content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      top_p: 0.9
    })
  });

  const data = await response.json();
  if (data.choices && data.choices[0]) {
    return data.choices[0].message.content.trim();
  } else {
    return language === 'zh'
      ? '对不起，我现在无法回答您的问题。'
      : "Sorry, I can't answer your question right now.";
  }
}

function setLanguage(lang) {
  const select = document.getElementById('langSelect');
  if (lang === 'more') {
    alert(texts[language].moreLanguagesAlert);
    select.value = language;
    return;
  }
  language = lang;
  const t = texts[lang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('sub-title').textContent = t.subtitle;
  document.getElementById('userInput').placeholder = t.inputPlaceholder;
  document.getElementById('send-button').textContent = t.send;
  document.getElementById('lang-label').textContent = t.langLabel;
  document.getElementById('character-label').textContent = t.characterLabel;
  document.getElementById('chat').innerHTML = '';
  chatHistory = [];
  updateCharacterOptions();
}

function updateCharacterOptions() {
  const select = document.getElementById('characterSelect');
  select.innerHTML = '';
  texts[language].characters.forEach(char => {
    const option = document.createElement('option');
    option.value = char;
    option.textContent = char;
    select.appendChild(option);
  });
  currentCharacter = texts[language].characters[0];
  updateChatHeader(currentCharacter);
}

function handleCharacterSelection(value) {
  if (value.includes('其他') || value.includes('More')) {
    alert(texts[language].moreCharactersAlert);
    document.getElementById('characterSelect').value = currentCharacter;
    return;
  }
  currentCharacter = value;
  updateChatHeader(value);
}

function updateChatHeader(character) {
  document.getElementById('chat-header').textContent = character;
}

function addMessage(text, sender) {
  const chat = document.getElementById('chat');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
  if (sender !== 'system') chatHistory.push({ sender, text });
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const userText = input.value.trim();
  if (!userText) return;
  addMessage(userText, 'user');
  input.value = '';
  generateAIResponse(userText);
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// AI响应逻辑：优先关键词，否则用大模型
async function generateAIResponse(userText) {
  const keywords = keywordResponses[language]?.[currentCharacter] || {};
  let response = null;

  // 搜索关键词响应
  for (let keyword in keywords) {
    if (userText.includes(keyword)) {
      response = keywords[keyword];
      // 直接跳过“正在回复中...”，直接显示关键词响应
      typeWriterEffect(response);
      return; // 直接返回，避免继续执行后续代码
    }
  }

  // 显示正在回复中...（只有在没有关键词匹配时）
  addMessage('正在回复中...', 'ai');

  // 清空聊天历史中的最后一条“正在回复中...”提示
  setTimeout(() => {
    const chat = document.getElementById('chat');
    const lastMessage = chat.lastChild;
    if (lastMessage && lastMessage.textContent === '正在回复中...') {
      chat.removeChild(lastMessage);
    }
  }, 3000);

  // 如果没有关键词匹配，则调用API
  response = await callZhipuAPI(userText);

  // 打字机效果
  typeWriterEffect(response);
}

function typeWriterEffect(text) {
  const chat = document.getElementById('chat');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai';
  chat.appendChild(messageDiv);
  
  let index = 0;
  const interval = setInterval(() => {
    messageDiv.textContent += text[index];
    index++;
    if (index === text.length) {
      clearInterval(interval);
    }
  }, 50); // 控制打字机速度，可以调整50为不同速度
  chat.scrollTop = chat.scrollHeight;
}

// 初始化
updateCharacterOptions();
