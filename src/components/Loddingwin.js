import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function Loddingwin({ language,tipText }) {
    const [dwin, setDwin] = useState(0); //滚动窗口显示 

    useEffect(() => {
        var win_i = 0;
        if (tipText!=='') {
            var timein = setInterval(() => {
                if (win_i >= 3) win_i = 0;
                else win_i++;
                setDwin(win_i);
            }, 10000);
        }

        return () => {
            setDwin(0); win_i = 0;
            clearInterval(timein);
        }
    }, [tipText]);

    return (

        <Modal centered show={tipText!==''} backdrop="static" keyboard={false}>
            <Modal.Header >
                <Modal.Title>{language.w_tipMessage}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='daotipbody' >
                {/* 动态图标 */}
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                {/* 根据dwin显示文本 */}
                <div className='daotiptext'  >
                    {dwin === 0 && <div style={{ color: '#007bff' }} > {tipText}</div>}
                    {dwin === 1 && <div style={{ color: '#28a745' }} > {language.tips[14]}</div>}
                    {dwin === 2 && <div style={{ color: '#dc3545' }}> {language.tips[15]}</div>}
                    {dwin === 3 && <div style={{ color: '#6f42c1' }}> {language.tips[16]}</div>}
                </div>
            </Modal.Body>
        </Modal>
    )
}
