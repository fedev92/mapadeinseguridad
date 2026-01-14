import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

const barriosFiles = import.meta.glob("./data/barrios/*.geojson", {
  eager: true,
});

function onEachBarrio(
  feature: Feature<Geometry, GeoJsonProperties>,
  layer: L.Layer
) {
  const props = feature.properties as any;
  const nombre = props?.BARRIO || props?.barrio || props?.name || "Barrio";

  layer.on({
    mouseover: () => {
      if (layer instanceof L.Path) {
        layer.bindTooltip(nombre).openTooltip();
      }
    },
    click: () => {
      console.log("Barrio clickeado:", nombre);
    },
  });
}

const styleBarrio = (): L.PathOptions => ({
  color: "#3388ff",
  weight: 1,
  fillOpacity: 0.3,
});

const barrios = Object.values(barriosFiles).map((file: any) => file.default);

const MONTEVIDEO_CENTER: [number, number] = [-34.9011, -56.1645];

function MapView() {
  return (
    <MapContainer
      center={MONTEVIDEO_CENTER}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {barrios.map((barrio, idx) => (
        <GeoJSON
          key={idx}
          data={barrio}
          style={styleBarrio}
          onEachFeature={onEachBarrio}
        />
      ))}
    </MapContainer>
  );
}

export default MapView;
