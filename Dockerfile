FROM node:lts-alpine3.17

# Configuração do usuário/permissões
WORKDIR /home/node/

COPY package.json .
RUN npm install

# Copia dos arquivos do projeto
COPY . .

# Execução
CMD ["npm", "run", "start"]