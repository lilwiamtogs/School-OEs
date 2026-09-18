#include <iostream>
#include <string>

using namespace std;

int main() {
    string str, substr;

    cout << "Enter a string: ";
    getline(cin, str);

    cout << "Enter the substring to check: ";
    getline(cin, substr);

    string result = (str.find(substr) != string::npos)
        ? "contains the substring"
        : "does not contain the substring";

    cout << "The string " << result << endl;
    return 0;
}
