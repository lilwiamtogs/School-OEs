#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

int main() {
    int level, health;

    cout << "Enter player level: ";
    cin >> level;
    cout << "Enter player health: ";
    cin >> health;

    string result = (level >= 10 && health > 50)
        ? "Allowed"
        : "Denied";

    cout << "\n\n";
    cout << "======================================" << endl;
    cout << setw(29) << "Entry Access Report" << endl;
    cout << "======================================" << endl;
    cout << left << setw(23) << "Player Level:" << level << endl;
    cout << left << setw(23) << "Player Health:" << health << endl;
    cout << left << setw(23) << "Access Status:" << result << endl;
    cout << "======================================" << endl;
    return 0;
}
