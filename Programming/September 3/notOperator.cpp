#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

int main() {
    bool banned;

    cout << "Is the user banned? (1 for yes, 0 for no): ";
    cin >> banned;

    string result = (!banned)
        ? "Access Allowed"
        : "Access Denied";

    cout << "\n\n";
    cout << "======================================" << endl;
    cout << setw(30) << "Account Access Report" << endl;
    cout << "======================================" << endl;
    cout << left << setw(23) << "Banned Status:" << (banned ? "Yes" : "No") << endl;
    cout << left << setw(23) << "Access Status:" << result << endl;
    cout << "======================================" << endl;
    return 0;
}
