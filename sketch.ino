#include <Wire.h>
#include <Adafruit_PN532.h>

// Define SDA and SCL pins for I2C communication
#define SDA_PIN 2
#define SCL_PIN 3

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing NFC...");

  nfc.begin();

  // Check if the NFC module is found
  if (!nfc.getFirmwareVersion()) {
    Serial.println("PN532 NFC module not found!");
    while (1); // Halt the program
  }

  nfc.SAMConfig(); // Configure the module to read passive targets
  Serial.println("NFC initialized. Waiting for a card...");
}

void loop() {
  uint8_t uid[7];    // Buffer to hold the UID
  uint8_t uidLength; // Length of the UID

  // Try to read an NFC card
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    Serial.println("Card detected!");
    
    // Print the UID
    Serial.print("UID: ");
    for (uint8_t i = 0; i < uidLength; i++) {
      Serial.print(uid[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    delay(1000); // Wait before scanning again
  }
}
