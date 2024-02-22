#include "WiFiCommunication.h"
#include "BLESetup.h"
#include "GPSHandler.h"
#include "Sensor.h"

String jsonData;
float latitude, longitude;
float distance;
const int trigPin = 9;
const int echoPin = 10;

void setup()
{
    Serial.begin(9600);
    initializeBLE();
    setupGPS();
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

void loop()
{
    if (!gnggaCaptured)
    {
        readGPS(latitude, longitude);
        if (gnggaCaptured)
        {
            jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lon\": " + String(longitude, 6) + "}";
        }
    }

    if (WiFi.status() == WL_CONNECTED && gnggaCaptured)
    {
        sendHttpRequest(jsonData);
        delay(5000); // Remove after adding the distance sensor logic
    }

    distanceCalc(trigPin, echoPin, distance);
    Serial.print("Distance: ");
    Serial.println(distance);
    BLE.poll();
}