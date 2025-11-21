// JavaScript para a página de login

document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    setupDemoCredentials();
});

// Configurar formulário de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Configurar credenciais de demonstração
function setupDemoCredentials() {
    const demoCredentials = document.querySelector('.demo-credentials');
    if (demoCredentials) {
        demoCredentials.addEventListener('click', function(e) {
            if (e.target.closest('.demo-user')) {
                fillDemoCredentials();
            }
        });
    }
}

// Preencher credenciais de demonstração
function fillDemoCredentials() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'demo@biblioteca.com';
        passwordInput.value = 'demo123';
        
        utils.showNotification('Credenciais de demonstração preenchidas!', 'success');
    }
}

// Processar login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validações básicas
    if (!email || !password) {
        utils.showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (!utils.validateEmail(email)) {
        utils.showNotification('Por favor, insira um e-mail válido', 'error');
        return;
    }
    
    // Simular autenticação
    if (email === 'demo@biblioteca.com' && password === 'demo123') {
        // Login bem-sucedido
        const userData = {
            id: 1,
            name: 'Usuário Demo',
            email: email,
            role: 'librarian',
            loginTime: new Date().toISOString()
        };
        
        // Salvar dados do usuário
        if (rememberMe) {
            storage.save('library_user', userData);
        } else {
            sessionStorage.setItem('library_user', JSON.stringify(userData));
        }
        
        utils.showNotification('Login realizado com sucesso! Redirecionando...', 'success');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } else {
        // Login falhou
        utils.showNotification('E-mail ou senha incorretos', 'error');
        
        // Limpar campo de senha
        document.getElementById('loginPassword').value = '';
    }
}

// Verificar se usuário já está logado
function checkLoginStatus() {
    const userData = storage.load('library_user') || 
                    JSON.parse(sessionStorage.getItem('library_user') || 'null');
    
    if (userData) {
        // Usuário já está logado, redirecionar para dashboard
        window.location.href = 'index.html';
    }
}

// Logout
function logout() {
    storage.remove('library_user');
    sessionStorage.removeItem('library_user');
    utils.showNotification('Logout realizado com sucesso', 'success');
    window.location.href = 'login.html';
}

// Adicionar estilos específicos para login
const loginStyles = `
    .login-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .login-icon {
        font-size: 4rem;
        color: #667eea;
        margin-bottom: 20px;
    }

    .login-form .form-group {
        margin-bottom: 25px;
    }

    .login-form label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #2c3e50;
        font-weight: 500;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .btn-full {
        width: 100%;
        padding: 12px;
        font-size: 1rem;
        margin-bottom: 20px;
    }

    .login-links {
        text-align: center;
        margin-bottom: 20px;
    }

    .forgot-password {
        color: #667eea;
        text-decoration: none;
        font-size: 0.9rem;
    }

    .forgot-password:hover {
        text-decoration: underline;
    }

    .register-prompt {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
    }

    .register-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
    }

    .register-link:hover {
        text-decoration: underline;
    }

    .demo-credentials {
        margin-top: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }

    .demo-credentials h3 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 1rem;
    }

    .demo-user {
        background: white;
        padding: 15px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    .demo-user:hover {
        background: #e9ecef;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    }

    .notification.success {
        background: #28a745;
    }

    .notification.error {
        background: #dc3545;
    }

    .notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1.2rem;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @media (max-width: 480px) {
        .form-container {
            padding: 20px;
        }
        
        .login-icon {
            font-size: 3rem;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;

// Adicionar estilos à página
const styleSheet = document.createElement('style');
styleSheet.textContent = loginStyles;
document.head.appendChild(styleSheet);

// Verificar status de login ao carregar a página
// checkLoginStatus();
