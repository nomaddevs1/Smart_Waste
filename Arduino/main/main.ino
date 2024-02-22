#include "WiFiCommunication.h"
#include "BLESetup.h"
#include "GPSHandler.h"

void setup() {
    Serial.begin(9600);
    initializeBLE();
    setupGPS();
}

void loop() {
    float latitude = 0.0, longitude = 0.0;

    if (!gnggaCaptured) {
        readGPS(latitude, longitude);
        if (gnggaCaptured) {
            String jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lon\": " + String(longitude, 6) + "}";
            sendHttpRequest(jsonData);
        }
    }

    BLE.poll();
}
