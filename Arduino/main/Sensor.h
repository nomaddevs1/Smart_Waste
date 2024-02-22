#ifndef Sensor_h
#define Sensor_h



const int trigPin = 9;
const int echoPin = 10;

float duration, distance;



void distanceCalc( int trigPin,
int echoPin, float& distance) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = (duration*.0343)/2;
  delay(100);
}