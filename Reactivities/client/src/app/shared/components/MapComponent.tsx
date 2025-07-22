import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

type Props = {
    position: [number, number],
    venue: string
}

/**
 * `MapComponent` renders an interactive map with a marker and popup using `react-leaflet`.
 *
 * @param position - Coordinates `[latitude, longitude]` to center the map and place a marker.
 * @param venue - The label text that appears inside the popup when clicking the marker.
 *
 * Features:
 * - Uses OpenStreetMap tiles.
 * - Disables scroll-wheel zoom for a fixed zoom level.
 * - Automatically fills its parent container’s height.
 *
 * Usage example:
 * ```tsx
 * <MapComponent position={[40.7128, -74.0060]} venue="New York City" />
 * ```
 */
export default function MapComponent({position, venue}: Props) {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '100%'}}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        {venue}
      </Popup>
    </Marker>
  </MapContainer>
  )
}