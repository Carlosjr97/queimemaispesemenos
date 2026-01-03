function comprar() {
    const emailInput = document.getElementById("email");
    const pixDiv = document.getElementById("pix");
    const botao = document.querySelector("button");
  
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
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email })
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao gerar pagamento");
      return res.json();
    })
    .then(data => {
      pixDiv.innerHTML = `
  <p><strong>Copie o código Pix abaixo:</strong></p>
  <textarea id="pixCode" readonly style="width:100%; height:120px;">
${data.qr_code}
  </textarea>
  <button onclick="copiarPix()">Copiar código Pix</button>
  <p>A planilha será enviada automaticamente após o pagamento.</p>
`;
    })
    .catch(() => {
      alert("Erro ao gerar Pix. Tente novamente.");
      botao.disabled = false;
      botao.innerText = "Quero emagrecer agora 🔥";
    });
  }

  


