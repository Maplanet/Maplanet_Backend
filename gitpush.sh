#!/bin/bash
git pull origin develop
git add .
git commit -m "cicd테스트"
git push origin feature/게시판
