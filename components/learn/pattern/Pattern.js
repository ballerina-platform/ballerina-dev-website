import { Col, Badge, Card, Row } from "react-bootstrap";
import { prefix } from '../../../utils/prefix';
import styles from './Pattern.module.css';

export default function Pattern(props) {
  const href = props.name.replace(/\s+/g, '-').toLowerCase();
  return (
      <Col xl={{span: 6 }} className={styles.card}>
        <Card className={`mb-3`} style={{width:"100%", justifyContent:"center"}}>
          <Row className="g-0 align-items-center">
            <Col md={2} className='text-center'>
              <Card.Img src={`${prefix}/images/patterns/${href}.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
            </Col>
            <Col md={10}>
              <Card.Body>
                <a href={href} className={styles.cardLink}>
                  <h5 className="card-title">{props.name}</h5>
                </a>
                <p className="card-text">{props.description}</p>
                <p className={`${styles.tagWrapper} card-text text-body-secondary`} style={{ display: "flex", flexWrap: "wrap" }}>
                  {props.tags.map((tag) => (<Badge as={"a"} className={styles.tag} key={tag} onClick={()=>props.handleSelectedTag(tag)}>{tag}</Badge>))}
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
  );
}
