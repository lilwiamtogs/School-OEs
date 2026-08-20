#include <iostream>
#include <string>

using namespace std;

int main() {
    string playerClass;
    cout << "Enter your player class (e.g., Warrior, Mage, Rogue): ";
    getline(cin, playerClass);
    bool hasMount;
    cout << "Does your player have a mount? (1 for yes, 0 for no): ";
    cin >> hasMount;

    cout << boolalpha;
    cout << "\n_________________________________\n\n";
    cout << "Player Class: " << playerClass << endl;
    cout << "Has Mount: " << hasMount << endl;
    cout << "\n_________________________________\n";
}