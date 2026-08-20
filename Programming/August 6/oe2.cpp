#include <iostream>
#include <string>

using namespace std;

int main() {
    string name = "Messi";
    string currentSpd;
    int currentLap = 44;
    float currentSpeed = 200.5;
    int carDistance = 100;
    int finishLineDistance = 99;

    cout << "Racer " << name << " takes the lead!" << endl;
    cout << "Current lap: " << currentLap << endl;
    cout << "Current speed: " << currentSpeed << endl;

    string inputTrigger;
    getline(cin, inputTrigger);
    carDistance = carDistance - finishLineDistance;
    
    bool finishedRace = (carDistance > 0);

    cout << boolalpha;
    cout << "\n_________________________________\n" << endl;
    cout << "Did Messi cross the finish line? " << finishedRace << endl;
    cout << "\n_________________________________\n" << endl;
}