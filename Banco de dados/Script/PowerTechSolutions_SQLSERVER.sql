
-- Criação das tabelas 

CREATE TABLE Grupo_Empresa(
	IDGrupo_Empresa INT PRIMARY KEY IDENTITY(1,1),
    Apelido_Interno_Grupo VARCHAR(100),
    Razao_social VARCHAR(100)
);

CREATE TABLE Unidade_de_negocio(
	IDUnidade INT PRIMARY KEY IDENTITY(1,1),
    Cnpj CHAR(14),
    Apelido_interno VARCHAR(100),
	Nome_Fantasia VARCHAR(100),
    FKGrupo_empresa INT,
		CONSTRAINT FKGrupo_Com_Unidade FOREIGN KEY (FKGrupo_empresa)
			REFERENCES Grupo_Empresa(IDGrupo_Empresa)
);

CREATE TABLE Endereco_Unidade(
	IDEndereco_unidade INT PRIMARY KEY IDENTITY(1,1),
    Cep VARCHAR(8),
    Logradouro VARCHAR(100),
    Bairro VARCHAR(100),
    Localidade VARCHAR(100),
    UF CHAR(2),
    FKUnidade_negocio INT,
		CONSTRAINT FKUnidade_Endereco FOREIGN KEY (FKUnidade_negocio)
			REFERENCES Unidade_de_negocio(IDUnidade)
);

CREATE TABLE Permissoes(
	IDPermissao INT PRIMARY KEY IDENTITY(1,1),
    Visualizar TINYINT,
    Editar TINYINT,
    Cadastrar TINYINT,
    Deletar TINYINT
);

CREATE TABLE Nivel_acesso(
	IDNivel_acesso INT IDENTITY(1,1),
    Apelido VARCHAR(60),
	FKPermissao INT,
		CONSTRAINT FKNivel_Permissao FOREIGN KEY (FKPermissao)
			REFERENCES Permissoes(IDPermissao),
	PRIMARY KEY (IDNivel_acesso,FKPermissao)
);

CREATE TABLE Usuario_Dashboard(
	IDUsuario INT IDENTITY(1,1),
	Nome VARCHAR(150),
    Email VARCHAR(150),
    Cpf CHAR(11),
    Senha CHAR(8),
    FKUnidade INT,
    FKNivel_acesso INT,
	FKPermissoes INT,
		CONSTRAINT FKUnidade_Usuario FOREIGN KEY (FKUnidade)
			REFERENCES Unidade_de_negocio(IDUnidade),
		CONSTRAINT FKNivel_Usuario FOREIGN KEY (FKNivel_acesso,FKPermissoes)
			REFERENCES Nivel_acesso(IDNivel_acesso,FKPermissao),
		CONSTRAINT PKUsuario_Nivel_acesso PRIMARY KEY (IDUsuario,FKNivel_acesso)
);

CREATE TABLE Tipo_maquina(
	IDTipo INT PRIMARY KEY IDENTITY(1,1),
    Apelido VARCHAR(80)
);

CREATE TABLE Maquinas(
	IDMaquina INT PRIMARY KEY IDENTITY(1,1),
    Apelido VARCHAR(100),
    FKFuncionario INT,
	FKNivel_Usuario INT,
		CONSTRAINT FKFuncionario_maquina FOREIGN KEY (FKFuncionario,FKNivel_Usuario)
			REFERENCES Usuario_Dashboard(IDUsuario,FKNivel_acesso),
	FKTipo_maquina INT,
		CONSTRAINT FKTipo_maquina FOREIGN KEY (FKTipo_maquina)
			REFERENCES Tipo_maquina(IDTipo)
);

CREATE TABLE Tempo_de_Execucao(
	IDTempo INT PRIMARY KEY IDENTITY(1,1),
	Data_Hora DATETIME DEFAULT CURRENT_TIMESTAMP,
	Total_captura TIME,
	FKMaquina INT,
	CONSTRAINT FKTempo_maquina FOREIGN KEY (FKMaquina) REFERENCES Maquinas(IDMaquina)
);

CREATE TABLE Redes_conectadas(
	IDConexao INT PRIMARY KEY IDENTITY(1,1),
    Data_Hora_Conexao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Servidor_DNS VARCHAR(45),
    FKMaquina INT,
		CONSTRAINT FKMaquina_Rede FOREIGN KEY (FKMaquina)
			REFERENCES Maquinas(IDMaquina)
);

CREATE TABLE Janelas_Abertas(
	IDRegistro INT PRIMARY KEY IDENTITY(1,1),
    IDJanela INT,
    PIDJanelas INT,
    Nome_Janelas VARCHAR(500),
	Data_Hora_Conexao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FKMaquina INT,
		CONSTRAINT FKMaquina_Janelas FOREIGN KEY (FKMaquina)
			REFERENCES Maquinas(IDMaquina)
);

CREATE TABLE Dispositivos_USB(
	IDRegistro INT PRIMARY KEY IDENTITY(1,1),
    Nome_Dispositivo VARCHAR(300),
    Data_Hora_Conexao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FKMaquina INT,
		CONSTRAINT FKMaquina_Usb FOREIGN KEY (FKMaquina)
			REFERENCES Maquinas(IDMaquina)
);

CREATE TABLE Tipo_componente(
	IDTipo INT PRIMARY KEY IDENTITY(1,1),
    Apelido VARCHAR(80)
);

CREATE TABLE Componentes_maquina(
	IDComponente INT PRIMARY KEY IDENTITY(1,1),
    Apelido VARCHAR(100),
    FKMaquina INT,
		CONSTRAINT FKMaquina_Componente FOREIGN KEY (FKMaquina)
			REFERENCES Maquinas(IDMaquina),
	FKTipo_componente INT,
		CONSTRAINT FKTipo_Componente FOREIGN KEY (FKTipo_componente)
			REFERENCES Tipo_componente(IDTipo)
);

CREATE TABLE Parametros_componente(
	IDParametro INT PRIMARY KEY IDENTITY(1,1),
    Parametro FLOAT,
    FKComponente INT,
		CONSTRAINT FKComponente_Parametro FOREIGN KEY (FKComponente)
			REFERENCES Componentes_maquina(IDComponente)
);

CREATE TABLE Componentes_cadastrados(
	IDComponente_cadastrado INT PRIMARY KEY IDENTITY(1,1),
    Apelido VARCHAR(100)
);

CREATE TABLE Componentes_monitorados(
	IDComponente_monitorado INT IDENTITY(1,1),
    FKComponente_cadastrado INT,
    FKMaquina INT,
		CONSTRAINT FKCompoenente_C_Componente_M FOREIGN KEY (FKComponente_cadastrado)
			REFERENCES Componentes_cadastrados(IDComponente_cadastrado),
		CONSTRAINT FKMaquina_Componente_M FOREIGN KEY (FKMaquina)
			REFERENCES Maquinas(IDMaquina),
		CONSTRAINT PKComponente_C_Componente_M PRIMARY KEY (IDComponente_monitorado,FKComponente_cadastrado)
);

CREATE TABLE Monitoramento_RAW(
	IDMonitoramento INT PRIMARY KEY IDENTITY(1,1),
    Data_Hora_Captura DATETIME DEFAULT CURRENT_TIMESTAMP,
	Total FLOAT,
	Free FLOAT,
	Uso FLOAT,
	Porcentagem FLOAT,
    FKComponente_Monitorado INT,
	FKComponente_Cadastrado INT,
		CONSTRAINT FKMonitoramento_RAW_Componente_maquina FOREIGN KEY (FKComponente_Monitorado,FKComponente_Cadastrado)
			REFERENCES Componentes_monitorados(IDComponente_monitorado,FKComponente_Cadastrado)
);

CREATE TABLE Monitoramento_TRUSTED(
	IDMonitoramento INT PRIMARY KEY IDENTITY(1,1),
    Data_Hora_Captura DATETIME DEFAULT CURRENT_TIMESTAMP,
	Total FLOAT,
	Free FLOAT,
	Uso FLOAT,
	Porcentagem FLOAT,
    FKComponente_Monitorado INT,
	FKComponente_Cadastrado INT,
		CONSTRAINT FKMonitoramento_TRUSTED_Componente_maquina FOREIGN KEY (FKComponente_Monitorado,FKComponente_Cadastrado)
			REFERENCES Componentes_monitorados(IDComponente_monitorado,FKComponente_Cadastrado)
);

CREATE TABLE Nivel_alerta(
	IDNivel_alerta INT PRIMARY KEY IDENTITY(1,1),
    Nivel VARCHAR(30)
);

CREATE TABLE Alertas(
	IDAlerta INT PRIMARY KEY IDENTITY(1,1),
    Alerta VARCHAR(100),
    Data_Hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FKMonitoramento INT,
    FKNivel_alerta INT,
    FKUnidade_negocio INT,
		CONSTRAINT FKMonitoramento_alerta FOREIGN KEY (FKMonitoramento)
			REFERENCES Monitoramento_Trusted(IDMonitoramento),
		CONSTRAINT FKNivel_alerta FOREIGN KEY (FKNivel_alerta)
			REFERENCES Nivel_alerta(IDNivel_alerta),
		CONSTRAINT FKUnidade_negocio_alerta FOREIGN KEY (FKUnidade_negocio)
			REFERENCES Unidade_de_negocio(IDUnidade)
);

-- Aréa de inserts para testes de funcionalidade 

INSERT INTO Grupo_Empresa (Apelido_Interno_Grupo,Razao_social) VALUES
('EDP Smart','EDP ENERGIAS DO BRASIL S.A.'),
('Matrix','Matrix Comercio e Servicos LTDA'),
('AES Tietê','AES TIETE INTEGRA SOLUCOES EM ENERGIA LTDA.');

INSERT INTO Unidade_de_negocio (Cnpj,Apelido_interno,Nome_Fantasia,FKGrupo_empresa) VALUES
('28630316000186','EDP Smart Sede','EDP Energias do Brasil',1),
('28630316000286','EDP Smart Faria Lima','EDP Energias do Brasil',1),
('28630316000386','EDP Smart Suzano','EDP Energias do Brasil',1),
('01564634000130','Matrix Sede','Matrix',2),
('01564634000230','Matrix Mogi das Cruzes','Matrix',2),
('26203837000121','AES Tiete Sede','AES TIETE INTEGRA',3);

INSERT INTO Permissoes (Visualizar,Editar,Cadastrar,Deletar) VALUES
(1,1,1,1),
(1,0,0,0);

INSERT INTO Nivel_acesso (Apelido,FKPermissao) VALUES
('Eng NOC',1),
('Gestor',2);

INSERT into Usuario_Dashboard (Nome,Email,Cpf,Senha,FKUnidade,FKNivel_acesso,FKPermissoes) VALUES
('davi','davi@teste.com','48372073830','12345678',1,1,1),
('henry','henry@teste.com','12345678910','87654321',1,2,2);

INSERT INTO Alertas(Alerta,Data_Hora,FKMonitoramento,FKNivel_alerta,FKUnidade_negocio) VALUES
('Alerta de teste1',default,null,null,1),
('Alerta de teste2',default,null,null,1),
('Alerta de teste2',default,null,null,1),
('Alerta de teste3',default,null,null,1),
('Alerta de teste4',default,null,null,1);

INSERT INTO Componentes_cadastrados (Apelido) values
('CPU'),
('RAM'),
('DISCO'),
('REDE'),
('JANELAS'),
('USB');

INSERT INTO Tipo_maquina (Apelido) VALUES
('FISICA'),
('VIRTUAL');

INSERT INTO Maquinas (Apelido,FKFuncionario,FKTipo_maquina) VALUES
('teste01',1,2),
('teste02',1,1),
('teste03',1,1);

INSERT INTO Componentes_monitorados (FKComponente_cadastrado,FKMaquina) VALUES
(1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1),
(1,2),
(2,2),
(3,2),
(4,3),
(5,3),
(6,3);

