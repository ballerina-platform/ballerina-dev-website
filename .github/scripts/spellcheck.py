import os
from spellchecker import SpellChecker

# Initialize spell checker
spell = SpellChecker()

# Directory to scan for files (in this case, _data)
directory = "_data"

# File extensions to check
file_extensions = ['.txt', '.md', '.html', '.js', '.py']  # Add or modify based on your needs

# Function to check spelling in a file
def check_spelling_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()

    words = text.split()
    misspelled = spell.unknown(words)

    return misspelled

# Open report file to write results
with open('spellcheck_report.txt', 'w', encoding='utf-8') as report:
    report.write("### Spell Check Report\n\n")

    for subdir, _, files in os.walk(directory):
        for filename in files:
            if any(filename.endswith(ext) for ext in file_extensions):
                file_path = os.path.join(subdir, filename)
                misspelled_words = check_spelling_in_file(file_path)

                if misspelled_words:
                    report.write(f"File: {file_path}\n")
                    report.write(f"Misspelled words: {', '.join(misspelled_words)}\n\n")

print("Spell check completed. Report generated: spellcheck_report.txt")
