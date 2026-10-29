import { useId, type ReactNode } from "react";
export const detailedIcons = new Set([
  "appstore",
  "photos",
  "camera",
  "calculator",
  "settings",
  "files",
  "weather",
  "notes",
  "reminders",
  "recorder",
  "wallet",
  "qq",
  "threads",
  "music",
  "recorder",
  "maps",
  "safari",
  "instagram",
  "twitter",
  "kakao",
]);
/** Independently drawn SVG materials; no extracted bitmap, font or brand resource. */
export function DetailedArtwork({ id }: { id: string }) {
  const key = "detail-" + useId().replaceAll(":", ""),
    g = (n: string) => `url(#${key + n})`;
  let bg = g("paper"),
    art: ReactNode;
  if (id === "music") {
    bg = g("music");
    art = (
      <path d="M43 8v34a9 9 0 1 1-5.5-8.3V17l-15 3.5v25a9 9 0 1 1-5.5-8.3V14z" fill="#fff" />
    );
  } else if (id === "recorder") {
    bg = g("recorder");
    art = (
      <>
        <rect x="25" y="8" width="14" height="31" rx="7" fill="#fff" />
        <path d="M17 29a15 15 0 0 0 30 0M32 44v8M24 53h16" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M28 13v17" stroke="#d9d9df" strokeWidth="1.5" strokeLinecap="round" />
      </>
    );
  } else if (id === "maps") {
    bg = g("maps");
    art = (
      <>
        <path d="M0 7 17 1l15 7 16-6 16 6v48l-17 6-15-7-15 6L0 55z" fill="#f8f8f5" />
        <path d="M-2 16 18 8l13 7 18-7 18 8M-2 45l20-9 13 8 18-8 18 8" fill="none" stroke="#8bc6a0" strokeWidth="6" />
        <path d="M-2 27 16 20l15 7 18-7 18 7" fill="none" stroke="#f1c94b" strokeWidth="4" />
        <path d="M15 64 24 43 31 34 40 24 52 1" fill="none" stroke="#fff" strokeWidth="5" />
        <path d="M15 64 24 43 31 34 40 24 52 1" fill="none" stroke="#ed6464" strokeWidth="2.2" />
        <path d="M32 15c-7 0-12 5-12 12 0 9 12 22 12 22s12-13 12-22c0-7-5-12-12-12z" fill="#3389f5" stroke="#fff" strokeWidth="1.5" />
        <circle cx="32" cy="27" r="4" fill="#fff" />
      </>
    );
  } else if (id === "safari") {
    bg = g("safari");
    art = (
      <>
        <circle cx="32" cy="32" r="29" fill="#f7fbff" />
        <circle cx="32" cy="32" r="26" fill="#078cf0" />
        <circle cx="32" cy="32" r="22.5" fill="none" stroke="#d9f4ff" strokeWidth="1.2" />
        {Array.from({ length: 32 }, (_, n) => (
          <path key={n} d="M32 7.5v3.5" stroke="#fff" strokeWidth={n % 4 === 0 ? "1.4" : ".65"} transform={`rotate(${n * 11.25} 32 32)`} />
        ))}
        <path d="M16 49 28 29 48 14 36 35z" fill="#fff" />
        <path d="m28 29 20-15-12 21z" fill="#f43d4d" />
        <circle cx="32" cy="32" r="2" fill="#fff" />
      </>
    );
  } else if (id === "instagram") {
    bg = g("instagram");
    art = (
      <>
        <rect x="9" y="9" width="46" height="46" rx="13" fill="none" stroke="#fff" strokeWidth="4.3" />
        <circle cx="32" cy="32" r="11" fill="none" stroke="#fff" strokeWidth="4.3" />
        <circle cx="45" cy="19" r="3.1" fill="#fff" />
        <path d="M15 44c6 7 14 10 22 8" fill="none" stroke="#ffb45c" strokeWidth="1.5" opacity=".65" />
      </>
    );
  } else if (id === "twitter") {
    bg = g("black");
    art = (
      <path d="M46.5 11H55L36.4 32.3 58 53H41.1L27.8 37.2 14 53H5.5l19.9-22.8L7 11h17.3l12 14.2zM43.5 48.8h4.7L21.7 15h-5z" fill="#fff" />
    );
  } else if (id === "kakao") {
    bg = g("kakao");
    art = (
      <>
        <path d="M32 10C17.5 10 6 19.2 6 31.2c0 8.3 5.6 15.4 14.1 18.9l-3 7.4 11-5.8C44 52.5 58 43.4 58 31.2 58 19.2 46.5 10 32 10z" fill="#3c1e1e" />
        <path d="M17 28.5c0-2.3 2-4.1 4.4-4.1 1.6 0 3 .8 3.8 2.1 1.2-1.5 3-2.4 5-2.4s3.8.9 5 2.4c.9-1.3 2.3-2.1 3.9-2.1 2.5 0 4.4 1.8 4.4 4.1 0 4.2-6.1 8.6-13.2 8.6S17 32.7 17 28.5z" fill="#ffe812" />
      </>
    );
  } else if (id === "appstore") {
    bg = g("blue");
    art = (
      <g fill="none" stroke="#ebfaff" strokeWidth="4.6" strokeLinecap="round">
        <path d="M23 49 40 17M25 17l8 14M17 41h29M38 35l8 14" />
      </g>
    );
  } else if (id === "photos") {
    const colors = [
      "#ff9c00",
      "#ffc700",
      "#72c900",
      "#00af5d",
      "#00aef3",
      "#5268d9",
      "#b64be4",
      "#ff3176",
    ];
    art = (
      <g filter={`url(#${key}soft)`}>
        {colors.map((c, n) => (
          <ellipse
            key={c}
            cx="32"
            cy="20.4"
            rx="7.5"
            ry="14.6"
            transform={`rotate(${n * 45} 32 32)`}
            fill={c}
            fillOpacity=".82"
          />
        ))}
        <circle cx="32" cy="32" r="4.5" fill="#ffffff50" />
      </g>
    );
  } else if (id === "camera") {
    bg = g("metal");
    art = (
      <>
        <rect x="6" y="7" width="52" height="50" rx="13" fill="#d3d3d5" />
        <circle
          cx="32"
          cy="32"
          r="23"
          fill="#191a1e"
          stroke="#777"
          strokeWidth="1.5"
        />
        <circle
          cx="32"
          cy="32"
          r="19.3"
          fill="#060817"
          stroke="#303953"
          strokeWidth="1.5"
        />
        <circle cx="32" cy="32" r="15.5" fill={g("lens")} />
        <ellipse
          cx="26"
          cy="22"
          rx="7"
          ry="4"
          fill="#b0c4ff"
          opacity=".8"
          transform="rotate(-28 26 22)"
        />
        <ellipse cx="26" cy="21" rx="3.5" ry="2.7" fill="#fff" />
        <path
          d="M20 42q14 12 25-7"
          fill="none"
          stroke="#2eb8fb"
          strokeWidth="2"
          opacity=".7"
        />
      </>
    );
  } else if (id === "calculator") {
    bg = g("metal");
    art = (
      <>
        <rect
          x="16"
          y="8"
          width="32"
          height="49"
          rx="6"
          fill="#18181b"
          filter={`url(#${key}soft)`}
        />
        <rect
          x="20"
          y="12"
          width="24"
          height="12"
          rx="2"
          fill="#747474"
          stroke="#aaa"
          strokeWidth=".6"
        />
        {Array.from({ length: 9 }, (_, n) => (
          <circle
            key={n}
            cx={23 + (n % 3) * 9}
            cy={31 + Math.floor(n / 3) * 8}
            r="3.1"
            fill={n % 3 === 2 ? "#ff9200" : "#dedede"}
          />
        ))}
      </>
    );
  } else if (id === "settings") {
    bg = g("steel");
    art = (
      <>
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="#888a90"
          stroke="#bfc0c3"
          strokeWidth="1.1"
        />
        {Array.from({ length: 28 }, (_, n) => (
          <rect
            key={n}
            x="30"
            y="7"
            width="4"
            height="8"
            rx="1.3"
            fill="#e6e6e8"
            transform={`rotate(${(n * 360) / 28} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="17.5" fill={g("metal")} stroke="#fff" />
        <circle cx="32" cy="32" r="13" fill="#7c7e85" />
        {[0, 120, 240].map((a) => (
          <path
            key={a}
            transform={`rotate(${a} 32 32)`}
            d="M32 32q-1-8-11-11l-2 7q7-1 13 8z"
            fill="#d7d8db"
          />
        ))}
        <circle
          cx="32"
          cy="32"
          r="4.2"
          fill="#9c9da1"
          stroke="#eee"
          strokeWidth="1.4"
        />
      </>
    );
  } else if (id === "files") {
    art = (
      <g filter={`url(#${key}soft)`}>
        <path
          d="M8 16q0-3 4-3h13l6 5h21q4 0 4 5v28q0 3-4 3H12q-4 0-4-4z"
          fill="#009ce9"
        />
        <rect x="10" y="21" width="44" height="30" rx="3" fill="#fff" />
        <rect x="8" y="24" width="48" height="29" rx="4" fill={g("blue")} />
        <path d="M11 25h42" stroke="#81e8ff" strokeWidth="1.5" />
      </g>
    );
  } else if (id === "weather") {
    bg = g("blue");
    art = (
      <>
        <circle cx="43" cy="25" r="13" fill={g("sun")} />
        <path
          d="M14 48h31q12-2 9-14-2-8-12-8-4-11-16-8-8 1-9 12-10-2-12 8-2 9 9 10"
          fill={g("cloud")}
          filter={`url(#${key}soft)`}
        />
      </>
    );
  } else if (id === "notes") {
    art = (
      <>
        <path d="M0 0h64v22H0z" fill="#ffd84a" />
        <path d="M0 22h64" stroke="#f1f1f1" strokeWidth="1.5" />
        <path d="M0 24h64v40H0z" fill="#fff" />
        {[31, 42, 53].map((y) => (
          <path key={y} d={`M10 ${y}h44`} stroke="#c9c9c9" strokeWidth="1" />
        ))}
      </>
    );
  } else if (id === "recorder") {
    bg = g("black");
    art = (
      <>
        <rect x="0" y="0" width="64" height="64" rx="14" fill={g("black")} />
        <path
          d="M7 32h4l3-8 4 18 4-27 4 34 4-24 4 15 4-22 4 20 4-12 4 6h7"
          fill="none"
          stroke="#ff453a"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 32h5l3-5 4 11 4-20 4 29 4-21 4 13 4-18 4 16 4-10 4 5h7"
          fill="none"
          stroke="#f4f4f7"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".96"
        />
      </>
    );
  } else if (id === "reminders") {
    art = (
      <>
        {["#00a0ef", "#f43a41", "#ff8b00"].map((c, n) => (
          <g key={c}>
            <circle
              cx="13"
              cy={16 + n * 16}
              r="4.2"
              fill="none"
              stroke={c}
              strokeWidth="2.5"
            />
            <path d={`M24 ${16 + n * 16}h30`} stroke="#bbb" strokeWidth="1.1" />
          </g>
        ))}
      </>
    );
  } else if (id === "wallet") {
    bg = g("black");
    art = (
      <>
        <rect x="8" y="14" width="48" height="37" rx="7" fill="#bdbbb9" />
        {["#00aef3", "#ffbb00", "#ff7845", "#e94446"].map((c, n) => (
          <path key={c} d={`M12 ${18 + n * 5}h40v18H12z`} fill={c} />
        ))}
        <path d="M10 34h13q9 14 18 0h13v16H10z" fill={g("wallet")} />
      </>
    );
  } else if (id === "qq") {
    art = (
      <g filter={`url(#${key}soft)`}>
        <ellipse cx="25" cy="53" rx="12" ry="4" fill="#ffb524" />
        <ellipse cx="42" cy="53" rx="12" ry="4" fill="#ffb524" />
        <path d="M12 40q-4 10 2 8l5-8M51 38q9 13 2 12l-6-10" fill="#111" />
        <ellipse cx="32" cy="33" rx="18" ry="25" fill="#08090a" />
        <ellipse cx="32" cy="38" rx="13" ry="15" fill="#fff" />
        <ellipse cx="26" cy="20" rx="4" ry="6" fill="#fff" />
        <ellipse cx="37" cy="20" rx="4" ry="6" fill="#fff" />
        <circle cx="27" cy="21" r="2" />
        <circle cx="36" cy="21" r="2" />
        <ellipse cx="32" cy="28" rx="9" ry="3.5" fill="#ffb51d" />
        <path
          d="M15 31q17 8 34 0l-1 6q-16 6-33-1zM23 36h7v13h-7"
          fill="#ec101d"
        />
      </g>
    );
  } else {
    bg = g("black");
    art = (
      <path
        d="M48 17C42 5 17 8 14 25c-5 23 26 32 36 17 9-15-9-25-23-17-11 8 7 17 13 8 5-8 0-16-10-14M49 29c6 20-16 31-29 17"
        fill="none"
        stroke="white"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg className="app-artwork" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        {[
          ["paper", "#fff", "#ededed"],
          ["blue", "#09c2ff", "#0757ef"],
          ["metal", "#f6f6f6", "#9c9da0"],
          ["steel", "#bdbfc3", "#6e7078"],
          ["sun", "#ffe82d", "#ffae00"],
          ["cloud", "#fff", "#a5d9ff"],
          ["black", "#262628", "#020203"],
          ["wallet", "#ffe2d3", "#bfa59b"],
          ["music", "#fa365c", "#c91644"],
          ["recorder", "#a5a6ae", "#53545d"],
          ["maps", "#f6f8f5", "#dce9df"],
          ["safari", "#55d3ff", "#0665d9"],
          ["instagram", "#ffd776", "#b52db8"],
          ["kakao", "#ffe812", "#f8d900"],
        ].map(([n, a, b]) => (
          <linearGradient id={key + n} key={n} x2="0" y2="1">
            <stop stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
        <radialGradient id={key + "lens"} cx="35%" cy="25%">
          <stop stopColor="#53689c" />
          <stop offset=".5" stopColor="#151936" />
          <stop offset=".8" stopColor="#020518" />
          <stop offset="1" stopColor="#204e84" />
        </radialGradient>
        <filter id={key + "soft"} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy=".7" stdDeviation=".7" floodOpacity=".2" />
        </filter>
      </defs>
      <rect width="64" height="64" fill={bg} />
      {art}
      <rect
        x=".4"
        y=".4"
        width="63.2"
        height="63.2"
        rx="14"
        fill="none"
        stroke="#ffffff65"
        strokeWidth=".8"
      />
    </svg>
  );
}
