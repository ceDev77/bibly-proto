// JavaScript para a página de cadastro

document.addEventListener('DOMContentLoaded', function() {
    setupRegisterForm();
    setupFormValidation();
});

// Configurar formulário de cadastro
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
}

// Configurar validação em tempo real
function setupFormValidation() {
    // Validação de e-mail
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmailField);
    }
    
    // Validação de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('blur', validateCPFField);
    }
    
    // Validação de confirmação de senha
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validatePasswordConfirmation);
    }
    
    // Validação de senha
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
    }
}

// Validar campo de e-mail
function validateEmailField() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    
    if (email && !utils.validateEmail(email)) {
        showFieldError(emailInput, 'Por favor, insira um e-mail válido');
        return false;
    } else {
        clearFieldError(emailInput);
        return true;
    }
}

// Validar campo de CPF
function validateCPFField() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value;
    
    if (cpf && !utils.validateCPF(cpf)) {
        showFieldError(cpfInput, 'Por favor, insira um CPF válido');
        return false;
    } else {
        clearFieldError(cpfInput);
        return true;
    }
}

// Validar confirmação de senha
function validatePasswordConfirmation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        showFieldError(confirmPasswordInput, 'As senhas não coincidem');
        return false;
    } else {
        clearFieldError(confirmPasswordInput);
        return true;
    }
}

// Validar força da senha
function validatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    if (password.length > 0 && password.length < 6) {
        showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres');
        return false;
    } else {
        clearFieldError(passwordInput);
        return true;
    }
}

// Mostrar erro no campo
function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

// Limpar erro do campo
function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
}

// Processar cadastro
function handleRegister() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        cpf: document.getElementById('cpf').value,
        birthDate: document.getElementById('birthDate').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        terms: document.getElementById('terms').checked
    };
    
    // Validações
    if (!validateForm(formData)) {
        return;
    }
    
    // Verificar se e-mail já existe
    const existingUsers = storage.load('library_users') || mockData.users;
    const emailExists = existingUsers.some(user => user.email === formData.email);
    
    if (emailExists) {
        utils.showNotification('Este e-mail já está cadastrado', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(), // ID simples baseado em timestamp
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        address: formData.address,
        registrationDate: utils.getCurrentDate(),
        status: 'active'
    };
    
    // Adicionar à lista de usuários
    const users = storage.load('library_users') || [...mockData.users];
    users.push(newUser);
    storage.save('library_users', users);
    
    // Atualizar mockData
    mockData.users = users;
    
    utils.showNotification('Cadastro realizado com sucesso! Redirecionando para login...', 'success');
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

// Validar formulário completo
function validateForm(data) {
    let isValid = true;
    
    // Campos obrigatórios
    const requiredFields = [
        { field: 'fullName', message: 'Nome completo é obrigatório' },
        { field: 'email', message: 'E-mail é obrigatório' },
        { field: 'phone', message: 'Telefone é obrigatório' },
        { field: 'cpf', message: 'CPF é obrigatório' },
        { field: 'birthDate', message: 'Data de nascimento é obrigatória' },
        { field: 'address', message: 'Endereço é obrigatório' },
        { field: 'password', message: 'Senha é obrigatória' }
    ];
    
    requiredFields.forEach(({ field, message }) => {
        if (!data[field] || data[field].trim() === '') {
            const input = document.getElementById(field);
            showFieldError(input, message);
            isValid = false;
        }
    });
    
    // Validações específicas
    if (data.email && !utils.validateEmail(data.email)) {
        const emailInput = document.getElementById('email');
        showFieldError(emailInput, 'E-mail inválido');
        isValid = false;
    }
    
    if (data.cpf && !utils.validateCPF(data.cpf)) {
        const cpfInput = document.getElementById('cpf');
        showFieldError(cpfInput, 'CPF inválido');
        isValid = false;
    }
    
    if (data.password && data.password.length < 6) {
        const passwordInput = document.getElementById('password');
        showFieldError(passwordInput, 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    if (data.password !== data.confirmPassword) {
        const confirmPasswordInput = document.getElementById('confirmPassword');
        showFieldError(confirmPasswordInput, 'Senhas não coincidem');
        isValid = false;
    }
    
    if (!data.terms) {
        utils.showNotification('Você deve aceitar os termos de uso', 'error');
        isValid = false;
    }
    
    // Validar idade mínima (16 anos)
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 16) {
            const birthDateInput = document.getElementById('birthDate');
            showFieldError(birthDateInput, 'Idade mínima: 16 anos');
            isValid = false;
        }
    }
    
    if (!isValid) {
        utils.showNotification('Por favor, corrija os erros no formulário', 'error');
    }
    
    return isValid;
}

// Adicionar estilos específicos para cadastro
const registerStyles = `
    .register-form .form-group {
        margin-bottom: 20px;
    }

    .register-form label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
        color: #2c3e50;
        font-weight: 500;
    }

    .form-control.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }

    .field-error {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .field-error::before {
        content: "⚠";
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
        margin-top: 2px;
    }

    .terms-link {
        color: #667eea;
        text-decoration: none;
    }

    .terms-link:hover {
        text-decoration: underline;
    }

    .form-actions {
        margin-top: 30px;
    }

    .btn-full {
        width: 100%;
        padding: 12px;
        font-size: 1rem;
        margin-bottom: 20px;
    }

    .login-link {
        text-align: center;
        font-size: 0.9rem;
    }

    .login-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
    }

    .login-link a:hover {
        text-decoration: underline;
    }

    .password-strength {
        margin-top: 5px;
        font-size: 0.8rem;
    }

    .strength-weak {
        color: #dc3545;
    }

    .strength-medium {
        color: #ffc107;
    }

    .strength-strong {
        color: #28a745;
    }

    @media (max-width: 480px) {
        .form-container {
            padding: 20px;
        }
        
        .checkbox-label {
            font-size: 0.8rem;
        }
    }
`;

// Adicionar estilos à página
const styleSheet = document.createElement('style');
styleSheet.textContent = registerStyles;
document.head.appendChild(styleSheet);
