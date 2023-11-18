var processoModel = require("../models/processoModel");

async function ExibirUltimosProcessos(req, res) {
    try {
        var data = await processoModel.Exibir_Processos();

        console.log(`DEBUG tipo da response dentro da controller: ${typeof data}` )

        if (data.length > 0) {
            res.status(200).json(data);
            console.log('Estou na controller, e a resposta foi bem-sucedida!');
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
            console.log('Estou na controller, mas a consulta não retornou resultados.');
        }
    } catch (error) {
        console.error("Houve um erro ao buscar as últimas medidas:", error);
        res.status(500).json({ error: "Houve um erro no servidor." });
    }
}


module.exports = {
   ExibirUltimosProcessos,
}
