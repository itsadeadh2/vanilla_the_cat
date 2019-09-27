
##  Vanilla_The_Cat

O objetivo desse projeto é exercitar meus conhecimentos em JavaScript/Node/Express assim como criar um projeto aprendendo diretamente de suas documentacoes (sem necessidade de cursos). Vanilla_The_Cat é um bot para o telegram que lhe informa sobre os status de seus projetos no GitLab, o projeto é feito utilizando a biblioteca Telegraf para o NodeJs.

  

## **Tecnologias Utilizadas:**

 - [NodeJs](https://nodejs.org/en/)
 - [Express](https://www.npmjs.com/package/express)
 - [Telegraf](https://www.npmjs.com/package/telegraf)
 - [Docker](https://www.docker.com/)
 - [docker-compose](https://docs.docker.com/compose/)
 

## Requisitos 

 1. **Registro de Aplicacao:**
 Vanilla The Cat é um bot que integra vários recursos do GitLab na comodidade do seu chat no telegram, e para poder fazer isso ela requer algumas permissões do usuario para que possa acessar seus dados e integrações podendo assim processá-los e disponibiliza-los no telegram. Assim sendo, nada mais justo do que [fazer uma aplicacao no gitlab](https://docs.gitlab.com/ee/api/oauth2.html) que permite que o usuario se autentique com OAuth2 e lhe mostra quais permissoes ele está concedendo a Vanilla.

2. **Um servidor com IP Público:**
Vanilla The Cat depende muito dos [WebHooks do Gitlab](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html) ([que agora finalmente sao configurados automaticamente!](https://github.com/itsadeadh2/vanilla_the_cat/commit/b877107a5cb6649e5024c2c93373dc41e6122319)) assim sendo, todas as notificações dos projetos são repassadas a ela através de requests pelo GitLab, e lá você precisa informar um endpoint para isso.

3. **Um bot do telegram:**
Aqui não tem muito segredo, é só falar com o [botfather](https://telegram.me/botfather) que ele te ajuda a criar um rapidinho.
4. **Docker e docker-compose instalados no servidor**

Se você preencheu todos os requisitos, deverá ter conseguido obter os valores a seguir:

 - **Token do bot:** 

Token que o botfather te dá ao criar um bot, é utilizado para se autenticar na api e utilizar o bot. 
- **Client ID e Client Secret:**

Ambos os campos são fornecidos pelo GitLab após você criar uma aplicação. E podem ser consultados novamente sempre que necessario no menu *settings -> applications*
- **IP público ou Domínio da sua aplicacao:**

O IP ou domínio no qual a internet pode se conectar ao seu servidor.

**IMPORTANTE**
Tanto o **Token do Bot** quando o **Client Secret** são chaves de autenticação que dão acesso a sua aplicação e assim sendo **não devem ser compartilhadas ou tornadas públicas** pois no caso de isso acontecer outra pessoa pode usar esses valores para acessar e manipular sua aplicação/bot.

## Como Rodar


1. Exporte as ENVVARS **BOT_TOKEN**, **CLIENT_ID** e **CLIENT_SECRET**
com os valoes do Token do Bot, Client ID e Client Secret do GitLab respectivamente.
2. Edite o arquivo default.json que se encontra na pasta config alterando o valor de apiUrl para o IP Público ou Domínio da sua aplicação.
3. Execute o comando `docker-compose up` na pasta raíz da aplicação
4. Acesse seu bot e use o comando `/lesgo`