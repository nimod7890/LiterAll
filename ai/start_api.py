from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functions.convert_news import convert_news
from functions.question_maker import question_maker
from functions.grading import grading
from functions.link_to_text import link_to_text
from functions.text_to_pic import text_to_pic
from functions.recsys_news import recsys_news
from typing import Optional
from dotenv import load_dotenv
import os
import openai as client
import mysql.connector
import uvicorn

load_dotenv()
client.api_key = os.getenv('OPENAI_API_KEY')

connection = mysql.connector.connect(
    host='database-2.cnewcec2awux.ap-northeast-2.rds.amazonaws.com',        # 예: 'localhost' 또는 MySQL 서버 IP 주소
    user='admin',    # MySQL 사용자 이름
    password=os.getenv('DB_PASSWD'),  # MySQL 비밀번호
    database='Literacy'  # 데이터베이스 이름
)

cursor = connection.cursor()

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:5173",
    "https://for-hack.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 origin 목록
    allow_credentials=True,
    allow_methods=["*"],  # 허용할 HTTP 메서드
    allow_headers=["*"],  # 허용할 HTTP 헤더
)

# 입력 데이터를 위한 Pydantic 모델
class ConvertNewsInput(BaseModel):
    score: int
    text: str
    isImage: bool

class QuestionMakerInput(BaseModel):
    converted_news: str

class GradingInput(BaseModel):
    ans: list
    qa_list: list
    converted_news: str
    user_id: int
    exp: int
    title: str
    
class LinkToTextInput(BaseModel):
    url: str
    

@app.post("/convert_news")
async def convert_news_endpoint(input_data: ConvertNewsInput):
    converted_news = convert_news(input_data.score, input_data.text)
    image_url = None
    qa_list = question_maker(converted_news)
    
    if not input_data.isImage:
        image_url = text_to_pic(input_data.text)
        
    return {"converted_news": converted_news, "qa_list": qa_list, "image_url": image_url}

@app.post("/grading")
async def grading_endpoint(input_data: GradingInput):
    result = grading(input_data.ans, input_data.qa_list, input_data.converted_news)
    
    sql_query1 = "INSERT INTO History (title, converted_news, user_id, exp) VALUES (%s, %s, %s, %s)"
    data1 = (input_data.title, input_data.converted_news, input_data.user_id, input_data.exp)
    
    sql_query2= """
                UPDATE User
                SET exp = exp + %s
                WHERE id = %s
            """
    data2 = (result[0] * 10, input_data.user_id)
    
    while True:
        try:
            # 데이터 삽입
            cursor.execute(sql_query1, data1)
            cursor.execute(sql_query2, data2)

            # 변경 사항 저장 (커밋)
            connection.commit()
            print("데이터가 성공적으로 삽입되었습니다.")
            break
        except mysql.connector.Error as error:
            print(f"데이터 삽입 중 오류 발생: {error}")
            connection.rollback()  # 오류가 발생하면 롤백
            
    return {"result": result}

@app.post("/link_to_text")
async def link_to_text_endpoint(input_data: LinkToTextInput):
    result = link_to_text(input_data.url)
    return {"result": result}

@app.get("/recsys")
async def recsys_endpoint(searches: Optional[str] = None):
    search_list = searches.split(",") if searches else []
    result = recsys_news(search_list)
    return {"result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
