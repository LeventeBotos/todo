import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
   name: "Todo - Levente Botos",
  short_name: "Todo",
  background_color: "#1f1f1f",
  theme_color: "#1f1f1f",
  display: "fullscreen",
  scope: "/",
  start_url: "/",
  icons: [
    {
      "src": "/logo.png",
      "type": "image/png",
      "sizes": "328x328"
    }
  ]}
}