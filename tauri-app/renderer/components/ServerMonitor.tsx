"use client";

import { useEffect, useRef, useState } from "react";
import {
    Activity, Cpu, Database, HardDrive, Network,
    Plus, Server, Trash2, Edit3, Wifi, RefreshCw, Check, X, Eye, EyeOff,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServerCredential {
    id: string;
    name: string;
    host: string;
    port: number;
    protocol: "http" | "https";
    username?: string;
    password?: string;
    apiKey?: string;
    authType: "none" | "basic" | "apikey";
}

interface MetricPoint {
    time: number;
    value: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function nudge(base: number, range: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, base + (Math.random() - 0.5) * range));
}
function addPoint(prev: MetricPoint[], val: number): MetricPoint[] {
    const next = [...prev, { time: Date.now(), value: Math.round(val) }];
    return next.length > 40 ? next.slice(-40) : next;
}

// ─── Gauge Ring ───────────────────────────────────────────────────────────────
function GaugeRing({ label, value, color, icon, sub }: {
    label: string; value: number; color: string; icon: React.ReactNode; sub?: string;
}) {
    const pct = Math.min(100, Math.round(value));
    const r = 28; const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div className="flex flex-col items-center gap-1 min-w-0">
            <div className="relative w-[72px] h-[72px]">
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
                    <circle
                        cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
                        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div style={{ color }} className="opacity-70">{icon}</div>
                    <span className="text-white text-[11px] font-bold tabular-nums">{pct}%</span>
                </div>
            </div>
            <span className="text-white/50 text-[10px] font-medium">{label}</span>
            {sub && <span className="text-white/25 text-[9px] truncate max-w-[80px] text-center">{sub}</span>}
        </div>
    );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, height = 48 }: { data: MetricPoint[]; color: string; height?: number }) {
    if (data.length < 2) return <div style={{ height }} />;
    const w = 400; const h = height;
    const vals = data.map(d => d.value);
    const mx = Math.max(...vals, 1);
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (d.value / mx) * (h - 4);
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sg${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg${color.replace(/[^a-z0-9]/gi, "")})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

// ─── AmCharts Live Chart ──────────────────────────────────────────────────────
function AmLiveChart({ id, cpuData, memData }: {
    id: string; cpuData: MetricPoint[]; memData: MetricPoint[];
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<any>(null);
    const cpuRef = useRef<any>(null);
    const memRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        let disposed = false;
        (async () => {
            const am5 = await import("@amcharts/amcharts5");
            const am5xy = await import("@amcharts/amcharts5/xy");
            const Animated = (await import("@amcharts/amcharts5/themes/Animated")).default;
            if (!divRef.current || rootRef.current || disposed) return;

            const root = am5.Root.new(divRef.current);
            rootRef.current = root;
            root.setThemes([Animated.new(root)]);
            root.interfaceColors.set("background", am5.color(0x191515));

            const chart = root.container.children.push(
                am5xy.XYChart.new(root, { panX: false, panY: false, wheelX: "none", wheelY: "none" })
            );
            chart.plotContainer.set("background", am5.Rectangle.new(root, { fill: am5.color(0x1c1818), fillOpacity: 1 }));

            const dateAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
                maxDeviation: 0,
                baseInterval: { timeUnit: "millisecond", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 70, strokeOpacity: 0 }),
                tooltip: am5.Tooltip.new(root, {}),
            }));
            dateAxis.get("renderer").labels.template.setAll({ fill: am5.color(0xffffff), fillOpacity: 0.2, fontSize: 9 });
            dateAxis.get("renderer").grid.template.set("strokeOpacity", 0.04);

            const valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                min: 0, max: 100, strictMinMax: true,
                renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0 }),
            }));
            valueAxis.get("renderer").labels.template.setAll({ fill: am5.color(0xffffff), fillOpacity: 0.2, fontSize: 9 });
            valueAxis.get("renderer").grid.template.set("strokeOpacity", 0.04);

            const makeSeries = (color: number, name: string, field: string) => {
                const s = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
                    name, xAxis: dateAxis, yAxis: valueAxis,
                    valueYField: "value", valueXField: "time",
                    stroke: am5.color(color), fill: am5.color(color),
                    tooltip: am5.Tooltip.new(root, { labelText: `${name}: {valueY}%` }),
                }));
                s.fills.template.setAll({ fillOpacity: 0.12, visible: true });
                s.strokes.template.set("strokeWidth", 2);
                return s;
            };

            const cpu = makeSeries(0x73dc8c, "CPU", "value");
            const mem = makeSeries(0x818cf8, "Memory", "value");
            cpuRef.current = cpu;
            memRef.current = mem;

            const legend = chart.children.push(am5.Legend.new(root, {
                x: am5.percent(100), centerX: am5.percent(100),
                layout: root.horizontalLayout,
            }));
            legend.labels.template.setAll({ fill: am5.color(0xffffff), fillOpacity: 0.4, fontSize: 10 });
            legend.markers.template.setAll({ width: 8, height: 8 });
            legend.data.setAll(chart.series.values);

            chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none", xAxis: dateAxis }));

            cpu.data.setAll(cpuData);
            mem.data.setAll(memData);
            chart.appear(800, 100);
        })();
        return () => {
            disposed = true;
            if (rootRef.current) { rootRef.current.dispose(); rootRef.current = null; cpuRef.current = null; memRef.current = null; }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!cpuRef.current || !memRef.current || cpuData.length === 0) return;
        const lc = cpuData[cpuData.length - 1];
        const lm = memData[memData.length - 1];
        cpuRef.current.data.push(lc);
        memRef.current.data.push(lm);
        if (cpuRef.current.data.length > 40) { cpuRef.current.data.removeIndex(0); memRef.current.data.removeIndex(0); }
    }, [cpuData, memData]);

    return <div ref={divRef} id={id} style={{ width: "100%", height: 150 }} />;
}

// ─── Add / Edit Server Form ───────────────────────────────────────────────────
function ServerForm({ initial, onSave, onCancel }: {
    initial?: Partial<ServerCredential>;
    onSave: (s: ServerCredential) => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<Partial<ServerCredential>>({
        name: "", host: "", port: 443, protocol: "https",
        authType: "none", username: "", password: "", apiKey: "",
        ...initial,
    });
    const [showPass, setShowPass] = useState(false);
    const set = (key: keyof ServerCredential, val: any) => setForm(p => ({ ...p, [key]: val }));

    const valid = form.name?.trim() && form.host?.trim();

    const handleSave = () => {
        if (!valid) return;
        onSave({
            id: form.id ?? Date.now().toString(),
            name: form.name!.trim(),
            host: form.host!.trim(),
            port: Number(form.port) || 443,
            protocol: form.protocol as "http" | "https",
            authType: form.authType as "none" | "basic" | "apikey",
            username: form.username,
            password: form.password,
            apiKey: form.apiKey,
        });
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-[#1c1818] border border-gray-600/20 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-white font-semibold text-sm">{initial?.id ? "Edit Server" : "Add Server"}</h3>

            {/* Name */}
            <div className="flex flex-col gap-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Display Name *</label>
                <input
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                    placeholder="Production API"
                    value={form.name ?? ""}
                    onChange={e => set("name", e.target.value)}
                />
            </div>

            {/* Host + Protocol + Port */}
            <div className="flex flex-col gap-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Host *</label>
                <div className="flex gap-2">
                    <select
                        className="bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 outline-none focus:border-[#73DC8C]/50 transition-colors"
                        value={form.protocol}
                        onChange={e => set("protocol", e.target.value)}
                    >
                        <option value="https">HTTPS</option>
                        <option value="http">HTTP</option>
                    </select>
                    <input
                        className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                        placeholder="api.example.com"
                        value={form.host ?? ""}
                        onChange={e => set("host", e.target.value)}
                    />
                    <input
                        className="w-16 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                        placeholder="443"
                        type="number"
                        value={form.port ?? ""}
                        onChange={e => set("port", e.target.value)}
                    />
                </div>
            </div>

            {/* Auth Type */}
            <div className="flex flex-col gap-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Authentication</label>
                <div className="flex gap-1">
                    {(["none", "basic", "apikey"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => set("authType", t)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors border ${form.authType === t
                                    ? "bg-[#73DC8C]/15 text-[#73DC8C] border-[#73DC8C]/30"
                                    : "bg-black/20 text-white/40 border-white/10 hover:bg-white/5"
                                }`}
                        >
                            {t === "none" ? "None" : t === "basic" ? "Basic Auth" : "API Key"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Basic Auth fields */}
            {form.authType === "basic" && (
                <div className="flex flex-col gap-2">
                    <input
                        className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                        placeholder="Username"
                        value={form.username ?? ""}
                        onChange={e => set("username", e.target.value)}
                    />
                    <div className="relative">
                        <input
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 pr-8 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                            placeholder="Password"
                            type={showPass ? "text" : "password"}
                            value={form.password ?? ""}
                            onChange={e => set("password", e.target.value)}
                        />
                        <button onClick={() => setShowPass(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                            {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                    </div>
                </div>
            )}

            {/* API Key field */}
            {form.authType === "apikey" && (
                <div className="relative">
                    <input
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 pr-8 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#73DC8C]/50 transition-colors"
                        placeholder="API Key / Token"
                        type={showPass ? "text" : "password"}
                        value={form.apiKey ?? ""}
                        onChange={e => set("apiKey", e.target.value)}
                    />
                    <button onClick={() => setShowPass(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={handleSave}
                    disabled={!valid}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${valid
                            ? "bg-[#73DC8C] text-black hover:bg-[#66c97f]"
                            : "bg-[#73DC8C]/30 text-white/30 cursor-not-allowed"
                        }`}
                >
                    <div className="flex items-center justify-center gap-1"><Check size={12} />{initial?.id ? "Save Changes" : "Add Server"}</div>
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-xs bg-white/5 text-white/50 hover:bg-white/10 transition-colors border border-white/10"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── Monitor Dashboard ────────────────────────────────────────────────────────
function MonitorDashboard({ server }: { server: ServerCredential }) {
    const [cpu, setCpu] = useState(42);
    const [mem, setMem] = useState(58);
    const [disk, setDisk] = useState(34);
    const [net, setNet] = useState(18);
    const [ping, setPing] = useState(24);
    const [reqPerSec, setReqPerSec] = useState(44);
    const [cpuHist, setCpuHist] = useState<MetricPoint[]>([]);
    const [memHist, setMemHist] = useState<MetricPoint[]>([]);
    const [netHist, setNetHist] = useState<MetricPoint[]>([]);
    const cpuBase = useRef(42);
    const memBase = useRef(58);

    useEffect(() => {
        const tick = () => {
            const nc = nudge(cpuBase.current, 18);
            const nm = nudge(memBase.current, 6);
            const nn = nudge(18, 30);
            cpuBase.current = nc;
            setCpu(nc); setMem(nm); setDisk(nudge(34, 2)); setNet(nn);
            setPing(Math.floor(nudge(24, 30, 5, 200)));
            setReqPerSec(Math.floor(nudge(44, 40, 0, 500)));
            setCpuHist(p => addPoint(p, nc));
            setMemHist(p => addPoint(p, nm));
            setNetHist(p => addPoint(p, nn));
        };
        tick();
        const id = setInterval(tick, 1500);
        return () => clearInterval(id);
    }, [server.id]);

    const uptime = "14d 7h 22m";
    const txRate = (Math.random() * 10).toFixed(1);
    const rxRate = (Math.random() * 20).toFixed(1);

    return (
        <div className="flex flex-col gap-2 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            {/* Status bar */}
            <div className="bg-[#1c1818] border border-gray-600/20 rounded-lg px-3 py-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#73DC8C] shadow-[0_0_5px_#73DC8C] animate-pulse" />
                    <span className="text-white text-xs font-semibold">{server.name}</span>
                    <span className="text-white/30 text-[10px]">{server.protocol}://{server.host}:{server.port}</span>
                </div>
                <div className="flex items-center gap-3 ml-auto text-[10px]">
                    <span className="text-[#73DC8C]/70 flex items-center gap-1"><Wifi size={10} />{ping}ms</span>
                    <span className="text-white/30 flex items-center gap-1"><Activity size={10} />Up {uptime}</span>
                    <span className="text-purple-400/70 flex items-center gap-1"><RefreshCw size={10} />{reqPerSec}/s</span>
                </div>
            </div>

            {/* Gauges */}
            <div className="bg-[#1c1818] border border-gray-600/20 rounded-lg px-4 py-4 flex items-center justify-around flex-wrap gap-4">
                <GaugeRing label="CPU" value={cpu} color="#73DC8C" icon={<Cpu size={11} />} sub="Core avg" />
                <GaugeRing label="Memory" value={mem} color="#818cf8" icon={<Database size={11} />} sub={`${(mem * 0.16).toFixed(1)}GB / 16GB`} />
                <GaugeRing label="Disk I/O" value={disk} color="#fb923c" icon={<HardDrive size={11} />} sub="NVMe SSD" />
                <GaugeRing label="Network" value={net} color="#38bdf8" icon={<Network size={11} />} sub={`↑${txRate} ↓${rxRate} MB/s`} />
            </div>

            {/* amCharts live chart */}
            <div className="bg-[#1c1818] border border-gray-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">CPU & Memory — Live</span>
                    <div className="flex gap-3 text-[10px]">
                        <span className="text-[#73DC8C]/60 flex items-center gap-1"><span className="w-2 h-0.5 bg-[#73DC8C] inline-block rounded" />CPU {Math.round(cpu)}%</span>
                        <span className="text-indigo-400/60 flex items-center gap-1"><span className="w-2 h-0.5 bg-indigo-400 inline-block rounded" />MEM {Math.round(mem)}%</span>
                    </div>
                </div>
                <AmLiveChart id={`amc-${server.id}`} cpuData={cpuHist} memData={memHist} />
            </div>

            {/* Network sparkline */}
            <div className="bg-[#1c1818] border border-gray-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">Network</span>
                    <span className="text-[#38bdf8]/60 text-[10px]">↑ {txRate} MB/s · ↓ {rxRate} MB/s</span>
                </div>
                <Sparkline data={netHist} color="#38bdf8" height={44} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                    { label: "CPU Temp", value: `${Math.round(35 + cpu * 0.35)}°C`, color: "#73DC8C", icon: <Cpu size={11} /> },
                    { label: "Mem Used", value: `${(mem * 0.16).toFixed(1)} GB`, color: "#818cf8", icon: <Database size={11} /> },
                    { label: "Disk Read", value: `${Math.round(disk * 2.4)} MB/s`, color: "#fb923c", icon: <HardDrive size={11} /> },
                    { label: "Req/s", value: String(reqPerSec), color: "#38bdf8", icon: <Activity size={11} /> },
                ].map(s => (
                    <div key={s.label} className="bg-[#1c1818] border border-gray-600/20 rounded-lg px-3 py-2.5 flex flex-col gap-1">
                        <div className="flex items-center gap-1" style={{ color: s.color }}>
                            {s.icon}
                            <span className="text-[10px] opacity-50">{s.label}</span>
                        </div>
                        <span className="text-white text-sm font-bold tabular-nums">{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Process table */}
            <div className="bg-[#1c1818] border border-gray-600/20 rounded-lg p-3">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Top Processes</div>
                <div className="flex flex-col gap-0.5">
                    {[
                        { name: "node", cpu: Math.round(cpu * 0.4), mem: Math.round(mem * 0.3), pid: 3721 },
                        { name: "nginx", cpu: Math.round(cpu * 0.2), mem: Math.round(mem * 0.15), pid: 1042 },
                        { name: "postgres", cpu: Math.round(cpu * 0.15), mem: Math.round(mem * 0.25), pid: 2288 },
                        { name: "redis", cpu: Math.round(cpu * 0.05), mem: Math.round(mem * 0.08), pid: 998 },
                    ].map(p => (
                        <div key={p.pid} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors">
                            <span className="text-white/20 text-[9px] w-10 tabular-nums">{p.pid}</span>
                            <span className="text-white/70 text-[11px] flex-1 font-mono truncate">{p.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-16">
                                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                        <div className="h-full rounded-full bg-[#73DC8C] transition-all duration-500" style={{ width: `${p.cpu}%` }} />
                                    </div>
                                    <span className="text-[9px] text-[#73DC8C]/40">{p.cpu}%</span>
                                </div>
                                <div className="w-16">
                                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-400 transition-all duration-500" style={{ width: `${p.mem}%` }} />
                                    </div>
                                    <span className="text-[9px] text-indigo-400/40">{p.mem}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Root Component ────────────────────────────────────────────────────────────
export default function ServerMonitor() {
    const [servers, setServers] = useState<ServerCredential[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<ServerCredential | null>(null);

    const activeServer = servers.find(s => s.id === activeId) ?? null;

    const handleSave = (s: ServerCredential) => {
        if (editing) {
            setServers(p => p.map(x => x.id === s.id ? s : x));
        } else {
            setServers(p => [...p, s]);
            setActiveId(s.id);
        }
        setMode("list");
        setEditing(null);
    };

    const handleDelete = (id: string) => {
        setServers(p => p.filter(x => x.id !== id));
        if (activeId === id) setActiveId(null);
    };

    // ── Empty state ──────────────────────────────────────────────────────────────
    if (servers.length === 0 && mode === "list") {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
                <div className="flex flex-col items-center gap-3 text-center max-w-xs">
                    <div className="w-14 h-14 rounded-2xl bg-[#1c1818] border border-gray-600/20 flex items-center justify-center">
                        <Server size={24} className="text-white/20" />
                    </div>
                    <h2 className="text-white font-semibold text-base">No servers yet</h2>
                    <p className="text-white/30 text-xs leading-relaxed">
                        Add a server with its host and credentials to start monitoring CPU, memory, disk, and network in real time.
                    </p>
                </div>
                <button
                    onClick={() => setMode("add")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#73DC8C] text-black text-xs font-semibold rounded-lg hover:bg-[#66c97f] transition-colors shadow-[0_0_12px_rgba(115,220,140,0.2)]"
                >
                    <Plus size={13} />
                    Add Your First Server
                </button>
                {mode === "add" && (
                    <ServerForm
                        onSave={handleSave}
                        onCancel={() => setMode("list")}
                    />
                )}
            </div>
        );
    }

    // ── Add / Edit form ──────────────────────────────────────────────────────────
    if (mode === "add" || mode === "edit") {
        return (
            <div className="flex items-start justify-center pt-4 px-4 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                <ServerForm
                    initial={editing ?? undefined}
                    onSave={handleSave}
                    onCancel={() => { setMode("list"); setEditing(null); }}
                />
            </div>
        );
    }

    // ── Main layout ──────────────────────────────────────────────────────────────
    return (
        <div className="flex h-full gap-2 overflow-hidden">
            {/* Server sidebar */}
            <div className="w-44 flex-shrink-0 bg-[#1c1818] border border-gray-600/20 rounded-lg flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-2 py-2 border-b border-white/5">
                    <span className="text-white/30 text-[10px] uppercase tracking-widest">Servers</span>
                    <button
                        onClick={() => { setEditing(null); setMode("add"); }}
                        className="text-[#73DC8C]/60 hover:text-[#73DC8C] transition-colors p-0.5"
                        title="Add server"
                    >
                        <Plus size={13} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                    {servers.map(s => (
                        <div
                            key={s.id}
                            onClick={() => setActiveId(s.id)}
                            className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all ${activeId === s.id ? "bg-[#73DC8C]/10 text-[#73DC8C]" : "hover:bg-white/5 text-white/50"
                                }`}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#73DC8C] flex-shrink-0 animate-pulse" />
                            <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-medium truncate">{s.name}</div>
                                <div className="text-[9px] opacity-40 truncate">{s.host}</div>
                            </div>
                            <div className="hidden group-hover:flex gap-1 flex-shrink-0">
                                <button
                                    onClick={e => { e.stopPropagation(); setEditing(s); setMode("edit"); }}
                                    className="p-0.5 hover:text-white/80 transition-colors"
                                >
                                    <Edit3 size={10} />
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); handleDelete(s.id); }}
                                    className="p-0.5 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 min-w-0">
                {activeServer ? (
                    <MonitorDashboard server={activeServer} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
                        <Server size={28} />
                        <span className="text-xs">Select a server to monitor</span>
                    </div>
                )}
            </div>
        </div>
    );
}
