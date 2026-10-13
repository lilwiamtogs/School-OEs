#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

int main() {
    int fileCount = 0;
    while (true) {
        string fileName;
        cout << "Enter file name here: ";
        getline(cin, fileName);


        bool hasPeriod = fileName.find(".") != string::npos;

        if(fileName.find("end") != string::npos) {
            cout << "File Count:                   " << fileCount << endl;
            break;
        }

        if(hasPeriod == 0) {
            cout << "Please enter a valid filename extension!" << endl;
            cout << "\n";
        }

        if(hasPeriod) {        
            string fileType = (fileName.find(".txt") != string::npos) ? "text file" :
                              (fileName.find(".jpg") != string::npos) ? "image file" :
                              (fileName.find(".cpp") != string::npos) ? "C++ source file" :
                              "Unknown file type! Please try again!";

            if(fileType == "Unknown file type! Please try again!" || fileType.empty()) {
                cout << fileType << endl;
                cout << "\n";
            }
            else {
                
                fileCount++;
                cout << "Your file type is:            " << fileType << endl;
                cout << "File Count:                   " << fileCount << endl;
                cout << "\n";

            }
        }

    }
}
    