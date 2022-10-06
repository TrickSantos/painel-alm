import { BarItemProps } from "@nivo/bar";
import React from "react";

const BarComponent = ({ bar, style }: BarItemProps<any>) => {
  return (
    <g transform={`translate(${bar.x},${bar.y})`}>
      <rect
        x={-3}
        y={7}
        width={bar.width}
        height={bar.height}
        fill="rgba(0, 0, 0, .07)"
      />
      <rect width={bar.width} height={bar.height} fill={bar.color} />
      <rect x={bar.width - 5} width={5} height={bar.height} fillOpacity={0.2} />
      <text
        x={bar.width - 16}
        y={bar.height / 2 - 8}
        textAnchor="end"
        dominantBaseline="central"
        fill="black"
        style={{
          fontWeight: 900,
          fontSize: 15,
        }}
      >
        {bar.data.indexValue}
      </text>
      <text
        x={bar.width - 16}
        y={bar.height / 2 + 10}
        textAnchor="end"
        dominantBaseline="central"
        style={{
          fontWeight: 400,
          fontSize: 13,
        }}
      >
        {bar.data.value}
      </text>
    </g>
  );
};

export default BarComponent;
