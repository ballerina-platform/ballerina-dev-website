import * as React from 'react';
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from 'react-bootstrap';


const options = [
    {
      name: 'Enable backdrop (default)',
      scroll: false,
      backdrop: true,
    },
    {
      name: 'Disable backdrop',
      scroll: false,
      backdrop: false,
    },
    {
      name: 'Enable body scrolling',
      scroll: true,
      backdrop: false,
    },
    {
      name: 'Enable both scrolling & backdrop',
      scroll: true,
      backdrop: true,
    },
];
  
export default function PageToc({ name, ...props }) {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    return (
        <>
        <Button variant="primary" onClick={toggleShow} className="me-2">
          &gt;&gt;
        </Button>
        <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
}
