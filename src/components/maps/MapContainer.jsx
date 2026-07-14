import React, { useEffect, useRef } from 'react';

export default function MapContainer({ center = { lat: 40.7128, lng: -74.0060 }, markers = [] }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    // Direct instantiation of standard premium web application map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: 12,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#161b26" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#161b26" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b0f19" }] }
      ],
      disableDefaultUI: true,
      zoomControl: true
    });

    markers.forEach((markerData) => {
      new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });
    });
  }, [center, markers]);

  return (
    <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
