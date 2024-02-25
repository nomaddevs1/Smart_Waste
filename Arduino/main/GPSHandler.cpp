#include "GPSHandler.h"

SoftwareSerial SoftSerial(2, 3); // TX(Yellow) = 2, RX(White) = 3 
String currentSentence = "";      // Definition
bool gnggaCaptured = false;       // Definition

void setupGPS() {
    SoftSerial.begin(9600);
    Serial.println("GPS Setup Complete.");
}


void readGPS(float &latitude, float &longitude) {
    while (!gnggaCaptured && SoftSerial.available()) { //Loops until 
        char c = SoftSerial.read();
        currentSentence += c;
        if (c == '\n') {
            if (currentSentence.startsWith("$GNGGA")) {
                parseGNGGA(currentSentence, latitude, longitude);
                gnggaCaptured = true; // To prevent further processing
            }
            currentSentence = ""; // Reset for the next sentence
        }
    }
}

// Implementation for parseGNGGA and convertToDecimalDegrees as previously defined
void parseGNGGA(const String& sentence, float &latitude, float &longitude) {
    int commaIndex = 0;
    String latStr, lonStr;
    char latDir, lonDir;

    for (int i = 0, field = 0; i < sentence.length() && field <= 5; i++) {
        if (sentence.charAt(i) == ',') {
            commaIndex = i + 1; // Move past the comma for the start of the next field
            field++;

            // Latitude value
            if (field == 2) {
                latStr = sentence.substring(commaIndex, sentence.indexOf(',', commaIndex));
            }
            // Latitude direction (N/S)
            else if (field == 3) {
                latDir = sentence.charAt(commaIndex);
            }
            // Longitude value
            else if (field == 4) {
                lonStr = sentence.substring(commaIndex, sentence.indexOf(',', commaIndex));
            }
            // Longitude direction (E/W)
            else if (field == 5) {
                lonDir = sentence.charAt(commaIndex);
            }
        }
    }

    // Convert to decimal degrees
    latitude = convertToDecimalDegrees(latStr) * (latDir == 'N' ? 1.0 : -1.0);
    longitude = convertToDecimalDegrees(lonStr) * (lonDir == 'E' ? 1.0 : -1.0);
}

float convertToDecimalDegrees(const String& field) {
    int decimalPointIndex = field.indexOf('.');
    // Degrees are all characters before decimal point minus 2 (for minutes)
    int degreePart = field.substring(0, decimalPointIndex - 2).toInt();
    // Minutes are the last two digits before the decimal point plus the fractional part
    float minutePart = field.substring(decimalPointIndex - 2).toFloat();

    // Convert to decimal degrees
    return degreePart + (minutePart / 60.0);
}