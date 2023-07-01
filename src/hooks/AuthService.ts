import { useState, useEffect } from 'react';

type Provider = 'spotify' | 'genius';

export default function useAuthService(provider: Provider) {
const bearerKey = 'Bearer-'+provider;
const refreshKey = 'Refresh-'+provider;
const expiresAtKey = 'ExpiresAt-'+provider;

const clear = () => {
    localStorage.removeItem(bearerKey);
    localStorage.removeItem(refreshKey);
}

const getBearer = (): string => {
    const token = localStorage.getItem(bearerKey);
    if(!token) throw new Error('no bearer token stored');
    return token;
}

const setBearer = (bearerToken: string) => {
    localStorage.setItem(bearerKey, bearerToken);
}

const getRefresh = ()=> {
    return localStorage.getItem(refreshKey);
}

const setRefresh = (refreshToken: string) => {
    localStorage.setItem(refreshKey, refreshToken);
}

const getExpiresAt = () => {
    return localStorage.getItem(expiresAtKey );
}

const setExpiresAt = (expiresAt: string) => {
    localStorage.setItem(expiresAtKey, expiresAt);
}

const refreshToken = () => {
    getRefresh();
    return;
};

const isLoggedIn = () =>{ 
    if(!localStorage.getItem(bearerKey)) return false;
    const expiresAt = getExpiresAt();
    if(!expiresAt) return false;
    
    // minute from now
    return Date.now() + 60000 < (new Date(expiresAt).getTime());
};

  return {
    getBearer,
    setBearer,
    setRefresh,
    getExpiresAt,
    setExpiresAt,
    clear,
    isLoggedIn,
  };
}