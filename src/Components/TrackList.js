import Track from "./Track";
import {Table} from "react-bootstrap";
const TrackList = (props) => {
    const tracks = props.tracks;
    const token = props.token;
    console.log(tracks);
    return (
        <div>
            <Table hover striped bordered>
                <thead>
                <tr>
                    <th>
                        Album
                    </th>
                    <th> Track </th>
                    <th> Artists </th>
                </tr>
                </thead>
                <tbody>
                {tracks.map((track) => {
                        return <Track track={track} token={token} />
                    }
                )}
                {/*<Track track={tracks[0]} token={token} />*/}
                </tbody>
            </Table>
        </div>
    )
}
export default TrackList;