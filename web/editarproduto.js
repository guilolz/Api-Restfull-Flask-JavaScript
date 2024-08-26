document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert('ID do produto não encontrado.');
        return;
    }

    const form = document.getElementById('editProductForm');
    const messageElement = document.getElementById('message');

    async function carregarProduto() {
        try {
            const response = await fetch(`http://127.0.0.1:5000/produtos/${id}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            const produto = await response.json();
            document.getElementById('nome').value = produto.nome;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('descricao').value = produto.descricao || '';
            document.getElementById('categoria').value = produto.categoria || '';
        } catch (error) {
            alert(error.message);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const descricao = document.getElementById('descricao').value;
        const categoria = document.getElementById('categoria').value;

        const produto = { nome, preco, descricao, categoria };

        try {
            const response = await fetch(`http://127.0.0.1:5000/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                const result = await response.json();
                messageElement.textContent = `Produto ${result.nome} atualizado com sucesso!`;
                messageElement.style.color = '#28a745';
            } else {
                const error = await response.json();
                messageElement.textContent = `Erro: ${error.message || 'Não foi possível atualizar o produto.'}`;
                messageElement.style.color = '#dc3545';
            }
        } catch (error) {
            messageElement.textContent = `Erro: ${error.message}`;
            messageElement.style.color = '#dc3545';
        }
    });

    carregarProduto();
});
