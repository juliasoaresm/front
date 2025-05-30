let form = document.querySelector("form");
form.onsubmit = calcular;

function calcular(evt) {
    evt.preventDefault();

    let salariobruto = parseFloat(document.querySelector("#salario").value);

    if (isNaN(salariobruto) || salariobruto <= 0) {
        document.querySelector("#resultado").innerHTML = "<p style='color: red;'>Digite um salário válido.</p>";
        return;
    }

    let INSS = calcularINSS(salariobruto);
    let impostoderenda = salariobruto * 0.075;
    let salarioLiquido = salariobruto - INSS - impostoderenda;

    let resultado = `
        <p>✅ <strong>Salário Bruto:</strong> R$ ${salariobruto.toFixed(2)}</p>
        <p>📉 <strong>Desconto INSS:</strong> R$ ${INSS.toFixed(2)}</p>
        <p>💸 <strong>Imposto de Renda (7.5%):</strong> R$ ${impostoderenda.toFixed(2)}</p>
        <p>💰 <strong>Salário Líquido:</strong> R$ ${salarioLiquido.toFixed(2)}</p>
    `;

    document.querySelector("#resultado").innerHTML = resultado;
}

function calcularINSS(salariobruto) {
    const faixas = [
        { max: 1518.00, aliquota: 0.075 },
        { max: 2793.88, aliquota: 0.09 },
        { max: 4190.83, aliquota: 0.12 },
        { max: 8157.41, aliquota: 0.14 }
    ];

    let INSS = 0;
    let maxAnterior = 0;

    for (let faixa of faixas) {
        if (salariobruto > faixa.max) {
            let base = faixa.max - maxAnterior;
            INSS += base * faixa.aliquota;
            maxAnterior = faixa.max;
        } else {
            let base = salariobruto - maxAnterior;
            INSS += base * faixa.aliquota;
            return INSS;
        }
    }

    let base = salariobruto - maxAnterior;
    INSS += base * 0.14;
    return INSS;
}
