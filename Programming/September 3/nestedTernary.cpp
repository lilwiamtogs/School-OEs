#include <iostream>
#include <string>

using namespace std;

int main() {
    int score;

    cout << "Enter a score: ";
    cin >> score;

    string result = (score >= 90) ? "Excellent" :
                    (score >= 75) ? "Good" :
                    (score >= 50) ? "Passed" : "Failed";

    cout << "Result: " << result << endl;
    return 0;
}
