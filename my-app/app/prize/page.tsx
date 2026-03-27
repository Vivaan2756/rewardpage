// "use client";

// import React, { useState, useEffect, useRef } from 'react';

// // Sequence configuration: King (c2), then Queen (c1), then Jack (c3)
// const SHOOT_SEQUENCE = ['c2', 'c1', 'c3'];

// export default function BorderlandTrophyRoom() {
//   const [timeLeft, setTimeLeft] = useState("04");
//   const [currentShotIndex, setCurrentShotIndex] = useState(0);
//   const [revealedIds, setRevealedIds] = useState<string[]>([]);
//   const [isAutoAiming, setIsAutoAiming] = useState(false);
//   const [isRecoil, setIsRecoil] = useState(false);

//   const gunRef = useRef<HTMLDivElement>(null);
//   const muzzleRef = useRef<HTMLDivElement>(null);
//   const laserRef = useRef<HTMLDivElement>(null);

//   // --- EFFECT: Mouse Sway (Manual Aiming) ---
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isAutoAiming || !gunRef.current) return;
//       const sway = (e.clientX - window.innerWidth / 2) / 40;
//       gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [isAutoAiming]);

//   // --- EFFECT: Shooting Sequence Cycle ---
//   useEffect(() => {
//     const startCycle = setTimeout(() => {
//       if (currentShotIndex >= SHOOT_SEQUENCE.length) {
//         setTimeLeft("CLEAR");
//         return;
//       }

//       let countdown = 4;
//       setTimeLeft("04");

//       const timer = setInterval(async () => {
//         countdown--;
//         setTimeLeft(`0${countdown}`);

//         if (countdown <= 0) {
//           clearInterval(timer);
//           await handleAutoShoot();
//         }
//       }, 1000);

//       return () => clearInterval(timer);
//     }, currentShotIndex === 0 ? 1500 : 2000);

//     return () => clearTimeout(startCycle);
//   }, [currentShotIndex]);

//   const handleAutoShoot = async () => {
//     setIsAutoAiming(true);
//     const targetId = SHOOT_SEQUENCE[currentShotIndex];
//     const targetEl = document.getElementById(targetId);

//     if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) return;

//     const rect = targetEl.getBoundingClientRect();
//     const tx = rect.left + rect.width / 2;
//     const ty = rect.top + rect.height / 2;

//     // 1. Aim Gun
//     const sway = (tx - window.innerWidth / 2) / 3;
//     gunRef.current.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
//     gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;

//     await new Promise(r => setTimeout(r, 600));

//     // 2. Position Laser
//     const mPos = muzzleRef.current.getBoundingClientRect();
//     const originX = mPos.left + mPos.width / 2;
//     const originY = mPos.top;
//     const angle = Math.atan2(ty - originY, tx - originX);
//     const dist = Math.sqrt(Math.pow(ty - originY, 2) + Math.pow(tx - originX, 2));

//     const laser = laserRef.current;
//     laser.style.left = `${originX}px`;
//     laser.style.top = `${originY}px`;
//     laser.style.height = `${dist}px`;
//     laser.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
    
//     // 3. Fire
//     laser.style.opacity = '1';
//     setIsRecoil(true);

//     setTimeout(() => {
//       laser.style.opacity = '0';
//       setIsRecoil(false);
//       setRevealedIds(prev => [...prev, targetId]);
//       setIsAutoAiming(false);
//       setCurrentShotIndex(prev => prev + 1);
//     }, 100);
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-black font-sans cursor-crosshair">
//       {/* Background Layer */}
//       <div 
//         className="fixed inset-0 z-0 bg-center bg-cover transition-opacity duration-1000"
//         style={{ backgroundImage: "url('/bg_image.png')", filter: 'brightness(1)' }} 
//       />

//       {/* Timer HUD */}
//       <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[4000] text-center tracking-[8px] text-white">
//         <div className="text-[10px] font-light">COLLECTION STATUS</div>
//         <div 
//           className="text-6xl md:text-[72px] font-black transition-colors duration-500"
//           style={{ 
//             color: timeLeft === "CLEAR" ? '#00ff41' : '#ff1111',
//             textShadow: timeLeft === "CLEAR" ? '0 0 30px rgba(0,255,65,0.5)' : '0 0 30px rgba(255,0,0,0.5)'
//           }}
//         >
//           {timeLeft}
//         </div>
//       </div>

//       {/* Laser Component */}
//       <div 
//         ref={laserRef}
//         className="fixed w-[4px] bg-white shadow-[0_0_15px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0"
//       />

//       {/* Weapon Component */}
//       <div 
//         ref={gunRef}
//         className={`fixed -bottom-[60px] left-1/2 w-[140px] h-[300px] z-[2000] pointer-events-none transition-transform ${
//           isRecoil ? 'translate-y-5 !duration-75' : ''
//         }`}
//         style={{ transform: 'translateX(-50%)' }}
//       >
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[220px] bg-gradient-to-r from-[#050505] via-[#1a1a1a] to-[#050505] rounded-sm border border-[#222]">
//           <div ref={muzzleRef} className="absolute top-0 left-1/2" />
//         </div>
//       </div>

//       {/* Arena Grid */}
//       <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2500px] flex-wrap md:flex-nowrap p-10">
//         <TrophyCard 
//           id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" 
//           glowColor="#1eafd7" imageSrc="queen_trophy.png"
//           isRevealed={revealedIds.includes('c1')}
//           delay="0s"
//         />
//         <TrophyCard 
//           id="c2" suit="♠" title="KING OF SPADES" prize="25,000" 
//           glowColor="#ff4d4d" imageSrc="king_trophy.png"
//           isRevealed={revealedIds.includes('c2')}
//           delay="-2s"
//           isMobileTop
//         />
//         <TrophyCard 
//           id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" 
//           glowColor="#2bff8a" imageSrc="jack_trophy.png"
//           isRevealed={revealedIds.includes('c3')}
//           delay="-4s"
//         />
//       </div>
//     </div>
//   );
// }

// // --- Sub-Component: TrophyCard ---

// interface CardProps {
//   id: string;
//   suit: string;
//   title: string;
//   prize: string;
//   glowColor: string;
//   isRevealed: boolean;
//   delay: string;
//   imageSrc: string;
//   isMobileTop?: boolean;
// }

// function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, isMobileTop }: CardProps) {
//   return (
//     <div 
//       id={id}
//       className={`relative w-[140px] h-[200px] md:w-[240px] md:h-[350px] transition-all duration-700
//         ${isMobileTop ? 'order-1 w-full flex justify-center md:w-[240px] mb-4 md:mb-0' : 'order-2'}
//       `}
//       style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
//     >
//       <div className={`relative w-[140px] md:w-full h-full transition-transform duration-[1.5s] preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
        
//         {/* Card Back */}
//         <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#111] to-[#050505] border border-[#222] rounded-xl flex items-center justify-center text-4xl md:text-8xl text-[#1a1a1a] shadow-2xl">
//           {suit}
//         </div>

//         {/* Card Front */}
//         <div 
//           className="absolute inset-0 backface-hidden rotate-y-180 bg-[radial-gradient(circle_at_center,#151515_0%,#000_100%)] border rounded-xl flex flex-col items-center justify-center overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
//           style={{ borderColor: 'rgba(255,255,255,0.1)' }}
//         >
//           {/* Trophy Image */}
//           <img 
//             src={imageSrc} 
//             alt={title}
//             className={`absolute w-[140%] max-w-none pointer-events-none transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]
//               ${isRevealed ? 'opacity-100' : 'opacity-0'}
//             `}
//             style={{ 
//               left: '50%', 
//               top: isRevealed ? '50%' : '40%',
//               transform: isRevealed ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -40%) scale(0.6)',
//               filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'drop-shadow(0 10px 20px rgba(0,0,0,1))',
//               animation: isRevealed ? 'trophy-pulse 4s infinite ease-in-out' : 'none'
//             }}
//           />
          
//           <div 
//             className={`absolute bottom-10 md:bottom-[60px] text-white text-base md:text-[28px] font-black tracking-widest transition-all duration-1000 delay-500 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
//             style={{ textShadow: `0 0 15px ${glowColor}` }}
//           >
//             {prize}
//           </div>

//           <div className="absolute bottom-5 w-[85%] md:w-[70%] border-t border-[#333] pt-2 text-[7px] md:text-[10px] text-[#555] tracking-[3px] text-center">
//             {title}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from 'react';

// Sequence configuration: King (c2) first, then Queen (c1), then Jack (c3)
const SHOOT_SEQUENCE = ['c2', 'c1', 'c3'];

// 1. Define the Interface for the sub-component props
interface CardProps {
  id: string;
  suit: string;
  title: string;
  prize: string;
  glowColor: string;
  isRevealed: boolean;
  delay: string;
  imageSrc: string;
  positionOrder: string;
}

// 2. Sub-Component: TrophyCard (Defined outside to keep main component clean)
function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, positionOrder }: CardProps) {
  return (
    <div 
      id={id}
      className={`relative w-[140px] h-[200px] md:w-[240px] md:h-[350px] transition-all duration-700 ${positionOrder}`}
      style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
    >
      <div className={`relative w-[140px] md:w-full h-full transition-transform duration-[1.5s] preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
        
        {/* Card Back */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#111] to-[#050505] border border-[#222] rounded-xl flex items-center justify-center text-4xl md:text-8xl text-[#1a1a1a] shadow-2xl">
          {suit}
        </div>

        {/* Card Front */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-[radial-gradient(circle_at_center,#151515_0%,#000_100%)] border rounded-xl flex flex-col items-center justify-center overflow-visible shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {/* Trophy Image */}
          <img 
            src={imageSrc} 
            alt={title}
            className={`absolute w-[140%] max-w-none pointer-events-none transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isRevealed ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ 
              left: '50%', 
              top: isRevealed ? '50%' : '40%',
              transform: isRevealed ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -40%) scale(0.6)',
              filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'drop-shadow(0 10px 20px rgba(0,0,0,1))',
              animation: isRevealed ? 'trophy-pulse 4s infinite ease-in-out' : 'none'
            }}
          />
          
          <div 
            className={`absolute bottom-10 md:bottom-[60px] text-white text-base md:text-[28px] font-black tracking-widest transition-all duration-1000 delay-500 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ textShadow: `0 0 15px ${glowColor}` }}
          >
            {prize}
          </div>

          <div className="absolute bottom-5 w-[85%] md:w-[70%] border-t border-[#333] pt-2 text-[7px] md:text-[10px] text-[#555] tracking-[3px] text-center">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Main Exported Page Component
export default function PrizePage() {
  const [timeLeft, setTimeLeft] = useState("04");
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [isAutoAiming, setIsAutoAiming] = useState(false);
  const [isRecoil, setIsRecoil] = useState(false);

  const gunRef = useRef<HTMLDivElement>(null);
  const muzzleRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isAutoAiming || !gunRef.current) return;
      const sway = (e.clientX - window.innerWidth / 2) / 40;
      gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAutoAiming]);

  useEffect(() => {
    const startCycle = setTimeout(() => {
      if (currentShotIndex >= SHOOT_SEQUENCE.length) {
        setTimeLeft("CLEAR");
        return;
      }

      let countdown = 4;
      setTimeLeft("04");

      const timer = setInterval(async () => {
        countdown--;
        setTimeLeft(`0${countdown}`);

        if (countdown <= 0) {
          clearInterval(timer);
          await handleAutoShoot();
        }
      }, 1000);

      return () => clearInterval(timer);
    }, currentShotIndex === 0 ? 1500 : 2000);

    return () => clearTimeout(startCycle);
  }, [currentShotIndex]);

  const handleAutoShoot = async () => {
    setIsAutoAiming(true);
    const targetId = SHOOT_SEQUENCE[currentShotIndex];
    const targetEl = document.getElementById(targetId);

    if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) return;

    const rect = targetEl.getBoundingClientRect();
    const tx = rect.left + rect.width / 2;
    const ty = rect.top + rect.height / 2;

    const sway = (tx - window.innerWidth / 2) / 3;
    gunRef.current.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;

    await new Promise(r => setTimeout(r, 600));

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
    
    laser.style.opacity = '1';
    setIsRecoil(true);

    setTimeout(() => {
      laser.style.opacity = '0';
      setIsRecoil(false);
      setRevealedIds(prev => [...prev, targetId]);
      setIsAutoAiming(false);
      setCurrentShotIndex(prev => prev + 1);
    }, 100);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans cursor-crosshair">
      <div 
        className="fixed inset-0 z-0 bg-center bg-cover transition-opacity duration-1000"
        style={{ backgroundImage: "url('/bg_image.png')", filter: 'brightness(1)' }} 
      />

      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[4000] text-center tracking-[8px] text-white">
        <div className="text-[10px] font-light">COLLECTION STATUS</div>
        <div 
          className="text-6xl md:text-[72px] font-black transition-colors duration-500"
          style={{ 
            color: timeLeft === "CLEAR" ? '#00ff41' : '#ff1111',
            textShadow: timeLeft === "CLEAR" ? '0 0 30px rgba(0,255,65,0.5)' : '0 0 30px rgba(255,0,0,0.5)'
          }}
        >
          {timeLeft}
        </div>
      </div>

      <div 
        ref={laserRef}
        className="fixed w-[4px] bg-white shadow-[0_0_15px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0"
      />

      <div 
        ref={gunRef}
        className={`fixed -bottom-[60px] left-1/2 w-[140px] h-[300px] z-[2000] pointer-events-none transition-transform ${
          isRecoil ? 'translate-y-5 !duration-75' : ''
        }`}
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[220px] bg-gradient-to-r from-[#050505] via-[#1a1a1a] to-[#050505] rounded-sm border border-[#222]">
          <div ref={muzzleRef} className="absolute top-0 left-1/2" />
        </div>
      </div>

      <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2500px] flex-wrap md:flex-nowrap p-10">
        <TrophyCard 
          id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" 
          glowColor="#1eafd7" imageSrc="queen_trophy.png"
          isRevealed={revealedIds.includes('c1')}
          delay="0s"
          positionOrder="md:order-1"
        />
        <TrophyCard 
          id="c2" suit="♠" title="KING OF SPADES" prize="25,000" 
          glowColor="#ff4d4d" imageSrc="king_trophy.png"
          isRevealed={revealedIds.includes('c2')}
          delay="-2s"
          positionOrder="md:order-2"
        />
        <TrophyCard 
          id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" 
          glowColor="#2bff8a" imageSrc="jack_trophy.png"
          isRevealed={revealedIds.includes('c3')}
          delay="-4s"
          positionOrder="md:order-3"
        />
      </div>
    </div>
  );
}