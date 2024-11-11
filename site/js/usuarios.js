document.addEventListener("DOMContentLoaded", function () {
  const formTitle = document.getElementById("formTitle");
  const usuarioForm = document.getElementById("usuarioForm");
  const usuariosTableBody = document.getElementById("usuariosTableBody");
  const editForm = document.getElementById("usuariosEdit");

  // Função para carregar usuários
  async function loadUsuarios() {
    const response = await fetch("http://localhost:8081/usuario");
    const usuarios = await response.json();
    usuariosTableBody.innerHTML = "";
    usuarios.forEach((usuario) => {
      const row = document.createElement("tr");
      row.innerHTML = `
             
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUsuario(${usuario.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUsuario(${usuario.id})">Excluir</button>
                </td>
            `;
      usuariosTableBody.appendChild(row);
    });
  }

  async function loadEditUsuario() {
    const pegaURL = new URL(window.location);
    const id = pegaURL.searchParams.get("id");

    fetch(`http://localhost:8081/usuario/${id}`)
      .then((response) => response.json())
      .then((usuario) => {
        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
        document.getElementById("senha").value = ""; // Deixe o campo de senha vazio
        usuarioForm.action = `http://localhost:8081/usuario/${id}`;
        usuarioForm.dataset.method = "PUT"; // Armazena o método no dataset do formulário
      });
  }

  // Função para editar usuário
  window.editUsuario = function (id) {
    window.location.href = `editar_usuario.html?id=${id}`;
  };

  // Função para deletar usuário
  window.deleteUsuario = async function (id) {
    if (confirm("Tem certeza que deseja excluir?")) {
      await fetch(`http://localhost:8081/usuario/${id}`, { method: "DELETE" });
      loadUsuarios();
    }
  };

  // Função para salvar usuário
  if (usuarioForm) {
    usuarioForm.addEventListener("submit", async function (event) {
      console.log("Teste");
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const usuario = { nome: nome, email: email, senha: senha };

      const method = usuarioForm.dataset.method || "POST";
      const url =
        method === "PUT" ? usuarioForm.action : "http://localhost:8081/usuario";
      const options = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      };

      const response = await fetch(url, options);
      if (response.ok) {
        alert("Usuário salvo com sucesso!");
        window.location.href = "listagem_usuarios.html";
      } else {
        alert("Erro ao salvar usuário");
      }
    });
  }

  // Carregar usuários ao carregar a página
  if (usuariosTableBody) {
    loadUsuarios();
  }

  if (editForm) {
    loadEditUsuario();

    editForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      const usuario = { nome: nome, email: email, senha: senha };

      const pegaURL = new URL(window.location);
      const id = pegaURL.searchParams.get("id");

      const url = `http://localhost:8081/usuario/${id}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      };

      const response = await fetch(url, options);
      if (response.ok) {
        alert("Usuário atualizado com sucesso!");
        window.location.href = "listagem_usuarios.html";
      } else {
        alert("Erro ao atualizar usuário");
      }
    });
  }
});
