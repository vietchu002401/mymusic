import React from 'react';

const Video = (props) => {
    return (
        <iframe className="detail__video" src={"https://www.youtube.com/embed/" + props.code} title="YouTube video player" frameBorder="2px" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    );
};

export default Video;