#include <iostream>
#include <string>

int main()
{
    int records;

    std::cout << "Number of records: ";
    std::cin >> records;

    for (int i = 1; i <= records; ++i)
    {
        std::string id = "REC_" + std::to_string(i);

        if (i % 2 == 0)
        {
            std::cout << id << " | EVEN\n";
        }
        else
        {
            if (i % 5 == 0)
            {
                std::cout << id << " | MULTIPLE OF 5\n";
            }
            else
            {
                std::cout << id << " | ODD\n";
            }
        }
    }

    return 0;
}