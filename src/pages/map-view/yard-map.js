import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import containerImage from "../../assets/images/containerImage4.png";
import { dummyContainers } from "./dummyContainer";

// const dummyContainers = [
//     { id: 1, name: "Container 1", details: "Details for Container 1", latitude: 18.9585, longitude: 77.7915, height: 0 },
//     { id: 2, name: "Container 2", details: "Details for Container 2", latitude: 18.9585, longitude: 77.7915, height: 10 },
//     { id: 3, name: "Container 3", details: "Details for Container 3", latitude: 18.9585, longitude: 77.7915, height: 20 },
//     { id: 4, name: "Container 4", details: "Details for Container 4", latitude: 18.9575, longitude: 77.7918, height: 0 },
//     { id: 5, name: "Container 5", details: "Details for Container 5", latitude: 18.9575, longitude: 77.7918, height: 10 },
//     { id: 6, name: "Container 6", details: "Details for Container 6", latitude: 18.9568, longitude: 77.7921, height: 0 },
//     { id: 7, name: "Container 7", details: "Details for Container 7", latitude: 18.9615, longitude: 77.7925, height: 0 },
//     { id: 8, name: "Container 8", details: "Details for Container 8", latitude: 18.9571, longitude: 77.7913, height: 0 },
//     { id: 9, name: "Container 9", details: "Details for Container 9", latitude: 18.9571, longitude: 77.7913, height: 10 },
//     { id: 10, name: "Container 10", details: "Details for Container 10", latitude: 18.9578, longitude: 77.7928, height: 0 },
//     { id: 11, name: "Container 11", details: "Details for Container 11", latitude: 18.9603, longitude: 77.7932, height: 0 },
//     { id: 12, name: "Container 12", details: "Details for Container 12", latitude: 18.9612, longitude: 77.7930, height: 0 },
//     { id: 13, name: "Container 13", details: "Details for Container 13", latitude: 18.9588, longitude: 77.7933, height: 0 },
//     { id: 14, name: "Container 14", details: "Details for Container 14", latitude: 18.9594, longitude: 77.7914, height: 0 },
//     { id: 15, name: "Container 15", details: "Details for Container 15", latitude: 18.9594, longitude: 77.7914, height: 10 },
//     { id: 16, name: "Container 16", details: "Details for Container 16", latitude: 18.9592, longitude: 77.7916, height: 0 },
//     { id: 17, name: "Container 17", details: "Details for Container 17", latitude: 18.9614, longitude: 77.7910, height: 0 },
//     { id: 18, name: "Container 18", details: "Details for Container 18", latitude: 18.9614, longitude: 77.7910, height: 10 },
//     { id: 19, name: "Container 19", details: "Details for Container 19", latitude: 18.9582, longitude: 77.7924, height: 0 },
//     { id: 20, name: "Container 20", details: "Details for Container 20", latitude: 18.9610, longitude: 77.7926, height: 0 },
//     { id: 21, name: "Container 21", details: "Details for Container 21", latitude: 18.9610, longitude: 77.7926, height: 10 },
//     { id: 22, name: "Container 22", details: "Details for Container 22", latitude: 18.9583, longitude: 77.7911, height: 0 },
//     { id: 23, name: "Container 23", details: "Details for Container 23", latitude: 18.9609, longitude: 77.7928, height: 0 },
//     { id: 24, name: "Container 24", details: "Details for Container 24", latitude: 18.9609, longitude: 77.7928, height: 10 },
//     { id: 25, name: "Container 25", details: "Details for Container 25", latitude: 18.9605, longitude: 77.7921, height: 0 },
//     { id: 26, name: "Container 26", details: "Details for Container 26", latitude: 18.9608, longitude: 77.7924, height: 0 },
//     { id: 27, name: "Container 27", details: "Details for Container 27", latitude: 18.9564, longitude: 77.7920, height: 0 },
//     { id: 28, name: "Container 28", details: "Details for Container 28", latitude: 18.9616, longitude: 77.7929, height: 0 },
//     { id: 29, name: "Container 29", details: "Details for Container 29", latitude: 18.9616, longitude: 77.7929, height: 10 },
//     { id: 30, name: "Container 30", details: "Details for Container 30", latitude: 18.9586, longitude: 77.7919, height: 0 },
//     { id: 31, name: "Container 31", details: "Details for Container 31", latitude: 18.9597, longitude: 77.7922, height: 0 },
//     { id: 32, name: "Container 32", details: "Details for Container 32", latitude: 18.9597, longitude: 77.7922, height: 10 },
//     { id: 33, name: "Container 33", details: "Details for Container 33", latitude: 18.9611, longitude: 77.7931, height: 0 },
//     { id: 34, name: "Container 34", details: "Details for Container 34", latitude: 18.9584, longitude: 77.7918, height: 0 },
//     { id: 35, name: "Container 35", details: "Details for Container 35", latitude: 18.9600, longitude: 77.7933, height: 0 },
//     { id: 36, name: "Container 36", details: "Details for Container 36", latitude: 18.9593, longitude: 77.7925, height: 0 },
//     { id: 37, name: "Container 37", details: "Details for Container 37", latitude: 18.9593, longitude: 77.7925, height: 10 },
//     { id: 38, name: "Container 38", details: "Details for Container 38", latitude: 18.9595, longitude: 77.7910, height: 0 },
//     { id: 39, name: "Container 39", details: "Details for Container 39", latitude: 18.9604, longitude: 77.7923, height: 0 },
//     { id: 40, name: "Container 40", details: "Details for Container 40", latitude: 18.9572, longitude: 77.7910, height: 0 },
//     { id: 41, name: "Container 41", details: "Details for Container 41", latitude: 18.9603, longitude: 77.7928, height: 0 },
//     { id: 42, name: "Container 42", details: "Details for Container 42", latitude: 18.9577, longitude: 77.7919, height: 0 },
//     { id: 43, name: "Container 43", details: "Details for Container 43", latitude: 18.9599, longitude: 77.7932, height: 0 },
//     { id: 44, name: "Container 44", details: "Details for Container 44", latitude: 18.9600, longitude: 77.7920, height: 0 },
//     { id: 45, name: "Container 45", details: "Details for Container 45", latitude: 18.9600, longitude: 77.7920, height: 10 },
//     { id: 46, name: "Container 46", details: "Details for Container 46", latitude: 18.9601, longitude: 77.7933, height: 0 },
//     { id: 47, name: "Container 47", details: "Details for Container 47", latitude: 18.9590, longitude: 77.7911, height: 0 },
//     { id: 48, name: "Container 48", details: "Details for Container 48", latitude: 18.9590, longitude: 77.7911, height: 10 },
//     { id: 49, name: "Container 49", details: "Details for Container 49", latitude: 18.9590, longitude: 77.7911, height: 20 },
//     { id: 50, name: "Container 50", details: "Details for Container 50", latitude: 18.9595, longitude: 77.7920, height: 0 },
//     { id: 51, name: "Container 51", details: "Details for Container 51", latitude: 18.9614, longitude: 77.7918, height: 0 },
//     { id: 52, name: "Container 52", details: "Details for Container 52", latitude: 18.9609, longitude: 77.7911, height: 0 },
//     { id: 53, name: "Container 53", details: "Details for Container 53", latitude: 18.9603, longitude: 77.7926, height: 0 },
//     { id: 54, name: "Container 54", details: "Details for Container 54", latitude: 18.9603, longitude: 77.7926, height: 10 },
//     { id: 55, name: "Container 55", details: "Details for Container 55", latitude: 18.9606, longitude: 77.7916, height: 0 },
//     { id: 56, name: "Container 56", details: "Details for Container 56", latitude: 18.9607, longitude: 77.7919, height: 0 },
//     { id: 57, name: "Container 57", details: "Details for Container 57", latitude: 18.9593, longitude: 77.7917, height: 0 },
//     { id: 58, name: "Container 58", details: "Details for Container 58", latitude: 18.9589, longitude: 77.7929, height: 0 },
//     { id: 59, name: "Container 59", details: "Details for Container 59", latitude: 18.9602, longitude: 77.7927, height: 0 },
//     { id: 60, name: "Container 60", details: "Details for Container 60", latitude: 18.9602, longitude: 77.7927, height: 10 },
//     { id: 61, name: "Container 61", details: "Details for Container 61", latitude: 18.9604, longitude: 77.7914, height: 0 },
//     { id: 62, name: "Container 62", details: "Details for Container 62", latitude: 18.9617, longitude: 77.7918, height: 0 },
//     { id: 63, name: "Container 63", details: "Details for Container 63", latitude: 18.9609, longitude: 77.7912, height: 0 },
//     { id: 64, name: "Container 64", details: "Details for Container 64", latitude: 18.9609, longitude: 77.7912, height: 10 },
//     { id: 65, name: "Container 65", details: "Details for Container 65", latitude: 18.9603, longitude: 77.7910, height: 0 },
//     { id: 66, name: "Container 66", details: "Details for Container 66", latitude: 18.9612, longitude: 77.7924, height: 0 },
//     { id: 67, name: "Container 67", details: "Details for Container 67", latitude: 18.9610, longitude: 77.7922, height: 0 },
//     { id: 68, name: "Container 68", details: "Details for Container 68", latitude: 18.9615, longitude: 77.7915, height: 0 },
//     { id: 69, name: "Container 69", details: "Details for Container 69", latitude: 18.9576, longitude: 77.7928, height: 0 },
//     { id: 70, name: "Container 70", details: "Details for Container 70", latitude: 18.9570, longitude: 77.7924, height: 0 },
//     { id: 71, name: "Container 71", details: "Details for Container 71", latitude: 18.9596, longitude: 77.7920, height: 0 },
//     { id: 72, name: "Container 72", details: "Details for Container 72", latitude: 18.9584, longitude: 77.7912, height: 0 },
//     { id: 73, name: "Container 73", details: "Details for Container 73", latitude: 18.9584, longitude: 77.7912, height: 10 },
//     { id: 74, name: "Container 74", details: "Details for Container 74", latitude: 18.9575, longitude: 77.7926, height: 0 },
//     { id: 75, name: "Container 75", details: "Details for Container 75", latitude: 18.9613, longitude: 77.7914, height: 0 },
//     { id: 76, name: "Container 76", details: "Details for Container 76", latitude: 18.9606, longitude: 77.7913, height: 0 },
//     { id: 77, name: "Container 77", details: "Details for Container 77", latitude: 18.9597, longitude: 77.7918, height: 0 },
//     { id: 78, name: "Container 78", details: "Details for Container 78", latitude: 18.9602, longitude: 77.7912, height: 0 },
//     { id: 79, name: "Container 79", details: "Details for Container 79", latitude: 18.9611, longitude: 77.7921, height: 0 },
//     { id: 80, name: "Container 80", details: "Details for Container 80", latitude: 18.9611, longitude: 77.7921, height: 10 },
//     { id: 81, name: "Container 81", details: "Details for Container 81", latitude: 18.9608, longitude: 77.7922, height: 0 },
//     { id: 82, name: "Container 82", details: "Details for Container 82", latitude: 18.9590, longitude: 77.7914, height: 0 },
//     { id: 83, name: "Container 83", details: "Details for Container 83", latitude: 18.9607, longitude: 77.7927, height: 0 },
//     { id: 84, name: "Container 84", details: "Details for Container 84", latitude: 18.9600, longitude: 77.7920, height: 0 },
//     { id: 85, name: "Container 85", details: "Details for Container 85", latitude: 18.9610, longitude: 77.7915, height: 0 },
//     { id: 86, name: "Container 86", details: "Details for Container 86", latitude: 18.9610, longitude: 77.7915, height: 10 },
//     { id: 87, name: "Container 87", details: "Details for Container 87", latitude: 18.9604, longitude: 77.7920, height: 0 },
//     { id: 88, name: "Container 88", details: "Details for Container 88", latitude: 18.9579, longitude: 77.7922, height: 0 },
//     { id: 89, name: "Container 89", details: "Details for Container 89", latitude: 18.9616, longitude: 77.7916, height: 0 },
//     { id: 90, name: "Container 90", details: "Details for Container 90", latitude: 18.9606, longitude: 77.7923, height: 0 },
//     { id: 91, name: "Container 91", details: "Details for Container 91", latitude: 18.9606, longitude: 77.7923, height: 10 },
//     { id: 92, name: "Container 92", details: "Details for Container 92", latitude: 18.9613, longitude: 77.7924, height: 0 },
//     { id: 93, name: "Container 93", details: "Details for Container 93", latitude: 18.9600, longitude: 77.7913, height: 0 },
//     { id: 94, name: "Container 94", details: "Details for Container 94", latitude: 18.9612, longitude: 77.7915, height: 0 },
//     { id: 95, name: "Container 95", details: "Details for Container 95", latitude: 18.9611, longitude: 77.7921, height: 0 },
//     { id: 96, name: "Container 96", details: "Details for Container 96", latitude: 18.9611, longitude: 77.7921, height: 10 },
//     { id: 97, name: "Container 97", details: "Details for Container 97", latitude: 18.9607, longitude: 77.7916, height: 0 },
//     { id: 98, name: "Container 98", details: "Details for Container 98", latitude: 18.9570, longitude: 77.7917, height: 0 },
//     { id: 99, name: "Container 99", details: "Details for Container 99", latitude: 18.9595, longitude: 77.7910, height: 10 },
//     { id: 100, name: "Container 100", details: "Details for Container 100", latitude: 18.9602, longitude: 77.7915, height: 0 }
// ];


export const YardMapViewSec = ({ isToggled }) => {
    const [containers, setContainers] = useState(dummyContainers);
    const [newContainer, setNewContainer] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state
    const mapContainerRef = useRef(null); // Reference to map container 

    // Custom icon for the container marker
    const containerIcon = new Icon({
        iconUrl: "https://cdn.iconscout.com/icon/free/png-512/free-container-icon-download-in-svg-png-gif-file-formats--cargo-freight-delivery-logistic-logistics-pack-e-commerce-shopping-icons-1226015.png?f=webp&w=256",
        iconSize: [35, 25],
    });

    // Handle map click to add a new container
    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setNewContainer({ latitude: lat, longitude: lng, height: 0 }); // Set height to 0 initially for new container
    };

    // Fullscreen toggle handler
    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen(); // Exit fullscreen if currently in fullscreen mode
        } else {
            if (mapContainerRef.current) {
                mapContainerRef.current.requestFullscreen(); // Request fullscreen
            }
        }
        setIsFullscreen(!isFullscreen); // Toggle fullscreen state
    };

    // Define the farm boundary
    const farmSouthWestLat = 18.95700; // Move up (increase latitude)
    const farmSouthWestLng = 77.79300; // Move right (increase longitude)
    const farmNorthEastLat = 18.96100; // Move down (decrease latitude)
    const farmNorthEastLng = 77.79350; // Move left (decrease longitude)

    // Boundary coordinates for polygon
    const boundaryCoordinates = [
        [18.95600, 77.79000], [18.95600, 77.79700], [18.96200, 77.79700],
        [18.96200, 77.79000], [18.95600, 77.79000],
    ];

    // Entry and Exit Gate coordinates
    const entryGate = { latitude: 18.9559, longitude: 77.7887 };
    const exitGate = { latitude: 18.9610, longitude: 77.7925 };

    // Center of the map
    const centerLat = (farmSouthWestLat + farmNorthEastLat) / 2;
    const centerLng = (farmSouthWestLng + farmNorthEastLng) / 2;

    return (
        // <>
        //     {/* Apply this to the body to prevent overflow */}
        //     <style>
        //         {`
        //             body {
        //                 overflow-x: hidden; /* Prevent horizontal scroll */
        //             }
        //         `}
        //     </style>
        <React.Fragment>
        <div
          className={
            isToggled
              ? "inner-content p-3 expand-inner-content"
              : "inner-content p-3"
          }
        >

            <div
                className="map-container"
                ref={mapContainerRef}
                style={{
                    border: "5px solid black",
                    height: "85vh", // Fullscreen height
                    position: "relative",
                    // left: isToggled ? "150px" : "300px",
                    transition: "width 0.3s ease", // Smooth transition when toggling sidebar
                    // width: isToggled ? "calc(105% - 250px)" : "80%", // Adjust dynamically for sidebar toggle
                    zIndex: 1, // Ensure map is below other UI elements
                    overflowX: "hidden", // Prevent horizontal overflow in the map container
                }}
            >
                <button
                    onClick={toggleFullscreen}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        padding: "10px 20px",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                </button>

                <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={17}
                    style={{ width: "100%", height: "100%" }} // Ensures the TileLayer stays inside the MapContainer bounds
                    onClick={handleMapClick}
                    bounds={new LatLngBounds([farmSouthWestLat, farmSouthWestLng], [farmNorthEastLat, farmNorthEastLng])}
                    maxBounds={new LatLngBounds([farmSouthWestLat, farmSouthWestLng], [farmNorthEastLat, farmNorthEastLng])}
                    maxBoundsViscosity={1.0}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    dragging={true}
                >
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                    {/* Boundary Polygon */}
                    <Polygon positions={boundaryCoordinates} color="lightblue" weight={3} opacity={0.7} fillOpacity={0.2} />

                    {/* Entry and Exit Gate Markers */}
                    {/* <Marker position={[entryGate.latitude, entryGate.longitude]} icon={new Icon({ iconUrl: "entry-icon-url", iconSize: [120, 40] })}>
                        <Popup>
                            <h4>Entry Gate</h4>
                            <p>Welcome to the Yard!</p>
                        </Popup>
                    </Marker>

                    <Marker position={[exitGate.latitude, exitGate.longitude]} icon={new Icon({ iconUrl: "exit-icon-url", iconSize: [40, 40] })}>
                        <Popup>
                            <h4>Exit Gate</h4>
                            <p>Thank you for visiting the Yard!</p>
                        </Popup>
                    </Marker> */}

                    {/* Render container markers */}
                    {containers.map(container => (
                        <Marker
                            key={container.id}
                            position={[container.latitude, container.longitude]}
                            icon={new Icon({
                                iconUrl: containerImage,
                                iconSize: [40, 35],
                                iconAnchor: [18, 45 + container.height],
                            })}
                            zIndexOffset={container.height}
                        >
                            <Popup>
                                <h4>{container.name}</h4>
                                <p>{container.details}</p>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Render new container */}
                    {newContainer && (
                        <Marker
                            position={[newContainer.latitude, newContainer.longitude]}
                            icon={containerIcon}
                            zIndexOffset={newContainer.height}
                        >
                            <Popup>
                                <h4>New Container</h4>
                                <p>Latitude: {newContainer.latitude}</p>
                                <p>Longitude: {newContainer.longitude}</p>
                                <button onClick={() => setNewContainer(null)}>Cancel</button>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
        </React.Fragment>
    );
};
