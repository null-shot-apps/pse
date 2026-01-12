'use client';

import { useEffect, useState } from 'react';

interface StockBreakout {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  volume: number;
  elliottWave: string;
  breakoutTime: string;
  strength: 'strong' | 'moderate' | 'weak';
  // Smart Money Concepts
  smc: {
    orderBlock: 'bullish' | 'bearish' | 'none';
    fairValueGap: boolean;
    structureBreak: 'BOS' | 'CHoCH' | 'none';
    liquiditySweep: boolean;
    priceZone: 'premium' | 'equilibrium' | 'discount';
  };
}

interface Notification {
  id: string;
  symbol: string;
  message: string;
  time: string;
  type: 'breakout' | 'wave';
}

export default function PSEBreakoutScanner() {
  const [breakouts, setBreakouts] = useState<StockBreakout[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [historicalBreakouts, setHistoricalBreakouts] = useState<StockBreakout[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');

  // Simulate real-time scanning
  useEffect(() => {
    const scanInterval = setInterval(() => {
      // Check if market hours (9:30 AM - 3:30 PM PHT)
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isMarketHours = (hours === 9 && minutes >= 30) || (hours > 9 && hours < 15) || (hours === 15 && minutes <= 30);

      if (isMarketHours) {
        setIsScanning(true);
        scanForBreakouts();
      } else {
        setIsScanning(false);
      }
    }, 30000); // Scan every 30 seconds

    // Initial scan
    scanForBreakouts();

    return () => clearInterval(scanInterval);
  }, []);

  const scanForBreakouts = () => {
    // Mock data - In production, this would call PSE API
    const mockBreakouts: StockBreakout[] = [
      {
        symbol: 'ALI',
        name: 'Ayala Land Inc',
        price: 32.50,
        change: 1.25,
        changePercent: 4.00,
        bollingerUpper: 32.00,
        bollingerMiddle: 30.50,
        bollingerLower: 29.00,
        volume: 15420000,
        elliottWave: 'Wave 3 - Impulse',
        breakoutTime: new Date().toLocaleTimeString(),
        strength: 'strong',
        smc: {
          orderBlock: 'bullish',
          fairValueGap: true,
          structureBreak: 'BOS',
          liquiditySweep: false,
          priceZone: 'discount'
        }
      },
      {
        symbol: 'BDO',
        name: 'BDO Unibank Inc',
        price: 145.80,
        change: 3.20,
        changePercent: 2.24,
        bollingerUpper: 145.00,
        bollingerMiddle: 142.50,
        bollingerLower: 140.00,
        volume: 8920000,
        elliottWave: 'Wave 5 - Extension',
        breakoutTime: new Date().toLocaleTimeString(),
        strength: 'moderate',
        smc: {
          orderBlock: 'bullish',
          fairValueGap: false,
          structureBreak: 'CHoCH',
          liquiditySweep: true,
          priceZone: 'equilibrium'
        }
      },
      {
        symbol: 'SM',
        name: 'SM Investments Corp',
        price: 920.00,
        change: 15.00,
        changePercent: 1.66,
        bollingerUpper: 918.00,
        bollingerMiddle: 905.00,
        bollingerLower: 892.00,
        volume: 2340000,
        elliottWave: 'Wave 3 - Impulse',
        breakoutTime: new Date().toLocaleTimeString(),
        strength: 'strong',
        smc: {
          orderBlock: 'bullish',
          fairValueGap: true,
          structureBreak: 'BOS',
          liquiditySweep: false,
          priceZone: 'discount'
        }
      }
    ];

    setBreakouts(mockBreakouts);
    setLastScanTime(new Date().toLocaleTimeString());

    // Add to historical data
    setHistoricalBreakouts(prev => [...mockBreakouts, ...prev].slice(0, 50));

    // Create notifications for new breakouts
    mockBreakouts.forEach(breakout => {
      const notification: Notification = {
        id: `${breakout.symbol}-${Date.now()}`,
        symbol: breakout.symbol,
        message: `${breakout.symbol} breaking out! +${breakout.changePercent.toFixed(2)}%`,
        time: new Date().toLocaleTimeString(),
        type: 'breakout'
      };
      setNotifications(prev => [notification, ...prev].slice(0, 10));
    });
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'weak': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStrengthBg = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500/20 border-green-500/50';
      case 'moderate': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'weak': return 'bg-orange-500/20 border-orange-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">PSE Breakout Scanner</h1>
            <p className="text-blue-200">Real-time Bollinger Band, Elliott Wave & Smart Money Concepts</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm">{isScanning ? 'Scanning' : 'Market Closed'}</span>
            </div>
            {lastScanTime && (
              <div className="text-sm text-blue-200">
                Last scan: {lastScanTime}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Bar */}
        {notifications.length > 0 && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Recent Alerts
            </h3>
            <div className="space-y-1">
              {notifications.slice(0, 3).map(notif => (
                <div key={notif.id} className="text-sm flex justify-between items-center">
                  <span className="font-medium">{notif.message}</span>
                  <span className="text-blue-300 text-xs">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'live'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-blue-200 hover:bg-slate-800'
            }`}
          >
            Live Breakouts ({breakouts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-blue-200 hover:bg-slate-800'
            }`}
          >
            History ({historicalBreakouts.length})
          </button>
        </div>

        {/* Breakouts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {(activeTab === 'live' ? breakouts : historicalBreakouts).map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className={`${getStrengthBg(stock.strength)} border rounded-lg p-5 hover:scale-105 transition-transform`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{stock.symbol}</h3>
                  <p className="text-sm text-gray-300">{stock.name}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStrengthColor(stock.strength)} bg-black/30`}>
                  {stock.strength.toUpperCase()}
                </div>
              </div>

              {/* Price Info */}
              <div className="mb-4">
                <div className="text-3xl font-bold mb-1">₱{stock.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">
                    +₱{stock.change.toFixed(2)} (+{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="mb-4 p-3 bg-black/30 rounded">
                <div className="text-xs font-semibold mb-2 text-blue-300">BOLLINGER BANDS (20, 2)</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Upper:</span>
                    <span className="font-mono">₱{stock.bollingerUpper.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Middle:</span>
                    <span className="font-mono">₱{stock.bollingerMiddle.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lower:</span>
                    <span className="font-mono">₱{stock.bollingerLower.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Elliott Wave */}
              <div className="mb-4 p-3 bg-black/30 rounded">
                <div className="text-xs font-semibold mb-2 text-purple-300">ELLIOTT WAVE</div>
                <div className="text-sm font-medium">{stock.elliottWave}</div>
              </div>

              {/* Smart Money Concepts */}
              <div className="mb-4 p-3 bg-black/30 rounded">
                <div className="text-xs font-semibold mb-2 text-cyan-300">SMART MONEY CONCEPTS</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Order Block:</span>
                    <span className={`font-semibold ${
                      stock.smc.orderBlock === 'bullish' ? 'text-green-400' : 
                      stock.smc.orderBlock === 'bearish' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {stock.smc.orderBlock === 'none' ? 'None' : stock.smc.orderBlock.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fair Value Gap:</span>
                    <span className={stock.smc.fairValueGap ? 'text-green-400' : 'text-gray-400'}>
                      {stock.smc.fairValueGap ? '✓ Present' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Structure:</span>
                    <span className={`font-semibold ${
                      stock.smc.structureBreak === 'BOS' ? 'text-green-400' : 
                      stock.smc.structureBreak === 'CHoCH' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {stock.smc.structureBreak === 'none' ? 'None' : stock.smc.structureBreak}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Liquidity Sweep:</span>
                    <span className={stock.smc.liquiditySweep ? 'text-yellow-400' : 'text-gray-400'}>
                      {stock.smc.liquiditySweep ? '⚡ Detected' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Zone:</span>
                    <span className={`font-semibold ${
                      stock.smc.priceZone === 'discount' ? 'text-green-400' : 
                      stock.smc.priceZone === 'premium' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {stock.smc.priceZone.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Volume & Time */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <div>
                  <span className="text-xs">Volume:</span>
                  <div className="font-mono">{(stock.volume / 1000000).toFixed(2)}M</div>
                </div>
                <div className="text-xs">
                  {stock.breakoutTime}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {activeTab === 'live' && breakouts.length === 0 && (
          <div className="text-center py-16 bg-slate-800/30 rounded-lg">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Active Breakouts</h3>
            <p className="text-gray-400">Scanner is monitoring all PSE stocks...</p>
          </div>
        )}
      </div>
    </div>
  );
}





