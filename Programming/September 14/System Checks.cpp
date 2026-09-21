#include <iostream>

int main()
{
    int checks;

    std::cout << "Number of checks: ";
    std::cin >> checks;

    for (int i = 1; i <= checks; ++i)
    {
        if (i % 3 == 0)
        {
            std::cout << "Check_" << i << ": PRIORITY\n";
        }
        else
        {
            if (i % 2 == 0)
            {
                std::cout << "Check_" << i << ": ROUTINE\n";
            }
            else
            {
                std::cout << "Check_" << i << ": STANDARD\n";
            }
        }
    }

    return 0;
}