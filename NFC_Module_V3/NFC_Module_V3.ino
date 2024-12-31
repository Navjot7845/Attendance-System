#include <Wire.h>
#include <Adafruit_PN532.h>
#include <SoftwareSerial.h>

#define SDA_PIN 2
#define SCL_PIN 3
#define RX_PIN 5
#define TX_PIN 6

SoftwareSerial esp32Serial(RX_PIN, TX_PIN);
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

void setup() {
  Serial.begin(9600);
  esp32Serial.begin(9600);
  Serial.println("Initializing NFC...");

  nfc.begin();
  if (!nfc.getFirmwareVersion()) {
    Serial.println("PN532 NFC module not found!");
    while (1);
  }
  nfc.SAMConfig();
  Serial.println("NFC initialized. Waiting for a card...");
}

void loop() {
  uint8_t uid[7];
  uint8_t uidLength;

  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    Serial.println("Card detected!");
    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) uidString += "0";
      uidString += String(uid[i], HEX);
    }
    esp32Serial.println(uidString);
    Serial.println("UID: " + uidString);
    delay(3000);
  }
}