const app = document.getElementById("app");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

const mockVacancies = [
  { id: 1, title: "Estágio em Engenharia de Software", company: "Tech Solutions", desc: "Desenvolvimento full-stack com foco em Python e Django. Oportunidade para participar de projetos industriais e inovação.", salary: "R$ 1.500/mês", modality: "Híbrido", requirements: "Cursando 4º ano de Engenharia, conhecimento em Git." },
  { id: 2, title: "Auxiliar de Marketing Digital", company: "Startup X", desc: "Suporte na criação e execução de campanhas digitais e gestão de mídias sociais para branding.", salary: "R$ 1.200/mês", modality: "Remoto", requirements: "Conhecimento em Google Ads e Meta Ads, superior em andamento em Marketing." },
  { id: 3, title: "Bolsista de Pesquisa em IA", company: "Universidade UFA", desc: "Atuação em projeto de pesquisa focado em NLP (Processamento de Linguagem Natural) para assistentes virtuais.", salary: "R$ 2.000/mês", modality: "Presencial", requirements: "Experiência em Machine Learning, Python e bibliotecas como TensorFlow." },
];

document.addEventListener("DOMContentLoaded", () => {
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("show");
      menuToggle.textContent = menu.classList.contains("show") ? "✕" : "☰";
    });
  }

  try {
    const user = JSON.parse(localStorage.getItem("uniconUser"));
    if (user) showUser(user);
  } catch (e) {
    console.warn("Erro ao acessar localStorage:", e);
  }
  
  
  const navResume = document.getElementById("nav-resume");
  if (navResume) {
    const myApplicationsButton = document.createElement('button');
    myApplicationsButton.id = 'nav-applications';
    myApplicationsButton.className = 'ghost';
    myApplicationsButton.setAttribute('onclick', "navigate('applications')");
    myApplicationsButton.textContent = 'Minhas Candidaturas';
 
    navResume.parentNode.insertBefore(myApplicationsButton, navResume.nextSibling);
  }
  
  const isDark = localStorage.getItem("isDarkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark");
  }
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  }

  navigate("home");
});

function navigate(view) {
  setActive(view);
  switch (view) {
    case "assistant": renderAssistant(); break;
    case "home": renderHome(); break;
    case "vacancies": renderVacancies(); break;
    case "mentors": renderMentors(); break;
    case "resume": renderResume(); break;
    case "simulator": renderSimulator(); break;
    case "login": renderLoginPage(); break;
    case "register": renderRegisterPage(); break;
    case "company": renderCompanyDashboard(); break;
    case "details": renderVacancyDetails(JSON.parse(localStorage.getItem('currentVacancy'))); break; 
    case "applications": renderMyApplications(); break; 
    default: renderHome();
  }
}

function setActive(navId) {
  document.querySelectorAll('button[id^="nav-"]').forEach(b => b.classList.remove("active"));
  const el = document.getElementById(`nav-${navId}`);
  if (el) el.classList.add("active");
}

function renderHome() {
  app.innerHTML = `
    <section class="card center">
      <h1>Bem-vindo ao Conecta Uni</h1>
      <p class="small">A plataforma que conecta estudantes, professores, universidades e empresas.</p>

      <div class="home-buttons">
        <button class="primary" id="explorar-btn" onclick="activateHomeButton('explorar-btn'); navigate('vacancies')">Explorar Vagas</button>
        <button class="secondary" id="mentoria-btn" onclick="activateHomeButton('mentoria-btn'); navigate('mentors')">Mentoria</button>
        <button class="ghost" onclick="getLocation()">📍 Vagas Próximas</button> 
     </div>
    </section>

    <section class="features" style="margin-top:30px;">
      <div class="feature">
        <img src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png" alt="Oportunidades" />
        <h3>Oportunidades</h3>
        <p>Conecte-se com empresas e programas de estágio alinhados ao seu curso.</p>
      </div>

      <div class="feature">
        <img src="https://cdn-icons-png.flaticon.com/512/4140/4140047.png" alt="Mentoria Acadêmica" />
        <h3>Mentoria Acadêmica</h3>
        <p>Aprenda com professores e pesquisadores de diversas áreas.</p>
      </div>

      <div class="feature">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Projetos e Pesquisas" />
        <h3>Projetos e Pesquisas</h3>
        <p>Participe de projetos interdisciplinares e publique seus resultados.</p>
      </div>
    </section>

    <blockquote class="quote">"Educação e trabalho caminham juntos para transformar o futuro."</blockquote>
  `;
}
function activateHomeButton(id) {
  document.querySelectorAll('.home-buttons button').forEach(btn => {
    btn.classList.remove('active-home');
  });
  document.getElementById(id).classList.add('active-home');
}


function renderVacancies() {
  app.innerHTML = `
    <section class="card">
      <h1>Vagas Disponíveis</h1>
      <p class="small">Clique para ver os detalhes e candidatar-se.</p>
    </section>
  `;

  const container = document.createElement("div");

  // ⭐️ Renderiza cards das vagas
  const cardsHTML = mockVacancies.map(v => `
    <div class="card" style="margin-bottom:10px">
      <h4>${v.title}</h4>
      <p><strong>${v.company}</strong></p>
      <p class="small">${v.desc.substring(0, 80)}...</p>
      <div style="margin-top:8px">
        <button class="secondary" onclick="renderVacancyDetails(${JSON.stringify(v).replace(/"/g, "'")})">
          Ver Detalhes
        </button>
      </div>
    </div>
  `).join("");

  container.innerHTML = cardsHTML;

  app.appendChild(container);
}


function renderVacancyDetails(vacancy) {
  // Armazena a vaga no localStorage
  localStorage.setItem('currentVacancy', JSON.stringify(vacancy));
  
  app.innerHTML = `
    <section class="card">
      <h1>${vacancy.title}</h1>
      <h2>${vacancy.company}</h2>
      <p class="small">
        <strong>Modalidade:</strong> ${vacancy.modality} &nbsp; • &nbsp; <strong>Salário/Bolsa:</strong> ${vacancy.salary}
      </p>
      
      <h3>Descrição da Vaga</h3>
      <p>${vacancy.desc}</p>

      <h3>Requisitos</h3>
      <p>${vacancy.requirements}</p>

      <div style="margin-top:20px; display:flex; gap:10px;">
        <button class="primary" onclick="applyVacancy('${escapeHtml(vacancy.title)}','${escapeHtml(vacancy.company)}', ${vacancy.id})">Candidatar-se</button>
        <button class="ghost" onclick="navigate('vacancies')">Voltar</button>
      </div>
    </section>
  `;
}

function applyVacancy(title, company, id) {
  const user = JSON.parse(localStorage.getItem("uniconUser"));

  if (!user) {
    alert("Você precisa estar logado para se candidatar!");
    navigate("login");
    return;
  }

  const applications =
    JSON.parse(localStorage.getItem(`applications_${user.email}`)) || [];

  if (applications.some(app => app.id === id)) {
    alert(`Você já se candidatou para a vaga de ${title}.`);
    return;
  }

  applications.push({
    id,
    title,
    company,
    status: "Pendente",
    date: new Date().toLocaleDateString("pt-BR")
  });

  localStorage.setItem(
    `applications_${user.email}`,
    JSON.stringify(applications)
  );

  alert(
    `Candidatura enviada para ${company} (vaga: ${title}). O status pode ser acompanhado em "Minhas Candidaturas".`
  );

  navigate("applications");
}

// -------------------------------------------------------------------------
// MINHAS CANDIDATURAS
// -------------------------------------------------------------------------
function renderMyApplications() {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  if (!user) {
    alert("Faça login para ver suas candidaturas.");
    navigate('login');
    return;
  }

  const applications = JSON.parse(localStorage.getItem(`applications_${user.email}`) || "[]");

  app.innerHTML = `
    <section class="card">
      <h1>Minhas Candidaturas</h1>
      <p class="small">Acompanhe o status das suas aplicações para vagas.</p>
    </section>
  `;

  if (applications.length === 0) {
    app.innerHTML += `<section class="card"><p class="center small">Você ainda não se candidatou a nenhuma vaga.</p><div class="center"><button class="primary" onclick="navigate('vacancies')">Explorar Vagas</button></div></section>`;
    return;
  }

  const container = document.createElement("div");
  let hasPending = false;

  applications.forEach(appData => {
    // Lógica de cores para o status
    const statusColor = appData.status === "Pendente" ? "#FFC107" : appData.status === "Em Análise" ? "#2196F3" : appData.status === "Rejeitado" ? "#F44336" : "#4CAF50";
    const statusText = appData.status === "Pendente" ? "Pendente" : appData.status === "Em Análise" ? "Em Análise" : appData.status === "Rejeitado" ? "Rejeitado" : "Convidado para Entrevista";
    
    if (appData.status === "Pendente") hasPending = true;

    const div = document.createElement("div");
    div.className = "card";
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <h4 style="margin-bottom:5px;">${appData.title}</h4>
      <p><strong>${appData.company}</strong></p>
      <p class="small">Candidatado em: ${appData.date}</p>
      <div style="margin-top:10px; padding: 5px 10px; border-radius: 5px; background: ${statusColor}1A; border: 1px solid ${statusColor}; display: inline-block;">
        <strong style="color: ${statusColor}; font-size: 13px;">Status: ${statusText}</strong>
      </div>
    `;
    container.appendChild(div);
  });

  // SIMULAÇÃO DE MUDANÇA DE STATUS (Apenas para demonstração de protótipo)
  if (hasPending && Math.random() < 0.3) {
    const pendingApps = applications.filter(a => a.status === "Pendente");
    if (pendingApps.length > 0) {
      const appToUpdate = pendingApps[Math.floor(Math.random() * pendingApps.length)];
      
      const indexInOriginalArray = applications.findIndex(a => a.id === appToUpdate.id);
      
      appToUpdate.status = Math.random() < 0.7 ? "Em Análise" : "Rejeitado";
      applications[indexInOriginalArray].status = appToUpdate.status;

      localStorage.setItem(`applications_${user.email}`, JSON.stringify(applications));
      
      setTimeout(() => {
        alert(`🚨 O status da sua candidatura para "${appToUpdate.title}" foi atualizado para "${appToUpdate.status}"!`);
        renderMyApplications();
      }, 1500);
    }
  }

  app.appendChild(container);
}


function renderMentors() {
  const mentors = [
    { name: "Prof. Ana Letícia", area: "Inteligência Artificial (IA)", avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140047.png" },
    { name: "Dr. Erik Jhones", area: "Python e Ciência de Dados", avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
    { name: "Prof. Gabriela Torres", area: "Desenvolvimento Web (Front-end e Back-end)", avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png" }
  ];

  app.innerHTML = `
    <section class="card">
      <h1>Mentoria Acadêmica</h1>
      <p class="small">Conecte-se com professores e especialistas em tecnologia, ciência e inovação.</p>
    </section>
  `;

  const container = document.createElement("div");
  container.classList.add("features");

  mentors.forEach(m => {
    const card = document.createElement("div");
    card.classList.add("feature");
    card.innerHTML = `
      <img src="${m.avatar}" alt="${m.name}" />
      <h3>${m.name}</h3>
      <p>${m.area}</p>
      <button class="primary" onclick="openScheduleModal('${m.name}')">
        Solicitar Mentoria
      </button>
    `;
    container.appendChild(card);
  });

  app.appendChild(container);
}

function openScheduleModal(mentorName) {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  if (!user) {
    alert("Você precisa estar logado para agendar uma mentoria!");
    navigate('login');
    return;
  }
  
  const modalHTML = `
    <div id="schedule-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
      <div class="card" style="width:90%; max-width:400px; padding:20px; transform:scale(1); animation:slideFade 0.3s ease;">
        <h2>Agendar Mentoria com ${mentorName}</h2>
        <p class="small">Selecione o dia e horário preferidos.</p>
        
        <label for="schedule-date" style="display:block; margin-top:15px; font-weight:600;">Dia:</label>
        <input type="date" id="schedule-date" min="${new Date().toISOString().split('T')[0]}" required />
        
        <label for="schedule-time" style="display:block; margin-top:10px; font-weight:600;">Horário:</label>
        <input type="time" id="schedule-time" required />
        
        <div style="display:flex; gap:10px; margin-top:20px;">
          <button class="primary" onclick="submitSchedule('${mentorName}')">Confirmar Agendamento</button>
          <button class="ghost" onclick="closeScheduleModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitSchedule(mentorName) {
  const date = document.getElementById('schedule-date').value;
  const time = document.getElementById('schedule-time').value;

  if (!date || !time) {
    alert("Por favor, selecione o dia e o horário.");
    return;
  }

  // Lógica de agendamento simulada
  alert(`Solicitação de mentoria com ${mentorName} agendada para ${date} às ${time}. Você receberá uma confirmação por e-mail.`);
  closeScheduleModal();
}

function closeScheduleModal() {
  const modal = document.getElementById('schedule-modal');
  if (modal) modal.remove();
}

function renderResume() {
  app.innerHTML = `
    <section class="card">
      <h1>Construtor de Currículo</h1>
      <p class="small">Preencha suas informações e gere automaticamente um currículo em PDF.</p>

      <h3>Informações Pessoais</h3>
      <input id="name" placeholder="Nome completo" />
      <input id="email" placeholder="E-mail" />
      <input id="phone" placeholder="Telefone" />
      <input id="linkedin" placeholder="LinkedIn (opcional)" />
      <input id="address" placeholder="Endereço (opcional)" />

      <h3>Objetivo Profissional</h3>
      <textarea id="objective" placeholder="Ex: Busco estágio na área de..." rows="2"></textarea>

      <h3>Formação Acadêmica</h3>
      <input id="course" placeholder="Curso" />
      <input id="institution" placeholder="Instituição de ensino" />
      <input id="academic-years" placeholder="Ano de início e conclusão (ou 'em andamento')" />

      <h3>Experiência Profissional</h3>
      <input id="job-company" placeholder="Empresa" />
      <input id="job-role" placeholder="Cargo" />
      <input id="job-period" placeholder="Período (ex: jan/2023 - atual)" />
      <textarea id="job-description" placeholder="Descreva suas atividades e resultados" rows="3"></textarea>

      <h3>Projetos e Pesquisas</h3>
      <textarea id="projects" placeholder="Descreva seus projetos, TCCs ou pesquisas relevantes" rows="3"></textarea>

      <h3>Habilidades e Competências</h3>
      <textarea id="skills" placeholder="Liste suas principais habilidades" rows="3"></textarea>

      <h3>Idiomas</h3>
      <textarea id="languages" placeholder="Ex: Inglês - intermediário, Espanhol - básico" rows="2"></textarea>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="primary" onclick="generateResumePDF()">Gerar Currículo em PDF</button>
        <button class="ghost" onclick="navigate('home')">Cancelar</button>
      </div>
    </section>
  `;
}

function generateResumePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const field = id => (document.getElementById(id)?.value.trim() || "-");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11, 99, 214);
  doc.text("UNICON — Conecta Uni", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

  let y = 70;
  const addSection = (title, text) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11,99,214);
    doc.setFontSize(12);
    doc.text(title, 40, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0,0,0);
    const split = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 80);
    doc.text(split, 40, y);
    y += split.length * 14 + 10;
    if (y > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage(); y = 40;
    }
  };

  addSection("Informações Pessoais", `Nome: ${field("name")}\nE-mail: ${field("email")}\nTelefone: ${field("phone")}\nLinkedIn: ${field("linkedin")}\nEndereço: ${field("address")}`);
  addSection("Objetivo Profissional", field("objective"));
  addSection("Formação Acadêmica", `${field("course")} — ${field("institution")} (${field("academic-years")})`);
  addSection("Experiência Profissional", `${field("job-company")} — ${field("job-role")} (${field("job-period")})\n${field("job-description")}`);
  addSection("Projetos e Pesquisas", field("projects"));
  addSection("Habilidades e Competências", field("skills"));
  addSection("Idiomas", field("languages"));

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Gerado automaticamente via Conecta Uni — UNICON", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 30, { align: "center" });

  const firstName = field("name") !== "-" ? field("name").split(" ")[0] : "curriculo";
  doc.save(`${firstName}_curriculo.pdf`);
}

function renderSimulator() {
  app.innerHTML = `
    <section class="card">
      <h1>Simulador de Entrevista</h1>
      <p class="small">Responda às perguntas como se estivesse em uma entrevista real.</p>
      <div id="questions"></div>
      <div style="margin-top:12px"><button class="ghost" onclick="navigate('home')">Voltar</button></div>
    </section>
  `;
  renderInterview();
}

function renderInterview() {
  const questions = [
    "Fale um pouco sobre você.",
    "Por que você quer trabalhar nesta empresa?",
    "Quais são seus pontos fortes e fracos?",
    "Conte sobre um desafio que superou.",
    "Como você lida com prazos apertados?",
    "Como você se vê profissionalmente em 5 anos?",
    "O que te motiva a dar o seu melhor no trabalho?",
    "Como você lida com feedbacks negativos?",
    "Descreva um momento em que trabalhou bem em equipe.",
    "O que diferencia você de outros candidatos?",
    "Fale sobre um projeto técnico/academic que você realizou.",
    "Como você organiza seu tempo em múltiplas responsabilidades?"
  ];

  const container = document.getElementById("questions");
  container.innerHTML = "";
  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.marginBottom = "10px";
    div.innerHTML = `<h4>${i + 1}. ${q}</h4><textarea rows="3" id="q${i}"></textarea>`;
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.className = "primary";
  btn.textContent = "Avaliar Minhas Respostas";
  btn.onclick = evaluateInterview;
  container.appendChild(btn);
}

function evaluateInterview() {
  const total = 12;
  let score = 0;
  for (let i = 0; i < total; i++) {
    const val = document.getElementById(`q${i}`).value.trim();
    if (val.length > 50) score += 1;
    const kws = ["projeto","resultado","aprendi","resolver","impacto","trabalhei","equipe","objetivo","metas"];
    for (const kw of kws) {
      if (val.toLowerCase().includes(kw)) { score += 0.3; break; }
    }
  }
  const normalized = Math.min(100, Math.round((score / (total * 1.3)) * 100));
  const feedback = normalized > 80 ? "Excelente desempenho!" : normalized > 60 ? "Bom, mas pode melhorar!" : "Continue praticando!";
  alert(`Avaliação rápida: ${normalized}%\n${feedback}\nDica: use exemplos concretos, números e resultados.`);
}

function renderLoginPage() {
  app.innerHTML = `
    <section class="card">
      <h1>Entrar no Conecta Uni</h1>
      <input id="login-email" placeholder="E-mail" />
      <input id="login-password" type="password" placeholder="Senha" />
      <p class="center" style="margin-bottom:10px;">
        <a href="#" onclick="alert('Funcionalidade de recuperação de senha simulada. Um e-mail de redefinição foi enviado.');" style="color: var(--blue); font-size: 14px; text-decoration:none;">Esqueci a Senha</a>
      </p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="primary" onclick="login()">Entrar</button>
        <button class="ghost" onclick="renderRegisterPage()">Cadastrar</button>
      </div>
    </section>
  `;
}

function renderRegisterPage() {
  app.innerHTML = `
    <section class="card">
      <h1>Criar Conta no Conecta Uni</h1>
      <input id="reg-name" placeholder="Nome completo" />
      <input id="reg-email" placeholder="E-mail" />
      <input id="reg-password" type="password" placeholder="Senha" />
      <select id="reg-role">
        <option value="estudante">Estudante</option>
        <option value="professor">Professor</option>
        <option value="empresa">Empresa</option>
      </select>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="primary" onclick="register()">Cadastrar</button>
        <button class="ghost" onclick="renderLoginPage()">Voltar</button>
      </div>
    </section>
  `;
}

function register() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const role = document.getElementById("reg-role").value;
  if (!name || !email || !password) return alert("Preencha todos os campos.");
  localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, password, role }));
  alert("Cadastro realizado com sucesso! Agora faça login.");
  renderLoginPage();
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const stored = localStorage.getItem(`user_${email}`);
  if (!stored) return alert("Usuário não encontrado.");
  const user = JSON.parse(stored);
  if (user.password !== password) return alert("Senha incorreta.");
  localStorage.setItem("uniconUser", JSON.stringify(user));
  showUser(user);
  navigate("home");
}

function showUser(user) {
  if (loginBtn) loginBtn.classList.add("hidden");
  if (logoutBtn) logoutBtn.classList.remove("hidden");
  if (userInfo) {
    userInfo.classList.remove("hidden");
    userInfo.textContent = `Bem-vindo, ${user.name.split(" ")[0]}`;
  }
}

function logout() {
  localStorage.removeItem("uniconUser");
  if (loginBtn) loginBtn.classList.remove("hidden");
  if (logoutBtn) logoutBtn.classList.add("hidden");
  if (userInfo) {
    userInfo.classList.add("hidden");
    userInfo.textContent = "";
  }
  navigate("home");
}

function renderAssistant() {
  app.innerHTML = `
    <section class="card">
      <h1>Assistente Conecta Uni 🤖</h1>
      <p class="small">Converse comigo! Posso te ajudar a entender as funções da plataforma.</p>
      <div id="chat-box" class="chat-box"></div>
      <div class="chat-input">
        <input id="chat-input" placeholder="Digite sua pergunta..." onkeydown="if(event.key==='Enter')sendMessage()" />
        <button class="primary" onclick="sendMessage()">Enviar</button>
      </div>
    </section>
  `;
  document.getElementById("chat-box").innerHTML += `<div class="bot-msg">Olá 👋 Sou o assistente da Conecta Uni. Posso te ajudar com informações sobre vagas, currículo, mentoria ou simulador.</div>`;
}

const respostasIA = {
  vagas: "A seção 'Vagas' conecta você a oportunidades de estágio e emprego.",
  currículo: "Na aba 'Currículo', você gera automaticamente um PDF com suas informações.",
  mentoria: "A 'Mentoria' conecta estudantes a professores e especialistas.",
  simulador: "O 'Simulador' te ajuda a praticar entrevistas reais.",
  conta: "Você pode criar uma conta clicando em 'Entrar / Cadastrar'.",
  unicon: "A UNICON é a identidade visual do Conecta Uni — unindo universidades e o mercado de trabalho.",
  default: "Sou o assistente da Conecta Uni! Posso te ajudar com vagas, currículo, mentoria, simulador ou cadastro."
};

function sendMessage() {
  const input = document.getElementById("chat-input");
  const box = document.getElementById("chat-box");
  const msg = input.value.trim();
  if (!msg) return;

  box.innerHTML += `<div class="user-msg">${msg}</div>`;
  input.value = "";
  box.scrollTop = box.scrollHeight;

  let resposta = respostasIA.default;
  for (let chave in respostasIA) {
    if (msg.toLowerCase().includes(chave)) { resposta = respostasIA[chave]; break; }
  }

  setTimeout(() => {
    box.innerHTML += `<div class="bot-msg">${resposta}</div>`;
    box.scrollTop = box.scrollHeight;
  }, 600);
}

function toggleAssistant() {
  let popup = document.getElementById("assistant-popup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "assistant-popup";
    popup.innerHTML = `
      <div id="assistant-header">
        Assistente Conecta Uni 🤖
        <button onclick="toggleAssistant()">×</button>
      </div>
      <div id="assistant-body"></div>
      <div id="assistant-input">
        <input id="assistant-text" placeholder="Digite aqui..." onkeydown="if(event.key==='Enter')sendAssistantMsg()" />
        <button onclick="sendAssistantMsg()">Enviar</button>
      </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("assistant-body").innerHTML += `<div class="bot-msg">Olá 👋 Sou o assistente da Conecta Uni. Posso te ajudar com vagas, currículo, mentoria ou simulador.</div>`;
  }

  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}

const respostasFlutuante = {
  vagas: "Na aba 'Vagas', visualize oportunidades e se candidate diretamente.",
  currículo: "Em 'Currículo', preencha seus dados e gere um PDF pronto.",
  mentoria: "A seção 'Mentoria' conecta alunos com professores experientes.",
  simulador: "O simulador ajuda você a treinar respostas e ganhar confiança.",
  conta: "Crie uma conta em 'Entrar / Cadastrar'.",
  unicon: "A UNICON é a identidade visual do Conecta Uni.",
  default: "Posso te ajudar com vagas, currículo, mentoria, simulador ou cadastro."
};

function sendAssistantMsg() {
  const input = document.getElementById("assistant-text");
  const body = document.getElementById("assistant-body");
  const msg = input.value.trim();
  if (!msg) return;

  body.innerHTML += `<div class="user-msg">${msg}</div>`;
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.textContent = "Digitando...";
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  let resposta = respostasFlutuante.default;
  for (let chave in respostasFlutuante) {
    if (msg.toLowerCase().includes(chave)) resposta = respostasFlutuante[chave];
  }

  setTimeout(() => {
    typing.remove();
    body.innerHTML += `<div class="bot-msg">${resposta}</div>`;
    body.scrollTop = body.scrollHeight;
  }, 1000);
}

function renderCompanyDashboard() {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  if (!user || user.role !== "empresa") {
    alert("Apenas contas de empresa podem acessar esta área.");
    navigate("login");
    return;
  }

  const vagas = JSON.parse(localStorage.getItem(`vagas_${user.email}`) || "[]");

  app.innerHTML = `
    <section class="card">
      <h1>Painel da Empresa</h1>
      <p class="small">Gerencie suas vagas e visualize candidatos interessados.</p>
      <button class="primary" onclick="showNewJobForm()">+ Publicar Nova Vaga</button>
    </section>

    <section class="card">
      <h2>Minhas Vagas</h2>
      <div id="company-vacancies"></div>
    </section>
  `;

  const container = document.getElementById("company-vacancies");
  if (vagas.length === 0) {
    container.innerHTML = `<p class="small">Nenhuma vaga publicada ainda.</p>`;
  } else {
    vagas.forEach((v, i) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${v.title}</h3>
        <p><strong>Área:</strong> ${v.area}</p>
        <p><strong>Tipo:</strong> ${v.tipo} • ${v.modalidade}</p>
        <p>${v.desc}</p>
        <p class="small"><em>Data limite: ${v.data}</em></p>
        <button class="ghost" onclick="deleteJob(${i})">Excluir</button>
      `;
      container.appendChild(div);
    });
  }
}

function showNewJobForm() {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  if (!user || user.role !== "empresa") return navigate("login");

  app.innerHTML = `
    <section class="card">
      <h1>Publicar Nova Vaga</h1>
      <input id="job-title" placeholder="Título da vaga" />
      <input id="job-area" placeholder="Área de atuação (ex: TI, Marketing...)" />
      <select id="job-tipo">
        <option>Estágio</option>
        <option>Emprego</option>
        <option>Projeto Acadêmico</option>
      </select>
      <select id="job-modalidade">
        <option>Presencial</option>
        <option>Remoto</option>
        <option>Híbrido</option>
      </select>
      <textarea id="job-desc" placeholder="Descrição detalhada da vaga" rows="4"></textarea>
      <input id="job-data" type="date" />

      <div style="display:flex;gap:10px;margin-top:10px;">
        <button class="primary" onclick="saveJob()">Salvar Vaga</button>
        <button class="ghost" onclick="renderCompanyDashboard()">Cancelar</button>
      </div>
    </section>
  `;
}

function saveJob() {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  if (!user || user.role !== "empresa") return navigate("login");

  const job = {
    title: document.getElementById("job-title").value.trim(),
    area: document.getElementById("job-area").value.trim(),
    tipo: document.getElementById("job-tipo").value,
    modalidade: document.getElementById("job-modalidade").value,
    desc: document.getElementById("job-desc").value.trim(),
    data: document.getElementById("job-data").value,
  };

  if (!job.title || !job.area || !job.desc) {
    alert("Preencha os campos obrigatórios: título, área e descrição.");
    return;
  }

  const vagas = JSON.parse(localStorage.getItem(`vagas_${user.email}`) || "[]");
  vagas.push(job);
  localStorage.setItem(`vagas_${user.email}`, JSON.stringify(vagas));

  alert("Vaga publicada com sucesso!");
  renderCompanyDashboard();
}

function deleteJob(index) {
  const user = JSON.parse(localStorage.getItem("uniconUser"));
  const vagas = JSON.parse(localStorage.getItem(`vagas_${user.email}`) || "[]");
  vagas.splice(index, 1);
  localStorage.setItem(`vagas_${user.email}`, JSON.stringify(vagas));
  renderCompanyDashboard();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
  }[s]));
}
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("isDarkMode", isDark);
  document.getElementById("theme-toggle").textContent = isDark ? "☀️" : "🌙";
}

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada neste navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      showNearbyVacancies(userLat, userLng);
    },
    () => {
      alert("Permissão de localização negada.");
    }
  );
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function showNearbyVacancies(userLat, userLng) {
  app.innerHTML = `
    <section class="card">
      <h1>📍 Vagas próximas de você</h1>
      <p class="small">Encontramos oportunidades em um raio de até 20km.</p>
    </section>
  `;

  const container = document.createElement("div");

  let found = false;

  vacancies.forEach(vacancy => {
    const distance = getDistance(userLat, userLng, vacancy.lat, vacancy.lng);

    if (distance <= 20) {
      found = true;

      const div = document.createElement("div");
      div.className = "card";
      div.style.marginBottom = "10px";

      div.innerHTML = `
        <h4>${vacancy.title}</h4>
        <p><strong>${vacancy.company}</strong></p>
        <p class="small">Distância: ${distance.toFixed(1)} km</p>
        <button class="secondary" onclick="navigate('vacancies')">
          Ver todas as vagas
        </button>
      `;

      container.appendChild(div);
    }
  });

  if (!found) {
    container.innerHTML = `
      <section class="card center">
        <p class="small">Nenhuma vaga encontrada próxima a você no momento.</p>
        <button class="primary" onclick="navigate('vacancies')">
          Explorar Vagas
        </button>
      </section>
    `;
  }

  app.appendChild(container);
}