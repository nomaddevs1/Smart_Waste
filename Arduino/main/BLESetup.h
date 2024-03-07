// BLESetup.h
#ifndef BLESetup_h
#define BLESetup_h

void wifiSetup(String ssid, String password);


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

    characteristic.writeValue("Credentials Received"); // Acknowledge receipt
  } else {
    Serial.println("Invalid format received.");
    characteristic.writeValue("Invalid Format"); // Inform sender of the error
  }
}

#endif