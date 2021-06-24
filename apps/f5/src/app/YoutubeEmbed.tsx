import React from 'react';
 
export const YoutubeEmbed = (props) => {
  return (
  <div className="video-responsive">
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${props.embedId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture"
      allowFullScreen></iframe>
  </div>
)};