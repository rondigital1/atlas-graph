"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PlanActivityViewModel, PlanDayViewModel } from "../../../lib/types";

interface MapActivity {
  title: string;
  description: string;
  lat: number;
  lng: number;
  timeSlot: "morning" | "afternoon" | "evening";
  index: number;
}

interface Props {
  days: PlanDayViewModel[];
}

const TIME_SLOT_COLORS: Record<string, string> = {
  morning: "#eab308",
  afternoon: "#2dd4bf",
  evening: "#71717a",
};

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function extractActivities(
  day: PlanDayViewModel
): MapActivity[] {
  const activities: MapActivity[] = [];
  let index = 0;

  const addSlot = (
    items: PlanActivityViewModel[],
    timeSlot: "morning" | "afternoon" | "evening"
  ) => {
    for (const item of items) {
      if (item.lat !== undefined && item.lng !== undefined) {
        activities.push({
          title: item.title,
          description: item.description,
          lat: item.lat,
          lng: item.lng,
          timeSlot,
          index: ++index,
        });
      }
    }
  };

  addSlot(day.morning, "morning");
  addSlot(day.afternoon, "afternoon");
  addSlot(day.evening, "evening");

  return activities;
}

function MarkerPin({
  activity,
  isSelected,
  onClick,
}: {
  activity: MapActivity;
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = TIME_SLOT_COLORS[activity.timeSlot] ?? "#2dd4bf";

  return (
    <AdvancedMarker
      position={{ lat: activity.lat, lng: activity.lng }}
      title={activity.title}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 shadow-lg transition-transform"
          style={{
            backgroundColor: isSelected ? color : "#0f0f12",
            border: `2px solid ${color}`,
            transform: isSelected ? "scale(1.1)" : "scale(1)",
          }}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: isSelected ? "#0f0f12" : color,
              color: isSelected ? color : "#0f0f12",
            }}
          >
            {activity.index}
          </span>
          <span
            className="max-w-[120px] truncate text-xs font-medium"
            style={{ color: isSelected ? "#0f0f12" : "#fafafa" }}
          >
            {activity.title}
          </span>
        </div>
        <div
          className="h-2 w-2 rotate-45 -translate-y-1"
          style={{
            backgroundColor: isSelected ? color : "#0f0f12",
            borderRight: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`,
          }}
        />
      </div>
    </AdvancedMarker>
  );
}

function RouteRenderer({ activities }: { activities: MapActivity[] }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map || !routesLibrary || activities.length < 2) {
      if (rendererRef.current) {
        rendererRef.current.setMap(null);
        rendererRef.current = null;
      }
      return;
    }

    const directionsService = new routesLibrary.DirectionsService();
    const directionsRenderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#2dd4bf",
        strokeWeight: 3,
        strokeOpacity: 0.7,
      },
    });

    rendererRef.current = directionsRenderer;

    const origin = { lat: activities[0]!.lat, lng: activities[0]!.lng };
    const destination = {
      lat: activities[activities.length - 1]!.lat,
      lng: activities[activities.length - 1]!.lng,
    };
    const waypoints = activities.slice(1, -1).map((a) => ({
      location: { lat: a.lat, lng: a.lng },
      stopover: true,
    }));

    directionsService
      .route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: false,
      })
      .then((result) => {
        if (directionsRenderer.getMap()) {
          directionsRenderer.setDirections(result);
        }
      })
      .catch(() => {
        // Silently handle directions errors — markers still show
      });

    return () => {
      directionsRenderer.setMap(null);
      rendererRef.current = null;
    };
  }, [map, routesLibrary, activities]);

  return null;
}

function FitBounds({ activities }: { activities: MapActivity[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || activities.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    for (const a of activities) {
      bounds.extend({ lat: a.lat, lng: a.lng });
    }

    if (activities.length === 1) {
      map.setCenter({ lat: activities[0]!.lat, lng: activities[0]!.lng });
      map.setZoom(15);
    } else {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, activities]);

  return null;
}

function MapContent({
  days,
  selectedDayId,
  onDayChange,
  selectedActivity,
  onActivitySelect,
}: {
  days: PlanDayViewModel[];
  selectedDayId: string;
  onDayChange: (id: string) => void;
  selectedActivity: number | null;
  onActivitySelect: (index: number | null) => void;
}) {
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? days[0];
  const activities = useMemo(
    () => (selectedDay ? extractActivities(selectedDay) : []),
    [selectedDay]
  );

  const defaultCenter = useMemo(() => {
    if (activities.length > 0) {
      return { lat: activities[0]!.lat, lng: activities[0]!.lng };
    }
    return { lat: 0, lng: 0 };
  }, [activities]);

  const handleMarkerClick = useCallback((index: number) => {
    onActivitySelect(selectedActivity === index ? null : index);
  }, [onActivitySelect, selectedActivity]);

  if (activities.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border-muted bg-surface p-6">
        <p className="text-sm text-muted-foreground">
          No location data available for this day.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border-muted bg-surface">
      {/* Day selector tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border-muted px-2 py-1.5">
        {days.map((day) => {
          const isActive = day.id === selectedDayId;
          const dayActivities = extractActivities(day);
          const hasLocations = dayActivities.length > 0;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onDayChange(day.id)}
              disabled={!hasLocations}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : hasLocations
                    ? "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                    : "cursor-not-allowed text-subtle opacity-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  isActive
                    ? "bg-primary-foreground text-primary"
                    : "bg-muted text-foreground"
                }`}
              >
                {day.dayNumber}
              </span>
              <span className="hidden sm:inline">{day.theme}</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={13}
          mapId="atlas-graph-trip-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          style={{ width: "100%", height: "100%" }}
          colorScheme="DARK"
        >
          <FitBounds activities={activities} />
          <RouteRenderer activities={activities} />
          {activities.map((activity) => (
            <MarkerPin
              key={`${activity.timeSlot}-${activity.index}`}
              activity={activity}
              isSelected={selectedActivity === activity.index}
              onClick={() => handleMarkerClick(activity.index)}
            />
          ))}
        </Map>

        {/* Activity detail card */}
        {selectedActivity !== null && (
          <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-auto sm:max-w-xs">
            {activities
              .filter((a) => a.index === selectedActivity)
              .map((activity) => (
                <div
                  key={activity.index}
                  className="rounded-lg border border-border bg-surface p-3 shadow-lg"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: TIME_SLOT_COLORS[activity.timeSlot],
                        color: "#0f0f12",
                      }}
                    >
                      {activity.index}
                    </span>
                    <span
                      className="text-[10px] font-medium uppercase tracking-wide"
                      style={{ color: TIME_SLOT_COLORS[activity.timeSlot] }}
                    >
                      {TIME_SLOT_LABELS[activity.timeSlot]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-border-muted px-3 py-2">
        {Object.entries(TIME_SLOT_LABELS).map(([slot, label]) => (
          <div key={slot} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: TIME_SLOT_COLORS[slot] }}
            />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanDayMap({ days }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedDayId, setSelectedDayId] = useState(days[0]?.id ?? "");
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  const handleDayChange = useCallback((id: string) => {
    setSelectedDayId(id);
    setSelectedActivity(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border-muted bg-surface p-6">
        <div className="text-center">
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto mb-2 text-muted-foreground"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] lg:h-[600px]">
      <APIProvider apiKey={apiKey}>
        <MapContent
          days={days}
          selectedDayId={selectedDayId}
          onDayChange={handleDayChange}
          selectedActivity={selectedActivity}
          onActivitySelect={setSelectedActivity}
        />
      </APIProvider>
    </div>
  );
}
