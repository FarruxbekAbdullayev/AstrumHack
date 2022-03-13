import React, { useEffect } from 'react'
import Logo from '../../assets/images/sidebar/logo.jpg'
import QRcheck from '../../assets/images/qrcheck (1).svg';

export default function QRConfirmed() {

    useEffect(() => {
        setInterval(() => {
          /*
              Run a function or set any state here
          */
        }, 1000);
    }, []);

  return (
    <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style={{background: '#5f23d9', display: 'inline-block', padding: '25px', borderRadius: '33px'}} className="qr-inner">
        <img style={{borderRadius: '8px'}} width={150} src={QRcheck} alt="qrcode"/>
      </div>
      <h1 style={{fontSize: '28px', marginTop: '10px'}}>Kompyuterdan foydalanish uchun QRni scanerlang</h1>
      <img width={200} src={Logo} alt="logo"/>
    </div>
  )
} 
