import webbrowser
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

CLIENT_ID = '445f4d10566043b897cafc061a2609a6'
CLIENT_SECRET = '54e1eba9297a45d59a04f01108b589e1'

client_credentials_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def get_song_album_cover_url(song_name, artist_name):
    search_query = f"track:{song_name} artist:{artist_name}"
    results = sp.search(q=search_query, type="track")

    if results and results['tracks']['items']:
        track = results['tracks']['items'][0]
        album_cover_url = track['album']['images'][0]['url']
        return album_cover_url
    else:
        return "https://i.postimg.cc/0QNxYz4V/social.png"  # Default fallback

def play_song_on_spotify(song_name, artist_name):
    search_query = f"track:{song_name} artist:{artist_name}"
    results = sp.search(q=search_query, type="track")

    if results and results['tracks']['items']:
        song_uri = results['tracks']['items'][0]['uri']
        spotify_url = f"https://open.spotify.com/track/{song_uri.split(':')[-1]}"
        webbrowser.open(spotify_url, new=2)
        return {"spotify_url": spotify_url}
    else:
        raise ValueError(f"Song '{song_name}' by '{artist_name}' not found on Spotify.")