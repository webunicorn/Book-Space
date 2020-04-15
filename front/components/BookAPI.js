import axios from 'axios';
import { kakaoApi } from '../kakaoapi/kakaoapi';

const Kakao = axios.create({
    baseURL: "https://dapi.kakao.com",
    headers: {
        Authorization: `KakaoAK ${kakaoApi}`
    }
});

export const bookSearch = params => {
    console.log(process.env.KAKAO_API_KEY)
    return Kakao.get("/v3/search/book", { params });
}