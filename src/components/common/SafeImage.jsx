import React, { useState, useEffect } from 'react';

/**
 * SafeImage Component
 * Fetches an image using the ngrok-skip-browser-warning header and displays it via a Blob URL.
 * This bypasses the persistent splash page warning on free ngrok accounts.
 */
const SafeImage = ({ src, alt, className, onClick }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Si la imagen ya es externa o no parece ser de ngrok, cargar directo
    if (!src.includes('ngrok-free.dev')) {
      setImgUrl(src);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await fetch(src, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
        setError(false);
      } catch (err) {
        console.error('Error fetching image via ngrok proxy:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup object URL
    return () => {
      if (imgUrl && imgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 animate-pulse flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !imgUrl) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-2`}>
        Error al cargar imagen
      </div>
    );
  }

  return (
    <img 
      src={imgUrl} 
      alt={alt} 
      className={className} 
      onClick={onClick}
    />
  );
};

export default SafeImage;
