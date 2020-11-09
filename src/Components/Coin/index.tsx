import React from 'react';
import './index.css';

interface CoinProps {
    coin: string;
    OldPrice: number;
    currentPrice: number;
}
 
export const Coin: React.FC<CoinProps> = (props) => {
    const { coin, OldPrice, currentPrice } = props;
    const classes = ['Coin'];

    if(OldPrice < currentPrice){
        classes.push('up')
    }

    if(OldPrice > currentPrice){
        classes.push('down')
    }

    return (
        <div className={classes.join(' ')} >
            <span>{coin}</span>
            <span>{currentPrice}</span>
        </div>
      );    
}
