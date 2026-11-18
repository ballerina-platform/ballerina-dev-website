/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import * as React from 'react';

// Below this width the list and its example stack, so the example opens under the selected item.
const NARROW = '(max-width: 991.98px)';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

// True when the list and the example are stacked rather than side by side.
export function useStacked() {
  const [stacked, setStacked] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(NARROW);
    const update = () => setStacked(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return stacked;
}

// Selection for a list whose example opens under the selected item. Opening one item closes
// the one above it, which would move the tapped item up the screen; this keeps it where it was.
export function useAnchoredSelection(initial = 0) {
  const [active, setActive] = React.useState(initial);
  const anchor = React.useRef(null);

  const select = (index, element) => {
    anchor.current = element ? { element, top: element.getBoundingClientRect().top } : null;
    setActive(index);
  };

  useIsomorphicLayoutEffect(() => {
    const current = anchor.current;
    anchor.current = null;
    if (!current) return;
    const shift = current.element.getBoundingClientRect().top - current.top;
    if (shift) window.scrollBy({ top: shift, behavior: 'instant' });
  }, [active]);

  return [active, select];
}
