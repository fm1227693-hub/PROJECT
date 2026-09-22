/**
 * LUSION — useMediaFrameLoader — Frame buffer preloader & memory management
 * Off-screen video decoded to canvas, ImageBitmap caching, GPU leak prevention
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MediaFrame, MediaFrameLoaderOptions, MediaFrameLoaderReturn } from '@/types/hyperspace'

export default function useMediaFrameLoader(options: MediaFrameLoaderOptions): MediaFrameLoaderReturn {
  const { videoSrc, totalFrames, preloadCount = 12, onProgress, onComplete } = options

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const framesRef = useRef<MediaFrame[]>([])
  const isLoadingRef = useRef<boolean>(false)

  const [frames, setFrames] = useState<MediaFrame[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const initVideo = useCallback((): HTMLVideoElement => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.loop = false
    video.src = videoSrc
    videoRef.current = video
    return video
  }, [videoSrc])

  const getFrame = useCallback((index: number): MediaFrame | null => {
    if (index < 0 || index >= framesRef.current.length) return null
    return framesRef.current[index] ?? null
  }, [])

  const preload = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)

    const video = videoRef.current ?? initVideo()

    const initFrames = Array.from({ length: totalFrames }, (_, i) => ({
      index: i,
      bitmap: null,
      timestamp: (i / totalFrames) * (video.duration || 10),
      loaded: false,
    }))
    framesRef.current = initFrames
    setFrames([...initFrames])

    try {
      await new Promise<void>((resolve, reject) => {
        if (video.readyState >= 2) {
          resolve()
          return
        }
        const onCanPlay = (): void => {
          video.removeEventListener('canplay', onCanPlay)
          video.removeEventListener('error', onError)
          resolve()
        }
        const onError = (): void => {
          video.removeEventListener('canplay', onCanPlay)
          video.removeEventListener('error', onError)
          reject(new Error('Video load failed'))
        }
        video.addEventListener('canplay', onCanPlay)
        video.addEventListener('error', onError)
        video.load()
      })

      // Preload first N frames as ImageBitmap for instant scrub
      const duration = video.duration || 10
      let loaded = 0

      for (let i = 0; i < Math.min(preloadCount, totalFrames); i++) {
        const time = (i / totalFrames) * duration
        video.currentTime = time

        await new Promise<void>((resolve) => {
          const onSeeked = async (): Promise<void> => {
            video.removeEventListener('seeked', onSeeked)
            try {
              if ('createImageBitmap' in window) {
                const bitmap = await createImageBitmap(video)
                framesRef.current[i] = {
                  index: i,
                  bitmap,
                  timestamp: time,
                  loaded: true,
                }
              } else {
                framesRef.current[i] = {
                  index: i,
                  bitmap: null,
                  timestamp: time,
                  loaded: true,
                }
              }
            } catch {
              framesRef.current[i] = {
                index: i,
                bitmap: null,
                timestamp: time,
                loaded: true,
              }
            }
            loaded++
            const prog = loaded / Math.min(preloadCount, totalFrames)
            setProgress(prog)
            onProgress?.(loaded, Math.min(preloadCount, totalFrames))
            setFrames([...framesRef.current])
            resolve()
          }
          video.addEventListener('seeked', onSeeked, { once: true })
        })
      }

      setIsComplete(true)
      setIsLoading(false)
      isLoadingRef.current = false
      onComplete?.()
    } catch {
      setIsLoading(false)
      isLoadingRef.current = false
      setIsComplete(true)
    }
  }, [initVideo, totalFrames, preloadCount, onProgress, onComplete])

  const destroy = useCallback((): void => {
    framesRef.current.forEach((frame) => {
      if (frame.bitmap) {
        frame.bitmap.close()
      }
    })
    framesRef.current = []
    setFrames([])
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ''
      videoRef.current.load()
      videoRef.current = null
    }
    setIsLoading(false)
    setIsComplete(false)
    setProgress(0)
    isLoadingRef.current = false
  }, [])

  useEffect(() => {
    const video = initVideo()
    preload()

    return (): void => {
      destroy()
      video.pause()
    }
  }, [initVideo, preload, destroy])

  return {
    frames,
    video: videoRef.current,
    isLoading,
    isComplete,
    progress,
    getFrame,
    preload,
    destroy,
  }
}
