// BLESetup.h
#ifndef BLESetup_h
#define BLESetup_h

#include <ArduinoBLE.h>

// UUIDs for the BLE service and characteristic
#define SERVICE_UUID "19b10000-e8f2-537e-4f6c-d104768a1214"
#define CHARACTERISTIC_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"

BLEService wifiService(SERVICE_UUID);
BLECharacteristic wifiCharacteristic(CHARACTERISTIC_UUID, BLERead | BLEWrite | BLENotify, 512);

void wifiSetup(String ssid, String password);
void blePeripheralConnectHandler(BLEDevice central);
void blePeripheralDisconnectHandler(BLEDevice central);


void blePeripheralConnectHandler(BLEDevice central) {
  Serial.print("Connected to central: ");
  Serial.println(central.address());
}

void wifiCharacteristicWritten(BLEDevice central, BLECharacteristic characteristic) {
  int length = characteristic.valueLength();
  const uint8_t* data = characteristic.value();

  String value = "";
  for (int i = 0; i < length; i++){
    value += (char)data[i];
  }

  Serial.print(value);

  // Assuming the format is "SSID;PASSWORD"
  int separatorPos = value.indexOf(';');
  if (separatorPos != -1) {
    String ssid = value.substring(0, separatorPos);
    String password = value.substring(separatorPos + 1);

    Serial.print("Received SSID: ");
    Serial.println(ssid);
    Serial.print("Received Password: ");
    Serial.println(password);
    wifiSetup(ssid, password);
    // Add your WiFi connection logic here using the received SSID and password
    // For instance: WiFi.begin(ssid.c_str(), password.c_str());

    characteristic.writeValue("Credentials Received"); // Acknowledge receipt
  } else {
    Serial.println("Invalid format received.");
    characteristic.writeValue("Invalid Format"); // Inform sender of the error
  }
}

void initializeBLE() {
    if (!BLE.begin()) {
        Serial.println("Starting Bluetooth® Low Energy module failed!");
        while (1);
    }

    BLE.setLocalName("WiFiConfig");
    BLE.setAdvertisedService(wifiService);
    wifiService.addCharacteristic(wifiCharacteristic);
    BLE.addService(wifiService);

    BLE.setEventHandler(BLEConnected, blePeripheralConnectHandler);
    BLE.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

    wifiCharacteristic.setEventHandler(BLEWritten, wifiCharacteristicWritten);
    wifiCharacteristic.writeValue("Ready"); // Initial value
    BLE.advertise();
    Serial.println("BLE WiFi Setup Ready");
}

void blePeripheralDisconnectHandler(BLEDevice central) {
  Serial.print("Disconnected from central: ");
  Serial.println(central.address());
  initializeBLE(); // Re-initialize to allow reconnection
}
#endif
