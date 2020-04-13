import axios from 'axios';

const Kakao = axios.create({
    baseURL: "https://dapi.kakao.com",
    headers: {
        Authorization: 'KakaoAK d8bbfc3f1e1264009498152cae29e325'
    }
});

export const bookSearch = params => {
    console.log(process.env.KAKAO_API_KEY)
    return Kakao.get("/v3/search/book", { params });
}