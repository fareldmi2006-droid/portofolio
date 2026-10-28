// All copy lives here, in English and Indonesian. Only verified facts — no invented results.

export type Lang = 'en' | 'id';

export const CONTACT = {
  email: 'fareldmi2006@gmail.com',
  linkedin: 'https://www.linkedin.com/in/farrell-fathurrahman-2132a43ab/',
  github: 'https://github.com/fareldmi2006-droid',
};

type Card = { index: string; kicker: string; title: string; sub: string; backTitle: string; points: string[] };
type Skill = { name: string; level: string; tone: 'main' | 'strong' | 'grow'; items: string[]; key: string[] };
type Project = { tag: string; tagWip?: boolean; title: string; desc: string; points: string[]; stack: string[] };

export type Copy = {
  nav: { profile: string; skills: string; work: string; contact: string };
  status: string;
  eyebrow: string;
  role: string;
  rolePrefix: string;
  roleWords: string[];
  badge: string;
  lede: string;
  ctaWork: string;
  ctaCopy: string;
  copied: string;
  copyFallback: string;
  photoCaption: string;
  meta: { label: string; value: string }[];
  profile: { label: string; title: string; intro: string; hint: string; turn: string; back: string; cards: Card[] };
  marquee: string[];
  cursor: { top: string; go: string; toEn: string; toId: string; work: string; copy: string; linkedin: string; github: string; turn: string; back: string; cert: string; close: string; rail: string; toLight: string; toDark: string };
  skills: { label: string; title: string; intro: string; groups: Skill[] };
  work: { label: string; title: string; projects: Project[]; illustrative: string; visual: { ftth: string; roles: string; vars: string; mine: string; map: string } };
  certs: { label: string; title: string; view: string; close: string; items: { seal: string; name: string; issuer: string; desc: string; status: string; date?: string; pending?: boolean; image?: 'ccna' }[] };
  beyond: { label: string; title: string; items: { label: string; title: string; desc: string }[] };
  contact: { label: string; title1: string; title2: string; body: string; email: string; copy: string; open: string };
  footer: string;
};

const en: Copy = {
  nav: { profile: 'Profile', skills: 'Skills', work: 'Work', contact: 'Contact' },
  status: 'Open to on-site internships · Jakarta · Singapore · Malaysia',
  eyebrow: 'Informatics Engineering · Politeknik Caltex Riau',
  role: 'Aspiring software engineer working across the web, data, maps and networks.',
  rolePrefix: 'Aspiring software engineer working across',
  roleWords: ['the web.', 'data.', 'maps.', 'networks.'],
  badge: 'SOFTWARE · DATA · GIS · NETWORKS · ',
  lede:
    "I'm a fifth-semester student on the Software Engineering track. I build web applications with React and PHP, analyse data, map it with GIS, and I'm a MikroTik-certified network associate who is at home on a Linux server.",
  ctaWork: 'View my work',
  ctaCopy: 'Copy email',
  copied: 'Email copied',
  copyFallback: 'Email selected. Press Ctrl+C to copy.',
  photoCaption: 'Farrell Fathurrahman · Pekanbaru',
  meta: [
    { label: 'Based in', value: 'Pekanbaru, Indonesia' },
    { label: 'Studying', value: 'Semester 5, Informatics' },
    { label: 'Certified', value: 'MTCNA · CCNA ITN' },
  ],
  profile: {
    label: 'Profile',
    title: 'Three folders, one profile.',
    intro: 'Each folder holds one side of how I work. Point at a folder to pull it up, click it to open and read what is inside.',
    hint: 'Click a folder to open it',
    turn: 'Open',
    back: 'Close',
    cards: [
      {
        index: 'B',
        kicker: 'Software & web',
        title: 'Build',
        sub: 'Web applications from the interface to the database.',
        backTitle: 'What I build',
        points: [
          'React is my main focus for front-end work',
          'PHP back ends on a hand-built MVC structure with PDO',
          'A role-based marketplace for admins, sellers and buyers',
          "Final project: a web system to monitor an ISP's fiber network",
        ],
      },
      {
        index: 'A',
        kicker: 'Data, AI & GIS',
        title: 'Analyse & Map',
        sub: 'Turning raw data into numbers and maps people can read.',
        backTitle: 'What I analyse',
        points: [
          'Descriptive statistics on a real e-commerce dataset',
          'Web maps with OpenLayers and GeoJSON layers',
          'Machine learning foundations, still growing',
          'Preparing for AWS Certified AI Practitioner',
        ],
      },
      {
        index: 'C',
        kicker: 'Networks & people',
        title: 'Connect',
        sub: 'Keeping systems online and explaining them clearly.',
        backTitle: 'How I connect',
        points: [
          'MikroTik Certified Network Associate (MTCNA)',
          'Cisco CCNA: Introduction to Networks, completed',
          'Ubuntu / Linux server administration',
          'Confident on stage: MC, talk show, student advocacy',
        ],
      },
    ],
  },
  skills: {
    label: 'Skills',
    title: 'What I work with.',
    intro: 'The marker on each row is my honest level today.',
    groups: [
      { name: 'Software & Web', level: 'Main focus', tone: 'main', key: ['React', 'PHP'], items: ['React', 'JavaScript', 'PHP', 'MVC architecture', 'PDO', 'SQL', 'HTML & CSS'] },
      { name: 'Networks & Systems', level: 'Strong · certified', tone: 'strong', key: ['MikroTik RouterOS', 'Ubuntu / Linux'], items: ['MikroTik RouterOS', 'Cisco networking', 'Ubuntu / Linux', 'Network administration', 'FTTH infrastructure'] },
      { name: 'GIS & Mapping', level: 'Practicum', tone: 'grow', key: ['OpenLayers'], items: ['OpenLayers', 'GeoJSON', 'Web mapping'] },
      { name: 'Data & AI', level: 'Growing', tone: 'grow', key: [], items: ['Descriptive statistics', 'Data auditing', 'Machine learning'] },
    ],
  },
  work: {
    label: 'Selected work',
    title: "Things I've built, analysed and mapped.",
    illustrative: 'Illustrative values',
    visual: { ftth: 'What it watches', roles: 'Who can do what', vars: 'Variables studied', mine: 'My part of the analysis', map: 'GeoJSON layers on a web map' },
    projects: [
      {
        tag: 'Final project · in progress',
        tagWip: true,
        title: 'FTTH Network Monitoring System for ISP Soluxio',
        desc: "A web-based system that gives an internet provider's network operations centre (NOC) one place to monitor its fiber-to-the-home infrastructure.",
        points: [
          'Gathering requirements directly from the NOC team through interviews',
          'Defining functional and non-functional requirements and module design',
          'Prototyping, so the NOC team can react to working screens early',
        ],
        stack: ['Systems analysis', 'Prototyping', 'Web'],
      },
      {
        tag: 'Web application',
        title: 'Swag: multi-role e-commerce platform',
        desc: 'A marketplace where admins, sellers and buyers each get their own workspace, built on a hand-rolled MVC structure.',
        points: [
          'Session-based authorization so every route opens only for the right role',
          'Sellers manage products, stores and incoming orders with full CRUD',
          'Buyers browse, fill a cart, check out and track their orders',
        ],
        stack: ['PHP', 'MVC', 'PDO', 'SQL'],
      },
      {
        tag: 'Data analysis · team of 3',
        title: 'Olist e-commerce: descriptive statistics',
        desc: "A statistical study of Olist's public Brazilian e-commerce dataset (Kaggle): how price, shipping and delivery relate to customer satisfaction.",
        points: [
          'Audited the raw data for missing values and inconsistencies',
          'Built summary tables of central tendency and spread',
          'Analysed price, freight cost and delivery time, then defended the method to the lecturer',
        ],
        stack: ['Statistics', 'Data auditing', 'Kaggle'],
      },
      {
        tag: 'GIS practicum',
        title: 'Interactive web maps with OpenLayers',
        desc: 'Module work from the GIS practicum (Bengkel Sistem Informasi Geografis): building web maps that load and display spatial data in the browser.',
        points: [
          'Loading GeoJSON features as map layers in OpenLayers',
          'Styling points, lines and polygons so the data reads clearly',
          'Publishing the maps on the web and documenting each module in a lab report',
        ],
        stack: ['OpenLayers', 'GeoJSON', 'JavaScript'],
      },
    ],
  },
  certs: {
    label: 'Certifications',
    title: 'Verified by the vendors.',
    view: 'View certificate',
    close: 'Close',
    items: [
      { seal: 'MTCNA', name: 'MikroTik Certified Network Associate', issuer: 'MikroTik', desc: 'Routing, bridging, firewall and network management on MikroTik RouterOS.', status: 'Certified' },
      { seal: 'CCNA', name: 'CCNA: Introduction to Networks', issuer: 'Cisco Networking Academy · Politeknik Caltex Riau', desc: 'Network fundamentals: IP addressing, Ethernet, switching and routing basics, and building small networks.', status: 'Completed', date: '17 Nov 2025', image: 'ccna' },
      { seal: 'AWS', name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', desc: 'Foundations of AI, machine learning and generative AI on Amazon Web Services.', status: 'In preparation', pending: true },
    ],
  },
  beyond: {
    label: 'Beyond code',
    title: 'I can hold a room.',
    items: [
      { label: 'Hosting', title: 'Master of ceremonies', desc: 'MC for campus events, keeping the programme on time and the audience with it.' },
      { label: 'Speaking', title: 'Talk show guest', desc: 'Took part in a campus talk show, speaking live in front of an audience.' },
      { label: 'Organisation', title: 'Student advocacy, one year', desc: 'Member of the Advokesma department, handling student welfare concerns.' },
    ],
  },
  contact: {
    label: 'Contact',
    title1: 'Have an internship opening?',
    title2: "Let's talk.",
    body: 'I want to be on-site, working alongside your team day to day as a real member of it. Open to internships in Jakarta, Singapore or Malaysia.',
    email: 'Email',
    copy: 'Copy email',
    open: 'Open profile',
  },
  footer: 'Built with React, TypeScript and Remotion',
  marquee: ['Software engineering', 'Web development', 'Data & AI', 'GIS mapping', 'Networks'],
  cursor: { top: 'Back to top', go: 'Go to', toEn: 'Switch to English', toId: 'Switch to Indonesian', work: 'See my projects', copy: 'Copy my email address', linkedin: 'Open my LinkedIn', github: 'Open my GitHub', turn: 'Open this folder', back: 'Close this folder', cert: 'View the certificate', close: 'Close the viewer', rail: 'Jump to', toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
};

const id: Copy = {
  nav: { profile: 'Profil', skills: 'Keahlian', work: 'Proyek', contact: 'Kontak' },
  status: 'Terbuka untuk magang on-site · Jakarta · Singapura · Malaysia',
  eyebrow: 'Teknik Informatika · Politeknik Caltex Riau',
  role: 'Calon software engineer yang bekerja di web, data, peta, dan jaringan.',
  rolePrefix: 'Calon software engineer yang bekerja di',
  roleWords: ['web.', 'data.', 'peta.', 'jaringan.'],
  badge: 'SOFTWARE · DATA · GIS · JARINGAN · ',
  lede:
    'Saya mahasiswa semester lima di jalur Software Engineering. Saya membangun aplikasi web dengan React dan PHP, menganalisis data, memetakannya dengan GIS, dan saya network associate bersertifikat MikroTik yang terbiasa mengelola server Linux.',
  ctaWork: 'Lihat proyek saya',
  ctaCopy: 'Salin email',
  copied: 'Email disalin',
  copyFallback: 'Email sudah dipilih. Tekan Ctrl+C untuk menyalin.',
  photoCaption: 'Farrell Fathurrahman · Pekanbaru',
  meta: [
    { label: 'Domisili', value: 'Pekanbaru, Indonesia' },
    { label: 'Studi', value: 'Semester 5, Informatika' },
    { label: 'Sertifikasi', value: 'MTCNA · CCNA ITN' },
  ],
  profile: {
    label: 'Profil',
    title: 'Tiga map, satu profil.',
    intro: 'Tiap map berisi satu sisi cara saya bekerja. Arahkan kursor untuk menarik map ke atas, klik untuk membuka dan membaca isinya.',
    hint: 'Klik map untuk membukanya',
    turn: 'Buka',
    back: 'Tutup',
    cards: [
      {
        index: 'B',
        kicker: 'Software & web',
        title: 'Build',
        sub: 'Aplikasi web dari antarmuka sampai database.',
        backTitle: 'Yang saya bangun',
        points: [
          'React menjadi fokus utama saya untuk front end',
          'Back end PHP dengan struktur MVC buatan sendiri dan PDO',
          'Marketplace berbasis peran untuk admin, penjual, dan pembeli',
          'Proyek akhir: sistem web untuk memantau jaringan fiber ISP',
        ],
      },
      {
        index: 'A',
        kicker: 'Data, AI & GIS',
        title: 'Analyse & Map',
        sub: 'Mengubah data mentah menjadi angka dan peta yang mudah dibaca.',
        backTitle: 'Yang saya analisis',
        points: [
          'Statistik deskriptif pada dataset e-commerce nyata',
          'Peta web dengan OpenLayers dan layer GeoJSON',
          'Dasar machine learning, masih terus berkembang',
          'Sedang bersiap untuk AWS Certified AI Practitioner',
        ],
      },
      {
        index: 'C',
        kicker: 'Jaringan & orang',
        title: 'Connect',
        sub: 'Menjaga sistem tetap online dan menjelaskannya dengan jelas.',
        backTitle: 'Cara saya terhubung',
        points: [
          'MikroTik Certified Network Associate (MTCNA)',
          'Cisco CCNA: Introduction to Networks, selesai',
          'Administrasi server Ubuntu / Linux',
          'Percaya diri di panggung: MC, talk show, advokasi mahasiswa',
        ],
      },
    ],
  },
  skills: {
    label: 'Keahlian',
    title: 'Yang saya kuasai.',
    intro: 'Penanda di tiap baris adalah level saya saat ini, apa adanya.',
    groups: [
      { name: 'Software & Web', level: 'Fokus utama', tone: 'main', key: ['React', 'PHP'], items: ['React', 'JavaScript', 'PHP', 'Arsitektur MVC', 'PDO', 'SQL', 'HTML & CSS'] },
      { name: 'Jaringan & Sistem', level: 'Kuat · bersertifikat', tone: 'strong', key: ['MikroTik RouterOS', 'Ubuntu / Linux'], items: ['MikroTik RouterOS', 'Jaringan Cisco', 'Ubuntu / Linux', 'Administrasi jaringan', 'Infrastruktur FTTH'] },
      { name: 'GIS & Pemetaan', level: 'Praktikum', tone: 'grow', key: ['OpenLayers'], items: ['OpenLayers', 'GeoJSON', 'Peta web'] },
      { name: 'Data & AI', level: 'Berkembang', tone: 'grow', key: [], items: ['Statistik deskriptif', 'Audit data', 'Machine learning'] },
    ],
  },
  work: {
    label: 'Proyek pilihan',
    title: 'Yang sudah saya bangun, analisis, dan petakan.',
    illustrative: 'Nilai ilustrasi',
    visual: { ftth: 'Yang dipantau', roles: 'Hak akses tiap peran', vars: 'Variabel yang diteliti', mine: 'Bagian analisis saya', map: 'Layer GeoJSON di peta web' },
    projects: [
      {
        tag: 'Proyek akhir · berjalan',
        tagWip: true,
        title: 'Sistem Monitoring Jaringan FTTH untuk ISP Soluxio',
        desc: 'Sistem berbasis web yang memberi tim network operations centre (NOC) sebuah ISP satu tempat untuk memantau infrastruktur fiber-to-the-home.',
        points: [
          'Menggali kebutuhan langsung dari tim NOC melalui wawancara',
          'Menyusun kebutuhan fungsional, non-fungsional, dan rancangan modul',
          'Metode prototyping agar tim NOC bisa menanggapi layar yang berjalan sejak awal',
        ],
        stack: ['Analisis sistem', 'Prototyping', 'Web'],
      },
      {
        tag: 'Aplikasi web',
        title: 'Swag: platform e-commerce multi-peran',
        desc: 'Marketplace dengan ruang kerja terpisah untuk admin, penjual, dan pembeli, dibangun dengan struktur MVC buatan sendiri.',
        points: [
          'Otorisasi berbasis session sehingga tiap route hanya terbuka untuk peran yang tepat',
          'Penjual mengelola produk, toko, dan pesanan masuk dengan CRUD lengkap',
          'Pembeli menjelajah produk, mengisi keranjang, checkout, dan melacak pesanan',
        ],
        stack: ['PHP', 'MVC', 'PDO', 'SQL'],
      },
      {
        tag: 'Analisis data · tim 3 orang',
        title: 'E-commerce Olist: statistik deskriptif',
        desc: 'Studi statistik pada dataset publik e-commerce Brasil dari Olist (Kaggle): hubungan harga, ongkos kirim, dan waktu pengiriman dengan kepuasan pelanggan.',
        points: [
          'Mengaudit data mentah untuk nilai kosong dan inkonsistensi',
          'Menyusun tabel ringkasan ukuran pemusatan dan penyebaran',
          'Menganalisis harga, ongkir, dan waktu pengiriman, lalu mempertahankan metodenya di depan dosen',
        ],
        stack: ['Statistika', 'Audit data', 'Kaggle'],
      },
      {
        tag: 'Praktikum GIS',
        title: 'Peta web interaktif dengan OpenLayers',
        desc: 'Tugas modul dari praktikum Bengkel Sistem Informasi Geografis: membangun peta web yang memuat dan menampilkan data spasial di browser.',
        points: [
          'Memuat fitur GeoJSON sebagai layer peta di OpenLayers',
          'Mengatur gaya titik, garis, dan poligon agar datanya mudah dibaca',
          'Mempublikasikan peta ke web dan mendokumentasikan tiap modul dalam laporan praktikum',
        ],
        stack: ['OpenLayers', 'GeoJSON', 'JavaScript'],
      },
    ],
  },
  certs: {
    label: 'Sertifikasi',
    title: 'Diverifikasi langsung oleh vendor.',
    view: 'Lihat sertifikat',
    close: 'Tutup',
    items: [
      { seal: 'MTCNA', name: 'MikroTik Certified Network Associate', issuer: 'MikroTik', desc: 'Routing, bridging, firewall, dan manajemen jaringan di MikroTik RouterOS.', status: 'Bersertifikat' },
      { seal: 'CCNA', name: 'CCNA: Introduction to Networks', issuer: 'Cisco Networking Academy · Politeknik Caltex Riau', desc: 'Dasar jaringan: pengalamatan IP, Ethernet, dasar switching dan routing, serta membangun jaringan kecil.', status: 'Selesai', date: '17 Nov 2025', image: 'ccna' },
      { seal: 'AWS', name: 'AWS Certified AI Practitioner', issuer: 'Amazon Web Services', desc: 'Dasar AI, machine learning, dan generative AI di Amazon Web Services.', status: 'Sedang dipersiapkan', pending: true },
    ],
  },
  beyond: {
    label: 'Di luar kode',
    title: 'Saya terbiasa berbicara di depan banyak orang.',
    items: [
      { label: 'Pembawa acara', title: 'Master of ceremonies', desc: 'MC di acara kampus, menjaga acara tepat waktu dan audiens tetap terlibat.' },
      { label: 'Berbicara', title: 'Bintang tamu talk show', desc: 'Ikut serta dalam talk show kampus, berbicara langsung di depan audiens.' },
      { label: 'Organisasi', title: 'Advokasi mahasiswa, satu tahun', desc: 'Anggota departemen Advokesma yang menangani isu kesejahteraan mahasiswa.' },
    ],
  },
  contact: {
    label: 'Kontak',
    title1: 'Ada lowongan magang?',
    title2: 'Mari bicara.',
    body: 'Saya ingin hadir langsung di kantor dan bekerja bersama tim Anda setiap hari sebagai anggota yang sesungguhnya. Terbuka untuk magang di Jakarta, Singapura, atau Malaysia.',
    email: 'Email',
    copy: 'Salin email',
    open: 'Buka profil',
  },
  footer: 'Dibuat dengan React, TypeScript, dan Remotion',
  marquee: ['Rekayasa perangkat lunak', 'Pengembangan web', 'Data & AI', 'Pemetaan GIS', 'Jaringan'],
  cursor: { top: 'Kembali ke atas', go: 'Ke bagian', toEn: 'Ganti ke bahasa Inggris', toId: 'Ganti ke bahasa Indonesia', work: 'Lihat proyek saya', copy: 'Salin alamat email saya', linkedin: 'Buka LinkedIn saya', github: 'Buka GitHub saya', turn: 'Buka map ini', back: 'Tutup map ini', cert: 'Lihat sertifikat', close: 'Tutup tampilan', rail: 'Lompat ke', toLight: 'Ganti ke mode terang', toDark: 'Ganti ke mode gelap' },
};

export const COPY: Record<Lang, Copy> = { en, id };
