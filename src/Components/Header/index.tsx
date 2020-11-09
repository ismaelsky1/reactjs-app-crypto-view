import * as React from "react";
import { Coin } from "../Coin";
import "./index.css";
import { cryptorHttp } from "../../http/index";
import { clearInterval } from "timers";

interface HeaderProps {
  onSelected: (coin: string) => void;
}

interface Price {
  [key: string]: { OldPrice: number; currentPrice: number };
}

const ALL_PRICES: Price = {
  BTC: { OldPrice: 0, currentPrice: 0 },
  LTC: { OldPrice: 0, currentPrice: 0 },
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { onSelected } = props;

  const [prices, setPrices] = React.useState<Price>(ALL_PRICES);

  React.useEffect(() => {
    const intervals = Object.keys(ALL_PRICES).map((coin) => {
      return setInterval(() => {
        cryptorHttp.get(`price?fsym=${coin}&tsyms=BRL`).then((response) => {
          setPrices((prevState) => {
            if (prevState[coin].currentPrice === response.data.BRL) {
              return prevState;
            }
            return {
              ...prevState,
              [coin]: {
                OldPrice: prevState[coin].currentPrice,
                currentPrice: response.data.BRL,
              },
            };
          });
        });
      }, 5000);
    });

    return () => {
      intervals.forEach((inteval) => clearInterval(inteval));
    };
  }, []);

  return (
    <div className="Header">
      {Object.keys(prices).map((coin) => (
        <div onClick={() => onSelected(coin)} key={coin}>
          <Coin
            coin={coin}
            key={coin}
            OldPrice={prices[coin].OldPrice}
            currentPrice={prices[coin].currentPrice}
          />
        </div>
      ))}
    </div>
  );
};
