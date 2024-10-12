import openai as client
import json
import logging
import re

def question_parser(ques):

    questions = ques.strip().split('문제 ')

    # 결과를 저장할 리스트 초기화
    qa_list = []

    # 각 문제 블록을 처리
    for q in questions:
        q = q.strip()
        if not q:
            continue  # 빈 문자열은 건너뜀
        try:
            # 문제 번호와 나머지 텍스트를 분리
            num, rest = q.split('.', 1)
        except ValueError:
            # '.'이 없으면 전체 문자열을 나머지 텍스트로 간주
            rest = q

        # '답안.'이 있을 경우 질문과 답안 분리
        if '답안.' in rest:
            question_part, answer_part = rest.split('답안.', 1)
            answer = answer_part.strip()
            # 대괄호 제거 및 정수 변환
            answer = answer.strip('[]').strip()
            answer = int(answer) if answer.isdigit() else None
        else:
            question_part = rest
            answer = None  # 답안이 없을 경우 None

        # 질문 텍스트 정리
        question_part = question_part.strip()

        # 옵션이 대괄호로 포함되어 있는지 확인
        if '[' in question_part and ']' in question_part:
            # 대괄호 내의 옵션 추출
            start_idx = question_part.rfind('[')
            end_idx = question_part.rfind(']')
            options_str = question_part[start_idx+1:end_idx]
            # 옵션을 리스트로 분리
            options = [opt.strip() for opt in options_str.split(',')]
            # 질문 텍스트에서 옵션 부분 제거
            question_text = question_part[:start_idx].strip()
        else:
            question_text = question_part
            options = []
            
        # 결과를 딕셔너리로 추가
        qa_list.append({
            'question': question_text,
            'option': options,
            'answer': answer
        })

    return qa_list


def news_question_maker_gpt(text):
        
    prompt = f"""
              당신은 최고수준의 뉴스 이해 및 강의 알고리즘입니다.
              당신은 사용자가 뉴스를 정확하게 이해하였는지 확인하기 위하여 질문을 3가지 생성하고자 합니다.
              
              첫번째 질문은 "뉴스의 핵심 주제 파악을 위한 객관식 문제"입니다. 핵심 주제에 관한 질문을 하세요. 이 경우에 4가지 보기를 제시하여야 합니다.
              두번째 질문은 "뉴스에서 쉽게 놓치기 쉬운 정보를 확인하는 문제"입니다. 정보에 대한 질문을 하세요. 이 경우에 4가지 보기를 문장 형태로 제시해야 합니다.
              세번째 질문은 "뉴스에서 본인의 견해를 짧게 논할 수 있는 논술형 문제"입니다. 이 경우에는 어떠한 답변도 제시하지 마세요.
              
              당신의 출력 형식은 다음을 엄격하게 지켜야만 합니다. (,과 같은 구분자에 주의하세요. 답안의 인덱스는 1부터 시작합니다.)
              
              문제 1. [질문] [보기1, 보기2, 보기3, 보기4] 답안. [정수]
              문제 2. [질문] [보기1, 보기2, 보기3, 보기4] 답안. [정수]
              문제 3. [질문]
              
              아래의 뉴스를 바탕으로 질문을 생성하세요.
              --------------------------------------------
              {text}
              """
    
    while True:
        try:
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[{"role": "system", "content": prompt}],
                temperature=0.3
            )
            break
            
        except ValueError:
            logging.exception("message")
            continue
    
    return response.choices[0].message.content

def question_maker(text):
    res = news_question_maker_gpt(text)
    return question_parser(res)