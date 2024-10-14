import "./style.css";

interface IEndereço {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
}

function buscaEnderecoCompleto(cep: string): Promise<IEndereço> {
  return new Promise((resolve, reject) => {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar endereço");
        }
        return response.json();
      })
      .then((data) => {
        if (data.erro) {
          throw new Error("CEP não encontrado");
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const buttonBuscar = document.getElementById(
  "preenche-endereco"
) as HTMLButtonElement;

buttonBuscar.addEventListener("click", (event) => {
  event.preventDefault();

  const cepInput = (
    document.getElementById("cep") as HTMLInputElement
  ).value?.replace(/\D/g, "");

  if (cepInput.length !== 8) {
    alert("CEP deve conter 8 dígitos.");
    return;
  }

  buttonBuscar.disabled = true;

  buscaEnderecoCompleto(cepInput)
    .then((data) => {
      (document.getElementById("rua") as HTMLInputElement).value =
        data.logradouro;
      (document.getElementById("cidade") as HTMLInputElement).value =
        data.localidade;
      (document.getElementById("estado") as HTMLInputElement).value = data.uf;
      (document.getElementById("numero") as HTMLInputElement).value =
        data.complemento;
      (document.getElementById("bairro") as HTMLInputElement).value =
        data.bairro;
    })
    .catch((error) => {
      alert(error.message);
    });
});

const botaoCadastrar = document.getElementById("cadastrar");

botaoCadastrar?.addEventListener("click", (event) => {
  event.preventDefault();
  const nomeInput = (document.getElementById("nome") as HTMLInputElement).value;
  const emailInput = (document.getElementById("email") as HTMLInputElement)
    .value;
  const nascimentoInput = (document.getElementById("data") as HTMLInputElement)
    .value;
  const endereco: IEndereço = {
    logradouro: (document.getElementById("rua") as HTMLInputElement).value,
    complemento: (document.getElementById("numero") as HTMLInputElement).value,
    bairro: (document.getElementById("bairro") as HTMLInputElement).value,
    localidade: (document.getElementById("cidade") as HTMLInputElement).value,
    uf: (document.getElementById("estado") as HTMLInputElement).value,
    estado: (document.getElementById("estado") as HTMLInputElement).value,
  };

  if (!nomeInput || !emailInput || !nascimentoInput || !endereco) {
    alert("Todos os campos devem ser preenchidos.");
    return;
  }
  alert("Cadastro realizado com sucesso!");
  // Limpar formulário
  (document.getElementById("nome") as HTMLInputElement).value = "";
  (document.getElementById("email") as HTMLInputElement).value = "";
  (document.getElementById("data") as HTMLInputElement).value = "";
  (document.getElementById("rua") as HTMLInputElement).value = "";
  (document.getElementById("cidade") as HTMLInputElement).value = "";
  (document.getElementById("estado") as HTMLInputElement).value = "";
  (document.getElementById("numero") as HTMLInputElement).value = "";
  (document.getElementById("bairro") as HTMLInputElement).value = "";
  (document.getElementById("cep") as HTMLInputElement).value = "";
  buttonBuscar.disabled = false;
});
