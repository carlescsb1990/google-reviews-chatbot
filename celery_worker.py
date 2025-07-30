#!/usr/bin/env python3
# celery_worker.py
from __future__ import absolute_import
import os
from celery import Celery
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Celery application
app = Celery('google_reviews_chatbot')

# Load configuration
app.config_from_object('celery_config')

# Auto-discover tasks
app.autodiscover_tasks(['chatbot'])

if __name__ == '__main__':
    app.start()
