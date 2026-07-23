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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './Release.module.css';

// Map a release asset filename to a friendly platform label and icon.
function describeAsset(name) {
  const n = name.toLowerCase();
  let os = 'Download';
  let icon = 'bi-download';
  if (n.includes('darwin') || n.includes('macos')) { os = 'macOS'; icon = 'bi-apple'; }
  else if (n.includes('linux')) { os = 'Linux'; icon = 'bi-ubuntu'; }
  else if (n.includes('windows') || n.includes('win')) { os = 'Windows'; icon = 'bi-windows'; }

  let arch = '';
  if (n.includes('arm64') || n.includes('aarch64')) arch = 'ARM64';
  else if (n.includes('amd64') || n.includes('x86_64') || n.includes('x64')) arch = 'x64';

  return { os, arch, icon };
}

// Display order for the platform blocks.
const OS_ORDER = [
  { os: 'macOS', icon: 'bi-apple' },
  { os: 'Linux', icon: 'bi-ubuntu' },
  { os: 'Windows', icon: 'bi-windows' },
];

// Group release assets by operating system so each platform is one block
// with a sub-part per architecture.
function groupAssets(assets) {
  const groups = {};
  assets.forEach((a) => {
    const { os, arch } = describeAsset(a.name);
    if (!groups[os]) groups[os] = [];
    groups[os].push({ ...a, arch });
  });
  return groups;
}

function formatDate(iso) {
  if (!iso) return '';
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export default function Release({ release, repo }) {
  const assets = (release?.assets || []).filter((a) => /\.(zip|tar\.gz|tgz)$/i.test(a.name));
  const groups = groupAssets(assets);

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 id="latest-release" className={styles.heading}>Download</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <div className={styles.releaseCard}>
              <div className={styles.releaseHeader}>
                <div className={styles.versionInfo}>
                  <span className={styles.versionLabel}>Latest release</span>
                  <span className={styles.version}>{release?.tag || release?.name}</span>
                  {release?.publishedAt &&
                    <span className={styles.date}>&middot; {formatDate(release.publishedAt)}</span>
                  }
                </div>
                <a className={styles.notesLink}
                  href={release?.htmlUrl || `https://github.com/${repo}/releases`}
                  target="_blank" rel="noreferrer">
                  View on GitHub <i className="bi bi-box-arrow-up-right" />
                </a>
              </div>

              <div className={styles.downloadBody}>
                {assets.length > 0 ?
                  <div className={styles.osGrid}>
                    {OS_ORDER.filter((o) => groups[o.os]).map(({ os, icon }) => (
                      <div className={styles.osBlock} key={os}>
                        <div className={styles.osHead}>
                          <i className={`bi ${icon} ${styles.osIcon}`} />
                          <span className={styles.osName}>{os}</span>
                        </div>
                        <div className={styles.archRow}>
                          {groups[os].map((a) => (
                            <a className={styles.archBtn} href={a.url} key={a.name} title={a.name}>
                              <i className="bi bi-download" />&nbsp;{a.arch || 'Download'}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  :
                  <a className={styles.fallbackBtn}
                    href={release?.htmlUrl || `https://github.com/${repo}/releases`}
                    target="_blank" rel="noreferrer">
                    View assets on GitHub
                  </a>
                }
              </div>
            </div>

            <p className={styles.allReleases}>
              Looking for another version or release details?{' '}
              <a href={`https://github.com/${repo}/releases`} target="_blank" rel="noreferrer">
                Browse all releases on GitHub
              </a>
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <div className={styles.getStarted}>
              <h3>Get started</h3>
              <p>Download the archive for your platform, extract it, and add the <code>bal</code> binary to your <code>PATH</code>:</p>
              <pre className={styles.codeBlock}>{`# macOS / Linux
unzip ballerina-bal-*.zip -d ballerina-nutcracker
export PATH="$PWD/ballerina-nutcracker:$PATH"

# Run a Ballerina program
bal run hello.bal`}</pre>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
