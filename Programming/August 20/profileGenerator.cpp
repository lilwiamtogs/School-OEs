#include <iostream>
#include <string>
#include <cctype>
#include <algorithm>
#include <iomanip>

using namespace std;

int main() {
    string fullName;
    cout << "Enter your username: ";
    getline (cin, fullName);

    string characterName;
    cout << "Enter your character name: ";
    getline (cin, characterName);

    string characterClass;
    cout << "Enter your character class: ";
    getline (cin, characterClass);

    string favoriteWeapon;
    cout << "Enter your favorite weapon: ";
    getline (cin, favoriteWeapon);

    string upperClas = characterClass;
    transform(upperClas.begin(), upperClas.end(), upperClas.begin(), ::toupper);

    string threeChName = characterName.substr(0, 3);
    string twoChClass = characterClass.substr(0, 2);

    bool hasSpace = fullName.find(" ") != string::npos;
    int spacePosition = fullName.find(" ");

    string playerID = threeChName + twoChClass;

    cout << boolalpha;
    cout << "\n                 🎮  PLAYER PROFILE\n";
    cout << "+------------------------------------------+\n";
    cout << "| " << left << setw(20) << "Username"        << ": " << setw(19) << fullName       << "|\n";
    cout << "| " << left << setw(20) << "Character"       << ": " << setw(19) << characterName  << "|\n";
    cout << "| " << left << setw(20) << "Character Class" << ": " << setw(19) << upperClas      << "|\n";
    cout << "| " << left << setw(20) << "Favorite Weapon" << ": " << setw(19) << favoriteWeapon << "|\n";
    cout << "+------------------------------------------+\n";
    cout << "| " << left << setw(20) << "Name Has Space"  << ": " << setw(19) << hasSpace       << "|\n";
    cout << "| " << left << setw(20) << "Space Position"  << ": " << setw(19) << spacePosition  << "|\n";
    cout << "| " << left << setw(20) << "Player ID"       << ": " << setw(19) << playerID       << "|\n";
    cout << "+------------------------------------------+\n";

    return 0;
}
