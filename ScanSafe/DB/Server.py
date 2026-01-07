import os
import unittest
from sqlalchemy import create_engine
from pathlib import Path
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ["DATABASE_URL"]

#product: id, name, created_at
#ingredients: gtin, sub_ingredients, last_updated
#user: id, blacklist

def connection():
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS Product (
                id TEXT PRIMARY KEY,
                name TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
                CREATE TABLE IF NOT EXISTS Ingredients (
                gtin TEXT PRIMARY KEY REFERENCES products(gtin) ON DELETE CASCADE,
                sub_ingredients TEXT[],
                last_updated TIMESTAMPTZ NOT NULL DEFAULT now())
                CREATE TABLE IF NOT EXISTS Users (
                id SERIAL PRIMARY KEY,
                blacklist TEXT[]);
        """)
        conn.commit()

        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT id, name, created_at FROM widgets ORDER BY id DESC LIMIT 5;")
            for row in cur.fetchall():
                print(row)
        print("The program has finished executing.")
        

connection()