import pandas as pd
from sqlalchemy import create_engine


def clean_data():
    df = pd.read_csv("All_States_GE.csv", low_memory=False)

    df = df[(df["Year"] >= 1991) & (df["Year"] <= 2019)]

    df["Sex"] = df["Sex"].fillna("UNKNOWN")
    df["Party"] = df["Party"].fillna("INDEPENDENT")
    df["Constituency_Name"] = df["Constituency_Name"].fillna("UNKNOWN")
    df["Sub_Region"] = df["Sub_Region"].fillna("UNKNOWN")

    numeric_cols = ["Votes", "Electors", "Valid_Votes", "Margin"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    df["Turnout_Percentage"] = (df["Valid_Votes"] / df["Electors"]) * 100
    df["Turnout_Percentage"] = df["Turnout_Percentage"].fillna(0).round(2)
    df.loc[df["Turnout_Percentage"] > 100, "Turnout_Percentage"] = 100

    text_cols = [
        "State_Name",
        "Constituency_Name",
        "Party",
        "Candidate",
        "Sex",
        "Candidate_Type",
        "MyNeta_education",
    ]
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.upper()

    # Normalize Sex column to only 4 values: MALE, FEMALE, O, UNKNOWN
    df["Sex"] = df["Sex"].replace({
        "M": "MALE",
        "F": "FEMALE",
        "NOTA": "UNKNOWN",
        "NAN": "UNKNOWN"
    })
    # Ensure only valid values remain
    valid_sex_values = ["MALE", "FEMALE", "O", "UNKNOWN"]
    df.loc[~df["Sex"].isin(valid_sex_values), "Sex"] = "UNKNOWN"

    df["State_Name"] = df["State_Name"].replace(
        {
            "ORISSA": "ODISHA",
            "PONDICHERRY": "PUDUCHERRY",
            "UTTARANCHAL": "UTTARAKHAND",
            "CHHATISGARH": "CHHATTISGARH",
        }
    )

    df["Vote_Share_Percentage"] = (df["Votes"] / df["Valid_Votes"]) * 100
    df["Vote_Share_Percentage"] = df["Vote_Share_Percentage"].fillna(0).round(2)

    df["Is_Winner"] = df["Position"] == 1

    cols_to_keep = [
        "Year",
        "State_Name",
        "Constituency_Name",
        "Constituency_No",
        "Party",
        "Candidate",
        "Sex",
        "Votes",
        "Valid_Votes",
        "Electors",
        "Turnout_Percentage",
        "Vote_Share_Percentage",
        "Margin",
        "Position",
        "Is_Winner",
        "Party_Type_TCPD",
        "MyNeta_education",
    ]

    existing_cols = [c for c in cols_to_keep if c in df.columns]
    df_clean = df[existing_cols]

    df_clean.to_csv("cleaned_election_data.csv", index=False)
    print("Data cleaning complete. Filtered for 1991-2019.")
    return df_clean


def store_data_postgresql(df):
    user = "kadappa"
    password = "kadappa"
    host = "localhost"
    port = "5432"
    database = "varahe"

    engine = create_engine(
        f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    )

    df.to_sql("election_data", engine, if_exists="replace", index=False)
    print("Data stored in PostgreSQL table 'election_data'.")


if __name__ == "__main__":
    df_clean = clean_data()
    store_data_postgresql(df_clean)
