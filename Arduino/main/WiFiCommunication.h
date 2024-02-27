// WiFiCommunication.h
#ifndef WiFiCommunication_h
#define WiFiCommunication_h

#include <WiFiS3.h>

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
    Serial.print("Error connecting...");
  }

  while (status != WL_CONNECTED) {
    Serial.print(status);
    delay(5000);

  }

  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

#endif
