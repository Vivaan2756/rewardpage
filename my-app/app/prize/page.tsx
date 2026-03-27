

// "use client";

// import React, { useState, useEffect, useRef } from 'react';

// const SHOOT_SEQUENCE = ['c2', 'c1', 'c3'];

// interface CardProps {
//   id: string;
//   suit: string;
//   title: string;
//   prize: string;
//   glowColor: string;
//   isRevealed: boolean;
//   delay: string;
//   imageSrc: string;
//   positionOrder: string;
// }

// // --- Card Component with Shatter Animation ---
// function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, positionOrder }: CardProps) {
//   return (
//     <div 
//       id={id}
//       className={`relative w-[160px] h-[230px] md:w-[260px] md:h-[380px] transition-all duration-500 ${positionOrder}`}
//       style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
//     >
//       <div className="relative w-full h-full preserve-3d">
        
//         {/* REVEALED CONTENT (Trophy & Prize) */}
//         <div 
//           className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-1000 ease-out ${
//             isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
//           }`}
//           style={{ 
//             background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
//             boxShadow: isRevealed ? `0 0 50px ${glowColor}33` : 'none'
//           }}
//         >
//           <img 
//             src={imageSrc} 
//             alt={title}
//             className="absolute w-[140%] max-w-none pointer-events-none z-10"
//             style={{ 
//               top: '45%', left: '50%',
//               transform: 'translate(-50%, -50%)',
//               filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'none',
//             }}
//           />
//           <div className="absolute bottom-10 z-20 text-center">
//             <div className="text-white text-2xl md:text-4xl font-black" style={{ textShadow: `0 0 20px ${glowColor}` }}>
//               {prize}
//             </div>
//             <div className="text-[8px] md:text-[10px] text-white/40 tracking-[4px] uppercase mt-2">{title}</div>
//           </div>
//         </div>

//         {/* FRAGILE CARD BACK (The part that cracks) */}
//         <div 
//           className={`absolute inset-0 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-7xl md:text-9xl text-white/5 shadow-2xl transition-all duration-150 ${
//             isRevealed ? 'animate-shatter pointer-events-none' : 'opacity-100'
//           }`}
//         >
//           <span className="select-none font-black italic opacity-20">{suit}</span>
          
//           {/* Subtle "Crack" lines overlay (visible just before shatter) */}
//           <div className={`absolute inset-0 opacity-0 bg-[url('https://www.transparenttextures.com/patterns/glass-shattered.png')] invert transition-opacity duration-75 ${isRevealed ? 'opacity-100' : ''}`} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PrizePage() {
//   const [timeLeft, setTimeLeft] = useState("02");
//   const [currentShotIndex, setCurrentShotIndex] = useState(0);
//   const [revealedIds, setRevealedIds] = useState<string[]>([]);
//   const [isAutoAiming, setIsAutoAiming] = useState(false);
//   const [isRecoil, setIsRecoil] = useState(false);
//   const [shake, setShake] = useState(false);

//   const gunRef = useRef<HTMLDivElement>(null);
//   const muzzleRef = useRef<HTMLDivElement>(null);
//   const laserRef = useRef<HTMLDivElement>(null);

//   // Mouse interactivity
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isAutoAiming || !gunRef.current) return;
//       const sway = (e.clientX - window.innerWidth / 2) / 40;
//       gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [isAutoAiming]);

//   // 2-Second Timer Cycle
//   useEffect(() => {
//     if (currentShotIndex >= SHOOT_SEQUENCE.length) {
//       setTimeout(() => setTimeLeft("CLEAR"), 500);
//       return;
//     }

//     let countdown = 2;
//     setTimeLeft("02");

//     const timer = setInterval(async () => {
//       countdown--;
//       if (countdown >= 0) setTimeLeft(`0${countdown}`);

//       if (countdown <= 0) {
//         clearInterval(timer);
//         await handleAutoShoot();
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [currentShotIndex]);

//   const handleAutoShoot = async () => {
//     setIsAutoAiming(true);
//     const targetId = SHOOT_SEQUENCE[currentShotIndex];
//     const targetEl = document.getElementById(targetId);

//     if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) return;

//     // 1. Aim to Target
//     const rect = targetEl.getBoundingClientRect();
//     const tx = rect.left + rect.width / 2;
//     const ty = rect.top + rect.height / 2;

//     const sway = (tx - window.innerWidth / 2) / 4;
//     gunRef.current.style.transition = "transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
//     gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px)) scale(1.05)`;

//     await new Promise(r => setTimeout(r, 450));

//     // 2. Fire Laser
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
    
//     laser.style.opacity = '1';
//     setIsRecoil(true);
//     setShake(true);

//     // 3. Impact & Shatter
//     setTimeout(() => {
//       laser.style.opacity = '0';
//       setIsRecoil(false);
//       setShake(false);
//       setRevealedIds(prev => [...prev, targetId]);
//       setIsAutoAiming(false);
//       setCurrentShotIndex(prev => prev + 1);
//     }, 100);
//   };

//   return (
//     <div className={`relative w-full h-screen overflow-hidden bg-black transition-transform duration-75 ${shake ? 'scale-105 rotate-1' : 'scale-100'}`}>
      
//       {/* Cinematic Background */}
//       <div 
//         className="fixed inset-0 z-0 bg-center bg-cover"
//         style={{ backgroundImage: "url('/bg_image.jpeg')", filter: 'brightness(0.3) contrast(1.2)' }} 
//       />
//       <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-black/80" />

//       {/* VISA HUD */}
//       <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[4000] text-center tracking-[10px]">
//         <div className="text-[10px] text-white/40 font-bold uppercase mb-1">Protocol Status</div>
//         <div 
//           className="text-7xl md:text-8xl font-black transition-all duration-500"
//           style={{ 
//             color: timeLeft === "CLEAR" ? '#00ff41' : '#ff1111',
//             textShadow: `0 0 30px ${timeLeft === "CLEAR" ? '#00ff4188' : '#ff111188'}`
//           }}
//         >
//           {timeLeft}
//         </div>
//       </div>

//       {/* Laser FX */}
//       <div ref={laserRef} className="fixed w-[4px] bg-white shadow-[0_0_20px_#ff1111,0_0_40px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0" />

//       {/* Railgun Body */}
//       <div 
//         ref={gunRef}
//         className={`fixed -bottom-10 left-1/2 w-[140px] h-[320px] z-[2000] pointer-events-none ${
//           isRecoil ? 'translate-y-10 !duration-75' : 'transition-transform duration-300'
//         }`}
//         style={{ transform: 'translateX(-50%)' }}
//       >
//         <div className="relative w-10 h-64 mx-auto bg-gradient-to-b from-neutral-900 to-black border-x border-t border-white/10 rounded-t-md">
//           <div ref={muzzleRef} className="absolute top-0 left-1/2" />
//           {isRecoil && <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-600 rounded-full blur-2xl animate-pulse" />}
//         </div>
//       </div>

//       {/* Arena Cards */}
//       <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2000px] p-10">
//         <TrophyCard 
//           id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" 
//           glowColor="#1eafd7" imageSrc="queen_trophy.png"
//           isRevealed={revealedIds.includes('c1')}
//           delay="0s" positionOrder="md:order-1"
//         />
//         <TrophyCard 
//           id="c2" suit="♠" title="KING OF SPADES" prize="25,000" 
//           glowColor="#ff4d4d" imageSrc="king_trophy.png"
//           isRevealed={revealedIds.includes('c2')}
//           delay="-2s" positionOrder="md:order-2"
//         />
//         <TrophyCard 
//           id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" 
//           glowColor="#2bff8a" imageSrc="jack_trophy.png"
//           isRevealed={revealedIds.includes('c3')}
//           delay="-4s" positionOrder="md:order-3"
//         />
//       </div>

//       <style jsx global>{`
//         @keyframes drift {
//           0%, 100% { transform: translateY(0px) rotateX(0deg); }
//           50% { transform: translateY(-20px) rotateX(3deg); }
//         }
//         @keyframes shatter {
//           0% { opacity: 1; transform: scale(1); clip-path: inset(0 0 0 0); }
//           100% { 
//             opacity: 0; 
//             transform: scale(1.6) rotate(5deg); 
//             clip-path: polygon(10% 10%, 90% 0, 100% 80%, 30% 100%, 0 50%);
//             filter: blur(10px) brightness(2);
//           }
//         }
//         .animate-shatter {
//           animation: shatter 0.5s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
//         }
//         .preserve-3d { transform-style: preserve-3d; }
//       `}</style>
//     </div>
//   );
// }



























// "use client";

// import React, { useState, useEffect, useRef } from 'react';

// const SHOOT_SEQUENCE = ['c2', 'c1', 'c3']; // King, Queen, Jack

// interface CardProps {
//   id: string;
//   suit: string;
//   title: string;
//   prize: string;
//   glowColor: string;
//   isRevealed: boolean;
//   delay: string;
//   imageSrc: string;
//   positionOrder: string;
//   onManualClick: (id: string) => void;
// }

// function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, positionOrder, onManualClick }: CardProps) {
//   return (
//     <div 
//       id={id}
//       onClick={() => onManualClick(id)}
//       className={`relative w-[160px] h-[230px] md:w-[260px] md:h-[380px] transition-all duration-500 cursor-crosshair ${positionOrder} active:scale-95`}
//       style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
//     >
//       <div className="relative w-full h-full preserve-3d">
//         {/* REVEALED CONTENT */}
//         <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
//           style={{ background: 'radial-gradient(circle at center, #111 0%, #000 100%)', boxShadow: isRevealed ? `0 0 50px ${glowColor}33` : 'none' }}>
//           <img src={imageSrc} alt={title} className="absolute w-[140%] max-w-none pointer-events-none z-10"
//             style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)', filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'none' }} />
//           <div className="absolute bottom-10 z-20 text-center">
//             <div className="text-white text-2xl md:text-4xl font-black" style={{ textShadow: `0 0 20px ${glowColor}` }}>{prize}</div>
//             <div className="text-[8px] md:text-[10px] text-white/40 tracking-[4px] uppercase mt-2">{title}</div>
//           </div>
//         </div>

//         {/* CARD BACK */}
//         <div className={`absolute inset-0 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-7xl md:text-9xl text-white/5 shadow-2xl transition-all duration-150 ${isRevealed ? 'animate-shatter pointer-events-none' : 'opacity-100'}`}>
//           <span className="select-none font-black italic opacity-20">{suit}</span>
//           <div className={`absolute inset-0 opacity-0 bg-[url('https://www.transparenttextures.com/patterns/glass-shattered.png')] invert transition-opacity duration-75 ${isRevealed ? 'opacity-100' : ''}`} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function BorderlandGame() {
//   const [timeLeft, setTimeLeft] = useState(5);
//   const [currentShotIndex, setCurrentShotIndex] = useState(0);
//   const [revealedIds, setRevealedIds] = useState<string[]>([]);
//   const [isAutoAiming, setIsAutoAiming] = useState(false);
//   const [shake, setShake] = useState(false);

//   const gunRef = useRef<HTMLDivElement>(null);
//   const muzzleRef = useRef<HTMLDivElement>(null);
//   const laserRef = useRef<HTMLDivElement>(null);
//   const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

//   // 1. Mouse Follow
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isAutoAiming || !gunRef.current) return;
//       const sway = (e.clientX - window.innerWidth / 2) / 40;
//       gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [isAutoAiming]);

//   // 2. Start/Reset 5s Timer
//   useEffect(() => {
//     if (currentShotIndex >= SHOOT_SEQUENCE.length) return;

//     setTimeLeft(5);
//     // Clear any existing timer
//     if (autoTimerRef.current) clearInterval(autoTimerRef.current);

//     // Start countdown for the current index
//     autoTimerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(autoTimerRef.current!);
//           handleShoot(SHOOT_SEQUENCE[currentShotIndex]);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); };
//   }, [currentShotIndex]);

//   const handleShoot = async (targetId: string) => {
//     // Prevent double shooting if already revealed or aiming
//     if (revealedIds.includes(targetId) || isAutoAiming) return;
    
//     // Ensure user follows the sequence King -> Queen -> Jack
//     if (targetId !== SHOOT_SEQUENCE[currentShotIndex]) return;

//     setIsAutoAiming(true);
//     const targetEl = document.getElementById(targetId);
//     if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) return;

//     const rect = targetEl.getBoundingClientRect();
//     const tx = rect.left + rect.width / 2;
//     const ty = rect.top + rect.height / 2;

//     // Gun movement
//     const sway = (tx - window.innerWidth / 2) / 4;
//     gunRef.current.style.transition = "transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)";
//     gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px)) scale(1.1)`;

//     await new Promise(r => setTimeout(r, 300));

//     // Laser Calc
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
    
//     laser.style.opacity = '1';
//     setShake(true);

//     setTimeout(() => {
//       laser.style.opacity = '0';
//       setShake(false);
//       setRevealedIds(prev => [...prev, targetId]);
//       setIsAutoAiming(false);
//       setCurrentShotIndex(prev => prev + 1);
//     }, 100);
//   };

//   return (
//     <div className={`relative w-full h-screen overflow-hidden bg-black transition-transform duration-75 ${shake ? 'scale-105' : 'scale-100'}`}>
//       <div className="fixed inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('/bg_image.jpeg')", filter: 'brightness(0.3) contrast(1.2)' }} />
      
//       {/* HUD */}
//       <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[4000] text-center">
//         <div className="text-[10px] text-white/40 font-bold uppercase tracking-[5px] mb-1">Auto-Execute In</div>
//         <div className="text-7xl font-black text-red-600 drop-shadow-2xl">
//           {currentShotIndex < 3 ? `0${timeLeft}` : "GAME CLEAR"}
//         </div>
//       </div>

//       <div ref={laserRef} className="fixed w-[4px] bg-white shadow-[0_0_20px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0" />

//       {/* Gun */}
//       <div ref={gunRef} className="fixed -bottom-10 left-1/2 w-[140px] h-[320px] z-[2000] pointer-events-none transition-transform duration-300" style={{ transform: 'translateX(-50%)' }}>
//         <div className="relative w-10 h-64 mx-auto bg-gradient-to-b from-neutral-800 to-black border-x border-white/10 rounded-t-md">
//           <div ref={muzzleRef} className="absolute top-0 left-1/2" />
//         </div>
//       </div>

//       {/* Arena */}
//       <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2000px]">
//         <TrophyCard id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" glowColor="#1eafd7" imageSrc="queen_trophy.png" 
//           isRevealed={revealedIds.includes('c1')} delay="0s" positionOrder="md:order-1" onManualClick={handleShoot} />
//         <TrophyCard id="c2" suit="♠" title="KING OF SPADES" prize="25,000" glowColor="#ff4d4d" imageSrc="king_trophy.png" 
//           isRevealed={revealedIds.includes('c2')} delay="-2s" positionOrder="md:order-2" onManualClick={handleShoot} />
//         <TrophyCard id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" glowColor="#2bff8a" imageSrc="jack_trophy.png" 
//           isRevealed={revealedIds.includes('c3')} delay="-4s" positionOrder="md:order-3" onManualClick={handleShoot} />
//       </div>

//       <style jsx global>{`
//         @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
//         @keyframes shatter {
//           0% { opacity: 1; transform: scale(1); }
//           100% { opacity: 0; transform: scale(1.8); clip-path: polygon(10% 10%, 90% 0, 100% 80%, 0 50%); filter: blur(5px) brightness(2); }
//         }
//         .animate-shatter { animation: shatter 0.5s forwards ease-out; }
//         .preserve-3d { transform-style: preserve-3d; }
//       `}</style>
//     </div>
//   );
// }


























// "use client";

// import React, { useState, useEffect, useRef } from 'react';

// // The order of IDs to be shot: King (c2), Queen (c1), Jack (c3)
// const SHOOT_SEQUENCE = ['c2', 'c1', 'c3'];

// interface CardProps {
//   id: string;
//   suit: string;
//   title: string;
//   prize: string;
//   glowColor: string;
//   isRevealed: boolean;
//   delay: string;
//   imageSrc: string;
//   positionOrder: string;
//   onManualClick: (id: string) => void;
// }

// function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, positionOrder, onManualClick }: CardProps) {
//   return (
//     <div 
//       id={id}
//       onClick={() => onManualClick(id)}
//       className={`relative w-[160px] h-[230px] md:w-[260px] md:h-[380px] transition-all duration-500 cursor-crosshair ${positionOrder} active:scale-95`}
//       style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
//     >
//       <div className="relative w-full h-full preserve-3d">
//         <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
//           style={{ background: 'radial-gradient(circle at center, #111 0%, #000 100%)', boxShadow: isRevealed ? `0 0 50px ${glowColor}33` : 'none' }}>
//           <img src={imageSrc} alt={title} className="absolute w-[140%] max-w-none pointer-events-none z-10"
//             style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)', filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'none' }} />
//           <div className="absolute bottom-10 z-20 text-center">
//             <div className="text-white text-2xl md:text-4xl font-black" style={{ textShadow: `0 0 20px ${glowColor}` }}>{prize}</div>
//             <div className="text-[8px] md:text-[10px] text-white/40 tracking-[4px] uppercase mt-2">{title}</div>
//           </div>
//         </div>

//         <div className={`absolute inset-0 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-7xl md:text-9xl text-white/5 shadow-2xl transition-all duration-150 ${isRevealed ? 'animate-shatter pointer-events-none' : 'opacity-100'}`}>
//           <span className="select-none font-black italic opacity-20">{suit}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function BorderlandGame() {
//   const [timeLeft, setTimeLeft] = useState(5);
//   const [currentShotIndex, setCurrentShotIndex] = useState(0);
//   const [revealedIds, setRevealedIds] = useState<string[]>([]);
//   const [isAutoAiming, setIsAutoAiming] = useState(false);
//   const [shake, setShake] = useState(false);

//   const gunRef = useRef<HTMLDivElement>(null);
//   const muzzleRef = useRef<HTMLDivElement>(null);
//   const laserRef = useRef<HTMLDivElement>(null);

//   // 1. Mouse Follow
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isAutoAiming || !gunRef.current) return;
//       const sway = (e.clientX - window.innerWidth / 2) / 40;
//       gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [isAutoAiming]);

//   // 2. Timer Logic - Simplified and Robust
//   useEffect(() => {
//     // If we finished the sequence, stop everything
//     if (currentShotIndex >= SHOOT_SEQUENCE.length) return;

//     setTimeLeft(5);

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleShoot(SHOOT_SEQUENCE[currentShotIndex]);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [currentShotIndex]);

//   const handleShoot = async (targetId: string) => {
//     // Guard: Prevent out-of-order shooting or shooting while busy
//     if (isAutoAiming || revealedIds.includes(targetId)) return;
//     if (targetId !== SHOOT_SEQUENCE[currentShotIndex]) return;

//     setIsAutoAiming(true);
    
//     const targetEl = document.getElementById(targetId);
//     if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) {
//       setIsAutoAiming(false);
//       return;
//     }

//     // Aiming calculation
//     const rect = targetEl.getBoundingClientRect();
//     const tx = rect.left + rect.width / 2;
//     const ty = rect.top + rect.height / 2;
//     const sway = (tx - window.innerWidth / 2) / 4;

//     // Move Gun
//     gunRef.current.style.transition = "transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
//     gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px)) scale(1.1)`;

//     await new Promise(r => setTimeout(r, 400));

//     // Fire Laser
//     const mPos = muzzleRef.current.getBoundingClientRect();
//     const originX = mPos.left;
//     const originY = mPos.top;
//     const angle = Math.atan2(ty - originY, tx - originX);
//     const dist = Math.sqrt(Math.pow(ty - originY, 2) + Math.pow(tx - originX, 2));

//     const laser = laserRef.current;
//     laser.style.left = `${originX}px`;
//     laser.style.top = `${originY}px`;
//     laser.style.height = `${dist}px`;
//     laser.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
//     laser.style.opacity = '1';
    
//     setShake(true);

//     // Resolution
//     setTimeout(() => {
//       laser.style.opacity = '0';
//       setShake(false);
//       setRevealedIds(prev => [...prev, targetId]);
//       setIsAutoAiming(false);
//       // Move to next card in sequence
//       setCurrentShotIndex(prev => prev + 1);
//     }, 150);
//   };

//   return (
//     <div className={`relative w-full h-screen overflow-hidden bg-black transition-transform duration-75 ${shake ? 'scale-105' : 'scale-100'}`}>
//       <div className="fixed inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('/bg_image.jpeg')", filter: 'brightness(0.3) contrast(1.2)' }} />
      
//       {/* HUD */}
//       <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[4000] text-center">
//         <div className="text-[10px] text-white/40 font-bold uppercase tracking-[5px] mb-1">
//             {currentShotIndex < 3 ? "Auto-Execute In" : "System Status"}
//         </div>
//         <div className={`text-7xl font-black transition-colors duration-500 ${currentShotIndex < 3 ? 'text-red-600' : 'text-green-500'}`}>
//           {currentShotIndex < 3 ? `0${timeLeft}` : "GAME CLEAR"}
//         </div>
//       </div>

//       <div ref={laserRef} className="fixed w-[4px] bg-white shadow-[0_0_20px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0" />

//       {/* Gun */}
//       <div ref={gunRef} className="fixed -bottom-10 left-1/2 w-[140px] h-[320px] z-[2000] pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
//         <div className="relative w-10 h-64 mx-auto bg-gradient-to-b from-neutral-800 to-black border-x border-white/10 rounded-t-md">
//           <div ref={muzzleRef} className="absolute top-0 left-1/2" />
//         </div>
//       </div>

//       {/* Arena */}
//       <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2000px]">
//         {/* QUEEN - Order 1 */}
//         <TrophyCard id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" glowColor="#1eafd7" imageSrc="queen_trophy.png" 
//           isRevealed={revealedIds.includes('c1')} delay="0s" positionOrder="order-1" onManualClick={handleShoot} />
        
//         {/* KING - Order 2 */}
//         <TrophyCard id="c2" suit="♠" title="KING OF SPADES" prize="25,000" glowColor="#ff4d4d" imageSrc="king_trophy.png" 
//           isRevealed={revealedIds.includes('c2')} delay="-2s" positionOrder="order-2" onManualClick={handleShoot} />
        
//         {/* JACK - Order 3 */}
//         <TrophyCard id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" glowColor="#2bff8a" imageSrc="jack_trophy.png" 
//           isRevealed={revealedIds.includes('c3')} delay="-4s" positionOrder="order-3" onManualClick={handleShoot} />
//       </div>

//       <style jsx global>{`
//         @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
//         @keyframes shatter {
//           0% { opacity: 1; transform: scale(1); }
//           100% { opacity: 0; transform: scale(1.8); filter: blur(10px); }
//         }
//         .animate-shatter { animation: shatter 0.5s forwards ease-out; }
//         .preserve-3d { transform-style: preserve-3d; }
//       `}</style>
//     </div>
//   );
// }


































"use client";

import React, { useState, useEffect, useRef } from 'react';

const SHOOT_SEQUENCE = ['c2', 'c1', 'c3']; // King -> Queen -> Jack

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
  onManualClick: (id: string) => void;
}

function TrophyCard({ id, suit, title, prize, glowColor, isRevealed, delay, imageSrc, positionOrder, onManualClick }: CardProps) {
  return (
    <div 
      id={id}
      onClick={() => onManualClick(id)}
      className={`relative w-[160px] h-[230px] md:w-[260px] md:h-[380px] transition-all duration-500 cursor-crosshair ${positionOrder} active:scale-95`}
      style={{ animation: `drift 8s ease-in-out infinite ${delay}` }}
    >
      <div className="relative w-full h-full preserve-3d">
        <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ background: 'radial-gradient(circle at center, #111 0%, #000 100%)', boxShadow: isRevealed ? `0 0 50px ${glowColor}33` : 'none' }}>
          <img src={imageSrc} alt={title} className="absolute w-[140%] max-w-none pointer-events-none z-10"
            style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)', filter: isRevealed ? `drop-shadow(0 0 30px ${glowColor})` : 'none' }} />
          <div className="absolute bottom-10 z-20 text-center">
            <div className="text-white text-2xl md:text-4xl font-black" style={{ textShadow: `0 0 20px ${glowColor}` }}>{prize}</div>
            <div className="text-[8px] md:text-[10px] text-white/40 tracking-[4px] uppercase mt-2">{title}</div>
          </div>
        </div>

        <div className={`absolute inset-0 z-30 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-7xl md:text-9xl text-white/5 shadow-2xl transition-all duration-150 ${isRevealed ? 'animate-shatter pointer-events-none' : 'opacity-100'}`}>
          <span className="select-none font-black italic opacity-20">{suit}</span>
        </div>
      </div>
    </div>
  );
}

export default function BorderlandGame() {
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [isAutoAiming, setIsAutoAiming] = useState(false);
  const [shake, setShake] = useState(false);

  const gunRef = useRef<HTMLDivElement>(null);
  const muzzleRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);

  // 1. Mouse Follow (Disabled during auto-aim)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isAutoAiming || !gunRef.current) return;
      const sway = (e.clientX - window.innerWidth / 2) / 40;
      gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px))`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAutoAiming]);

  // 2. Immediate Sequential Shooting Logic
  useEffect(() => {
    // If we haven't finished the sequence, trigger the next shot
    if (currentShotIndex < SHOOT_SEQUENCE.length) {
      const nextTarget = SHOOT_SEQUENCE[currentShotIndex];
      
      // Small delay (500ms) between cards so it doesn't look like a glitch
      const timeout = setTimeout(() => {
        handleShoot(nextTarget);
      }, 800); 

      return () => clearTimeout(timeout);
    }
  }, [currentShotIndex]); // Fires every time currentShotIndex changes

  const handleShoot = async (targetId: string) => {
    if (isAutoAiming || revealedIds.includes(targetId)) return;

    setIsAutoAiming(true);
    
    const targetEl = document.getElementById(targetId);
    if (!targetEl || !gunRef.current || !laserRef.current || !muzzleRef.current) {
      setIsAutoAiming(false);
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const tx = rect.left + rect.width / 2;
    const ty = rect.top + rect.height / 2;
    const sway = (tx - window.innerWidth / 2) / 4;

    // 1. Move Gun to Target
    gunRef.current.style.transition = "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
    gunRef.current.style.transform = `translateX(calc(-50% + ${sway}px)) scale(1.1)`;

    // Wait for gun to arrive
    await new Promise(r => setTimeout(r, 500));

    // 2. Fire Laser
    const mPos = muzzleRef.current.getBoundingClientRect();
    const originX = mPos.left;
    const originY = mPos.top;
    const angle = Math.atan2(ty - originY, tx - originX);
    const dist = Math.sqrt(Math.pow(ty - originY, 2) + Math.pow(tx - originX, 2));

    const laser = laserRef.current;
    laser.style.left = `${originX}px`;
    laser.style.top = `${originY}px`;
    laser.style.height = `${dist}px`;
    laser.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
    laser.style.opacity = '1';
    
    setShake(true);

    // 3. Impact & Cleanup
    setTimeout(() => {
      laser.style.opacity = '0';
      setShake(false);
      setRevealedIds(prev => [...prev, targetId]);
      setIsAutoAiming(false);
      
      // This state update triggers the useEffect for the NEXT card
      setCurrentShotIndex(prev => prev + 1);
    }, 200);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black transition-transform duration-75 ${shake ? 'scale-105' : 'scale-100'}`}>
      <div className="fixed inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('/bg_image.jpeg')", filter: 'brightness(0.3) contrast(1.2)' }} />
      
      {/* HUD */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[4000] text-center">
        <div className="text-[10px] text-white/40 font-bold uppercase tracking-[5px] mb-1">
            System Status
        </div>
        <div className={`text-6xl font-black transition-all duration-500 ${currentShotIndex < 3 ? 'text-red-600 animate-pulse' : 'text-green-500'}`}>
          {currentShotIndex < 3 ? "EXECUTING..." : "GAME CLEAR"}
        </div>
      </div>

      <div ref={laserRef} className="fixed w-[4px] bg-white shadow-[0_0_20px_#ff1111] z-[1500] pointer-events-none origin-top opacity-0" />

      {/* Gun */}
      <div ref={gunRef} className="fixed -bottom-10 left-1/2 w-[140px] h-[320px] z-[2000] pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
        <div className="relative w-10 h-64 mx-auto bg-gradient-to-b from-neutral-800 to-black border-x border-white/10 rounded-t-md">
          <div ref={muzzleRef} className="absolute top-0 left-1/2" />
        </div>
      </div>

      {/* Arena */}
      <div className="relative z-[1000] flex items-center justify-center h-full gap-8 md:gap-20 perspective-[2000px]">
        <TrophyCard id="c1" suit="♥" title="QUEEN OF HEARTS" prize="15,000" glowColor="#1eafd7" imageSrc="queen_trophy.png" 
          isRevealed={revealedIds.includes('c1')} delay="0s" positionOrder="order-1" onManualClick={handleShoot} />
        
        <TrophyCard id="c2" suit="♠" title="KING OF SPADES" prize="25,000" glowColor="#ff4d4d" imageSrc="king_trophy.png" 
          isRevealed={revealedIds.includes('c2')} delay="-2s" positionOrder="order-2" onManualClick={handleShoot} />
        
        <TrophyCard id="c3" suit="♣" title="JACK OF CLUBS" prize="10,000" glowColor="#2bff8a" imageSrc="jack_trophy.png" 
          isRevealed={revealedIds.includes('c3')} delay="-4s" positionOrder="order-3" onManualClick={handleShoot} />
      </div>

      <style jsx global>{`
        @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes shatter {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); filter: blur(10px); }
        }
        .animate-shatter { animation: shatter 0.5s forwards ease-out; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}