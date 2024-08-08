import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Zoom } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

interface EditableSliderProps {
  urlList: string[];
  onRemove: (index: number) => void;
}

const EditableSlider: React.FC<EditableSliderProps> = ({ urlList, onRemove }) => {
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
              <div className="swiper-zoom-container relative" style={{ width: '100%', height: '100%' }}>
                <img src={url} style={{ width: '100%', height: '600px' }} alt={`Slide ${index}`} className="object-cover m-auto" />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-50"
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 이벤트가 슬라이드로 전파되는 것을 막음
                    onRemove(index);
                  }}
                >
                  X
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }
  
  export default EditableSlider;