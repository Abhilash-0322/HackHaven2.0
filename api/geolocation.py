# geolocation.py
# geolocation.py
import geocoder
import requests
from typing import Optional  # Import Optional

def get_user_location(ip_address: str = "auto") -> Optional[dict]:
    """
    Get approximate user location based on IP address.
    Returns a dict with country code and city, if available.
    """
    try:
        if ip_address == "auto":
            # Use public IP (for testing, use a real IP in production)
            response = requests.get("https://api.ipify.org?format=json")
            ip_address = response.json().get("ip")
        
        g = geocoder.ip(ip_address)
        if g.ok:
            return {
                "country_code": g.country,
                "city": g.city,
                "lat": g.lat,
                "lng": g.lng
            }
        return None
    except Exception as e:
        print(f"Error getting location: {str(e)}")
        return None