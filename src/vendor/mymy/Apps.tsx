/* React/data adapters for dudwo5/Mymy UI templates: kt/ktn/KHD/bub,
 * igHome/igProfile/igDM/igSheet, xHome. See NOTICE.txt for permission.
 * Author content, DOM globals, timers and media dependencies are excluded. */
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Settings,
  Users,
  MessageCircle,
  MoreHorizontal,
  Heart,
  Home,
  Grid,
  Send,
  Bookmark,
  Repeat2,
  BarChart2,
  Share,
  User,
  Bell,
  X,
  Smile,
  Menu,
  Compass,
} from "lucide-react";
import type { SkinProps } from "../../AppSkins";
import { Avatar, Media } from "../../skins/shared";
import { useSkinState } from "../../skinState";
import { makeItem, type Item } from "../../schema";
import "./ui.css";
import "./adapter.css";
const HC_AVATAR = "https://raw.githubusercontent.com/lmitiiiii/FoundPhone-Studio/main/IMG_4453.jpeg";
const MK_AVATAR = "https://raw.githubusercontent.com/lmitiiiii/FoundPhone-Studio/main/IMG_4449.jpeg";
function socialAvatar(name: string) {
  const value = name.toLowerCase();
  if (["东赫", "donghyuck", "coco66_", "coco_oo66", "hc"].some((key) => value.includes(key))) return HC_AVATAR;
  if (["马克", "mark", "rem_ark9982", "mk", "owner"].some((key) => value.includes(key))) return MK_AVATAR;
  return "";
}
function grouped(items: Item[]) {
  return [...new Set(items.map((i) => i.title))].map((title) => ({
    title,
    items: items.filter((i) => i.title === title),
  }));
}
export function messageRun(items: Item[], index: number) {
  const m = items[index],
    previous = items[index - 1],
    next = items[index + 1];
  return {
    first:
      !previous ||
      previous.outgoing !== m.outgoing ||
      previous.sender !== m.sender,
    last: !next || next.outgoing !== m.outgoing || next.sender !== m.sender,
  };
}
const read = (p: SkinProps, i: Item) =>
  p.creator || i.password ? p.onItem(i) : p.onRead(i.id);
function Blank() {
  return <p className="mymy-empty">暂无内容</p>;
}
function Back({ onClick }: { onClick: () => void }) {
  return (
    <button aria-label="返回" onClick={onClick}>
      <ArrowLeft size={22} />
    </button>
  );
}
export function MymyKakao(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "聊天"),
    [sent, setSent] = useSkinState<string[]>(p, "mymyKktSent", []),
    [draft, setDraft] = useState(""),
    [query, setQuery] = useState(""),
    [menu, setMenu] = useState(false);
  const list = grouped(p.items),
    messages = [
      ...p.items.filter((i) => i.title === p.thread),
      ...sent.flatMap((raw, index) => {
        try {
          const entry: unknown = JSON.parse(raw);
          if (
            !Array.isArray(entry) ||
            entry.length !== 3 ||
            !entry.every((v) => typeof v === "string") ||
            entry[0] !== p.thread
          )
            return [];
          return [
            makeItem({
              id: "local-kkt-" + index,
              title: entry[0],
              body: entry[1],
              time: entry[2],
              sender: p.owner || "机主",
              outgoing: true,
              meta: { local: "true" },
            }),
          ];
        } catch {
          return [];
        }
      }),
    ],
    scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = scroll.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [p.thread, messages.length]);
  return (
    <div className="mymy-ui mymy-kakao" data-mymy="kakao">
      {p.thread ? (
        <>
          <header className="kzth">
            <Back onClick={() => p.onThread("")} />
            <span className="kzname">{p.thread}</span>
            <span className="kzpill">
              <button aria-label="聊天菜单" onClick={() => setMenu(!menu)}>
                <Menu size={21} />
              </button>
            </span>
          </header>
          <div className="msgs kk" ref={scroll}>
            {messages.map((m, i) => {
              const run = messageRun(messages, i);
              return (
                <div
                  key={m.id}
                  className={
                    "kzm " +
                    (m.outgoing ? "kzmy" : "kzot") +
                    (run.first ? " first" : "")
                  }
                >
                  {!m.outgoing && run.first && (
                    <>
                      <div className="kzmav">
                        <Avatar name={m.sender} src={m.avatar || socialAvatar(m.sender)} />
                      </div>
                      <div className="kzmn">{m.sender}</div>
                    </>
                  )}
                  {m.outgoing && run.last && (
                    <span className="kzt">
                      {m.meta.unread || ""}
                      <br />
                      {m.time.slice(-5)}
                    </span>
                  )}
                  <button
                    className={"kzbub" + (m.media ? " kzimg" : "")}
                    onClick={() => m.meta.local !== "true" && read(p, m)}
                  >
                    {m.media ? <Media item={m} /> : m.body}
                  </button>
                  {!m.outgoing && run.last && (
                    <span className="kzt">{m.time.slice(-5)}</span>
                  )}
                </div>
              );
            })}
            {!messages.length && <Blank />}
          </div>
          <form
            className="kzinp"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) {
                setSent([
                  ...sent,
                  JSON.stringify([
                    p.thread,
                    draft.trim(),
                    p.virtualTime || "09:41",
                  ]),
                ]);
                setDraft("");
              }
            }}
          >
            <button
              type="button"
              aria-label="添加聊天内容"
              onClick={() => (p.creator ? p.onAdd() : setMenu(!menu))}
            >
              <Plus size={21} />
            </button>
            <input
              aria-label="KKT消息"
              placeholder="输入消息"
              value={draft}
              maxLength={2000}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Smile size={22} />
            <button
              className={draft.trim() ? "go" : ""}
              aria-label="发送KKT消息"
              disabled={!draft.trim()}
            >
              ↑
            </button>
          </form>
          {menu && (
            <div className="mymy-local-menu">
              <strong>{p.thread}</strong>
              <p>
                群成员：{[...new Set(messages.map((m) => m.sender))].join("、")}
              </p>
              <button onClick={() => setMenu(false)}>完成</button>
            </div>
          )}
        </>
      ) : (
        <div className="kzkk">
          <div className="kzhd">
            <header className="kzkh">
              <b className="kzti">
                {tab === "好友" ? p.owner || "好友" : "聊天"}
              </b>
              <span className="kzic">
                <button
                  aria-label="搜索聊天"
                  onClick={() => setQuery(query ? "" : " ")}
                >
                  <Search size={21} />
                </button>
                {p.creator && (
                  <button aria-label="新增内容" onClick={p.onAdd}>
                    <Plus />
                  </button>
                )}
                <button aria-label="KKT设置" onClick={() => setMenu(!menu)}>
                  <Settings size={21} />
                </button>
              </span>
            </header>
            <div className="kzkc2">
              {["好友", "聊天"].map((t) => (
                <button
                  key={t}
                  className={
                    "kzkpl " +
                    (t === tab || (t === "为你推荐" && tab === "推荐")
                      ? "on"
                      : "")
                  }
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {query !== "" && (
              <input
                className="mymy-search"
                aria-label="搜索KKT"
                value={query.trimStart()}
                onChange={(e) => setQuery(e.target.value || " ")}
                placeholder="搜索"
              />
            )}
          </div>
          <div className="kzkb">
            <div className="kzksec">
              {tab === "好友" ? "好友" : "全部聊天"} {list.length}
            </div>
            {list
              .filter((g) => g.title.includes(query.trim()))
              .map((g) => {
                const last = g.items.at(-1)!;
                return (
                  <button
                    className="kzkr kzkcr"
                    key={g.title}
                    onClick={() => p.onThread(g.title)}
                  >
                    <Avatar name={last.sender || g.title} src={last.avatar || socialAvatar(last.sender || g.title)} />
                    <span className="kzkn">
                      <b>{g.title}</b>
                      <small>{tab === "好友" ? last.sender : last.body || last.meta.preview || " "}</small>
                    </span>
                    <span className="kzkmt">
                      {last.time.slice(-5)}
                      {last.meta.unread && (
                        <i className="kzkbd">{last.meta.unread}</i>
                      )}
                    </span>
                  </button>
                );
              })}
            {!list.length && <Blank />}
          </div>
          <nav className="kzknv">
            {[Users, MessageCircle, Compass, Grid, MoreHorizontal].map(
              (Icon, i) => (
                <button
                  key={i}
                  aria-label={["好友", "聊天", "发现", "更多功能", "设置"][i]}
                  className={(tab === "好友" ? 0 : 1) === i ? "on" : ""}
                  onClick={() =>
                    i < 2 ? setTab(["好友", "聊天"][i]) : setMenu(true)
                  }
                >
                  <Icon />
                </button>
              ),
            )}
          </nav>
          {menu && (
            <div className="mymy-local-menu">
              <strong>KakaoTalk</strong>
              <p>作品内聊天</p>
              <button onClick={() => setMenu(false)}>完成</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export function MymyInstagram(p: SkinProps) {
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "主页"),
    [liked, setLiked] = useSkinState<string[]>(p, "mymyLiked", []),
    [saved, setSaved] = useSkinState<string[]>(p, "mymySaved", []),
    [replies, setReplies] = useSkinState<string[]>(p, "mymyReplies", []),
    [seen, setSeen] = useSkinState<string[]>(p, "mymySeen", []);
  const [sheet, setSheet] = useState<Item | null>(null),
    [selected, setSelected] = useState<Item | null>(null),
    [profileUser, setProfileUser] = useState("markcocolove"),
    [followingOpen, setFollowingOpen] = useState(false),
    [story, setStory] = useState(0),
    [draft, setDraft] = useState(""),
    [pop, setPop] = useState("");
  const posts = p.items.filter(
      (i) =>
        i.kind === "post" &&
        !i.id.startsWith("ig-question-") &&
        !i.meta.profileType &&
        i.folder !== "私信" &&
        i.meta.story !== "true",
    ),
    stories = p.items.filter((i) => i.meta.story === "true"),
    dms = p.items.filter((i) => i.folder === "私信"),
    active = stories[story - 1];
  const profile = p.items.find(
    (i) => i.meta.profileType && i.meta.username === profileUser,
  );
  const profilePosts = posts.filter(
    (i) => i.kind === "post" && i.meta.username === profileUser && !i.id.startsWith("ig-question-"),
  );
  const accountAvatar = (username: string) =>
    p.items.find((i) => i.meta.profileType && i.meta.username === username)?.meta.avatarUrl || "";
  const openProfile = (username: string) => {
    setProfileUser(username);
    setSelected(null);
    setTab("个人主页");
  };
  const renderBio = (bio: string) =>
    bio.split(/(@coco66_|@mark82_)/g).map((part, index) =>
      part === "@coco66_" || part === "@mark82_" ? (
        <button
          className="ig-mention"
          key={index}
          onClick={() => openProfile(part.slice(1))}
        >
          {part}
        </button>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  const toggle = (id: string, values: string[], set: (v: string[]) => void) =>
    set(values.includes(id) ? values.filter((v) => v !== id) : [...values, id]);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(
      () => setStory((n) => (n < stories.length ? n + 1 : 0)),
      5000,
    );
    return () => clearTimeout(t);
  }, [active, stories.length]);
  const openStory = (i: number) => {
    const m = stories[i];
    setSeen([...new Set([...seen, m.id])]);
    read(p, m);
    setStory(i + 1);
  };
  const openPost = (i: Item) => {
    if (p.creator || i.password) p.onItem(i);
    else {
      read(p, i);
      setSelected(i);
    }
  };
  const post = (i: Item) => (
    <article className="igp" key={i.id}>
      <header className="igph">
        <Avatar name={i.sender} src={accountAvatar(i.meta.username || i.sender)} />
        <div className="igpn">
          <button onClick={() => setTab("个人主页")}>
            <b>{i.sender}</b>
          </button>
          <small>{i.meta.location || i.time}</small>
        </div>
        <button aria-label="帖子详情" onClick={() => openPost(i)}>
          <MoreHorizontal />
        </button>
      </header>
      <div
        className="carw"
        onDoubleClick={() => {
          if (!liked.includes(i.id)) setLiked([...liked, i.id]);
          setPop(i.id);
        }}
      >
        <Media item={i} />
        {pop === i.id && (
          <Heart
            className="mymy-heart-pop"
            fill="white"
            onAnimationEnd={() => setPop("")}
          />
        )}
      </div>
      <div className="iga">
        <button
          aria-label={"点赞" + i.title}
          aria-pressed={liked.includes(i.id)}
          onClick={() => toggle(i.id, liked, setLiked)}
        >
          <Heart
            fill={liked.includes(i.id) ? "#ff3040" : "none"}
            color={liked.includes(i.id) ? "#ff3040" : "currentColor"}
          />
        </button>
        <button
          aria-label={"评论" + i.title}
          onClick={() => {
            read(p, i);
            setSheet(i);
          }}
        >
          <MessageCircle />
        </button>
        <button aria-label="分享帖子" onClick={() => setTab("私信")}>
          <Send />
        </button>
        <button
          className="mymy-save"
          aria-label={"收藏" + i.title}
          aria-pressed={saved.includes(i.id)}
          onClick={() => toggle(i.id, saved, setSaved)}
        >
          <Bookmark fill={saved.includes(i.id) ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="lk2">{i.likes + (liked.includes(i.id) ? 1 : 0)} 次赞</p>
      <button
        className="igc"
        onClick={() => {
          openPost(i);
        }}
      >
        <b>{i.sender}</b> {i.body}
      </button>
      <button className="cmall" onClick={() => setSheet(i)}>
        查看评论{" "}
        {i.comments.length +
          replies.filter((r) => r.startsWith(i.id + "\t")).length}
      </button>
      <p className="igt">{i.time}</p>
    </article>
  );
  return (
    <div className="mymy-ui mymy-instagram" data-mymy="instagram">
      <div className="ig">
        <header className="igh">
          <button
            aria-label={selected ? "返回Instagram动态" : "关闭当前App"}
            onClick={() => (selected ? setSelected(null) : p.onBack())}
          >
            <ArrowLeft />
          </button>
          <span className="igl2">
            {selected ? "帖子" : tab === "个人主页" ? profileUser : tab === "主页" ? "Instagram" : tab}
          </span>
          <button aria-label="打开私信" onClick={() => setTab("私信")}>
            <Send />
          </button>
        </header>
        <div className="igb">
          {selected && post(selected)}
          {!selected && tab === "主页" && (
            <>
              <div className="sts">
                {stories.map((s, n) => (
                  <button
                    className="st"
                    key={s.id}
                    onClick={() => openStory(n)}
                  >
                    <span
                      className={"sr on " + (seen.includes(s.id) ? "seen" : "")}
                    >
                      <Avatar name={s.sender} src={s.avatar} />
                    </span>
                    <small>{s.sender}</small>
                  </button>
                ))}
              </div>
              {posts.map(post)}
              {!posts.length && <Blank />}
            </>
          )}
          {!selected && tab === "个人主页" && (
            <>
              <div className="pf">
                <Avatar name={profileUser} src={profile?.meta.avatarUrl} />
                <div className="ps">
                  <div>
                    <b>{profilePosts.length}</b>
                    <small>帖子</small>
                  </div>
                  <div>
                    <b>{profile?.meta.followerCount || "56.8万"}</b>
                    <small>粉丝</small>
                  </div>
                  <button className="ig-stat-button" onClick={() => setFollowingOpen(true)}>
                    <b>{profile?.meta.followingCount || "2"}</b>
                    <small>关注</small>
                  </button>
                </div>
              </div>
              <p className="pn">
                <b>{profileUser}</b>
                {profile && (
                  <span className="ig-bio">
                    {renderBio(profile.body)}
                  </span>
                )}
              </p>
              <div className="ptab">
                <div className="on">
                  <Grid />
                </div>
              </div>
              <div className="pg2">
                {profilePosts.map((i) => (
                  <button key={i.id} onClick={() => openPost(i)}>
                    <Media item={i} />
                  </button>
                ))}
              </div>
              {followingOpen && (
                <div className="ig-following-overlay" onClick={() => setFollowingOpen(false)}>
                  <section className="ig-following-sheet" onClick={(e) => e.stopPropagation()}>
                    <header>
                      <b>正在关注</b>
                      <button onClick={() => setFollowingOpen(false)}>完成</button>
                    </header>
                    {p.items.filter((i) => i.meta.profileType && i.meta.username !== profileUser).map((i) => (
                      <button className="ig-following-row" key={i.meta.username} onClick={() => { setFollowingOpen(false); openProfile(i.meta.username); }}>
                        <Avatar name={i.meta.username} src={i.meta.avatarUrl} />
                        <span><b>{i.meta.username}</b><small>{i.meta.username === "coco66_" ? "最萌的达人" : i.meta.username === "mark82_" ? "最酷的达人" : "恋爱日记本"}</small></span>
                        <span className="ig-following-arrow">›</span>
                      </button>
                    ))}
                  </section>
                </div>
              )}
              {!profilePosts.length && <Blank />}
            </>
          )}
          {!selected && tab === "私信" && (
            <>
              {dms.map((i) => (
                <button className="kzkr" key={i.id} onClick={() => openPost(i)}>
                  <Avatar name={i.sender} src={i.avatar} />
                  <span className="kzkn">
                    <b>{i.title}</b>
                    <small>{i.body}</small>
                  </span>
                </button>
              ))}
              {!dms.length && <Blank />}
            </>
          )}
          {!selected && tab === "搜索" && (
            <>
              <input
                className="mymy-search"
                aria-label="搜索Instagram"
                placeholder="搜索"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              {posts
                .filter((i) => (i.title + i.body + i.sender).includes(draft))
                .map(post)}
            </>
          )}
        </div>
        <nav className="mymy-ig-nav">
          {[Home, Search, Send, User].map((Icon, n) => (
            <button
              key={n}
              aria-label={["主页", "搜索", "私信", "个人主页"][n]}
              aria-pressed={
                !selected && tab === ["主页", "搜索", "私信", "个人主页"][n]
              }
              onClick={() => {
                setSelected(null);
                setTab(["主页", "搜索", "私信", "个人主页"][n]);
              }}
            >
              <Icon />
            </button>
          ))}
        </nav>
      </div>
      {sheet && (
        <div className="kzcs">
          <button
            className="kzbk"
            aria-label="关闭评论"
            onClick={() => setSheet(null)}
          />
          <section className="kzsh" role="dialog" aria-label="Instagram评论">
            <div className="mymy-sheet-handle" />
            <header>
              <b>评论</b>
              <button aria-label="关闭评论面板" onClick={() => setSheet(null)}>
                <X />
              </button>
            </header>
            <div className="mymy-comments">
              {[
                ...sheet.comments,
                ...replies
                  .filter((r) => r.startsWith(sheet.id + "\t"))
                  .map((r) => r.split("\t").slice(1).join("\t")),
              ].map((c, n) => {
                const separator = c.indexOf("：") >= 0 ? c.indexOf("：") : c.indexOf(":");
                const username = separator >= 0 ? c.slice(0, separator).trim() : "你";
                const comment = separator >= 0 ? c.slice(separator + 1).trim() : c;
                return (
                  <div className="mymy-comment" key={n}>
                    <b>{username}</b>
                    <span>{comment}</span>
                  </div>
                );
              })}
            </div>
            <form
              className="cmb2"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) {
                  setReplies([...replies, sheet.id + "\t" + draft.trim()]);
                  setDraft("");
                }
              }}
            >
              <input
                aria-label="添加评论"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="添加评论"
                maxLength={500}
              />
              <button>发布</button>
            </form>
          </section>
        </div>
      )}
      {active && (
        <div
          className="mymy-story"
          onPointerDown={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const next =
              e.clientX - box.left < box.width * 0.3 ? story - 1 : story + 1;
            setStory(next > stories.length ? 0 : Math.max(0, next));
          }}
        >
          <div className="mymy-story-bars">
            {stories.map((s, n) => (
              <i key={s.id} className={n < story ? "seen" : ""} />
            ))}
          </div>
          <header>
            <Avatar name={active.sender} src={active.avatar} />
            <b>{active.sender}</b>
            <button
              aria-label="关闭快拍"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setStory(0)}
            >
              <X />
            </button>
          </header>
          <Media item={active} />
          <p>{active.body}</p>
        </div>
      )}
    </div>
  );
}
export function MymyX(p: SkinProps) {
  const [dark, setDark] = useSkinState<boolean>(p, "x-dark", true);
  const [tab, setTab] = useSkinState<string>(p, "mymyTab", "为你推荐");
  const [likes, setLikes] = useSkinState<string[]>(p, "mymyXLikes", []);
  const [reposts, setReposts] = useSkinState<string[]>(p, "mymyXReposts", []);
  const [marks, setMarks] = useSkinState<string[]>(p, "mymyXMarks", []);
  const [followed, setFollowed] = useSkinState<string[]>(p, "mymyXFollows", []);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<string | null>(null);
  const [detail, setDetail] = useState<Item | null>(null);
  const [compose, setCompose] = useState(false);
  const [draft, setDraft] = useState("");
  const [localPosts, setLocalPosts] = useSkinState<string[]>(p, "mymyXLocalPosts", []);
  const profiles = p.items.filter(i => i.id.startsWith("x-profile-"));
  const posts = p.items.filter(i => i.id.startsWith("x-") && i.kind === "post");
  const selectedProfile = profiles.find(i => i.meta.username === profile);
  const isLiked = (id: string) => typeof p.ui?.["liked-" + id] === "boolean" ? Boolean(p.ui["liked-" + id]) : likes.includes(id);
  const isSaved = (id: string) => typeof p.ui?.["saved-" + id] === "boolean" ? Boolean(p.ui["saved-" + id]) : marks.includes(id);
  const toggle = (id: string, values: string[], setter: (x: string[]) => void) => setter(values.includes(id) ? values.filter(x => x !== id) : [...values, id]);
  const count = (v: string | undefined) => v || "0";
  const visible = posts.filter(i => {
    const name = i.meta.username || "";
    if (profile && name !== profile) return false;
    if (i.meta.visibility === "private" && !profile) return false;
    if (tab === "正在关注" && !followed.includes(name)) return false;
    if (tab === "喜欢") return isLiked(i.id);
    if (tab === "已收藏") return isSaved(i.id);
    if (query && !(i.body + name + i.meta.handle).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const comments = (item: Item) => (item.meta.comments || "").split("\n").filter(Boolean);
  return (
    <div className={"mymy-ui mymy-x " + (dark ? "x-reference-dark" : "")} data-mymy="twitter">
      <div className="kzxw">
        <header className="kzxh">
          <button aria-label="返回" onClick={() => profile || detail ? (setProfile(null), setDetail(null)) : p.onBack()}><ArrowLeft /></button>
          <div className="kzxlg">𝕏</div>
          <button aria-label="切换外观" onClick={() => setDark(!dark)}><User /></button>
        </header>
        {detail ? (
          <section className="kzx-detail">
            <h3>帖子</h3>
            <article className="kzxt">
              <Avatar name={detail.meta.username || "用户"} src={detail.avatar} />
              <div className="kzxb">
                <div className="kzxn"><b>{detail.meta.username}</b><small>@{detail.meta.handle} · {detail.time}</small></div>
                <p className="kzxx">{detail.body}</p>
                {[detail.meta.galleryUrl1, detail.meta.galleryUrl2, detail.meta.galleryUrl3].filter(Boolean).length ? <div className="kzx-gallery">{[detail.meta.galleryUrl1, detail.meta.galleryUrl2, detail.meta.galleryUrl3].filter(Boolean).map((url) => <img key={url} src={url} loading="lazy" alt="动态配图" />)}</div> : (detail.media || detail.meta.imageUrl || detail.meta.mediaUrl || detail.meta.coverUrl) && <Media item={detail} />}
                <p className="kzx-stats">{count(detail.meta.replies)} 回复 {count(detail.meta.reposts)} 转发 {count(detail.meta.likes)} 喜欢 {count(detail.meta.views)} 浏览</p>
                <h4>回复</h4>
                {comments(detail).map((line, n) => { const at = line.indexOf("："); return <div className="kzx-comment" key={n}><b>{at > -1 ? line.slice(0, at) : "用户"}</b><span>{at > -1 ? line.slice(at + 1) : line}</span></div>; })}
              </div>
            </article>
          </section>
        ) : profile && selectedProfile ? (
          <section className="kzx-profile">
            <button className="kzx-backlink" onClick={() => setProfile(null)}>← 返回时间线</button>
            <div className="kzx-cover" />
            <div className="kzx-profile-head"><Avatar name={selectedProfile.meta.username} src={selectedProfile.meta.avatarUrl || socialAvatar(selectedProfile.meta.username)} /><button onClick={() => toggle(profile, followed, setFollowed)}>{followed.includes(profile) ? "正在关注" : "关注"}</button></div>
            <h2>{selectedProfile.meta.username}</h2><p>@{selectedProfile.meta.handle}</p><p>{selectedProfile.body}</p>
            <p className="kzx-stats">{selectedProfile.meta.following} 正在关注 {selectedProfile.meta.followers} 关注者</p>
            <div className="kzxtb"><button className="on">帖子</button><button onClick={() => setTab("喜欢")}>喜欢</button></div>
            {posts.filter(i => i.meta.username === profile).map(i => <article className="kzxt" key={i.id}><Avatar name={profile} src={selectedProfile?.meta.avatarUrl || socialAvatar(profile)} /><div className="kzxb"><div className="kzxn"><b>{profile}</b><small>@{i.meta.handle} · {i.time}</small></div><button className="kzxx" onClick={() => setDetail(i)}>{i.body}</button>{[i.meta.galleryUrl1, i.meta.galleryUrl2, i.meta.galleryUrl3].filter(Boolean).length ? <div className="kzx-gallery">{[i.meta.galleryUrl1, i.meta.galleryUrl2, i.meta.galleryUrl3].filter(Boolean).map((url) => <img key={url} src={url} loading="lazy" alt="动态配图" />)}</div> : (i.media || i.meta.imageUrl || i.meta.mediaUrl || i.meta.coverUrl) && <button className="kzxv" onClick={() => setDetail(i)}><Media item={i}/></button>}<div className="kzxac"><button onClick={() => setDetail(i)}><MessageCircle/>{count(i.meta.replies)}</button><button><Repeat2/>{count(i.meta.reposts)}</button><button><Heart/>{count(i.meta.likes)}</button></div></div></article>)}
          </section>
        ) : (
          <>
            <div className="kzxtb">
              {["为你推荐", "正在关注", "喜欢", "已收藏"].map(t => <button className={tab === t ? "on" : ""} key={t} onClick={() => {setTab(t);setProfile(null);}}>{t}</button>)}
            </div>
            <div className="kzx-account-strip">
              {profiles.map(x => <button key={x.id} onClick={() => {setProfile(x.meta.username);setTab("主页");}}><Avatar name={x.meta.username} src={x.meta.avatarUrl || socialAvatar(x.meta.username)}/><span><b>{x.meta.username}</b><small>@{x.meta.handle}</small></span></button>)}
            </div>
            <div className="kzx-searchbox"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索帖子、账号和话题"/></div>
            <div className="kzxfd">
              {visible.map(i => (
                <article className="kzxt" key={i.id}>
                  <button className="kzx-avatar-button" onClick={() => setProfile(i.meta.username)}><Avatar name={i.meta.username || "用户"} src={i.avatar || socialAvatar(i.meta.username || "")}/></button>
                  <div className="kzxb">
                    <div className="kzxn"><button onClick={() => setProfile(i.meta.username)}><b>{i.meta.username}</b></button><small>@{i.meta.handle || "user"} · {i.time}{i.meta.visibility === "private" ? " · 🔒 私密" : ""}</small><em><MoreHorizontal size={18}/></em></div>
                    <button className="kzxx" onClick={() => setDetail(i)}>{i.body}</button>
                    {[i.meta.galleryUrl1, i.meta.galleryUrl2, i.meta.galleryUrl3].filter(Boolean).length ? <div className="kzx-gallery">{[i.meta.galleryUrl1, i.meta.galleryUrl2, i.meta.galleryUrl3].filter(Boolean).map((url) => <img key={url} src={url} loading="lazy" alt="动态配图" />)}</div> : (i.media || i.meta.imageUrl || i.meta.mediaUrl || i.meta.coverUrl) && <button className="kzxv" aria-label="打开媒体" onClick={() => setDetail(i)}><Media item={i}/></button>}
                    <div className="kzxac">
                      <button aria-label="评论" onClick={() => setDetail(i)}><MessageCircle/>{count(i.meta.replies)}</button>
                      <button aria-label="转发" aria-pressed={reposts.includes(i.id)} onClick={() => toggle(i.id,reposts,setReposts)}><Repeat2/>{count(i.meta.reposts)}</button>
                      <button aria-label="点赞" aria-pressed={isLiked(i.id)} onClick={() => {toggle(i.id,likes,setLikes);p.onUi?.("liked-"+i.id,!isLiked(i.id));}}><Heart fill={isLiked(i.id) ? "#f91880" : "none"}/>{count(i.meta.likes)}</button>
                      <span><BarChart2/>{count(i.meta.views)}</span>
                      <button aria-label="收藏" aria-pressed={isSaved(i.id)} onClick={() => {toggle(i.id,marks,setMarks);p.onUi?.("saved-"+i.id,!isSaved(i.id));}}><Bookmark/></button>
                      <button aria-label="分享" onClick={() => setDetail(i)}><Share/></button>
                    </div>
                  </div>
                </article>
              ))}
              {!visible.length && <Blank/>}
            </div>
            <nav className="kzxnav">
              <button aria-label="首页" onClick={() => {setTab("为你推荐");setQuery("");}}><Home/></button>
              <button aria-label="搜索" onClick={() => (document.querySelector(".kzx-searchbox input") as HTMLInputElement | null)?.focus()}><Search/></button>
              <button aria-label="通知" onClick={() => setTab("通知")}><Bell/></button>
              <button aria-label="私信" onClick={() => setTab("私信")}><MessageCircle/></button>
            </nav>
            <button className="kzx-compose" aria-label="发布帖子" onClick={() => setCompose(true)}><Plus/></button>
            {compose && <div className="kzx-compose-sheet"><h3>发布帖子</h3><textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="有什么新鲜事？"/><div><button onClick={() => setCompose(false)}>取消</button><button disabled={!draft.trim()} onClick={() => {setLocalPosts([...localPosts,draft.trim()]);setDraft("");setCompose(false);}}>发布</button></div></div>}
            {tab === "通知" && <div className="kzx-notice"><h3>通知</h3><p>有人回复了你的动态</p><p>你的帖子收到了新的喜欢</p><p>你关注的账号发布了新动态</p></div>}
            {tab === "私信" && <div className="kzx-notice"><h3>私信</h3><p>暂时没有新的私信</p><p>与你关注的账号保持联系</p></div>}
            {localPosts.map((body,n)=><div className="kzx-local-post" key={n}><b>你</b><p>{body}</p><small>刚刚</small></div>)}
          </>
        )}
      </div>
    </div>
  );
}
