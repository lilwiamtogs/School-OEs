#include <iostream>
#include <iomanip>
#include <cmath>
#include <string>

using namespace std;

int main() {
    double baseAttack;
    cout << "Enter base attack value: ";
    cin >> baseAttack;

    double  wepBonus;
    cout << "Enter weapon bonus value: ";
    cin >> wepBonus;

    double critMultiplier;
    cout << "Enter critical damage multiplier: ";
    cin >> critMultiplier;

    double enemyDefense;
    cout << "Enter enemy defense value: ";
    cin >> enemyDefense;

    double totalAttack = baseAttack + wepBonus;
    double critDamage = totalAttack * critMultiplier;
    double finalDamage = critDamage - enemyDefense;

    bool causesDamge = (finalDamage > 0);

    cout << fixed << setprecision(2);
    cout << "\n=============================================\n\n";
    cout << "\t CRITICAL DAMAGE CALCULATION\n\n";
    cout << "=============================================\n\n";
    cout << "Base Attack:                         " << baseAttack << "\n";
    cout << "Weapon Bonus:                        " << wepBonus << "\n";
    cout << "Total Attack:                        " << totalAttack << "\n";
    cout << "Critical Damage:                     " << critDamage << "\n";
    cout << "Enemy Defense:                       " << enemyDefense << "\n";
    cout << "Final Damage:                        " << finalDamage << "\n";
    cout << "Causes Damage:                       " << boolalpha << causesDamge << "\n";

    return 0;
}