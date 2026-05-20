import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from '../utils/clockStore';

export const useNow = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

