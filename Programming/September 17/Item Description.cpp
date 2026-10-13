#include <iostream>
#include <string>

int main()
{
    std::string item;
    char again;

    do
    {
        std::cout << "Description: ";
        std::getline(std::cin >> std::ws, item);

        if (item.size() > 20)
        {
            std::cout << "Description: DETAILED\n";
        }
        else
        {
            if (item.size() > 0)
            {
                std::cout << "Description: BRIEF\n";
            }
            else
            {
                std::cout << "Description: EMPTY\n";
            }
        }

        std::cout << "Review another? Y/N: ";
        std::cin >> again;

    } while (again == 'Y' || again == 'y');

    return 0;
}