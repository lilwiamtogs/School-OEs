#include <iostream>
#include <string>

using namespace std;

int main() {
    int number;
    string result;

    cout << "Enter any whole number: ";
    cin >> number;

    result = (number == 0) ? "Zero" :
             (number > 0) ? "Positive" : "Negative";

    cout << "Number is " << result << endl;
    return 0;
}
