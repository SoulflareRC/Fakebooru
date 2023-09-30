FROM python:3.10-slim-bullseye

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE backend.settings

# Create and set the working directory
RUN mkdir /app
WORKDIR /app
RUN mkdir backend 
WORKDIR backend 
RUN apt-get update && apt-get -y install cmake protobuf-compiler

# install requirements 
RUN pip install --upgrade pip 
COPY requirements.txt /app/backend  
RUN pip install onnxruntime
RUN pip install -r requirements.txt 

ADD . /app/backend 

RUN python manage.py makemigrations
RUN python manage.py migrate
EXPOSE 8000 
CMD ["python","manage.py","runserver","0.0.0.0:8000"]
