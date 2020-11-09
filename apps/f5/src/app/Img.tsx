import React from 'react';

interface ImgProps {
  title: string;
  alt: string;
  src: string;
}

export const Img = (props: ImgProps) => {
  const { src, alt, title} = props;
  return (
    <a href={src}>
      <img
        src={src}
        style={{ width: '100%' }}
        title={title}
        alt={alt}
      /> 
    </a>
  );
}