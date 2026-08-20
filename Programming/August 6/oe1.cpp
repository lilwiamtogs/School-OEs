#include <iostream>
#include <string>

using namespace std;

int main() {
    int playerHP;
    int enemyDamage;

    cout << "Enter player's HP: ";
    cin >> playerHP;

    cout << "Enter enemy's damage: ";
    cin >> enemyDamage;

    playerHP = playerHP - enemyDamage;
    bool isPlayerAlive = (playerHP > 0);


    cout << boolalpha;
    cout << "\n_________________________________\n" << endl;
    cout << "\nIs the player alive? " << isPlayerAlive << endl;
    cout << "Player's HP: " << playerHP << endl;
    cout << "\n_________________________________\n";
}