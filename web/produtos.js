const apiUrl = 'http://127.0.0.1:5000/produtos';


async function carregarProdutos() {
    try {
        const response = await fetch(apiUrl);
        const produtos = await response.json();
        const tbody = document.querySelector('#produtosTable tbody');
        tbody.innerHTML = ''; 

        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.preco.toFixed(2)}</td>
                <td>${produto.descricao || ''}</td>
                <td>${produto.categoria || ''}</td>
                <td>
                    <button onclick="removerProduto(${produto.id})">Remover</button>
                    <a href="editar.html?id=${produto.id}" class="button-link">Editar</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function removerProduto(id) {
    if (!confirm('Tem certeza de que deseja remover este produto?')) {
        return;
    }
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Produto removido com sucesso!');
            carregarProdutos();
        } else {
            alert('Erro ao remover produto.');
        }
    } catch (error) {
        console.error('Erro ao remover produto:', error);
    }
}


document.addEventListener('DOMContentLoaded', carregarProdutos);
