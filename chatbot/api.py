import logging
import os
from typing import List, Dict, Optional

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    GOOGLE_APIS_AVAILABLE = True
except ImportError:
    GOOGLE_APIS_AVAILABLE = False

try:
    from config.settings import GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
except ImportError:
    # Fallback to environment variables
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')

logger = logging.getLogger(__name__)

def get_mybusiness_service():
    """Initialize Google My Business service with proper error handling"""
    if not GOOGLE_APIS_AVAILABLE:
        raise ImportError("Google API libraries not available. Install google-auth and google-api-python-client")

    if not all([GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET]):
        raise ValueError("Google API credentials not properly configured in environment variables")

    try:
        credentials = service_account.Credentials.from_authorized_user_info(
            info={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "api_key": GOOGLE_API_KEY,
            },
            scopes=["https://www.googleapis.com/auth/business.manage"]
        )

        service = build("mybusiness", "v4", credentials=credentials)
        logger.info("Google My Business service initialized successfully")
        return service

    except Exception as e:
        logger.error(f"Failed to initialize Google My Business service: {e}")
        raise

def get_account_name(service) -> str:
    """Get the first available Google My Business account name"""
    try:
        accounts = service.accounts().list().execute()
        if not accounts.get('accounts'):
            raise ValueError("No Google My Business accounts found")

        account_name = accounts["accounts"][0]["name"]
        logger.info(f"Using Google My Business account: {account_name}")
        return account_name

    except HttpError as e:
        logger.error(f"HTTP error fetching accounts: {e}")
        raise
    except Exception as e:
        logger.error(f"Error fetching account name: {e}")
        raise

def get_reviews(service, account_name: str) -> List[Dict]:
    """Fetch reviews for the specified Google My Business account"""
    try:
        # Get locations for the account
        locations = service.accounts().locations().list(parent=account_name).execute()

        if not locations.get('locations'):
            logger.warning("No locations found for account")
            return []

        location_name = locations['locations'][0]['name']
        logger.info(f"Fetching reviews for location: {location_name}")

        # Get reviews for the first location
        reviews_response = service.accounts().locations().reviews().list(parent=location_name).execute()
        reviews = reviews_response.get('reviews', [])

        logger.info(f"Fetched {len(reviews)} reviews")
        return reviews

    except HttpError as e:
        logger.error(f"HTTP error fetching reviews: {e}")
        raise
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        raise

def get_mock_reviews() -> List[Dict]:
    """Generate mock reviews for testing when API is not available"""
    return [
        {
            "reviewId": "mock_1",
            "reviewer": {
                "displayName": "María García",
                "profilePhotoUrl": ""
            },
            "starRating": "FIVE",
            "comment": "Excelente servicio! El personal fue muy amable y profesional. Definitivamente volveré.",
            "createTime": "2025-07-30T10:30:00Z",
            "updateTime": "2025-07-30T10:30:00Z"
        },
        {
            "reviewId": "mock_2",
            "reviewer": {
                "displayName": "Carlos López",
                "profilePhotoUrl": ""
            },
            "starRating": "FOUR",
            "comment": "Buena experiencia en general. El servicio fue rápido y eficiente.",
            "createTime": "2025-07-29T15:45:00Z",
            "updateTime": "2025-07-29T15:45:00Z"
        },
        {
            "reviewId": "mock_3",
            "reviewer": {
                "displayName": "John Smith",
                "profilePhotoUrl": ""
            },
            "starRating": "FIVE",
            "comment": "Outstanding service! The team went above and beyond my expectations.",
            "createTime": "2025-07-28T09:15:00Z",
            "updateTime": "2025-07-28T09:15:00Z"
        }
    ]
