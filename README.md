# Karaoke

## Projeto Integrador Senac

Projeto utilizando react native

## Instalações

> Criando o projeto com template blank

- `npx create-expo-app --template blank-typescript`

> Instalação expo-router

- `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`

> Instalação supabase
> `npm install --save @supabase/supabase-js @rneui/base react-native-url-polyfill`

No caso de incompatibilidade com o safe-area-context, instalação conforme abaixo
`npm install --save @supabase/supabase-js @rneui/themed react-native-url-polyfill --legacy-peer-deps`

Criar o arquivo .env.local

`EXPO_PUBLIC_SUPABASE_URL=https://kutemjrcgimvduaqihdy.supabase.co`
`EXPO_PUBLIC_SUPABASE_KEY="INFORMAR A CHAVE DE API AQUI"`

---

### Em caso de incompatibilidade com react-dom:

1. **_Limpe o cache do npm:_** Isso garante que você está começando de um estado limpo, sem resquícios de instalações anteriores.

- `npm cache clean --force`

2. **_Exclua a pasta `node_modules` e o arquivo `package-lock`.json:_** Estes arquivos guardam a estrutura de dependências da sua instalação anterior e podem estar corrompidos.

3. **_Execute o `npm install` novamente com o comando recomendado pelo próprio Expo:_** O Expo possui um comando específico para lidar com dependências de forma mais inteligente.

Se o erro persistir, você pode usar uma flag de força, mas saiba que isso pode causar problemas no futuro se as bibliotecas não forem realmente compatíveis. **_Use com cautela._**

- `npm install --legacy-peer-deps`

---

### Em caso de Incompatibilidade com o Expo

**_Passo a Passo_**

1.  **Atualizar os pacotes `react` e `react-dom`**

    Agora, atualize os pacotes `react` e `react-dom`. É crucial que a versão do React seja compatível com o Expo para evitar erros.

    `npm install react@19.1.0 react-dom@19.1.0`

2.  **Atualizar o pacote `expo`**

    Abra o terminal na pasta do seu projeto e execute o seguinte comando:

    `npm install expo@54.0.13`

    Isso vai atualizar o pacote principal do Expo para a versão recomendada que é compatível com o seu projeto.

3.  **Atualizar o pacote `expo-router`**

    Em seguida, atualize o pacote `expo-router` para garantir que o roteador da sua aplicação também esteja na versão correta:

    `npm install expo-router@~6.0.12`

4.  **Verificar se as atualizações foram bem-sucedidas**

    Para confirmar se todos os pacotes foram instalados corretamente nas versões desejadas, use o comando `npm ls`. Ele vai listar a versão instalada de cada dependência especificada:

    `npm ls react react-dom expo-router`

---

### Instalação das Apis nativas do expo

- Instala o expo áudio `npx expo install expo-audio`
- Instala o expo câmera `npx expo install expo-camera`
- Instala o async-storage `npx expo install @react-native-async-storage/async-storage`
