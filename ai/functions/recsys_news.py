import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
import openai as client
from tqdm import tqdm

def compute_distance_matrix(embeddings):
    num_embeddings = len(embeddings)
    distance_matrix = np.zeros((num_embeddings, num_embeddings))

    for i in range(num_embeddings):
        for j in range(i + 1, num_embeddings):
            distance = cosine(embeddings[i], embeddings[j])
            distance_matrix[i][j] = distance
            distance_matrix[j][i] = distance

    return distance_matrix

def select_max_distance_embeddings(df):
    embeddings = df['embedding'].tolist()

    if len(embeddings) <= 3:
        return df

    distance_matrix = compute_distance_matrix(embeddings)
    selected_indices = [0]

    while len(selected_indices) < 3:
        max_distance = -1
        next_index = -1

        for i in range(len(embeddings)):
            if i not in selected_indices:
                min_distance = min([distance_matrix[i][j] for j in selected_indices])
                if min_distance > max_distance:
                    max_distance = min_distance
                    next_index = i

        selected_indices.append(next_index)

    return df.iloc[selected_indices]

def make_page_number(num):
    if num == 1:
        return num
    else:
        return num + 9 * (num - 1)

def make_urls(search, start_page, end_page):
    urls = []
    for page in range(start_page, end_page + 1):
        page_number = make_page_number(page)
        url = f"https://search.naver.com/search.naver?where=news&sm=tab_pge&query={search}&start={page_number}"
        urls.append(url)
    print("생성된 URLs:", urls)
    return urls

def news_attrs_crawler(articles,attrs):
    attrs_content=[]
    for i in articles:
        attrs_content.append(i.attrs[attrs])
    return attrs_content

def extract_article_urls(page_url):
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, sdch, br",
        "Accept-Language": "en-US,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102",
    }
    response = requests.get(page_url, headers=headers)
    html = BeautifulSoup(response.text, "html.parser")
    url_naver = html.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")
    url = news_attrs_crawler(url_naver,'href')
    return url

def get_sentence_embedding(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    return embedding

def crawl_articles(urls):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"
    }
    articles = []

    for url in tqdm(urls):
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        # 제목 추출
        title_elem = soup.select_one('#title_area > span')
        if not title_elem:
            title_elem = soup.select_one('.media_end_head_headline')

        title = title_elem.get_text(strip=True) if title_elem else None

        # 내용 추출
        content_elem = soup.find(id='dic_area')
        plain_texts=[]
        if content_elem:
            plain_texts = [string for string in content_elem.strings if string.strip()]
            
        content = ''.join(plain_texts) if content_elem else None
        
        image_elem = soup.find(id='img1')
        
        if not image_elem:
            image_url = None
        else:
            image_url = image_elem.get('data-src')
        
        articles.append({
            'title': title,
            'content': content,
            'url': url,
            'image_url': image_url
        })

    return pd.DataFrame(articles)

def recsys_news(search_keywords):
    final_df = pd.DataFrame(columns=['title', 'content', 'url', 'image_url'])

    for keyword in search_keywords:
        page_urls = make_urls(keyword, 1, 2)
        all_article_urls = []

        for page_url in page_urls:
            article_urls = extract_article_urls(page_url)
            # 네이버 뉴스 링크만 필터링
            naver_news_urls = [url for url in article_urls if "news.naver.com" in url]
            all_article_urls.extend(naver_news_urls)

        articles_df = crawl_articles(all_article_urls)

        # 임베딩 생성
        articles_df['embedding'] = articles_df['title'].apply(get_sentence_embedding)

        # 최대 거리의 임베딩 선택
        selected_articles = select_max_distance_embeddings(articles_df)

        # 결과 데이터프레임에 추가
        final_df = pd.concat([final_df, selected_articles.drop('embedding', axis=1)], ignore_index=True)

    # 최종 결과 출력
    json_data = [
        {
            'title': row['title'],
            'content': row['content'],
            'url': row['url'],
            'image_url': row['image_url']
        }
        for _, row in final_df.iterrows()
    ]
    return json_data
