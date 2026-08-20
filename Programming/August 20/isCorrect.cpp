#include <iostream>
#include <string>

using namespace std;

int main() {
    string username;
    int players;
    char character;

    cout << "Enter your username: ";
    cin >> username;

    cout << "Enter how many players (1-3): ";
    cin >> players;

    cout << "Enter a character (1 = A, 2 = B, 3 = C): ";
    cin >> character;

    char correctCharacter = 'A' + players - 1;
    bool isCorrect = character == correctCharacter;

    cout << "\nNAME: " << username << '\n';
    cout << "Players entered: " << players << '\n';
    cout << "Character entered: " << character << '\n';
    cout << boolalpha;
    cout << "Your answer is correct: " << isCorrect << '\n';

    return 0;
}
