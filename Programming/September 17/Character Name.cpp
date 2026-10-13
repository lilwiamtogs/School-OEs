#include <iostream>
#include <string>

int main()
{
    std::string player;
    char again;

    do
    {
        std::cout << "Player name: ";
        std::getline(std::cin >> std::ws, player);

        if (player.size() >= 12)
        {
            std::cout << "Name Class: EPIC\n";
        }
        else
        {
            if (player.size() >= 6)
            {
                std::cout << "Name Class: STANDARD\n";
            }
            else
            {
                std::cout << "Name Class: SHORT\n";
            }
        }

        std::cout << "Create another? Y/N: ";
        std::cin >> again;

    } while (again == 'Y' || again == 'y');

    return 0;
}