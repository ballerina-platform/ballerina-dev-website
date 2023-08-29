/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import React from "react";

import styles from './TopNav.module.css';

const CustomToggle = React.forwardRef(({ children, onClick, launcher }, ref) => (
  <a
    role="button"
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={(launcher === 'usecases') ? `dropdown-toggle nav-link` : 'dropdown-toggle nav-link'}
    id={styles.navbarScrollingDropdown} 
    data-bs-toggle="dropdown"
  >
    {children}
  </a>
));

CustomToggle.displayName = 'CustomToggle';

export default CustomToggle;
