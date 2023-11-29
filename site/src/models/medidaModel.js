var database = require("../database/config");

function log_alertas(FKUnidade,mes) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
        SELECT COUNT(Alertas.IDAlerta) AS Alertas , date_format(Data_Hora, "%d/%c") as momento_grafico FROM Alertas WHERE FKUnidade_negocio = 1 GROUP BY Data_Hora;
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT count(IDAlerta) as Alertas
        FROM Alertas JOIN Nivel_alerta
        ON IDNivel_alerta = FKNivel_alerta
        WHERE Data_Hora LIKE "%-${mes}-%" GROUP BY IDNivel_alerta;
        `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function tempo_real_log_alertas(FKUnidade) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `SELECT Alertas.IDAlerta AS Alertas, date_format(Data_Hora, "%d/%c") as momento_grafico FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade}`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarFeedCountTem(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT
    COUNT(*) AS TotalCount
FROM Tempo_de_Execucao
JOIN maquinas ON FKTempo_maquina = IDMaquina
WHERE maquinas.IDMaquina = ${FKMAQUINA};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarTotalTempo(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT SUM(Total_captura) AS Total_Tempo
FROM tempo_de_execucao
JOIN maquinas ON FKTempo_maquina = IDMaquina
WHERE maquinas.IDMaquina = ${FKMAQUINA};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarNomeMaquina(FKMAQUINA, ID_USUARIO) {
    var instrucaoSql = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta FROM Alertas WHERE FKUnidade_negocio = ${FKMAQUINA}
        `;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
            SELECT Maquinas.Apelido AS Nome
            FROM Maquinas
            JOIN Usuario_Dashboard ON Maquinas.FKFuncionario = Usuario_Dashboard.IDUsuario
            WHERE Usuario_Dashboard.IDUsuario = ${ID_USUARIO}
              AND Maquinas.IDMaquina = ${FKMAQUINA};
        `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return;
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDiscos(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
	    Componentes_monitorados.IDComponente_monitorado as IDMonitoramento,
	    Data_Hora_Captura,
        Uso AS "Uso_DIsco",
        Porcentagem AS Porcentagem_Uso,
        Componentes_cadastrados.Apelido 
        FROM 
		    Monitoramento_RAW JOIN Componentes_monitorados 
		    ON FKComponente_Monitorado = IDComponente_monitorado 
		    JOIN Componentes_cadastrados 
		    ON FKComponente_cadastrado = IDComponente_cadastrado
		    JOIN Maquinas 
		    ON FKMaquina = IDMaquina
		    WHERE FKMaquina = ${FKMAQUINA}
		    AND Componentes_cadastrados.Apelido = "DISCO"
		    ORDER BY Monitoramento_RAW.IDMonitoramento DESC;
        `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDiscosKaori(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
    Componentes_monitorados.IDComponente_monitorado AS IDMonitoramento,
    Data_Hora_Captura,
    ROUND((Total / POWER(1024, 3)), 2) AS Total_Uso,
	ROUND((Free / POWER(1024, 3)), 2) AS Livre_Uso, 
	ROUND((Uso / POWER(1024, 3)), 2) AS Uso_Disco,
    Porcentagem AS Porcentagem_Uso,
    Componentes_cadastrados.Apelido 
FROM 
    Monitoramento_RAW 
JOIN Componentes_monitorados ON FKComponente_Monitorado = IDComponente_monitorado 
JOIN Componentes_cadastrados ON FKComponente_cadastrado = IDComponente_cadastrado
JOIN Maquinas ON FKMaquina = IDMaquina
WHERE 
    FKMaquina = ${FKMAQUINA}
    AND Componentes_cadastrados.Apelido = 'DISCO'
ORDER BY 
    Monitoramento_RAW.IDMonitoramento DESC
LIMIT 1;
        `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarTempoExecucao(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT DISTINCT
    DATE_FORMAT(Data_Hora, '%d/%m/%Y') AS Data,
    TIME(Data_Hora) AS Hora,
    TIME(Total_captura) AS total
FROM 
    Tempo_de_Execucao
JOIN 
    maquinas ON Tempo_de_Execucao.FKTempo_maquina = maquinas.IDMaquina
WHERE 
    FKTempo_maquina = ${FKMAQUINA};
    `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarJanelas(IDMaquina) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT Nome_Janelas as Nome,Data_Hora_Conexao as data 
        FROM Janelas_Abertas JOIN maquinas on FKMaquina = IDMaquina 
        WHERE FKMaquina = ${IDMaquina} AND Janelas_Abertas.Nome_Janelas != ""
        AND Data_Hora_Conexao >= DATE_SUB(NOW(), INTERVAL 5 MINUTE);
    `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTotal_Janelas(IDMaquina) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT count(Nome_Janelas) as Total From Janelas_Abertas WHERE FKMaquina = ${IDMaquina} AND Janelas_Abertas.Nome_Janelas != ""
AND Data_Hora_Conexao >= DATE_SUB(NOW(), INTERVAL 5 MINUTE);
    `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function ultimas_CPU(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            DATE_FORMAT(Data_Hora_Captura,'%H:%i') as momento_grafico,
            Uso AS Uso_CPU
            FROM 
		        Monitoramento_RAW JOIN Componentes_monitorados 
		        ON FKComponente_Monitorado = IDComponente_monitorado 
		        JOIN Componentes_cadastrados 
		        ON FKComponente_cadastrado = IDComponente_cadastrado
		        JOIN Maquinas 
		        ON FKMaquina = IDMaquina
		        WHERE FKMaquina = ${FKMAQUINA}
		        AND Componentes_cadastrados.Apelido = "CPU"
                ORDER BY Monitoramento_RAW.IDMonitoramento DESC 
                LIMIT 10;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function tempo_real_CPU(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
        DATE_FORMAT(Data_Hora_Captura,'%H:%i') as momento_grafico,
        Uso AS Uso_CPU
            FROM 
		        Monitoramento_RAW JOIN Componentes_monitorados 
		        ON FKComponente_Monitorado = IDComponente_monitorado 
		        JOIN Componentes_cadastrados 
		        ON FKComponente_cadastrado = IDComponente_cadastrado
		        JOIN Maquinas 
		        ON FKMaquina = IDMaquina
		        WHERE FKMaquina = ${FKMAQUINA}
		        AND Componentes_cadastrados.Apelido = "CPU"
                ORDER BY Monitoramento_RAW.IDMonitoramento DESC 
                LIMIT 10;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ultimas_RAM(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            DATE_FORMAT(Data_Hora_Captura,'%H:%i') as momento_grafico,
            Uso AS Uso_RAM
            FROM 
		        Monitoramento_RAW JOIN Componentes_monitorados 
		        ON FKComponente_Monitorado = IDComponente_monitorado 
		        JOIN Componentes_cadastrados 
		        ON FKComponente_cadastrado = IDComponente_cadastrado
		        JOIN Maquinas 
		        ON FKMaquina = IDMaquina
		        WHERE FKMaquina = ${FKMAQUINA}
		        AND Componentes_cadastrados.Apelido = "RAM"
                ORDER BY Monitoramento_RAW.IDMonitoramento DESC 
                LIMIT 10;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function tempo_real_RAM(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
        DATE_FORMAT(Data_Hora_Captura,'%H:%i') as momento_grafico,
        Uso AS Uso_RAM
            FROM 
		        Monitoramento_RAW JOIN Componentes_monitorados 
		        ON FKComponente_Monitorado = IDComponente_monitorado 
		        JOIN Componentes_cadastrados 
		        ON FKComponente_cadastrado = IDComponente_cadastrado
		        JOIN Maquinas 
		        ON FKMaquina = IDMaquina
		        WHERE FKMaquina = ${FKMAQUINA}
		        AND Componentes_cadastrados.Apelido = "RAM"
                ORDER BY Monitoramento_RAW.IDMonitoramento DESC 
                LIMIT 1;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contar_MF_ativas(IDEmpresa) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            Count(IDMaquina) as Contagem 
        FROM Maquinas JOIN Tipo_maquina
            ON Maquinas.FKTipo_maquina = Tipo_maquina.IDTipo
        JOIN Estado_maquina
            ON IDEstado = FKEstado
        JOIN Usuario_Dashboard
            ON Maquinas.FKFuncionario = Usuario_Dashboard.IDUsuario 
        WHERE Tipo_maquina.Apelido = "FISICA"
            AND Usuario_Dashboard.FKUnidade = ${IDEmpresa}
            AND Estado_maquina.Estado = "Ativa";`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contar_MF_inativas(IDEmpresa) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            Count(IDMaquina) as Contagem 
        FROM Maquinas JOIN Tipo_maquina
            ON Maquinas.FKTipo_maquina = Tipo_maquina.IDTipo
        JOIN Estado_maquina
            ON IDEstado = FKEstado
        JOIN Usuario_Dashboard
            ON Maquinas.FKFuncionario = Usuario_Dashboard.IDUsuario 
        WHERE Tipo_maquina.Apelido = "FISICA"
            AND Usuario_Dashboard.FKUnidade = ${IDEmpresa}
            AND Estado_maquina.Estado = "Inativa";`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contar_MV_ativas(IDEmpresa) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            Count(IDMaquina) as Contagem 
        FROM Maquinas JOIN Tipo_maquina
            ON Maquinas.FKTipo_maquina = Tipo_maquina.IDTipo
        JOIN Estado_maquina
            ON IDEstado = FKEstado
        JOIN Usuario_Dashboard
            ON Maquinas.FKFuncionario = Usuario_Dashboard.IDUsuario 
        WHERE Tipo_maquina.Apelido = "VIRTUAL"
            AND Usuario_Dashboard.FKUnidade = ${IDEmpresa}
            AND Estado_maquina.Estado = "Ativa";`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function contar_MV_inativas(IDEmpresa) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
            Count(IDMaquina) as Contagem 
        FROM Maquinas JOIN Tipo_maquina
            ON Maquinas.FKTipo_maquina = Tipo_maquina.IDTipo
        JOIN Estado_maquina
            ON IDEstado = FKEstado
        JOIN Usuario_Dashboard
            ON Maquinas.FKFuncionario = Usuario_Dashboard.IDUsuario 
        WHERE Tipo_maquina.Apelido = "VIRTUAL"
            AND Usuario_Dashboard.FKUnidade = ${IDEmpresa}
            AND Estado_maquina.Estado = "Inativa";`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function ultimas_TempoExec(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
    CASE 
        WHEN DAYNAME(Data_Hora) = 'Monday' THEN 'Segunda-feira'
        WHEN DAYNAME(Data_Hora) = 'Tuesday' THEN 'Terça-feira'
        WHEN DAYNAME(Data_Hora) = 'Wednesday' THEN 'Quarta-feira'
        WHEN DAYNAME(Data_Hora) = 'Thursday' THEN 'Quinta-feira'
        WHEN DAYNAME(Data_Hora) = 'Friday' THEN 'Sexta-feira'
        WHEN DAYNAME(Data_Hora) = 'Saturday' THEN 'Sábado'
        WHEN DAYNAME(Data_Hora) = 'Sunday' THEN 'Domingo'
    END AS DiaDaSemana,
    COUNT(*) AS QuantidadeDesligamentos
FROM 
    Tempo_de_Execucao
JOIN 
    Maquinas ON Tempo_de_Execucao.FKTempo_maquina = Maquinas.IDMaquina
WHERE 
    FKTempo_maquina = ${FKMAQUINA}
GROUP BY 
    DiaDaSemana
ORDER BY 
    DiaDaSemana DESC
LIMIT 7;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function tempo_real_vmKaori(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
    CASE 
        WHEN DAYNAME(Data_Hora) = 'Monday' THEN 'Segunda-feira'
        WHEN DAYNAME(Data_Hora) = 'Tuesday' THEN 'Terça-feira'
        WHEN DAYNAME(Data_Hora) = 'Wednesday' THEN 'Quarta-feira'
        WHEN DAYNAME(Data_Hora) = 'Thursday' THEN 'Quinta-feira'
        WHEN DAYNAME(Data_Hora) = 'Friday' THEN 'Sexta-feira'
        WHEN DAYNAME(Data_Hora) = 'Saturday' THEN 'Sábado'
        WHEN DAYNAME(Data_Hora) = 'Sunday' THEN 'Domingo'
    END AS DiaDaSemana,
    COUNT(*) AS QuantidadeDesligamentos
FROM 
    Tempo_de_Execucao
JOIN 
    Maquinas ON Tempo_de_Execucao.FKTempo_maquina = Maquinas.IDMaquina
WHERE 
    FKTempo_maquina = ${FKMAQUINA}
GROUP BY 
    DiaDaSemana
ORDER BY 
    DiaDaSemana DESC
LIMIT 7;
`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ultimas_TempoExecMonth(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
        CASE 
            WHEN MONTH(Data_Hora) = 1 THEN 'Janeiro'
            WHEN MONTH(Data_Hora) = 2 THEN 'Fevereiro'
            WHEN MONTH(Data_Hora) = 3 THEN 'Março'
            WHEN MONTH(Data_Hora) = 4 THEN 'Abril'
            WHEN MONTH(Data_Hora) = 5 THEN 'Maio'
            WHEN MONTH(Data_Hora) = 6 THEN 'Junho'
            WHEN MONTH(Data_Hora) = 7 THEN 'Julho'
            WHEN MONTH(Data_Hora) = 8 THEN 'Agosto'
            WHEN MONTH(Data_Hora) = 9 THEN 'Setembro'
            WHEN MONTH(Data_Hora) = 10 THEN 'Outubro'
            WHEN MONTH(Data_Hora) = 11 THEN 'Novembro'
            WHEN MONTH(Data_Hora) = 12 THEN 'Dezembro'
        END AS Mes,
        COUNT(*) AS QuantidadeDesligamentos
    FROM 
        Tempo_de_Execucao
    JOIN 
        Maquinas ON Tempo_de_Execucao.FKTempo_maquina = Maquinas.IDMaquina
    WHERE 
        FKTempo_maquina = ${FKMAQUINA}
    GROUP BY 
        Mes
    ORDER BY 
        Mes DESC
    LIMIT 12; -- Limite de 12 meses`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function tempo_real_vmKaori2(FKMAQUINA) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `
            SELECT Alertas.IDAlerta AS Alertas FROM Alertas WHERE FKUnidade_negocio = ${FKUnidade} 
        `;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
        SELECT 
        CASE 
            WHEN MONTH(Data_Hora) = 1 THEN 'Janeiro'
            WHEN MONTH(Data_Hora) = 2 THEN 'Fevereiro'
            WHEN MONTH(Data_Hora) = 3 THEN 'Março'
            WHEN MONTH(Data_Hora) = 4 THEN 'Abril'
            WHEN MONTH(Data_Hora) = 5 THEN 'Maio'
            WHEN MONTH(Data_Hora) = 6 THEN 'Junho'
            WHEN MONTH(Data_Hora) = 7 THEN 'Julho'
            WHEN MONTH(Data_Hora) = 8 THEN 'Agosto'
            WHEN MONTH(Data_Hora) = 9 THEN 'Setembro'
            WHEN MONTH(Data_Hora) = 10 THEN 'Outubro'
            WHEN MONTH(Data_Hora) = 11 THEN 'Novembro'
            WHEN MONTH(Data_Hora) = 12 THEN 'Dezembro'
        END AS Mes,
        COUNT(*) AS QuantidadeDesligamentos
    FROM 
        Tempo_de_Execucao
    JOIN 
        Maquinas ON Tempo_de_Execucao.FKTempo_maquina = Maquinas.IDMaquina
    WHERE 
        FKTempo_maquina = ${FKMAQUINA}
    GROUP BY 
        Mes
    ORDER BY 
        Mes DESC
    LIMIT 12; -- Limite de 12 meses
    
`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    log_alertas,
    tempo_real_log_alertas,
    buscarDiscos,
    ultimas_CPU,
    tempo_real_CPU,
    ultimas_RAM,
    tempo_real_RAM,
    contar_MF_ativas,
    contar_MF_inativas,
    contar_MV_ativas,
    contar_MV_inativas,
    buscarTempoExecucao,
    atualizarFeedCountTem, 
    buscarJanelas,
    atualizarNomeMaquina,
    buscarTotal_Janelas, 
    buscarDiscosKaori, 
    atualizarTotalTempo, 
    ultimas_TempoExec, 
    tempo_real_vmKaori, 
    ultimas_TempoExecMonth, 
    tempo_real_vmKaori2
}
