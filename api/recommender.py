import pickle
import pandas as pd
from spotify_utils import get_song_album_cover_url

music = pickle.load(open("pkls/df.pkl", "rb"))
similarity = pickle.load(open("pkls/similarity.pkl", "rb"))

def get_recommendations(song):
    if song not in music['song'].values:
        raise ValueError(f"Song '{song}' not found in dataset.")

    index = music[music['song'] == song].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])

    recommendations = []
    for i in distances[1:6]:
        song_name = music.iloc[i[0]].song
        artist = music.iloc[i[0]].artist
        poster_url = get_song_album_cover_url(song_name, artist)

        recommendations.append({
            "song": song_name,
            "artist": artist,
            "poster": poster_url
        })

    return recommendations
