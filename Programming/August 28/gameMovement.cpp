#include <string>
#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

int main() {
    double initX;
    cout << "Enter initial x position (m): ";
    cin >> initX;

    double initY;
    cout << "Enter initial y position (m): ";
    cin >> initY;

    double horizontalVelocity;   
    cout << "Enter horizontal velocity (m/s): ";
    cin >> horizontalVelocity;

    double verticalVelocity;
    cout << "Enter vertical velocity (m/s): ";
    cin >> verticalVelocity;

    double time;
    cout << "Enter time (s): ";
    cin >> time;

    double gravity = 9.80;
    double finalX = initX + horizontalVelocity * time; 
    double finalY = initY + verticalVelocity * time - ((gravity * pow(time, 2)) / 2);
    double gravityEffect = (gravity * pow(time, 2)) / 2;
  

    bool aboveGround = (finalY > 0);

    cout << boolalpha;
    cout << fixed << setprecision(2);
    cout << "\n=============================================\n\n";
    cout << "\t   GAME MOVEMENT SIMULATION\n\n";
    cout << "=============================================\n\n";
    cout << "Initial x:                           " << initX << " m\n";
    cout << "Initial y:                           " << initY << " m\n";
    cout << "Horizontal Velocity:                 " << horizontalVelocity << " m/s\n";             
    cout << "Vertical Velocity:                   " << verticalVelocity << " m/s\n";
    cout << "Time:                                " << time << " s\n";
    cout << "Gravity:                             " << gravity << " m/s^2\n";
    cout << "Gravity Effect:                      " << gravityEffect << " m\n";
    cout << "Final x:                             " << finalX << " m\n";
    cout << "Final y:                             " << finalY << " m\n";
    cout << "Above Ground:                        " << aboveGround << "\n";

    return 0;
}