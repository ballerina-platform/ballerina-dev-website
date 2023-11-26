/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

import styles from './CommunityCarousel.module.css';

export default function CommunityCarousel(props) {

  return (
    <Carousel className={styles.communityCarousel}>
      <Carousel.Item>
        <img src='/images/community/1.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/2.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/3.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/4.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/5.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/6.png' />
      </Carousel.Item>
      <Carousel.Item>
        <img src='/images/community/7.png' />
      </Carousel.Item>
    </Carousel>
  );
}
