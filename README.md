# 🎾 RacketMatch

Aplicação completa para marcar e gerir partidas de Ténis/Padel entre jogadores.

Projeto final de curso com três frentes principais:

- Frontend mobile feito em React Native com Expo
- Backend (API) em Node.js
- Painel administrativo web com React e TypeScript

---

## 📚 Sumário

- Estrutura
- Tecnologias
- Instalação Local
- Demonstração
- Autor
- Licença

---

## 📁 Estrutura do Projeto

O repositório está dividido em três principais diretórios, cada um responsável por uma parte da aplicação:

- **backend/**  
  Contém a API REST desenvolvida em Node.js com Express. Responsável por autenticação, regras de negócio e integração com banco de dados (MongoDB).

- **frontend/**  
  Aplicação mobile criada com React Native e Expo. Interface voltada para os jogadores, com funcionalidades como marcação de partidas e visualização de histórico.

- **racketmatch-admin/**  
  Painel administrativo web desenvolvido com React e TypeScript. Permite o gerenciamento de usuários, partidas e estatísticas da plataforma.

Outros arquivos e pastas incluem:

- **README.md** — documentação geral do projeto  
- **.gitignore** — define arquivos ignorados pelo Git  
- **package.json** — configurações e dependências do projeto


## 🚀 Tecnologias Utilizadas

**Frontend (Mobile)**  
- React Native  
- Expo  
- React Navigation  
- Styled Components  
- Axios  

**Backend (API)**  
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- JWT (autenticação)  
- Bcrypt (criptografia de senhas)

**Painel Administrativo**  
- React  
- Vite  
- TypeScript  
- Tailwind CSS  
- Axios  

---

## ⚙️ Instalação Local

### 1. Clonar o repositório

Abra o terminal e digite:

git clone https://github.com/TiagoSantosAlbano/RacketMatch.git
cd RacketMatch

shell
Copiar
Editar

### 2. Instalar dependências

#### Backend

cd backend
npm install
npm run dev

shell
Copiar
Editar

#### Frontend

cd frontend
npm install
npx expo start

shell
Copiar
Editar

#### Painel Administrativo

cd racketmatch-admin
npm install
npm run dev

yaml
Copiar
Editar

---

## 📸 Demonstração

- Tela de login e registro (Mobile)
- Listagem e agendamento de partidas (Mobile)
- Dashboard com estatísticas (Admin)
- Gerenciamento de usuários e jogos (Admin)

---

## 👤 Autor

Nome: Tiago Santos Albano  
Projeto desenvolvido como parte do curso PAP (Projeto de Aptidão Profissional).

---

## 📄 Licença

Este projeto está sob a licença MIT.  
Você pode usar, modificar e distribuir livremente com os devidos créditos.

---
