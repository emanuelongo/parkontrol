import oracledb
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    username = "parkontrol"
    password = "parkontrol123"
    dsn = "localhost/XE"   # sin el puerto, Oracle lo asume por defecto (1521)

    connection = oracledb.connect(user=username, password=password, dsn=dsn)
    print("Conexión exitosa:", connection.version)
    #connection.close()
    return connection