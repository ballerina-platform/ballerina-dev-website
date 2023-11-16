'use client'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import styles from './CodeView.module.css';
import { useState } from 'react'

export default function CodeView(props) {
  const [visible, setVisible] = useState(false);

  const [copied, setCopied] = useState(false);

  const codeCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  const headerStyle = visible ? {} : {display: "none"};
  const showToggler = props.header.length > 0;
  return (
    <div>
        <div className={styles.code}>
            {props.name && <h5 className={styles.title}>{props.name}</h5>}
            <CopyToClipboard className={styles.copyToClipboard} text={props.raw} onCopy={() => codeCopy()}>
            {
                copied ? <FaCheck className={styles.copied} title="Copied" /> : <FaRegCopy title="Copy" />
            }
            </CopyToClipboard>
            {showToggler && <div dangerouslySetInnerHTML={{ __html: props.header }} style={headerStyle}/>}
            {showToggler && <div className={styles.collapse} onClick={() => setVisible(!visible)}>{visible?"↥":"⋯"}</div> }
            <div dangerouslySetInnerHTML={{ __html: props.main }} />
        </div>
    </div>
  )
}
