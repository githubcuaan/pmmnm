'use client';
import vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import { useState, useEffect, useRef } from 'react';

export default function Maps() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<vietmapgl.Map | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !mapContainerRef.current || map) return;

        const apiKey = process.env.NEXT_PUBLIC_VIETMAP_API_KEY || '';

        const mapInstance = new vietmapgl.Map({
            container: mapContainerRef.current,
            style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apiKey}`,
            center: [106.7, 10.8], // Ho Chi Minh City coordinates
            zoom: 12,
            transformRequest: (url: string) => {
                if (url.includes('vietmap.vn')) {
                    return {
                        url: url.includes('?') ? `${url}&apikey=${apiKey}` : `${url}?apikey=${apiKey}`
                    };
                }
                return { url };
            }
        });

        mapInstance.addControl(new vietmapgl.NavigationControl(), 'top-right');
        mapInstance.addControl(new vietmapgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }
        ))

        mapInstance.on('load', () => {
            setMap(mapInstance);
        });

        return () => {
            mapInstance.remove();
        };
    }, [isMounted]);

    if (!isMounted) {
        return <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0' }} />;
    }

    return (
        <div id="map" ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />
    );
}