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

const Slider = ({ urlList }: SliderProps) => {

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
                loop={true}
                zoom={true}
                navigation={true}
                modules={[Zoom, Autoplay, Pagination, Navigation]}
                className="mySwiper"
                style={{ height: "80%" }}
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
