const perPageOptions = [10, 30, 50, 100];
let currentPage = 1;
let perPage = perPageOptions[0];
let totalRepositories = 0;
let repositoriesData = [];

function getRepositories() {
    const username = document.getElementById('username').value;
    const searchKeyword = document.getElementById('search').value;

    // Clear previous results
    $('#repositories').empty();
    $('#pagination').empty();
    $('#loader').html('<div class="spinner-border" role="status"></div>');

    // Fetch repositories using GitHub API
    const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(repositories => {
            repositoriesData = repositories.filter(repo => repo.name.toLowerCase().includes(searchKeyword.toLowerCase()));
            totalRepositories = repositoriesData.length;

            renderRepositories();
            renderPagination();
        })
        .catch(error => {
            $('#loader').html('Error fetching repositories. Please check the username and try again.');
        });
}

function renderRepositories() {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalRepositories);

    const repositoriesContainer = $('#repositories');
    repositoriesContainer.empty();

    for (let i = startIndex; i < endIndex; i++) {
        const repo = repositoriesData[i];
        const repoElement = $('<div class="repository mb-3"></div>');
        repoElement.html(`<strong>${repo.name}</strong>: ${repo.description || 'No description available'}`);
        repositoriesContainer.append(repoElement);
    }

    $('#loader').empty();
}

function renderPagination() {
    const paginationContainer = $('#pagination');
    paginationContainer.empty();

    if (totalRepositories > perPage) {
        const totalPages = Math.ceil(totalRepositories / perPage);
        const paginationList = $('<ul class="pagination justify-content-center"></ul>');

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}"></li>`);
            const pageLink = $(`<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`);
            pageItem.append(pageLink);
            paginationList.append(pageItem);
        }

        paginationContainer.append(paginationList);

        // Per page dropdown
        const perPageDropdown = $(`<select class="form-control mt-3" id="perPage"></select>`);
        perPageOptions.forEach(option => {
            const optionElement = $(`<option value="${option}" ${option === perPage ? 'selected' : ''}>${option}</option>`);
            perPageDropdown.append(optionElement);
        });

        perPageDropdown.change(() => {
            perPage = parseInt($('#perPage').val(), 10);
            currentPage = 1;
            getRepositories();
        });

        paginationContainer.append(perPageDropdown);
    }
}

function changePage(newPage) {
    currentPage = newPage;
    getRepositories();
}
