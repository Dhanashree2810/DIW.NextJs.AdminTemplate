import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartViewProps {
    option: any;
}

const ChartView: React.FC<ChartViewProps> = ({ option }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current && option) {
            const chart = echarts.init(chartRef.current);
            chart.setOption(option);

            return () => {
                chart.dispose();
            };
        }
    }, [option]);

    return (
        <div className="p-4 bg-white border-2 overflow-hidden border-r-2 h-full" >
            <div ref={chartRef} className="w-full h-full min-h-[250px] max-h-[400px] "></div>
        </div>
    );
};

export default ChartView;
