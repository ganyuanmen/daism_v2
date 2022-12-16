import React from 'react'
import Card from "react-bootstrap/Card";
import logo from "../../logo.svg";

export default function RecordItem({ record, language }) {
    return (
      <>
        <Card className="cardItem">
          <Card.Body>
            <h4 className="nowrap">{record.dao_name}({record.dao_symbol})</h4>
            <div style={{ display: "flex" }}>
              <img alt="" className="cardimg" src={!record.dao_logo || record.dao_logo.length<12?logo:record.dao_logo}></img>
              <p className="card-text carde">{record.dao_dsc}</p>
            </div>
            <div className="carFoot">
              <div>{language.daoList[4]}： {record.dao_time}</div>
              <div>{language.daoList[5]}： {record.utoken_cost} UTOKEN</div>
              <div>{language.daoList[6]}： {record.dao_index}</div>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
  