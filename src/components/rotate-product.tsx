import React, { useState } from 'react';

const ProductShowcase = () => {
  const [rotateX, setRotateX] = useState(20);
  const [rotateY, setRotateY] = useState(-20);
  const [backgroundColor, setBackgroundColor] = useState('#2866EC');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert position to rotation angles
    const rotX = ((y / rect.height) * 40) - 20;
    const rotY = ((x / rect.width) * 40) - 20;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const colors = [
    '#4f46e5', // Indigo
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f97316', // Orange
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* <div className="mb-6 flex gap-2 justify-center">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            onClick={() => setBackgroundColor(color)}
          />
        ))}
      </div> */}

      <div 
        className="aspect-[9/18] w-[480px] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setRotateX(20);
          setRotateY(-20);
        }}
        style={{
          background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}90)`,
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <div className="w-full h-full p-12">
          <div className="w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
            <img
              src="/images/hero.png"
              alt="Product Screenshot"
              className="w-full h-full object-fit"
            />
          </div>
        </div>
      </div>

      <p className="text-center mt-6 text-gray-600">
        移动鼠标来旋转展示框，点击上方的颜色按钮来改变背景
      </p>
    </div>
  );
};

export default ProductShowcase;