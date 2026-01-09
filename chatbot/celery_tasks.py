import logging
from typing import Dict, List
from celery import Task
from celery_worker import app

try:
    from .api import get_mybusiness_service, get_account_name, get_reviews, get_mock_reviews
    from .gpt3 import generate_response_gpt3, create_review_response_prompt, is_openai_configured
except ImportError as e:
    logging.warning(f"Import error in celery_tasks: {e}")

logger = logging.getLogger(__name__)

class CallbackTask(Task):
    """Base task class with error handling"""

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        logger.error(f"Task {task_id} failed: {exc}")
        super().on_failure(exc, task_id, args, kwargs, einfo)

    def on_success(self, retval, task_id, args, kwargs):
        logger.info(f"Task {task_id} completed successfully")
        super().on_success(retval, task_id, args, kwargs)

@app.task(bind=True, base=CallbackTask, max_retries=3, default_retry_delay=60)
def fetch_and_respond_reviews(self) -> Dict:
    """
    Celery task to fetch Google My Business reviews and generate responses

    Returns:
        Dictionary with task results
    """
    try:
        logger.info("Starting review fetch and response generation task")

        # Try to get real reviews, fallback to mock data
        try:
            service = get_mybusiness_service()
            account_name = get_account_name(service)
            reviews = get_reviews(service, account_name)
            data_source = "google_api"
            logger.info(f"Fetched {len(reviews)} reviews from Google My Business API")
        except Exception as e:
            logger.warning(f"Failed to fetch from Google API, using mock data: {e}")
            reviews = get_mock_reviews()
            data_source = "mock_data"

        processed_reviews = []
        responses_generated = 0

        for review in reviews:
            try:
                # Extract review information
                review_id = review.get('reviewId', 'unknown')
                reviewer_name = review.get('reviewer', {}).get('displayName', 'Anonymous')
                review_text = review.get('comment', '')
                star_rating = review.get('starRating', 'UNKNOWN')

                # Convert star rating to number
                rating_map = {
                    'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5
                }
                numeric_rating = rating_map.get(star_rating, None)

                logger.info(f"Processing review {review_id} from {reviewer_name}")

                # Generate response if text is available
                generated_response = None
                if review_text:
                    try:
                        if is_openai_configured():
                            # Use real OpenAI API
                            message_list = create_review_response_prompt(review_text, numeric_rating)
                            generated_response = generate_response_gpt3(message_list)
                            responses_generated += 1
                            logger.info(f"Generated AI response for review {review_id}")
                        else:
                            # Use mock response
                            generated_response = generate_mock_response_for_task(review_text)
                            logger.info(f"Generated mock response for review {review_id}")

                    except Exception as e:
                        logger.error(f"Failed to generate response for review {review_id}: {e}")
                        generated_response = "Thank you for your review! We appreciate your feedback."

                # Store processed review
                processed_review = {
                    'review_id': review_id,
                    'reviewer': reviewer_name,
                    'rating': numeric_rating,
                    'text': review_text,
                    'generated_response': generated_response,
                    'processed_at': app.now().isoformat()
                }

                processed_reviews.append(processed_review)

                # Log the review and response
                logger.info(f"Review from {reviewer_name}: {review_text[:100]}...")
                if generated_response:
                    logger.info(f"Generated response: {generated_response[:100]}...")

            except Exception as e:
                logger.error(f"Error processing individual review: {e}")
                continue

        # Task results
        results = {
            'task_id': self.request.id,
            'status': 'completed',
            'data_source': data_source,
            'reviews_processed': len(processed_reviews),
            'responses_generated': responses_generated,
            'reviews': processed_reviews,
            'timestamp': app.now().isoformat()
        }

        logger.info(f"Task completed: {len(processed_reviews)} reviews processed, {responses_generated} responses generated")
        return results

    except Exception as exc:
        logger.error(f"Task failed with error: {exc}")

        # Retry logic
        if self.request.retries < self.max_retries:
            logger.info(f"Retrying task (attempt {self.request.retries + 1}/{self.max_retries})")
            raise self.retry(countdown=60, exc=exc)
        else:
            logger.error("Max retries reached, task failed permanently")
            return {
                'task_id': self.request.id,
                'status': 'failed',
                'error': str(exc),
                'retries': self.request.retries,
                'timestamp': app.now().isoformat()
            }

@app.task(bind=True, base=CallbackTask)
def generate_single_response(self, review_text: str, rating: int = None) -> Dict:
    """
    Generate a response for a single review

    Args:
        review_text: The review text
        rating: Optional rating (1-5)

    Returns:
        Dictionary with response data
    """
    try:
        logger.info(f"Generating response for review: {review_text[:50]}...")

        if is_openai_configured():
            message_list = create_review_response_prompt(review_text, rating)
            response = generate_response_gpt3(message_list)
            method = "openai_api"
        else:
            response = generate_mock_response_for_task(review_text)
            method = "mock_generation"

        return {
            'task_id': self.request.id,
            'status': 'completed',
            'review_text': review_text,
            'rating': rating,
            'generated_response': response,
            'method': method,
            'timestamp': app.now().isoformat()
        }

    except Exception as exc:
        logger.error(f"Failed to generate single response: {exc}")
        return {
            'task_id': self.request.id,
            'status': 'failed',
            'error': str(exc),
            'timestamp': app.now().isoformat()
        }

def generate_mock_response_for_task(review_text: str) -> str:
    """
    Generate mock response for use in Celery tasks
    """
    review_lower = review_text.lower()

    # Spanish responses
    if any(word in review_lower for word in ['excelente', 'fantástico', 'increíble']):
        return "¡Muchísimas gracias por su excelente reseña! Nos alegra saber que tuvo una experiencia tan positiva."
    elif any(word in review_lower for word in ['malo', 'terrible', 'pésimo']):
        return "Lamentamos que su experiencia no haya sido satisfactoria. Por favor contáctenos para resolver cualquier inconveniente."
    elif any(word in review_lower for word in ['bueno', 'bien', 'correcto']):
        return "Gracias por su reseña. Nos complace saber que tuvo una buena experiencia con nosotros."

    # English responses
    elif any(word in review_lower for word in ['excellent', 'amazing', 'fantastic']):
        return "Thank you so much for your excellent review! We're thrilled you had such a positive experience."
    elif any(word in review_lower for word in ['bad', 'terrible', 'awful']):
        return "We apologize for your disappointing experience. Please contact us directly so we can make this right."
    elif any(word in review_lower for word in ['good', 'nice', 'okay']):
        return "Thank you for your review. We're glad you had a good experience with us."

    # Default response
    return "Thank you for taking the time to leave a review. We truly appreciate your feedback!"

# Register tasks
app.autodiscover_tasks()
