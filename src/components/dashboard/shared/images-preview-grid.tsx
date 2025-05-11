import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

import NoImage from "../../../../public/assets/images/no_image_2.png";
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";
import { Trash } from "lucide-react";

interface ImagesPreviewGridProps {
  images: {url: string}[];
  onRemove: (value: string) => void;
  colors?: { color: string}[];
  setColors: Dispatch<SetStateAction<{color: string}[]>>;
}

const ImagesPreviewGrid:FC<ImagesPreviewGridProps> = ({images, onRemove, colors, setColors}) => {
  // Get number of imageas
  let imagesLength = images.length;

  // get grid class bass in length of images
  const GridClassName = getGridClassName(imagesLength);

  // Extract colors from image
  const [colorPaletts, setColorPaletts] = useState<string[][]>([])
 
  useEffect(() => {
    const fectchColors = async () => {
      const palettes = await Promise.all(
        images.map(async (img) => {
          try {
             const colors = await getDominantColors(img.url);
             return colors
          }catch (err){
            return []
          }
        })
      )
      setColorPaletts(palettes);
    };
    if(imagesLength > 0 ){
      fectchColors();
    }
  }, [images])

  // If no images return img of NoImage placeholder
  if(imagesLength === 0){
    return <div>
      <Image 
        src={NoImage} 
        alt="" 
        width={500}
        height={600}
        className="rounded-md"
      />
    </div>
  }else{
    // If there is images will display them in a grid
    return (
      <div className="max-w-4xl">
        <div className={cn("grid h-[800px] overflow-hidden bg-white rounded-md", GridClassName)}>
          {
            images.map((img, i) => (
              <div key={i} className={cn("relative group h-full w-full border border-gray-300", `grid_${imagesLength}_image_${i + 1}`, {"h-266.66px": imagesLength === 6})}>
                <Image 
                  src={img.url}
                  alt=""
                  width={800}
                  height={800}
                  className="w-full h-full object-cover object-top"
                />
                {/* Actions */}
                <div className={cn("absolute top-0 left-0 bottom-0 right-0 hidden group-hover:flex bg-white/55 cursor-pointer items-center justify-center flex-col gap-y-3 transition-all duration-500", {
                  "!pd-[4-%]": imagesLength === 1,
                })}>
                  <button className="Btn" type="button" onClick={() => onRemove(img.url)}>
                    <div className="sign">
                      <Trash size={18} />
                    </div>
                    <div className="text">Delete</div>
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  return <div></div>
}

export default ImagesPreviewGrid;