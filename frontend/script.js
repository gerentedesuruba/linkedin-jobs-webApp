document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const loadingDiv = document.getElementById('loading');
    const resultsContainer = document.getElementById('results-container');
    const resultsTableBody = document.querySelector('#results-table tbody');
    const downloadJsonButton = document.getElementById('download-json');
    const downloadCsvButton = document.getElementById('download-csv');
    const errorMessageDiv = document.getElementById('error-message');

    let currentResults = [];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset UI
        loadingDiv.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        errorMessageDiv.classList.add('hidden');
        resultsTableBody.innerHTML = '';
        currentResults = [];

        const formData = new FormData(form);
        const params = new URLSearchParams();

        // Construir os parâmetros da query, ignorando campos vazios
        for (const [key, value] of formData.entries()) {
            if (value) {
                params.append(key, value);
            }
        }

        try {
            // O frontend (Nginx) e o backend (Node) estarão na mesma rede Docker.
            // Vamos configurar o Nginx para redirecionar requisições de /api/* para o serviço backend.
            // Isso evita problemas com CORS e esconde a URL do backend do cliente.
            const response = await fetch(`/api/jobs?${params.toString()}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                currentResults = data;
                displayResults(data);
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
                <td><a href="${job.jobUrl}" target="_blank">Ver Vaga</a></td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

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
        const headers = Object.keys(data[0]);
        const replacer = (key, value) => value === null ? '' : value;
        const csvRows = data.map(row => 
            headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
        );
        return [headers.join(','), ...csvRows].join('\r\n');
    }
});