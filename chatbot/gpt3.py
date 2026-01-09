import logging
import os
from typing import List, Dict, Optional

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    from config.settings import OPENAI_API_KEY
except ImportError:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

logger = logging.getLogger(__name__)

# Configure OpenAI API if available
if OPENAI_AVAILABLE and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

def generate_response_gpt3(message_list: List[Dict[str, str]], model: str = "gpt-3.5-turbo") -> str:
    """
    Generate response using OpenAI GPT-3.5/4 for customer review responses

    Args:
        message_list: List of message dictionaries with 'role' and 'content'
        model: OpenAI model to use (default: gpt-3.5-turbo)

    Returns:
        Generated response string
    """
    if not OPENAI_AVAILABLE:
        raise ImportError("OpenAI library not available. Install openai package.")

    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API key not configured. Set OPENAI_API_KEY environment variable.")

    try:
        # System prompt for customer service responses
        system_prompt = {
            "role": "system",
            "content": (
                "You are a professional customer service representative responding to Google My Business reviews. "
                "Your responses should be:"
                "- Professional and courteous"
                "- Appreciative of customer feedback"
                "- Appropriate to the review sentiment (positive, negative, or neutral)"
                "- Brief but meaningful (2-3 sentences maximum)"
                "- Encouraging future business when appropriate"
                "- Offering to resolve issues for negative reviews"
                "- Responding in the same language as the review when possible"
            )
        }

        # Prepare messages
        messages = [system_prompt] + message_list

        # Make API call
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=0.7,  # Slightly creative but professional
            max_tokens=150,   # Keep responses concise
            top_p=0.9,
            frequency_penalty=0.2,
            presence_penalty=0.1
        )

        generated_response = response["choices"][0]["message"]["content"].strip()
        logger.info(f"Generated response using {model}: {len(generated_response)} characters")

        return generated_response

    except openai.error.AuthenticationError:
        logger.error("OpenAI authentication failed - check API key")
        raise
    except openai.error.RateLimitError:
        logger.error("OpenAI rate limit exceeded")
        raise
    except openai.error.InvalidRequestError as e:
        logger.error(f"Invalid OpenAI request: {e}")
        raise
    except Exception as e:
        logger.error(f"Error generating response with OpenAI: {e}")
        raise

def generate_code_response(message_text: str, model: str = "gpt-3.5-turbo") -> str:
    """
    Generate code-related responses using OpenAI

    Args:
        message_text: The prompt for code generation
        model: OpenAI model to use

    Returns:
        Generated code or response
    """
    if not OPENAI_AVAILABLE:
        raise ImportError("OpenAI library not available. Install openai package.")

    if not OPENAI_API_KEY:
        raise ValueError("OpenAI API key not configured.")

    try:
        # Use chat completion for code generation
        messages = [
            {
                "role": "system",
                "content": "You are a helpful programming assistant. Provide clear, concise, and working code solutions."
            },
            {
                "role": "user",
                "content": message_text
            }
        ]

        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=0.1,  # Low temperature for code generation
            max_tokens=512,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        generated_code = response["choices"][0]["message"]["content"].strip()
        logger.info(f"Generated code response: {len(generated_code)} characters")

        return generated_code

    except Exception as e:
        logger.error(f"Error generating code response: {e}")
        raise

def create_review_response_prompt(review_text: str, rating: Optional[int] = None) -> List[Dict[str, str]]:
    """
    Create a properly formatted prompt for review response generation

    Args:
        review_text: The customer review text
        rating: Star rating (1-5) if available

    Returns:
        List of message dictionaries for the API
    """
    rating_context = f" (Rating: {rating}/5 stars)" if rating else ""

    return [
        {
            "role": "user",
            "content": f"Please generate a professional response to this customer review{rating_context}:\n\n{review_text}"
        }
    ]

def is_openai_configured() -> bool:
    """
    Check if OpenAI is properly configured

    Returns:
        True if OpenAI is available and configured
    """
    return OPENAI_AVAILABLE and bool(OPENAI_API_KEY)
