import express from "express";
import cors from "cors";
import fs from "fs"; 

const app = express(); 
const host = "localhost";
const port = 3000; 

// Middleware
app.use(cors()); // Habilita CORS, permitindo requisições de outros domínios
app.use(express.json()); // Permite o uso de JSON no corpo das requisições

const USERS_FILE = "usuarios.json"; // Nome do arquivo que armazena os usuários
let auto_increment = 1;

// Função para ler usuários do arquivo
function lerUsuarios() {
  if (!fs.existsSync(USERS_FILE)) {
    // Verifica se o arquivo de usuários existe
    return []; // Retorna um array vazio se o arquivo não existir
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")); // Lê o arquivo e converte o conteúdo JSON em objeto
}

// Função para salvar usuários no arquivo
function salvarUsuarios(usuarios) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2)); // Converte o objeto em JSON e salva no arquivo
}

// Rotas
app.get("/api/usuarios", (req, res) => {
  const usuarios = lerUsuarios(); // Lê os usuários do arquivo
  res.json(usuarios); // Retorna os usuários como resposta
});
app.post("/cadastro/usuario", (req, res) => {
  // Valida os dados do corpo da requisição
  const { nome, email } = req.body;
  const usuarios = lerUsuarios();

  const novoUsuario = { id: usuarios.auto_increment++, nome, email };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  res.json({ mensagem: ` Usuário ${nome} cadastrado com sucesso!` });
});

// Inicia o servidor
app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
  
});
