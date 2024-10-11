import json
import pymysql
import os

host = os.getenv('HOST')
username = os.getenv('USERNAME')
password = os.getenv('PASSWORD')
dbname = 'Literacy'


def lambda_handler(event, context):
    body = event.get('body')
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': {'error': 'Invalid JSON format'}
            }
    if 'user_key' not in body:
        return {
            'statusCode': 400, 
            'body': {'error': 'user_key is missing'}
        }
    user_key = body['user_key']

    try:
        db_connection = pymysql.connect(
            host=host, 
            user=username, 
            passwd=password, 
            db=dbname, 
            connect_timeout=60
        )

        cursor = db_connection.cursor()

        query = 'SELECT name, exp FROM User WHERE id = %s'
        cursor.execute(query, (user_key,))
        result = cursor.fetchone()

        if result is None:
            return {
                'statusCode': 404, 
                'body': {'error': 'User not found'}
            }
        
        name, exp = result

        return {
            'statusCode': 200,
            'body': {
                'name': name,
                'exp': exp
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': {'error': str(e)}
        }
    
    finally:
        if db_connection:
            db_connection.close()

