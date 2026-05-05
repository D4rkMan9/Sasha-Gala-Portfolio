import mysql.connector
from mysql.connector import pooling
from .config import Config

db_pool = None

def init_db(app):
    global db_pool
    db_config = {
        "user": Config.DB_USER,
        "password": Config.DB_PASSWORD,
        "host": Config.DB_HOST,
        "port": Config.DB_PORT,
        "database": Config.DB_NAME,
    }

    try:
        db_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=5,
            **db_config
        )
        app.logger.info("Database pool initialized successfully")
    except mysql.connector.Error as err:
        app.logger.error(f"Error initializing database pool: {err}")


def get_db_connection():
    global db_pool
    if db_pool:
        try:
            return db_pool.get_connection()
        except mysql.connector.Error as err:
            print(f"Error getting DB connection: {err}")
            # Try to reinitialize pool
            try:
                db_pool = mysql.connector.pooling.MySQLConnectionPool(
                    pool_name="mypool_retry",
                    pool_size=5,
                    user=Config.DB_USER,
                    password=Config.DB_PASSWORD,
                    host=Config.DB_HOST,
                    database=Config.DB_NAME,
            port=Config.DB_PORT,
                )
                return db_pool.get_connection()
            except mysql.connector.Error as err2:
                print(f"Error reinitializing DB pool: {err2}")
    else:
        # Pool was never created, try once
        try:
            db_pool = mysql.connector.pooling.MySQLConnectionPool(
                pool_name="mypool_init",
                pool_size=5,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                database=Config.DB_NAME,
            )
            return db_pool.get_connection()
        except mysql.connector.Error as err:
            print(f"Error creating DB pool on first query: {err}")
    return None


def execute_query(query, params=None, dictionary=True, fetch_one=False):
    cnx = get_db_connection()
    if not cnx:
        print(f"DB ERROR: No connection available for query: {query[:80]}")
        return None

    cursor = cnx.cursor(dictionary=dictionary)
    try:
        cursor.execute(query, params or ())

        stripped = query.strip().upper()

        if stripped.startswith(('INSERT',)):
            cnx.commit()
            return cursor.lastrowid

        if stripped.startswith(('UPDATE', 'DELETE')):
            cnx.commit()
            return cursor.rowcount

        if fetch_one:
            return cursor.fetchone()
        return cursor.fetchall()

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        print(f"Failed query: {query[:200]}")
        cnx.rollback()
        return None
    except Exception as e:
        print(f"Unexpected DB error: {e}")
        print(f"Failed query: {query[:200]}")
        cnx.rollback()
        return None
    finally:
        cursor.close()
        cnx.close()
