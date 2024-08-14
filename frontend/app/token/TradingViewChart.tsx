"use client"
import React, { useEffect } from 'react';

const TradingViewChart = ({ symbol = "ETHUSD", theme = "dark", height = 400 }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://s3.tradingview.com/tv.js`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: theme,
        style: '1',
        locale: 'en',
        container_id: 'tradingview_widget',
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [symbol, theme]);

  return <div id="tradingview_widget" style={{ height: `${height}px` }} />;
};

export default TradingViewChart;
