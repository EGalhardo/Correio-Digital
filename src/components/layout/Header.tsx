/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mic, Bell } from 'lucide-react';
import { USER_PROFILE_PHOTO } from '../../constants/data';
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
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative cursor-pointer p-2 active:bg-white/5 rounded-full transition-all group flex items-center justify-center outline-none"
            >
              {notifications.length > 0 && (
                <div className="bg-red-600 text-white font-black text-[7px] min-w-[12px] h-[12px] flex items-center justify-center rounded-full ring-1 ring-white absolute top-1.5 right-1.5 z-10 shadow-sm leading-none">
                  {notifications.length}
                </div>
              )}
              <Bell size={18} className={isAdmin ? 'text-slate-600' : 'text-slate-600'} />
            </button>
            <NotificationDropdown />
          </div>

          <img 
            src={USER_PROFILE_PHOTO} 
            alt="Perfil" 
            onClick={() => setTab(isAdmin ? 'gov-perfil' : 'perfil')}
            className={`w-7 h-7 rounded-full object-cover border shadow-sm ml-1 cursor-pointer border-slate-100`}
            referrerPolicy="no-referrer"
          />
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
            {isAdmin ? 'Administração Central' : 'Oi,'}
          </small>
          <h2 className={`text-lg md:text-3xl font-black leading-none tracking-tight ${
            isAdmin ? 'text-slate-900' : 'text-primary'
          }`}>
            {isAdmin ? 'Painel de Administração' : 'Edlasio'}
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
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative cursor-pointer p-2 hover:bg-slate-50 hover:bg-opacity-10 rounded-full transition-all group flex items-center justify-center outline-none"
            >
              {notifications.length > 0 && (
                <div className="bg-red-600 text-white font-black text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full ring-2 ring-white absolute top-1 right-1 z-10 transition-transform group-hover:scale-110 shadow-sm">
                  {notifications.length}
                </div>
              )}
              <Bell size={21} className={`transition-colors ${
                isAdmin ? 'text-slate-600 group-hover:text-slate-900' : 
                isInst ? 'text-slate-600 group-hover:text-red-600' : 
                'text-slate-700 group-hover:text-primary'}`} 
              />
            </button>
            <NotificationDropdown />
          </div>

          <div className="flex items-center gap-2">
            <img 
              src={USER_PROFILE_PHOTO} 
              alt="Perfil" 
              onClick={() => setTab(isAdmin ? 'gov-perfil' : 'perfil')}
              className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm cursor-pointer transition-all border-white ring-2 ring-primary/10 hover:ring-primary/30`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
