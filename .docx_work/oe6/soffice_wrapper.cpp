#include <cstdlib>
#include <string>

int main(int argc, char* argv[]) {
    std::string command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"D:\\Users\\willi\\Downloads\\School OEs\\.docx_work\\oe6\\word_to_pdf.ps1\"";
    for (int i = 1; i < argc; ++i) {
        command += " \"";
        command += argv[i];
        command += "\"";
    }
    return std::system(command.c_str());
}
