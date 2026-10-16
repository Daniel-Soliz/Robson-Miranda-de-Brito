# Robson Brito — Fotografia Autoral & Painel Administrativo

Este projeto é o site oficial e painel de controle do fotógrafo **Robson Brito** (@byrobsonbrito), desenvolvido sob direção de arte editorial de alto padrão com estética escura (#0B0B0C, champanhe #C8A96A e Cormorant Garamond).

O site já funciona de imediato em **Modo Demonstração** mesmo sem nenhuma chave de API ou banco de dados configurado.

---

## 1. Como Rodar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse no navegador:
   - **Site principal:** `http://localhost:3000/`
   - **Página da Bio:** `http://localhost:3000/links`
   - **Painel Administrativo:** `http://localhost:3000/admin`

---

## 2. Como Configurar o Firebase (Passo a Passo Simples)

Se você desejar que os dados fiquem salvos na nuvem do Google de forma permanente:

1. Acesse [firebase.google.com](https://firebase.google.com/) e entre com a sua conta Google.
2. Clique em **"Adicionar projeto"** e dê o nome `robson-brito-fotografia`.
3. No menu lateral esquerdo:
   - **Authentication:** Clique em "Começar", selecione o método **"E-mail/senha"** e ative a primeira opção.
   - **Firestore Database:** Clique em "Criar banco de dados", escolha a localização (ex: `southamerica-east1` para São Paulo) e selecione o modo de produção. Copie as regras do arquivo `firestore.rules` deste projeto para a aba "Regras" do Firestore.
   - **Storage:** Clique em "Começar", avance até concluir e copie as regras do arquivo `storage.rules` deste projeto para a aba "Regras" do Storage.
4. Clique no ícone de engrenagem no canto superior esquerdo ao lado de "Visão geral do projeto" > **Configurações do projeto**.
5. Em "Seus aplicativos", clique no ícone da Web `</>`, dê um apelido (ex: `site-robson`) e clique em Registrar.
6. Copie as credenciais que aparecerem na tela e cole no arquivo `.env` do projeto:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSy..."
   VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="seu-projeto"
   VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
   VITE_FIREBASE_APP_ID="1:123456:web:abcdef"
   ```

---

## 3. Como Criar o Login do Robson

1. No Firebase Console, vá em **Authentication** > aba **Users (Usuários)**.
2. Clique em **"Adicionar usuário"**.
3. Digite o e-mail oficial (ex: `contato@byrobsonbrito.com.br`) e escolha uma senha segura.
4. Pronto! Use esse mesmo e-mail e senha para entrar na rota `/admin`.

---

## 4. Como Usar o Painel pelo Celular

O painel foi desenhado especificamente para funcionar de forma leve e rápida na tela do smartphone:

- **Postar fotos:** Vá na aba **Fotos**, clique em "Enviar Novas Fotos", selecione uma ou mais imagens direto da galeria do celular. O sistema reduz e comprime as fotos automaticamente para não gastar dados nem espaço.
- **Destaques da página inicial:** Clique no ícone de estrela de qualquer foto para que ela apareça na Galeria Circular do topo.
- **Gerenciar serviços:** Na aba **Serviços**, você pode alterar valores, o que está incluso, foto de capa e cadastrar sua chave Pix para receber reservas de sinal com 1 clique.
- **Gerenciar agenda:** Na aba **Agenda**, você vê os pedidos de agendamento recebidos. Ao clicar em **"Confirmar"** ou **"Recusar"**, o WhatsApp do cliente abre automaticamente com uma mensagem personalizada e educada pronta para enviar.
- **Atualizar contatos:** Na aba **Contatos**, você altera WhatsApp, Instagram, telefone e endereço uma única vez, e todo o site é atualizado instantaneamente.

---

## 5. Como Publicar (Vercel ou Netlify) e Conectar Domínio Próprio

1. Suba o código para uma conta no GitHub.
2. Conecte sua conta na [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/).
3. Importe o repositório. Em **Environment Variables**, adicione as mesmas variáveis do arquivo `.env`.
4. Clique em **Deploy**.
5. Em **Domains (Domínios)**, adicione seu domínio oficial (ex: `byrobsonbrito.com.br`) e aponte os registros DNS (tipo CNAME ou A) indicados pela plataforma.

---

## 6. Como Colocar o Link na Bio do Instagram

1. Acesse o seu perfil no Instagram pelo aplicativo no celular.
2. Toque em **"Editar perfil"** > **"Links"** > **"Adicionar link externo"**.
3. No campo URL, coloque o endereço:
   `https://byrobsonbrito.com.br/links`
4. No campo título, coloque:
   `Orçamentos & Portfólio • Robson Brito`
5. Salve! Seus seguidores terão acesso imediato aos botões elegantes de WhatsApp, agendamento de sessões e portfólio completo.
