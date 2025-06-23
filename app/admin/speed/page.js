'use client'

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function SpeedTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testPhase, setTestPhase] = useState('idle');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);
  const bytesTransferred = useRef(0);
  const startTime = useRef(0);
  const xhrRef = useRef(null);
  const downloadController = useRef(null);

  // Generate dummy file of specific size (in MB)
  const generateDummyFile = (sizeMB) => {
    const size = sizeMB * 1024 * 1024;
    const buffer = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return new File([buffer], `speedtest-${sizeMB}MB.bin`, { 
      type: 'application/octet-stream' 
    });
  };

  // Measure ping to server
  const measurePing = async () => {
    const start = Date.now();
    try {
      await fetch(`http://172.31.100.61:8750/ping?t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const pingTime = Date.now() - start;
      setPing(pingTime);
      return pingTime;
    } catch (error) {
      console.error('Ping test failed:', error);
      setPing(0);
      return 0;
    }
  };

  // Test download speed
  const testDownloadSpeed = async () => {
    setIsTesting(true);
    setTestPhase('download');
    setDownloadSpeed(0);
    setProgress(0);
    bytesTransferred.current = 0;
    
    try {
      const pingTime = await measurePing();
      startTime.current = Date.now();
      downloadController.current = new AbortController();
      
      const url = `http://172.31.100.61:8750/speed-test/download?t=${Date.now()}`;
      const response = await fetch(url, {
        signal: downloadController.current.signal
      });
      
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('content-length') || 10 * 1024 * 1024; // Fallback 10MB
      
      // Update speed every 300ms
      const speedInterval = setInterval(() => {
        const duration = (Date.now() - startTime.current) / 1000;
        if (duration > 0) {
          const speedMbps = (bytesTransferred.current * 8) / (duration * 1024 * 1024);
          setDownloadSpeed(parseFloat(speedMbps.toFixed(2)));
        }
      }, 300);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        bytesTransferred.current += value.length;
        const percent = Math.min(100, (bytesTransferred.current / contentLength) * 100);
        setProgress(percent);
      }
      
      clearInterval(speedInterval);
      
      // Final calculation
      const duration = (Date.now() - startTime.current) / 1000;
      const speedMbps = (bytesTransferred.current * 8) / (duration * 1024 * 1024);
      const speedMBps = speedMbps / 8;
      
      setDownloadSpeed(parseFloat(speedMbps.toFixed(2)));
      setProgress(100);
      
      // Store download results
      setResults(prev => ({
        ...prev,
        download: {
          speedMbps: parseFloat(speedMbps.toFixed(2)),
          speedMBps: parseFloat(speedMBps.toFixed(2)),
          durationSec: parseFloat(duration.toFixed(2)),
          sizeMB: parseFloat((bytesTransferred.current / (1024 * 1024)).toFixed(2)),
          pingMs: pingTime
        }
      }));
      
      setTimeout(testUploadSpeed, 1000);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Download test failed:', error);
      }
      setIsTesting(false);
      setTestPhase('idle');
    }
  };

  // Test upload speed
  const testUploadSpeed = async () => {
    setTestPhase('upload');
    setUploadSpeed(0);
    setProgress(0);
    bytesTransferred.current = 0;
    startTime.current = Date.now();
    
    // Use a fixed 3.5MB file to match API test
    const testFile = generateDummyFile(3.5);
    const fileSizeMB = testFile.size / (1024 * 1024);

    try {
      const formData = new FormData();
      formData.append('binary', testFile, testFile.name);
      
      xhrRef.current = new XMLHttpRequest();
      
      xhrRef.current.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          bytesTransferred.current = e.loaded;
          const duration = (Date.now() - startTime.current) / 1000;
          
          // Calculate in both units
          const speedMbps = (e.loaded * 8) / (duration * 1024 * 1024);
          const speedMBps = speedMbps / 8;
          
          setUploadSpeed(parseFloat(speedMbps.toFixed(2)));
          setProgress(Math.min(100, (e.loaded / e.total) * 100));
        }
      };

      xhrRef.current.onload = () => {
        if (xhrRef.current.status === 200) {
          const duration = (Date.now() - startTime.current) / 1000;
          const speedMbps = (testFile.size * 8) / (duration * 1024 * 1024);
          const speedMBps = speedMbps / 8;
          
          setUploadSpeed(parseFloat(speedMbps.toFixed(2)));
          setProgress(100);
          
          // Store upload results
          setResults(prev => ({
            ...prev,
            upload: {
              speedMbps: parseFloat(speedMbps.toFixed(2)),
              speedMBps: parseFloat(speedMBps.toFixed(2)),
              durationSec: parseFloat(duration.toFixed(2)),
              sizeMB: parseFloat(fileSizeMB.toFixed(2))
            }
          }));
          
          setTimeout(() => {
            setTestPhase('complete');
            setIsTesting(false);
          }, 1000);
        } else {
          throw new Error(`Upload failed with status ${xhrRef.current.status}`);
        }
      };

      xhrRef.current.onerror = () => {
        throw new Error('Upload error occurred');
      };

      xhrRef.current.open('POST', 'http://172.31.100.61:8750/speed-test/upload', true);
      xhrRef.current.send(formData);

    } catch (error) {
      console.error('Upload test failed:', error);
      setIsTesting(false);
      setTestPhase('idle');
      if (xhrRef.current) {
        xhrRef.current.abort();
      }
    }
  };

  // Start complete test
  const startTest = () => {
    setResults(null);
    testDownloadSpeed();
  };

  // Cancel ongoing test
  const cancelTest = () => {
    if (testPhase === 'download' && downloadController.current) {
      downloadController.current.abort();
    }
    if (testPhase === 'upload' && xhrRef.current) {
      xhrRef.current.abort();
    }
    setIsTesting(false);
    setTestPhase('idle');
  };

  return (
    <div className="container">
      <Head>
        <title>Speed Test</title>
      </Head>

      <main className="main">
        <h1 className="title">Internet Speed Test</h1>
        
        <div className="speedometer">
          <div className="gauge-container">
            <div className="gauge">
              <div 
                className="progress" 
                style={{ 
                  height: `${progress}%`,
                  backgroundColor: testPhase === 'download' ? '#4CAF50' : '#2196F3'
                }}
              ></div>
            </div>
            <div className="speed-display">
              {testPhase === 'download' && (
                <>
                  <div className="speed-value">{downloadSpeed}</div>
                  <div className="speed-unit">Mbps</div>
                  <div className="speed-label">DOWNLOAD</div>
                  {ping > 0 && <div className="ping">Ping: {ping}ms</div>}
                  <div className="progress-text">{progress.toFixed(0)}%</div>
                </>
              )}
              {testPhase === 'upload' && (
                <>
                  <div className="speed-value">{uploadSpeed}</div>
                  <div className="speed-unit">Mbps</div>
                  <div className="speed-label">UPLOAD</div>
                  <div className="progress-text">{progress.toFixed(0)}%</div>
                </>
              )}
              {testPhase === 'complete' && results && (
                <div className="results">
                  <div className="result-section">
                    <h3>Download Results</h3>
                    <div className="result-row">
                      <span>Speed:</span>
                      <span>{results.download.speedMbps} Mbps ({results.download.speedMBps} MBps)</span>
                    </div>
                    <div className="result-row">
                      <span>Duration:</span>
                      <span>{results.download.durationSec} seconds</span>
                    </div>
                    <div className="result-row">
                      <span>Data:</span>
                      <span>{results.download.sizeMB} MB</span>
                    </div>
                    <div className="result-row">
                      <span>Ping:</span>
                      <span>{results.download.pingMs} ms</span>
                    </div>
                  </div>
                  
                  <div className="result-section">
                    <h3>Upload Results</h3>
                    <div className="result-row">
                      <span>Speed:</span>
                      <span>{results.upload.speedMbps} Mbps ({results.upload.speedMBps} MBps)</span>
                    </div>
                    <div className="result-row">
                      <span>Duration:</span>
                      <span>{results.upload.durationSec} seconds</span>
                    </div>
                    <div className="result-row">
                      <span>Data:</span>
                      <span>{results.upload.sizeMB} MB</span>
                    </div>
                  </div>
                </div>
              )}
              {testPhase === 'idle' && (
                <div className="ready">
                  Ready to test
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="button-group">
          {!isTesting ? (
            <button 
              className="start-button" 
              onClick={startTest}
            >
              Start Speed Test
            </button>
          ) : (
            <button 
              className="cancel-button" 
              onClick={cancelTest}
            >
              Cancel Test
            </button>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .main {
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 500px;
          text-align: center;
        }
        
        .title {
          margin: 0 0 1.5rem;
          line-height: 1.15;
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
        }
        
        .speedometer {
          margin: 1.5rem 0;
        }
        
        .gauge-container {
          position: relative;
          width: 280px;
          height: 280px;
          margin: 0 auto;
        }
        
        .gauge {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #f0f0f0;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
        }
        
        .progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          transition: height 0.3s ease;
        }
        
        .speed-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 80%;
        }
        
        .speed-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: -0.5rem;
        }
        
        .speed-unit {
          font-size: 1.3rem;
          color: #666;
          font-weight: 500;
        }
        
        .speed-label {
          font-size: 1.1rem;
          color: #666;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        
        .ping, .progress-text {
          font-size: 1rem;
          color: #888;
          margin-top: 0.5rem;
        }
        
        .ready {
          font-size: 1.2rem;
          color: #666;
          font-weight: 500;
        }
        
        .results {
          text-align: left;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
        }
        
        .result-section {
          margin-bottom: 1.5rem;
        }
        
        .result-section h3 {
          color: #333;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.3rem;
        }
        
        .result-row {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0;
          font-size: 1rem;
        }
        
        .result-row span:first-child {
          color: #666;
          font-weight: 500;
        }
        
        .result-row span:last-child {
          color: #333;
          font-weight: 600;
        }
        
        .button-group {
          margin-top: 1.5rem;
        }
        
        .start-button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 12px 30px;
          text-align: center;
          font-size: 1.1rem;
          margin: 0.5rem 0;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.3s;
          font-weight: 600;
          min-width: 150px;
        }
        
        .start-button:hover {
          background-color: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .cancel-button {
          background-color: #f44336;
          border: none;
          color: white;
          padding: 12px 30px;
          text-align: center;
          font-size: 1.1rem;
          margin: 0.5rem 0;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.3s;
          font-weight: 600;
          min-width: 150px;
        }
        
        .cancel-button:hover {
          background-color: #d32f2f;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}