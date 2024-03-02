// WiFiCommunication.h
#ifndef WiFiCommunication_h
#define WiFiCommunication_h

#include <WiFiS3.h>

extern BLECharacteristic wifiCharacteristic;
extern void initializeBLE();

WiFiSSLClient client;
const char HOST_NAME[] = "smartwaste.onrender.com";
const int HTTP_PORT = 443;
const String PATH_NAME = "/api";
const String HTTP_METHOD = "POST";

int status = WL_IDLE_STATUS;

void sendHttpRequest(const String &jsonData)
{
    Serial.println("Begining to Connect to Server");
    delay(5000);
    if (client.connect(HOST_NAME, HTTP_PORT))
    {
        Serial.println("Connected to server");
        // HTTP request sending logic as previously defined
        // make a HTTP request:
        // send HTTP header
        client.println(HTTP_METHOD + " " + PATH_NAME + " HTTP/1.1");
        client.println("Host: " + String(HOST_NAME));
        client.println("Content-Type: application/json");               // Indicate we're sending JSON
        client.println("Content-Length: " + String(jsonData.length())); // Length of the JSON data
        client.println("Connection: close");
        client.println(); // end HTTP header

        client.println(jsonData); // Send the actual JSON data

        while (client.connected())
        {
            if (client.available())
            {
                // read an incoming byte from the server and print it to serial monitor:
                char c = client.read();
                Serial.print(c);
            }
        }

        // the server's disconnected, stop the client:
        client.stop();
        Serial.println();
        Serial.println("disconnected");
    }
    else
    {
        Serial.println("Connection failed");
    }
}

void wifiSetup(String ssid, String password){
  status = WiFi.begin(ssid.c_str(), password.c_str());

  if (status == WL_NO_MODULE) {
    Serial.println("WiFi module not present");
    // Send a BLE notification indicating the failure
    wifiCharacteristic.writeValue("WiFi module not present");
    return;
  }

  // Attempt to connect to the WiFi network
  unsigned long startTime = millis();
  while (status != WL_CONNECTED) {
    delay(500); // Short delay to allow for WiFi connection attempts
    status = WiFi.status(); // Update WiFi connection status

    // Check for timeout (e.g., 30 seconds)
    if (millis() - startTime > 30000) {
      Serial.println("Failed to connect to WiFi");
      // Send a BLE notification to the central device to inform about the WiFi connection failure
      wifiCharacteristic.writeValue("Failed to connect; please re-enter credentials");

      // Re-initialize BLE to allow reconnection and credential re-entry
      // initializeBLE();
      return;
    }
  }

  // Successfully connected to WiFi
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Optionally, send a BLE notification about successful WiFi connection
  wifiCharacteristic.writeValue("WiFi connected successfully");
}
#endif