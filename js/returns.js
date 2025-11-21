// JavaScript para a página de devoluções

let selectedLoan = null;

document.addEventListener('DOMContentLoaded', function() {
    setupReturnTabs();
    setupReturnForm();
    loadPendingReturns();
    loadOverdueReturns();
    checkPreselectedLoan();
});

// Configurar abas de devolução
function setupReturnTabs() {
    // Event listeners já configurados no HTML via onclick
}

// Mostrar aba de devolução
function showReturnTab(tabName) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remover classe active de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(`${tabName}-return`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativar botão correspondente
    const activeButton = document.querySelector(`[onclick="showReturnTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Mostrar método de busca
function showSearchMethod(method) {
    // Esconder todos os métodos
    const methods = document.querySelectorAll('.search-method');
    methods.forEach(m => m.classList.remove('active'));

    // Remover classe active de todos os botões
    const methodTabs = document.querySelectorAll('.method-tab');
    methodTabs.forEach(tab => tab.classList.remove('active'));

    // Mostrar método selecionado
    const selectedMethod = document.getElementById(`search-by-${method}`);
    if (selectedMethod) {
        selectedMethod.classList.add('active');
    }

    // Ativar botão correspondente
    const activeTab = document.querySelector(`[onclick="showSearchMethod('${method}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Configurar formulário de devolução
function setupReturnForm() {
    const returnForm = document.getElementById('processReturnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmReturn();
        });
    }

    // Configurar data padrão
    const returnDateInput = document.getElementById('returnDate');
    if (returnDateInput) {
        returnDateInput.value = utils.getCurrentDate();
    }
}

// Verificar empréstimo pré-selecionado da URL
function checkPreselectedLoan() {
    const urlParams = new URLSearchParams(window.location.search);
    const loanId = urlParams.get('loan');
    
    if (loanId) {
        const loan = mockData.loans.find(l => l.id === parseInt(loanId));
        if (loan) {
            selectLoanForReturn(loan);
        }
    }
}

// Buscar usuário para devolução
function searchUserForReturn() {
    const searchTerm = document.getElementById('userReturnSearch').value.toLowerCase();
    const resultsDiv = document.getElementById('userReturnResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const users = mockData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.cpf.includes(searchTerm)
    );
    
    // Filtrar apenas usuários com empréstimos ativos
    const usersWithLoans = users.filter(user => {
        return mockData.loans.some(loan => 
            loan.userId === user.id && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    });
    
    if (usersWithLoans.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum usuário com empréstimos ativos encontrado</div>';
        return;
    }
    
    resultsDiv.innerHTML = usersWithLoans.map(user => `
        <div class="search-result-item" onclick="showUserLoans(${user.id})">
            <div class="user-info">
                <strong>${user.name}</strong>
                <p>${user.email}</p>
                <small>CPF: ${user.cpf}</small>
            </div>
        </div>
    `).join('');
}

// Buscar livro para devolução
function searchBookForReturn() {
    const searchTerm = document.getElementById('bookReturnSearch').value.toLowerCase();
    const resultsDiv = document.getElementById('bookReturnResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const books = mockData.books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    
    // Filtrar apenas livros com empréstimos ativos
    const booksWithLoans = books.filter(book => {
        return mockData.loans.some(loan => 
            loan.bookId === book.id && 
            (loan.status === 'active' || loan.status === 'overdue')
        );
    });
    
    if (booksWithLoans.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum livro com empréstimos ativos encontrado</div>';
        return;
    }
    
    resultsDiv.innerHTML = booksWithLoans.map(book => `
        <div class="search-result-item" onclick="showBookLoans(${book.id})">
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <strong>${book.title}</strong>
                <p>${book.author}</p>
                <small>ISBN: ${book.isbn}</small>
            </div>
        </div>
    `).join('');
}

// Buscar por ISBN
function searchByISBN() {
    const isbn = document.getElementById('isbnReturnSearch').value;
    const resultsDiv = document.getElementById('isbnReturnResults');
    
    if (isbn.length < 3) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const book = mockData.books.find(book => book.isbn.includes(isbn));
    
    if (!book) {
        resultsDiv.innerHTML = '<div class="no-results">Livro não encontrado</div>';
        return;
    }
    
    // Verificar se tem empréstimos ativos
    const activeLoans = mockData.loans.filter(loan => 
        loan.bookId === book.id && 
        (loan.status === 'active' || loan.status === 'overdue')
    );
    
    if (activeLoans.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Nenhum empréstimo ativo encontrado para este livro</div>';
        return;
    }
    
    showBookLoans(book.id);
}

// Mostrar empréstimos do usuário
function showUserLoans(userId) {
    const user = utils.getUserById(userId);
    const userLoans = utils.getActiveLoansForUser(userId);
    
    displayFoundLoans(userLoans, `Empréstimos de ${user.name}`);
}

// Mostrar empréstimos do livro
function showBookLoans(bookId) {
    const book = utils.getBookById(bookId);
    const bookLoans = utils.getLoansForBook(bookId);
    
    displayFoundLoans(bookLoans, `Empréstimos de "${book.title}"`);
}

// Exibir empréstimos encontrados
function displayFoundLoans(loans, title) {
    const foundLoansDiv = document.getElementById('foundLoans');
    const loansListDiv = document.getElementById('loansList');
    
    if (loans.length === 0) {
        foundLoansDiv.style.display = 'none';
        return;
    }
    
    loansListDiv.innerHTML = `
        <h4>${title}</h4>
        ${loans.map(loan => {
            const user = utils.getUserById(loan.userId);
            const book = utils.getBookById(loan.bookId);
            const isOverdue = new Date(loan.dueDate) < new Date();
            const overdueDays = isOverdue ? utils.daysDifference(loan.dueDate, utils.getCurrentDate()) : 0;
            
            return `
                <div class="loan-item" onclick="selectLoanForReturn(${JSON.stringify(loan).replace(/"/g, '&quot;')})">
                    <div class="loan-info">
                        <div class="user-book-info">
                            <strong>Usuário:</strong> ${user.name} (${user.email})<br>
                            <strong>Livro:</strong> ${book.title} - ${book.author}<br>
                            <strong>Empréstimo:</strong> ${utils.formatDate(loan.loanDate)} | 
                            <strong>Vencimento:</strong> ${utils.formatDate(loan.dueDate)}
                            ${isOverdue ? `<br><strong class="overdue">Atrasado: ${overdueDays} dias</strong>` : ''}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm">Selecionar</button>
                </div>
            `;
        }).join('')}
    `;
    
    foundLoansDiv.style.display = 'block';
}

// Selecionar empréstimo para devolução
function selectLoanForReturn(loan) {
    if (typeof loan === 'string') {
        loan = JSON.parse(loan);
    }
    
    selectedLoan = loan;
    const user = utils.getUserById(loan.userId);
    const book = utils.getBookById(loan.bookId);
    
    // Calcular dias de atraso
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const isOverdue = dueDate < today;
    const overdueDays = isOverdue ? utils.daysDifference(loan.dueDate, utils.getCurrentDate()) : 0;
    
    // Preencher informações do empréstimo
    document.getElementById('returnUserName').textContent = user.name;
    document.getElementById('returnUserEmail').textContent = user.email;
    document.getElementById('returnBookTitle').textContent = book.title;
    document.getElementById('returnBookAuthor').textContent = book.author;
    document.getElementById('returnBookISBN').textContent = book.isbn;
    document.getElementById('returnLoanDate').textContent = utils.formatDate(loan.loanDate);
    document.getElementById('returnDueDate').textContent = utils.formatDate(loan.dueDate);
    
    const overdueDaysElement = document.getElementById('returnOverdueDays');
    if (isOverdue) {
        overdueDaysElement.textContent = `${overdueDays} dias`;
        overdueDaysElement.className = 'overdue-days overdue';
        
        // Mostrar cálculo de multa
        const fineCalculation = document.getElementById('fineCalculation');
        const fineDays = document.getElementById('fineDays');
        const fineAmount = document.getElementById('fineAmount');
        
        fineDays.textContent = overdueDays;
        fineAmount.textContent = `R$ ${(overdueDays * 0.50).toFixed(2)}`;
        fineCalculation.style.display = 'block';
    } else {
        overdueDaysElement.textContent = '0 dias';
        overdueDaysElement.className = 'overdue-days';
        document.getElementById('fineCalculation').style.display = 'none';
    }
    
    // Mostrar formulário de devolução
    document.getElementById('returnForm').style.display = 'block';
    
    // Esconder empréstimos encontrados
    document.getElementById('foundLoans').style.display = 'none';
}

// Confirmar devolução
function confirmReturn() {
    if (!selectedLoan) {
        utils.showNotification('Nenhum empréstimo selecionado', 'error');
        return;
    }
    
    const returnDate = document.getElementById('returnDate').value;
    const bookCondition = document.getElementById('bookCondition').value;
    const returnNotes = document.getElementById('returnNotes').value;
    const fineWaived = document.getElementById('fineWaived') ? document.getElementById('fineWaived').checked : false;
    
    if (!returnDate || !bookCondition) {
        utils.showNotification('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Atualizar empréstimo
    const loanIndex = mockData.loans.findIndex(l => l.id === selectedLoan.id);
    if (loanIndex === -1) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    const loan = mockData.loans[loanIndex];
    const isLateReturn = new Date(returnDate) > new Date(loan.dueDate);
    
    loan.returnDate = returnDate;
    loan.status = isLateReturn ? 'late-return' : 'returned';
    loan.bookCondition = bookCondition;
    loan.returnNotes = returnNotes;
    loan.fineWaived = fineWaived;
    
    // Atualizar disponibilidade do livro
    const book = utils.getBookById(loan.bookId);
    if (book) {
        book.availableCopies++;
        book.loanedCopies--;
        if (book.availableCopies > 0) {
            book.status = 'disponivel';
        }
    }
    
    // Salvar alterações
    storage.save('library_loans', mockData.loans);
    storage.save('library_books', mockData.books);
    
    const user = utils.getUserById(loan.userId);
    utils.showNotification(`Devolução processada com sucesso! Livro devolvido por ${user.name}`, 'success');
    
    // Limpar formulário
    cancelReturn();
    
    // Recarregar listas
    loadPendingReturns();
    loadOverdueReturns();
}

// Cancelar devolução
function cancelReturn() {
    selectedLoan = null;
    document.getElementById('returnForm').style.display = 'none';
    document.getElementById('foundLoans').style.display = 'none';
    document.getElementById('processReturnForm').reset();
    document.getElementById('returnDate').value = utils.getCurrentDate();
    
    // Limpar campos de busca
    document.getElementById('userReturnSearch').value = '';
    document.getElementById('bookReturnSearch').value = '';
    document.getElementById('isbnReturnSearch').value = '';
    document.getElementById('userReturnResults').innerHTML = '';
    document.getElementById('bookReturnResults').innerHTML = '';
    document.getElementById('isbnReturnResults').innerHTML = '';
}

// Carregar devoluções pendentes
function loadPendingReturns() {
    const activeLoans = mockData.loans.filter(loan => 
        loan.status === 'active' || loan.status === 'overdue'
    );
    
    // Atualizar estatísticas
    const totalPending = activeLoans.length;
    const dueToday = activeLoans.filter(loan => loan.dueDate === utils.getCurrentDate()).length;
    const overdue = activeLoans.filter(loan => new Date(loan.dueDate) < new Date()).length;
    
    // Atualizar interface (se os elementos existirem)
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements.length >= 3) {
        statElements[0].textContent = totalPending;
        statElements[1].textContent = dueToday;
        statElements[2].textContent = overdue;
    }
}

// Carregar devoluções atrasadas
function loadOverdueReturns() {
    // Implementar carregamento de devoluções atrasadas
}

// Devolução rápida
function quickReturn(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (loan) {
        selectLoanForReturn(loan);
        showReturnTab('process');
    }
}

// Enviar lembrete
function sendReminder(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (!loan) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    const user = utils.getUserById(loan.userId);
    const book = utils.getBookById(loan.bookId);
    
    utils.showNotification(`Lembrete enviado para ${user.name} sobre "${book.title}"`, 'success');
}

// Enviar lembrete urgente
function sendUrgentReminder(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (!loan) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    const user = utils.getUserById(loan.userId);
    const book = utils.getBookById(loan.bookId);
    
    utils.showNotification(`Lembrete URGENTE enviado para ${user.name} sobre "${book.title}"`, 'success');
}

// Renovar empréstimo
function renewLoan(loanId) {
    const loan = mockData.loans.find(l => l.id === loanId);
    if (!loan) {
        utils.showNotification('Empréstimo não encontrado', 'error');
        return;
    }
    
    // Adicionar 14 dias à data de devolução
    const newDueDate = new Date(loan.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);
    
    loan.dueDate = newDueDate.toISOString().split('T')[0];
    loan.renewalCount = (loan.renewalCount || 0) + 1;
    
    storage.save('library_loans', mockData.loans);
    
    utils.showNotification('Empréstimo renovado com sucesso!', 'success');
    loadPendingReturns();
}
