import React, { useEffect, useRef, useState } from 'react';

export interface UnsplashImage {
  id: string;
  urls: {
    full: string;
  };
}

export interface WaterfallProps {
  fetchImages: () => Promise<UnsplashImage[]>;
  waterfallType?: 'column' | 'flex' | 'grid' | 'js';
  columnWidth?: number;
  gapSize?: number;
  maxColumns?: number;
}

const fetchImagesFromPublic = async (): Promise<UnsplashImage[]> => {
  const imageCount = 30;
  const images: UnsplashImage[] = [];

  for (let i = 1; i <= imageCount; i++) {
    images.push({
      id: `image-${i}`,
      urls: {
        full: `/images/image${i}.jpg`, // 确保这些图片存在于 public/images/ 中
      },
    });
  }

  return images;
};

export const Waterfall = ({
  fetchImages = fetchImagesFromPublic,
  waterfallType = 'column',
  columnWidth = 200,
  gapSize = 10,
  maxColumns = 5,
}: WaterfallProps) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    getImages();
  }, [fetchImages]);

  const renderContent = () => {
    switch (waterfallType) {
      case 'column':
        return columnTypeRender(images, gapSize);
      case 'flex':
        return flexTypeRender(images, maxColumns);
      case 'grid':
        return gridTypeRender(images);
      case 'js':
        return <JsTypeRender items={images} />;
      default:
        return null;
    }
  };

  return <div className="w-full p-[10px]">{renderContent()}</div>;
};

// Column render function
const columnTypeRender = (items: UnsplashImage[], gapSize: number) => (
  <div className="grid grid-cols-1 gap-y-[10px]">
    {items.map((image) => (
      <div key={image.id} className="flex justify-center">
        <img src={image.urls.full} alt={`Image ${image.id}`} className="w-full" />
      </div>
    ))}
  </div>
);

// Flex render function
const flexTypeRender = (items: UnsplashImage[], maxColumns: number) => {
  return (
    <div className="flex flex-wrap">
      {Array(maxColumns)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={`flex flex-col`}>
            {items.map((image) => (
              <div key={image.id} className="m-1">
                <img src={image.urls.full} alt={`Image ${image.id}`} className="w-full" />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

// Grid render function
const gridTypeRender = (items: UnsplashImage[]) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((image) => (
        <div key={image.id} className="p-2">
          <img src={image.urls.full} alt={`Image ${image.id}`} className="w-full" />
        </div>
      ))}
    </div>
  );
};

// JS render function as a component
const JsTypeRender = ({ items }: { items: UnsplashImage[] }) => {
  const jsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (jsContainerRef.current) {
      // 这里假设你有一个 Waterfall 类需要实例化的方式
      const water = new Waterfall(jsContainerRef.current, { gap: 10 }); 
      water.layout();
    }
  }, [items]);

  return <div className="flex flex-wrap" ref={jsContainerRef}></div>;
};
