# Validação da integração Bluetooth

## Resultados observados

O preview confirmou que a tela `/bluetooth` exibe o dispositivo `ReciclaiESP32`, o Service UUID `12345678-1234-1234-1234-123456789abc` e a Characteristic UUID `abcdefab-1234-1234-1234-abcdefabcdef`.

No ambiente de preview, o navegador informa que Web Bluetooth não está disponível. Esse comportamento é esperado no preview e não simula uma conexão física. A tela apresenta o estado de erro/desconectado e a mensagem de conexão encerrada.

A busca manual no `/scanner-bluetooth` com `123456` retornou `Caneta esferográfica`, com lixeira preta, instruções, decomposição e indicadores sustentáveis. O mesmo código foi aceito no `/scanner-ean`.

## Teste físico recomendado

Com o firmware `ESP32_RECICLAI_BLUETOOTH.ino` gravado e o ESP32 anunciado como `ReciclaiESP32`, conectar pela tela `/bluetooth`, abrir `/scanner-bluetooth`, digitar `123456` no teclado e aguardar a mensagem automática. Desligar ou afastar o ESP32 deve mudar o estado para desconectado e exibir o aviso de conexão encerrada.
