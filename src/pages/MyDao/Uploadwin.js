import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default function Uploadwin({ user, language, ...props }) {
  const [showError, setShowError] = useState({
    address: false,
    proName: false,
  });

  const myCheck = (form) => {
    let _err = 0;
    let _isErr = { address: false, proName: false };
    let _a = form.apppro_name.value.trim();
    if (!_a || _a.length > 128) {
      _err = _err + 1;
      _isErr.proName = true;
    }
    let _0 = form.app_address.value.trim();
    if (!_0 || !checkAddress(_0)) {
      _err = _err + 1;
      _isErr.address = true;
    }
    setShowError(_isErr);
    return _err === 0;
  };
  const checkAddress = (v) => {
    return /^0x[A-Fa-f0-9]{40}$/.test(v);
  };
  //提交事件
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (!myCheck(form)) {
      props.showError(language.errors.mess);
    } else {
      let _name = form.apppro_name.value.trim();
      let _address = form.app_address.value.trim();
      let _dec = form.pro_dsc.value.trim();
     
        props.showTip(language.pro[16]);
        user.daoapi.dao_app.addApp(_name, _dec, _address).then(
          (re) => {    props.closeTip();
            setTimeout(() => {
              form.apppro_name.value = "";
              form.app_address.value = "";
              form.pro_dsc.value = "";
              props.setRefresh(true); //刷新列表
              props.setWshow(false);
            }, 2000);
          },
          (err) => {
            console.error(err); props.closeTip();props.setWshow(false);
            props.showError(language.tips[8] + (err.message ? err.message : err));
          }
        );
      }
    
  };

  return (
    <Modal
      size="lg"
      show={props.wshow}
      onHide={(e) => {
        props.setWshow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{language.tips[11]}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <InputGroup hasValidation className="mb-2">
            <InputGroup.Text className="ga">
              {language.pro[18]}
            </InputGroup.Text>
            <FormControl
              id="apppro_name"
              isInvalid={showError.proName ? true : false}
              type="text"
              onFocus={(e) => {
                setShowError({ ...showError, proName: false });
              }}
              placeholder={language.pro[18]}
              defaultValue=""
            />
            <Form.Control.Feedback type="invalid">
              {language.errors.dao[0]}
            </Form.Control.Feedback>
          </InputGroup>

          <InputGroup hasValidation className="mb-2">
            <InputGroup.Text className="ga">
              {language.pro[14]}
            </InputGroup.Text>
            <FormControl
              id="app_address"
              isInvalid={showError.address ? true : false}
              type="text"
              onFocus={(e) => {
                setShowError({ ...showError, address: false });
              }}
              placeholder={language.pro[14]}
              defaultValue=""
            />
            <Form.Control.Feedback type="invalid">
              {language.errors.dao[2]}
            </Form.Control.Feedback>
          </InputGroup>
          <FloatingLabel
            className="mb-2"
            controlId="pro_dsc"
            label={language.pro[15]}
          >
            <Form.Control
              as="textarea"
              placeholder={language.pro[15]}
              style={{ height: "160px" }}
            />
          </FloatingLabel>

          <div className="d-grid gap-2">
            <Button disabled={user.connected !== 1} type="submit">
              {language.pro[0]}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
