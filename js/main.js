/* ============================================================
   AI·新质生产力引擎 — 完整交互脚本（含中英双语国际化）
   ============================================================ */
const CHAPTERS = ['industry', 'empower', 'efficiency', 'global', 'future'];
let chartsInitialized = {};
let radarChartInstance = null;
let currentLang = localStorage.getItem('lang') || 'zh';

/* ============================================================
   国际化翻译字典
   ============================================================ */
const I18N = {
    /* --- 页面级 --- */
    'page.title': { zh: '人工智能 · 新质生产力引擎', en: 'AI · New Quality Productive Forces Engine' },
    'backToTop.title': { zh: '回到顶部', en: 'Back to Top' },

    /* --- Logo --- */
    'logo.accent': { zh: '·新质生产力', en: '·New Quality Forces' },

    /* --- 导航 --- */
    'nav.home': { zh: '首页', en: 'Home' },
    'nav.industry': { zh: '产业规模', en: 'Industry Scale' },
    'nav.empower': { zh: '行业赋能', en: 'Industry Empowerment' },
    'nav.efficiency': { zh: '效率革命', en: 'Efficiency Revolution' },
    'nav.global': { zh: '全球格局', en: 'Global Landscape' },
    'nav.future': { zh: '未来展望', en: 'Future Outlook' },
    'nav.prev': { zh: '上一章', en: 'Previous' },
    'nav.next': { zh: '下一章', en: 'Next' },
    'nav.backHome': { zh: '返回目录', en: 'Back to Menu' },

    /* --- Hero --- */
    'hero.badge': { zh: 'NEW QUALITY PRODUCTIVE FORCES', en: 'NEW QUALITY PRODUCTIVE FORCES' },
    'hero.title1': { zh: '人工智能', en: 'Artificial Intelligence' },
    'hero.title2': { zh: '新质生产力引擎', en: 'New Quality Productive Forces Engine' },
    'hero.subtitle': { zh: '从技术突破到产业变革，AI正在重塑经济增长的底层逻辑。<br>以科技创新驱动高质量发展，构建未来竞争新优势。', en: 'From technological breakthroughs to industrial transformation, AI is reshaping the underlying logic of economic growth.<br>Driving high-quality development through scientific innovation, building new competitive advantages for the future.' },
    'hero.unit.trillion': { zh: '万亿', en: 'T' },
    'hero.stat1.label': { zh: '2025年核心产业规模', en: '2025 Core Industry Scale' },
    'hero.stat2.label': { zh: '年复合增长率', en: 'Annual CAGR' },
    'hero.stat3.label': { zh: '中国AI企业数量', en: 'Chinese AI Enterprises' },
    'hero.cta': { zh: '探索数据全景', en: 'Explore Data Panorama' },
    'hero.scroll': { zh: '向下滚动', en: 'Scroll Down' },

    /* --- 目录 --- */
    'dir.title': { zh: '数据全景导航', en: 'Data Panorama Navigation' },
    'dir.subtitle': { zh: '点击任意卡片，进入对应主题的深度数据可视化与分析', en: 'Click any card to enter in-depth data visualization and analysis' },
    'dir.enter': { zh: '进入探索', en: 'Explore' },
    'dir.card1.title': { zh: '中国AI产业规模', en: 'China AI Industry Scale' },
    'dir.card1.desc': { zh: '从千亿到万亿的爆发式增长，AI核心产业规模与GDP拉动的全维度数据解读。', en: 'Explosive growth from billions to trillions, full-dimensional data interpretation of AI core industry scale and GDP impact.' },
    'dir.card2.title': { zh: 'AI赋能千行百业', en: 'AI Empowering All Industries' },
    'dir.card2.desc': { zh: '智能制造、医疗健康、金融科技、能源电力——AI正在重塑每一个传统行业的价值链。', en: 'Smart manufacturing, healthcare, fintech, energy — AI is reshaping the value chain of every traditional industry.' },
    'dir.card3.title': { zh: 'AI驱动的效率革命', en: 'AI-Driven Efficiency Revolution' },
    'dir.card3.desc': { zh: '传统模式VS AI赋能模式的全面对比，用数据量化人工智能带来的生产力跃迁。', en: 'Comprehensive comparison of traditional vs AI-empowered models, quantifying productivity leaps with data.' },
    'dir.card4.title': { zh: '全球AI竞争格局', en: 'Global AI Competitive Landscape' },
    'dir.card4.desc': { zh: '中美欧三足鼎立，从市场规模、投资结构到人才储备的全球AI竞争力全景扫描。', en: 'US-China-EU tripod, panoramic scan of global AI competitiveness from market size to talent reserves.' },
    'dir.card5.title': { zh: '未来展望与里程碑', en: 'Future Outlook & Milestones' },
    'dir.card5.desc': { zh: '从2017到2030，AI新质生产力的发展历程与未来路线图，预见智能经济新时代。', en: 'From 2017 to 2030, the development journey and future roadmap of AI as new quality productive forces.' },

    /* --- 总结 --- */
    'summary.title': { zh: 'AI新质生产力核心数据总览', en: 'AI New Quality Forces Core Data Overview' },
    'summary.subtitle': { zh: '五大维度量化人工智能的战略价值', en: 'Quantifying AI\'s strategic value across five dimensions' },
    'summary.tip': { zh: '点击表格数据可直接跳转至详细分析', en: 'Click table data to jump to detailed analysis' },
    'summary.export': { zh: '导出总览数据 (CSV)', en: 'Export Overview Data (CSV)' },
    'summary.radar': { zh: '生成战略评估模型', en: 'Generate Strategic Assessment' },
    'summary.th.dimension': { zh: '评估维度', en: 'Dimension' },
    'summary.th.global': { zh: '全球地位', en: 'Global Position' },
    'summary.row1.dim': { zh: '核心指标', en: 'Core Metrics' },
    'summary.row1.industry': { zh: '（2025）', en: '(2025)' },
    'summary.row1.empower': { zh: '场景渗透率', en: 'Penetration Rate' },
    'summary.row1.efficiency': { zh: '效率提升', en: 'Efficiency Gain' },
    'summary.row1.global': { zh: '全球第二', en: 'Global 2nd' },
    'summary.row2.dim': { zh: '增速表现', en: 'Growth Rate' },
    'summary.row2.industry': { zh: '同比', en: 'YoY' },
    'summary.row2.empower': { zh: '覆盖6大行业', en: 'Covers 6 Industries' },
    'summary.row2.efficiency': { zh: '不良率↓', en: 'Defect Rate↓' },
    'summary.row2.global': { zh: '全球份额', en: 'Global Share' },
    'summary.row3.dim': { zh: '2030预期', en: '2030 Forecast' },
    'summary.row3.industry': { zh: '2万亿+', en: '2T+ RMB' },
    'summary.row3.empower': { zh: '95% 全域覆盖', en: '95% Full Coverage' },
    'summary.row3.efficiency': { zh: '全链路智能化', en: 'Full-Chain Intelligence' },
    'summary.row3.global': { zh: 'GDP拉动1.0pct', en: 'GDP Boost 1.0pct' },
    'summary.row4.dim': { zh: '战略评级', en: 'Strategic Rating' },
    'summary.conclusion.title': { zh: '核心结论', en: 'Core Conclusions' },
    'summary.conclusion.tip': { zh: '点击卡片查看深度解析', en: 'Click cards for in-depth analysis' },
    'summary.p1.title': { zh: '经济增长新引擎', en: 'New Engine of Economic Growth' },
    'summary.p1.desc': { zh: 'AI核心产业规模突破万亿，2030年对GDP拉动超1个百分点', en: 'AI core industry exceeds 1 trillion, GDP boost exceeds 1 percentage point by 2030' },
    'summary.p1.link': { zh: '查看产业数据', en: 'View Industry Data' },
    'summary.p2.title': { zh: '产业升级加速器', en: 'Industrial Upgrade Accelerator' },
    'summary.p2.desc': { zh: '深度渗透制造、医疗、金融、能源等核心行业，重塑价值链', en: 'Deep penetration into manufacturing, healthcare, finance, energy, reshaping value chains' },
    'summary.p2.link': { zh: '查看赋能案例', en: 'View Empowerment Cases' },
    'summary.p3.title': { zh: '效率革命催化剂', en: 'Efficiency Revolution Catalyst' },
    'summary.p3.desc': { zh: '生产周期缩短58%，质检准确率提升至99.5%，响应时间趋近于零', en: 'Production cycle reduced by 58%, QC accuracy up to 99.5%, response time near zero' },
    'summary.p3.link': { zh: '查看效率对比', en: 'View Efficiency Comparison' },
    'summary.p4.title': { zh: '国际竞争新高地', en: 'New Highland of Global Competition' },
    'summary.p4.desc': { zh: '中国AI综合实力全球第二，大模型数量与企业规模持续领跑', en: 'China ranks 2nd globally in AI strength, leading in model count and enterprise scale' },
    'summary.p4.link': { zh: '查看全球格局', en: 'View Global Landscape' },

    /* --- 弹窗 --- */
    'modal.title': { zh: 'AI新质生产力战略价值评估模型', en: 'AI New Quality Forces Strategic Value Assessment Model' },
    'modal.desc': { zh: '基于产业规模、行业赋能、效率提升、全球地位与未来潜力五个维度，综合计算AI作为新质生产力的战略价值指数。', en: 'Comprehensively calculating AI\'s strategic value index based on five dimensions: industry scale, empowerment, efficiency, global position, and future potential.' },
    'modal.stat1.label': { zh: '综合战略指数', en: 'Overall Strategic Index' },
    'modal.stat2.label': { zh: '最高维度', en: 'Top Dimension' },
    'modal.stat2.value': { zh: '产业规模 / 效率提升', en: 'Industry Scale / Efficiency' },
    'modal.stat3.label': { zh: '评估结论', en: 'Assessment Conclusion' },
    'modal.stat3.value': { zh: '核心战略引擎', en: 'Core Strategic Engine' },
    'modal.save': { zh: '保存评估图片', en: 'Save Assessment Image' },
    'modal.close': { zh: '关闭', en: 'Close' },

    /* --- Tab通用 --- */
    'tab.core': { zh: '核心数据', en: 'Core Data' },
    'tab.viz': { zh: '数据可视化与交互', en: 'Visualization & Interaction' },
    'tab.source': { zh: '数据来源', en: 'Data Sources' },

    /* --- Demo badges --- */
    'demo.badge1': { zh: '演示 1', en: 'Demo 1' },
    'demo.badge2': { zh: '演示 2', en: 'Demo 2' },
    'demo.badgeGreen': { zh: '演示', en: 'Demo' },
    'demo.badgeOrange': { zh: '演示', en: 'Demo' },
    'demo.badgePurple': { zh: '演示', en: 'Demo' },

    /* --- 通用来源 --- */
    'source.intro1': { zh: '本章节所有数据均来自国内外权威研究机构与政府主管部门公开发布的报告与统计公报，确保数据的准确性与时效性。以下为详细数据溯源信息。', en: 'All data in this chapter comes from authoritative domestic and international research institutions and government departments, ensuring accuracy and timeliness. Below is detailed data tracing information.' },
    'source.intro2': { zh: '行业赋能数据综合自多个行业主管部门与研究机构的专项报告，覆盖制造、医疗、金融、交通、能源、教育六大核心领域。', en: 'Industry empowerment data is compiled from special reports by multiple industry authorities and research institutions, covering six core fields: manufacturing, healthcare, finance, transportation, energy, and education.' },
    'source.intro3': { zh: '效率对比数据来自多家咨询机构的实地调研与案例研究，以及头部企业的公开运营数据披露，具有广泛的行业代表性。', en: 'Efficiency comparison data comes from field research and case studies by multiple consulting firms, as well as public operational data from leading enterprises, with broad industry representativeness.' },
    'source.intro4': { zh: '全球格局数据整合自国际顶级研究机构、行业协会与各国政府的公开统计数据，力求客观呈现全球AI竞争态势。', en: 'Global landscape data is integrated from top international research institutions, industry associations, and government statistics, aiming to objectively present the global AI competitive situation.' },
    'source.intro5': { zh: '发展历程与未来展望数据综合自国家政策文件、学术研究机构的预测报告以及行业智库的趋势分析，兼具历史准确性与前瞻性。', en: 'Development history and future outlook data is compiled from national policy documents, academic research forecasts, and industry think tank analyses, combining historical accuracy with forward-looking insights.' },
    'source.table.title': { zh: '关键数据引用明细', en: 'Key Data Citation Details' },
    'source.th.indicator': { zh: '数据指标', en: 'Indicator' },
    'source.th.value': { zh: '数值', en: 'Value' },
    'source.th.source': { zh: '数据来源', en: 'Source' },
    'source.th.time': { zh: '发布时间', en: 'Published' },
    'source.note1': { zh: '注：标注"(E)"的数据为基于现有趋势的预测值，实际数据可能因市场环境变化而有所调整。所有数据截至2025年第一季度。', en: 'Note: Data marked "(E)" are projections based on current trends. Actual figures may vary due to market changes. All data as of Q1 2025.' },
    'source.note2': { zh: '注：行业数据因统计口径差异可能存在出入，本展示采用各权威来源的最新公开数据。所有数据截至2025年第一季度。', en: 'Note: Industry data may vary due to differences in statistical methods. This presentation uses the latest public data from authoritative sources. All data as of Q1 2025.' },
    'source.note3': { zh: '注：效率提升数据为行业平均水平，具体效果因企业规模、行业特性与AI部署深度而异。所有数据截至2025年第一季度。', en: 'Note: Efficiency improvement data represents industry averages. Specific results vary by enterprise size, industry characteristics, and AI deployment depth. All data as of Q1 2025.' },
    'source.note4': { zh: '注：全球市场数据因汇率波动与统计方法差异可能存在偏差。预测值基于当前增长趋势外推。所有数据截至2025年第一季度。', en: 'Note: Global market data may deviate due to exchange rate fluctuations and statistical method differences. Projections are extrapolated from current growth trends. All data as of Q1 2025.' },
    'source.note5': { zh: '注：未来展望部分包含基于当前趋势的预测与学术界的共识判断，实际发展路径可能受技术突破、政策调整等因素影响。所有数据截至2025年第一季度。', en: 'Note: The future outlook section contains projections based on current trends and academic consensus. Actual development paths may be affected by technological breakthroughs and policy adjustments. All data as of Q1 2025.' },

    /* ========== 视图1：产业规模 ========== */
    's1.title': { zh: '中国AI产业规模', en: 'China AI Industry Scale' },
    's1.subtitle': { zh: '从千亿到万亿的爆发式增长，数据驱动的宏观全景', en: 'Explosive growth from billions to trillions, data-driven macro panorama' },
    's1.core.title': { zh: '核心数据解读', en: 'Core Data Interpretation' },
    's1.k1.title': { zh: '产业规模爆发', en: 'Industry Scale Explosion' },
    's1.k1.desc': { zh: '2025年中国AI核心产业规模突破<strong>1.2万亿元</strong>，同比增长<strong>24%</strong>。从2019年的1200亿元到2025年的12000亿元，6年增长<strong>10倍</strong>，展现了新质生产力的指数级增长特征。', en: 'China\'s AI core industry scale exceeded <strong>¥1.2 trillion</strong> in 2025, with <strong>24%</strong> YoY growth. From ¥120 billion in 2019 to ¥1.2 trillion in 2025, a <strong>10x</strong> increase in 6 years, demonstrating exponential growth characteristics of new quality productive forces.' },
    's1.k2.title': { zh: 'GDP拉动效应', en: 'GDP Driving Effect' },
    's1.k2.desc': { zh: 'AI对GDP的拉动效应逐年递增。2025年贡献<strong>0.35个百分点</strong>，预计2030年将达到<strong>1.0个百分点</strong>，成为经济增长的核心驱动力。这意味着AI每年为中国GDP额外创造超<strong>1300亿元</strong>的增量。', en: 'AI\'s GDP driving effect increases year by year. Contributing <strong>0.35 percentage points</strong> in 2025, expected to reach <strong>1.0 percentage point</strong> by 2030, becoming a core driver of economic growth. This means AI creates over <strong>¥130 billion</strong> in additional GDP annually.' },
    's1.k3.title': { zh: '企业生态繁荣', en: 'Thriving Enterprise Ecosystem' },
    's1.k3.desc': { zh: '中国AI企业数量超过<strong>6000家</strong>，占全球AI企业总数的<strong>15%</strong>。其中上市公司超<strong>300家</strong>，独角兽企业超<strong>100家</strong>，形成了从基础研究到应用落地的完整产业链。', en: 'China has over <strong>6,000</strong> AI enterprises, accounting for <strong>15%</strong> of global AI companies. Including 300+ listed companies and 100+ unicorns, forming a complete industry chain from basic research to application deployment.' },
    's1.k4.title': { zh: '算力基础设施', en: 'Computing Infrastructure' },
    's1.k4.desc': { zh: '全国智能算力规模达到<strong>782 EFLOPS</strong>（每秒百亿亿次浮点运算），建成<strong>9000+</strong>座先进级智能工厂，AI芯片国产化率提升至<strong>25%</strong>，算力底座日趋完善。', en: 'National intelligent computing capacity reached <strong>782 EFLOPS</strong>, with <strong>9,000+</strong> advanced smart factories built. AI chip localization rate increased to <strong>25%</strong>, with computing infrastructure becoming increasingly mature.' },
    's1.k5.title': { zh: '大模型井喷', en: 'Large Model Boom' },
    's1.k5.desc': { zh: '中国已发布大模型数量超过<strong>1300个</strong>，涵盖语言、视觉、多模态等方向。2024年新增注册大模型<strong>500+</strong>，形成了"百模大战"的繁荣生态，为产业应用提供了丰富的技术供给。', en: 'China has released over <strong>1,300</strong> large models, covering language, vision, and multimodal directions. 500+ new models registered in 2024, forming a thriving "Battle of a Hundred Models" ecosystem providing rich technical supply for industrial applications.' },
    's1.k6.title': { zh: '人才储备', en: 'Talent Reserve' },
    's1.k6.desc': { zh: '中国AI相关从业人员超过<strong>120万人</strong>，高校AI专业招生规模年增<strong>30%</strong>。但高端人才缺口仍达<strong>50万</strong>，顶尖科学家供不应求，人才培养体系正在加速完善。', en: 'China has over <strong>1.2 million</strong> AI-related professionals, with university AI enrollment growing <strong>30%</strong> annually. However, the high-end talent gap remains at <strong>500,000</strong>, with top scientists in high demand and talent development systems accelerating.' },
    's1.viz.title': { zh: '中国AI产业增长全景可视化', en: 'China AI Industry Growth Panorama Visualization' },
    's1.viz.subtitle': { zh: '多维度图表展现AI核心产业规模、GDP拉动效应与投资结构的演变趋势', en: 'Multi-dimensional charts showing AI core industry scale, GDP impact, and investment structure trends' },
    's1.chart1.title': { zh: '中国AI核心产业规模（亿元）', en: 'China AI Core Industry Scale (100M RMB)' },
    's1.chart2.title': { zh: 'AI对GDP增速的拉动（百分点）', en: 'AI GDP Growth Contribution (pct)' },
    's1.chart3.title': { zh: 'AI产业投资结构（2025年）', en: 'AI Industry Investment Structure (2025)' },
    's1.chart4.title': { zh: '大模型数量增长趋势', en: 'Large Model Growth Trend' },
    's1.demo.title': { zh: '交互式数据探索', en: 'Interactive Data Exploration' },
    's1.demo1.title': { zh: '产业规模增长模拟器', en: 'Industry Scale Growth Simulator' },
    's1.demo1.label': { zh: '选择年份：', en: 'Select Year:' },
    's1.demo2.title': { zh: 'AI企业数量与企业类型分布', en: 'AI Enterprise Count & Type Distribution' },
    's1.demo2.label': { zh: '企业类型：', en: 'Enterprise Type:' },
    's1.demo2.all': { zh: '全部', en: 'All' },
    's1.demo2.listed': { zh: '上市公司', en: 'Listed' },
    's1.demo2.unicorn': { zh: '独角兽', en: 'Unicorns' },
    's1.demo2.startup': { zh: '初创企业', en: 'Startups' },
    's1.src1.name': { zh: '中国信息通信研究院', en: 'CAICT' },
    's1.src1.item1': { zh: '《人工智能白皮书（2025年）》', en: 'AI White Paper (2025)' },
    's1.src1.item2': { zh: '《全球人工智能战略与政策观察》', en: 'Global AI Strategy & Policy Observer' },
    's1.src1.item3': { zh: 'AI核心产业规模、算力基础设施数据', en: 'AI core industry scale, computing infrastructure data' },
    's1.src2.name': { zh: '工业和信息化部', en: 'MIIT' },
    's1.src2.item1': { zh: '《智能制造发展年度报告》', en: 'Smart Manufacturing Annual Report' },
    's1.src2.item2': { zh: '"人工智能+"行动计划', en: '"AI+" Action Plan' },
    's1.src2.item3': { zh: '智能工厂数量、企业统计数据', en: 'Smart factory count, enterprise statistics' },
    's1.src3.name': { zh: '中央财经大学', en: 'CUFE' },
    's1.src3.item1': { zh: '《AI对GDP拉动效应测算报告》', en: 'AI GDP Impact Assessment Report' },
    's1.src3.item2': { zh: '人工智能与宏观经济研究', en: 'AI and Macroeconomic Research' },
    's1.src3.item3': { zh: 'GDP拉动效应预测数据', en: 'GDP impact projection data' },
    's1.src4.item1': { zh: '全球AI市场规模追踪报告', en: 'Global AI Market Size Tracking Report' },
    's1.src4.item2': { zh: 'AI芯片市场份额分析', en: 'AI Chip Market Share Analysis' },
    's1.src4.item3': { zh: '智能算力、芯片国产化数据', en: 'Smart computing, chip localization data' },
    's1.st1.ind': { zh: 'AI核心产业规模（2025）', en: 'AI Core Industry Scale (2025)' },
    's1.st1.val': { zh: '1.2万亿元', en: '¥1.2 Trillion' },
    's1.st1.src': { zh: '中国信通院', en: 'CAICT' },
    's1.st2.ind': { zh: 'AI核心产业同比增速', en: 'AI Core Industry YoY Growth' },
    's1.st2.src': { zh: '中国信通院', en: 'CAICT' },
    's1.st3.ind': { zh: 'GDP拉动效应（2025）', en: 'GDP Impact (2025)' },
    's1.st3.src': { zh: '中央财经大学', en: 'CUFE' },
    's1.st4.ind': { zh: 'GDP拉动效应（2030E）', en: 'GDP Impact (2030E)' },
    's1.st4.src': { zh: '中央财经大学', en: 'CUFE' },
    's1.st5.ind': { zh: 'AI企业总数', en: 'Total AI Enterprises' },
    's1.st5.val': { zh: '6,000+家', en: '6,000+' },
    's1.st5.src': { zh: '工信部/天眼查', en: 'MIIT/Tianyancha' },
    's1.st6.ind': { zh: '智能算力规模', en: 'Smart Computing Scale' },
    's1.st6.src': { zh: '中国信通院/IDC', en: 'CAICT/IDC' },
    's1.st7.ind': { zh: '大模型数量', en: 'Large Model Count' },
    's1.st7.val': { zh: '1,300+个', en: '1,300+' },
    's1.st7.src': { zh: '中国信通院', en: 'CAICT' },
    's1.st8.ind': { zh: 'AI从业人员', en: 'AI Professionals' },
    's1.st8.val': { zh: '120万+人', en: '1.2M+' },
    's1.st8.src': { zh: '工信部', en: 'MIIT' },
    's1.st9.ind': { zh: '先进级智能工厂', en: 'Advanced Smart Factories' },
    's1.st9.val': { zh: '9,000+座', en: '9,000+' },
    's1.st9.src': { zh: '工信部', en: 'MIIT' },
    's1.st10.ind': { zh: 'AI芯片国产化率', en: 'AI Chip Localization Rate' },

    /* ========== 视图2：行业赋能 ========== */
    's2.title': { zh: 'AI赋能千行百业', en: 'AI Empowering All Industries' },
    's2.subtitle': { zh: '深度渗透六大核心行业，重塑产业价值链', en: 'Deep penetration into six core industries, reshaping value chains' },
    's2.core.title': { zh: '行业赋能数据解读', en: 'Industry Empowerment Data Interpretation' },
    's2.k1.title': { zh: '智能制造', en: 'Smart Manufacturing' },
    's2.k1.desc': { zh: 'AI渗透<strong>70%+</strong>制造业业务场景，智能工厂平均生产效率提升<strong>29%</strong>，产品不良率降低<strong>47%</strong>。已建成<strong>9000+</strong>座先进级智能工厂，覆盖汽车、电子、钢铁等核心行业。', en: 'AI penetrates <strong>70%+</strong> of manufacturing scenarios, smart factories improve efficiency by <strong>29%</strong>, defect rate reduced by <strong>47%</strong>. <strong>9,000+</strong> advanced smart factories built, covering automotive, electronics, steel and other core industries.' },
    's2.k2.title': { zh: '医疗健康', en: 'Healthcare' },
    's2.k2.desc': { zh: 'AI辅助诊断准确率达<strong>95%+</strong>，药物研发周期缩短<strong>40%</strong>。医疗影像AI已覆盖<strong>80%</strong>的三甲医院，年均处理影像数据超<strong>10亿</strong>例，极大提升了医疗资源的可及性。', en: 'AI-assisted diagnosis accuracy reaches <strong>95%+</strong>, drug R&D cycle shortened by <strong>40%</strong>. Medical imaging AI covers <strong>80%</strong> of top hospitals, processing over <strong>1 billion</strong> imaging cases annually, greatly improving healthcare accessibility.' },
    's2.k3.title': { zh: '金融科技', en: 'FinTech' },
    's2.k3.desc': { zh: 'AI风控模型将欺诈识别准确率提升至<strong>99.2%</strong>，智能客服处理<strong>85%</strong>的客户咨询，量化交易策略年化收益率提升<strong>15-25%</strong>。金融是AI渗透率最高的服务业。', en: 'AI risk models improve fraud detection to <strong>99.2%</strong>, smart chatbots handle <strong>85%</strong> of inquiries, quantitative trading strategies boost annualized returns by <strong>15-25%</strong>. Finance has the highest AI penetration among service industries.' },
    's2.k4.title': { zh: '智能交通', en: 'Smart Transportation' },
    's2.k4.desc': { zh: 'L4级自动驾驶路测里程突破<strong>1亿公里</strong>，智能交通系统使城市拥堵率降低<strong>20%</strong>。车路协同技术覆盖<strong>30+</strong>个城市，自动驾驶出租车已在<strong>10+</strong>城市商业运营。', en: 'L4 autonomous driving test mileage exceeds <strong>100 million km</strong>, smart transportation systems reduce urban congestion by <strong>20%</strong>. V2X technology covers <strong>30+</strong> cities, robotaxis operating commercially in <strong>10+</strong> cities.' },
    's2.k5.title': { zh: '能源电力', en: 'Energy & Power' },
    's2.k5.desc': { zh: 'AI优化电网调度效率提升<strong>35%</strong>，新能源发电预测准确率达<strong>92%</strong>。智能巡检机器人覆盖<strong>60%</strong>的高压输电线路，年均减少碳排放超<strong>5000万吨</strong>。', en: 'AI optimizes grid dispatch efficiency by <strong>35%</strong>, renewable energy forecasting accuracy reaches <strong>92%</strong>. Smart inspection robots cover <strong>60%</strong> of high-voltage lines, reducing carbon emissions by over <strong>50 million tons</strong> annually.' },
    's2.k6.title': { zh: '智慧教育', en: 'Smart Education' },
    's2.k6.desc': { zh: 'AI个性化学习系统覆盖<strong>5万+</strong>所学校，学生成绩平均提升<strong>18%</strong>。智能评测系统处理<strong>3亿+</strong>份试卷/年，AI教师助手在偏远地区弥补了<strong>40%</strong>的师资缺口。', en: 'AI personalized learning systems cover <strong>50,000+</strong> schools, improving student performance by <strong>18%</strong> on average. Smart assessment systems process <strong>300M+</strong> exams/year, AI teaching assistants bridge <strong>40%</strong> of teacher gaps in remote areas.' },
    's2.viz.title': { zh: '行业赋能能力全景可视化', en: 'Industry Empowerment Panorama Visualization' },
    's2.viz.subtitle': { zh: '雷达图与分布图展现AI在各行业的渗透深度与赋能效果', en: 'Radar and distribution charts showing AI penetration depth and empowerment effects across industries' },
    's2.chart1.title': { zh: 'AI行业赋能能力雷达图', en: 'AI Industry Empowerment Radar Chart' },
    's2.chart2.title': { zh: '大模型行业应用分布', en: 'Large Model Industry Application Distribution' },
    's2.mini1': { zh: '场景渗透率', en: 'Penetration Rate' },
    's2.mini2': { zh: '诊断准确率', en: 'Diagnosis Accuracy' },
    's2.mini3': { zh: '风控准确率', en: 'Risk Control Accuracy' },
    's2.mini4': { zh: '路测里程', en: 'Test Mileage' },
    's2.mini5': { zh: '发电预测', en: 'Power Forecast' },
    's2.mini6': { zh: '覆盖学校', en: 'Schools Covered' },
    's2.demo.title': { zh: '交互式行业对比', en: 'Interactive Industry Comparison' },
    's2.demo1.title': { zh: '行业AI赋能效果对比', en: 'Industry AI Empowerment Comparison' },
    's2.demo1.label': { zh: '对比维度：', en: 'Dimension:' },
    's2.dim.penetration': { zh: '渗透率', en: 'Penetration' },
    's2.dim.efficiency': { zh: '效率提升', en: 'Efficiency' },
    's2.dim.investment': { zh: '投资规模', en: 'Investment' },
    's2.src1.name': { zh: '工信部', en: 'MIIT' },
    's2.src1.en': { zh: '智能制造发展报告', en: 'Smart Manufacturing Report' },
    's2.src1.item1': { zh: '场景渗透率、效率提升数据', en: 'Penetration rate, efficiency data' },
    's2.src1.item2': { zh: '智能工厂建设统计', en: 'Smart factory construction statistics' },
    's2.src2.name': { zh: '国家卫健委 / 动脉网', en: 'NHC / VBdata' },
    's2.src2.en': { zh: '医疗AI专项调研', en: 'Healthcare AI Survey' },
    's2.src2.item1': { zh: '辅助诊断准确率', en: 'Diagnostic accuracy' },
    's2.src2.item2': { zh: '三甲医院AI覆盖率', en: 'Top hospital AI coverage' },
    's2.src3.name': { zh: '中国金融科技发展报告', en: 'China FinTech Report' },
    's2.src3.en': { zh: '央行科技司', en: 'PBOC Tech Dept' },
    's2.src3.item1': { zh: '风控准确率、智能客服占比', en: 'Risk accuracy, chatbot ratio' },
    's2.src3.item2': { zh: '量化交易收益数据', en: 'Quantitative trading returns' },
    's2.src4.name': { zh: '交通运输部 / 百度Apollo', en: 'MOT / Baidu Apollo' },
    's2.src4.en': { zh: '智能交通白皮书', en: 'Smart Transport White Paper' },
    's2.src4.item1': { zh: 'L4路测里程、拥堵降低率', en: 'L4 test mileage, congestion reduction' },
    's2.src4.item2': { zh: '车路协同城市覆盖数据', en: 'V2X city coverage data' },
    's2.st1.ind': { zh: '制造业AI场景渗透率', en: 'Manufacturing AI Penetration' },
    's2.st1.src': { zh: '工信部', en: 'MIIT' },
    's2.st2.ind': { zh: '智能工厂效率提升', en: 'Smart Factory Efficiency Gain' },
    's2.st2.src': { zh: '工信部', en: 'MIIT' },
    's2.st3.ind': { zh: '产品不良率降低', en: 'Product Defect Rate Reduction' },
    's2.st3.src': { zh: '工信部', en: 'MIIT' },
    's2.st4.ind': { zh: 'AI辅助诊断准确率', en: 'AI Diagnostic Accuracy' },
    's2.st4.src': { zh: '国家卫健委', en: 'NHC' },
    's2.st5.ind': { zh: '药物研发周期缩短', en: 'Drug R&D Cycle Reduction' },
    's2.st5.src': { zh: '动脉网', en: 'VBdata' },
    's2.st6.ind': { zh: '金融风控准确率', en: 'Financial Risk Accuracy' },
    's2.st6.src': { zh: '金融科技报告', en: 'FinTech Report' },
    's2.st7.ind': { zh: 'L4自动驾驶路测里程', en: 'L4 Autonomous Driving Test Mileage' },
    's2.st7.val': { zh: '1亿+公里', en: '100M+ km' },
    's2.st7.src': { zh: '交通运输部', en: 'MOT' },
    's2.st8.ind': { zh: '新能源发电预测准确率', en: 'Renewable Energy Forecast Accuracy' },
    's2.st8.src': { zh: '国家能源局', en: 'NEA' },
    's2.st9.ind': { zh: 'AI教育覆盖学校数', en: 'AI Education School Coverage' },
    's2.st9.val': { zh: '5万+所', en: '50,000+' },
    's2.st9.src': { zh: '教育部', en: 'MOE' },
    's2.st10.ind': { zh: '大模型行业应用分布', en: 'Large Model Industry Distribution' },
    's2.st10.val': { zh: '详见图表', en: 'See Charts' },
    's2.st10.src': { zh: '中国信通院', en: 'CAICT' },

    /* ========== 视图3：效率革命 ========== */
    's3.title': { zh: 'AI驱动的效率革命', en: 'AI-Driven Efficiency Revolution' },
    's3.subtitle': { zh: '传统模式VS AI赋能模式——用数据量化生产力跃迁', en: 'Traditional vs AI-Empowered — Quantifying productivity leaps with data' },
    's3.core.title': { zh: '效率革命数据解读', en: 'Efficiency Revolution Data Interpretation' },
    's3.k1.title': { zh: '产品研发周期', en: 'Product R&D Cycle' },
    's3.k1.desc': { zh: '传统模式下产品研发平均需要<strong>12个月</strong>，AI赋能后缩短至<strong>5个月</strong>，降幅达<strong>58%</strong>。AI辅助设计、仿真测试、代码生成大幅加速了从概念到产品的全流程。', en: 'Traditional product R&D takes an average of <strong>12 months</strong>, reduced to <strong>5 months</strong> with AI, a <strong>58%</strong> reduction. AI-assisted design, simulation testing, and code generation greatly accelerate the concept-to-product process.' },
    's3.k2.title': { zh: '质量检测准确率', en: 'Quality Inspection Accuracy' },
    's3.k2.desc': { zh: '人工质检准确率约<strong>92%</strong>，AI视觉质检提升至<strong>99.5%</strong>。每秒可处理<strong>200+</strong>张产品图片，实现7×24小时无间断检测，每年为企业节省数百万人工成本。', en: 'Manual inspection accuracy is about <strong>92%</strong>, AI visual inspection reaches <strong>99.5%</strong>. Processing <strong>200+</strong> images per second, enabling 24/7 uninterrupted inspection, saving millions in labor costs annually.' },
    's3.k3.title': { zh: '客户服务响应', en: 'Customer Service Response' },
    's3.k3.desc': { zh: '传统客服平均响应<strong>4小时</strong>，AI智能客服实现<strong>即时响应</strong>（<1秒），处理效率提升<strong>99%</strong>。同时客户满意度反而提升<strong>12%</strong>，因为AI可以提供24小时一致的服务质量。', en: 'Traditional CS averages <strong>4 hours</strong> response, AI achieves <strong>instant response</strong> (<1s), improving efficiency by <strong>99%</strong>. Customer satisfaction also increases by <strong>12%</strong> due to consistent 24/7 service quality.' },
    's3.k4.title': { zh: '能源消耗效率', en: 'Energy Consumption Efficiency' },
    's3.k4.desc': { zh: '传统工厂能源利用率约<strong>65%</strong>，AI优化后提升至<strong>92%</strong>，效率提升<strong>42%</strong>。智能能源管理系统实时调控设备运行参数，年均减少碳排放<strong>30%</strong>以上。', en: 'Traditional factory energy utilization is about <strong>65%</strong>, improved to <strong>92%</strong> with AI, a <strong>42%</strong> increase. Smart energy management systems adjust equipment parameters in real-time, reducing carbon emissions by over <strong>30%</strong> annually.' },
    's3.k5.title': { zh: '供应链预测', en: 'Supply Chain Forecasting' },
    's3.k5.desc': { zh: '传统供应链预测精度约<strong>60%</strong>，AI预测提升至<strong>95%</strong>，库存周转率提升<strong>35%</strong>，缺货率降低<strong>65%</strong>。这直接转化为数百亿级别的资金效率提升。', en: 'Traditional supply chain forecast accuracy is about <strong>60%</strong>, AI improves to <strong>95%</strong>, inventory turnover up <strong>35%</strong>, stockout rate down <strong>65%</strong>. This directly translates to hundreds of billions in capital efficiency gains.' },
    's3.k6.title': { zh: '文档处理效率', en: 'Document Processing Efficiency' },
    's3.k6.desc': { zh: '传统人工处理合同/文档平均<strong>2小时/份</strong>，AI文档处理仅需<strong>30秒/份</strong>，效率提升<strong>240倍</strong>。法律AI可在<strong>26秒</strong>内完成人类需要<strong>92小时</strong>的合同审查工作。', en: 'Traditional manual contract/document processing averages <strong>2 hours/doc</strong>, AI needs only <strong>30 seconds/doc</strong>, a <strong>240x</strong> improvement. Legal AI can complete in <strong>26 seconds</strong> what takes humans <strong>92 hours</strong> of contract review.' },
    's3.viz.title': { zh: '传统模式 VS AI赋能模式', en: 'Traditional Mode VS AI-Empowered Mode' },
    's3.viz.subtitle': { zh: '五大核心效率指标的对比可视化', en: 'Comparison visualization of five core efficiency metrics' },
    's3.comp.traditional': { zh: '传统模式', en: 'Traditional' },
    's3.comp.ai': { zh: 'AI赋能模式', en: 'AI-Empowered' },
    's3.comp1.name': { zh: '产品研发周期', en: 'R&D Cycle' },
    's3.comp1.trad': { zh: '12个月', en: '12 months' },
    's3.comp1.ai': { zh: '5个月', en: '5 months' },
    's3.comp2.name': { zh: '质检准确率', en: 'QC Accuracy' },
    's3.comp3.name': { zh: '客服响应', en: 'CS Response' },
    's3.comp3.trad': { zh: '4小时', en: '4 hours' },
    's3.comp3.ai': { zh: '即时', en: 'Instant' },
    's3.comp4.name': { zh: '能源利用率', en: 'Energy Utilization' },
    's3.comp5.name': { zh: '供应链预测', en: 'Supply Chain Forecast' },
    's3.chart1.title': { zh: '生成式AI市场规模（亿美元）', en: 'Generative AI Market Size (100M USD)' },
    's3.chart2.title': { zh: 'AI效率提升综合指数', en: 'AI Efficiency Improvement Index' },
    's3.demo.title': { zh: '效率提升计算器', en: 'Efficiency Improvement Calculator' },
    's3.demo1.title': { zh: 'AI效率提升模拟计算器', en: 'AI Efficiency Simulation Calculator' },
    's3.demo1.label': { zh: '年处理量（万件）：', en: 'Annual Volume (10K units):' },
    's3.demo1.unit': { zh: '100万件', en: '1M units' },
    's3.calc.trad': { zh: '传统模式耗时', en: 'Traditional Time' },
    's3.calc.ai': { zh: 'AI赋能耗时', en: 'AI-Empowered Time' },
    's3.calc.boost': { zh: '效率提升', en: 'Efficiency Gain' },
    's3.calc.times': { zh: '24倍', en: '24x' },
    's3.src1.en': { zh: '生成式AI市场追踪', en: 'GenAI Market Tracking' },
    's3.src1.item1': { zh: '生成式AI市场规模预测', en: 'GenAI market size forecast' },
    's3.src1.item2': { zh: '全球AI投资趋势分析', en: 'Global AI investment trend analysis' },
    's3.src2.en': { zh: 'AI生产力研究报告', en: 'AI Productivity Research Report' },
    's3.src2.item1': { zh: '研发周期、质检效率对比', en: 'R&D cycle, QC efficiency comparison' },
    's3.src2.item2': { zh: 'AI对劳动生产率的影响', en: 'AI impact on labor productivity' },
    's3.src3.name': { zh: '世界经济论坛 (WEF)', en: 'World Economic Forum (WEF)' },
    's3.src3.en': { zh: '未来就业报告', en: 'Future of Jobs Report' },
    's3.src3.item1': { zh: '供应链预测精度数据', en: 'Supply chain forecast accuracy data' },
    's3.src3.item2': { zh: '能源效率优化案例', en: 'Energy efficiency optimization cases' },
    's3.src4.item1': { zh: '文档处理效率基准测试', en: 'Document processing efficiency benchmarks' },
    's3.src4.item2': { zh: '法律AI性能评估数据', en: 'Legal AI performance evaluation data' },
    's3.st1.ind': { zh: '产品研发周期缩短', en: 'R&D Cycle Reduction' },
    's3.st2.ind': { zh: 'AI质检准确率', en: 'AI QC Accuracy' },
    's3.st2.src': { zh: '工信部/企业披露', en: 'MIIT/Corporate Disclosure' },
    's3.st3.ind': { zh: '客服响应效率提升', en: 'CS Response Efficiency Gain' },
    's3.st4.ind': { zh: '能源利用率提升', en: 'Energy Utilization Improvement' },
    's3.st5.ind': { zh: '供应链预测精度', en: 'Supply Chain Forecast Accuracy' },
    's3.st6.ind': { zh: '文档处理效率倍数', en: 'Document Processing Multiplier' },
    's3.st7.ind': { zh: '生成式AI市场（2025）', en: 'GenAI Market (2025)' },
    's3.st7.val': { zh: '146亿美元', en: '$14.6B' },
    's3.st8.ind': { zh: '生成式AI市场（2028E）', en: 'GenAI Market (2028E)' },
    's3.st8.val': { zh: '560亿美元', en: '$56B' },

    /* ========== 视图4：全球格局 ========== */
    's4.title': { zh: '全球AI竞争格局', en: 'Global AI Competitive Landscape' },
    's4.subtitle': { zh: '中美欧三足鼎立，全球AI市场规模预计2035年达6.56万亿美元', en: 'US-China-EU tripod, global AI market projected to reach $6.56 trillion by 2035' },
    's4.core.title': { zh: '全球AI格局数据解读', en: 'Global AI Landscape Data Interpretation' },
    's4.k1.title': { zh: '全球市场规模', en: 'Global Market Size' },
    's4.k1.desc': { zh: '2024年全球AI市场规模达<strong>2792亿美元</strong>，预计2030年突破<strong>1.2万亿美元</strong>，2035年将达到<strong>6.56万亿美元</strong>。年复合增长率超过<strong>35%</strong>，是全球增长最快的技术领域。', en: 'Global AI market reached <strong>$279.2B</strong> in 2024, projected to exceed <strong>$1.2T</strong> by 2030 and <strong>$6.56T</strong> by 2035. CAGR exceeds <strong>35%</strong>, the fastest-growing technology sector globally.' },
    's4.k2.title': { zh: '北美领先地位', en: 'North American Leadership' },
    's4.k2.desc': { zh: '北美占全球AI市场<strong>55%</strong>的份额，拥有全球<strong>60%</strong>的AI独角兽企业。美国AI企业研发投入年均<strong>450亿美元</strong>，OpenAI、Google、Meta引领技术前沿。', en: 'North America holds <strong>55%</strong> of the global AI market with <strong>60%</strong> of AI unicorns. US AI R&D investment averages <strong>$45B</strong> annually, with OpenAI, Google, Meta leading the frontier.' },
    's4.k3.title': { zh: '中国快速追赶', en: 'China\'s Rapid Catch-Up' },
    's4.k3.desc': { zh: '中国AI市场占全球<strong>18%</strong>，AI论文发表量全球<strong>第一</strong>，专利申请量全球<strong>第一</strong>。在计算机视觉、自然语言处理等应用领域已形成独特竞争优势。', en: 'China holds <strong>18%</strong> of the global AI market, ranking <strong>1st</strong> in AI publications and patent applications globally. Unique competitive advantages in computer vision, NLP, and other application fields.' },
    's4.k4.title': { zh: '欧洲监管创新', en: 'European Regulatory Innovation' },
    's4.k4.desc': { zh: '欧洲AI市场占全球<strong>20%</strong>，以<strong>AI监管立法</strong>为特色，全球首部《人工智能法案》已生效。在工业AI、医疗AI等垂直领域具有深厚积累。', en: 'Europe holds <strong>20%</strong> of the global AI market, characterized by <strong>AI regulatory legislation</strong>, with the world\'s first AI Act now in effect. Deep expertise in industrial AI, medical AI, and other verticals.' },
    's4.k5.title': { zh: '全球AI人才', en: 'Global AI Talent' },
    's4.k5.desc': { zh: '全球AI从业者约<strong>200万人</strong>，其中美国<strong>85万</strong>，中国<strong>60万</strong>，欧洲<strong>35万</strong>。全球AI人才缺口超<strong>400万</strong>，顶尖人才竞争日趋白热化。', en: 'About <strong>2 million</strong> global AI professionals: US <strong>850K</strong>, China <strong>600K</strong>, Europe <strong>350K</strong>. Global AI talent gap exceeds <strong>4 million</strong>, with intense competition for top talent.' },
    's4.k6.title': { zh: 'AI芯片格局', en: 'AI Chip Landscape' },
    's4.k6.desc': { zh: 'NVIDIA占据全球AI训练芯片<strong>90%+</strong>市场份额。中国在AI推理芯片领域加速追赶，华为昇腾、寒武纪等国产芯片在特定场景已实现<strong>对标国际</strong>水平。', en: 'NVIDIA holds <strong>90%+</strong> of the global AI training chip market. China is accelerating in AI inference chips, with Huawei Ascend, Cambricon achieving <strong>international-level</strong> performance in specific scenarios.' },
    's4.viz.title': { zh: '全球AI市场格局可视化', en: 'Global AI Market Landscape Visualization' },
    's4.viz.subtitle': { zh: '市场规模预测、区域份额与竞争力对比', en: 'Market size forecast, regional share, and competitiveness comparison' },
    's4.chart1.title': { zh: '全球AI市场规模预测（亿美元）', en: 'Global AI Market Forecast (100M USD)' },
    's4.chart2.title': { zh: '区域市场份额', en: 'Regional Market Share' },
    's4.chart3.title': { zh: '中美AI综合实力对比', en: 'US-China AI Comprehensive Strength' },
    's4.chart4.title': { zh: '全球AI人才分布', en: 'Global AI Talent Distribution' },
    's4.demo.title': { zh: '全球AI竞争力对比', en: 'Global AI Competitiveness Comparison' },
    's4.demo1.title': { zh: '中美欧AI多维度对比雷达', en: 'US-China-EU Multi-Dimensional Radar' },
    's4.src1.en': { zh: '全球AI市场追踪', en: 'Global AI Market Tracking' },
    's4.src1.item1': { zh: '全球AI市场规模与预测', en: 'Global AI market size & forecast' },
    's4.src1.item2': { zh: 'CAGR增长率测算', en: 'CAGR calculation' },
    's4.src2.en': { zh: '全球AI支出指南', en: 'Global AI Spending Guide' },
    's4.src2.item1': { zh: '区域市场份额数据', en: 'Regional market share data' },
    's4.src2.item2': { zh: 'AI基础设施投资追踪', en: 'AI infrastructure investment tracking' },
    's4.src3.en': { zh: '全球AI人才报告', en: 'Global AI Talent Report' },
    's4.src3.item1': { zh: '全球AI从业者分布', en: 'Global AI professional distribution' },
    's4.src3.item2': { zh: '人才缺口与流动趋势', en: 'Talent gap and mobility trends' },
    's4.src4.en': { zh: 'AI芯片市场分析', en: 'AI Chip Market Analysis' },
    's4.src4.item1': { zh: 'AI训练/推理芯片份额', en: 'AI training/inference chip share' },
    's4.src4.item2': { zh: '国产芯片进展追踪', en: 'Domestic chip progress tracking' },
    's4.st1.ind': { zh: '全球AI市场（2024）', en: 'Global AI Market (2024)' },
    's4.st1.val': { zh: '2,792亿美元', en: '$279.2B' },
    's4.st2.ind': { zh: '全球AI市场（2030E）', en: 'Global AI Market (2030E)' },
    's4.st2.val': { zh: '1.2万亿美元', en: '$1.2T' },
    's4.st3.ind': { zh: '全球AI市场（2035E）', en: 'Global AI Market (2035E)' },
    's4.st3.val': { zh: '6.56万亿美元', en: '$6.56T' },
    's4.st4.ind': { zh: '北美市场份额', en: 'North America Market Share' },
    's4.st5.ind': { zh: '中国市场份额', en: 'China Market Share' },
    's4.st6.ind': { zh: '全球AI从业者', en: 'Global AI Professionals' },
    's4.st6.val': { zh: '200万+人', en: '2M+' },
    's4.st7.ind': { zh: '全球AI人才缺口', en: 'Global AI Talent Gap' },
    's4.st7.val': { zh: '400万+', en: '4M+' },
    's4.st8.ind': { zh: 'NVIDIA训练芯片份额', en: 'NVIDIA Training Chip Share' },
    's4.st9.ind': { zh: '中国AI芯片国产化率', en: 'China AI Chip Localization Rate' },

    /* ========== 视图5：未来展望 ========== */
    's5.title': { zh: '未来展望与里程碑', en: 'Future Outlook & Milestones' },
    's5.subtitle': { zh: '从2017到2030，AI新质生产力的发展历程与未来路线图', en: 'From 2017 to 2030, AI development journey and future roadmap' },
    's5.core.title': { zh: '发展里程碑与未来路线图', en: 'Development Milestones & Future Roadmap' },
    's5.tl1.title': { zh: '战略规划元年', en: 'Strategic Planning Genesis' },
    's5.tl1.desc': { zh: '国务院发布《新一代人工智能发展规划》，将AI上升为国家战略', en: 'State Council issued "New Generation AI Development Plan", elevating AI to national strategy' },
    's5.tl2.title': { zh: '新基建加速', en: 'New Infrastructure Acceleration' },
    's5.tl2.desc': { zh: 'AI被纳入"新基建"核心领域，算力基础设施建设全面提速', en: 'AI included in "New Infrastructure" core areas, computing infrastructure construction accelerated' },
    's5.tl3.title': { zh: '大模型爆发', en: 'Large Model Boom' },
    's5.tl3.desc': { zh: '生成式AI元年，国产大模型百花齐放，产业应用加速落地', en: 'Generative AI genesis year, domestic models flourishing, industrial applications accelerating' },
    's5.tl4.title': { zh: '产业化深入', en: 'Industrialization Deepening' },
    's5.tl4.desc': { zh: 'AI核心产业规模突破9000亿元，"人工智能+"行动全面实施', en: 'AI core industry exceeded ¥900B, "AI+" action plan fully implemented' },
    's5.tl5.title': { zh: '万亿突破', en: 'Trillion Breakthrough' },
    's5.tl5.desc': { zh: '核心产业规模突破1.2万亿，人形机器人进工厂，新质生产力全面爆发', en: 'Core industry exceeded ¥1.2T, humanoid robots enter factories, new quality forces fully emerge' },
    's5.tl6.title': { zh: '智能经济时代', en: 'Intelligent Economy Era' },
    's5.tl6.desc': { zh: 'AI成为经济增长主引擎，对GDP拉动超1个百分点，全面进入智能经济时代', en: 'AI becomes main economic growth engine, GDP boost exceeds 1 pct, fully entering intelligent economy era' },
    's5.viz.title': { zh: 'AI发展路线图可视化', en: 'AI Development Roadmap Visualization' },
    's5.viz.subtitle': { zh: '多指标发展轨迹与AI关键能力演进预测', en: 'Multi-indicator development trajectory and AI capability evolution forecast' },
    's5.chart1.title': { zh: 'AI新质生产力发展路线图', en: 'AI New Quality Forces Roadmap' },
    's5.chart2.title': { zh: 'AI关键能力演进预期', en: 'AI Key Capability Evolution Forecast' },
    's5.v1.title': { zh: '通用人工智能', en: 'Artificial General Intelligence' },
    's5.v1.desc': { zh: '从专用AI向通用AI迈进，实现跨领域理解与推理', en: 'Advancing from narrow AI to AGI, achieving cross-domain understanding and reasoning' },
    's5.v2.title': { zh: '具身智能', en: 'Embodied Intelligence' },
    's5.v2.desc': { zh: '人形机器人规模化应用，AI从数字世界走向物理世界', en: 'Scaled humanoid robot applications, AI moving from digital to physical world' },
    's5.v3.title': { zh: '万物智联', en: 'Universal Intelligence' },
    's5.v3.desc': { zh: 'AIoT深度融合，构建全面智能化的生产生活新范式', en: 'Deep AIoT integration, building comprehensive intelligent production and living paradigms' },
    's5.v4.title': { zh: '科学发现', en: 'Scientific Discovery' },
    's5.v4.desc': { zh: 'AI加速科学研究进程，推动基础科学突破性进展', en: 'AI accelerating scientific research, driving breakthrough advances in fundamental science' },
    's5.demo.title': { zh: 'AI未来情景模拟', en: 'AI Future Scenario Simulation' },
    's5.demo1.title': { zh: 'AI能力成长可视化时间轴', en: 'AI Capability Growth Visual Timeline' },
    's5.demo1.label': { zh: '目标年份：', en: 'Target Year:' },
    's5.src1.name': { zh: '国务院', en: 'State Council' },
    's5.src1.en': { zh: '新一代AI发展规划', en: 'New Generation AI Plan' },
    's5.src1.item1': { zh: '2017年战略规划原文', en: '2017 Strategic Plan Original Text' },
    's5.src1.item2': { zh: '"人工智能+"行动方案', en: '"AI+" Action Plan' },
    's5.src2.name': { zh: '中国信通院', en: 'CAICT' },
    's5.src2.en': { zh: 'AI发展趋势白皮书', en: 'AI Development Trends White Paper' },
    's5.src2.item1': { zh: '产业发展路线图', en: 'Industry development roadmap' },
    's5.src2.item2': { zh: 'AI能力成熟度评估', en: 'AI capability maturity assessment' },
    's5.src3.name': { zh: '清华大学 AIR', en: 'Tsinghua AIR' },
    's5.src3.en': { zh: '人工智能研究院', en: 'Institute for AI Research' },
    's5.src3.item1': { zh: 'AGI技术发展预测', en: 'AGI technology development forecast' },
    's5.src3.item2': { zh: '具身智能研究进展', en: 'Embodied intelligence research progress' },
    's5.src4.item1': { zh: '全球AI治理趋势', en: 'Global AI governance trends' },
    's5.src4.item2': { zh: 'AI for Science进展', en: 'AI for Science progress' },
    's5.st1.ind': { zh: 'AI上升为国家战略', en: 'AI Elevated to National Strategy' },
    's5.st1.val': { zh: '《新一代AI发展规划》', en: 'New Generation AI Development Plan' },
    's5.st1.src': { zh: '国务院', en: 'State Council' },
    's5.st2.ind': { zh: 'AI纳入新基建', en: 'AI in New Infrastructure' },
    's5.st2.val': { zh: '国家发改委明确范围', en: 'NDRC Defined Scope' },
    's5.st2.src': { zh: '发改委', en: 'NDRC' },
    's5.st3.ind': { zh: '生成式AI元年', en: 'GenAI Genesis Year' },
    's5.st3.val': { zh: '大模型集中爆发', en: 'Massive Large Model Emergence' },
    's5.st3.src': { zh: '中国信通院', en: 'CAICT' },
    's5.st4.ind': { zh: 'AI+行动实施', en: 'AI+ Action Implementation' },
    's5.st4.val': { zh: '政府工作报告提出', en: 'Proposed in Gov Work Report' },
    's5.st4.src': { zh: '国务院', en: 'State Council' },
    's5.st5.ind': { zh: '核心产业破万亿', en: 'Core Industry Exceeds Trillion' },
    's5.st5.val': { zh: '1.2万亿元', en: '¥1.2 Trillion' },
    's5.st5.src': { zh: '中国信通院', en: 'CAICT' },
    's5.st6.ind': { zh: '2030 GDP拉动预期', en: '2030 GDP Impact Forecast' },
    's5.st6.src': { zh: '中央财经大学', en: 'CUFE' },
    's5.st7.ind': { zh: 'AI能力演进预测', en: 'AI Capability Evolution Forecast' },
    's5.st7.val': { zh: '四维能力指数', en: '4D Capability Index' },
    's5.st7.src': { zh: '清华AIR/信通院', en: 'Tsinghua AIR/CAICT' },
    's5.st8.ind': { zh: 'AGI预期时间窗口', en: 'AGI Expected Timeframe' },
    's5.st8.src': { zh: '清华AIR/OECD', en: 'Tsinghua AIR/OECD' },

    /* --- 页脚 --- */
    'footer.desc': { zh: '人工智能：新质生产力引擎 · 数据可视化展示', en: 'AI: New Quality Productive Forces Engine · Data Visualization' },
    'footer.copyright': { zh: '数据来源：中国信通院、工信部、中央财经大学、IDC、McKinsey、Grand View Research &nbsp;|&nbsp; © 2025 AI新质生产力 · 课程作业展示', en: 'Data Sources: CAICT, MIIT, CUFE, IDC, McKinsey, Grand View Research &nbsp;|&nbsp; © 2025 AI New Quality Forces · Course Project' },

    /* --- 图表内标签（ECharts用） --- */
    'chart.invest.compute': { zh: '基础算力', en: 'Computing' },
    'chart.invest.model': { zh: '大模型研发', en: 'Model R&D' },
    'chart.invest.app': { zh: '应用开发', en: 'App Dev' },
    'chart.invest.data': { zh: '数据服务', en: 'Data Services' },
    'chart.invest.security': { zh: 'AI安全', en: 'AI Safety' },
    'chart.enterprise.startup': { zh: '初创/中小企业', en: 'Startups/SMEs' },
    'chart.enterprise.large': { zh: '大型企业', en: 'Large Enterprises' },
    'chart.enterprise.listed': { zh: '上市公司', en: 'Listed Companies' },
    'chart.enterprise.unicorn': { zh: '独角兽', en: 'Unicorns' },
    'chart.enterprise.research': { zh: '科研院所', en: 'Research Institutes' },
    'chart.enterprise.other': { zh: '其他企业', en: 'Other Enterprises' },
    'chart.enterprise.startupOnly': { zh: '初创企业', en: 'Startups' },
    'chart.industry.mfg': { zh: '智能制造', en: 'Smart Mfg' },
    'chart.industry.fin': { zh: '金融服务', en: 'Finance' },
    'chart.industry.med': { zh: '医疗健康', en: 'Healthcare' },
    'chart.industry.trans': { zh: '智能交通', en: 'Transport' },
    'chart.industry.edu': { zh: '教育科技', en: 'EdTech' },
    'chart.industry.energy': { zh: '能源电力', en: 'Energy' },
    'chart.industry.other': { zh: '其他行业', en: 'Other' },
    'chart.radar.maturity': { zh: '技术成熟度', en: 'Tech Maturity' },
    'chart.radar.penetration': { zh: '市场渗透率', en: 'Market Penetration' },
    'chart.radar.investment': { zh: '投资热度', en: 'Investment Heat' },
    'chart.radar.policy': { zh: '政策支持', en: 'Policy Support' },
    'chart.radar.talent': { zh: '人才储备', en: 'Talent Reserve' },
    'chart.radar.commercial': { zh: '商业化程度', en: 'Commercialization' },
    'chart.radar.current': { zh: '当前水平', en: 'Current Level' },
    'chart.radar.forecast': { zh: '2030预期', en: '2030 Forecast' },
    'chart.region.na': { zh: '北美', en: 'N. America' },
    'chart.region.eu': { zh: '欧洲', en: 'Europe' },
    'chart.region.cn': { zh: '中国', en: 'China' },
    'chart.region.other': { zh: '其他', en: 'Others' },
    'chart.us.paper': { zh: '论文数量', en: 'Papers' },
    'chart.us.patent': { zh: '专利数量', en: 'Patents' },
    'chart.us.enterprise': { zh: '企业规模', en: 'Enterprise Scale' },
    'chart.us.invest': { zh: '投资金额', en: 'Investment' },
    'chart.us.talent': { zh: '人才储备', en: 'Talent' },
    'chart.us.application': { zh: '应用落地', en: 'Applications' },
    'chart.us.us': { zh: '美国', en: 'USA' },
    'chart.us.china': { zh: '中国', en: 'China' },
    'chart.global.radar.basic': { zh: '基础研究', en: 'Basic Research' },
    'chart.global.radar.app': { zh: '产业应用', en: 'Industry Apps' },
    'chart.global.radar.invest': { zh: '投资规模', en: 'Investment Scale' },
    'chart.global.radar.talent': { zh: '人才储备', en: 'Talent Reserve' },
    'chart.global.radar.policy': { zh: '政策环境', en: 'Policy Environment' },
    'chart.global.radar.compute': { zh: '算力基础', en: 'Computing Base' },
    'chart.global.radar.eu': { zh: '欧洲', en: 'Europe' },
    'chart.eff.rd': { zh: '研发加速', en: 'R&D Speed' },
    'chart.eff.qc': { zh: '质检提升', en: 'QC Improvement' },
    'chart.eff.cs': { zh: '客服效率', en: 'CS Efficiency' },
    'chart.eff.energy': { zh: '能耗优化', en: 'Energy Opt.' },
    'chart.eff.supply': { zh: '供应链', en: 'Supply Chain' },
    'chart.eff.doc': { zh: '文档处理', en: 'Doc Processing' },
    'chart.eff.index': { zh: 'AI效率提升指数', en: 'AI Efficiency Index' },
    'chart.roadmap.scale': { zh: '产业规模(千亿)', en: 'Industry Scale (100B)' },
    'chart.roadmap.gdp': { zh: 'GDP拉动(pct×10)', en: 'GDP Impact (pct×10)' },
    'chart.roadmap.enterprise': { zh: '企业数量(千)', en: 'Enterprises (K)' },
    'chart.evo.perception': { zh: '感知理解', en: 'Perception' },
    'chart.evo.reasoning': { zh: '推理决策', en: 'Reasoning' },
    'chart.evo.generation': { zh: '生成创造', en: 'Generation' },
    'chart.evo.action': { zh: '自主行动', en: 'Autonomous Action' },
    'chart.market.size': { zh: '市场规模', en: 'Market Size' },
    'chart.market.growth': { zh: '增长率', en: 'Growth Rate' },
    'chart.talent.us': { zh: '美国', en: 'USA' },
    'chart.talent.cn': { zh: '中国', en: 'China' },
    'chart.talent.eu': { zh: '欧洲', en: 'Europe' },
    'chart.talent.other': { zh: '其他', en: 'Others' },
    'chart.mark.trillion': { zh: '1.2万亿', en: '¥1.2T' },
};

/* ============================================================
   国际化引擎
   ============================================================ */
function t(key) {
    const entry = I18N[key];
    if (!entry) return key;
    return entry[currentLang] || entry['zh'] || key;
}

function applyTranslations() {
    const lang = currentLang;
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    // 更新页面标题
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
        const key = titleEl.getAttribute('data-i18n');
        document.title = t(key);
    }

    // 更新所有 data-i18n 元素的文本内容
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'TITLE') return; // 已处理

        // 对于含有 data-i18n-attr 的特殊属性
        const attrKey = el.getAttribute('data-i18n-attr');
        if (attrKey) {
            const [attr, iKey] = attrKey.split(':');
            el.setAttribute(attr, t(iKey));
            return;
        }

        const translated = t(key);
        if (translated.includes('<')) {
            el.innerHTML = translated;
        } else {
            el.textContent = translated;
        }
    });

    // 更新 Tooltip (data-tip / data-tip-en)
    document.querySelectorAll('[data-tip]').forEach(el => {
        if (lang === 'en' && el.hasAttribute('data-tip-en')) {
            el.setAttribute('data-tip-active', el.getAttribute('data-tip-en'));
        } else {
            el.setAttribute('data-tip-active', el.getAttribute('data-tip'));
        }
    });

    // 更新 anim-num 后缀
    document.querySelectorAll('.anim-num').forEach(el => {
        const suffixKey = lang === 'en' ? 'data-suffix-en' : 'data-suffix-zh';
        const suffix = el.getAttribute(suffixKey) || el.getAttribute('data-suffix-zh') || '';
        el.setAttribute('data-suffix', suffix);
        // 重新显示当前值
        const val = parseFloat(el.getAttribute('data-val'));
        const isFloat = val % 1 !== 0;
        el.textContent = (isFloat ? val.toFixed(1) : val) + suffix;
    });

    // 更新语言按钮文字
    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = lang === 'zh' ? 'EN' : '中';
    }

    // 重绘当前视图的图表
    const hash = window.location.hash.replace('#', '') || 'home';
    if (CHAPTERS.includes(hash)) {
        setTimeout(() => initChartsForView(hash), 100);
    }

    // 如果弹窗打开，重绘雷达图
    if (document.getElementById('radarModal').classList.contains('active')) {
        setTimeout(() => renderRadarChart(), 100);
    }
}

function switchLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('lang', currentLang);
    applyTranslations();
}

function initLanguageToggle() {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
        toggle.addEventListener('click', switchLanguage);
    }
    // 初始化语言状态
    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = currentLang === 'zh' ? 'EN' : '中';
    }
    document.documentElement.setAttribute('data-lang', currentLang);
    document.documentElement.setAttribute('lang', currentLang === 'zh' ? 'zh-CN' : 'en');
    // 首次加载时如果非中文，应用翻译
    if (currentLang !== 'zh') {
        applyTranslations();
    }
}

/* ============================================================
   主初始化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initThemeToggle();
    initMobileMenu();
    initLanguageToggle();  // 新增：初始化语言切换
    initScrollAnimations();
    initSectionTabs();
    initComparisonBars();
    initBackToTop();
    initSummaryTableInteractions();
    initNumberAnimations();

    const hash = window.location.hash.replace('#', '');
    const validViews = ['home', ...CHAPTERS];
    if (hash && validViews.includes(hash)) {
        navigateTo(hash, false);
    } else {
        navigateTo('home', false);
    }
});

/* ========== 页面导航 ========== */
function navigateTo(viewId, updateHash = true) {
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');

    const navHome = document.querySelector('.nav-group-home');
    const navSub = document.getElementById('navGroupSub');
    if (viewId === 'home') {
        if (navHome) navHome.style.display = 'flex';
        if (navSub) navSub.style.display = 'none';
    } else {
        if (navHome) navHome.style.display = 'none';
        if (navSub) navSub.style.display = 'flex';
        updateChapterButtons(viewId);
    }

    document.querySelectorAll('.nav-group-home .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${viewId}'`)) {
            link.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHash) history.pushState(null, '', `#${viewId}`);

    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.remove('open');

    setTimeout(() => {
        initChartsForView(viewId);
        if (viewId === 'efficiency') initComparisonBars();
        if (viewId === 'home') {
            setTimeout(() => initNumberAnimations(), 300);
        }
    }, 200);
}

function navPrev() {
    const hash = window.location.hash.replace('#', '');
    const idx = CHAPTERS.indexOf(hash);
    if (idx > 0) navigateTo(CHAPTERS[idx - 1]);
}
function navNext() {
    const hash = window.location.hash.replace('#', '');
    const idx = CHAPTERS.indexOf(hash);
    if (idx < CHAPTERS.length - 1) navigateTo(CHAPTERS[idx + 1]);
}

function updateChapterButtons(viewId) {
    const prevBtn = document.getElementById('prevChapterBtn');
    const nextBtn = document.getElementById('nextChapterBtn');
    const idx = CHAPTERS.indexOf(viewId);
    prevBtn.style.opacity = idx <= 0 ? '0.4' : '1';
    prevBtn.style.pointerEvents = idx <= 0 ? 'none' : 'auto';
    nextBtn.style.opacity = idx >= CHAPTERS.length - 1 ? '0.4' : '1';
    nextBtn.style.pointerEvents = idx >= CHAPTERS.length - 1 ? 'none' : 'auto';
}

window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, false);
});

/* ========== 滚动效果 ========== */
function initScrollEffects() {
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ========== 主题切换 ========== */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
        setTimeout(() => reinitAllCharts(), 100);
        if (document.getElementById('radarModal').classList.contains('active')) {
            setTimeout(() => renderRadarChart(), 150);
        }
    });
}

/* ========== 移动菜单 ========== */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    btn.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

/* ========== 滚动动画 ========== */
function initScrollAnimations() {
    const els = document.querySelectorAll('.knowledge-card,.case-study-card,.demo-card,.practice-card,.comparison-table-wrapper,.directory-card,.chart-card-vis,.vision-card,.industry-mini-card,.source-card,.source-table-wrapper,.summary-toolbar');
    els.forEach(el => el.classList.add('fade-in'));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => observer.observe(el));
}

/* ========== Tab切换 ========== */
function initSectionTabs() {
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        const section = btn.closest('.module-section');
        if (!section) return;
        const targetTab = btn.getAttribute('data-tab');
        section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const targetPanel = section.querySelector(`.tab-panel[data-panel="${targetTab}"]`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            if (targetTab === 'viz') {
                const viewId = section.closest('.page-view')?.id?.replace('view-', '');
                setTimeout(() => initChartsForView(viewId), 100);
            }
        }
    });
}

/* ========== 对比条动画 ========== */
function initComparisonBars() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.comparison-item').forEach(item => {
                    item.querySelectorAll('.comp-bar').forEach((bar, i) => {
                        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 150);
                    });
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    const container = document.querySelector('.comparison-container');
    if (container) observer.observe(container);
}

/* ========== 回到顶部 ========== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ========== 演示按钮激活 ========== */
function activateBtn(btn) {
    const group = btn.closest('.btn-group');
    if (group) group.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

/* ============================================================
   首页数据总览交互功能
   ============================================================ */

/* 1. 表格点击跳转与Tooltip */
function initSummaryTableInteractions() {
    const table = document.getElementById('summaryTable');
    if (!table) return;

    let tooltip = document.getElementById('tableTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tableTooltip';
        tooltip.className = 'table-tooltip';
        document.body.appendChild(tooltip);
    }

    table.addEventListener('click', (e) => {
        const td = e.target.closest('td[data-target], th[data-target]');
        if (td) {
            const target = td.getAttribute('data-target');
            if (target) navigateTo(target);
        }
    });

    table.addEventListener('mouseover', (e) => {
        const td = e.target.closest('td[data-tip]');
        if (td) {
            const tipAttr = currentLang === 'en' && td.hasAttribute('data-tip-en') ? 'data-tip-en' : 'data-tip';
            const tip = td.getAttribute(tipAttr);
            tooltip.textContent = tip;
            tooltip.classList.add('visible');
            const rect = td.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        }
    });

    table.addEventListener('mouseout', (e) => {
        const td = e.target.closest('td[data-tip]');
        if (td) {
            tooltip.classList.remove('visible');
        }
    });
}

/* 2. 数字滚动动画 */
function initNumberAnimations() {
    const nums = document.querySelectorAll('.anim-num');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.animated) return;
                el.dataset.animated = 'true';
                const target = parseFloat(el.dataset.val);
                const suffix = el.dataset.suffix || '';
                const isFloat = target % 1 !== 0;
                const duration = 1500;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;
                    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    nums.forEach(n => {
        n.dataset.animated = '';
        observer.observe(n);
    });
}

/* 3. 导出 CSV */
function exportSummaryCSV() {
    const table = document.getElementById('summaryTable');
    if (!table) return;

    let csv = '\uFEFF';
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cols = row.querySelectorAll('th, td');
        const rowData = [];
        cols.forEach(col => {
            let text = col.innerText.replace(/"/g, '""').replace(/\n/g, ' ');
            rowData.push(`"${text}"`);
        });
        csv += rowData.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentLang === 'en' ? 'AI_New_Quality_Forces_Overview.csv' : 'AI新质生产力_核心数据总览.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/* 4. 战略评估雷达图弹窗 */
function openRadarModal() {
    const modal = document.getElementById('radarModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => renderRadarChart(), 200);
}

function closeRadarModal() {
    const modal = document.getElementById('radarModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (radarChartInstance) {
        radarChartInstance.dispose();
        radarChartInstance = null;
    }
}

function renderRadarChart() {
    const el = document.getElementById('modalRadarChart');
    if (!el) return;
    if (radarChartInstance) radarChartInstance.dispose();
    radarChartInstance = echarts.init(el);

    const scores = { industry: 95, empower: 95, efficiency: 95, global: 80, future: 92 };
    const totalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

    const scoreEl = document.getElementById('radarTotalScore');
    if (scoreEl) {
        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= totalScore) { current = totalScore; clearInterval(interval); }
            scoreEl.textContent = current;
        }, 20);
    }

    const dark = isDark();
    const textCol = dark ? '#e2e8f0' : '#475569';
    const gridCol = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const indicators = [
        { name: t('nav.industry'), max: 100 },
        { name: t('nav.empower'), max: 100 },
        { name: t('nav.efficiency'), max: 100 },
        { name: t('summary.th.global'), max: 100 },
        { name: currentLang === 'en' ? 'Future Potential' : '未来潜力', max: 100 }
    ];

    radarChartInstance.setOption({
        tooltip: { backgroundColor: tooltipBg(), borderColor: tooltipBorder(), textStyle: { color: tooltipTextColor(), fontSize: 12 } },
        radar: {
            indicator: indicators,
            shape: 'polygon', radius: '65%',
            axisName: { color: textCol, fontSize: 12, fontWeight: 600 },
            splitArea: { areaStyle: { color: dark ? ['rgba(107,141,214,0.02)', 'rgba(107,141,214,0.05)'] : ['rgba(107,141,214,0.02)', 'rgba(107,141,214,0.05)'] } },
            splitLine: { lineStyle: { color: gridCol } },
            axisLine: { lineStyle: { color: gridCol } }
        },
        series: [{
            type: 'radar',
            data: [{
                value: Object.values(scores),
                name: currentLang === 'en' ? 'Strategic Value Index' : '战略价值指数',
                lineStyle: { color: COLORS.purple, width: 3 },
                itemStyle: { color: COLORS.purple, borderWidth: 2, borderColor: '#fff' },
                areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(155, 126, 216, 0.4)' }, { offset: 1, color: 'rgba(107, 141, 214, 0.1)' }]) },
                label: { show: true, color: textCol, fontSize: 12, fontWeight: 700, formatter: '{c}' }
            }]
        }]
    });
}

function downloadRadarImage() {
    if (!radarChartInstance) return;
    const url = radarChartInstance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: isDark() ? '#1e293b' : '#fff' });
    const link = document.createElement('a');
    link.href = url;
    link.download = currentLang === 'en' ? 'AI_Strategic_Assessment.png' : 'AI战略价值评估模型.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) { closeRadarModal(); }
});

/* ============================================================
   ECharts 图表系统
   ============================================================ */
const COLORS = {
    blue: '#6B8DD6', blueLight: '#8BA7E8', blueDark: '#4A6BB5',
    coral: '#E87461', coralLight: '#F09D8F', coralDark: '#C95A49',
    green: '#6BAF8D', greenLight: '#8CC9A8', greenDark: '#4E9070',
    gold: '#D4A95A', goldLight: '#E4C47E',
    purple: '#9B7ED8', purpleLight: '#B99DE8',
    textDark: '#0f172a', textSec: '#475569', textMuted: '#94a3b8',
    gridLine: 'rgba(0,0,0,0.06)', gridLineDark: 'rgba(255,255,255,0.06)',
};

function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
function textColor() { return isDark() ? '#e2e8f0' : COLORS.textSec; }
function gridColor() { return isDark() ? COLORS.gridLineDark : COLORS.gridLine; }
function tooltipBg() { return isDark() ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.98)'; }
function tooltipBorder() { return isDark() ? 'rgba(107,141,214,0.3)' : '#e2e8f0'; }
function tooltipTextColor() { return isDark() ? '#e2e8f0' : COLORS.textDark; }

function getChart(id) {
    let el = document.getElementById(id);
    if (!el) return null;
    let chart = echarts.getInstanceByDom(el);
    if (chart) { chart.dispose(); }
    return echarts.init(el);
}

function initChartsForView(viewId) {
    if (viewId === 'industry') initIndustryCharts();
    if (viewId === 'empower') initEmpowerCharts();
    if (viewId === 'efficiency') initEfficiencyCharts();
    if (viewId === 'global') initGlobalCharts();
    if (viewId === 'future') initFutureCharts();
}

function reinitAllCharts() {
    chartsInitialized = {};
    CHAPTERS.forEach(v => initChartsForView(v));
}

/* ===== 产业规模图表 ===== */
function initIndustryCharts() {
    const en = currentLang === 'en';
    const c1 = getChart('chart-industry-scale');
    if (c1) {
        c1.setOption({
            tooltip: { trigger: 'axis', backgroundColor: tooltipBg(), borderColor: tooltipBorder(), textStyle: { color: tooltipTextColor(), fontSize: 12 }, formatter: '{b}' + (en ? '' : '年') + '<br/>{a}: {c} ' + (en ? '(100M RMB)' : '亿元') },
            grid: { left: '8%', right: '5%', top: '12%', bottom: '15%' },
            xAxis: { type: 'category', data: ['2019','2020','2021','2022','2023','2024','2025','2027(E)'], axisLine:{lineStyle:{color:gridColor()}}, axisLabel:{color:textColor(),fontSize:11}, axisTick:{show:false} },
            yAxis: { type: 'value', name: en ? '100M RMB' : '亿元', nameTextStyle:{color:textColor(),fontSize:11}, axisLine:{show:false}, axisLabel:{color:textColor(),fontSize:11}, splitLine:{lineStyle:{color:gridColor()}} },
            series: [{ name: en ? 'Industry Scale' : '产业规模', type:'line', data:[1200,1800,2800,4500,5800,9000,12000,20000], smooth:true, symbol:'circle', symbolSize:8,
                lineStyle:{color:COLORS.blue,width:3}, itemStyle:{color:COLORS.blue,borderWidth:2,borderColor:'#fff'},
                areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(107,141,214,0.4)'},{offset:1,color:'rgba(107,141,214,0.02)'}])},
                markPoint:{data:[{name:en?'Trillion':'万亿',xAxis:'2025',yAxis:12000,label:{formatter:t('chart.mark.trillion'),color:'#fff',fontSize:11}}],itemStyle:{color:COLORS.blue}}
            }]
        });
    }
    const c2 = getChart('chart-gdp-pull');
    if (c2) {
        c2.setOption({
            tooltip: { trigger:'axis', backgroundColor:tooltipBg(), borderColor:tooltipBorder(), textStyle:{color:tooltipTextColor(),fontSize:12} },
            grid: { left:'8%', right:'5%', top:'12%', bottom:'15%' },
            xAxis: { type:'category', data:['2023','2024','2025','2026(E)','2027(E)','2028(E)','2030(E)'], axisLine:{lineStyle:{color:gridColor()}}, axisLabel:{color:textColor(),fontSize:11}, axisTick:{show:false} },
            yAxis: { type:'value', name: en ? 'pct' : '百分点', nameTextStyle:{color:textColor(),fontSize:11}, axisLine:{show:false}, axisLabel:{color:textColor(),fontSize:11}, splitLine:{lineStyle:{color:gridColor()}} },
            series: [{ type:'bar', data:[{value:0.15,itemStyle:{color:COLORS.blueLight}},{value:0.25,itemStyle:{color:COLORS.blueLight}},{value:0.35,itemStyle:{color:COLORS.blue}},{value:0.45,itemStyle:{color:COLORS.blue}},{value:0.55,itemStyle:{color:COLORS.coral}},{value:0.7,itemStyle:{color:COLORS.coral}},{value:1.0,itemStyle:{color:COLORS.coralDark}}], barWidth:'45%', itemStyle:{borderRadius:[4,4,0,0]}, label:{show:true,position:'top',color:textColor(),fontSize:11} }]
        });
    }
    const c3 = getChart('chart-invest-structure');
    if (c3) {
        c3.setOption({
            tooltip: { trigger:'axis', axisPointer:{type:'shadow'}, backgroundColor:tooltipBg(), borderColor:tooltipBorder(), textStyle:{color:tooltipTextColor(),fontSize:12} },
            grid: { left:'22%', right:'10%', top:'5%', bottom:'5%' },
            xAxis: { type:'value', axisLine:{show:false}, axisLabel:{color:textColor(),fontSize:11,formatter:'{value}%'}, splitLine:{lineStyle:{color:gridColor()}} },
            yAxis: { type:'category', data:[t('chart.invest.compute'),t('chart.invest.model'),t('chart.invest.app'),t('chart.invest.data'),t('chart.invest.security')], axisLine:{show:false}, axisTick:{show:false}, axisLabel:{color:textColor(),fontSize:12} },
            series: [{ type:'bar', data:[35,28,22,10,5], barWidth:'55%', itemStyle:{color:new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:COLORS.blue},{offset:1,color:COLORS.blueLight}]),borderRadius:[0,4,4,0]}, label:{show:true,position:'right',color:textColor(),fontSize:12,formatter:'{c}%'} }]
        });
    }
    const c4 = getChart('chart-model-growth');
    if (c4) {
        c4.setOption({
            tooltip: { trigger:'axis', backgroundColor:tooltipBg(), borderColor:tooltipBorder(), textStyle:{color:tooltipTextColor(),fontSize:12} },
            grid: { left:'8%', right:'5%', top:'12%', bottom:'15%' },
            xAxis: { type:'category', data:['2020','2021','2022','2023','2024','2025'], axisLine:{lineStyle:{color:gridColor()}}, axisLabel:{color:textColor(),fontSize:11}, axisTick:{show:false} },
            yAxis: { type:'value', name: en ? 'Count' : '个', nameTextStyle:{color:textColor(),fontSize:11}, axisLine:{show:false}, axisLabel:{color:textColor(),fontSize:11}, splitLine:{lineStyle:{color:gridColor()}} },
            series: [{ name: en ? 'Large Models' : '大模型数量', type:'bar', data:[50,120,280,500,900,1300], barWidth:'50%', itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:COLORS.coral},{offset:1,color:COLORS.coralLight}]),borderRadius:[4,4,0,0]}, label:{show:true,position:'top',color:textColor(),fontSize:11} }]
        });
    }
    const c5 = getChart('enterpriseChart');
    if (c5) {
        c5.setOption({
            tooltip: { trigger:'item', backgroundColor:tooltipBg(), borderColor:tooltipBorder(), textStyle:{color:tooltipTextColor(),fontSize:12} },
            series: [{ type:'pie', radius:['35%','65%'], center:['50%','55%'], itemStyle:{borderRadius:6,borderColor:isDark()?'#1e293b':'#fff',borderWidth:3}, label:{color:textColor(),fontSize:11,formatter:'{b}\n{d}%'}, data:[{value:4800,name:t('chart.enterprise.startup'),itemStyle:{color:COLORS.blueLight}},{value:600,name:t('chart.enterprise.large'),itemStyle:{color:COLORS.blue}},{value:300,name:t('chart.enterprise.listed'),itemStyle:{color:COLORS.coral}},{value:100,name:t('chart.enterprise.unicorn'),itemStyle:{color:COLORS.gold}},{value:200,name:t('chart.enterprise.research'),itemStyle:{color:COLORS.green}}] }]
        });
    }
}

/* ===== 行业赋能图表 ===== */
function initEmpowerCharts() {
    const en = currentLang === 'en';
    const r = getChart('chart-radar');
    if (r) {
        r.setOption({
            tooltip:{backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}},
            legend:{data:[t('chart.radar.current'),t('chart.radar.forecast')],textStyle:{color:textColor(),fontSize:11},bottom:-5},
            radar:{indicator:[{name:t('chart.radar.maturity'),max:100},{name:t('chart.radar.penetration'),max:100},{name:t('chart.radar.investment'),max:100},{name:t('chart.radar.policy'),max:100},{name:t('chart.radar.talent'),max:100},{name:t('chart.radar.commercial'),max:100}], shape:'polygon', axisName:{color:textColor(),fontSize:11}, splitArea:{areaStyle:{color:isDark()?['rgba(107,141,214,0.02)','rgba(107,141,214,0.05)']:['rgba(107,141,214,0.02)','rgba(107,141,214,0.05)']}}, splitLine:{lineStyle:{color:gridColor()}}, axisLine:{lineStyle:{color:gridColor()}} },
            series:[{type:'radar',data:[{value:[92,85,88,95,75,82],name:t('chart.radar.current'),lineStyle:{color:COLORS.blue,width:2},itemStyle:{color:COLORS.blue},areaStyle:{color:'rgba(107,141,214,0.25)'}},{value:[98,95,95,98,92,95],name:t('chart.radar.forecast'),lineStyle:{color:COLORS.coral,width:2,type:'dashed'},itemStyle:{color:COLORS.coral},areaStyle:{color:'rgba(232,116,97,0.1)'}}]}]
        });
    }
    const p = getChart('chart-industry-pie');
    if (p) {
        p.setOption({
            tooltip:{trigger:'item',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}},
            series:[{type:'pie',radius:['20%','65%'],center:['50%','50%'],roseType:'area', itemStyle:{borderRadius:5,borderColor:isDark()?'#1e293b':'#fff',borderWidth:2}, label:{color:textColor(),fontSize:11,formatter:'{b}\n{d}%'}, data:[{value:25.9,name:t('chart.industry.mfg'),itemStyle:{color:COLORS.blue}},{value:18.5,name:t('chart.industry.fin'),itemStyle:{color:COLORS.coral}},{value:15.2,name:t('chart.industry.med'),itemStyle:{color:COLORS.green}},{value:12.8,name:t('chart.industry.trans'),itemStyle:{color:COLORS.gold}},{value:10.3,name:t('chart.industry.edu'),itemStyle:{color:COLORS.purple}},{value:8.5,name:t('chart.industry.energy'),itemStyle:{color:COLORS.blueLight}},{value:8.8,name:t('chart.industry.other'),itemStyle:{color:COLORS.greenLight}}] }]
        });
    }
    initEmpowerCompare('penetration');
}
function initEmpowerCompare(dim) {
    const en = currentLang === 'en';
    const c = getChart('chart-empower-compare');
    if (!c) return;
    const names = [t('chart.industry.mfg'),en?'FinTech':t('chart.industry.fin'),t('chart.industry.med'),t('chart.industry.trans'),t('chart.industry.energy'),en?'Smart Edu':t('chart.industry.edu')];
    const datasets = { penetration: { data: [70, 80, 85, 60, 55, 45], names }, efficiency: { data: [29, 40, 35, 20, 35, 18], names }, investment: { data: [3500, 2800, 1800, 2200, 1500, 800], names } };
    const d = datasets[dim] || datasets.penetration;
    c.setOption({
        tooltip:{trigger:'axis',axisPointer:{type:'shadow'},backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}},
        grid:{left:'18%',right:'10%',top:'5%',bottom:'5%'},
        xAxis:{type:'value',axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11},splitLine:{lineStyle:{color:gridColor()}}},
        yAxis:{type:'category',data:d.names,axisLine:{show:false},axisTick:{show:false},axisLabel:{color:textColor(),fontSize:12}},
        series:[{type:'bar',data:d.data,barWidth:'55%', itemStyle:{color:new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:COLORS.coral},{offset:1,color:COLORS.coralLight}]),borderRadius:[0,4,4,0]}, label:{show:true,position:'right',color:textColor(),fontSize:12} }]
    });
}
function switchEmpowerDim(dim, btn) { activateBtn(btn); initEmpowerCompare(dim); }

/* ===== 效率革命图表 ===== */
function initEfficiencyCharts() {
    const en = currentLang === 'en';
    const g = getChart('chart-genai');
    if (g) { g.setOption({ tooltip:{trigger:'axis',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, grid:{left:'10%',right:'5%',top:'10%',bottom:'12%'}, xAxis:{type:'category',data:['2022','2023','2024','2025','2026(E)','2027(E)','2028(E)','2029(E)'],axisLine:{lineStyle:{color:gridColor()}},axisLabel:{color:textColor(),fontSize:10},axisTick:{show:false}}, yAxis:{type:'value',axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11},splitLine:{lineStyle:{color:gridColor()}}}, series:[{type:'line',data:[8,22,65,146,250,390,560,728],smooth:true,symbol:'circle',symbolSize:6, lineStyle:{color:COLORS.green,width:3},itemStyle:{color:COLORS.green,borderWidth:2,borderColor:'#fff'}, areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(107,175,141,0.35)'},{offset:1,color:'rgba(107,175,141,0.02)'}])} }] }); }
    const ei = getChart('chart-efficiency-index');
    if (ei) { ei.setOption({ tooltip:{trigger:'item',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, radar:{indicator:[{name:t('chart.eff.rd'),max:100},{name:t('chart.eff.qc'),max:100},{name:t('chart.eff.cs'),max:100},{name:t('chart.eff.energy'),max:100},{name:t('chart.eff.supply'),max:100},{name:t('chart.eff.doc'),max:100}], shape:'polygon',axisName:{color:textColor(),fontSize:11}, splitArea:{areaStyle:{color:isDark()?['rgba(107,175,141,0.02)','rgba(107,175,141,0.05)']:['rgba(107,175,141,0.02)','rgba(107,175,141,0.05)']}}, splitLine:{lineStyle:{color:gridColor()}},axisLine:{lineStyle:{color:gridColor()}} }, series:[{type:'radar',data:[{value:[58,82,99,42,58,95],name:t('chart.eff.index'), lineStyle:{color:COLORS.green,width:2},itemStyle:{color:COLORS.green},areaStyle:{color:'rgba(107,175,141,0.3)'}}]}] }); }
}

/* ===== 全球格局图表 ===== */
function initGlobalCharts() {
    const en = currentLang === 'en';
    const gm = getChart('chart-global-market');
    if (gm) { gm.setOption({ tooltip:{trigger:'axis',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, legend:{data:[t('chart.market.size'),t('chart.market.growth')],textStyle:{color:textColor(),fontSize:11},top:0,right:0}, grid:{left:'8%',right:'10%',top:'15%',bottom:'12%'}, xAxis:{type:'category',data:['2022','2023','2024','2025','2026(E)','2028(E)','2030(E)','2035(E)'],axisLine:{lineStyle:{color:gridColor()}},axisLabel:{color:textColor(),fontSize:11},axisTick:{show:false}}, yAxis:[{type:'value',name:en?'100M USD':'亿美元',nameTextStyle:{color:textColor(),fontSize:11},axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11},splitLine:{lineStyle:{color:gridColor()}}},{type:'value',name:'%',nameTextStyle:{color:textColor(),fontSize:11},axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11,formatter:'{value}%'},splitLine:{show:false}}], series:[{name:t('chart.market.size'),type:'bar',data:[1500,2000,2792,3183,4308,7500,12000,65600], itemStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:COLORS.gold},{offset:1,color:COLORS.goldLight}]),borderRadius:[4,4,0,0]},barWidth:'50%'},{name:t('chart.market.growth'),type:'line',yAxisIndex:1,data:[28,33,40,14,35,37,35,30],smooth:true,symbol:'circle',symbolSize:6,lineStyle:{color:COLORS.blue,width:2},itemStyle:{color:COLORS.blue}}] }); }
    const rs = getChart('chart-region-share');
    if (rs) { rs.setOption({ tooltip:{trigger:'item',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, series:[{type:'pie',radius:['42%','70%'],center:['50%','55%'], itemStyle:{borderRadius:6,borderColor:isDark()?'#1e293b':'#fff',borderWidth:3}, label:{color:textColor(),fontSize:11,formatter:'{b}\n{d}%'}, data:[{value:55,name:t('chart.region.na'),itemStyle:{color:COLORS.blue}},{value:20,name:t('chart.region.eu'),itemStyle:{color:COLORS.green}},{value:18,name:t('chart.region.cn'),itemStyle:{color:COLORS.coral}},{value:7,name:t('chart.region.other'),itemStyle:{color:COLORS.goldLight}}] }] }); }
    
    const cu = getChart('chart-china-us');
    if (cu) { cu.setOption({ tooltip:{backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, legend:{data:[t('chart.us.us'),t('chart.us.china')],textStyle:{color:textColor(),fontSize:11},bottom:-5}, radar:{indicator:[{name:t('chart.us.paper'),max:100},{name:t('chart.us.patent'),max:100},{name:t('chart.us.enterprise'),max:100},{name:t('chart.us.invest'),max:100},{name:t('chart.us.talent'),max:100},{name:t('chart.us.application'),max:100}], shape:'polygon',axisName:{color:textColor(),fontSize:11}, splitArea:{areaStyle:{color:'transparent'}}, splitLine:{lineStyle:{color:gridColor()}},axisLine:{lineStyle:{color:gridColor()}} }, series:[{type:'radar',data:[{value:[85,70,80,95,90,75],name:t('chart.us.us'),lineStyle:{color:COLORS.blue,width:2},itemStyle:{color:COLORS.blue},areaStyle:{color:'rgba(107,141,214,0.2)'}},{value:[95,90,70,65,65,90],name:t('chart.us.china'),lineStyle:{color:COLORS.coral,width:2},itemStyle:{color:COLORS.coral},areaStyle:{color:'rgba(232,116,97,0.2)'}}]}] }); }
    
    const tl = getChart('chart-talent');
    if (tl) { tl.setOption({ tooltip:{trigger:'item',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, series:[{type:'pie',radius:['30%','60%'],center:['50%','55%'], itemStyle:{borderRadius:6,borderColor:isDark()?'#1e293b':'#fff',borderWidth:3}, label:{color:textColor(),fontSize:11,formatter:'{b}\n{c}' + (en ? '0K' : '万人')}, data:[{value:85,name:t('chart.talent.us'),itemStyle:{color:COLORS.blue}},{value:60,name:t('chart.talent.cn'),itemStyle:{color:COLORS.coral}},{value:35,name:t('chart.talent.eu'),itemStyle:{color:COLORS.green}},{value:20,name:t('chart.talent.other'),itemStyle:{color:COLORS.gold}}] }] }); }
    
    const gr = getChart('chart-global-radar-demo');
    if (gr) { gr.setOption({ tooltip:{backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, legend:{data:[t('chart.us.us'),t('chart.us.china'),t('chart.global.radar.eu')],textStyle:{color:textColor(),fontSize:11},bottom:-5}, radar:{indicator:[{name:t('chart.global.radar.basic'),max:100},{name:t('chart.global.radar.app'),max:100},{name:t('chart.global.radar.invest'),max:100},{name:t('chart.global.radar.talent'),max:100},{name:t('chart.global.radar.policy'),max:100},{name:t('chart.global.radar.compute'),max:100}], shape:'polygon',radius:'65%',axisName:{color:textColor(),fontSize:11}, splitArea:{areaStyle:{color:'transparent'}}, splitLine:{lineStyle:{color:gridColor()}},axisLine:{lineStyle:{color:gridColor()}} }, series:[{type:'radar',data:[{value:[95,80,95,90,70,95],name:t('chart.us.us'),lineStyle:{color:COLORS.blue,width:2},itemStyle:{color:COLORS.blue},areaStyle:{color:'rgba(107,141,214,0.15)'}},{value:[85,95,70,65,90,75],name:t('chart.us.china'),lineStyle:{color:COLORS.coral,width:2},itemStyle:{color:COLORS.coral},areaStyle:{color:'rgba(232,116,97,0.15)'}},{value:[80,65,55,50,85,60],name:t('chart.global.radar.eu'),lineStyle:{color:COLORS.green,width:2},itemStyle:{color:COLORS.green},areaStyle:{color:'rgba(107,175,141,0.15)'}}]}] }); }
}

/* ===== 未来展望图表 ===== */
function initFutureCharts() {
    const en = currentLang === 'en';
    const rm = getChart('chart-roadmap');
    if (rm) { rm.setOption({ tooltip:{trigger:'axis',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, legend:{data:[t('chart.roadmap.scale'),t('chart.roadmap.gdp'),t('chart.roadmap.enterprise')],textStyle:{color:textColor(),fontSize:11},top:0}, grid:{left:'8%',right:'5%',top:'18%',bottom:'12%'}, xAxis:{type:'category',data:['2023','2024','2025','2026','2027','2028','2030'],axisLine:{lineStyle:{color:gridColor()}},axisLabel:{color:textColor(),fontSize:11},axisTick:{show:false}}, yAxis:{type:'value',axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11},splitLine:{lineStyle:{color:gridColor()}}}, series:[{name:t('chart.roadmap.scale'),type:'line',data:[58,90,120,150,200,260,380],smooth:true,symbol:'circle',symbolSize:8, lineStyle:{color:COLORS.purple,width:3},itemStyle:{color:COLORS.purple}, areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(155,126,216,0.2)'},{offset:1,color:'rgba(155,126,216,0)'}])}},{name:t('chart.roadmap.gdp'),type:'line',data:[1.5,2.5,3.5,4.5,5.5,7,10],smooth:true,symbol:'diamond',symbolSize:8, lineStyle:{color:COLORS.coral,width:2,type:'dashed'},itemStyle:{color:COLORS.coral}},{name:t('chart.roadmap.enterprise'),type:'line',data:[4.2,5,6,7.5,9,11,15],smooth:true,symbol:'rect',symbolSize:7, lineStyle:{color:COLORS.green,width:2},itemStyle:{color:COLORS.green}}] }); }
    const ev = getChart('chart-evolution');
    if (ev) { ev.setOption({ tooltip:{trigger:'axis',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, legend:{data:[t('chart.evo.perception'),t('chart.evo.reasoning'),t('chart.evo.generation'),t('chart.evo.action')],textStyle:{color:textColor(),fontSize:11},top:0}, grid:{left:'8%',right:'5%',top:'18%',bottom:'12%'}, xAxis:{type:'category',boundaryGap:false,data:['2023','2024','2025','2026','2027','2028','2030'],axisLine:{lineStyle:{color:gridColor()}},axisLabel:{color:textColor(),fontSize:11},axisTick:{show:false}}, yAxis:{type:'value',name:en?'Capability Index':'能力指数',nameTextStyle:{color:textColor(),fontSize:11},axisLine:{show:false},axisLabel:{color:textColor(),fontSize:11},splitLine:{lineStyle:{color:gridColor()}}}, series:[{name:t('chart.evo.perception'),type:'line',stack:'total',areaStyle:{color:'rgba(107,141,214,0.3)'},lineStyle:{color:COLORS.blue,width:1},itemStyle:{color:COLORS.blue},data:[60,70,80,85,90,93,98]},{name:t('chart.evo.reasoning'),type:'line',stack:'total',areaStyle:{color:'rgba(232,116,97,0.3)'},lineStyle:{color:COLORS.coral,width:1},itemStyle:{color:COLORS.coral},data:[35,45,55,65,75,85,95]},{name:t('chart.evo.generation'),type:'line',stack:'total',areaStyle:{color:'rgba(212,169,90,0.3)'},lineStyle:{color:COLORS.gold,width:1},itemStyle:{color:COLORS.gold},data:[30,50,65,75,82,88,95]},{name:t('chart.evo.action'),type:'line',stack:'total',areaStyle:{color:'rgba(155,126,216,0.3)'},lineStyle:{color:COLORS.purple,width:1},itemStyle:{color:COLORS.purple},data:[10,18,28,40,55,70,90]}] }); }
    setFutureYear(2025);
}

/* ===== 演示交互函数 ===== */
function updateScaleDemo(year, btn) {
    activateBtn(btn);
    const en = currentLang === 'en';
    const data = {
        2019: { val: 1200, pct: 6, label: en ? '2019' : '2019年', detail: en ? 'AI industry initial stage, scale ¥120B' : 'AI产业起步阶段，规模1200亿元' },
        2021: { val: 2800, pct: 14, label: en ? '2021' : '2021年', detail: en ? 'Post-pandemic acceleration, 55% YoY growth' : '疫情后加速，同比增长55%' },
        2023: { val: 5800, pct: 29, label: en ? '2023' : '2023年', detail: en ? 'Large model boom, GenAI genesis year' : '大模型爆发，生成式AI元年' },
        2025: { val: 12000, pct: 60, label: en ? '2025' : '2025年', detail: en ? 'Core industry exceeds ¥1.2T, 24% YoY growth' : '核心产业规模突破万亿大关，同比增长24%' },
        2027: { val: 20000, pct: 100, label: en ? '2027 (Est.)' : '2027年(预期)', detail: en ? 'Expected to exceed ¥2T, AI fully integrated into economy' : '预计突破2万亿，AI全面融入经济体系' }
    };
    const d = data[year];
    document.getElementById('scaleBar').style.width = d.pct + '%';
    document.getElementById('scaleValue').textContent = (en ? '¥' : '') + d.val.toLocaleString() + (en ? ' (100M RMB)' : '亿元');
    document.querySelector('.scale-year').textContent = d.label;
    document.querySelector('.scale-detail').textContent = d.detail;
    document.getElementById('scale-demo-code').textContent = en ? `${d.label}: ¥${d.val.toLocaleString()} (100M RMB) | ~${(d.val/130000*100).toFixed(1)}% of GDP` : `${d.label}: ${d.val.toLocaleString()}亿元 | 占GDP约${(d.val/130000*100).toFixed(1)}%`;
}
function showEnterpriseType(type, btn) {
    activateBtn(btn);
    const en = currentLang === 'en';
    const c = getChart('enterpriseChart');
    if (!c) return;
    const dataMap = {
        all: [{value:4800,name:t('chart.enterprise.startup')},{value:600,name:t('chart.enterprise.large')},{value:300,name:t('chart.enterprise.listed')},{value:100,name:t('chart.enterprise.unicorn')},{value:200,name:t('chart.enterprise.research')}],
        listed: [{value:300,name:t('chart.enterprise.listed'),itemStyle:{color:COLORS.coral}},{value:5700,name:t('chart.enterprise.other'),itemStyle:{color:'#cbd5e1'}}],
        unicorn: [{value:100,name:t('chart.enterprise.unicorn'),itemStyle:{color:COLORS.gold}},{value:5900,name:t('chart.enterprise.other'),itemStyle:{color:COLORS.blueLight}}],
        startup: [{value:4800,name:en?'Startups':t('chart.enterprise.startupOnly'),itemStyle:{color:COLORS.green}},{value:1200,name:t('chart.enterprise.other'),itemStyle:{color:COLORS.blueLight}}]
    };
    const colors = [COLORS.blueLight,COLORS.blue,COLORS.coral,COLORS.gold,COLORS.green];
    c.setOption({ series:[{type:'pie',radius:['35%','65%'],center:['50%','55%'], itemStyle:{borderRadius:6,borderColor:isDark()?'#1e293b':'#fff',borderWidth:3}, label:{color:textColor(),fontSize:11,formatter:'{b}\n{d}%'}, data:(dataMap[type]||dataMap.all).map((item,i) => ({...item, itemStyle:item.itemStyle||{color:colors[i%colors.length]}})) }] });
}
function updateEffCalc(val) {
    val = parseInt(val);
    const en = currentLang === 'en';
    document.getElementById('effRangeVal').textContent = en ? (val * 10000).toLocaleString() + ' units' : val + '万件';
    const tradHours = val * 2000;
    const aiHours = Math.round(val * 2000 / 24);
    document.getElementById('effTraditional').textContent = tradHours.toLocaleString() + (en ? ' hrs' : ' 小时');
    document.getElementById('effAI').textContent = aiHours.toLocaleString() + (en ? ' hrs' : ' 小时');
    document.getElementById('effBoost').textContent = en ? '24x' : '24倍';
    document.getElementById('eff-demo-code').textContent = en
        ? `Annual ${(val*10000).toLocaleString()} tasks: Traditional ${tradHours.toLocaleString()} hrs, AI ${aiHours.toLocaleString()} hrs, 24x improvement`
        : `年处理${val}万件任务：传统需${tradHours.toLocaleString()}小时，AI仅需${aiHours.toLocaleString()}小时，效率提升24倍`;
}
function setFutureYear(year, btn) {
    if (btn) activateBtn(btn);
    const en = currentLang === 'en';
    const data = { 2023: {感知:60,推理:35,生成:30,行动:10}, 2025: {感知:80,推理:55,生成:65,行动:28}, 2027: {感知:90,推理:75,生成:82,行动:55}, 2030: {感知:98,推理:95,生成:95,行动:90} };
    const d = data[year] || data[2025];
    const c = getChart('chart-future-demo');
    if (c) { c.setOption({ tooltip:{trigger:'item',backgroundColor:tooltipBg(),borderColor:tooltipBorder(),textStyle:{color:tooltipTextColor(),fontSize:12}}, radar:{indicator:[{name:t('chart.evo.perception'),max:100},{name:t('chart.evo.reasoning'),max:100},{name:t('chart.evo.generation'),max:100},{name:t('chart.evo.action'),max:100}], shape:'polygon',radius:'65%',axisName:{color:textColor(),fontSize:12}, splitArea:{areaStyle:{color:'transparent'}}, splitLine:{lineStyle:{color:gridColor()}},axisLine:{lineStyle:{color:gridColor()}} }, series:[{type:'radar',data:[{value:[d.感知,d.推理,d.生成,d.行动],name:year+(en?'':'年'), lineStyle:{color:COLORS.purple,width:3},itemStyle:{color:COLORS.purple}, areaStyle:{color:'rgba(155,126,216,0.3)'}}]}] }); }
    document.getElementById('future-demo-code').textContent = en
        ? `${year}: Perception ${d.感知} | Reasoning ${d.推理} | Generation ${d.生成} | Action ${d.行动}`
        : `${year}年：感知理解 ${d.感知}分 | 推理决策 ${d.推理}分 | 生成创造 ${d.生成}分 | 自主行动 ${d.行动}分`;
}

/* ========== 窗口resize处理 ========== */
window.addEventListener('resize', () => {
    document.querySelectorAll('.echart-box').forEach(el => {
        const chart = echarts.getInstanceByDom(el);
        if (chart) chart.resize();
    });
    if (radarChartInstance) radarChartInstance.resize();
});