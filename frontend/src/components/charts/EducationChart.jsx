import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Card } from '../common/Card';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';

export const EducationChart = ({ query }) => {
    const { data, isLoading, isError, refetch } = query;

    if (isLoading) {
        return (
            <Card title="Win % by Education Level">
                <LoadingState />
            </Card>
        );
    }

    if (isError) {
        return (
            <Card title="Win % by Education Level">
                <ErrorState onRetry={refetch} />
            </Card>
        );
    }

    if (!data || !data.length) {
        return (
            <Card title="Win % by Education Level">
                <p>No education data available.</p>
            </Card>
        );
    }

    return (
        <Card
            title="Win % by Education Level"
            subtitle="Correlation between education level and winning chances"
        >
            <ResponsiveContainer width="100%" height={360} minWidth={0}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="education"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis unit="%" />
                    <Tooltip
                        formatter={(value, name) => [
                            name === 'win_percentage' ? `${value}%` : value,
                            name === 'win_percentage' ? 'Win Rate' : 'Candidates'
                        ]}
                    />
                    <Legend />
                    <Bar dataKey="win_percentage" name="Win Rate (%)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
