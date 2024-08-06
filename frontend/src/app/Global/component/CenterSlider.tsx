'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Zoom } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

interface SliderProps {
    urlList: string[];
}

const CenterSlider = ({ urlList }: SliderProps) => {

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {urlList.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="swiper-container w-full h-full rounded-t-lg">
                            <img src={url} style={{ width: '100%', height: '100%' }} alt={`Slide ${index}`} className="object-cover m-auto" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default CenterSlider;
