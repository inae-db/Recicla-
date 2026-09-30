# Checklist de integração ESP32 — Reciclaí

- [x] Comparar UUIDs, nome do dispositivo e formato das notificações do firmware com o app.
- [x] Normalizar códigos recebidos com espaços, quebras de linha e mensagens JSON simples.
- [x] Reagir ao evento `gattserverdisconnected` e exibir o estado desconectado no app.
- [x] Garantir que o serviço e a característica usados pelo app sejam os mesmos do ESP32.
- [x] Confirmar o código `123456` para Caneta em `/scanner-bluetooth` e `/scanner-ean`.
- [x] Documentar o firmware de referência e o cadastro de novos produtos.
- [x] Executar TypeScript, build e validação no navegador.
- [ ] Salvar checkpoint final e entregar instruções ao usuário.

## Dados de conexão informados

| Item | Valor |
|---|---|
| Nome anunciado | `ReciclaiESP32` |
| Service UUID | `12345678-1234-1234-1234-123456789abc` |
| Characteristic UUID | `abcdefab-1234-1234-1234-abcdefabcdef` |
| Código de teste | `123456` |

## Regra de protocolo

O firmware deve enviar somente o código, preferencialmente como texto UTF-8 terminado por `\\n`, por exemplo `123456\\n`. O app removerá espaços e quebras de linha e aceitará também uma mensagem JSON simples contendo `code` ou `codigo`.
