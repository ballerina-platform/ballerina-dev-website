import os
from spellchecker import SpellChecker
import json
import re

# Initialize spell checker
spell = SpellChecker()

# List of directories to scan for files
directories = ["_data", "case-studies", "community", "components", "downloads", "hacktoberfest", "pages", "policy", "spec", "swan-lake", "utils"]

# File extensions to check
file_extensions = ['.txt', '.md', '.html', '.js', '.py', '.json']  # Include .json files

# Function to remove inline and block code snippets from the text
def remove_code_snippets(text):
    # Remove block code (triple backticks) and inline code (single backticks)
    text = re.sub(r'```[\s\S]*?```', '', text)  # Remove triple backtick blocks
    text = re.sub(r'`[^`]*`', '', text)  # Remove inline code (single backticks)
    return text

# Function to check spelling in a file
def check_spelling_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        if file_path.endswith('.json'):
            try:
                # If it's a JSON file, load it and convert to a string for spell checking
                data = json.load(file)
                text = json.dumps(data)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON file: {file_path}")
                return []
        else:
            text = file.read()

    # Remove code snippets from markdown or text before spell checking
    if file_path.endswith('.md'):
        text = remove_code_snippets(text)

    # Split text into words and check for misspelled words
    words = text.split()
    misspelled = spell.unknown(words)

    return misspelled

# Open report file to write results
with open('spellcheck_report.txt', 'w', encoding='utf-8') as report:
    report.write("### Spell Check Report\n\n")

    for directory in directories:
        for subdir, _, files in os.walk(directory):
            for filename in files:
                if any(filename.endswith(ext) for ext in file_extensions):
                    file_path = os.path.join(subdir, filename)
                    misspelled_words = check_spelling_in_file(file_path)

                    if misspelled_words:
                        report.write(f"File: {file_path}\n")
                        report.write(f"Misspelled words: {', '.join(misspelled_words)}\n\n")

print("Spell check completed. Report generated: spellcheck_report.txt")