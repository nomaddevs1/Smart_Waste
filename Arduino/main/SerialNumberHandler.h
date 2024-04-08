#ifndef SerialNumberHandler_h
#define SerialNumberHandler_h

#include <Arduino.h>
#include <EEPROM.h>
#include <ArduinoBLE.h>

// Declare the UUID for the serial number characteristic
#define SERIAL_NUMBER_CHARACTERISTIC_UUID "19b10002-e8f2-537e-4f6c-d104768a1214"
extern BLECharacteristic serialNumberCharacteristic;
extern String serialNumber;

// Function prototypes
void initializeSerialNumberCharacteristic();
void serialNumberCharacteristicWritten(BLEDevice central, BLECharacteristic characteristic);

#endif
