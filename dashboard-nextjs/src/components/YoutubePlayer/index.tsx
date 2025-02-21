'use client';
import React from 'react';
import { Box } from '@mui/material';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title = 'YouTube video player',
  autoplay = false,
  className = '',
}) => {
  // Construct the embed URL with parameters
  const baseUrl = 'https://www.youtube.com/embed/';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0', // Don't show related videos
    modestbranding: '1', // Minimal YouTube branding
  });

  const embedUrl = `${baseUrl}${videoId}?${params.toString()}`;

  return (
    <Box
      className={`youtube-player-container ${className}`}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
      />
    </Box>
  );
};

export default YouTubePlayer;
