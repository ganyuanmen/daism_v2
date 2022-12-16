import DaoRote from "./DaoRouter";
import logo from "./logo.svg";
import messlogo from "./mess.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
//import React, { useState, useEffect, useLayoutEffect } from 'react';

import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import Loddingwin from "./components/Loddingwin";
import Nav from "react-bootstrap/Nav";
import Wallet from "./pages/Wallet";
import { useSelector, useDispatch } from 'react-redux';
import {setMessageText} from './data/valueData'

export default function App() {
  const [menuIndex, setMenuIndex] = useState(0);  //菜单序号
  const tipText = useSelector((state) => state.valueData.tipText)
  const messageText = useSelector((state) => state.valueData.messageText)
  const dispatch = useDispatch();
  const language = useSelector((state) => state.valueData.language)

  useEffect(() => {  
    //根据hash恢复刷新前的选择
    function setFromHashMenu(){
      let tempidx = 0;
      for (; tempidx < language.menu.length; tempidx++) {
        if (window.location.hash.startsWith(language.menu[tempidx].link)) break;
      }
      setMenuIndex(tempidx);
    }
  
    window.onhashchange = () => {setFromHashMenu()}; //刷新时重定位选择项
    setFromHashMenu()    
    
  }, [language.menu]);


  return (
    <>
      <Navbar collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand href="#"  >
            <img src={logo} className="daoheadimg" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto daotopbar">
              {language.menu.map((placement, idx) => (
                <Nav.Link
                  className={idx === menuIndex ? "daoactive" : ""}
                  href={
                    idx === 5
                      ? language.version === "en"
                        ? "./dist_en/index.html"
                        : "./dist/index.html"
                      : placement.link
                  }
                  target={placement.target ? placement.target : ""}
                  key={idx}
                  onClick={(e) => {
                    if (!placement.target) { //记录
                       setMenuIndex(idx);
                    }
                  }}
                >
                  {placement.name}
                </Nav.Link>
              ))}

              <Wallet />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container-xxl my-md-4 bd-layout">
        <main className="bd-main order-1">
          <div className="bd-content ps-lg-4">
            <DaoRote></DaoRote>
          </div>
        </main>
      </div>
        {/* 操作状态窗口 */}
      <Loddingwin language={language} tipText={tipText}></Loddingwin>
        {/* 提示窗口 */}
      <Modal  className="modal-dialog-scrollable"
        centered
        show={messageText!==''}
        onHide={(e) => {dispatch(setMessageText(''))}}
      >
        <Modal.Header closeButton>
          <Modal.Title>{language.w_tipMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="daotipbody">
          <img alt="" src={messlogo} style={{ width: 32, height: 32 }}></img>
          <div className="daotiptext">{messageText}</div>
        </Modal.Body>
      </Modal>
      <footer className="bd-footer py-2 mt-3 bg-light">
        <div style={{ textAlign: "center" }}>DAISM.io</div>
      </footer>
    </>
  );
}
