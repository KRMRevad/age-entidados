import React from 'react';
import './ShowcaseImage.css';

export function ShowcaseImage({ src, alt, imageClassName = '', isReversed = false, ...props }) {
    return (
        <div
            className={`showcase-image-wrapper ${isReversed ? 'reverse' : ''}`}
            {...props}
        >
            <img
                src={src}
                alt={alt}
                className={`showcase-img ${imageClassName}`.trim()}
            />
            <div className="showcase-glass-overlay"></div>
        </div>
    );
}
