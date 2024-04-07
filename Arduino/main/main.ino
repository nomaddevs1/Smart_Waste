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
String serialNumber = "";
float distance2;
const int trigPin = 9;
const int trigPin2 = 7;
const int echoPin = 10;
const int echoPin2 = 6;
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
    pinMode(trigPin2, OUTPUT);
    pinMode(echoPin, INPUT);
    pinMode(echoPin2, INPUT);
    sentHTTP = false;
}


void clearEEprom(){
    for (int i = 0 ; i < EEPROM.length() ; i++) {
      EEPROM.write(i, 0);
    }
    Serial.println("Cleared EEPROM");
}

void loop(){
  distanceCalc(trigPin, echoPin, distance);
  distanceCalc(trigPin2, echoPin2, distance2);
  if (distance > 10.0 && distance2 > 10.0){
    sentHTTP = false;
    BLE.poll();
    return;
  }

  if (!gnggaCaptured){
    readGPS(latitude, longitude);
    if (gnggaCaptured){
      if (serialNumber != ""){
        jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lng\": " + String(longitude, 6) + ", \"serialNumber\": \"" + serialNumber + "\"}";
      }
    }
  }

  

  if (WiFi.status() == WL_CONNECTED && gnggaCaptured && distance < 10.0 && distance2 < 10.0 && !sentHTTP)
  {
      delay(5000);
      distanceCalc(trigPin, echoPin, distance);
      if(distance < 10.0){
        Serial.println(jsonData);
        sendHttpRequest(jsonData);
        sentHTTP = true;
      }
  }

  BLE.poll();
}