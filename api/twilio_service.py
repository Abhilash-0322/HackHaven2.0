# twilio_service.py
from twilio.rest import Client
import os
from typing import List

def send_emergency_notification(
    to_numbers: List[str],
    message: str,
    from_number: str = os.getenv("TWILIO_PHONE_NUMBER")
):
    """
    Send SMS or make a call to specified numbers using Twilio.
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    client = Client(account_sid, auth_token)
    
    try:
        for number in to_numbers:
            # Send SMS
            client.messages.create(
                body=message,
                from_=from_number,
                to=number
            )
            print(f"Sent SMS to {number}")
    except Exception as e:
        print(f"Error sending notification: {str(e)}")