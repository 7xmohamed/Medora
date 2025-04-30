import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEvents({ onLocationSelect }) {
    const map = useMapEvents({
        click: async (e) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
                );
                const data = await response.json();
                const location = {
                    ...e.latlng,
                    country: data.address.country,
                    city: data.address.city || data.address.town,
                    street: data.address.road,
                    countryCode: data.address.country_code
                };
                onLocationSelect(location);
            } catch (error) {
                console.error('Error getting location details:', error);
                onLocationSelect(e.latlng);
            }
        },
    });

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);

    return null;
}

export default function LocationSelector({ isOpen, onClose, onLocationSelect }) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [mapKey, setMapKey] = useState(0); // Add key to force re-render

    useEffect(() => {
        if (isOpen) {
            setMapKey(prev => prev + 1); // Force map re-render when opened
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
        }
    };

    if (!isOpen) return null;

    const FEZ_COORDINATES = [34.0333, -5.0000]; // Default location to open on !

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Select Your Location</h2>
                <div className="h-[60vh] rounded-lg overflow-hidden mb-6 border border-gray-200">
                    <MapContainer
                        key={mapKey}
                        center={FEZ_COORDINATES}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={(map) => {
                            setTimeout(() => map.invalidateSize(), 100);
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {selectedLocation && (
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                        )}
                        <MapEvents onLocationSelect={setSelectedLocation} />
                    </MapContainer>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedLocation}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white disabled:opacity-50 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-md"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}