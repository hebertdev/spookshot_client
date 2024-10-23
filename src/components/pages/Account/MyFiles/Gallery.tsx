"use client";

import { useEffect, useState } from "react";
import { getFilesAPI } from "services/files";

//mantine
import { FileCard } from "./FileCard";

export function Gallery() {
  const [items, setItems] = useState<any[]>([]);

  const handleGetFiles = () => {
    getFilesAPI().then((data) => {
      setItems(data);
    });
  };

  useEffect(() => {
    handleGetFiles();
  }, []);

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-3 mb-[20px]">
      {items.map((item, index) => (
        <FileCard file={item} key={index} />
      ))}
    </div>
  );
}
