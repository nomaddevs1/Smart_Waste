#include "WiFiCommunication.h"
#include "BLESetup.h"
#include "GPSHandler.h"
#include "Sensor.h"

String jsonData;
float latitude, longitude;
float distance;
const int trigPin = 9;
const int echoPin = 10;
bool sentHTTP;

void setup()
{
    Serial.begin(9600);
    initializeBLE();
    setupGPS();
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    sentHTTP = false;
}

void loop()
{
  distanceCalc(trigPin, echoPin, distance);

  if (!gnggaCaptured){
    readGPS(latitude, longitude);
    if (gnggaCaptured)
      {
          jsonData = "{\"lat\": " + String(latitude, 6) + ", \"lon\": " + String(longitude, 6) + "}";
      }
  }
  

  if (WiFi.status() == WL_CONNECTED && gnggaCaptured && distance < 10.0 && !sentHTTP)
  {
      sendHttpRequest(jsonData);
      Serial.println("JSONDATA: " + jsonData);
      sentHTTP = true;
  }

  BLE.poll();
}