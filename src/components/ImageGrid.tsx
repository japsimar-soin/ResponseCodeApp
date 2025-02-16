interface ImageGridProps {
    images: string[];
  }
  
  export default function ImageGrid({ images = [] }: ImageGridProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`HTTP Dog Image`}
              className="w-full h-auto rounded shadow-md"
            />
          ))
        ) : (
          <p>No images available</p> // Optional: message or fallback when no images
        )}
      </div>
    );
  }
  