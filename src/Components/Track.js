import SpotifyWebPlayer from "react-spotify-web-playback";
import {useState} from "react";

const Track = (props) => {
    const track = props.track;
    const token = props.token;
    const [playing, setPlaying] = useState(false);
    const handlePlay = () => {
        setPlaying(!playing);
    }
    return (
        <tr>
            <td className="justify-content-center"> <img className="center-block img-responsive" src={track.album.images[2].url} /> </td>
            <td> {track.name}</td>
            <td> {track.artists[0].name} </td>
            <td>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" opacity={track.popularity/100} fill="green" />
                </svg>
            </td>
            <td>
                { playing ?  <div ><SpotifyWebPlayer token={token} uris={[track.uri]} /> <button onClick={handlePlay}> Stop </button> </div> :  <button onClick={handlePlay} > Play </button>  }

            </td>
        </tr>
    )
}
export default Track;