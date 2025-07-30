# celery_config.py
from __future__ import absolute_import
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Redis configuration from environment or default
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

broker_url = redis_url
result_backend = redis_url

# Task imports
imports = ('chatbot.celery_tasks',)

# Timezone configuration
timezone = 'UTC'
enable_utc = True

# Task routing
task_routes = {
    'chatbot.celery_tasks.fetch_and_respond_reviews': {'queue': 'reviews'},
}

# Beat schedule for periodic tasks
beat_schedule = {
    'fetch-google-reviews-every-10-minutes': {
        'task': 'chatbot.celery_tasks.fetch_and_respond_reviews',
        'schedule': timedelta(minutes=10),
        'options': {'queue': 'reviews'}
    },
}

# Worker configuration
worker_prefetch_multiplier = 1
task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
result_expires = 3600

# Task execution settings
task_always_eager = os.getenv('CELERY_ALWAYS_EAGER', 'False').lower() == 'true'
task_eager_propagates = True
