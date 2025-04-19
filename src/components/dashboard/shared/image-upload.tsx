import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
  disabled? : boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  type,
  dontShowPreview
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[])

  if(!isMounted){
    return null;
  }

  if (type === "profile") {
    return (
      <div className="relative rounded-full w-52 h-52 inset-x-96 bg-gray-200 border-2 border-white shadow-2xl">
        {
          value.length>0 && (<Image src={value[0]} alt="" width={300} height={300} className="w-52 h-52 rounded-full object-cover absolute top-0 left-0 bottom-0 right-0"/>)
        }
        <CldUploadWidget></CldUploadWidget>
      </div>
    )
  } else {
    <div></div>
  }

}