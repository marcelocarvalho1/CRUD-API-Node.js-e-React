import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const host = "localhost";
const port = 3000;

// Arquivo para armazenar os usuários
const USERS_FILE = "usuarios.json";

// Middleware
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite receber JSON no corpo das requisições

// Função para ler usuários do arquivo
function lerUsuarios() {
  if (!fs.existsSync(USERS_FILE)) {
    return []; // Retorna um array vazio se o arquivo não existir
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")); // Lê o arquivo e retorna os usuários
}

// Função para salvar usuários no arquivo
function salvarUsuarios(usuarios) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2)); // Salva no arquivo
}

// Inicializa o auto_increment com base nos IDs existentes
let auto_increment = (() => {
  if (!fs.existsSync(USERS_FILE)) {
    return 1;
  }
  const usuarios = lerUsuarios();
  return usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
})();

// Rotas
app.get("/api/usuarios", (req, res) => {
  const usuarios = lerUsuarios(); // Lê os usuários do arquivo
  res.json(usuarios); // Retorna os usuários em JSON
});

app.post("/cadastro/usuario", (req, res) => {
  const { nome, email } = req.body;

  // Validação simples
  if (!nome || !email) {
    return res.status(400).json({ mensagem: "Nome e email são obrigatórios." });
  }

  const usuarios = lerUsuarios();

  // Cria o novo usuário com um ID único
  const novoUsuario = { id: auto_increment++, nome, email };

  // Adiciona o novo usuário à lista e salva no arquivo
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  res.json({
    mensagem: `Usuário ${nome} cadastrado com sucesso!`,
    usuario: novoUsuario,
  });
});

// Inicia o servidor
app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
