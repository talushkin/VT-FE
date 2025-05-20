import { useState, useEffect } from 'react';
const VideoCarousel = () => {

    const video = 'https://villatracker.com/wp-content/uploads/2024/09/Villa-Tracker.mp4';


    return(
        <div className="vid-car-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    marginTop: '-55px',
                    width: '100%',
                    objectFit: 'cover',
                    opacity: 1,
                    transition: 'opacity 0.5s ease-in-out'
                }}
            >
                <source src={video} type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoCarousel;
