import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [-35.6751, -71.543];
const defaultZoom = 3;

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function FlyToCase({ selectedCase }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCase?.coordinates) {
      map.flyTo(selectedCase.coordinates, 6, { duration: 0.8 });
    }
  }, [map, selectedCase]);

  return null;
}

export default function App() {
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('./data/cases.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const safeCases = Array.isArray(data.cases) ? data.cases : [];
        setCases(safeCases);
        setSelectedId(safeCases[0]?.id ?? null);
        setUpdatedAt(data.updatedAt || 'n/d');
      } catch (err) {
        setError(`Errore caricamento dati: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedCase = useMemo(
    () => cases.find((item) => item.id === selectedId) || null,
    [cases, selectedId]
  );

  return (
    <div className="app-shell">
      <aside className="side-panel">
        <h1>Hantavirus Andes Live Map</h1>
        <p className="panel-subtitle">
          Dati validati esclusivamente da fonti ufficiali monitorate.
        </p>
        <p className="panel-meta">Ultimo aggiornamento: {updatedAt}</p>

        {loading && <p>Caricamento dati…</p>}
        {error && <p className="error">{error}</p>}

        <ul className="case-list">
          {cases.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={item.id === selectedId ? 'active' : ''}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.location}</span>
                <small>
                  {item.country} · {item.date}
                </small>
              </button>
            </li>
          ))}
        </ul>

        {selectedCase && (
          <section className="case-details">
            <h2>Dettagli caso</h2>
            <p>
              <strong>Località:</strong> {selectedCase.location}
            </p>
            <p>
              <strong>Paese:</strong> {selectedCase.country}
            </p>
            <p>
              <strong>Data:</strong> {selectedCase.date}
            </p>
            <p>
              <strong>Stato:</strong> {selectedCase.status}
            </p>
            <p>
              <strong>Fonte ufficiale:</strong> {selectedCase.source}
            </p>
          </section>
        )}
      </aside>

      <main className="map-panel">
        <MapContainer center={defaultCenter} zoom={defaultZoom} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cases.map((item) => (
            <Marker key={item.id} position={item.coordinates} icon={icon} />
          ))}
          <FlyToCase selectedCase={selectedCase} />
        </MapContainer>
      </main>
    </div>
  );
}
