#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

using namespace std;

int main() {

    string fullName;
    cout << "Enter full name: ";
    getline(cin, fullName);

    string username;
    cout << "Enter username: ";
    getline(cin, username);

    string characterName;
    cout << "Enter character name: ";
    getline(cin, characterName);

    int tutorialChoice;
    cout << "Did you complete the tutorial? (1 = Yes, 0 = No): ";
    cin >> tutorialChoice;
    bool tutorialCompleted = tutorialChoice == 1;

    string upperUsername = username;
    transform(upperUsername.begin(), upperUsername.end(),
              upperUsername.begin(), ::toupper);

    bool nameHasSpace = fullName.find(" ") != string::npos;

    int usernameLength = username.size();

    string usernamePart = username.substr(0, 3);

    string characterPart = characterName.substr(0, 3);

    string playerID = usernamePart + characterPart;

    // ========================================
    cout << boolalpha;
    cout << "\n========================================\n";
    cout << "              PLAYER PROFILE" << endl;
    cout << "========================================\n\n";
    cout << "Full Name:           " << fullName << "\n";
    cout << "Username:            " << upperUsername << "\n";
    cout << "Character:           " << characterName << "\n";
    cout << "Tutorial Completed:  " << tutorialCompleted << "\n";
    cout << "Name Has Space:      " << nameHasSpace << "\n";
    cout << "Username Length:     " << usernameLength << "\n";
    cout << "Player ID:           " << playerID << "\n\n";
    cout << "========================================" <<  "\n";

    return 0;
}
