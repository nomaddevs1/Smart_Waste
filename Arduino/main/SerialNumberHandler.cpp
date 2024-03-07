#include "SerialNumberHandler.h"

// Initialize the BLE Characteristic for Serial Number

void initializeSerialNumberCharacteristic() {
    // Check EEPROM for existing serial number and initialize characteristic
    Serial.println("Serials");
    String serialNumber = "";
    for (int i = 0; i < 512; ++i) {
        char c = EEPROM.read(i);
        if (c == '\0') break;
        serialNumber += c;
    }
    Serial.println(serialNumber);
    if (serialNumber.length() > 0) {
        serialNumberCharacteristic.writeValue(serialNumber.c_str(), serialNumber.length());
    } else {
        serialNumberCharacteristic.writeValue("No Serial Number");
    }
}

void serialNumberCharacteristicWritten(BLEDevice central, BLECharacteristic characteristic) {
    const uint8_t* data = characteristic.value();
    int length = characteristic.valueLength();
    String newSerialNumber = "";
    for (int i = 0; i < length; i++) {
        newSerialNumber += (char)data[i];
    }
    for (unsigned int i = 0; i < newSerialNumber.length(); ++i) {
        EEPROM.write(i, newSerialNumber[i]);
    }
    EEPROM.write(newSerialNumber.length(), '\0');
    #if defined(ESP8266) || defined(ESP32)
    EEPROM.commit();
    #endif

    // Confirm to the frontend
    serialNumberCharacteristic.writeValue("Serial Number Updated");
}
