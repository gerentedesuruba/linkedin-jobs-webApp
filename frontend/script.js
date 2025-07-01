document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const loadingDiv = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const resultsTableBody = document.querySelector('#results-table tbody');
    const downloadJsonButton = document.getElementById('download-json');
    const downloadCsvButton = document.getElementById('download-csv');
    const errorMessageDiv = document.getElementById('error-message');

    // Elementos do Modal
    const modal = document.getElementById('job-details-modal');
    const modalCloseButton = document.querySelector('.close-button');
    const modalJobTitle = document.getElementById('modal-job-title');
    const modalCompanyName = document.getElementById('modal-company-name');
    const modalLocation = document.getElementById('modal-location');
    const modalDate = document.getElementById('modal-date');
    const modalRemote = document.getElementById('modal-remote');
    const modalDescriptionContent = document.getElementById('modal-description-content');
    const modalLinkedinLink = document.getElementById('modal-linkedin-link');

    let currentResults = [];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        loadingDiv.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        errorMessageDiv.classList.add('hidden');
        resultsTableBody.innerHTML = '';
        currentResults = [];

        const formData = new FormData(form);
        const params = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            if (value) {
                params.append(key, value);
            }
        }

        try {
            const response = await fetch(`/api/jobs?${params.toString()}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                currentResults = data.map((job, index) => ({ ...job, id: index }));
                displayResults(currentResults);
                resultsContainer.classList.remove('hidden');
            } else {
                showError('Nenhuma vaga encontrada para os critérios informados.');
            }

        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
            showError(`Erro ao buscar vagas: ${error.message}`);
        } finally {
            loadingDiv.classList.add('hidden');
        }
    });

    function displayResults(jobs) {
        jobs.forEach(job => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${job.position || 'N/A'}</td>
                <td>${job.company || 'N/A'}</td>
                <td>${job.location || 'N/A'}</td>
                <td>${job.agoTime || 'N/A'}</td>
                <td><button class="view-details-btn" data-job-id="${job.id}">Ver Detalhes</button></td>
            `;
            resultsTableBody.appendChild(row);
        });

        // Adicionar event listeners para os novos botões
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                const job = currentResults.find(j => j.id == jobId);
                openModalWithJob(job);
            });
        });
    }

    async function openModalWithJob(job) {
        modal.classList.remove('hidden');
        
        // Preencher informações básicas
        modalJobTitle.textContent = job.position || 'N/A';
        modalCompanyName.textContent = job.company || 'N/A';
        modalLocation.textContent = job.location || 'N/A';
        modalDate.textContent = job.agoTime || 'N/A';
        modalRemote.textContent = job.remoteFilter ? (job.remoteFilter === 'remote' ? 'Sim' : 'Não') : 'N/A';
        modalLinkedinLink.href = job.jobUrl;

        // Limpar descrição anterior e mostrar loader
        modalDescriptionContent.innerHTML = '<div class="loader-modal"></div>';

        // Verificar se a descrição já está em cache
        if (job.description) {
            modalDescriptionContent.innerHTML = job.description;
            return;
        }

        // Se não, buscar no backend
        try {
            const response = await fetch(`/api/description?url=${encodeURIComponent(job.jobUrl)}`);
            if (!response.ok) {
                throw new Error('Não foi possível carregar a descrição.');
            }
            const data = await response.json();
            
            // Armazenar em cache e exibir
            job.description = data.description;
            modalDescriptionContent.innerHTML = data.description;

        } catch (error) {
            console.error('Erro ao buscar descrição:', error);
            modalDescriptionContent.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    modalCloseButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }

    downloadJsonButton.addEventListener('click', () => {
        if (currentResults.length === 0) {
            alert('Não há dados para baixar.');
            return;
        }
        const dataStr = JSON.stringify(currentResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'linkedin_jobs.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    downloadCsvButton.addEventListener('click', () => {
        if (currentResults.length === 0) {
            alert('Não há dados para baixar.');
            return;
        }
        const csv = convertToCSV(currentResults);
        const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'linkedin_jobs.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    function convertToCSV(data) {
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const replacer = (key, value) => value === null ? '' : value;
        const csvRows = data.map(row => 
            headers.map(fieldName => {
                let value = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
                // Tratar strings que contêm aspas ou vírgulas
                if (typeof value === 'string') {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );
        return [headers.join(','), ...csvRows].join('\r\n');
    }
});