"use client";

import React, { useState, useEffect, useRef } from 'react';

const SHOOT_SEQUENCE = ['c2', 'c1', 'c3'];

// --- Components ---

function ShatterEffect({ color }: { color: string }) {
  const shards = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    tx: (Math.random() - 0.5) * 400, 
    ty: Math.random() * 500 + 300,   
    rot: Math.random() * 720,        
    size: Math.random() * 15 + 5,    
    delay: Math.random() * 0.1,
    bg: i % 3 === 0 ? '#fff' : color, 
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {shards.map((s) => (
        <div
          key={s.id}
          className="absolute backdrop-blur-[1px]"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.bg,
            boxShadow: `0 0 10px ${s.bg}`,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            animation: `fallDown 1.2s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94) ${s.delay}s`,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            '--rot': `${s.rot}deg`,
          } as any}
        />
      ))}
    </div>
  );
}

function CrackedOverlay({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden bg-white/10 backdrop-blur-[1px]">
      <svg className="w-full h-full stroke-white/80 stroke-[3px] fill-none" viewBox="0 0 100 100">
        <path d="M50 50 L55 40 L45 30 L52 15" className="animate-pulse" />
        <path d="M50 50 L65 55 L75 45 L90 52" className="animate-pulse" />
        <path d="M50 50 L40 60 L45 75 L30 85" className="animate-pulse" />
        <path d="M50 50 L35 45 L25 55 L10 40" className="animate-pulse" />
        <circle cx="50" cy="50" r="5" style={{ stroke: color }} className="opacity-50" />
      </svg>
      <div className="absolute inset-0 bg-white animate-impact-flash" />
    </div>
  );
}

function TrophyCard({ id, title, prize, glowColor, isRevealed, delay, imageSrc, frontImage, isCracking, isFanned, index, onManualClick }: any) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTransform = () => {
    if (!isFanned) return 'translate(0, 0) scale(0.5)';
    if (isMobile) {
      switch (id) {
        case 'c2': return 'translate(0, -30%) scale(0.8)'; 
        case 'c1': return 'translate(-50%, 55%) scale(0.8)';
        case 'c3': return 'translate(50%, 55%) scale(0.8)';
        default: return 'translate(0,0)';
      }
    }
    const xOffsets = ["-140%", "0%", "140%"];
    const rotations = ["-5deg", "0deg", "5deg"];
    return `translateX(${xOffsets[index]}) rotate(${rotations[index]})`;
  };

  const fanStyle = {
    transform: getTransform(),
    opacity: isFanned ? 1 : 0.8,
    zIndex: isFanned ? (id === 'c2' ? 1010 : 1000 + index) : 1000 + index,
    transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  return (
    <div 
      id={id}
      onClick={() => onManualClick(id, glowColor)}
      className={`absolute w-[160px] h-[230px] md:w-[260px] md:h-[380px] cursor-crosshair transition-transform active:scale-90 ${isRevealed ? 'pointer-events-none' : 'pointer-events-auto'}`}
      style={fanStyle}
    >
      <div className="w-full h-full preserve-3d" style={{ animation: isFanned ? `drift 8s ease-in-out infinite ${delay}` : 'none' }}>
        <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ background: 'transparent', boxShadow: isRevealed ? `0 0 50px ${glowColor}33` : 'none' }}>
          <img 
            src={imageSrc} 
            alt={title} 
            className="absolute w-[180%] h-[180%] object-contain max-w-none pointer-events-none z-10"
            style={{ 
                top: '40%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'none' 
            }} 
          />
          <div className="absolute bottom-10 z-20 text-center">
            <div className="text-white text-2xl md:text-4xl font-black" style={{ textShadow: `0 0 20px ${glowColor}` }}>{prize}</div>
            <div className="text-[8px] md:text-[10px] text-white/40 tracking-[4px] uppercase mt-2">{title}</div>
          </div>
        </div>
        <div className={`absolute inset-0 z-30 overflow-hidden bg-transparent border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-150 ${isRevealed ? 'animate-shatter pointer-events-none' : 'opacity-100'}`}>
          <img src={frontImage} alt="card face" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          {isCracking && <CrackedOverlay color={glowColor} />}
        </div>
        {isRevealed && <ShatterEffect color={glowColor} />}
      </div>
    </div>
  );
}

export default function BorderlandGame() {
  const [isFanned, setIsFanned] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [crackingId, setCrackingId] = useState<string | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [activeColor, setActiveColor] = useState('#ffffff');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [shake, setShake] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const gunRef = useRef<HTMLDivElement>(null);
  const muzzleRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs
  const breakSound = useRef<HTMLAudioElement | null>(null);
  const laserSound = useRef<HTMLAudioElement | null>(null);
  const ambientSound = useRef<HTMLAudioElement | null>(null);
  const audioUnlocked = useRef(false);

  const isGameOver = revealedIds.length >= SHOOT_SEQUENCE.length;

  const tryStartAmbient = () => {
    if (audioUnlocked.current || !ambientSound.current) return;
    
    // Play with catch to handle browser's NotAllowedError silently
    ambientSound.current.play()
      .then(() => { 
        audioUnlocked.current = true; 
      })
      .catch(() => {
        // Silent catch: Browser still blocking, wait for next interaction
      });

    // Prime the effects
    [breakSound.current, laserSound.current].forEach(s => {
      if (s) {
        s.muted = true;
        s.play().then(() => { 
            s.pause(); 
            s.muted = false; 
            s.currentTime = 0; 
        }).catch(() => {});
      }
    });
  };

  useEffect(() => {
    breakSound.current = new Audio('/glass-break.mp3');
    laserSound.current = new Audio('/laser.mp3');
    ambientSound.current = new Audio('/ambient-hum.mp3');

    if (ambientSound.current) {
      ambientSound.current.loop = true;
      ambientSound.current.volume = 0.3;
    }

    const fannedTimer = setTimeout(() => setIsFanned(true), 1000);

    return () => {
      clearTimeout(fannedTimer);
      ambientSound.current?.pause();
    };
  }, []);

  // Update volume when mute state changes
  useEffect(() => {
    if (ambientSound.current) ambientSound.current.muted = isMuted;
    if (breakSound.current) breakSound.current.muted = isMuted;
    if (laserSound.current) laserSound.current.muted = isMuted;
  }, [isMuted]);

  // Auto-mode logic
  useEffect(() => {
    if (!isFanned || isGameOver) return;
    if (revealedIds.length === 0 && !isAutoMode) {
      const startAutoTimer = setTimeout(() => setIsAutoMode(true), 4000);
      return () => clearTimeout(startAutoTimer);
    }
    if (isAutoMode && !isFiring) {
      const nextId = SHOOT_SEQUENCE.find(id => !revealedIds.includes(id));
      const nextCard = CARDS_DATA.find(c => c.id === nextId);
      if (nextCard) {
        const autoShootTimer = setTimeout(() => handleShoot(nextCard.id, nextCard.color), 1500);
        return () => clearTimeout(autoShootTimer);
      }
    }
  }, [isFanned, revealedIds, isAutoMode, isFiring, isGameOver]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isFiring || isGameOver || !gunRef.current) return;
      const sway = (e.clientX - window.innerWidth / 2) / 40;
      gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
      gunRef.current.style.setProperty('--sway', `${sway}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFiring, isGameOver]);

  const handleShoot = async (targetId: string, color: string) => {
    if (!isFanned || isFiring || revealedIds.includes(targetId)) return;
    
    tryStartAmbient();

    const targetEl = document.getElementById(targetId);
    if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) return;

    const rect = targetEl.getBoundingClientRect();
    const tx = rect.left + rect.width / 2;
    const ty = rect.top + rect.height / 2;
    const sway = (tx - window.innerWidth / 2) / 4;

    gunRef.current.style.transition = "transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
    gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px)) scale(1.1)`;
    gunRef.current.style.setProperty('--sway', `${sway}px`);

    await new Promise(r => setTimeout(r, 400));

    if (laserSound.current) {
        laserSound.current.currentTime = 0;
        laserSound.current.play().catch(() => {});
    }

    setIsFiring(true);
    setActiveColor(color);

    const mPos = muzzleRef.current.getBoundingClientRect();
    const originX = mPos.left + mPos.width / 2;
    const originY = mPos.top;
    const angle = Math.atan2(ty - originY, tx - originX);
    const dist = Math.sqrt(Math.pow(ty - originY, 2) + Math.pow(tx - originX, 2));

    const laser = laserRef.current;
    laser.style.left = `${originX}px`;
    laser.style.top = `${originY}px`;
    laser.style.height = `${dist}px`;
    laser.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
    
    laser.style.backgroundColor = 'white';
    laser.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    laser.style.opacity = '1';
    
    setShake(true);
    setCrackingId(targetId); 
    
    if (breakSound.current) {
        breakSound.current.currentTime = 0;
        breakSound.current.play().catch(() => {});
    }

    setTimeout(() => {
      laser.style.opacity = '0';
      setShake(false);
      setRevealedIds(prev => [...prev, targetId]);
      setCrackingId(null); 
      setIsFiring(false);
    }, 400);
  };

  const handleManualClick = (id: string, color: string) => {
    setIsAutoMode(false);
    handleShoot(id, color);
  };

  const CARDS_DATA = [
    { id: "c1", prize: "₹15,000", color: "#1eafd7", img: "queen_trophy.png", frontImg: "heartofqueen.png", delay: "0s" },
    { id: "c2", prize: "₹25,000", color: "#fb923c", img: "king_trophy.png", frontImg: "kingofspades.png", delay: "-2s" },
    { id: "c3", prize: "₹10,000", color: "#2bff8a", img: "jack_trophy.png", frontImg: "jackofclubs.png", delay: "-4s" }
  ];

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden bg-black transition-transform duration-75 ${shake ? 'scale-[1.02]' : 'scale-100'}`}
      onPointerDown={tryStartAmbient}
    >
      <div className="fixed inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('/bgimage.png')", filter: 'brightness(0.5) contrast(1.2)' }} />
      
      {/* Audio Toggle */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
        className="fixed top-6 right-6 z-[5000] p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        )}
      </button>

      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[4000] text-center w-full">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-wide" style={{ textShadow: '0 0 20px #ff5555' }}>BORDERLAND PRIZE VAULT</h1>
         <p className="text-white/60 mt-2 text-sm md:text-base tracking-wide uppercase font-bold tracking-[0.2em]">SHOOT THE CARDS TO REVEAL THE PRIZES!</p>
      </div>

      <div ref={laserRef} className="fixed w-[4px] z-[1500] pointer-events-none origin-top opacity-0 transition-opacity duration-100" />

      <div 
        ref={gunRef} 
        className={`fixed left-1/2 w-[140px] h-[220px] z-[2000] pointer-events-none -translate-x-1/2 transition-all duration-700 ease-in-out ${isFiring ? 'animate-recoil' : ''} ${isGameOver ? '-bottom-64 opacity-0' : '-bottom-10 opacity-100'}`}
        style={{ '--sway': '0px' } as any}
      >
        <div className="relative w-12 h-64 mx-auto">
          {isFiring && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-50 pointer-events-none">
                <div className="absolute inset-0 bg-white rounded-full blur-md animate-muzzle-flare" />
                <div className="absolute inset-0 rounded-full blur-2xl animate-muzzle-flare" style={{ backgroundColor: activeColor, animationDelay: '50ms', opacity: 0.6 }} />
            </div>
          )}
          <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 border-x border-white/20 rounded-t-xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)]">
            <div ref={muzzleRef} className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-6 bg-neutral-800 rounded-t-lg border-t border-white/40 shadow-xl" />
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center h-full w-full perspective-[2000px]">
        {CARDS_DATA.map((card, idx) => (
          <TrophyCard 
            key={card.id}
            id={card.id}
            index={idx}
            isFanned={isFanned}
            prize={card.prize}
            glowColor={card.color}
            isRevealed={revealedIds.includes(card.id)}
            isCracking={crackingId === card.id}
            delay={card.delay}
            imageSrc={card.img}
            frontImage={card.frontImg}
            onManualClick={handleManualClick}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes impact-flash { 0% { opacity: 0; } 20% { opacity: 0.8; } 100% { opacity: 0; } }
        @keyframes fallDown {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes shatter {
          0% { opacity: 1; transform: scale(1); filter: contrast(1); }
          20% { opacity: 1; transform: scale(1.05) rotate(2deg); filter: contrast(2) brightness(2); }
          100% { opacity: 0; transform: scale(1.8); filter: blur(20px) brightness(4); }
        }
        @keyframes recoil {
          0% { transform: translateX(calc(-50% + var(--sway))) translateY(0) scale(1.1); }
          20% { transform: translateX(calc(-50% + var(--sway))) translateY(40px) scale(1.25); }
          100% { transform: translateX(calc(-50% + var(--sway))) translateY(0) scale(1.1); }
        }
        @keyframes muzzle-flare {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-recoil { animation: recoil 0.15s ease-out; }
        .animate-muzzle-flare { animation: muzzle-flare 0.2s ease-out forwards; }
        .animate-shatter { animation: shatter 0.5s forwards ease-out; }
        .animate-impact-flash { animation: impact-flash 0.3s forwards; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}