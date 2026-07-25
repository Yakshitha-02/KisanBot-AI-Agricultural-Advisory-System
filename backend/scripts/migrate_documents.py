import sqlite3

DATABASE = "app.db"      # <-- change this if your DB has a different name

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

try:
    cursor.execute("""
        ALTER TABLE documents
        ADD COLUMN is_indexed BOOLEAN DEFAULT 0
    """)
    print("✓ Added is_indexed")
except Exception as e:
    print(e)

try:
    cursor.execute("""
        ALTER TABLE documents
        ADD COLUMN translated_languages TEXT DEFAULT ''
    """)
    print("✓ Added translated_languages")
except Exception as e:
    print(e)

conn.commit()
conn.close()

print("Migration completed.")