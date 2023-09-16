import React, { useEffect, useRef } from 'react';

const LazyVideo = ({ src, width, height }) => {
  const videoRef = useRef();

  useEffect(() => {
    const videoElement = videoRef.current;
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px', // Margin around the root
      threshold: 0.1, // When 10% of the video is visible, load it
    };

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load the video when it enters the viewport
          videoElement.load();
          observer.unobserve(videoElement); // Stop observing once loaded
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(videoElement);

    return () => {
      observer.disconnect(); // Clean up the observer when the component unmounts
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      width={width}
      height={height}
      controls
    ></video>
  );
};

export default LazyVideo;
