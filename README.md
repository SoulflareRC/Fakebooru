# Fakebooru
## About 
This is a [Danbooru](https://danbooru.donmai.us/)-like website built with [React](https://react.dev/) as the frontend and [Django](https://www.djangoproject.com/) as the backend. The website features a tag-based public image database with convenient CRUD API support with strict permissions. The Docker deployment uses Nginx as a reverse proxy to serve the react app hosted on port 3000. 
## Installation
#### Deploy with Docker Compose
Make sure you have docker compose installed, run the following command to launch the app.  
```
docker compose up
```
Navigate to http://127.0.0.1 after docker compose completed. 
#### launch locally
```
# clone this repo 
git clone https://github.com/SoulflareRC/django-react-danbooru-like-website.git

cd django-react-danbooru-like-website

# set up virtual environment
python -m venv venv
venv\Scripts\activate

# install requirements
pip install -r requirements.in

# make initial migrations
python backend\manage.py makemigrations
python backend\manage.py makemigrations users
python backend\manage.py makemigrations common
python backend\manage.py migrate

# run react frontend
npm install
npm start

# run django backend
python backend\manage.py runserver

```
Navigate to http://127.0.0.1:8000/ after the django backend is launched. 
#### .env
Copy `.env.example` in `/backend` and `/frontend` and rename it to `.env`. Edit the `.env` file to enable email verification.  
## Pages
### Authentication 
![login](/Demo/login.png)
- Token-based authentication
- Email verification
- Password reset email
### Index 
![index](/Demo/posts.png)
- On-hover post stats summary
- Responsive filtering
- Tags sorted by category
- Using thumbnails to improve performance
### Post
![index](/Demo/post.png)
![index](/Demo/post_editing.png)
- Detailed post stats
- Responsive rating/editing/commenting
- Unique image hash to prevent duplicates
- Using previews to improve performance
### Upload
![index](/Demo/postcreate.png)
- Uploaded filepreview powered by Filepond 
- Dynamic and intuitive tagging powered by tagify.js
- Automatic AI tag suggestion powered by Deepdanbooru
### Tag list 
![index](/Demo/tags.png)
- Responsive filtering by category
- Supports ordering by name/date/post count
### Tag 
![tag](/Demo/tag.png)
![tag](/Demo/tag_editing.png)
- Public editing allowed
- Markdown tag description
### Comments 
![comments](/Demo/comments.png)
- Supports threaded comments
- Responsive comment voting/replying/deleting
### Profile
![profile](/Demo/profile_post.png)
![profile](/Demo/profile_stats.png)
![profile](/Demo/profile_editing.png)
- Tabbed user info
- Displays user stats & posts
- Responsive profile editing



