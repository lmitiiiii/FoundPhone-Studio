import { useEffect, useRef, useState, type RefObject } from "react";
import type { SkinProps } from "./AppSkins";
import { safeMedia, type Item } from "./schema";
import { useSkinState } from "./skinState";

const activeAudioElements = new Set<HTMLAudioElement>();

export function useExclusiveAudio(ref: RefObject<HTMLAudioElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    activeAudioElements.add(element);
    const stopOthers = () => {
      activeAudioElements.forEach((other) => {
        if (other !== element && !other.paused) other.pause();
      });
    };
    element.addEventListener("play", stopOthers);
    return () => {
      element.removeEventListener("play", stopOthers);
      activeAudioElements.delete(element);
    };
  }, [ref]);
}

export function useTrack(
  p: SkinProps,
  items: Item[],
): [Item | null, (item: Item | null) => void] {
  const [id, setId] = useSkinState<string>(p, "track", "");
  return [
    items.find((i) => i.id === id) ?? null,
    (item) => {
      setId(item?.id ?? "");
      if (item) p.onRead(item.id);
    },
  ];
}

export function AudioPlayer({ p, item }: { p: SkinProps; item: Item }) {
  const last = useRef(-1);
  const element = useRef<HTMLAudioElement>(null);
  const key = `audio-${item.id}`,
    saved = p.ui?.[key];
  const commit = (time: number, force = false) => {
    if (!p.onUi || !Number.isFinite(time)) return;
    if (force || Math.abs(time - last.current) >= 5) {
      last.current = time;
      p.onUi(key, time);
    }
  };
  useEffect(() => {
    const audio = element.current;
    if (
      !audio ||
      typeof saved !== "number" ||
      !Number.isFinite(saved) ||
      saved <= 0
    )
      return;
    const restore = () => {
      if (audio.readyState < 1) return;
      last.current = saved;
      audio.currentTime = Math.min(
        saved,
        Number.isFinite(audio.duration) ? audio.duration : saved,
      );
    };
    restore();
    audio.addEventListener("loadedmetadata", restore, { once: true });
    return () => audio.removeEventListener("loadedmetadata", restore);
  }, [item.id]);
  return (
    <audio
      ref={element}
      controls
      src={safeMedia(item.media)}
      aria-label={`播放${item.title}`}
      onTimeUpdate={(e) => {
        if (e.currentTarget.isConnected) commit(e.currentTarget.currentTime);
      }}
      onPause={(e) => commit(e.currentTarget.currentTime, true)}
    />
  );
}

export type PersistentMusicTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

type MusicCommand =
  | { action: "toggle" }
  | { action: "play" }
  | { action: "pause" }
  | { action: "next" }
  | { action: "select"; id: string };

type MusicStatus = { playing: boolean; id: string; blocked: boolean };

const PLAYLIST_EVENT = "foundphone:music:playlist";
const COMMAND_EVENT = "foundphone:music:command";
const STATUS_EVENT = "foundphone:music:status";
const REQUEST_STATUS_EVENT = "foundphone:music:request-status";

export function musicCommand(command: MusicCommand) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<MusicCommand>(COMMAND_EVENT, { detail: command }));
  }
}

export function PersistentMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playlistRef = useRef<PersistentMusicTrack[]>([]);
  const indexRef = useRef(0);
  const manualPauseRef = useRef(false);
  const [playlist, setPlaylist] = useState<PersistentMusicTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const current = playlist[index];

  const publishStatus = (nextPlaying = playing, nextBlocked = blocked) => {
    const track = playlistRef.current[indexRef.current];
    window.dispatchEvent(new CustomEvent<MusicStatus>(STATUS_EVENT, {
      detail: { playing: nextPlaying, id: track?.id || "", blocked: nextBlocked },
    }));
  };

  const moveTo = (nextIndex: number, autoplay = true) => {
    const list = playlistRef.current;
    if (!list.length) return;
    const safeIndex = (nextIndex + list.length) % list.length;
    indexRef.current = safeIndex;
    setIndex(safeIndex);
    setShouldPlay(autoplay);
    setPlaying(false);
    setBlocked(false);
    if (!autoplay) manualPauseRef.current = true;
  };

  useEffect(() => {
    playlistRef.current = playlist;
    indexRef.current = index;
  }, [playlist, index]);

  useEffect(() => {
    const onPlaylist = (event: Event) => {
      const detail = (event as CustomEvent<{ tracks?: PersistentMusicTrack[]; startId?: string; autoplay?: boolean }>).detail;
      const nextTracks = (detail?.tracks || []).filter((track) => !!track.src);
      if (!nextTracks.length) return;
      const oldIds = playlistRef.current.map((track) => track.id).join("|");
      const newIds = nextTracks.map((track) => track.id).join("|");
      const oldCurrent = playlistRef.current[indexRef.current]?.id;
      const samePlaylist = oldIds === newIds && oldIds.length > 0;
      playlistRef.current = nextTracks;
      setPlaylist(nextTracks);
      const retainedIndex = oldCurrent ? nextTracks.findIndex((track) => track.id === oldCurrent) : -1;
      const requestedIndex = detail?.startId ? nextTracks.findIndex((track) => track.id === detail.startId) : -1;
      const nextIndex = samePlaylist && retainedIndex >= 0
        ? retainedIndex
        : requestedIndex >= 0 ? requestedIndex : 0;
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      if (!samePlaylist && detail?.autoplay && !manualPauseRef.current) {
        setShouldPlay(true);
        setBlocked(false);
      }
      publishStatus(playing, blocked);
    };
    const onCommand = (event: Event) => {
      const command = (event as CustomEvent<MusicCommand>).detail;
      if (!command) return;
      const audio = audioRef.current;
      if (command.action === "toggle") {
        if (audio && !audio.paused) {
          manualPauseRef.current = true;
          setShouldPlay(false);
          setPlaying(false);
          audio.pause();
          publishStatus(false, false);
        } else {
          manualPauseRef.current = false;
          setBlocked(false);
          setShouldPlay(true);
          if (audio?.src) {
            void audio.play().then(() => {
              setPlaying(true);
              setBlocked(false);
              publishStatus(true, false);
            }).catch(() => {
              setPlaying(false);
              setBlocked(true);
              publishStatus(false, true);
            });
          }
        }
      } else if (command.action === "pause") {
        manualPauseRef.current = true;
        setShouldPlay(false);
        setPlaying(false);
        audio?.pause();
        publishStatus(false, false);
      } else if (command.action === "play") {
        manualPauseRef.current = false;
        setBlocked(false);
        setShouldPlay(true);
        if (audio?.src) {
          void audio.play().then(() => {
            setPlaying(true);
            setBlocked(false);
            publishStatus(true, false);
          }).catch(() => {
            setPlaying(false);
            setBlocked(true);
            publishStatus(false, true);
          });
        }
      } else if (command.action === "next") {
        manualPauseRef.current = false;
        moveTo(indexRef.current + 1, true);
      } else if (command.action === "select") {
        const selected = playlistRef.current.findIndex((track) => track.id === command.id);
        if (selected >= 0) {
          manualPauseRef.current = false;
          moveTo(selected, true);
        }
      }
    };
    const onRequestStatus = () => publishStatus();
    window.addEventListener(PLAYLIST_EVENT, onPlaylist);
    window.addEventListener(COMMAND_EVENT, onCommand);
    window.addEventListener(REQUEST_STATUS_EVENT, onRequestStatus);
    return () => {
      window.removeEventListener(PLAYLIST_EVENT, onPlaylist);
      window.removeEventListener(COMMAND_EVENT, onCommand);
      window.removeEventListener(REQUEST_STATUS_EVENT, onRequestStatus);
    };
  }, [playing, blocked]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.src || !shouldPlay) return;
    let cancelled = false;
    const attempt = () => {
      if (cancelled) return;
      void audio.play().then(() => {
        if (cancelled) return;
        setPlaying(true);
        setBlocked(false);
        publishStatus(true, false);
      }).catch(() => {
        if (cancelled) return;
        setPlaying(false);
        setBlocked(true);
        publishStatus(false, true);
      });
    };
    if (audio.src !== current.src) {
      audio.src = current.src;
      audio.load();
    }
    if (audio.readyState >= 2) attempt();
    else {
      audio.addEventListener("canplay", attempt, { once: true });
      audio.load();
    }
    return () => {
      cancelled = true;
      audio.removeEventListener("canplay", attempt);
    };
  }, [current?.src, shouldPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => { setPlaying(true); setBlocked(false); publishStatus(true, false); };
    const onPause = () => { setPlaying(false); publishStatus(false, blocked); };
    const onEnded = () => {
      if (playlistRef.current.length) moveTo(indexRef.current + 1, true);
    };
    const onError = () => { setPlaying(false); publishStatus(false, true); };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [blocked]);

  return (
    <audio
      ref={audioRef}
      className="persistent-music-audio"
      style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: -10, bottom: -10 }}
      preload="auto"
      playsInline
      aria-label="后台音乐播放列表"
    />
  );
}
