# LinkedIn Jobs Web App

Esta é uma aplicação web de busca de vagas no LinkedIn que oferece uma interface amigável para pesquisar e filtrar oportunidades de emprego diretamente da plataforma LinkedIn.

O projeto consiste em:
- **Frontend**: Uma interface de usuário estática construída com HTML, CSS e JavaScript.
- **Backend**: Um servidor Node.js (Express) que atua como um wrapper para a API de busca de vagas.
- **Docker**: O projeto é totalmente containerizado usando Docker e Docker Compose para facilitar a configuração e a implantação.

## Funcionalidades

- Interface de busca de vagas com múltiplos filtros (palavra-chave, localização, data, tipo de vaga, etc.).
- Exibição dos resultados em uma tabela clara e organizada.
- Opção de download dos resultados da busca em formatos JSON e CSV.
- Cache de resultados para buscas repetidas (pode ser desativado).

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/linkedin-jobs-webApp.git
   cd linkedin-jobs-webApp
   ```

2. **Inicialize os submódulos:**
   O backend é um submódulo Git. Use o seguinte comando para cloná-lo:
   ```bash
   git submodule update --init --recursive
   ```

3. **Inicie a aplicação com o Makefile:**
   O projeto utiliza um `Makefile` para simplificar a execução. Para construir e iniciar os containers, use:
   ```bash
   docker-compose up -d
   ```
ou
   ```bash
   make deploy
   ```

4. **Acesse a aplicação:**
   Abra seu navegador e acesse `http://localhost:8081`.

## Como Usar

1. Preencha os campos de busca na interface.
   - **Palavra-chave** e **Localização** são campos obrigatórios.
   - **Observação Importante**: Ao preencher o campo "Localização" com o nome de um país, utilize o nome em **inglês** (por exemplo, "Bra**z**il" em vez de "Bra**s**il").
2. Clique em "Buscar Vagas".
3. Os resultados serão exibidos na tabela.
4. Você pode baixar os resultados nos formatos JSON ou CSV usando os botões correspondentes.

## Estrutura do Projeto

    ```
    .
    ├── backend/         # Submódulo Git com a API Node.js
    ├── frontend/        # Código do frontend (HTML, CSS, JS)
    ├── docker-compose.yml # Orquestração dos containers
    └── README.md        # Esta documentação
    ```

## Parando a Aplicação

Para parar os containers, simplesmente execute:
    ```bash
    docker-compose down
    ```
ou
    ```bash
    make down
    ```
