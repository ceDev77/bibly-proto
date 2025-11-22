// JavaScript para a página de livros
let currentPage = 1;
let booksPerPage = 12;
let filteredBooks = [];

// Inicializar página de livros
document.addEventListener('DOMContentLoaded', function() {
    filteredBooks = [...mockData.books];
    displayBooks();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('categoryFilter').addEventListener('change', filterBooks);
    document.getElementById('statusFilter').addEventListener('change', filterBooks);
    document.getElementById('sortBy').addEventListener('change', sortBooks);
    
    // Busca
    document.getElementById('searchInput').addEventListener('input', debounce(searchBooks, 300));
}

// Exibir livros na grade
function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);

    if (booksToShow.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum livro encontrado</h3>
                <p>Tente ajustar os filtros ou termos de busca</p>
            </div>
        `;
        return;
    }

    booksGrid.innerHTML = booksToShow.map(book => `
        <div class="book-card-large">
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}">
                <div class="book-overlay">
                    <a href="book-details.html?id=${book.id}" class="btn btn-primary btn-sm">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </a>
                    ${book.status === 'disponivel' ? 
                        `<button class="btn btn-success btn-sm" onclick="quickLoan(${book.id})">
                            <i class="fas fa-handshake"></i> Pegar Emprestado
                        </button>` : 
                        `<button class="btn btn-secondary btn-sm" disabled>
                            <i class="fas fa-times"></i> Indisponível
                        </button>`
                    }
                </div>
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-meta">
                    <span class="category-tag">${book.category}</span>
                    <span class="year">${book.year}</span>
                </div>
                <div class="book-status">
                    <span class="status-badge ${book.status}">${getStatusText(book.status)}</span>
                    <span class="availability">${book.availableCopies}/${book.totalCopies} disponíveis</span>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination();
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'disponivel': 'Disponível',
        'emprestado': 'Emprestado',
        'reservado': 'Reservado'
    };
    return statusMap[status] || status;
}

// Buscar livros
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredBooks = [...mockData.books];
    } else {
        filteredBooks = mockData.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayBooks();
}

// Filtrar livros
function filterBooks() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredBooks = mockData.books.filter(book => {
        const categoryMatch = !categoryFilter || book.category === categoryFilter;
        const statusMatch = !statusFilter || book.status === statusFilter;
        return categoryMatch && statusMatch;
    });
    
    // Aplicar busca se houver termo
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayBooks();
}

// Ordenar livros
function sortBooks() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredBooks.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'year':
                return b.year - a.year;
            case 'category':
                return a.category.localeCompare(b.category);
            default:
                return 0;
        }
    });
    
    displayBooks();
}

// Atualizar paginação
function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Mudar página
function changePage(direction) {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }
    
    displayBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Empréstimo rápido
function quickLoan(bookId) {
    const book = utils.getBookById(bookId);
    if (!book) {
        utils.showNotification('Livro não encontrado', 'error');
        return;
    }
    
    if (book.availableCopies === 0) {
        utils.showNotification('Livro não disponível para empréstimo', 'error');
        return;
    }
    
    // Redirecionar para página de empréstimos com o livro pré-selecionado
    window.location.href = `loans.html?book=${bookId}`;
}

// Função debounce para otimizar busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adicionar estilos CSS específicos para a página de livros
const bookStyles = `
    .books-grid-large {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .book-card-large {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .book-card-large:hover {
        transform: translateY(-5px);
    }

    .book-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .book-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .book-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .book-card-large:hover .book-overlay {
        opacity: 1;
    }

    .book-info {
        padding: 20px;
    }

    .book-info h3 {
        margin-bottom: 5px;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .book-author {
        color: #7f8c8d;
        margin-bottom: 10px;
        font-size: 0.9rem;
    }

    .book-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .category-tag {
        background: #667eea;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        text-transform: capitalize;
    }

    .year {
        color: #7f8c8d;
        font-size: 0.8rem;
    }

    .book-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .status-badge.disponivel {
        background: #d4edda;
        color: #155724;
    }

    .status-badge.emprestado {
        background: #f8d7da;
        color: #721c24;
    }

    .status-badge.reservado {
        background: #fff3cd;
        color: #856404;
    }

    .availability {
        font-size: 0.8rem;
        color: #7f8c8d;
    }

    .filters-container {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }

    .filters {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .filter-select {
        padding: 8px 12px;
        border: 2px solid #e9ecef;
        border-radius: 5px;
        background: white;
        min-width: 150px;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
    }

    .page-info {
        font-weight: 500;
        color: #2c3e50;
    }

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #7f8c8d;
    }

    .no-results i {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .no-results h3 {
        margin-bottom: 10px;
        color: #2c3e50;
    }

    @media (max-width: 768px) {
        .books-grid-large {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        
        .filters {
            flex-direction: column;
        }
        
        .filter-select {
            min-width: 100%;
        }
    }
`;

// Adicionar estilos à página
const styleSheet = document.createElement('style');
styleSheet.textContent = bookStyles;
document.head.appendChild(styleSheet);
