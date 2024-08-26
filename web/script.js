document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const messageElement = document.getElementById('message');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const descricao = document.getElementById('descricao').value;
        const categoria = document.getElementById('categoria').value;

        const produto = { nome, preco, descricao, categoria };

        try {
            const response = await fetch('http://127.0.0.1:5000/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                const result = await response.json();
                messageElement.textContent = `Produto ${result.nome} adicionado com sucesso!`;
                messageElement.style.color = '#28a745'; 
                form.reset();
            } else {
                const error = await response.json();
                messageElement.textContent = `Erro: ${error.error || 'Não foi possível adicionar o produto.'}`;
                messageElement.style.color = '#dc3545'; 
            }
        } catch (error) {
            messageElement.textContent = `Erro: ${error.message}`;
            messageElement.style.color = '#dc3545'; 
        }
    });
});
