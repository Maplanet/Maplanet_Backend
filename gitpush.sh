#!/bin/bash

# 이미지 빌드
docker build -t username/my-image .

# Docker Hub에 로그인
docker login

# 이미지를 Docker Hub에 푸시
docker push username/my-image