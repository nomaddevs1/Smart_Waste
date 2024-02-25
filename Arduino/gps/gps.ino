#include <SoftwareSerial.h>
//SoftwareSerial SoftSerial(Tx, Rx);
SoftwareSerial SoftSerial(2, 3);
String currentSentence = "";
bool eventOccurred = true;
bool gnggaCaptured = false;

int count=0;                                // counter for buffer array
void setup()
{
    SoftSerial.begin(9600);                 // the SoftSerial baud rate
    Serial.begin(9600);                     // the Serial port of Arduino baud rate.

    Serial.print("Starting GPS");
}

void loop()
{
    // If the event has occurred, wait for the next $GNGGA sentence
    if (eventOccurred && !gnggaCaptured) {
        if (SoftSerial.available()) {
            char c = SoftSerial.read();
            if (c == '\n') { // End of sentence
                if (currentSentence.startsWith("$GNGGA")) {
                    Serial.println("Sending $GNGGA to backend:");
                    Serial.println(currentSentence);
                    // Add your code to send the currentSentence to the backend here
                    float latitude, longitude;
                    parseGNGGA(currentSentence, latitude, longitude);

                    Serial.print("Latitude: ");
                    Serial.println(latitude, 6);
                    Serial.print("Longitude: ");
                    Serial.println(longitude, 6);
                    gnggaCaptured = true; // Prevent further $GNGGA captures
                    // Optionally reset eventOccurred if you want to capture another $GNGGA on the next event
                    // eventOccurred = false;
                }
                currentSentence = ""; // Reset for the next sentence
            }
        }
    }
}




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