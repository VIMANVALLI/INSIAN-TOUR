import React from "react";

export default function Home() {
  const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UKmmu2SO6bjD6Gfb-a-gCppLgQhgXRf16_WeN97UoplZfC2Rdew1A4bCnoFwj9yQVLcz6iUCI-WxTEF7nzq5nzOiSlRn_G50Ol99PNOurg&s=10";

  return (
    <div style={container}>
      <img
        src={imageUrl}
        alt="Home hero"
        style={heroImage}
      />
    </div>
  );
}

const container = {
  width: "100%",
  height: "100%",
  minHeight: "calc(100vh - 60px)",  // adjust if you have header height
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
  overflow: "hidden",
};

const heroImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
};
