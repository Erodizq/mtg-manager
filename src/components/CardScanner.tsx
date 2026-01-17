"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Search } from 'lucide-react';
import { searchCard, ScryfallCard } from '@/lib/scryfall';
import { identifyCardWithGemini } from '@/lib/gemini';
import { useCollection } from '@/lib/storage';

export default function CardScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [debugImage, setDebugImage] = useState<string | null>(null); // Visual debug
    const [capturedImage, setCapturedImage] = useState<string | null>(null); // State to hold the full captured image
    const [ocrText, setOcrText] = useState(''); // State to hold the OCR result

    const [isAutoMode, setIsAutoMode] = useState(false); // Hands-free mode
    const autoCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [searchQuery, setSearchQuery] = useState(''); // New state for input control
    const [statusMessage, setStatusMessage] = useState(''); // New state for user feedback
    const [isProcessing, setIsProcessing] = useState(false);
    const [foundCards, setFoundCards] = useState<ScryfallCard[]>([]);
    const { addToCollection } = useCollection();

    // Auto-Capture Loop
    useEffect(() => {
        if (isAutoMode && isStreamActive && !capturedImage && !isProcessing) {
            // Wait 2s before capturing to allow user to maximize focus/framing or swap card
            const timer = setTimeout(() => {
                if (isAutoMode && isStreamActive && !capturedImage && !isProcessing) {
                    captureImage();
                }
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isAutoMode, isStreamActive, capturedImage, isProcessing]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreamActive(true);
                setCapturedImage(null); // Reset captured image
                // Auto mode loop will trigger via useEffect
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("No se pudo acceder a la cámara. Por favor permite el acceso.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsStreamActive(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Safety & Readiness check
            if (video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
                console.warn("Camera not ready. State:", video.readyState, "Dim:", video.videoWidth, video.videoHeight);
                setStatusMessage("Estabilizando cámara... un momento.");
                return;
            }

            // Cache dimensions to ensure consistency
            const vWidth = video.videoWidth;
            const vHeight = video.videoHeight;

            try {
                // 1. Capture Full Image for User Display
                // Explicitly set canvas size to match video to avoid scaling issues
                canvas.width = vWidth;
                canvas.height = vHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Draw full image
                    ctx.drawImage(video, 0, 0, vWidth, vHeight);
                    const fullImageUrl = canvas.toDataURL('image/png');
                    setCapturedImage(fullImageUrl);
                    stopCamera();

                    // 2. Process for Gemini
                    // STRATEGY CHANGE: Gemini is smart!
                    // Send the FULL image, not just the top half. 
                    // It can find the card in the frame better than we can crop it.

                    // Revert to DataURL but use JPEG to reduce size/memory
                    // We use the full canvas we just drew (canvas.width = vWidth)
                    const processedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

                    if (processedImageUrl && processedImageUrl.length > 100) {
                        setDebugImage(processedImageUrl);
                        processImage(processedImageUrl);
                    } else {
                        console.error("Canvas export failed");
                        setStatusMessage("Fallo al exportar imagen. Intenta de nuevo.");
                    }
                }
            } catch (error) {
                console.error("Capture error:", error);
                setStatusMessage("Fallo al capturar. Intenta de nuevo.");
                setIsProcessing(false);
            }
        }
    };

    const processImage = async (imageInput: HTMLCanvasElement | string) => {
        setIsProcessing(true);
        setStatusMessage("Preguntando a Gemini...");

        try {
            // Convert to Base64 specifically for Gemini
            let base64Image = "";
            if (typeof imageInput === 'string') {
                base64Image = imageInput;
            } else if (imageInput instanceof HTMLCanvasElement) {
                base64Image = imageInput.toDataURL('image/jpeg', 0.8);
            } else {
                throw new Error("Formato de imagen inválido para Gemini");
            }

            // Call Gemini
            const jsonString = await identifyCardWithGemini(base64Image);
            console.log("Gemini Raw JSON:", jsonString);

            let cardData;
            try {
                cardData = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse Gemini JSON:", e);
                // Fallback if not JSON (rare)
                cardData = { name: jsonString };
            }

            // Handle "NO CARD"
            if (cardData.error === "NO CARD" || !cardData.name) {
                setOcrText("No detectada");
                setStatusMessage("No se detectó ninguna carta. Intenta acercarte más.");

                if (isAutoMode) {
                    // Auto-retry in 1.5s
                    setTimeout(() => {
                        setCapturedImage(null); // Clear image to trigger useEffect/allow camera to flow
                        setOcrText("");
                        startCamera();
                    }, 1500);
                }
                return;
            }

            const cardName = cardData.name;
            const setCode = cardData.set_code;
            // Clean collector number: remove "/281" or "046" -> "46" if needed, though Scryfall handles 046.
            // Critical: Remove the total count suffix "/"
            let collectorNumber = cardData.collector_number;
            if (collectorNumber && typeof collectorNumber === 'string') {
                collectorNumber = collectorNumber.split('/')[0].trim();
            }

            setOcrText(cardName);
            setStatusMessage(`Identificado: "${cardName}" ${setCode ? `(${setCode})` : ''}`);

            // Construct Precise Search Query
            // If we have set and number, we can find the EXACT card version.
            let preciseQuery = `!"${cardName}"`;
            if (setCode) preciseQuery += ` set:${setCode}`;
            if (collectorNumber) preciseQuery += ` cn:${collectorNumber}`;

            setSearchQuery(preciseQuery);
            console.log("Searching Scryfall with:", preciseQuery);

            // Search Scryfall
            await performSearch(preciseQuery);

        } catch (err) {
            console.error("Gemini/Search Error:", err);
            setStatusMessage("Error identificando la carta. Intenta de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    const performSearch = async (query: string) => {
        setIsProcessing(true);
        try {
            const results = await searchCard(query);
            setFoundCards(results);
            if (results.length === 0) {
                setStatusMessage("No se encontraron cartas. Revisa el nombre abajo.");
            } else {
                setStatusMessage(""); // Clear message on success
            }
        } catch (e: any) {
            console.error("Search failed details:", e);
            setStatusMessage(`Búsqueda fallida: ${e.message || "Error desconocido"}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 space-y-6">
            <div className="w-full aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden relative shadow-2xl border border-slate-700">
                {!capturedImage ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!isStreamActive && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <Camera size={48} className="mb-2" />
                                <p>Cámara inactiva</p>
                                <button
                                    onClick={startCamera}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full font-medium"
                                >
                                    Iniciar Cámara
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning Overlay */}
                {isStreamActive && !capturedImage && (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Title Target Box (Top 20%) */}
                        <div className="absolute top-[5%] left-[5%] right-[5%] h-[18%] border-2 border-green-500/80 rounded-lg bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <div className="absolute -bottom-6 w-full text-center text-xs font-bold text-green-400 tracking-wider uppercase drop-shadow-md">
                                ALINEAR TÍTULO AQUÍ
                            </div>
                        </div>

                        {/* General Frame */}
                        <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-lg"></div>

                        {/* Laser Animation */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                {isStreamActive && (
                    <button
                        onClick={captureImage}
                        className="w-16 h-16 rounded-full bg-white border-4 border-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-500" />
                    </button>
                )}

                {capturedImage && (
                    <button
                        onClick={() => {
                            setCapturedImage(null);
                            setFoundCards([]);
                            setOcrText('');
                            startCamera();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                    >
                        <RefreshCw size={20} />
                        Reintentar
                    </button>
                )}
            </div>

            {(isProcessing || statusMessage) && (
                <div className={`font-medium text-center px-4 py-2 rounded-lg ${statusMessage.includes("No") || statusMessage.includes("Error") || statusMessage.includes("failed")
                    ? "bg-red-900/50 text-red-200"
                    : "bg-blue-900/50 text-blue-200 animate-pulse"
                    }`}>
                    {/* Debug View: What the scanner sees */}
                    {debugImage && (
                        <div className="w-full bg-black p-2 rounded border border-slate-600">
                            <p className="text-xs text-slate-400 mb-1">Scanner Validating:</p>
                            <img src={debugImage} alt="Debug Crop" className="w-full h-auto border border-white/20" />
                        </div>
                    )}

                    {/* Status Message */}
                    {statusMessage || "Procesando..."}
                </div>
            )}

            <div className="w-full">
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Nombre manual..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') performSearch(searchQuery);
                            }}
                        />
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    </div>
                    <button
                        onClick={() => performSearch(searchQuery)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {foundCards.length > 0 && (
                <div className="w-full space-y-4">
                    <h3 className="text-lg font-bold text-slate-200 flex justify-between items-center">
                        <span>Cartas Encontradas ({foundCards.length})</span>
                    </h3>
                    <div className="grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {foundCards.map(card => (
                            <div key={card.id} className="bg-slate-800 p-3 rounded-lg flex gap-3 border border-slate-700 hover:border-slate-500 transition-colors">
                                {card.image_uris && (
                                    <img src={card.image_uris.small} alt={card.name} className="w-16 h-auto rounded" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-white truncate">{card.name}</div>
                                    <div className="text-sm text-slate-400">{card.set_name} • #{card.collector_number}</div>
                                    <div className="text-green-400 font-mono mt-1 flex gap-3">
                                        <span>Normal: ${card.prices.usd || 'N/A'}</span>
                                        {card.prices.usd_foil && (
                                            <span className="text-amber-400">✨ Foil: ${card.prices.usd_foil}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCollection(card);
                                            alert(`¡${card.name} añadida a la colección!`);
                                        }}
                                        className="mt-2 text-xs bg-blue-600/50 hover:bg-blue-600 text-blue-100 px-3 py-1.5 rounded transition-colors w-full"
                                    >
                                        + Añadir a Colección
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
