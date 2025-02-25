"use client";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { YearlyReportByServiceType } from "@/api/models/reporteModels";
import { useState, useEffect } from "react";


interface PieData {
  name: string; 
  value: number; 
  fill: string; 
}


const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>

      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />

      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`$${value.toFixed(2)}`}
      </text>

      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


export default function ServicePieChart({ data }: { data: YearlyReportByServiceType[] }) {
  const [activeIndex, setActiveIndex] = useState(0); 
  const [isMobile, setIsMobile] = useState(false); 
  const serviceTypes = Array.from(new Set(data.map((item) => item.serviceType))); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); 
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const getServiceColor = (service: string) => {
    const hue = (serviceTypes.indexOf(service) * 137.508) % 360; 
    return `hsl(${hue}, 70%, 50%)`;
  };


  const processedData = data.reduce((acc: PieData[], curr) => {
    const existing = acc.find((item) => item.name === curr.serviceType);
    const total = curr.paidAmount + curr.unpaidAmount; 


    if (existing) {
      existing.value += total;
    } else {
      acc.push({
        name: curr.serviceType,
        value: total,
        fill: getServiceColor(curr.serviceType), 
      });
    }
    return acc;
  }, []);

  return (
    <div className="w-full h-[280px] sm:h-[500px]">

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex} 
            activeShape={renderActiveShape} 
            data={processedData} 
            cx="50%" 
            cy="50%" 
            innerRadius={isMobile ? 70 : 150} 
            outerRadius={isMobile ? 100 : 200} 
            dataKey="value" 
            onMouseEnter={(_, index) => setActiveIndex(index)} 
          >

            {processedData.map((entry, index) => (
              <Sector key={`sector-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}