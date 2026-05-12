import { useRef, useEffect, useCallback } from 'react';

// Module-level singleton — one AudioContext for the entire app.
// Browsers cap concurrent contexts at ~6; one card per instance would blow that.
let _ctx: AudioContext | null = null;
function getSharedCtx(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new AudioContext();
  }
  return _ctx;
}

/**
 * Web Audio sensory engine — zero external files.
 * Synthesizes all sounds procedurally via the Web Audio API.
 *
 * metallic clink: short burst of filtered noise + high-freq ring
 * ambient drone:  two detuned oscillators + sub-bass, looped forever
 */
export function useAudio() {
  const droneRef   = useRef<{ stop: () => void } | null>(null);
  const startedRef = useRef(false);

  // ── Metallic Clink ────────────────────────────────────────────────────────
  const playClick = useCallback(() => {
    const ctx  = getSharedCtx();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    const now  = ctx.currentTime;
    const out  = ctx.destination;

    // Master gain — keep it subtle
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.18, now);
    master.connect(out);

    // 1. Noise burst — filtered to metallic band (4–12kHz)
    const bufLen  = ctx.sampleRate * 0.08;
    const buffer  = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise   = ctx.createBufferSource();
    noise.buffer  = buffer;

    const bpf     = ctx.createBiquadFilter();
    bpf.type      = 'bandpass';
    bpf.frequency.value = 7000;
    bpf.Q.value   = 1.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    noise.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 0.08);

    // 2. Ring tone — two short sine pings at metallic frequencies
    [3800, 5200].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      osc.type   = 'sine';
      osc.frequency.value = freq;

      const g    = ctx.createGain();
      const t    = now + i * 0.012;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.4, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }, []);

  // ── Ambient Drone ─────────────────────────────────────────────────────────
  const startDrone = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = getSharedCtx();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.06, now + 4); // slow fade in
    master.connect(ctx.destination);

    // Sub-bass drone — 38Hz
    const sub  = ctx.createOscillator();
    sub.type   = 'sine';
    sub.frequency.value = 38;
    const subG = ctx.createGain();
    subG.gain.value = 0.7;
    sub.connect(subG);
    subG.connect(master);
    sub.start(now);

    // Two detuned sawtooth oscillators for industrial texture
    const freqs = [92, 92.4]; // slight detune = beating
    const oscs  = freqs.map(f => {
      const osc  = ctx.createOscillator();
      osc.type   = 'sawtooth';
      osc.frequency.value = f;

      // Heavy low-pass — only the rumble survives
      const lpf  = ctx.createBiquadFilter();
      lpf.type   = 'lowpass';
      lpf.frequency.value = 180;
      lpf.Q.value = 0.7;

      const g    = ctx.createGain();
      g.gain.value = 0.3;

      osc.connect(lpf);
      lpf.connect(g);
      g.connect(master);
      osc.start(now);
      return osc;
    });

    // Slow LFO modulating sub pitch — breathing effect
    const lfo  = ctx.createOscillator();
    lfo.type   = 'sine';
    lfo.frequency.value = 0.07; // one cycle every ~14s
    const lfoG = ctx.createGain();
    lfoG.gain.value = 3;
    lfo.connect(lfoG);
    lfoG.connect(sub.frequency);
    lfo.start(now);

    droneRef.current = {
      stop: () => {
        const t = ctx.currentTime;
        master.gain.linearRampToValueAtTime(0, t + 2);
        setTimeout(() => {
          sub.stop();
          oscs.forEach(o => o.stop());
          lfo.stop();
        }, 2200);
      },
    };
  }, []);

  const stopDrone = useCallback(() => {
    droneRef.current?.stop();
    startedRef.current = false;
  }, []);

  // Clean up drone on unmount — shared ctx stays alive for other instances
  useEffect(() => {
    return () => {
      droneRef.current?.stop();
    };
  }, []);

  return { playClick, startDrone, stopDrone };
}
