"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  Moon,
  PackageCheck,
  ShoppingBag,
  Sun,
  UsersRound,
} from "lucide-react";
import styles from "./SalesDashboard.module.css";

type Theme = "light" | "dark";
type OrderTone = "success" | "processing" | "cancelled";

type Order = {
  id: string;
  customer: string;
  initials: string;
  product: string;
  date: string;
  amount: string;
  status: string;
  tone: OrderTone;
};

const salesData = [
  { day: "Pzt", date: "01 Ağustos", value: 24200 },
  { day: "Sal", date: "02 Ağustos", value: 31800 },
  { day: "Çar", date: "03 Ağustos", value: 28750 },
  { day: "Per", date: "04 Ağustos", value: 35360 },
  { day: "Cum", date: "05 Ağustos", value: 39840 },
  { day: "Cmt", date: "06 Ağustos", value: 42390 },
  { day: "Paz", date: "07 Ağustos", value: 46300 },
] as const;

const orders: Order[] = [
  {
    id: "MS-1048",
    customer: "Derya Yılmaz",
    initials: "DY",
    product: "Premium Organizasyon Paketi",
    date: "Bugün, 14:32",
    amount: "₺12.480",
    status: "Tamamlandı",
    tone: "success",
  },
  {
    id: "MS-1047",
    customer: "Mert Aydın",
    initials: "MA",
    product: "Kurumsal Lansman Paketi",
    date: "Bugün, 12:18",
    amount: "₺8.750",
    status: "İşleniyor",
    tone: "processing",
  },
  {
    id: "MS-1046",
    customer: "Selin Kaya",
    initials: "SK",
    product: "Otel Eğlence Konsepti",
    date: "Dün, 18:06",
    amount: "₺6.240",
    status: "Tamamlandı",
    tone: "success",
  },
  {
    id: "MS-1045",
    customer: "Burak Demir",
    initials: "BD",
    product: "Çocuk Etkinliği Paketi",
    date: "Dün, 15:47",
    amount: "₺4.890",
    status: "Beklemede",
    tone: "processing",
  },
  {
    id: "MS-1044",
    customer: "Aslı Çetin",
    initials: "AÇ",
    product: "Özel Gün Organizasyonu",
    date: "05 Ağustos, 11:24",
    amount: "₺9.360",
    status: "İptal edildi",
    tone: "cancelled",
  },
];

const moneyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function SalesDashboard() {
  const [theme, setTheme] = useState<Theme>("light");
  const [activePointIndex, setActivePointIndex] = useState(salesData.length - 1);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-dashboard-page");
    const savedTheme = window.localStorage.getItem("sales-dashboard-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
    setHasHydrated(true);

    return () => {
      document.body.classList.remove("is-dashboard-page");
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    if (hasHydrated) {
      window.localStorage.setItem("sales-dashboard-theme", theme);
    }
  }, [hasHydrated, theme]);

  const chart = useMemo(() => {
    const width = 760;
    const height = 280;
    const padding = { top: 22, right: 20, bottom: 42, left: 56 };
    const chartMax = 50000;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const points = salesData.map((entry, index) => ({
      ...entry,
      x: padding.left + (index * innerWidth) / (salesData.length - 1),
      y: padding.top + innerHeight - (entry.value / chartMax) * innerHeight,
    }));
    const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
    const gridValues = [0, 12500, 25000, 37500, 50000];

    return { width, height, padding, points, linePath, areaPath, gridValues, chartMax };
  }, []);

  const activePoint = chart.points[activePointIndex];

  return (
    <div className={`${styles.page} ${theme === "dark" ? styles.dark : styles.light}`}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>M</div>
            <div>
              <strong>Megastar</strong>
              <span>Organizasyon</span>
            </div>
          </div>

          <div className={styles.navLabel}>Yönetim</div>
          <nav className={styles.nav} aria-label="Panel menüsü">
            <a className={`${styles.navItem} ${styles.navItemActive}`} href="#overview">
              <LayoutDashboard size={18} strokeWidth={2} />
              Genel Bakış
            </a>
            <a className={styles.navItem} href="#orders">
              <ShoppingBag size={18} strokeWidth={2} />
              Siparişler
            </a>
            <a className={styles.navItem} href="#channels">
              <BarChart3 size={18} strokeWidth={2} />
              Raporlar
            </a>
            <a className={styles.navItem} href="#customers">
              <UsersRound size={18} strokeWidth={2} />
              Müşteriler
            </a>
          </nav>

          <div className={styles.sidebarPeriod}>
            <span>Raporlama dönemi</span>
            <strong>01 - 07 Ağustos</strong>
            <small>2026 yılı güncel verileri</small>
          </div>

          <div className={styles.sidebarUser}>
            <div className={styles.avatar}>AE</div>
            <div>
              <strong>Ahmet Erdem</strong>
              <span>Yönetici</span>
            </div>
          </div>
        </aside>

        <main className={styles.content} id="overview">
          <header className={styles.topbar}>
            <div className={styles.mobileBrand}>
              <div className={styles.brandMark}>M</div>
              <strong>Megastar</strong>
            </div>
            <div className={styles.topbarActions}>
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
                title={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <div className={styles.profileButton}>
                <div className={styles.avatar}>AE</div>
                <div className={styles.profileText}>
                  <strong>Ahmet Erdem</strong>
                  <span>Yönetici</span>
                </div>
                <ChevronDown size={16} />
              </div>
            </div>
          </header>

          <div className={styles.pageInner}>
            <section className={styles.pageHeading}>
              <div>
                <div className={styles.eyebrow}>Genel Bakış <span>/</span> Raporlar</div>
                <h1>Satış Paneli</h1>
                <p>Satış performansınızı ve güncel sipariş hareketlerini tek yerden takip edin.</p>
              </div>
              <button className={styles.dateButton} type="button">
                <CalendarDays size={17} />
                <span>01 - 07 Ağustos 2026</span>
                <ChevronDown size={16} />
              </button>
            </section>

            <section className={styles.statsGrid} id="customers" aria-label="Satış özetleri">
              <article className={`${styles.statCard} ${styles.statBlue}`}>
                <div className={styles.statTopline}>
                  <div className={styles.statIcon}><CircleDollarSign size={20} /></div>
                  <span className={styles.statPeriod}>Bu hafta</span>
                </div>
                <div className={styles.statValue}>{moneyFormatter.format(248640)}</div>
                <div className={styles.statBottomline}>
                  <span>Toplam gelir</span>
                  <span className={styles.positive}><ArrowUpRight size={14} />12,8%</span>
                </div>
              </article>

              <article className={`${styles.statCard} ${styles.statTeal}`}>
                <div className={styles.statTopline}>
                  <div className={styles.statIcon}><ShoppingBag size={20} /></div>
                  <span className={styles.statPeriod}>Bu hafta</span>
                </div>
                <div className={styles.statValue}>384</div>
                <div className={styles.statBottomline}>
                  <span>Sipariş sayısı</span>
                  <span className={styles.positive}><ArrowUpRight size={14} />8,4%</span>
                </div>
              </article>

              <article className={`${styles.statCard} ${styles.statAmber}`}>
                <div className={styles.statTopline}>
                  <div className={styles.statIcon}><UsersRound size={20} /></div>
                  <span className={styles.statPeriod}>Aktif</span>
                </div>
                <div className={styles.statValue}>298</div>
                <div className={styles.statBottomline}>
                  <span>Müşteri sayısı</span>
                  <span className={styles.positive}><ArrowUpRight size={14} />6,2%</span>
                </div>
              </article>
            </section>

            <section className={styles.mainGrid}>
              <article className={`${styles.panel} ${styles.chartPanel}`}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Satış performansı</h2>
                    <p>Günlük gelir dağılımı</p>
                  </div>
                  <span className={styles.chartBadge}><span /> Son 7 gün</span>
                </div>
                <div className={styles.chartWrap}>
                  <svg className={styles.chart} viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="Son yedi günün satış geliri çizgi grafiği">
                    <defs>
                      <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {chart.gridValues.map((value) => {
                      const y = chart.padding.top + (chart.height - chart.padding.top - chart.padding.bottom) * (1 - value / chart.chartMax);
                      return (
                        <g key={value}>
                          <line className={styles.gridLine} x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={y} y2={y} />
                          <text className={styles.axisLabel} x={chart.padding.left - 12} y={y + 4} textAnchor="end">
                            {value === 0 ? "0" : `${compactFormatter.format(value)} ₺`}
                          </text>
                        </g>
                      );
                    })}
                    <path className={styles.chartArea} d={chart.areaPath} fill="url(#salesFill)" />
                    <path className={styles.chartLine} d={chart.linePath} />
                    {chart.points.map((point, index) => (
                      <g key={point.day}>
                        <circle
                          className={`${styles.chartPoint} ${index === activePointIndex ? styles.chartPointActive : ""}`}
                          cx={point.x}
                          cy={point.y}
                          r={index === activePointIndex ? 5 : 4}
                          tabIndex={0}
                          role="button"
                          aria-label={`${point.day}: ${moneyFormatter.format(point.value)}`}
                          onMouseEnter={() => setActivePointIndex(index)}
                          onFocus={() => setActivePointIndex(index)}
                        />
                        <text className={styles.dayLabel} x={point.x} y={chart.height - 12} textAnchor="middle">{point.day}</text>
                      </g>
                    ))}
                  </svg>
                  <div
                    className={styles.chartTooltip}
                    style={{
                      left: `${(activePoint.x / chart.width) * 100}%`,
                      top: `${(activePoint.y / chart.height) * 100}%`,
                      transform: activePointIndex === 0 ? "translate(0, -112%)" : activePointIndex === salesData.length - 1 ? "translate(-100%, -112%)" : "translate(-50%, -112%)",
                    }}
                    aria-live="polite"
                  >
                    <strong>{moneyFormatter.format(activePoint.value)}</strong>
                    <span>{activePoint.date}</span>
                  </div>
                </div>
              </article>

              <article className={`${styles.panel} ${styles.channelPanel}`} id="channels">
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Satış kanalları</h2>
                    <p>Gelir kaynaklarının dağılımı</p>
                  </div>
                  <button className={styles.moreButton} type="button" aria-label="Satış kanalı seçenekleri" title="Seçenekler">•••</button>
                </div>
                <div className={styles.channelTotal}>
                  <strong>₺248.640</strong>
                  <span>Toplam gelir</span>
                </div>
                <div className={styles.channels}>
                  <div className={styles.channelRow}>
                    <div className={styles.channelName}><span className={`${styles.channelDot} ${styles.dotBlue}`} />Web sitesi <strong>%62</strong></div>
                    <div className={styles.progress}><span className={styles.progressBlue} style={{ width: "62%" }} /></div>
                    <small>₺154.156</small>
                  </div>
                  <div className={styles.channelRow}>
                    <div className={styles.channelName}><span className={`${styles.channelDot} ${styles.dotTeal}`} />Mobil uygulama <strong>%24</strong></div>
                    <div className={styles.progress}><span className={styles.progressTeal} style={{ width: "24%" }} /></div>
                    <small>₺59.674</small>
                  </div>
                  <div className={styles.channelRow}>
                    <div className={styles.channelName}><span className={`${styles.channelDot} ${styles.dotAmber}`} />Mağaza <strong>%14</strong></div>
                    <div className={styles.progress}><span className={styles.progressAmber} style={{ width: "14%" }} /></div>
                    <small>₺34.810</small>
                  </div>
                </div>
              </article>
            </section>

            <section className={`${styles.panel} ${styles.ordersPanel}`} id="orders">
              <div className={styles.panelHeader}>
                <div>
                  <h2>Son siparişler</h2>
                  <p>Son 5 işlem ve güncel durumları</p>
                </div>
                <a className={styles.viewAll} href="#orders">Tümünü gör <ArrowUpRight size={15} /></a>
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Sipariş</th>
                      <th>Müşteri</th>
                      <th>Ürün / hizmet</th>
                      <th>Tarih</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className={styles.orderId}>{order.id}</td>
                        <td>
                          <div className={styles.customerCell}>
                            <span className={styles.customerAvatar}>{order.initials}</span>
                            <strong>{order.customer}</strong>
                          </div>
                        </td>
                        <td className={styles.productCell}>{order.product}</td>
                        <td className={styles.dateCell}>{order.date}</td>
                        <td className={styles.amountCell}>{order.amount}</td>
                        <td><span className={`${styles.status} ${styles[order.tone]}`}><span />{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className={styles.pageFooter}>
              <span><PackageCheck size={15} /> Veriler son olarak bugün 15:42'de güncellendi.</span>
              <span className={styles.footerTrend}><ArrowDownRight size={14} /> İptal oranı %1,8</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
