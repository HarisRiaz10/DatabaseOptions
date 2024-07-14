# create a fast API to do CRUD operations on 3 diffferent databases: AuroraDB, MySQL and DynamoDB

import os
AURORA_WRITER_HOST='<Your AuroraDB SQL Writer Host>'
AURORA_WRITER_PORT='3306'
AURORA_READER_HOST='<Your AuroraDB SQL Reader Host>'
AURORA_USER='admin'
AURORA_READER_PORT='3306'
AURORA_PASSWORD='<Your AuroraDB SQL Password>'
AURORA_DATABASE='<Your AuroraDB SQL Database>'


SQL_DB='<Your RDS SQL Database>'
SQL_HOST='<Your RDS SQL host>'
SQL_PORT='3306'
SQL_PASSWORD='<Your RDS SQL Password>'
SQL_USER='admin'

ACCESS_KEY='<Your AWS Access Key>'
SECRET_KEY='<Your AWS Secret Key>'

S3_BUCKET = '<Your S3 Bucket Name>'


from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Optional
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
from datetime import datetime
import boto3
from typing import List

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
session = boto3.Session(
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name='us-east-1'
)
s3 = boto3.client('s3', region_name='us-east-1', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)


# Initialize the DynamoDB resource
dynamodb = session.resource('dynamodb')
table = dynamodb.Table('posts')

class User(BaseModel):
    email: str
    username: str
    password: str

@app.post("/signup")
async def signup(request: Request, response: Response):
    data = await request.json()
    print(data)
    user = User(**data)
    print(user)

    try:
        # Insert the new user into the RDS database
        with mysql.connector.connect(
            user=AURORA_USER, password=AURORA_PASSWORD,
            host=AURORA_WRITER_HOST,
            database=AURORA_DATABASE
        ) as cnx:
            cursor = cnx.cursor()
            query = "INSERT INTO users (email, username, password) VALUES (%s, %s,%s)"
            values = (user.email, user.username, user.password)
            cursor.execute(query, values)
            cnx.commit()
        return JSONResponse(status_code=201, content={"message": "User created successfully"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error creating user"})

@app.post("/create_post")
async def addposttodb(request: Request, response: Response): 
    data = await request.form()
    print(data)
    title = data.get('title')
    username: str = data.get('name')
    post_content = data.get('content')
    
    try:
        media = data.get('media')
        print("the media is: ",media)
    except Exception as e:
        print(e)
        media = None
    
    current_time = datetime.now().strftime('%H:%M:%S')
    id = str(username) + str(current_time)

    try:
        # Insert the new user into the RDS database
        with mysql.connector.connect(
            user=SQL_USER, password=SQL_PASSWORD,
            host=SQL_HOST,
            database=SQL_DB
        ) as cnx:
            cursor = cnx.cursor()
            query = "INSERT INTO user_post (id, username) VALUES (%s,%s)"
            values = (id, username)
            cursor.execute(query, values)
            cnx.commit()
        if media !=None and media !='undefined':
            s3_key = f"posts/{id}/{media.filename}"
            s3.upload_fileobj(media.file, S3_BUCKET, s3_key)
            media_url = f"https://{S3_BUCKET}.s3.{dynamodb.meta.client.meta.region_name}.amazonaws.com/{s3_key}"
            dynamo_response = table.put_item(
                Item={
                    'post_id': id,
                    'title': title,
                    'content': post_content,
                    'media': media_url,
                }
            )
        else:
            dynamo_response = table.put_item(
                Item={
                    'post_id': id,
                    'title': title,
                    'content': post_content,
                }
            )
        print(dynamo_response)
        
        return JSONResponse(status_code=201, content={"message": f"Post created successfully: {id}"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Error creating Post"})
        #return JSONResponse(status_code=201, content={"message": f"Post created successfully: {id}"})
        
    #except Exception as e:
    #    return JSONResponse(status_code=500, content={"message": "Error creating Post"})

@app.get("/get_posts", response_model=List[dict])
async def get_posts(request: Request, response: Response): 
    try:
        # Connect to the RDS Aurora SQL database
        cnx = mysql.connector.connect(
            user=SQL_USER, password=SQL_PASSWORD,
            host=SQL_HOST, database=SQL_DB
        )
        cursor = cnx.cursor(dictionary=True)
        cursor.execute("SELECT id, username FROM user_post")
        sql_posts = cursor.fetchall()
        print(sql_posts)
        posts = []
        for sql_post in sql_posts:
            post_id = sql_post['id']
            #username = sql_post['username']
            # Fetch post content from DynamoDB
            response = table.get_item(Key={'post_id': post_id})
            if 'Item' in response:
                post_content = response['Item']
                post_content['username'] = sql_post['username']
                posts.append(post_content)
            else:
                raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found in DynamoDB")

        return posts
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error fetching posts")
    finally:
        cursor.close()
        cnx.close()
@app.post("/login")
async def login(request: Request, response: Response): 
    data = await request.json()
    print(data)
    email = data.get('email')
    password = data.get('password')

    try:
        # Query the user from the RDS database
        cnx = mysql.connector.connect(user=AURORA_USER, password=AURORA_PASSWORD,
                                      host=AURORA_READER_HOST,
                                      database=AURORA_DATABASE)
        cursor = cnx.cursor()
        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        values = (email, password)
        cursor.execute(query, values)
        results = cursor.fetchall()
        cnx.close()
        print ("The results are: ",results)

        if len(results) == 0:
            return JSONResponse(status_code=401, content={"message": "Invalid username or password"})
        else:
            return JSONResponse(status_code=200, content={"message": results[0]}) #"Login successful"
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error logging in user"})
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/all")
def read_all():
    results = None
    try:
        # Query the user from the RDS database
        cnx = mysql.connector.connect(user=AURORA_USER, password=AURORA_PASSWORD,
                                      host=AURORA_READER_HOST,
                                      database=AURORA_DATABASE)
        cursor = cnx.cursor()
        query = "SELECT * FROM users"
        cursor.execute(query)
        results = cursor.fetchall()
        cnx.close()

        if len(results) == 0:
            return JSONResponse(status_code=401, content={"message": "Invalid"})
        else:
            return JSONResponse(status_code=200, content={"message": results})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


