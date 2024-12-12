import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg mb-4">
        <div className="relative flex items-center justify-center p-4">
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200/50 rounded-full p-2 hover:bg-gray-300/50 transition"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <img
            src={images[currentImageIndex]}
            alt={`Ảnh chi tiết ${currentImageIndex + 1}`}
            className="object-cover rounded-lg max-w-full h-[400px] w-auto h-auto"
          />

          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200/50 rounded-full p-2 hover:bg-gray-300/50 transition"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
            className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-md cursor-pointer hover:opacity-75 ${
              index === currentImageIndex
                ? "border-2 border-blue-500"
                : "border border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;