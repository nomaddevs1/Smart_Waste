#include <EEPROM.h>
#include <ArduinoBLE.h>
#include "WiFiCommunication.h"
#include "SerialNumberHandler.h"
#include "BLESetup.h"
#include "GPSHandler.h"
#include "Sensor.h"

String jsonData;
float latitude, longitude;
float distance;
const int trigPin = 9;
const int echoPin = 10;
bool sentHTTP;

// UUIDs for the BLE service and characteristic
#define SERVICE_UUID "19b10000-e8f2-537e-4f6c-d104768a1214"
#define CHARACTERISTIC_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"

BLEService wifiService(SERVICE_UUID);
BLECharacteristic wifiCharacteristic(CHARACTERISTIC_UUID, BLERead | BLEWrite | BLENotify, 512);
BLECharacteristic serialNumberCharacteristic(SERIAL_NUMBER_CHARACTERISTIC_UUID, BLERead | BLEWrite | BLENotify, 512);

void blePeripheralConnectHandler(BLEDevice central);
void blePeripheralDisconnectHandler(BLEDevice central);


void setBLEcharacteristics(){
  BLE.setLocalName("WiFiConfig");
  BLE.setAdvertisedService(wifiService);
  wifiService.addCharacteristic(wifiCharacteristic);
  wifiService.addCharacteristic(serialNumberCharacteristic);
  BLE.addService(wifiService);

  BLE.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  wifiCharacteristic.setEventHandler(BLEWritten, wifiCharacteristicWritten);
  serialNumberCharacteristic.setEventHandler(BLEWritten, serialNumberCharacteristicWritten);
  BLE.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);
  BLE.setAdvertisedService(wifiService);
  BLE.advertise();
}


void blePeripheralConnectHandler(BLEDevice central) {
  Serial.print("Connected to central: ");
  Serial.println(central.address());
}


void blePeripheralDisconnectHandler(BLEDevice central) {
  Serial.print("Disconnected from central: ");
  Serial.println(central.address());
}

void setup()
{
    Serial.begin(9600);
    // clearEEprom();
    BLE.begin();
    setBLEcharacteristics();
    initializeSerialNumberCharacteristic();
    setupGPS();
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    sentHTTP = false;
}


void clearEEprom(){
    for (int i = 0 ; i < EEPROM.length() ; i++) {
      EEPROM.write(i, 0);
    }
}

void loop()
{
  distanceCalc(trigPin, echoPin, distance);
  if (distance > 10.0){
    sentHTTP = false;
    BLE.poll();
    return;
  }

  if (!gnggaCaptured){
    readGPS(latitude, longitude);
    if (gnggaCaptured)
      {
          jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lon\": " + String(longitude, 6) + ", \"serialNumber\":" + serialNumber + "}";
      }
  }
  

  if (WiFi.status() == WL_CONNECTED && gnggaCaptured && distance < 10.0 && !sentHTTP)
  {
      Serial.println("Distance threshold triggered, waiting 5 seconds.");
      delay(5000);
      distanceCalc(trigPin, echoPin, distance);
      if(distance < 10.0){
        sendHttpRequest(jsonData);
        Serial.println("JSONDATA: " + jsonData);
        sentHTTP = true;
      }
  }

  BLE.poll();
}