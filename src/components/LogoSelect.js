
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import JSZip from 'jszip';

/**
 * 图片选择器
 * user 用户信息
 * language 语言信息
 */
export default function LogoSelect({ user, language, ...props }) {
    const [imgerror, setImgerror] = useState(''); //图片选择错误
  
    const clearSelect = () => { //清空选择
        props.setRealimg('');
        props.setSelectImg('');
        props.setImgtype('')
    }
    useEffect(() => { if (props.isSetLogo) props.setSelectImg(''); }, [props.isSetLogo]);  // 取消图片选择

    //非svg图片处理
    const gene_nosvg = (e, _type, file) => {
        //生成要上链的16进制编码
        let mbytes = '0x';
        for (let j = 0; j < e.target.result.length; j++) {
            let _a = e.target.result[j].valueOf().charCodeAt(0).toString(16);
            mbytes = mbytes + (_a.length === 1 ? ('0' + _a) : _a);
        }

        props.setRealimg(mbytes)
        //显示在网页上的图片处理
        const reader = new FileReader() 
        if (_type === 'zip') { //zip 文件要解压，根据后缀名还原成原文件base64编码
            let new_zip = new JSZip();
            new_zip.loadAsync(file)
                .then(function (mzip) {
                    let fileName = Object.keys(mzip.files)[0];
                    mzip.file(fileName).async("blob").then(blob => {
                        let fileNameSplit = fileName.split('.');
                        let suffixName = fileNameSplit[fileNameSplit.length - 1];
                        if (suffixName === 'svg') {
                            reader.addEventListener('loadend', function (e) {
                                props.setSelectImg('data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(e.target.result))));
                            })
                            reader.readAsText(blob) //按文本读取
                        } else { //二进制文件
                            reader.addEventListener('loadend', function (e) {
                                props.setSelectImg(e.target.result.replace("application/octet-stream", "image/" + _type))
                            })
                            reader.readAsDataURL(blob)
                        }
                    });
                });
        } else { //非压缩文件
            reader.addEventListener('loadend', function (e) {
                props.setSelectImg(e.target.result.replace("application/octet-stream", "image/" + _type));
            })
            reader.readAsDataURL(file)
        }
    }

    //svg图片处理
    const gene_svg = (e) => {
        props.setSelectImg('data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(e.target.result))));
        let mbytes = '0x';
        let zip = new JSZip();
        zip.file("zip.svg", e.target.result);
        zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } })
            .then(function (content) {
                let reader = new FileReader()
                reader.addEventListener('loadend', function (e1) {
                    for (let j = 0; j < e1.target.result.length; j++) {
                        let _a = e1.target.result[j].valueOf().charCodeAt(0).toString(16);
                        mbytes = mbytes + (_a.length === 1 ? ('0' + _a) : _a);
                    }
                    props.setRealimg(mbytes)
                })
                reader.readAsBinaryString(content)
            });
    }
    //选择图片后处理
    const fielChange = (event) => {
        if (!event.currentTarget.files) { clearSelect(); return; }
        let file = event.currentTarget.files[0];
        let type = file.name.toLowerCase().split('.').splice(-1); //获取上传的文件的后缀名  
        //检查后缀名
        if (type[0] !== 'jpeg' && type[0] !== 'zip' && type[0] !== 'svg' && type[0] !== 'jpg' && type[0] !== 'png' && type[0] !== 'gif' && type[0] !== 'webp') {
            setImgerror(language.register[5]+"【"+file.name+"】");
            clearSelect();
            return;
        }
        //检查文件大小
        if (file.size > 10480) {
            setImgerror(language.register[6]);
            clearSelect();
            return;
        }
        setImgerror('');
        if (type[0] === 'svg') { //svg 要压缩
            props.setImgtype('zip');
            let reader = new FileReader();
            reader.addEventListener('loadend', function (e) { gene_svg(e); });
            reader.readAsText(file);
        } else { //直接处理文件
            props.setImgtype(type[0])
            let reader = new FileReader();
            reader.addEventListener('loadend', function (e) { gene_nosvg(e, type[0], file); });
            reader.readAsBinaryString(file);
        }
    }

    return (
        <div >
            {/* logo 选择按钮 */}
            <InputGroup className="mb-2">
                <InputGroup.Text className={props.itemClass}>{language.logoselect[0]}</InputGroup.Text>
                <div className='form-control logo_filediv' >
                    <a href="#" className="logo_upload">{language.logoselect[1]}
                        <input className="logon_change" type="file" onChange={fielChange} />
                    </a>
                </div>
            </InputGroup>
            {/* 已选择logo图片  */}
            <InputGroup className="mb-2" style={{ display: props.selectImg === '' ? 'none' : '' }} >
                <InputGroup.Text className={props.itemClass}>{language.logoselect[2]}</InputGroup.Text>
                <div className='form-control' >
                    <img style={{ width: '32px', height: '32px' }} src={props.selectImg} alt='' ></img>
                </div>
            </InputGroup>
            {imgerror !== '' && <Alert variant="warning" >
                <Alert.Heading>{language.w_tipMessage}</Alert.Heading>
                <p>
                    {imgerror}
                </p>
            </Alert>}
        </div>
    );
}
