#include "WiFiCommunication.h"
#include "BLESetup.h"
#include "GPSHandler.h"

String jsonData;
float latitude, longitude;

void setup() {
    Serial.begin(9600);
    initializeBLE();
    setupGPS();
}

void loop(){
  if (!gnggaCaptured) {
      readGPS(latitude, longitude);
      if (gnggaCaptured) {
          jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lon\": " + String(longitude, 6) + "}";
      }
  }

  if (WiFi.status() == WL_CONNECTED && gnggaCaptured){
      sendHttpRequest(jsonData);  
      delay(5000); // Remove after adding the distance sensor logic
  }

  BLE.poll();
}