// GPSHandler.h
#ifndef GPSHandler_h
#define GPSHandler_h

#include <SoftwareSerial.h>
extern SoftwareSerial SoftSerial; // Declaration
extern String currentSentence;    // Declaration
extern bool gnggaCaptured;        // Declaration


void setupGPS();
void readGPS(float &latitude, float &longitude);
void parseGNGGA(const String& sentence, float &latitude, float &longitude);
float convertToDecimalDegrees(const String& field);

#endif
