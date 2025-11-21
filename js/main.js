// Biblioteca Online - JavaScript Principal
// Funcionalidades gerais e utilitárias

// Dados simulados para demonstração
const mockData = {
    users: [
        {
            id: 1,
            name: "Maria Silva",
            email: "maria@email.com",
            cpf: "123.456.789-00",
            phone: "(11) 99999-1111",
            address: "Rua das Flores, 123"
        },
        {
            id: 2,
            name: "João Santos",
            email: "joao@email.com",
            cpf: "987.654.321-00",
            phone: "(11) 99999-2222",
            address: "Av. Principal, 456"
        },
        {
            id: 3,
            name: "Ana Costa",
            email: "ana@email.com",
            cpf: "456.789.123-00",
            phone: "(11) 99999-3333",
            address: "Rua do Centro, 789"
        }
    ],
    books: [
        {
            id: 1,
            title: "Dom Casmurro",
            author: "Machado de Assis",
            isbn: "978-85-359-0277-5",
            category: "literatura",
            year: 1899,
            publisher: "Editora Ática",
            pages: 256,
            description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado em 1899. A obra é narrada em primeira pessoa pelo protagonista Bentinho, que conta a história de sua vida e de seu amor por Capitu.",
            image: "https://via.placeholder.com/300x400/4a90e2/ffffff?text=Dom+Casmurro",
            status: "disponivel",
            totalCopies: 5,
            availableCopies: 3,
            loanedCopies: 2
        },
        {
            id: 2,
            title: "O Cortiço",
            author: "Aluísio Azevedo",
            isbn: "978-85-359-0278-2",
            category: "literatura",
            year: 1890,
            publisher: "Editora Moderna",
            pages: 304,
            description: "O Cortiço é um romance naturalista brasileiro escrito por Aluísio Azevedo e publicado em 1890. A obra retrata a vida em um cortiço no Rio de Janeiro do século XIX.",
            image: "https://via.placeholder.com/300x400/e74c3c/ffffff?text=O+Cortico",
            status: "disponivel",
            totalCopies: 3,
            availableCopies: 1,
            loanedCopies: 2
        },
        {
            id: 3,
            title: "Iracema",
            author: "José de Alencar",
            isbn: "978-85-359-0279-9",
            category: "romance",
            year: 1865,
            publisher: "Editora Saraiva",
            pages: 128,
            description: "Iracema é um romance brasileiro escrito por José de Alencar e publicado em 1865. A obra narra a história de amor entre a índia Iracema e o português Martim.",
            image: "https://via.placeholder.com/300x400/2ecc71/ffffff?text=Iracema",
            status: "disponivel",
            totalCopies: 4,
            availableCopies: 4,
            loanedCopies: 0
        },
        {
            id: 4,
            title: "Senhora",
            author: "José de Alencar",
            isbn: "978-85-359-0280-5",
            category: "romance",
            year: 1875,
            publisher: "Editora FTD",
            pages: 192,
            description: "Senhora é um romance urbano de José de Alencar, publicado em 1875. A obra conta a história de Aurélia Camargo e Fernando Seixas.",
            image: "https://via.placeholder.com/300x400/f39c12/ffffff?text=Senhora",
            status: "emprestado",
            totalCopies: 2,
            availableCopies: 0,
            loanedCopies: 2
        }
    ],
    loans: [
        {
            id: 1,
            userId: 1,
            bookId: 1,
            loanDate: "2024-11-01",
            dueDate: "2024-11-21",
            status: "active",
            notes: ""
        },
        {
            id: 2,
            userId: 2,
            bookId: 2,
            loanDate: "2024-10-28",
            dueDate: "2024-11-11",
            status: "overdue",
            notes: ""
        },
        {
            id: 3,
            userId: 3,
            bookId: 3,
            loanDate: "2024-10-15",
            dueDate: "2024-10-29",
            returnDate: "2024-10-29",
            status: "returned",
            notes: "Devolvido no prazo"
        }
    ]
};

// Utilitários
const utils = {
    // Formatar data para exibição
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },

    // Calcular dias de diferença
    daysDifference: function(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round((secondDate - firstDate) / oneDay);
    },

    // Obter data atual no formato YYYY-MM-DD
    getCurrentDate: function() {
        return new Date().toISOString().split('T')[0];
    },

    // Validar CPF (validação básica)
    validateCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        return cpf.length === 11;
    },

    // Validar email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Mostrar notificação
    showNotification: function(message, type = 'success') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    // Buscar usuário por ID
    getUserById: function(id) {
        return mockData.users.find(user => user.id === parseInt(id));
    },

    // Buscar livro por ID
    getBookById: function(id) {
        return mockData.books.find(book => book.id === parseInt(id));
    },

    // Buscar empréstimos ativos de um usuário
    getActiveLoansForUser: function(userId) {
        return mockData.loans.filter(loan => 
            loan.userId === parseInt(userId) && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    },

    // Buscar empréstimos de um livro
    getLoansForBook: function(bookId) {
        return mockData.loans.filter(loan => 
            loan.bookId === parseInt(bookId) && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    }
};

// Gerenciamento de localStorage
const storage = {
    // Salvar dados
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Carregar dados
    load: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Remover dados
    remove: function(key) {
        localStorage.removeItem(key);
    }
};

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Definir data atual nos campos de data
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id === 'loanDate' || input.id === 'returnDate') {
            input.value = utils.getCurrentDate();
        }
    });

    // Adicionar máscara de CPF
    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });

    // Adicionar máscara de telefone
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });

    // Carregar dados salvos no localStorage se existirem
    const savedUsers = storage.load('library_users');
    const savedBooks = storage.load('library_books');
    const savedLoans = storage.load('library_loans');

    if (savedUsers) mockData.users = savedUsers;
    if (savedBooks) mockData.books = savedBooks;
    if (savedLoans) mockData.loans = savedLoans;
});

// Funções globais para navegação e interação
function showTab(tabName) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remover classe active de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativar botão correspondente
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Exportar para uso global
window.mockData = mockData;
window.utils = utils;
window.storage = storage;
