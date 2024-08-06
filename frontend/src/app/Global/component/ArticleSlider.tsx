'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Zoom } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

interface SliderProps {
    urlList: string[];
}

const Slider = ({ urlList }: SliderProps) => {
    const slideCount = urlList.length;
    const shouldLoop = slideCount >= 3; // 슬라이드 수가 3개 이상일 때만 loop 활성화

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                loop={shouldLoop}
                zoom={true}
                navigation={true}
                modules={[Zoom, Autoplay, Pagination, Navigation]}
                className="mySwiper"
                style={{ height: "100%", width: "100%", margin: "0px" }}
            >
                {urlList.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="swiper-zoom-container" style={{ width: '100%', height: '100%' }}>
                            <img src={url} style={{ width: '100%', height: '100%' }} alt={`Slide ${index}`} className="object-cover m-auto" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default Slider;
