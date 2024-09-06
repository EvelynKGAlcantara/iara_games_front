document.addEventListener("DOMContentLoaded", function () {
  // Função para buscar e preencher os fabricantes
  function fetchFabricantes() {
    fetch(
      "https://iaragamesbackend-production-d2b5.up.railway.app/jogos/fabricantes"
    )
      .then((response) => response.json())
      .then((data) => {
        const fabricanteSelect = document.getElementById("fabricante");
        if (fabricanteSelect) {
          data.forEach((fabricante) => {
            const option = document.createElement("option");
            option.value = fabricante.id;
            option.text = fabricante.nome;
            fabricanteSelect.appendChild(option);
          });
        }
      })
      .catch((error) => console.error("Erro ao buscar fabricantes:", error));
  }

  // Função para buscar e preencher as categorias
  function fetchCategorias() {
    fetch(
      "https://iaragamesbackend-production-d2b5.up.railway.app/jogos/categorias"
    )
      .then((response) => response.json())
      .then((data) => {
        const categoriaSelect = document.getElementById("categoria");
        if (categoriaSelect) {
          data.forEach((categoria) => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.text = categoria.nome;
            categoriaSelect.appendChild(option);
          });
        }
      })
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }

  // Função para buscar e preencher os usuários
  function fetchUsuarios() {
    fetch("https://iaragamesbackend-production-d2b5.up.railway.app/usuario")
      .then((response) => response.json())
      .then((data) => {
        const usuarioSelect = document.getElementById("usuario");
        if (usuarioSelect) {
          data.forEach((usuario) => {
            const option = document.createElement("option");
            option.value = usuario.id;
            option.text = usuario.nome;
            usuarioSelect.appendChild(option);
          });
        }
      })
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }

  // Função para salvar um jogo (cadastrar ou editar)
  function cadastrarJogo(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const tipoMidia = document.querySelector(
      'input[name="tipoMidia"]:checked'
    ).value;
    const plataforma = document.getElementById("plataforma").value;
    const fabricanteId = document.getElementById("fabricante").value;
    const categoriaId = document.getElementById("categoria").value;

    const jogo = {
      nome: nome,
      tipoMidia: tipoMidia,
      plataforma: plataforma,
      fabricante: { id: fabricanteId },
      categoria: { id: categoriaId },
    };

    // Verifica se está editando um jogo
    const jogoId = document
      .getElementById("jogosForm")
      .getAttribute("data-editing");
    if (jogoId) {
      // Se está editando, faz um PUT para atualizar o jogo
      fetch(
        `https://iaragamesbackend-production-d2b5.up.railway.app/jogos/${jogoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jogo),
        }
      )
        .then((response) => {
          if (response.ok) {
            alert("Jogo atualizado com sucesso!");
            document.getElementById("jogosForm").reset();
            document
              .getElementById("jogosForm")
              .removeAttribute("data-editing");
            loadJogos(); // Atualiza a lista de jogos após editar
            window.location.href = "listagem_jogos.html";
          } else {
            alert("Erro ao atualizar jogo.");
          }
        })
        .catch((error) => console.error("Erro ao atualizar jogo:", error));
    } else {
      // Se não está editando, faz um POST para cadastrar um novo jogo
      fetch("https://iaragamesbackend-production-d2b5.up.railway.app/jogos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jogo),
      })
        .then((response) => {
          if (response.ok) {
            alert("Jogo cadastrado com sucesso!");
            document.getElementById("jogosForm").reset();
            loadJogos(); // Atualiza a lista de jogos após cadastrar
            window.location.href = "listagem_jogos.html";
          } else {
            alert("Erro ao cadastrar jogo.");
          }
        })
        .catch((error) => console.error("Erro ao cadastrar jogo:", error));
    }
  }

  // Função para carregar jogos
  async function loadJogos() {
    const response = await fetch(
      "https://iaragamesbackend-production-d2b5.up.railway.app/jogos"
    );
    const jogos = await response.json();
    const jogosTableBody = document.getElementById("jogosTableBody");
    if (jogosTableBody) {
      jogosTableBody.innerHTML = "";
      jogos.forEach((jogo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                   
                    <td>${jogo.nome}</td>
                    <td>${jogo.tipoMidia}</td>
                    <td>${jogo.plataforma}</td>
                    <td>${jogo.fabricante.nome}</td>
                    <td>${jogo.categoria.nome}</td>
                 
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editJogo(${jogo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteJogo(${jogo.id})">Excluir</button>
                    </td>
                `;
        jogosTableBody.appendChild(row);
      });
    }
  }

  // Função para deletar jogo
  window.deleteJogo = async function (id) {
    if (confirm("Tem certeza que deseja excluir?")) {
      await fetch(
        `https://iaragamesbackend-production-d2b5.up.railway.app/jogos/${id}`,
        { method: "DELETE" }
      );
      loadJogos();
    }
  };

  // Função para editar um jogo
  window.editJogo = function (jogoId) {
    // Redireciona para a página de edição com o ID do jogo como parâmetro
    window.location.href = "./editar_jogos.html?jogoId=" + jogoId;
  };

  // Função para carregar dados do jogo para edição
  function fetchJogoData(id) {
    fetch(`https://iaragamesbackend-production-d2b5.up.railway.app/jogos/${id}`)
      .then((response) => response.json())
      .then((jogo) => {
        document.getElementById("nome").value = jogo.nome;
        document.querySelector(
          `input[name="tipoMidia"][value="${jogo.tipoMidia}"]`
        ).checked = true;
        document.getElementById("plataforma").value = jogo.plataforma;
        document.getElementById("fabricante").value = jogo.fabricante.id;
        document.getElementById("categoria").value = jogo.categoria.id;

        // Adiciona um atributo de data ao formulário para identificar que está editando um jogo
        document.getElementById("jogosForm").setAttribute("data-editing", id);
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do jogo para edição:", error)
      );
  }

  // Verifica se estamos na página de edição de jogos
  if (window.location.pathname.endsWith("editar_jogos.html")) {
    // Busca os dados para preencher os dropdowns
    fetchUsuarios();
    const urlParams = new URLSearchParams(window.location.search);
    const jogoId = urlParams.get("jogoId");
    if (jogoId) {
      fetchJogoData(jogoId);
    }
    // Adiciona o evento de submit ao formulário
    if (document.getElementById("jogosForm")) {
      document
        .getElementById("jogosForm")
        .addEventListener("submit", cadastrarJogo);
    }
  }
  // Verifica se estamos na página de cadastro de jogos
  if (document.getElementById("jogosForm")) {
    // Adiciona o evento de submit ao formulário
    document
      .getElementById("jogosForm")
      .addEventListener("submit", cadastrarJogo);
    // Busca os dados para preencher os dropdowns
    fetchFabricantes();
    fetchCategorias();
    fetchUsuarios();
  }

  // Verifica se estamos na página de listagem de jogos
  if (document.getElementById("jogosTableBody")) {
    // Carrega a lista de jogos
    loadJogos();
  }
});
