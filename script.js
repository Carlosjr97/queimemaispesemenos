// URL do seu backend para facilitar a manutenção
const BACKEND_URL = "https://backend-xuq5.onrender.com";

// 1. ACORDAR O SERVIDOR ASSIM QUE A PÁGINA CARREGA
window.addEventListener('load', () => {
    console.log("Acordando servidor...");
    // Faz uma requisição simples. Se a rota / não existir, ele vai dar 404, 
    // mas o servidor VAI ACORDAR do mesmo jeito.
    fetch(BACKEND_URL).catch(() => {});
});

async function comprar() {
  const emailInput = document.getElementById("email");
  const pixDiv = document.getElementById("pix");
  const botao = document.getElementById("btnComprar");

  const email = emailInput.value.trim();

  // Validação Básica
  if (!email || !email.includes("@")) {
    alert("Digite um e-mail válido");
    emailInput.focus();
    return;
  }

  // Desativa o botão e muda o texto para dar feedback ao usuário
  botao.disabled = true;
  botao.innerText = "Preparando servidor (aguarde)...";

  // Pequeno timeout para mudar o texto caso demore muito (comum no Render Free)
  const slowServerTimeout = setTimeout(() => {
    if (botao.disabled) {
      botao.innerText = "Ligando motores... Quase lá!";
    }
  }, 5000);

  try {
    const response = await fetch(`${BACKEND_URL}/criar-pagamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao gerar pagamento");
    }

    // Limpa o timeout e atualiza o botão
    clearTimeout(slowServerTimeout);
    botao.innerText = "Pix Gerado com Sucesso!";

    // Exibe o PIX na tela
    pixDiv.innerHTML = `
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <p><strong>Copie o código Pix abaixo:</strong></p>
        <textarea id="pixCode" readonly style="width:100%; height:120px; margin-bottom: 10px; font-family: monospace;">${data.qr_code}</textarea>
        <button type="button" onclick="copiarPix()" style="background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 100%;">
          Copiar código Pix
        </button>
        <p style="font-size: 0.9em; color: #666; margin-top: 10px;">A planilha será enviada automaticamente após o pagamento.</p>
      </div>
    `;

  } catch (error) {
    console.error(error);
    alert(error.message || "Erro ao gerar Pix. Tente novamente.");
    botao.disabled = false;
    botao.innerText = "Quero emagrecer agora 🔥";
  }
}

/* Função para copiar o código Pix */
function copiarPix() {
  const textarea = document.getElementById("pixCode");

  if (!textarea) {
    alert("Código Pix não encontrado");
    return;
  }

  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  // Forma moderna de copiar
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textarea.value)
      .then(() => alert("Código Pix copiado!"))
      .catch(() => fallbackCopy(textarea));
  } else {
    fallbackCopy(textarea);
  }
}

function fallbackCopy(textarea) {
  textarea.select();
  document.execCommand("copy");
  alert("Código Pix copiado!");
}
