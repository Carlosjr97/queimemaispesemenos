function comprar() {
  const emailInput = document.getElementById("email");
  const pixDiv = document.getElementById("pix");
  const botao = document.getElementById("btnComprar");

  const email = emailInput.value.trim();

  if (!email || !email.includes("@")) {
    alert("Digite um e-mail válido");
    emailInput.focus();
    return;
  }

  botao.disabled = true;
  botao.innerText = "Gerando Pix...";

  fetch("https://backend-xuq5.onrender.com/criar-pagamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.erro || "Erro ao gerar pagamento");
        });
      }
      return res.json();
    })
    .then(data => {
      pixDiv.innerHTML = `
        <p><strong>Copie o código Pix abaixo:</strong></p>
        <textarea id="pixCode" readonly style="width:100%; height:120px;">${data.qr_code}</textarea>
        <button type="button" onclick="copiarPix()">Copiar código Pix</button>
        <p>A planilha será enviada automaticamente após o pagamento.</p>
      `;
    })
    .catch(error => {
      alert(error.message || "Erro ao gerar Pix. Tente novamente.");
      botao.disabled = false;
      botao.innerText = "Quero emagrecer agora 🔥";
    });
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

  navigator.clipboard.writeText(textarea.value)
    .then(() => {
      alert("Código Pix copiado!");
    })
    .catch(() => {
      document.execCommand("copy");
      alert("Código Pix copiado!");
    });
}
