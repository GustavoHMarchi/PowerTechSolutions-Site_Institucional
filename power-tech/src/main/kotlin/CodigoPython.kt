import java.io.File

object CodigoPython {

    fun execpython(servicos:MutableList<ServicosMonitorados>) {

        val servicoCadastradorepositorio = ServicoCadastradoRepositorio()
        servicoCadastradorepositorio.iniciar()

        var CPU = 0
        var componenteCPU = 0
        var RAM = 0
        var componenteRAM = 0
        var DISCO = 0
        var componenteDISCO = 0

        for (servico in servicos){

            var apelido = servicoCadastradorepositorio.buscarComponente(servico.FKComponente_cadastrado)

            when(apelido){
                "CPU" -> {
                    CPU += 1
                    componenteCPU = servico.IDComponente_monitorado
                }
                "RAM" -> {
                    RAM += 1
                    componenteRAM = servico.IDComponente_monitorado
                }
                "DISCO" -> {
                    DISCO += 1
                    componenteDISCO = servico.IDComponente_monitorado
                }
            }

        }


        var codigoPython ="""
import psutil
import mysql.connector

cpu = psutil.cpu_percent(interval=1)
ram = psutil.virtual_memory()
disco = psutil.disk_usage('/')

try:
    mydb = mysql.connector.connect(host = 'localhost', user = 'root',password = '@myLOVEisthe0506',database = 'PowerTechSolutions')
    if mydb.is_connected():
        db_info = mydb.get_server_info()
        mycursor = mydb.cursor()
        if $CPU == 1:
            sql_querryCPU = 'INSERT INTO Monitoramento_RAW VALUES (NULL, CURRENT_TIMESTAMP(), %s,$componenteCPU)'
            valCPU = [round(cpu,2)]
            mycursor.execute(sql_querryCPU, valCPU)
            mydb.commit()
        if $RAM == 1:
            sql_querryRAM = 'INSERT INTO Monitoramento_RAW VALUES (NULL, CURRENT_TIMESTAMP(), %s,$componenteRAM)'
            valRAM = [round(ram.percent,2)]
            mycursor.execute(sql_querryRAM, valRAM)
            mydb.commit()
        if $DISCO == 1:
            sql_querryDISCO = 'INSERT INTO Monitoramento_RAW VALUES (NULL, CURRENT_TIMESTAMP(), %s,$componenteDISCO)'
            valDISCO = [round(disco.percent,2)]
            mycursor.execute(sql_querryDISCO, valDISCO)
            mydb.commit()
finally:
    if(mydb.is_connected()):
        mycursor.close()
        mydb.close()
"""

        val nomeArquivoPyDefault = "CodigoPython.py"

        File(nomeArquivoPyDefault).writeText(codigoPython)
        Runtime.getRuntime().exec("python3 $nomeArquivoPyDefault")

        println("Python excetudado")

    }

}