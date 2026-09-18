#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    string playerName;
    cout << "Enter your name: ";
    getline(cin, playerName);

    int score;
    cout << "Enter your game score: ";
    cin >> score;

    string rank = 
    (score >= 90) ? "Master" :
    (score >= 75) ? "Advanced" :
    (score >= 50) ? "Beginner" :
    "Novice";

    cout << "\n\n";
    cout << "======================================" << endl;
    cout << setw(28) << "Player Rank Report" << endl;
    cout << "=====================================" << endl;
    cout << "Player Name:          "<< playerName << endl;
    cout << "Game Score:           " << score << endl;
    cout << "Your rank is:         " << rank << endl;
}