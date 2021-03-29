import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import * as faceapi from 'face-api.js';
import React, { useEffect } from "react";

export default function Home() {
  const MODEL_URL = '/models'
  Promise.all(
    [
      faceapi.loadTinyFaceDetectorModel(MODEL_URL),
      faceapi.loadFaceLandmarkModel(MODEL_URL),
      faceapi.loadFaceExpressionModel(MODEL_URL),
      faceapi.loadFaceRecognitionModel(MODEL_URL),
      faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    ]
  )
    .then(start())
    .catch((e) => console.error(e));

  async function start() {
    useEffect(async () => {
      const video = document.getElementById('inputVideo')
      navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
      )
      
      video.addEventListener('play', () => {
        onPlay()
      })

    })

  }

  async function onPlay() {
    const video1 = document.getElementById('inputVideo')
    const overlay = document.getElementById('overlay')
    overlay.width = video1.offsetWidth;
    overlay.height = video1.offsetHeight;
    const tinyOptions = new faceapi.TinyFaceDetectorOptions();
    let lastSetInterval = 0;
    overlay.style.borderStyle = "dotted";
    function onInterval() {
      lastSetInterval = setInterval(async () => {
        let fullFaceDescriptions = await faceapi.detectAllFaces(video1, tinyOptions).withFaceExpressions()
        fullFaceDescriptions.forEach(element => {
          if (element.expressions.happy > 0.90 && element.expressions.happy <= 1) {
            overlay.style.display = "none"
          } else {
            overlay.style.display = "block"
          }
        });
        clearInterval(lastSetInterval);
        onInterval();
      }, 200);
    }
    onInterval();
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <h1>Smile</h1>
        <video id="inputVideo" autoPlay muted> </video>
        <canvas className={utilStyles.canvas} id="overlay" />
      </section>
    </Layout>
  )
}