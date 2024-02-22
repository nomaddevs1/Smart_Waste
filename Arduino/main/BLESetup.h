// BLESetup.h
#ifndef BLESetup_h
#define BLESetup_h

#include <ArduinoBLE.h>

// UUIDs for the BLE service and characteristic
#define SERVICE_UUID "19b10000-e8f2-537e-4f6c-d104768a1214"
#define CHARACTERISTIC_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"

BLEService wifiService(SERVICE_UUID);
BLECharacteristic wifiCharacteristic(CHARACTERISTIC_UUID, BLERead | BLEWrite | BLENotify, 512);

void initializeBLE() {
    if (!BLE.begin()) {
        Serial.println("Starting Bluetooth® Low Energy module failed!");
        while (1);
    }

    BLE.setLocalName("WiFiConfig");
    BLE.setAdvertisedService(wifiService);
    wifiService.addCharacteristic(wifiCharacteristic);
    BLE.addService(wifiService);

    wifiCharacteristic.writeValue("Ready"); // Initial value
    BLE.advertise();
    Serial.println("BLE WiFi Setup Ready");
}

#endif
