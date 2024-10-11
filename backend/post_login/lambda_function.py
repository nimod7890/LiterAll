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

    # event['body']가 JSON 문자열일 경우 파싱
    if 'id' not in body:
        return {
            'statusCode': 400, 
            'body': {'error': 'id is missing'}
        }

    if 'password' not in body:
        return {
            'statusCode': 400, 
            'body': {'error': 'password is missing'}
        }
    
    user_id = body['id']
    user_password = body['password']

    try:
        db_connection = pymysql.connect(
            host=host, 
            user=username, 
            passwd=password, 
            db=dbname, 
            connect_timeout=60
        )

        cursor = db_connection.cursor()
        print(user_id, user_password)
        # 유저 정보 조회 쿼리
        query = 'SELECT id FROM User WHERE user_id = %s AND user_pw = %s'
        cursor.execute(query, (user_id, user_password))
        result = cursor.fetchone()

        if result is None:
            return {
                'statusCode': 401, 
                'body': {'error': 'Invalid credentials'}
            }
        
        id = result[0]

        return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "OPTIONS,POST",  # 필요한 메서드 추가
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            'body': {
                'user_key': id
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