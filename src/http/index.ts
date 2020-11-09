import Axios from 'axios';

const  apiKey = '56682a154c70b16b43bf33455d0b09f23e178ca82c3ad3c105ebbbf19bf21a';

export const cryptorHttp = Axios.create({
    baseURL: 'https://min-api.cryptocompare.com/data',
    headers: {
        authorization: `ApiKey ${apiKey}`
    }
})