import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Flood fill util for pot de peinture
function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const targetColor = [data[(y * width + x) * 4], data[(y * width + x) * 4 + 1], data[(y * width + x) * 4 + 2], data[(y * width + x) * 4 + 3]];
  const fillR = parseInt(fillColor.slice(1, 3), 16);
  const fillG = parseInt(fillColor.slice(3, 5), 16);
  const fillB = parseInt(fillColor.slice(5, 7), 16);

  if (targetColor[0] === fillR && targetColor[1] === fillG && targetColor[2] === fillB) return;

  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    const idx = (cy * width + cx) * 4;
    if (
      cx >= 0 && cx < width && cy >= 0 && cy < height &&
      data[idx] === targetColor[0] && data[idx + 1] === targetColor[1] && data[idx + 2] === targetColor[2]
    ) {
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

interface CanvasProps {
  drawingId: string;
}

const Canvas: React.FC<CanvasProps> = ({ drawingId }) => {
  const [error, setError] = useState<string | null>(null);
  // HOOKS (définis une seule fois)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isFill, setIsFill] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [isMuseum, setIsMuseum] = useState<boolean>(false);
  const [immortalized, setImmortalized] = useState<boolean>(false);
  const [prevPos, setPrevPos] = useState<{x: number, y: number} | null>(null);

  // 1. Initialisation du contexte canvas (fond blanc)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // 2. Chargement du canevas sauvegardé et état musée au montage
  useEffect(() => {
    async function fetchCanvas() {
      if (!drawingId || !canvasRef.current) return;
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/drawings/${drawingId}`);
        if (res.status === 404) {
          setError('Ce dessin n’existe pas ou a été supprimé.');
          return;
        }
        if (!res.ok) {
          setError(`Erreur lors du chargement du dessin (code ${res.status})`);
          return;
        }
        const data = await res.json();
        if (data.drawing && data.drawing.canvasData) {
          const img = new window.Image();
          img.src = data.drawing.canvasData;
          img.onload = () => {
            const ctx = canvasRef.current!.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
              ctx.drawImage(img, 0, 0);
              setContext(ctx);
            }
          };
        }
        if (data.drawing && data.drawing.isImmortalized) {
          setIsMuseum(true);
          setImmortalized(true);
          // setTimerActive supprimé (timer géré dans DrawingSession)false);
        }
      } catch (e) {
        setError('Erreur réseau lors du chargement du dessin.');
      }
    }
    fetchCanvas();
    // eslint-disable-next-line
  }, [drawingId]);

  // 3. Initialisation du socket et listeners
  useEffect(() => {
    if (!context || !drawingId) return;
    const sock = io(API_BASE_URL);
    setSocket(sock);
    sock.on('connect', () => {
      console.log('[SOCKET] (connect event) id:', sock.id);
      // On peut ici éventuellement réémettre joinRoom si besoin
    });
    console.log('[SOCKET] Connecté, id:', sock.id);
    // Rejoindre la room correspondant au drawingId
    console.log('[SOCKET] joinRoom:', drawingId);
    sock.emit('joinRoom', drawingId);
    // Demande l'état du canvas aux autres (si on vient d'arriver)
    console.log('[SOCKET] requestCanvasState:', drawingId);
    sock.emit('requestCanvasState', drawingId);

    // Quand on reçoit un trait, applique-le ET pushHistory pour undo/redo synchro
    const handleDrawing = (data: { color: string; lineWidth: number; prevX: number; prevY: number; x: number; y: number; roomId?: string; author?: string }) => {
      console.log('[SOCKET][RECV] drawing', data);
      if (!context || !canvasRef.current) return;
      // Ignore si l'event vient de soi-même
      if (data.author && socket && data.author === socket.id) {
        console.log('[SOCKET][RECV] drawing ignoré (auteur = moi)', data);
        return;
      }
      context.strokeStyle = data.color;
      context.lineWidth = data.lineWidth;
      context.beginPath();
      context.moveTo(data.prevX, data.prevY);
      context.lineTo(data.x, data.y);
      context.stroke();
      context.closePath();
      pushHistory(canvasRef.current.toDataURL());
    };
    const handleFill = (data: { x: number; y: number; color: string; roomId?: string; author?: string }) => {
      if (!context || !canvasRef.current) return;
      if (data.author && socket && data.author === socket.id) return;
      floodFill(context, data.x, data.y, data.color);
      pushHistory(canvasRef.current.toDataURL());
    };
    const handleImmortalize = () => {
      setIsMuseum(true);
      setImmortalized(true);
      // setTimerActive supprimé (timer géré dans DrawingSession)false);
    };
    // Quand on reçoit l'état complet du canvas (base64), on recharge l'image
    const handleCanvasState = (data: { canvasData: string }) => {
      if (!canvasRef.current || !data.canvasData) return;
      const img = new window.Image();
      img.src = data.canvasData;
      img.onload = () => {
        const ctx = canvasRef.current!.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
          setContext(ctx);
        }
      };
    };
    sock.on('drawing', handleDrawing);
    sock.on('fill', handleFill);
    sock.on('immortalize', handleImmortalize);
    sock.on('canvasState', handleCanvasState);
    return () => {
      sock.off('drawing', handleDrawing);
      sock.off('fill', handleFill);
      sock.off('immortalize', handleImmortalize);
      sock.off('canvasState', handleCanvasState);
      sock.disconnect();
    };
  }, [context, drawingId]);

  // Quand on reçoit une demande d'état du canvas, on l'envoie si on n'est pas "vide"
  useEffect(() => {
    if (!socket || !drawingId || !canvasRef.current) return;
    const handleRequest = (roomId: string) => {
      if (roomId !== drawingId) return;
      // Envoie l'état actuel sous forme de dataURL
      socket.emit('canvasState', {
        roomId: drawingId,
        canvasData: canvasRef.current!.toDataURL()
      });
    };
    socket.on('requestCanvasState', handleRequest);
    return () => {
      socket.off('requestCanvasState', handleRequest);
    };
  }, [socket, drawingId, canvasRef]);


  // Corriger les callbacks pour history/redoStack
  const pushHistory = (dataUrl: string) => {
    setHistory((h: string[]) => [...h, dataUrl]);
    setRedoStack([]);
  };

  // --- Handlers internes ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (context && !isMuseum && !isFill) {
      setDrawing(true);
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setPrevPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      if (canvasRef.current) pushHistory(canvasRef.current.toDataURL());
    } else if (context && isFill && socket && !isMuseum) {
      floodFill(context, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color);
      socket.emit('fill', {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        color,
        roomId: drawingId,
        author: socket.id,
      });
      if (canvasRef.current) pushHistory(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && context && prevPos && socket && !isMuseum && !isFill) {
      const drawColor = isEraser ? '#ffffff' : color;
      context.strokeStyle = drawColor;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(prevPos.x, prevPos.y);
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      const drawingEvent = {
        prevX: prevPos.x,
        prevY: prevPos.y,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        color: drawColor,
        lineWidth,
        roomId: drawingId,
        author: socket.id,
      };
      console.log('[SOCKET][SEND] drawing', drawingEvent);
      socket.emit('drawing', drawingEvent);
      setPrevPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    setPrevPos(null);
    if (context) context.closePath();
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (canvas && context) {
      setRedoStack((r) => [canvas.toDataURL(), ...r]);
      const last = history[history.length - 1];
      const img = new window.Image();
      img.src = last;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      setHistory((h) => h.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (canvas && context) {
      setHistory((h) => [...h, canvas.toDataURL()]);
      const next = redoStack[0];
      const img = new window.Image();
      img.src = next;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      setRedoStack((r) => r.slice(1));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setIsEraser(false);
    setIsFill(false);
  };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineWidth(Number(e.target.value));
  };

  const handleImmortalize = async () => {
    if (!drawingId || !canvasRef.current) return;
    try {
      const data = canvasRef.current.toDataURL();
      const res = await fetch(`${API_BASE_URL}/api/drawings/${drawingId}/immortalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasData: data }),
      });
      if (res.ok) {
        setIsMuseum(true);
        setImmortalized(true);
        // setTimerActive supprimé (timer géré dans DrawingSession)false);
        if (socket) socket.emit('immortalize');
      }
    } catch (err) {
      // Optionnel : feedback utilisateur
    }
  };
  // --- FIN Handlers internes ---

  // --- Auto-save du dessin toutes les 5s + flush immédiat à chaque modif ---
  const autoSave = React.useCallback(() => {
    if (!canvasRef.current || !drawingId || isMuseum) return;
    const data = canvasRef.current.toDataURL();
    fetch(`${API_BASE_URL}/api/drawings/${drawingId}/canvas`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasData: data }),
    })
      .then((res) => {
        if (!res.ok) {
          setError('Erreur lors de la sauvegarde du dessin (code ' + res.status + ')');
        } else {
          setError(null);
          console.log('[Auto-save] Canvas saved to DB.');
        }
      })
      .catch((err) => {
        setError('Erreur réseau lors de la sauvegarde du dessin.');
        console.log('Auto-save error:', err);
      });
  }, [drawingId, isMuseum]);

  React.useEffect(() => {
    if (isMuseum) return;
    const interval = setInterval(() => {
      autoSave();
    }, 5000);
    return () => clearInterval(interval);
  }, [isMuseum, drawingId, autoSave]);

  // Flush auto-save après chaque modif du dessin
  React.useEffect(() => {
    if (isMuseum) return;
    if (!canvasRef.current) return;
    autoSave();
  }, [history, redoStack, isMuseum, autoSave]);

  // S'assurer que le composant retourne du JSX valide
  // (exemple simplifié, à adapter selon ton rendu complet)
  return (
    <div className="canvas-container">
      {isMuseum && <div className="museum-banner">Ce dessin est immortalisé !</div>}
      {error && <div className="canvas-error" style={{color:'red',marginBottom:'8px'}}>{error}</div>}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000', cursor: isMuseum ? 'not-allowed' : isFill ? 'crosshair' : 'pointer' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="toolbar">
        <button
          className={isEraser ? 'active' : ''}
          onClick={() => { setIsEraser(!isEraser); setIsFill(false); }}
          disabled={isMuseum}
        >
          🧽 Gomme
        </button>
        <button
          className={isFill ? 'active' : ''}
          onClick={() => { setIsFill(!isFill); setIsEraser(false); }}
          disabled={isMuseum}
        >
          🪣 Pot de peinture
        </button>
        <input type="color" value={color} onChange={handleColorChange} disabled={isEraser || isMuseum} />
        <input type="range" min="1" max="50" value={lineWidth} onChange={handleLineWidthChange} disabled={isMuseum} />
        <span>{lineWidth}px</span>
        <button onClick={handleUndo} disabled={history.length === 0 || isMuseum}>↩️ Undo</button>
        <button onClick={handleRedo} disabled={redoStack.length === 0 || isMuseum}>↪️ Redo</button>

      </div>
    </div>
  );
};

export default Canvas;