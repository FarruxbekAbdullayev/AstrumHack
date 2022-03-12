import React, { useEffect } from 'react'
import { useRef } from 'react';
import QrReader from 'react-qr-reader';
import { CREATE_ATTANDANCE_WITH_QRCODE } from '../../services/attendance.service';
import successAudio from './scanned.mp3';
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
      // audioRef.current.play();


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
    <div style={{textAlign: 'center'}}>
      <audio src={successAudio} hidden ref={audioRef}></audio>
      <QrReader
        delay={500}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%', maxWidth: 300, margin: '20px auto 30px' }}
        facingMode={frontCamera ? 'user' : 'environment'}
      />
      <Button type='primary' onClick={() => setFrontCamera(!frontCamera)}> 
        {t('Change Camera')}
      </Button>
    </div>
  )
} 
