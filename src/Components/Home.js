import {useEffect, useState} from "react";
import _ from "lodash";
import {Button} from "react-bootstrap";
import TrackList from "./TrackList";
import {useNavigate} from "react-router-dom";
const baseURL = "https://api.spotify.com/v1";
const axios = require('axios');
// const token = window.localStorage.getItem("token");
const Home = () => {
    const [token, setToken] = useState("");
    const [profile, setProfile] = useState({});
    const [tracks, setTracks] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        console.log("asdfads");
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token);
    }, []);
    useEffect(async ()=>{
        console.log(token);
        console.log("get profile");
        if(!token){
            return;
        }
        const profile = await getProfile();
        // setProfile(profile);
    }, [token]);

    const getProfile = async () => {
        const user = await axios.get(baseURL + "/me", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                // Accept: "application/json"
            }
        });
        console.log(user);
        setProfile(user.data);

    }

    const getTracks = async (term) => {
        const topTracksURL = baseURL + "/me/top/tracks";
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                // "Content-Type": "application/json",
            },
            params: {
                limit: 50,
                offset: 0,
                time_range: term,
            }
        };

        const tracks = await axios.get(topTracksURL, config);
        setTracks(tracks.data.items);
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token");
        navigate("/");
    }
    const createPlaylist = async (term) => {
        if(!token || !profile){
            return;
        }
        const topTracksURL = baseURL + "/me/top/tracks";
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                // "Content-Type": "application/json",
            },
            params: {
                limit: 50,
                offset: 0,
                time_range: term,
            }
        };

        const firstHalf = await axios.get(topTracksURL, config);
        config.params.offset = 50;
        const secondHalf = await axios.get(topTracksURL, config);

        const playlistURL = baseURL + `/users/${profile.id}/playlists`;
        const createdPlaylist = await axios.post(playlistURL, {

            name: `${term} favorites`,
            description: `All of your favorite songs (${term})`,
            public: false
        },{headers: {
                Authorization: `Bearer ${token}`
                // "Content-Type": "application/json",
            },});
        console.log(createdPlaylist);
        const editPlaylistURL = baseURL + `/playlists/${createdPlaylist.data.id}/tracks`;
        const tracksToAdd = [];
        console.log(firstHalf);
        console.log("flag");
        _.forEach(firstHalf.data.items, function(track){
            console.log(track)
            tracksToAdd.push(track.uri);
        });
        // _.forEach(secondHalf.data.items, function(track){
        //     console.log(track);
        //     tracksToAdd.push(track.uri);
        // });
        console.log(tracksToAdd);
        const addedItems = await axios.post(editPlaylistURL, {
            uris: tracksToAdd
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        console.log(addedItems);
    }

    return (
        <div className="card container">
            <div className="card-header">
            <Button className="m-2" onClick={logout}>Logout</Button>
            <Button disabled className="m-2" onClick={() => createPlaylist("short_term")}>Make Short term playlist </Button>
            <Button disabled className="m-2" onClick={() => createPlaylist("medium_term")}>Make Medium term playlist </Button>
            <Button disabled className="m-2" onClick={() => createPlaylist("long_term")}>Make Long Term playlist </Button>
            <Button className="m-2" onClick={() => getTracks("short_term")}> Get last month favorites </Button>
            <Button className="m-2" onClick={() => getTracks("medium_term")}> Get past 6 months favorites </Button>
            <Button className="m-2" onClick={() => getTracks("long_term")}> Get all time favorites </Button>
            </div>
            <div className="card-body">
                {tracks.length ? <TrackList tracks={tracks} token={token}/> : <div></div>}
            </div>
        </div>
    )
}

export default Home;