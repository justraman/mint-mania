"use client";

import { createChart, ColorType, LineStyle } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

export default function ChartComponent(props: any) {
  const {
    data,
    colors: { backgroundColor = "black", lineColor = "#99ffb3", textColor = "white", areaTopColor = "#99ffb3", areaBottomColor = "#0e8734" } = {}
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const container = chartContainerRef.current as unknown as HTMLElement;
      if (container) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current as unknown as HTMLElement, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontSize: 12,
        fontFamily: "TheFountainOfWishes"
      },
      grid: {
        vertLines: {
          color: "#333333"
        },
        horzLines: {
          color: "#333333"
        }
      },
      height: 500
    });
    chart.timeScale().applyOptions({
      timeVisible: true,
      uniformDistribution: true,
      fixLeftEdge: true,
      fixRightEdge: true
    });

    const newSeries = chart.addLineSeries({
      lineStyle: LineStyle.Solid,
      color: lineColor,
      priceFormat: {
        type: "custom",
        formatter: (price: number) => `$${(price/1000000).toFixed(6)}` // Example: Format prices as "$X.XX"
      }
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  return <div ref={chartContainerRef} className="h-full w-full" />;
}
