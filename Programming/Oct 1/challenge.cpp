#include <iostream>
#include <string>
#include <cctype>

using namespace std;

int main()
{
     string text;
    int vowels = 0, consonants = 0, digits = 0, others = 0;

    cout << "Enter word: ";
    cin >> text;

    for (int i = 0; i < text.length(); i++)
    {
        char ch = tolower(text[i]);

        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u')
            vowels++;
        else if (isalpha(ch))
            consonants++;
        else if (isdigit(ch))
            digits++;
        else
            others++;
    }

    cout << "Vowels: " << vowels << endl;
    cout << "Consonants: " << consonants << endl;
    cout << "Digits: " << digits << endl;
    cout << "Other characters: " << others << endl;

    return 0;
}