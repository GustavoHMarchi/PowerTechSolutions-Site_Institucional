
var feedbacksModel = require("../models/feedbacksModel");


function cadastrarFeedbacks(req,res){

    var feedback = req.body.feedbackServer;
    var estrela = req.body.estrelaServer;

    // Faça as validações dos valores
    if (feedback == undefined) {
        res.status(400).send("Seu feedback está undefined!");
    } else if (estrela == undefined) {
        res.status(400).send("Suas estrelas está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        feedbacksModel.cadastrarFeedbacks(feedback, estrela)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}


module.exports = {
    cadastrarFeedbacks
}