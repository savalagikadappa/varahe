import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { Card } from '../common/Card';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';

// TopoJSON for India (State-level)
const INDIA_TOPO_JSON = '/india.json';

const PROJECTION_CONFIG = {
    scale: 1000,
    center: [78.9629, 22.5937]
};

export const IndiaMap = ({ query, dataOverride }) => {
    const { data, isLoading, isError, refetch } = query;
    const dataset = dataOverride && dataOverride.length ? dataOverride : data;

    const normalizedData = useMemo(() => {
        if (!dataset) return [];

        const toTurnoutNumber = (value) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        };

        return dataset
            .map((entry) => {
                const turnoutValue =
                    toTurnoutNumber(entry.turnout) ??
                    toTurnoutNumber(entry.avg_turnout) ??
                    toTurnoutNumber(entry.turnout_percentage) ??
                    toTurnoutNumber(entry.turnoutPercent) ??
                    toTurnoutNumber(entry.turnoutPercentage);

                const stateName =
                    entry.state ||
                    entry.State_Name ||
                    entry.state_name ||
                    entry.STATE_NAME ||
                    entry.stateName;

                if (!stateName || turnoutValue === null) {
                    return null;
                }

                return {
                    state: stateName,
                    turnout: turnoutValue
                };
            })
            .filter(Boolean);
    }, [dataset]);

    const colorScale = useMemo(() => {
        if (!normalizedData.length) return () => '#EEE';

        return scaleQuantile()
            .domain(normalizedData.map(d => d.turnout))
            .range([
                '#ffedea',
                '#ffcec5',
                '#ffad9f',
                '#ff8a75',
                '#ff5533',
                '#e2492d',
                '#be3d26',
                '#9a311f',
                '#782618'
            ]);
    }, [normalizedData]);

    const dataMap = useMemo(() => {
        if (!normalizedData.length) return {};
        return normalizedData.reduce((acc, curr) => {
            // Normalize state names for matching
            const key = curr.state.toUpperCase().replace(/&/g, 'AND');
            acc[key] = curr.turnout;
            return acc;
        }, {});
    }, [normalizedData]);

    if (isLoading) {
        return (
            <Card title="State-wise Turnout Map">
                <LoadingState />
            </Card>
        );
    }

    if (isError) {
        return (
            <Card title="State-wise Turnout Map">
                <ErrorState onRetry={refetch} />
            </Card>
        );
    }

    return (
        <Card title="State-wise Turnout Map" subtitle="Choropleth map showing voter turnout percentage">
            <div style={{ width: '100%', height: '500px', minWidth: 0, position: 'relative' }}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={PROJECTION_CONFIG}
                    width={800}
                    height={600}
                    style={{ width: '100%', height: '100%' }}
                >
                    <ZoomableGroup>
                        <Geographies geography={INDIA_TOPO_JSON}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    // Normalize geo name
                                    // The map likely uses 'st_nm' or 'name' or 'NAME_1'
                                    // We'll try to find the best match
                                    const props = geo.properties;
                                    const rawName = props.st_nm || props.name || props.NAME_1 || '';

                                    // Normalize: uppercase, replace & with AND, remove non-alphanumeric (except spaces)
                                    const geoName = rawName.toUpperCase().replace(/&/g, 'AND');
                                    const turnout = dataMap[geoName];

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={turnout ? colorScale(turnout) : '#EEE'}
                                            stroke="#D6D6DA"
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { fill: '#F53', outline: 'none' },
                                                pressed: { outline: 'none' }
                                            }}
                                            title={`${rawName}: ${turnout ? turnout + '%' : 'N/A'}`}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
                {/* Legend - positioned at top right */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '13px',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#ffedea',
                            border: '1px solid #ccc',
                            display: 'inline-block',
                            borderRadius: '2px'
                        }}></span>
                        <span>Low</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#ff5533',
                            border: '1px solid #ccc',
                            display: 'inline-block',
                            borderRadius: '2px'
                        }}></span>
                        <span>Medium</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#782618',
                            border: '1px solid #ccc',
                            display: 'inline-block',
                            borderRadius: '2px'
                        }}></span>
                        <span>High</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
