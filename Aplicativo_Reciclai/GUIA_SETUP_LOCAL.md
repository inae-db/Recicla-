# 📱 Guia: Executar Reciclaí Localmente com Bluetooth Funcional

## 🎯 Objetivo
Configurar o app Reciclaí em sua máquina local para que o Bluetooth funcione 100% com o ESP32 via teclado matricial.

---

## 📋 Pré-requisitos

### 1. **Node.js e npm/pnpm**
Você precisa ter instalado:
- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (gerenciador de pacotes) - [Instalação](https://pnpm.io/installation)

**Verificar instalação:**
```bash
node --version
npm --version
pnpm --version
```

### 2. **Git** (opcional, mas recomendado)
Para clonar o repositório facilmente.

### 3. **ESP32 Configurado**
- ESP32 com código Bluetooth carregado
- Teclado matricial conectado ao ESP32
- ESP32 emparelhado/pronto para conectar

### UUIDs oficiais usados pelo app

O projeto inclui o arquivo `ESP32_RECICLAI_BLUETOOTH.ino` como referência. Abra esse arquivo na Arduino IDE, ajuste os pinos do seu teclado e grave-o no ESP32. O firmware precisa anunciar o dispositivo como `ReciclaiESP32` e usar exatamente estes UUIDs:

```cpp
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"
```

A característica deve ter propriedade de notificação (`NOTIFY`). O app solicita o serviço customizado, assina as notificações e aceita o código como texto UTF-8. Para o teste da caneta, o teclado deve enviar `123456\n` — a quebra de linha é opcional.

---

## 🚀 Passo 1: Baixar os Arquivos do Projeto

### Opção A: Usando o Manus (Recomendado)

1. Acesse o painel do Manus do projeto Reciclaí
2. Clique em **"⋯ (More menu)"** no canto superior direito
3. Selecione **"Download as ZIP"**
4. Extraia o arquivo em uma pasta de sua escolha:
   ```bash
   unzip reciclai.zip
   cd reciclai
   ```

### Opção B: Usando Git (Se você tiver acesso ao repositório)
```bash
git clone <seu-repositorio-url>
cd reciclai
```

---

## 📦 Passo 2: Instalar Dependências

Na pasta do projeto, execute:

```bash
pnpm install
```

Isso vai instalar todas as dependências necessárias (React, Tailwind, shadcn/ui, etc).

**Tempo estimado:** 2-5 minutos (depende da velocidade da internet)

---

## 🔧 Passo 3: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env.local`:
   ```bash
   touch .env.local
   ```

2. Adicione as seguintes variáveis (copie do arquivo `.env` se existir):
   ```
   VITE_APP_TITLE=Reciclaí
   VITE_APP_LOGO=Reciclaí
   ```

---

## ▶️ Passo 4: Iniciar o Servidor Local

Execute o comando de desenvolvimento:

```bash
pnpm dev
```

Você verá uma saída como:
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

**O app estará disponível em:** `http://localhost:3000`

---

## 🔗 Passo 5: Acessar o App

### No seu computador:
- Abra o navegador e acesse: **http://localhost:3000**

### Em outro dispositivo na mesma rede (ex: tablet):
- Use o IP mostrado: **http://192.168.x.x:3000**

---

## 📡 Passo 6: Testar a Conexão Bluetooth

### 1. **Ativar Bluetooth no seu dispositivo**
   - Certifique-se de que o Bluetooth está ligado

### 2. **Acessar a tela de Conexão Bluetooth**
   - Na home, clique em **"Digitar Código"**
   - Ou acesse: `http://localhost:3000/bluetooth`

### 3. **Conectar ao ESP32**
   - Clique em **"Conectar ao ESP32"**
   - Selecione seu dispositivo ESP32 na lista
   - Confirme o pareamento

### 4. **Testar com o Teclado Matricial**
   - Digite um código no teclado matricial do ESP32
   - O código deve aparecer automaticamente no app
   - O app buscará o produto e exibirá as informações

---

## 🐛 Solução de Problemas

### ❌ "Erro: Bluetooth não disponível"
**Solução:**
- Certifique-se de que o navegador suporta Web Bluetooth API (Chrome, Edge, Opera)
- Ative o Bluetooth do seu dispositivo
- Tente em um navegador diferente

### ❌ "ESP32 não aparece na lista"
**Solução:**
- Verifique se o ESP32 está ligado e com Bluetooth ativo
- Reinicie o ESP32
- Verifique se o código Bluetooth do ESP32 está correto
- Tente desativar e reativar o Bluetooth do computador

### ❌ "Conexão cai constantemente"
**Solução:**
- Verifique a distância entre o dispositivo e o ESP32 (máximo ~10 metros)
- Reduza interferências (afaste de outros dispositivos Bluetooth)
- Verifique a alimentação do ESP32

### ❌ "Código não é recebido automaticamente"
**Solução:**
- Verifique se a conexão Bluetooth está ativa (ícone deve estar verde)
- Teste digitando manualmente no campo de entrada para confirmar que o app funciona
- Verifique se o ESP32 está enviando os dados corretamente

---

## 📝 Estrutura do Projeto

```
reciclai/
├── client/                    # Código frontend (React)
│   ├── src/
│   │   ├── pages/            # Telas do app
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # BluetoothContext
│   │   ├── lib/              # Utilitários (materials.ts com dados)
│   │   └── App.tsx           # Rotas principais
│   └── index.html            # HTML principal
├── server/                    # Código backend (Express)
├── package.json              # Dependências
└── vite.config.ts            # Configuração Vite
```

---

## 🔌 Integração com ESP32: Fluxo de Dados

```
ESP32 (Teclado Matricial)
    ↓
    └─→ Bluetooth (envia código)
            ↓
            └─→ App Reciclaí (recebe)
                    ↓
                    └─→ Busca no banco de dados
                            ↓
                            └─→ Exibe informações
```

---

## 📱 Código Esperado do ESP32

O ESP32 deve enviar o identificador do produto como texto UTF-8. Para a caneta, envie:

```text
123456\n
```

O app remove espaços e quebras de linha, aceita entre 6 e 13 dígitos e também entende, como fallback, JSON simples:

```json
{"code":"123456"}
```

Cada acionamento completo do teclado deve enviar uma única mensagem. Não envie o nome do produto; envie o código cadastrado no catálogo.

---

## ➕ Como adicionar mais produtos

Para cadastrar um novo produto, edite `client/src/lib/products.ts` e adicione um objeto dentro de `products`. Use um código único em `ean`; ele pode ter 6 a 13 dígitos no protótipo. Preencha todos os campos para que o ScannerEAN, o ScannerBluetooth e o Perfil exibam os mesmos dados:

```ts
{
  ean: '123457',
  name: 'Nome do produto',
  category: 'Material',
  bin: 'azul',
  description: 'Descrição curta e objetiva.',
  disposalInstructions: ['Passo 1', 'Passo 2'],
  decompositionTime: 'Tempo estimado de decomposição',
  environmental: {
    co2Saved: 0,
    waterSaved: 0,
    energySaved: 0,
    treesSaved: 0,
  },
  recyclable: true,
  tips: ['Dica de descarte responsável'],
}
```

Depois, programe o ESP32 para enviar o mesmo valor de `ean` seguido de `\n`. Por exemplo, para o código `123457`, envie `Serial.println("123457");` pela característica BLE. O campo `environmental` deve conter valores educativos documentados e identificados como estimativas quando não houver medição específica do produto.

## 🎮 Testando Manualmente (Sem ESP32)

Se você não tiver o ESP32 pronto ainda, pode testar manualmente:

1. Acesse: `http://localhost:3000/scanner-bluetooth`
2. No campo **"Digitar código manualmente"**, digite um código válido:
   - `123456` (Caneta esferográfica)
   - `garrafa-pet`
   - `pote-plastico`
   - `sacola-plastica`
3. Clique em **"Buscar"**
4. O app exibirá as informações do produto

---

## 🚀 Dicas de Desenvolvimento

### Modo de Desenvolvimento com Hot Reload
O app recarrega automaticamente quando você faz alterações no código. Basta salvar o arquivo!

### Acessar DevTools
- Pressione **F12** ou **Ctrl+Shift+I** para abrir as ferramentas de desenvolvedor
- Veja logs, erros e teste a API Bluetooth

### Parar o Servidor
- Pressione **Ctrl+C** no terminal

### Reiniciar o Servidor
```bash
pnpm dev
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no console do navegador (F12)
2. **Reinicie o servidor** (`pnpm dev`)
3. **Limpe o cache** do navegador (Ctrl+Shift+Delete)
4. **Teste em outro navegador** (Chrome é mais confiável para Bluetooth)

---

## ✅ Checklist de Setup

- [ ] Node.js e pnpm instalados
- [ ] Arquivos do projeto baixados
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Servidor iniciado (`pnpm dev`)
- [ ] App acessível em `http://localhost:3000`
- [ ] Bluetooth ativado no dispositivo
- [ ] ESP32 pareado e pronto
- [ ] Teste manual funcionando (digitar código manualmente)
- [ ] Teste com ESP32 funcionando (receber código via Bluetooth)

---

## 🎉 Pronto!

Seu app Reciclaí agora está rodando localmente com Bluetooth totalmente funcional! 

**Próximos passos:**
1. Testar a integração completa com o ESP32
2. Fazer ajustes conforme necessário
3. Considerar compilar como app mobile (React Native) se precisar de distribuição

Bom desenvolvimento! 🚀
