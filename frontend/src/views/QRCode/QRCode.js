import React, { useEffect } from 'react'
import { useRef } from 'react';
import QrReader from 'react-qr-reader';
import { CREATE_ATTANDANCE_WITH_QRCODE } from '../../services/attendance.service';
import successAudio from './scanned.mp3';
import Logo from '../../assets/images/sidebar/logo.jpg'
import QRcheck from '../../assets/images/qrcheck (1).svg';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Button } from 'antd';
import { t } from '../../utils';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function QRCodeScanner() {
  const scanRef = useRef(true);
  const audioRef = useRef(null);
  const [frontCamera, setFrontCamera] = useState(true);
  const { speak, voices } = useSpeechSynthesis();

  const handleScan = async (value) => {
    console.log(value, scanRef.current)
    if(value && scanRef.current) {
      scanRef.current = false;
      audioRef.current.play();


      const {data, message} = await CREATE_ATTANDANCE_WITH_QRCODE(value);
      const voice = voices[63];
      console.log(data)
      if(message === 'already') {
        speak({ text: "Вы уже зарегистрированы сегодня.", voice });
        Swal.fire({
          title: 'Error',
          text: 'Attendance already exists',
          icon: 'error',
          timer: 2000,
          toast: true,
        });
      } else if(message === 'checkin') {
        speak({ text: "Привет "+data.userId?.firstName, voice });
        Swal.fire({
          title: 'Success',
          text: 'Attendance has been created',
          icon: 'success',
          timer: 2000,
          toast: true,
        });
      } else {
        speak({ text: "До свидания "+data.userId?.firstName, voice });
        Swal.fire({
          title: 'Success',
          text: 'Attendance has been created',
          icon: 'success',
          timer: 2000,
          toast: true,
        });
      }
    
    }
    setScanRefToFalse()
  };

  const setScanRefToFalse = () => {
    setTimeout(() => scanRef.current = true, 3000);
  }

  useEffect(() => {
    scanRef.current = false
  })

  const handleError = err => {
    console.error(err)
  }

  return (
    <div style={{textAlign: 'center', height: '92vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style={{background: '#5f23d9', display: 'inline-block', padding: '25px', borderRadius: '33px'}} className="qr-inner">
        <img style={{borderRadius: '8px'}} width={150} src={QRcheck} alt="qrcode"/>
      </div>
      <h1 style={{fontSize: '28px', marginTop: '10px'}}>Kompyuterdan foydalanish uchun QRni scanerlang</h1>
      <img width={200} src={Logo} alt="logo"/>
    </div>
  )
} 
