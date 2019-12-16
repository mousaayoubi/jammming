let accessToken;

const client_id = '69c2ecfa63374d56b589ce9d524d27b1';

const redirect_uri = 'http://www.testlicious.co/';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //clear parameters if the token expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        }
    },
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        {headers: 
            {Authorization: `Bearer ${accessToken}`}
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            console.log(jsonResponse);
            return jsonResponse.tracks.items.map((track) => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        })
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        }).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            const userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then((response) => {
                return response.json();
            }).then((jsonResponse) => {
                console.log(jsonResponse);
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }
};

export default Spotify;