<p align="center">
  <img src="public/assets/PerastoLibBanner.png" alt="PerastroLib - Sistema de Gerenciamento de Biblioteca" width="850"/>
</p>

<h3 align="center">Gestão de bibliotecas escolares, simples, gratuita e offline</h3>

<p align="center">

<a href="../assets/gifprauso.gif">

<p align="center">
  <a href="https://github.com/MuriloPerastro/PerastroLib/releases/latest"><strong>⬇️ Baixar para Windows</strong></a>
  &nbsp;•&nbsp;
  <a href="#funcionalidades">Funcionalidades</a>
  &nbsp;•&nbsp;
  <a href="#backup-dos-dados">Backup</a>
  &nbsp;•&nbsp;
  <a href="#executar-em-modo-de-desenvolvimento">Para desenvolvedores</a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white"/>
  <img alt="Electron" src="https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white"/>
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black"/>
  <img alt="Plataforma" src="https://img.shields.io/badge/Windows-0078D6?logo=windows&logoColor=white"/>
</p>

---

## Sobre o projeto

O **PerastroLib** é um aplicativo desktop para modernizar o controle de acervo e de empréstimos de bibliotecas escolares. Ele nasceu de um **Projeto de Extensão Universitária** na biblioteca do **Colégio Estadual de Tempo Integral Edivaldo Machado Boaventura**, em Barra do Mendes – BA, onde todo o controle era feito manualmente em cadernos.

Foi pensado para uma comunidade escolar de cerca de 300 pessoas, mas pode ser usado por qualquer escola ou biblioteca: cada instituição configura o nome da sua biblioteca e cadastra as próprias turmas.

### O problema real

Em entrevistas com a gestão e com um aluno do colégio, apareceram dificuldades como falta de padronização, pouca visibilidade sobre quais livros estavam disponíveis ou com quem estavam, controle falho de prazos de devolução e registros de extravios e danos.

### Como o projeto foi feito

- Entrevistas diagnósticas e vistoria no espaço da biblioteca
- Desenvolvimento dos módulos de acervo, pessoas e empréstimos
- Feedback direto da gestão escolar e ajustes no sistema
- Implantação da versão oficial e treinamento prático em novembro de 2026

---

## Como baixar e utilizar

Não é necessário configurar ambiente de desenvolvimento nem ter internet.

1. Acesse a página de [**Releases**](https://github.com/MuriloPerastro/PerastroLib/releases/latest).
2. Baixe o instalador para Windows (`PerastroLib Setup 1.0.0.exe`).
3. Execute o arquivo e siga as instruções de instalação.
4. Abra o PerastroLib e informe o nome da sua instituição na configuração inicial.
5. Cadastre turmas, livros e pessoas, e comece a registrar empréstimos.

> [!NOTE]
> Os dados ficam armazenados **localmente** no computador onde o aplicativo está instalado. Para trocar de computador ou reinstalar o sistema, use o [backup](#backup-dos-dados).

---

## Funcionalidades

| Módulo | O que faz |
|---|---|
| **Dashboard** | Indicadores de total de livros, exemplares disponíveis e emprestados |
| **Acervo** | Cadastro, consulta, edição e busca por título ou autor |
| **Pessoas** | Cadastro de alunos, professores e demais leitores |
| **Empréstimos** | Registro de empréstimos, prazos e devoluções |
| **Histórico** | Acompanhamento completo das movimentações |
| **Disponibilidade** | Controle de exemplares disponíveis |
| **Organização** | Turmas e configurações da instituição |
| **Backup** | [Descreva: exporta/restaura os dados em arquivo] |

---

## Backup dos dados

[Explique em 3 a 5 linhas: como gerar o backup, onde o arquivo é salvo, como restaurar e se é manual ou automático.]

Recomenda-se guardar uma cópia do arquivo de backup **fora do computador da biblioteca** (pendrive ou nuvem), para proteger os dados contra falhas do equipamento.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **React** | Interface e componentes |
| **JavaScript** | Funcionalidades e regras de negócio |
| **Vite** | Ambiente de desenvolvimento e build |
| **CSS** | Estilização e identidade visual |
| **LocalStorage (JSON)** | Armazenamento local de dados |
| **Electron** | Empacotamento como aplicativo desktop para Windows |

---

## Executar em modo de desenvolvimento

Requisitos: [Node.js](https://nodejs.org/) instalado.

```bash
git clone https://github.com/MuriloPerastro/PerastroLib.git
cd PerastroLib
npm install
npm run dev          # [confirme o nome do script no package.json]
```

Para gerar o instalador:

```bash
npm run build        # [confirme os scripts de build/empacotamento]
```

---

## Uso de Inteligência Artificial

Usei ferramentas de IA como apoio à aprendizagem, à resolução de problemas e à construção de funcionalidades. O projeto também exigiu levantamento de requisitos com os usuários, modelagem dos dados, definição das regras de negócio, identidade visual própria, testes e ajustes a partir do feedback da escola.

---

## Roadmap

- [ ] Reserva de obras
- [ ] Exportação de relatórios
- [ ] [Outras ideias suas]

## Licença

Distribuído sob a licença [MIT](LICENSE). *(Crie o arquivo `LICENSE` em **Add file → Create new file → "LICENSE"** e o GitHub oferece o modelo.)*

## Autor

**Murilo Perastro**
[GitHub](https://github.com/MuriloPerastro) • [LinkedIn](https://www.linkedin.com/in/[seu-perfil])
