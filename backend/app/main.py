from fastapi import FastAPI
from app.db import get_connection
from app.routers import parking

app = FastAPI()

app.include_router(parking.router, prefix="/parking", tags=["Parking"])

@app.get("/")
def root():
    return {"message": "Bienvenido a Parkontrol API"}

@app.get("/test-db")
def test_db():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 'Conexión OK a Oracle XE' FROM dual")
        result = cursor.fetchone()
        conn.close()
        return {"db_status": result[0]}
    except Exception as e:
        return {"error": str(e)}
