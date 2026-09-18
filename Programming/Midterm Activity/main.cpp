#include <iomanip>
#include <iostream>
#include <string>

int main() {
    std::string playerName;
    std::string characterClass;
    std::string guildName;
    std::string profileCode;
    std::string guildNote;
    std::string status;
    std::string access;
    std::string reward;
    // Enter valid numeric values and use only 0 or 1 for Boolean inputs.
    int level = 0;
    double score = 0.0;
    bool banned = false;
    bool hasEquipment = false;

    std::cout << "==============================================\n";
    std::cout << " RPG DUNGEON ACCESS AND REWARD ASSESSMENT\n";
    std::cout << "==============================================\n\n";

    std::cout << "Player name     : ";
    std::getline(std::cin, playerName);

    std::cout << "Character class : ";
    std::getline(std::cin, characterClass);

    std::cout << "Player level    : ";
    std::cin >> level;

    std::cout << "Player score    : ";
    std::cin >> score;
    std::cin.ignore(10000, '\n');

    std::cout << "Guild name      : ";
    std::getline(std::cin, guildName);

    std::cout << "Banned (1/0)    : ";
    std::cin >> banned;

    std::cout << "Equipment (1/0) : ";
    std::cin >> hasEquipment;

    // Six string operations: getline, substr, append, +=, size, and find.
    // npos is the special constant meaning that find did not locate a match.
    profileCode = playerName.substr(0, 3);
    profileCode.append("-");
    profileCode += characterClass.substr(0, 3);
    guildNote = guildName.find("Guild") != std::string::npos
        ? std::string("Guild keyword found")
        : std::string("No guild keyword found");

    std::cout << "\nAssessment trace\n";
    std::cout << "----------------\n";

    // Follow the supplied rules literally: only Legendary checks !banned.
    status = level >= 50 && score >= 90.0 && hasEquipment && !banned
        ? (std::cout << "Legendary check : TRUE\n",
           access = "SPECIAL DUNGEON ACCESS",
           reward = "LEGENDARY CHEST",
           std::string("LEGENDARY READY"))
        : (std::cout << "Legendary check : FALSE\n",
           (level >= 30 && score >= 75.0) || hasEquipment
               ? (std::cout << "Battle check    : TRUE\n",
                  access = "STANDARD DUNGEON ACCESS",
                  reward = "RARE CHEST",
                  std::string("BATTLE READY"))
               : (std::cout << "Battle check    : FALSE\n",
                  level >= 10 && score >= 50.0
                      ? (std::cout << "Restricted check: TRUE\n",
                         access = "LIMITED ACCESS",
                         reward = "COMMON CHEST",
                         std::string("RESTRICTED"))
                      : (std::cout << "Restricted check: FALSE\n",
                         access = "NO ACCESS",
                         reward = "NO REWARD",
                         std::string("DENIED"))));

    std::cout << "\nPlayer profile\n";
    std::cout << "--------------\n";
    std::cout << std::left;
    std::cout << std::setw(18) << "Player" << ": " << playerName << '\n';
    std::cout << std::setw(18) << "Name length" << ": " << playerName.size() << '\n';
    std::cout << std::setw(18) << "Class" << ": " << characterClass << '\n';
    std::cout << std::setw(18) << "Profile code" << ": " << profileCode << '\n';
    std::cout << std::setw(18) << "Guild" << ": " << guildName << '\n';
    std::cout << std::setw(18) << "Guild check" << ": " << guildNote << '\n';
    std::cout << std::setw(18) << "Level" << ": " << level << '\n';
    std::cout << std::setw(18) << "Score" << ": "
              << std::fixed << std::setprecision(1) << score << '\n';
    std::cout << std::boolalpha;
    std::cout << std::setw(18) << "Banned" << ": " << banned << '\n';
    std::cout << std::setw(18) << "Has equipment" << ": " << hasEquipment << '\n';

    std::cout << "\nFinal result\n";
    std::cout << "------------\n";
    std::cout << std::setw(18) << "Status" << ": " << status << '\n';
    std::cout << std::setw(18) << "Access" << ": " << access << '\n';
    std::cout << std::setw(18) << "Reward" << ": " << reward << '\n';

    return 0;
}
