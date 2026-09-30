#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Keypad.h>

// UUIDs precisam ser exatamente iguais aos usados pelo app Reciclaí.
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"
#define DEVICE_NAME         "ReciclaiESP32"

// Ajuste estes pinos para a sua ligação física do teclado matricial.
const byte ROWS = 4;
const byte COLS = 4;
char keymap[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'},
};
byte rowPins[ROWS] = {19, 18, 5, 17};
byte colPins[COLS] = {16, 4, 2, 15};
Keypad keypad = Keypad(makeKeymap(keymap), rowPins, colPins, ROWS, COLS);

BLECharacteristic* codeCharacteristic = nullptr;
String codeBuffer;
unsigned long lastKeyAt = 0;
const unsigned long AUTO_SEND_AFTER_PAUSE_MS = 700;

void sendCode() {
  if (codeBuffer.length() < 6) return;

  // O app aceita texto UTF-8. A quebra de linha ajuda a separar mensagens.
  codeCharacteristic->setValue((codeBuffer + "\\n").c_str());
  codeCharacteristic->notify();
  Serial.print("Código enviado ao Reciclaí: ");
  Serial.println(codeBuffer);
  codeBuffer = "";
}

void setup() {
  Serial.begin(115200);

  BLEDevice::init(DEVICE_NAME);
  BLEServer* server = BLEDevice::createServer();
  BLEService* service = server->createService(SERVICE_UUID);

  codeCharacteristic = service->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  codeCharacteristic->addDescriptor(new BLE2902());
  codeCharacteristic->setValue("pronto");

  service->start();
  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  Serial.println("ReciclaiESP32 anunciado e pronto para conexão.");
}

void loop() {
  char key = keypad.getKey();
  if (key) {
    lastKeyAt = millis();

    if (key == '*') {
      codeBuffer = "";
      Serial.println("Código limpo.");
    } else if (key == '#') {
      sendCode();
    } else if (key >= '0' && key <= '9' && codeBuffer.length() < 13) {
      codeBuffer += key;
      Serial.print("Tecla recebida: ");
      Serial.println(key);
    }
  }

  // Permite digitar 123456 sem precisar pressionar #. Para EAN-13,
  // digite as 13 posições rapidamente ou finalize com #.
  if (codeBuffer.length() >= 6 && millis() - lastKeyAt >= AUTO_SEND_AFTER_PAUSE_MS) {
    sendCode();
  }
}
