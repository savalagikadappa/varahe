import pandas as pd
import numpy as np

# --- Configuration ---
# CSV_FILE_NAME = "All_States_GE.csv"
CSV_FILE_NAME = "cleaned_election_data.csv"


def analyze_full_data():
    """
    Loads the entire dataset and prints a comprehensive, unfiltered analysis.
    """
    print(f"--- 1. Loading Full Data from {CSV_FILE_NAME} ---")

    if not pd.io.common.file_exists(CSV_FILE_NAME):
        print(
            f"❌ Error: The file '{CSV_FILE_NAME}' was not found. Please ensure it is in the correct directory."
        )
        return

    try:
        # Load the dataset
        df = pd.read_csv(CSV_FILE_NAME, low_memory=False)

        print(f"Total Rows (Candidates/Results): {len(df)}")
        print(f"Total Columns (Variables): {len(df.columns)}")
        print("-" * 50)

        # --- 2. Data Structure and Completeness ---

        print("A. Column Data Types and Non-Null Counts (Initial Schema):")
        # df.info() gives a quick summary of index, dtypes, and non-null values
        # We explicitly set 'verbose=True' and 'show_counts=True' for maximum detail
        df.info(verbose=True, show_counts=True, memory_usage="deep")

        print("-" * 50)

        # --- 3. Content and Scope Analysis ---

        print("B. Scope of Election Data:")

        # Years present
        year_col = next((col for col in df.columns if "Year" in col), None)
        if year_col:
            unique_years = sorted(
                [
                    int(y)
                    for y in df[year_col].dropna().unique()
                    if pd.notna(y) and pd.to_numeric(y, errors="coerce")
                ]
            )
            print(
                f"  - Unique Years Present: {len(unique_years)} ({unique_years[0]} to {unique_years[-1]})"
            )

        # Election Types present
        if "Election_Type" in df.columns:
            print("  - Election Types and Counts:")
            print(df["Election_Type"].value_counts(dropna=False))
            print("    (Note: 'AE' is Assembly Election, 'GE' is General Election.)")

        # Unique States
        if "State_Name" in df.columns:
            print(f"  - Number of Unique States/UTs: {df['State_Name'].nunique()}")

        print("-" * 50)

        # --- 4. Statistical Summary for Numerical Columns ---

        print("C. Statistical Summary of Key Numerical Metrics:")
        # Identify key numerical columns for statistical summary
        numerical_cols_to_describe = [
            "Position",
            "Votes",
            "Valid_Votes",
            "Electors",
            "Turnout_Percentage",
            "Margin",
        ]

        # Ensure only columns present in the DataFrame are described
        present_numeric_cols = [
            col for col in numerical_cols_to_describe if col in df.columns
        ]

        if present_numeric_cols:
            # .T transposes the result for easier reading (rows are columns, columns are stats)
            print(df[present_numeric_cols].describe(percentiles=[0.25, 0.50, 0.75]).T)
        else:
            print("No key numerical columns found for summary.")

    except Exception as e:
        print(f"❌ An unexpected error occurred during processing: {e}")


if __name__ == "__main__":
    analyze_full_data()
