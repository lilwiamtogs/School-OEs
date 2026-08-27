#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

int main()
{
    double a, b, c, d, e;

    cout << "===============================================\n";
    cout << "   C++ ARITHMETIC OPERATION DEMONSTRATION \n";
    cout << "===============================================\n";

    cout << "Enter value for A: ";
    cin >> a;

    cout << "Enter value for B: ";
    cin >> b;

    cout << "Enter value for C: ";
    cin >> c;

    cout << "Enter value for D: ";
    cin >> d;

    cout << "Enter value for E: ";
    cin >> e;

    cout << "\n==================================================\n";
    cout << "\tRESULTS OF ARITHMETIC EXPRESSIONS\n";
    cout << "==================================================\n";

    double result1 = a + b * c;

    cout << "\nExample 1:\n";
    cout << "Expression: A + B * C\n";
    cout << "Expression: " << a << " + " << b << " * " << c << "\n";
    cout << "Result: "
         << fixed << setprecision(2)
         << result1 << "\n";

    double result2 = (a + b) * c;

    cout << "\nExample 2:\n";
    cout << "Expression: (A + B) * C\n";
    cout << "Expression: (" << a << " + " << b << ") * " << c << "\n";
    cout << "Result: " << result2 << "\n";

    double result3 = a + b * c - d;

    cout << "\nExample 3:\n";
    cout << "Expression: A + B * C - D\n";
    cout << "Expression: " << a << " + " << b << " * " << c << " - " << d << "\n";
    cout << "Result: " << result3 << "\n";

    double result4 = (a + b) * (c - d);

    cout << "\nExample 4:\n";
    cout << "Expression: (A + B) * (C - D)\n";
    cout << "Expression: (" << a << " + " << b << ") * (" << c << " - " << d << ")\n";
    cout << "Result: " << result4 << "\n";

    double result5 = a + b * c / d - e;

    cout << "\nExample 5:\n";
    cout << "Expression: A + B * C / D - E\n";
    cout << "Expression: " << a << " + " << b << " * " << c << " / " << d << " - " << e << "\n";
    cout << "Result: " << result5 << "\n";

    cout << "\nExample 6:\n";
    cout << "Expression: pow(A, B)\n";
    cout << "Expression: pow(" << a << ", " << b << ")\n";
    cout << "Result: " << pow(a, b) << "\n";

    cout << "\n===============================================\n";

    return 0;
}