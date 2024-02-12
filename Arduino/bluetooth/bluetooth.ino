#include <ArduinoBLE.h>
#include <SPI.h>
#include <WiFiS3.h>

// Define the UUIDs for the BLE service and characteristic
BLEService wifiService("19b10000-e8f2-537e-4f6c-d104768a1214");
BLECharacteristic wifiCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214", BLERead | BLEWrite | BLENotify, 512); // Adjust size as needed

int status = WL_IDLE_STATUS;

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!BLE.begin()) {
    Serial.println("Starting BluetoothÂ® Low Energy module failed!");
    while (1);
  }

  initializeBLE();
}

void loop() {
  BLE.poll();
}

void initializeBLE() {
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

void blePeripheralConnectHandler(BLEDevice central) {
  Serial.print("Connected to central: ");
  Serial.println(central.address());
}

void blePeripheralDisconnectHandler(BLEDevice central) {
  Serial.print("Disconnected from central: ");
  Serial.println(central.address());
  initializeBLE(); // Re-initialize to allow reconnection
}
void wifiSetup(String ssid, String password){
  status = WiFi.begin(ssid.c_str(), password.c_str());

  if (status == WL_NO_MODULE) {
    Serial.print("Error connecting...");
  }

  while (status != WL_CONNECTED) {
    Serial.print(status);
    delay(1000);

  }

  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
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