/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mic } from 'lucide-react';
import { useSession } from '../../services/sessionStore';
import { AppNotification, AppMode } from '../../types';
import type { JSX } from 'react';

interface HeaderProps {
  setTab: (id: string) => void;
  iaLiveActive: boolean;
  startIaVoice: () => void;
  stopIaVoice: () => void;
  notifications: AppNotification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  userProfilePhoto?: string;
  NotificationDropdown: () => JSX.Element;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  appMode: AppMode;
  emergencyMode?: boolean;
  isOnline: boolean;
  onClickConnectivity: () => void;
  offlineQueueLength: number;
}

export function Header({ 
  setTab, 
  iaLiveActive, 
  startIaVoice, 
  stopIaVoice, 
  notifications, 
  showNotifications, 
  setShowNotifications,
  NotificationDropdown,
  isChatOpen,
  setIsChatOpen,
  appMode,
  emergencyMode = false,
  isOnline,
  onClickConnectivity,
  offlineQueueLength
}: HeaderProps) {
  const { user, activeProfile } = useSession();
  const isGov = appMode !== 'user';
  const isAdmin = appMode === 'admin';
  const isInst = appMode === 'institution';
  const hasEmergencyBanner = emergencyMode && isGov;


  const handleMicClick = () => {
    if (!isChatOpen) {
      setIsChatOpen(true);
      startIaVoice();
    } else {
      // If voice is active, close everything. If not, just start voice.
      if (iaLiveActive) {
        stopIaVoice();
        setIsChatOpen(false);
      } else {
        startIaVoice();
      }
    }
  };

  const getThemeColorClass = (activeClass: string, inactiveClass: string) => {
    if (iaLiveActive) return activeClass;
    return inactiveClass;
  };

  return (
    <>
      {/* Mobile AppBar */}
      <header 
        style={{ top: hasEmergencyBanner ? '32px' : '0' }}
        className={`md:hidden fixed left-0 right-0 h-16 backdrop-blur-lg border-b px-4 flex items-center justify-between z-50 transition-all ${
        isAdmin ? 'bg-white/95 border-slate-100 text-slate-900 shadow-sm' : 
        isInst ? 'bg-red-50/80 border-red-200' : 'bg-white/80 border-line/40'
      }`}>
        <div className="flex items-center" onClick={() => setTab(isAdmin ? 'gov-dashboard' : 'home')}>
          <img 
            src="https://i.postimg.cc/Rq5TKbdk/Correio-Digital-Angola.png" 
            alt="Correio Digital" 
            className={`h-10 w-auto object-contain cursor-pointer`}
          />
          {isAdmin && (
            <span className={`ml-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none bg-slate-900 text-white`}>
              Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Connectivity Pill Button Mobile */}
          <button
            type="button"
            onClick={onClickConnectivity}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-wider transition-all pointer-events-auto cursor-pointer shrink-0 ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 animate-pulse'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {offlineQueueLength > 0 && (
              <span className="bg-amber-600 text-white font-mono rounded-full px-1 min-w-[12px] h-[12px] flex items-center justify-center text-[7px] leading-none shrink-0 font-bold">
                {offlineQueueLength}
              </span>
            )}
          </button>

          <button 
            onClick={handleMicClick}
            className={`relative flex items-center justify-center p-2 rounded-full transition-all focus:outline-none ${
              iaLiveActive ? (isAdmin ? 'bg-red-500/15' : isInst ? 'bg-red-600/10' : 'bg-primary/10') : 'active:bg-slate-50'
            }`}
          >
            {iaLiveActive && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className={`absolute inset-0 rounded-full ${isAdmin ? 'bg-red-500/20' : isInst ? 'bg-red-600/20' : 'bg-primary/20'}`}
              />
            )}
            <Mic 
              size={17} 
              className={`relative z-10 transition-colors duration-300 ${
                iaLiveActive ? (isAdmin ? 'text-red-650' : isInst ? 'text-red-600' : 'text-primary') : (isAdmin ? 'text-slate-700' : 'text-slate-600')
              }`} 
            />
          </button>
          
          <div className="relative flex items-center justify-center">
            <img 
              src={user.avatarUrl} 
              alt="Perfil" 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-8 h-8 rounded-full object-cover border shadow-sm ml-1 cursor-pointer transition-all border-slate-100 ring-2 ring-primary/5 hover:ring-primary/20`}
              referrerPolicy="no-referrer"
            />
            {notifications.length > 0 && (
              <div className="bg-red-600 text-white font-black text-[6px] min-w-[10px] h-[10px] px-0.5 flex items-center justify-center rounded-full ring-1 ring-white absolute -top-0.5 -right-0.5 z-10 shadow-sm pointer-events-none leading-none">
                {notifications.length}
              </div>
            )}
            <NotificationDropdown />
          </div>
        </div>
      </header>

      {/* Desktop Greeting Header */}
      <div 
        style={{ top: hasEmergencyBanner ? '32px' : '0' }}
        className={`px-4 py-3 md:px-8 md:pt-6 md:pb-2 border-b flex justify-between items-center transition-all sticky z-20 ${
        isAdmin ? 'bg-white border-slate-100 text-slate-900 shadow-sm' : 
        'bg-white border-line/5'
      }`}>
        <div className="flex-1">
          <small className={`text-[10px] md:text-sm font-black uppercase tracking-[0.1em] block mb-0.5 ${
            isAdmin ? 'text-slate-600' : 'text-slate-600'
          }`}>
            {isAdmin ? 'Administração Central' : isInst ? activeProfile.institutionName : 'Área do Cidadão'}
          </small>
          <h2 className={`text-lg md:text-3xl font-black leading-none tracking-tight ${
            isAdmin ? 'text-slate-900' : 'text-primary'
          }`}>
            {isAdmin ? activeProfile.role : `Olá, ${user.firstName}`}
          </h2>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {/* Connectivity Pill Button Desktop */}
          <button
            type="button"
            onClick={onClickConnectivity}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all pointer-events-auto cursor-pointer ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 animate-pulse'
            }`}
            style={{ cursor: 'pointer' }}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {offlineQueueLength > 0 && (
              <span className="bg-amber-600 text-white font-mono rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] leading-none shrink-0 font-bold">
                {offlineQueueLength}
              </span>
            )}
          </button>

          <button 
            onClick={handleMicClick}
            className={`relative flex items-center justify-center p-2 rounded-full transition-all focus:outline-none ${
              iaLiveActive ? (isAdmin ? 'bg-red-500/15' : isInst ? 'bg-red-600/10' : 'bg-primary/10') : 'hover:bg-slate-50 hover:bg-opacity-10'
            }`}
            title="Conversar com IA"
          >
            {iaLiveActive && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className={`absolute inset-0 rounded-full ${isAdmin ? 'bg-red-500/30' : isInst ? 'bg-red-600/30' : 'bg-primary/30'}`}
              />
            )}
            <Mic 
              size={19} 
              className={`relative z-10 transition-colors duration-300 ${
                iaLiveActive ? (isAdmin ? 'text-red-650' : isInst ? 'text-red-600' : 'text-primary') : (isAdmin ? 'text-slate-700' : 'text-slate-700')
              }`} 
            />
          </button>
          
          <div className="relative flex items-center">
            <img 
              src={user.avatarUrl} 
              alt="Perfil" 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm cursor-pointer transition-all border-white ring-2 ring-primary/10 hover:ring-primary/30`}
              referrerPolicy="no-referrer"
            />
            {notifications.length > 0 && (
              <div className="bg-red-600 text-white font-black text-[7.5px] min-w-[12px] h-[12px] px-0.5 flex items-center justify-center rounded-full ring-1 ring-white absolute -top-0.5 -right-0.5 z-10 shadow-sm pointer-events-none leading-none">
                {notifications.length}
              </div>
            )}
            <NotificationDropdown />
          </div>
        </div>
      </div>
    </>
  );
}
