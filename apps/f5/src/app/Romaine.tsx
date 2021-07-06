import React, { useEffect, useState } from 'react';
//@ts-ignore
import { RomaineExample } from 'romaine-components';

export function Romaine() {
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (blob !== null) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "image.png"); //or any other extension
      document.body.appendChild(link);
      link.click();
    }
  }, [blob]);

  return (
    <RomaineExample setBlob={setBlob} />
  );
}