# Makefile

# .PHONY garante que estes alvos sejam executados mesmo que existam arquivos com o mesmo nome.
.PHONY: deploy down clean

deploy:
	@echo "🚀 Iniciando os serviços com Docker Compose..."
	# Constrói as imagens se necessário e inicia os containers em modo detached (-d)
	docker compose up --build -d
	@echo "------------------------------------------------------"
	@echo "✅ Serviços iniciados com sucesso!"
	@echo "   Frontend acessível em: http://localhost:8080"
	@echo "------------------------------------------------------"
	@make clean

down:
	@echo "🛑 Parando e removendo os containers..."
	docker compose down
	@echo "✅ Serviços parados."

clean:
	@echo "🧹 Limpando imagens Docker não utilizadas (dangling)..."
	# O -f (force) evita a necessidade de confirmação do usuário.
	# Este comando é seguro e remove apenas imagens que não estão sendo usadas por nenhum container ou tag.
	docker image prune -f
	@echo "✅ Limpeza concluída."

