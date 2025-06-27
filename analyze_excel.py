import pandas as pd
import sys

# Load the spreadsheet
file_path = 'watchlist.xlsm'

try:
    # Read the Excel file
    xls = pd.ExcelFile(file_path)
    # Print the names of the sheets
    print('Sheet names:', xls.sheet_names)

    # Load a specific sheet into a DataFrame (change 'Sheet1' to your sheet name)
    df = pd.read_excel(xls, sheet_name='Sheet1')
    print(df.head())  # Display the first few rows of the DataFrame
except Exception as e:
    print('Error:', e)
    sys.exit(1)