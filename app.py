from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///produtos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.String(200))
    categoria = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'preco': self.preco,
            'descricao': self.descricao,
            'categoria': self.categoria
        }

with app.app_context():
    db.create_all()

def validar_dados_produto(dados):
    if not dados:
        return jsonify({'error': 'Nenhum dado fornecido.'}), 422
    if 'nome' not in dados or 'preco' not in dados:
        return jsonify({'error': "Dados inválidos: 'nome' e 'preco' são obrigatórios."}), 422
    if not isinstance(dados['preco'], (int, float)) or dados['preco'] < 0:
        return jsonify({'error': "'preco' deve ser um número positivo."}), 422
    if not dados['nome'].isalpha(): 
        return jsonify({'error': "O 'nome' não pode conter números."}), 422
    return None, None  


@app.route('/', methods=['GET'])
def home():
    return "Bem-vindo à API de Produtos!"

@app.route('/produtos', methods=['POST'])
def adicionar_produto():
    dados = request.get_json()
    erro, status = validar_dados_produto(dados)
    if erro:
        return erro, status
    produto = Produto(
        nome=dados['nome'],
        preco=dados['preco'],
        descricao=dados.get('descricao'),
        categoria=dados.get('categoria')
    )
    db.session.add(produto)
    db.session.commit()
    return jsonify(produto.to_dict()), 201

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([p.to_dict() for p in produtos])

@app.route('/produtos/<int:id>', methods=['GET'])
def obter_produto(id):
    produto = Produto.query.get(id)
    if produto is None:
        abort(404, description="Produto não encontrado")
    return jsonify(produto.to_dict())

@app.route('/produtos/<int:id>', methods=['PUT'])
def atualizar_produto(id):
    dados = request.get_json()
    try:
        validar_dados_produto(dados)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    produto = Produto.query.get(id)
    if produto is None:
        abort(404, description="Produto não encontrado")

    produto.nome = dados.get('nome', produto.nome)
    produto.preco = dados.get('preco', produto.preco)
    produto.descricao = dados.get('descricao', produto.descricao)
    produto.categoria = dados.get('categoria', produto.categoria)
    db.session.commit()
    return jsonify(produto.to_dict())

@app.route('/produtos/<int:id>', methods=['DELETE'])
def excluir_produto(id):
    produto = Produto.query.get(id)
    if produto is None:
        abort(404, description="Produto não encontrado")
    db.session.delete(produto)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
