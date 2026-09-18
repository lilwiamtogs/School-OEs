#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

int main() {
    int health, lives;

    cout << "Enter player health: ";
    cin >> health;
    cout << "Enter remaining lives: ";
    cin >> lives;

    string result = (health <= 0 || lives == 0)
        ? "Game Over"
        : "Continue";

    cout << "\n\n";
    cout << "======================================" << endl;
    cout << setw(28) << "Game Status Report" << endl;
    cout << "======================================" << endl;
    cout << left << setw(23) << "Player Health:" << health << endl;
    cout << left << setw(23) << "Remaining Lives:" << lives << endl;
    cout << left << setw(23) << "Game Status:" << result << endl;
    cout << "======================================" << endl;
    return 0;
}
