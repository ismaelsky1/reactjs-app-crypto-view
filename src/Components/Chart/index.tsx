import { createChart, CrosshairMode, ISeriesApi } from "lightweight-charts";
import * as React from "react";
import { cryptorHttp } from "../../http";
import { Legend } from "../Legend";
import "./index.css";

interface ChatsProps {
  coin: string;
}

export const Chart: React.FC<ChatsProps> = (props) => {
  const { coin } = props;
  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const candleSeriesRef = React.useRef() as React.MutableRefObject<
    ISeriesApi<"Candlestick">
  >;
  const [prices, setPrices] = React.useState<any[]>([]);
  const [chartLoaded, setChartLoaded] = React.useState(false);

  React.useEffect(() => { 

    const interval = setInterval(() => {
      cryptorHttp
        .get(`histominute?fsym=${coin}&tsym=BRL&limit=1`)
        .then((response) => {
          setPrices((prevState: any) => {
            const price = response.data.Data[1];
            const newPrice = {
              time: price.time,
              low: price.low,
              high: price.high,
              open: price.open,
              close: price.close,
              volume: price.volumefrom,
            };

            candleSeriesRef.current.update(newPrice);
            return [... prevState, newPrice];
          });
        });

      return () => clearInterval(interval);
    }, 60000);
  }, [coin]);

  React.useEffect(() => {
    cryptorHttp
      .get(`histoday?fsym=${coin}&tsym=BRL&limit=300`)
      .then((response) => {
        const prices = response.data.Data.map((res: any) => ({
          time: res.time,
          low: res.low,
          high: res.high,
          open: res.open,
          close: res.close,
          volume: res.volumefrom,
        }));

        setPrices(prices);
      });
  }, [coin, chartLoaded]);

  React.useEffect(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current.setData(prices);
    }
  }, [prices]);

  React.useEffect(() => {
    setPrices([]);
  }, [coin]);

  React.useEffect(() => {
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        backgroundColor: "#253248",
        textColor: "rgb(255,255,255,0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      //@ts-ignore
      PriceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
      },
    });

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });

    setChartLoaded(true);
  }, []);

  return (
    <div className="Chart" ref={containerRef}>
      <Legend legend={coin} />
    </div>
  );
};
