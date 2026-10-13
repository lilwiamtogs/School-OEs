#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

int main() {
    string log;
    int urgentCount = 0;
    int warningCount = 0;
    int normalCount = 0;
    int totalCount = 0;

    while(true) {
        cout << "\nEnter new log here: ";
        getline(cin, log);

        bool hasExit = log.find("exit") != string::npos;

        if(log == "exit" || hasExit == 1) {
            cout << "Exiting program..." << endl;

            break;
        }

        else if(hasExit == 0) {
            string logClass = (log.find("error") != string::npos) ? "Urgent!"    :
                              (log.find("warning") != string::npos) ? "Warning!" :
                              "Normal";

            if(logClass == "Urgent!") {
                urgentCount++;
            }
            else if(logClass == "Warning!") {
                warningCount++;
            }
            else {
                normalCount++;
            }
            totalCount++;

            cout << "Log Message:         " << log << endl;
            cout << "Log Classification:  " << logClass << endl;
        }

    }

    cout << "\nLog totals:" << endl;
    cout << "Urgent:   " << urgentCount << endl;
    cout << "Warning:  " << warningCount << endl;
    cout << "Normal:   " << normalCount << endl;
    cout << "Total:    " << totalCount << endl;

    return 0;
}