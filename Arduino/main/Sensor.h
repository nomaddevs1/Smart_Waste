#ifndef Sensor_h
#define Sensor_h


float duration;



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

#endif