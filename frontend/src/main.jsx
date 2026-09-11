import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MapPin,
  Menu,
  Plus,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
  ImagePlus,
  Upload,
  Camera,
  MessageCircle,
  Phone,
} from "lucide-react";
import "./style.css";
import "./accent.css";
import "./polish.css";
import "./manager.css";
const API = "/api/vehicles",
  brands = [
    "Audi",
    "BMW",
    "Citroën",
    "Cupra",
    "Fiat",
    "Ford",
    "Honda",
    "Kia",
    "Mercedes-Benz",
    "Nissan",
    "Peugeot",
    "Renault",
    "SEAT",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];
// Selección inicial para tasaciones: se puede ampliar o sustituir por un
// proveedor profesional de datos sin cambiar el flujo del formulario.
const SELL_VEHICLE_CATALOG = {
  Audi: {
    A1: ["25 TFSI 95 CV", "30 TFSI 110 CV", "35 TFSI 150 CV"],
    A3: ["30 TFSI 110 CV", "35 TFSI 150 CV", "35 TDI 150 CV"],
    Q3: ["35 TFSI 150 CV", "35 TDI 150 CV", "45 TFSI e 245 CV"],
    A4: ["35 TFSI 150 CV", "40 TDI 204 CV", "40 TFSI 204 CV"],
    A6: ["35 TDI 163 CV", "40 TDI 204 CV", "45 TFSI 245 CV"],
    Q5: ["35 TDI 163 CV", "40 TDI 204 CV", "50 TFSI e 299 CV"],
  },
  "Alfa Romeo": {
    Giulietta: ["1.4 TB 120 CV", "1.4 MultiAir 170 CV", "2.0 JTDm 150 CV"],
    Giulia: ["2.0 Turbo 200 CV", "2.2 Diésel 160 CV", "2.2 Diésel 190 CV"],
    Stelvio: ["2.0 Turbo 200 CV", "2.2 Diésel 190 CV", "2.2 Diésel 210 CV"],
    Tonale: ["1.5 Hybrid 130 CV", "1.5 Hybrid 160 CV", "PHEV Q4 280 CV"],
    MiTo: ["1.4 78 CV", "0.9 TwinAir 105 CV", "1.3 JTDm 95 CV"],
  },
  BMW: {
    "Serie 1": ["118i 136 CV", "120i 178 CV", "118d 150 CV"],
    "Serie 3": ["318d 150 CV", "320d 190 CV", "330e 292 CV"],
    X1: ["sDrive18i 136 CV", "sDrive18d 150 CV", "xDrive25e 245 CV"],
    X3: ["xDrive20d 190 CV", "xDrive20i 184 CV", "xDrive30e 292 CV"],
    X5: ["xDrive30d 286 CV", "xDrive40i 381 CV", "xDrive50e 489 CV"],
    "Serie 5": ["520d 190 CV", "520i 208 CV", "530e 299 CV"],
  },
  Citroën: {
    C3: ["1.2 PureTech 83 CV", "1.2 PureTech 110 CV", "ë-C3 113 CV"],
    C4: ["1.2 PureTech 130 CV", "1.5 BlueHDi 130 CV", "ë-C4 156 CV"],
    "C5 Aircross": ["1.2 PureTech 130 CV", "1.5 BlueHDi 130 CV", "Hybrid 225 CV"],
    "C3 Aircross": ["1.2 PureTech 100 CV", "1.2 PureTech 130 CV", "1.5 BlueHDi 110 CV"],
    Berlingo: ["1.2 PureTech 110 CV", "1.5 BlueHDi 100 CV", "ë-Berlingo 136 CV"],
  },
  Cupra: {
    Formentor: ["1.5 TSI 150 CV", "2.0 TSI 190 CV", "e-Hybrid 245 CV"],
    León: ["1.5 TSI 150 CV", "2.0 TSI 300 CV", "e-Hybrid 245 CV"],
    Ateca: ["2.0 TSI 190 CV", "2.0 TSI 300 CV", "2.0 TDI 150 CV"],
    Born: ["150 kW 204 CV", "170 kW 231 CV", "VZ 240 kW 326 CV"],
    Terramar: ["1.5 eTSI 150 CV", "2.0 TSI 204 CV", "e-Hybrid 272 CV"],
  },
  DS: {
    "DS 3": ["PureTech 100 CV", "PureTech 130 CV", "E-Tense 156 CV"],
    "DS 4": ["PureTech 130 CV", "BlueHDi 130 CV", "E-Tense 225 CV"],
    "DS 7": ["BlueHDi 130 CV", "BlueHDi 180 CV", "E-Tense 225 CV"],
    "DS 9": ["PureTech 225 CV", "E-Tense 250 CV", "E-Tense 360 CV"],
    "DS 3 Crossback": ["PureTech 130 CV", "BlueHDi 130 CV", "E-Tense 156 CV"],
  },
  Dacia: {
    Sandero: ["TCe 90 CV", "ECO-G 100 CV", "TCe 110 CV"],
    Duster: ["TCe 90 CV", "ECO-G 100 CV", "Hybrid 140 CV"],
    Jogger: ["TCe 110 CV", "ECO-G 100 CV", "Hybrid 140 CV"],
    Spring: ["Electric 45 CV", "Electric 65 CV", "Extreme 65 CV"],
    Logan: ["TCe 90 CV", "ECO-G 100 CV", "1.5 Blue dCi 95 CV"],
  },
  Ford: {
    Fiesta: ["1.1 Ti-VCT 75 CV", "1.0 EcoBoost 100 CV", "1.0 EcoBoost 125 CV"],
    Focus: ["1.0 EcoBoost 125 CV", "1.5 EcoBlue 120 CV", "1.5 EcoBoost 150 CV"],
    Kuga: ["1.5 EcoBoost 150 CV", "2.0 EcoBlue 150 CV", "PHEV 243 CV"],
    Puma: ["1.0 EcoBoost 125 CV", "1.0 mHEV 155 CV", "ST 170 CV"],
    Mondeo: ["1.5 EcoBoost 165 CV", "2.0 EcoBlue 150 CV", "2.0 Hybrid 187 CV"],
  },
  Fiat: {
    "500": ["1.0 Hybrid 70 CV", "1.2 69 CV", "Eléctrico 95 CV"],
    Tipo: ["1.0 100 CV", "1.5 Hybrid 130 CV", "1.6 Multijet 130 CV"],
    "500X": ["1.0 FireFly 120 CV", "1.3 FireFly 150 CV", "1.6 Multijet 130 CV"],
    Panda: ["1.0 Hybrid 70 CV", "1.2 69 CV", "Cross Hybrid 70 CV"],
    Doblò: ["1.2 PureTech 110 CV", "1.5 BlueHDi 100 CV", "E-Doblò 136 CV"],
  },
  Hyundai: {
    i20: ["1.0 T-GDi 100 CV", "1.0 T-GDi 120 CV", "1.6 T-GDi 204 CV"],
    Tucson: ["1.6 T-GDi 150 CV", "1.6 CRDi 136 CV", "1.6 T-GDi HEV 230 CV"],
    Kona: ["1.0 T-GDi 120 CV", "1.6 HEV 141 CV", "Eléctrico 204 CV"],
    i30: ["1.0 T-GDi 120 CV", "1.5 T-GDi 160 CV", "N 280 CV"],
    Bayon: ["1.2 MPI 84 CV", "1.0 T-GDi 100 CV", "1.0 T-GDi 120 CV"],
  },
  Honda: {
    Civic: ["1.0 VTEC Turbo 126 CV", "1.5 VTEC Turbo 182 CV", "e:HEV 184 CV"],
    HRV: ["1.5 i-VTEC 130 CV", "e:HEV 131 CV", "1.6 i-DTEC 120 CV"],
    CRV: ["1.5 VTEC Turbo 173 CV", "2.0 i-MMD 184 CV", "2.0 i-MMD 4x4 184 CV"],
    Jazz: ["1.3 i-VTEC 102 CV", "e:HEV 109 CV", "Crosstar e:HEV 109 CV"],
    "ZR-V": ["e:HEV 184 CV", "2.0 i-MMD 184 CV", "Advance e:HEV 184 CV"],
  },
  Jeep: {
    Renegade: ["1.0 T3 120 CV", "1.3 T4 150 CV", "4xe 190 CV"],
    Compass: ["1.3 T4 130 CV", "1.6 Multijet 130 CV", "4xe 190 CV"],
    Avenger: ["1.2 100 CV", "e-Hybrid 100 CV", "Eléctrico 156 CV"],
    Wrangler: ["2.0 Turbo 272 CV", "2.2 CRD 200 CV", "4xe 380 CV"],
    "Grand Cherokee": ["3.0 CRD 190 CV", "3.0 CRD 250 CV", "4xe 380 CV"],
  },
  Kia: {
    Ceed: ["1.0 T-GDi 100 CV", "1.5 T-GDi 160 CV", "1.6 CRDi 136 CV"],
    Sportage: ["1.6 T-GDi 150 CV", "1.6 CRDi 136 CV", "1.6 HEV 230 CV"],
    Niro: ["HEV 141 CV", "PHEV 183 CV", "Eléctrico 204 CV"],
    Picanto: ["1.0 DPI 67 CV", "1.2 DPI 84 CV", "GT Line 84 CV"],
    Stonic: ["1.0 T-GDi 100 CV", "1.0 T-GDi 120 CV", "1.6 CRDi 110 CV"],
  },
  Lexus: {
    UX: ["250h 184 CV", "300e 204 CV", "250h 2WD 184 CV"],
    NX: ["350h 244 CV", "450h+ 309 CV", "300h 197 CV"],
    "LBX": ["Hybrid 136 CV", "Relax Hybrid 136 CV", "Cool Hybrid 136 CV"],
    IS: ["300h 223 CV", "300 245 CV", "F 477 CV"],
    RX: ["350h 245 CV", "450h+ 309 CV", "500h 371 CV"],
  },
  Mazda: {
    Mazda2: ["1.5 Skyactiv-G 90 CV", "1.5 Skyactiv-G 115 CV", "Hybrid 116 CV"],
    Mazda3: ["2.0 e-Skyactiv G 122 CV", "2.0 e-Skyactiv X 186 CV", "2.0 Skyactiv-G 150 CV"],
    "CX-5": ["2.0 Skyactiv-G 165 CV", "2.2 Skyactiv-D 150 CV", "2.2 Skyactiv-D 184 CV"],
    "CX-30": ["2.0 e-Skyactiv G 122 CV", "2.0 e-Skyactiv X 186 CV", "2.0 e-Skyactiv G 150 CV"],
    "MX-5": ["1.5 Skyactiv-G 132 CV", "2.0 Skyactiv-G 184 CV", "RF 2.0 184 CV"],
  },
  MG: {
    ZS: ["1.5 VTI-tech 106 CV", "1.0 T-GDi 111 CV", "EV 156 CV"],
    HS: ["1.5 T-GDi 162 CV", "PHEV 258 CV", "PHEV 339 CV"],
    MG4: ["Standard 170 CV", "Luxury 204 CV", "XPower 435 CV"],
    MG5: ["Standard 177 CV", "Luxury 156 CV", "Long Range 156 CV"],
    "Marvel R": ["RWD 179 CV", "Luxury 179 CV", "Performance 288 CV"],
  },
  MINI: {
    Cooper: ["One 102 CV", "Cooper 136 CV", "Cooper S 178 CV"],
    Countryman: ["Cooper 136 CV", "Cooper S 178 CV", "Cooper D 150 CV"],
    "Aceman": ["E 184 CV", "SE 218 CV", "John Cooper Works 258 CV"],
    Clubman: ["One 102 CV", "Cooper 136 CV", "Cooper D 150 CV"],
    Cabrio: ["Cooper 136 CV", "Cooper S 178 CV", "John Cooper Works 231 CV"],
  },
  "Mercedes-Benz": {
    "Clase A": ["A 180 136 CV", "A 200 163 CV", "A 200 d 150 CV"],
    GLA: ["GLA 180 136 CV", "GLA 200 163 CV", "GLA 200 d 150 CV"],
    GLC: ["GLC 200 204 CV", "GLC 220 d 197 CV", "GLC 300 e 313 CV"],
    "Clase C": ["C 180 170 CV", "C 200 204 CV", "C 220 d 200 CV"],
    "Clase E": ["E 200 204 CV", "E 220 d 197 CV", "E 300 e 313 CV"],
    CLA: ["CLA 180 136 CV", "CLA 200 163 CV", "CLA 200 d 150 CV"],
  },
  Nissan: {
    Micra: ["IG-T 92 CV", "IG-T 100 CV", "0.9 IG-T 90 CV"],
    Qashqai: ["1.3 MHEV 140 CV", "1.3 MHEV 158 CV", "e-POWER 190 CV"],
    Juke: ["1.0 DIG-T 114 CV", "Hybrid 143 CV", "1.6 DIG-T 190 CV"],
    "X-Trail": ["1.5 e-Power 204 CV", "e-4ORCE 213 CV", "1.6 dCi 130 CV"],
    Leaf: ["40 kWh 150 CV", "62 kWh 217 CV", "e+ Tekna 217 CV"],
  },
  Opel: {
    Corsa: ["1.2 75 CV", "1.2 Turbo 100 CV", "Eléctrico 156 CV"],
    Astra: ["1.2 Turbo 130 CV", "1.5 Diésel 130 CV", "Hybrid 180 CV"],
    Mokka: ["1.2 Turbo 130 CV", "1.5 Diésel 110 CV", "Eléctrico 156 CV"],
    Crossland: ["1.2 83 CV", "1.2 Turbo 130 CV", "1.5 Diésel 110 CV"],
    Grandland: ["1.2 Turbo 130 CV", "1.5 Diésel 130 CV", "Hybrid 225 CV"],
  },
  Peugeot: {
    208: ["1.2 PureTech 100 CV", "1.2 PureTech 130 CV", "e-208 156 CV"],
    2008: ["1.2 PureTech 100 CV", "1.2 PureTech 130 CV", "e-2008 156 CV"],
    3008: ["1.2 PureTech 130 CV", "1.5 BlueHDi 130 CV", "Hybrid 225 CV"],
    308: ["1.2 PureTech 130 CV", "1.5 BlueHDi 130 CV", "Hybrid 180 CV"],
    508: ["1.2 PureTech 130 CV", "1.5 BlueHDi 130 CV", "Hybrid 225 CV"],
  },
  Renault: {
    Clio: ["TCe 90 CV", "E-Tech full hybrid 145 CV", "Blue dCi 100 CV"],
    Captur: ["TCe 90 CV", "TCe 140 CV", "E-Tech full hybrid 145 CV"],
    Austral: ["Mild Hybrid 160 CV", "E-Tech full hybrid 200 CV", "E-Tech 4x4 300 CV"],
    Mégane: ["TCe 140 CV", "Blue dCi 115 CV", "E-Tech Eléctrico 220 CV"],
    Arkana: ["TCe 140 CV", "E-Tech full hybrid 145 CV", "E-Tech full hybrid 160 CV"],
  },
  SEAT: {
    Ibiza: ["1.0 MPI 80 CV", "1.0 TSI 95 CV", "1.0 TSI 110 CV"],
    León: ["1.0 TSI 110 CV", "1.5 TSI 150 CV", "2.0 TDI 150 CV"],
    Ateca: ["1.0 TSI 110 CV", "1.5 TSI 150 CV", "2.0 TDI 150 CV"],
    Arona: ["1.0 TSI 95 CV", "1.0 TSI 110 CV", "1.5 TSI 150 CV"],
    Tarraco: ["1.5 TSI 150 CV", "2.0 TDI 150 CV", "2.0 TSI 190 CV"],
  },
  Skoda: {
    Fabia: ["1.0 MPI 80 CV", "1.0 TSI 95 CV", "1.0 TSI 110 CV"],
    Octavia: ["1.5 TSI 150 CV", "2.0 TDI 150 CV", "iV 204 CV"],
    Kamiq: ["1.0 TSI 95 CV", "1.0 TSI 110 CV", "1.5 TSI 150 CV"],
    Superb: ["1.5 TSI 150 CV", "2.0 TDI 150 CV", "iV 218 CV"],
    Karoq: ["1.0 TSI 110 CV", "1.5 TSI 150 CV", "2.0 TDI 150 CV"],
  },
  Suzuki: {
    Swift: ["1.2 Mild Hybrid 83 CV", "1.2 Dualjet 90 CV", "Sport 129 CV"],
    Vitara: ["1.4 Boosterjet 129 CV", "1.5 Hybrid 115 CV", "1.6 DDiS 120 CV"],
    "S-Cross": ["1.4 Boosterjet 129 CV", "1.5 Hybrid 115 CV", "1.6 DDiS 120 CV"],
    Ignis: ["1.2 Dualjet 83 CV", "1.2 Mild Hybrid 83 CV", "AllGrip 83 CV"],
    Jimny: ["1.5 102 CV", "Pro 102 CV", "AllGrip 102 CV"],
  },
  Tesla: {
    "Model 3": ["RWD 283 CV", "Gran Autonomía AWD 498 CV", "Performance 460 CV"],
    "Model Y": ["RWD 299 CV", "Gran Autonomía AWD 514 CV", "Performance 534 CV"],
    "Model S": ["Gran Autonomía 670 CV", "Plaid 1.020 CV", "75D 332 CV"],
    "Model X": ["Gran Autonomía 670 CV", "Plaid 1.020 CV", "100D 423 CV"],
  },
  Toyota: {
    Yaris: ["120 S 116 CV", "Hybrid 116 CV", "GR Yaris 280 CV"],
    Corolla: ["1.8 Hybrid 140 CV", "2.0 Hybrid 196 CV", "Touring Sports 140 CV"],
    "C-HR": ["1.8 Hybrid 140 CV", "2.0 Hybrid 197 CV", "2.0 PHEV 223 CV"],
    RAV4: ["2.5 Hybrid 218 CV", "2.5 Hybrid AWD 222 CV", "2.5 PHEV 306 CV"],
    "Aygo X": ["1.0 VVT-i 72 CV", "1.0 VVT-i S-CVT 72 CV", "Air 72 CV"],
  },
  Volkswagen: {
    Polo: ["1.0 MPI 80 CV", "1.0 TSI 95 CV", "1.0 TSI 110 CV"],
    Golf: ["1.0 eTSI 110 CV", "1.5 eTSI 150 CV", "2.0 TDI 150 CV"],
    "T-Roc": ["1.0 TSI 115 CV", "1.5 TSI 150 CV", "2.0 TDI 150 CV"],
    Passat: ["1.5 eTSI 150 CV", "2.0 TDI 150 CV", "eHybrid 204 CV"],
    Tiguan: ["1.5 eTSI 150 CV", "2.0 TDI 150 CV", "eHybrid 204 CV"],
  },
  Volvo: {
    XC40: ["B3 163 CV", "B4 197 CV", "Recharge Eléctrico 238 CV"],
    XC60: ["B4 197 CV", "B5 250 CV", "T6 Recharge 350 CV"],
    V60: ["B4 197 CV", "B5 250 CV", "T6 Recharge 350 CV"],
    EX30: ["Single Motor 272 CV", "Extended Range 272 CV", "Twin Motor 428 CV"],
    S60: ["B4 197 CV", "B5 250 CV", "T6 Recharge 350 CV"],
  },
};
const money = (n) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
const fallback =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85";
// Número temporal para pruebas. En producción se puede cambiar sin tocar el código
// definiendo VITE_WHATSAPP_PHONE al compilar la web.
const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "34678773271";
const phoneKey = (value) => String(value || "").replace(/\D/g, "");
const VEHICLE_STATUSES = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  RESERVED: "Reservado",
  SOLD: "Vendido",
};
const PUBLICATION_CHANNELS = {
  COCHES_NET: "Coches.net",
  MILANUNCIOS: "Milanuncios",
  WALLAPOP: "Wallapop",
};
const LEAD_STATUSES = {
  NEW: "Nueva",
  CONTACTED: "Contactada",
  NEGOTIATING: "En gestión",
  APPOINTMENT: "Cita confirmada",
  CLOSED: "Cerrada",
};
const vehicleStatus = (vehicle) =>
  vehicle.status || (vehicle.sold ? "SOLD" : "PUBLISHED");
const vehicleReadiness = (vehicle) => {
  const missing = [];
  const realPhotos = (vehicle.images || []).filter((image) => image && image !== fallback);
  if (realPhotos.length < 3) missing.push(realPhotos.length ? "más fotos" : "fotos");
  if (!vehicle.description || vehicle.description.trim().length < 35)
    missing.push("descripción");
  if (!vehicle.version || vehicle.version.trim().length < 2) missing.push("versión");
  if (!vehicle.price) missing.push("precio");
  if (!vehicle.power) missing.push("potencia");
  return missing;
};
const stockAge = (vehicle) => {
  const since = vehicle.publishedAt || vehicle.createdAt;
  if (!since || vehicleStatus(vehicle) === "DRAFT") return null;
  return Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 86400000));
};
function Brand({ sub }) {
  return (
    <div className="brand">
      AUTO<span>OCASIÓN</span>
      <small>{sub || "SANT ADRIÀ · BARCELONA"}</small>
    </div>
  );
}
function Gallery({ images = [], label, small = false, detail = false, onImageClick, swipeable = false }) {
  const [i, setI] = useState(0),
    [ratio, setRatio] = useState(4 / 3),
    pics = images.length ? images : [fallback],
    [thumbnailFailed, setThumbnailFailed] = useState(false),
    go = (d) => {
      setThumbnailFailed(false);
      setI((x) => (x + d + pics.length) % pics.length);
    };
  const thumbnail = small && pics[i].startsWith("/uploads/")
    ? pics[i].replace("/uploads/", "/uploads/thumbs/")
    : pics[i];
  const imageSource = thumbnailFailed ? pics[i] : thumbnail;
  const swipeStart = useRef(null),
    swiped = useRef(false);
  useEffect(() => { setI(0); setThumbnailFailed(false); }, [images]);
  const beginSwipe = (event) => {
    if (!swipeable || pics.length < 2) return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const finishSwipe = (event) => {
    if (!swipeStart.current) return;
    const horizontal = event.clientX - swipeStart.current.x;
    const vertical = event.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(horizontal) < 42 || Math.abs(horizontal) <= Math.abs(vertical)) return;
    swiped.current = true;
    go(horizontal < 0 ? 1 : -1);
  };
  return (
    <div
      className={
        "gallery " + (small ? "small " : "") + (detail ? "detail-gallery " : "") + (swipeable ? "swipeable" : "")
      }
      onPointerDown={beginSwipe}
      onPointerUp={finishSwipe}
      onPointerCancel={() => { swipeStart.current = null; }}
      onClick={(event) => {
        if (!swiped.current) return;
        event.stopPropagation();
        swiped.current = false;
      }}
      style={
        detail
          ? {
              "--detail-image-width": `min(52vw, ${Math.round((window.innerHeight - 80) * ratio)}px)`,
            }
          : undefined
      }
    >
      <img
        src={imageSource}
        alt={label || ""}
        loading={small ? "lazy" : "eager"}
        decoding="async"
        className={onImageClick ? "gallery-image-action" : ""}
        onClick={(event) => {
          if (!onImageClick) return;
          event.stopPropagation();
          onImageClick(i);
        }}
        onLoad={(e) =>
          setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)
        }
        onError={() => {
          if (imageSource !== pics[i]) setThumbnailFailed(true);
        }}
      />
      {pics.length > 1 && (
        <>
          <button
            className="gal prev"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft />
          </button>
          <button
            className="gal next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Foto siguiente"
          >
            <ChevronRight />
          </button>
          <span className="count">
            {i + 1}/{pics.length}
          </span>
        </>
      )}
    </div>
  );
}
function FullscreenGallery({ images = [], label, startIndex = 0, close }) {
  const pics = images.length ? images : [fallback];
  const [index, setIndex] = useState(startIndex),
    [scale, setScale] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const viewerImage = useRef(null);
  const imageElement = useRef(null);
  const clampScale = (value) => Math.min(4, Math.max(1, value));
  const clampPan = (nextPan, nextScale) => {
    const viewport = viewerImage.current;
    const image = imageElement.current;
    if (!viewport || !image || !image.offsetWidth || !image.offsetHeight)
      return nextPan;
    const maxX = Math.max(0, (image.offsetWidth * nextScale - viewport.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * nextScale - viewport.clientHeight) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  };
  const midpoint = (points) => ({
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  });
  const distance = (points) =>
    Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  const go = (direction) => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setIndex((current) => (current + direction + pics.length) % pics.length);
  };
  const zoomByWheel = (event) => {
    if (Math.abs(event.deltaY) < 1) return;
    event.preventDefault();
    setScale((current) => {
      const next = clampScale(current + (event.deltaY < 0 ? 0.24 : -0.24));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const beginGesture = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 1) {
      gesture.current = {
        type: "drag",
        start: points[0],
        pan: { ...pan },
        scale,
      };
    } else if (points.length === 2) {
      gesture.current = {
        type: "pinch",
        distance: distance(points),
        midpoint: midpoint(points),
        pan: { ...pan },
        scale,
      };
    }
  };
  const moveGesture = (event) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    const current = gesture.current;
    if (!current) return;
    if (points.length === 2) {
      const nextScale = clampScale(current.scale * (distance(points) / current.distance));
      const nextMidpoint = midpoint(points);
      setScale(nextScale);
      setPan(clampPan({
        x: current.pan.x + nextMidpoint.x - current.midpoint.x,
        y: current.pan.y + nextMidpoint.y - current.midpoint.y,
      }, nextScale));
    } else if (points.length === 1 && current.type === "drag" && current.scale > 1) {
      setPan(clampPan({
        x: current.pan.x + points[0].x - current.start.x,
        y: current.pan.y + points[0].y - current.start.y,
      }, current.scale));
    }
  };
  const endGesture = (event) => {
    const endPoint = pointers.current.get(event.pointerId);
    pointers.current.delete(event.pointerId);
    const current = gesture.current;
    if (!current || !endPoint) return;
    if (!pointers.current.size) {
      const horizontalMove = endPoint.x - current.start?.x || 0;
      if (current.scale === 1 && Math.abs(horizontalMove) > 60 && pics.length > 1)
        go(horizontalMove < 0 ? 1 : -1);
      if (scale <= 1.03) {
        setScale(1);
        setPan({ x: 0, y: 0 });
      }
      gesture.current = null;
      return;
    }
    const remaining = [...pointers.current.values()][0];
    gesture.current = { type: "drag", start: remaining, pan: { ...pan }, scale };
  };
  useEffect(() => setIndex(startIndex), [startIndex]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft" && pics.length > 1) go(-1);
      if (event.key === "ArrowRight" && pics.length > 1) go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pics.length]);
  return (
    <section
      className="fullscreen-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${label}`}
      onClick={(event) => event.stopPropagation()}
    >
      <header>
        <button type="button" className="viewer-back" onClick={close}>
          <ArrowLeft /> Volver a la ficha
        </button>
        <span>{index + 1}/{pics.length}</span>
      </header>
      <div
        className="viewer-image"
        ref={viewerImage}
        onPointerDown={beginGesture}
        onPointerMove={moveGesture}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onWheel={zoomByWheel}
      >
        <img
          ref={imageElement}
          src={pics[index]}
          alt={`${label}, fotografía ${index + 1}`}
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}
          onDoubleClick={() => {
            if (scale > 1) {
              setScale(1);
              setPan({ x: 0, y: 0 });
            } else setScale(2);
          }}
        />
      </div>
      {pics.length > 1 && (
        <>
          <button type="button" className="viewer-nav previous" onClick={() => go(-1)} aria-label="Foto anterior">
            <ChevronLeft />
          </button>
          <button type="button" className="viewer-nav next" onClick={() => go(1)} aria-label="Foto siguiente">
            <ChevronRight />
          </button>
        </>
      )}
      <p>Pellizca para ampliar. Desliza a izquierda o derecha para ver las fotos.</p>
    </section>
  );
}
function App() {
  const [cars, setCars] = useState([]),
    [filter, setFilter] = useState({ brand: "", fuel: "", price: "" }),
    [detail, setDetail] = useState(),
    [admin, setAdmin] = useState(false),
    [open, setOpen] = useState(false),
    [filtersOpen, setFiltersOpen] = useState(false),
    [review, setReview] = useState(0);
  const reviews = [
    ["Alejandro", "Todo muy bien y rápido. Vendedor muy amable y atento en todo momento."],
    ["Glenn Peiris", "Christian was fantastic and very helpful."],
    ["Dilan", "Todo genial, operación fluida y atención muy agradable."],
    [
      "Fernando Chávez",
      "El vendedor fue muy amable desde el principio y resolvió todas mis dudas.",
    ],
  ];
  const load = () =>
    fetch(API)
      .then((r) => r.json())
      .then(setCars);
  useEffect(() => {
    load();
    let a = setInterval(load, 20000),
      b = setInterval(() => setReview((x) => (x + 1) % reviews.length), 5500);
    const stream = new EventSource(`${API}/stream`);
    stream.addEventListener("inventory", load);
    return () => {
      clearInterval(a);
      clearInterval(b);
      stream.close();
    };
  }, []);
  useEffect(() => {
    const closeVehicleOnBack = () => setDetail(undefined);
    window.addEventListener("popstate", closeVehicleOnBack);
    return () => window.removeEventListener("popstate", closeVehicleOnBack);
  }, []);
  const openDetail = (vehicle) => {
    window.history.pushState(
      { ...(window.history.state || {}), autoOcasionVehicleDetail: true },
      "",
      window.location.href,
    );
    setDetail(vehicle);
  };
  const closeDetail = () => {
    if (window.history.state?.autoOcasionVehicleDetail) window.history.back();
    else setDetail(undefined);
  };
  let shown = cars
    .filter((v) => ["PUBLISHED", "RESERVED"].includes(vehicleStatus(v)))
    .filter((v) => !filter.brand || v.brand === filter.brand)
    .filter((v) => !filter.fuel || v.fuel === filter.fuel)
    .filter((v) => !filter.price || v.price <= filter.price);
  if (admin)
    return <Admin cars={cars} refresh={load} close={() => setAdmin(false)} />;
  return (
    <main>
      <header>
        <Brand />
        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          <a href="#stock">Stock</a>
          <a href="#sell">Vende tu coche</a>
          <a href="#trust">Confianza</a>
          <a href="#visit">Visítanos</a>
          <a className="navbox" href="#stock">
            Ver vehículos <ArrowUpRight size={14} />
          </a>
        </nav>
        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <section className="hero">
        <div>
          <p className="kicker">VEHÍCULOS DE OCASIÓN · BARCELONA</p>
          <h1>
            El coche correcto.
            <br />
            <i>Sin ruido.</i>
          </h1>
          <a className="button" href="#stock">
            Explorar stock
          </a>
        </div>
      </section>
      <div className="marquee" aria-label="Vehículos revisados, garantía incluida, trato directo y entrega inmediata">
        <div className="marquee-track">
          <span>VEHÍCULOS REVISADOS　✦　GARANTÍA INCLUIDA　✦　TRATO DIRECTO　✦　ENTREGA INMEDIATA</span>
          <span aria-hidden="true">VEHÍCULOS REVISADOS　✦　GARANTÍA INCLUIDA　✦　TRATO DIRECTO　✦　ENTREGA INMEDIATA</span>
        </div>
      </div>
      <section className="inventory" id="stock">
        <div className="heading">
          <div>
            <p className="kicker">INVENTARIO ACTUAL</p>
            <h2>Encuentra el tuyo.</h2>
          </div>
          <small>{String(shown.length).padStart(2, "0")} vehículos</small>
        </div>
        <div className={`filters ${filtersOpen ? "is-open" : ""}`}>
          <button
            className="filter-trigger"
            type="button"
            aria-label={filtersOpen ? "Cerrar filtros" : "Abrir filtros"}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <SlidersHorizontal size={18} />
          </button>
          <div className="filter-panel">
            <select
              value={filter.brand}
              onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
            >
              <option value="">Marca</option>
              {[...new Set(cars.map((v) => v.brand))].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              value={filter.fuel}
              onChange={(e) => setFilter({ ...filter, fuel: e.target.value })}
            >
              <option value="">Combustible</option>
              <option>Gasolina</option>
              <option>Diésel</option>
              <option>Híbrido</option>
              <option>Eléctrico</option>
            </select>
            <select
              value={filter.price}
              onChange={(e) => setFilter({ ...filter, price: e.target.value })}
            >
              <option value="">Precio máximo</option>
              <option value="7000">7.000 €</option>
              <option value="10000">10.000 €</option>
              <option value="15000">15.000 €</option>
            </select>
            <button
              className="filter-clear"
              type="button"
              onClick={() => setFilter({ brand: "", fuel: "", price: "" })}
            >
              Limpiar
            </button>
          </div>
        </div>
        <div className="grid">
          {shown.map((v) => (
            <article key={v.id} onClick={() => openDetail(v)}>
              <Gallery
                images={v.images}
                label={`${v.brand} ${v.model}`}
                small
                swipeable
              />
              {vehicleStatus(v) === "RESERVED" && (
                <span className="vehicle-reserved-badge">Reservado</span>
              )}
              <div className="info">
                <h3>{v.brand} {v.model}</h3>
                <div className="vehicle-meta">
                  <span>{v.year}</span>
                  <span>{v.kilometers.toLocaleString("es-ES")} km</span>
                  <span>{v.fuel}</span>
                  <span>{v.power} CV</span>
                </div>
                <div className="vehicle-card-footer">
                  <strong>{money(v.price)}</strong>
                  <span>Ver ficha <ArrowRight size={16} /></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SellCar />
      <section className="promise">
        <p className="kicker">NUESTRA FORMA DE TRABAJAR</p>
        <div>
          <h2>
            Todo lo que necesitas.
            <br />
            <i>Nada que no.</i>
          </h2>
          <aside>
            <span>
              <Check />
              Revisión previa
            </span>
            <span>
              <Check />
              Garantía incluida
            </span>
            <span>
              <Check />
              Gestión integral
            </span>
          </aside>
        </div>
      </section>
      <section id="trust" className="trust">
        <div>
          <p className="kicker">VALORACIONES VERIFICADAS</p>
          <b>5.0</b>
          <p>
            {[1, 2, 3, 4, 5].map((x) => (
              <Star key={x} fill="currentColor" />
            ))}
          </p>
          <a
            className="trust-source"
            target="_blank"
            rel="noreferrer"
            href="https://www.coches.net/concesionario/platjaautomoviles/opiniones/"
          >
            10 opiniones verificadas en Coches.net ↗
          </a>
        </div>
        <article key={review}>
          <em>“</em>
          <h2>{reviews[review][1]}</h2>
          <footer>
            <b>{reviews[review][0]}</b>
            <small> · Coches.net</small>
            <span>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={review === i ? "on" : ""}
                  onClick={() => setReview(i)}
                />
              ))}
            </span>
          </footer>
        </article>
      </section>
      <section id="visit" className="visit">
        <div>
          <p className="kicker">VEN A CONOCERNOS</p>
          <h2>
            Un café. Una vuelta.
            <br />
            Tu próximo coche.
          </h2>
          <a
            className="button"
            target="_blank"
            href="https://maps.google.com/?q=Avda.+Platja+124,+Sant+Adria+de+Besos"
          >
            Abrir en Maps <ArrowUpRight />
          </a>
        </div>
        <aside>
          <MapPin />
          <p>
            Avda. Platja 124
            <br />
            08930 Sant Adrià de Besòs
            <br />
            Barcelona
          </p>
          <small>Atención con cita previa</small>
          <div className="visit-hours">
            <b>Horario</b>
            <span>Lunes a viernes · 09:30–20:00</span>
            <span>Sábado · 11:00–17:30</span>
          </div>
        </aside>
      </section>
      <footer className="foot">
        <Brand />
        <small>© {new Date().getFullYear()} Auto Ocasión Sant Adrià</small>
        <div className="footer-contact">
          <small>CONTACTO</small>
          <a className="footer-phone" href={`tel:+${WHATSAPP_PHONE}`}>
            <Phone /> +34 678 773 271
          </a>
        </div>
        <span>
          <a
            target="_blank"
            href="https://www.coches.net/concesionario/platjaautomoviles/"
          >
            Coches.net ↗
          </a>
          　
          <a
            target="_blank"
            href="https://www.milanuncios.com/tiendas-profesionales/auto-ocasion-sant-adria-265566"
          >
            Milanuncios ↗
          </a>
        </span>
      </footer>
      <div className="mobile-contact-bar" aria-label="Contacto rápido">
        <a href={`tel:+${WHATSAPP_PHONE}`} aria-label="Llamar al concesionario">
          <Phone /> Llamar
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola, me gustaría recibir información.")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Escribir por WhatsApp"
        >
          <MessageCircle /> WhatsApp
        </a>
      </div>
      <button
        className="private"
        onClick={() => setAdmin(true)}
        aria-label="Acceso administración"
      />
      {detail && <Detail car={detail} close={closeDetail} />}
    </main>
  );
}
function SellCar() {
  const [status, setStatus] = useState(""),
    [photoCount, setPhotoCount] = useState(0),
    [errors, setErrors] = useState({}),
    [selectedBrand, setSelectedBrand] = useState(""),
    [selectedModel, setSelectedModel] = useState(""),
    [selectedVersion, setSelectedVersion] = useState("");
  const selectedModels =
    selectedBrand && selectedBrand !== "__other"
      ? Object.keys(SELL_VEHICLE_CATALOG[selectedBrand])
      : [];
  const selectedVersions =
    selectedBrand && selectedModel && selectedModel !== "__other"
      ? SELL_VEHICLE_CATALOG[selectedBrand]?.[selectedModel] || []
      : [];
  const clearError = (field) => {
    if (!field || !errors[field]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const validate = (form) => {
    const data = new FormData(form);
    const next = {};
    const requiredFields = {
      name: "Indica tu nombre y apellidos.",
      phone: "Indica un teléfono de contacto.",
      brand: "Indica la marca del vehículo.",
      model: "Indica el modelo del vehículo.",
      version: "Indica la versión o motorización.",
      year: "Indica el año del vehículo.",
      kilometers: "Indica los kilómetros del vehículo.",
      fuel: "Selecciona el combustible.",
      transmission: "Selecciona el tipo de cambio.",
      condition: "Selecciona el estado general.",
      description: "Cuéntanos los detalles principales del vehículo.",
    };
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!String(data.get(field) || "").trim()) next[field] = message;
    });
    const year = Number(data.get("year"));
    if (year && (year < 1950 || year > 2035))
      next.year = "Escribe un año entre 1950 y 2035.";
    const kilometers = Number(data.get("kilometers"));
    if (String(data.get("kilometers") || "").trim() && kilometers < 0)
      next.kilometers = "Los kilómetros no pueden ser negativos.";
    const phoneDigits = String(data.get("phone") || "").replace(/\D/g, "");
    if (phoneDigits && phoneDigits.length < 7)
      next.phone = "Escribe un teléfono válido.";
    const email = String(data.get("email") || "").trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      next.email = "Escribe un email válido o déjalo vacío.";
    const photos = data
      .getAll("photos")
      .filter((file) => file instanceof File && file.size > 0);
    if (!photos.length)
      next.photos = "Adjunta al menos una foto del vehículo.";
    else if (photos.length > 10)
      next.photos = "Puedes adjuntar un máximo de 10 fotografías.";
    if (data.get("consent") !== "on")
      next.consent = "Necesitamos tu autorización para gestionar la solicitud.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Revisa los campos marcados en rojo.");
      requestAnimationFrame(() =>
        form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus(),
      );
      return false;
    }
    return true;
  };
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validate(form)) return;
    const data = new FormData(form);
    data.set("phone", phoneKey(data.get("phone")));
    data.set(
      "sourceDevice",
      matchMedia("(max-width: 760px)").matches ? "Móvil" : "Ordenador",
    );
    const imageFiles = data
      .getAll("photos")
      .filter((file) => file instanceof File && file.size > 0);
    const shareText = `Hola, quiero vender mi ${data.get("brand") || "coche"} ${data.get("model") || ""}.\nAño: ${data.get("year") || "No indicado"}\nKm: ${data.get("kilometers") || "No indicados"}\nNombre: ${data.get("name")}\nTeléfono: ${data.get("phone")}${data.get("description") ? `\nNotas: ${data.get("description")}` : ""}`;
    const canSharePhotos =
      imageFiles.length > 0 &&
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" ||
        navigator.canShare({ files: imageFiles }));
    // En móviles compatibles abre el selector nativo con el texto y las fotos.
    // WhatsApp no permite adjuntar archivos mediante un enlace wa.me.
    const photoShare = canSharePhotos
      ? navigator
          .share({
            title: "Venta de vehículo · Auto Ocasión Sant Adrià",
            text: shareText,
            files: imageFiles,
          })
          .then(() => true)
          .catch(() => false)
      : null;
    // Spring interpreta un campo numérico vacío como un valor inválido. Los
    // opcionales vacíos no deben viajar en la petición.
    for (const [key, value] of [...data.entries()]) {
      if (typeof value === "string" && !value.trim()) data.delete(key);
    }
    setStatus("Guardando la información y las fotos…");
    try {
      const response = await fetch("/api/sell-requests", {
        method: "POST",
        body: data,
      });
      if (!response.ok)
        throw Error(response.status === 409 ? "duplicate" : "request");
      const lead = await response.json();
      const photoNote = lead.images?.length
        ? "\nFotos: adjuntadas a la solicitud web."
        : "";
      const text = `Hola, quiero vender mi ${lead.brand} ${lead.model} (${lead.version}).\nAño: ${lead.year || "No indicado"}\nKm: ${lead.kilometers?.toLocaleString("es-ES") || "No indicados"}\nCombustible: ${lead.fuel || "No indicado"}\nPrecio orientativo: ${lead.expectedPrice ? money(lead.expectedPrice) : "A valorar"}\nNombre: ${lead.name}\nTeléfono: ${lead.phone}${lead.description ? `\nNotas: ${lead.description}` : ""}${photoNote}`;
      setStatus("Solicitud registrada. Abriendo WhatsApp…");
      form.reset();
      setPhotoCount(0);
      setErrors({});
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedVersion("");
      if (photoShare && (await photoShare)) {
        setStatus(
          "Solicitud registrada. Las fotos y el mensaje se han abierto en el selector del móvil; elige WhatsApp y confirma el envío.",
        );
        return;
      }
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
      // Un navegador incrustado puede no permitir abrir WhatsApp. La solicitud
      // ya se habrá guardado y no debe mostrarse como un fallo del formulario.
      window.setTimeout(() => window.location.assign(whatsappUrl), 0);
    } catch (error) {
      setStatus(
        error.message === "duplicate"
          ? "Ya recibimos una solicitud igual recientemente. Te responderemos pronto."
          : "No se pudo enviar la solicitud. Revisa los campos e inténtalo de nuevo.",
      );
    }
  }
  return (
    <section id="sell" className="sell-car">
      <div className="sell-intro">
        <p className="kicker">COMPRO COCHES</p>
        <h2>¿Vendes tu coche?</h2>
        <p>
          Cuéntanos cómo es y recibe una valoración sin compromiso. Revisamos
          cada propuesta personalmente.
        </p>
        <div className="sell-steps">
          <span>01 · Cuéntanoslo</span>
          <span>02 · Adjunta fotos</span>
          <span>03 · Hablamos contigo</span>
        </div>
      </div>
      <form
        className="sell-form"
        onSubmit={submit}
        noValidate
        onInput={(event) => clearError(event.target.name)}
        onChange={(event) => clearError(event.target.name)}
      >
        <p className="form-required-note">Los campos con <b>*</b> son obligatorios.</p>
        <div className="form-grid">
          <label className={errors.name ? "field-invalid" : ""}>
            Nombre y apellidos *
            <input name="name" aria-invalid={Boolean(errors.name)} placeholder="Tu nombre" />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>
          <label className={errors.phone ? "field-invalid" : ""}>
            Teléfono *
            <input
              name="phone"
              type="tel"
              aria-invalid={Boolean(errors.phone)}
              placeholder="Ej. 600 000 000"
            />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </label>
          <label className={errors.email ? "field-invalid" : ""}>
            Email <small>(opcional)</small>
            <input name="email" type="email" aria-invalid={Boolean(errors.email)} placeholder="tu@email.com" />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label>
            Matrícula <small>(opcional)</small>
            <input name="registration" placeholder="1234 ABC" />
          </label>
          <label className={errors.brand ? "field-invalid" : ""}>
            Marca *
            <select
              name="catalogBrand"
              value={selectedBrand}
              aria-invalid={Boolean(errors.brand)}
              onChange={(event) => {
                setSelectedBrand(event.target.value);
                setSelectedModel("");
                setSelectedVersion("");
                clearError("brand");
                clearError("model");
                clearError("version");
              }}
            >
              <option value="">Selecciona una marca</option>
              {Object.keys(SELL_VEHICLE_CATALOG).map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
              <option value="__other">No encuentro mi marca</option>
            </select>
            {selectedBrand && selectedBrand !== "__other" && (
              <input type="hidden" name="brand" value={selectedBrand} />
            )}
            {selectedBrand === "__other" && (
              <input name="brand" aria-invalid={Boolean(errors.brand)} placeholder="Escribe la marca" />
            )}
            {errors.brand && <small className="field-error">{errors.brand}</small>}
          </label>
          <label className={errors.model ? "field-invalid" : ""}>
            Modelo *
            {selectedBrand && selectedBrand !== "__other" ? (
              <>
                <select
                  name="catalogModel"
                  value={selectedModel}
                  aria-invalid={Boolean(errors.model)}
                  onChange={(event) => {
                    setSelectedModel(event.target.value);
                    setSelectedVersion("");
                    clearError("model");
                    clearError("version");
                  }}
                >
                  <option value="">Selecciona un modelo</option>
                  {selectedModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  <option value="__other">No encuentro mi modelo</option>
                </select>
                {selectedModel && selectedModel !== "__other" && (
                  <input type="hidden" name="model" value={selectedModel} />
                )}
                {selectedModel === "__other" && (
                  <input name="model" aria-invalid={Boolean(errors.model)} placeholder="Escribe el modelo" />
                )}
              </>
            ) : (
              <input name="model" disabled={selectedBrand !== "__other"} aria-invalid={Boolean(errors.model)} placeholder="Primero selecciona una marca" />
            )}
            {errors.model && <small className="field-error">{errors.model}</small>}
          </label>
          <label className={errors.version ? "field-invalid" : ""}>
            Versión o motorización *
            {selectedBrand && selectedBrand !== "__other" && selectedModel && selectedModel !== "__other" ? (
              <>
                <select
                  name="catalogVersion"
                  value={selectedVersion}
                  aria-invalid={Boolean(errors.version)}
                  onChange={(event) => {
                    setSelectedVersion(event.target.value);
                    clearError("version");
                  }}
                >
                  <option value="">Selecciona una versión</option>
                  {selectedVersions.map((version) => (
                    <option key={version} value={version}>{version}</option>
                  ))}
                  <option value="__other">No encuentro mi versión</option>
                </select>
                {selectedVersion && selectedVersion !== "__other" && (
                  <input type="hidden" name="version" value={selectedVersion} />
                )}
                {selectedVersion === "__other" && (
                  <input name="version" aria-invalid={Boolean(errors.version)} placeholder="Ej. 1.5 TSI 150 CV DSG" />
                )}
              </>
            ) : (
              <input
                name="version"
                disabled={selectedBrand !== "__other" && selectedModel !== "__other"}
                aria-invalid={Boolean(errors.version)}
                placeholder="Primero selecciona marca y modelo"
              />
            )}
            {errors.version && <small className="field-error">{errors.version}</small>}
          </label>
          <label className={errors.year ? "field-invalid" : ""}>
            Año *
            <input
              name="year"
              type="number"
              min="1950"
              max="2035"
              aria-invalid={Boolean(errors.year)}
              placeholder="2018"
            />
            {errors.year && <small className="field-error">{errors.year}</small>}
          </label>
          <label className={errors.kilometers ? "field-invalid" : ""}>
            Kilómetros *
            <input
              name="kilometers"
              type="number"
              min="0"
              aria-invalid={Boolean(errors.kilometers)}
              placeholder="85000"
            />
            {errors.kilometers && <small className="field-error">{errors.kilometers}</small>}
          </label>
          <label className={errors.fuel ? "field-invalid" : ""}>
            Combustible *
            <select name="fuel" defaultValue="" aria-invalid={Boolean(errors.fuel)}>
              <option value="">Selecciona</option>
              {[
                "Gasolina",
                "Diésel",
                "Híbrido",
                "Híbrido enchufable",
                "Eléctrico",
                "GLP",
              ].map((fuel) => (
                <option key={fuel}>{fuel}</option>
              ))}
            </select>
            {errors.fuel && <small className="field-error">{errors.fuel}</small>}
          </label>
          <label className={errors.transmission ? "field-invalid" : ""}>
            Cambio *
            <select name="transmission" defaultValue="" aria-invalid={Boolean(errors.transmission)}>
              <option value="">Selecciona</option>
              <option>Manual</option>
              <option>Automático</option>
            </select>
            {errors.transmission && <small className="field-error">{errors.transmission}</small>}
          </label>
          <label className={errors.condition ? "field-invalid" : ""}>
            Estado general *
            <select name="condition" defaultValue="" aria-invalid={Boolean(errors.condition)}>
              <option value="">Selecciona</option>
              <option>Excelente</option>
              <option>Buen estado</option>
              <option>Con detalles a revisar</option>
            </select>
            {errors.condition && <small className="field-error">{errors.condition}</small>}
          </label>
          <label>
            Precio que esperas (€)
            <input
              name="expectedPrice"
              type="number"
              min="0"
              placeholder="Opcional"
            />
          </label>
          <label className={`wide ${errors.description ? "field-invalid" : ""}`}>
            Cuéntanos lo importante *
            <textarea
              name="description"
              aria-invalid={Boolean(errors.description)}
              placeholder="Versión, mantenimiento, equipamiento, golpes, ITV, extras o cualquier detalle relevante."
            />
            {errors.description && <small className="field-error">{errors.description}</small>}
          </label>
          <label className={`wide upload-field ${errors.photos ? "field-invalid" : ""}`}>
            <Camera />
            <span>
              <b>Fotos del vehículo</b>
              <small>
                Hasta 10 imágenes. Exterior, interior, kilometraje y cualquier
                detalle útil. En móviles compatibles se pueden compartir junto
                al mensaje mediante el selector del teléfono.
              </small>
            </span>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              aria-invalid={Boolean(errors.photos)}
              onChange={(e) => {
                setPhotoCount(e.target.files.length);
                clearError("photos");
              }}
            />
            {errors.photos && <small className="field-error">{errors.photos}</small>}
          </label>
        </div>
        {photoCount > 0 && (
          <p className="photo-count">{photoCount} foto(s) preparada(s)</p>
        )}
        <label className={`wide consent-field ${errors.consent ? "field-invalid" : ""}`}>
          <input name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} />
          <span>
            Autorizo el uso de mis datos para gestionar esta solicitud y acepto
            la política de privacidad.
          </span>
          {errors.consent && <small className="field-error">{errors.consent}</small>}
        </label>
        <button className="button">
          <MessageCircle /> Enviar solicitud por WhatsApp
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}
function InterestForm({ car }) {
  const [status, setStatus] = useState(""),
    [errors, setErrors] = useState({});
  const reserved = vehicleStatus(car) === "RESERVED";
  const clearError = (field) => {
    if (!field || !errors[field]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const validate = (form) => {
    const data = new FormData(form);
    const next = {};
    if (!String(data.get("name") || "").trim())
      next.name = "Indica tu nombre para poder responderte.";
    const phoneDigits = String(data.get("phone") || "").replace(/\D/g, "");
    if (!phoneDigits) next.phone = "Indica un teléfono de contacto.";
    else if (phoneDigits.length < 7) next.phone = "Escribe un teléfono válido.";
    const email = String(data.get("email") || "").trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      next.email = "Escribe un email válido o déjalo vacío.";
    if (data.get("consent") !== "on")
      next.consent = "Necesitamos tu autorización para atenderte.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Revisa los campos marcados en rojo.");
      requestAnimationFrame(() =>
        form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus(),
      );
      return false;
    }
    return true;
  };
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validate(form)) return;
    const data = Object.fromEntries(new FormData(form));
    data.phone = phoneKey(data.phone);
    setStatus("Registrando tu interés…");
    try {
      const response = await fetch("/api/vehicle-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          vehicleId: car.id,
          consent: data.consent === "on",
          sourceDevice: matchMedia("(max-width: 760px)").matches
            ? "Móvil"
            : "Ordenador",
        }),
      });
      if (!response.ok)
        throw Error(response.status === 409 ? "duplicate" : "request");
      const lead = await response.json();
      const text = reserved
        ? `Hola, quiero consultar la disponibilidad del ${lead.vehicleName} (${money(lead.vehiclePrice)}).\nNombre: ${lead.name}\nTeléfono: ${lead.phone}${lead.message ? `\nMensaje: ${lead.message}` : ""}`
        : `Hola, me interesa el ${lead.vehicleName} (${money(lead.vehiclePrice)}).\nNombre: ${lead.name}\nTeléfono: ${lead.phone}${lead.message ? `\nMensaje: ${lead.message}` : ""}`;
      setStatus("Solicitud registrada. Abriendo WhatsApp…");
      form.reset();
      setErrors({});
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
      window.setTimeout(() => window.location.assign(whatsappUrl), 0);
    } catch (error) {
      setStatus(
        error.message === "duplicate"
          ? "Ya recibimos una consulta reciente de este vehículo. Te responderemos pronto."
          : "No se pudo registrar la solicitud. Inténtalo de nuevo.",
      );
    }
  }
  return (
    <form
      className="interest-form"
      onSubmit={submit}
      noValidate
      onInput={(event) => clearError(event.target.name)}
      onChange={(event) => clearError(event.target.name)}
    >
      <b>{reserved ? "Este vehículo está reservado" : "¿Te interesa este vehículo?"}</b>
      <p>{reserved ? "Déjanos tus datos y te avisaremos si vuelve a estar disponible." : "Déjanos tus datos y te responderemos personalmente."}</p>
      <p className="form-required-note">Los campos con <b>*</b> son obligatorios.</p>
      <div className={errors.name ? "form-field field-invalid" : "form-field"}>
        <input name="name" aria-invalid={Boolean(errors.name)} placeholder="Tu nombre *" />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </div>
      <div className={errors.phone ? "form-field field-invalid" : "form-field"}>
        <input name="phone" type="tel" aria-invalid={Boolean(errors.phone)} placeholder="Tu teléfono *" />
        {errors.phone && <small className="field-error">{errors.phone}</small>}
      </div>
      <div className={errors.email ? "form-field field-invalid" : "form-field"}>
        <input name="email" type="email" aria-invalid={Boolean(errors.email)} placeholder="Email (opcional)" />
        {errors.email && <small className="field-error">{errors.email}</small>}
      </div>
      <textarea name="message" placeholder={reserved ? "¿Quieres que te avisemos si queda disponible?" : "¿Quieres preguntarnos algo?"} />
      <label className={`interest-consent ${errors.consent ? "field-invalid" : ""}`}>
        <input name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} />
        <span>Acepto el uso de mis datos para atender mi solicitud.</span>
        {errors.consent && <small className="field-error">{errors.consent}</small>}
      </label>
      <button className="button">
        <MessageCircle /> {reserved ? "Consultar disponibilidad" : "Enviar consulta por WhatsApp"}
      </button>
      {status && <small>{status}</small>}
    </form>
  );
}
function Detail({ car, close }) {
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  useEffect(() => {
    // El anuncio se abre sobre la página. Al bloquear el documento evitamos que
    // un gesto vertical desplace el catálogo de fondo en lugar del contenido.
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div className="modal" onClick={close}>
      <article className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={close}>
          <X />
        </button>
        <Gallery
          images={car.images}
          label={`${car.brand} ${car.model}`}
          detail
          swipeable
          onImageClick={(index) => setFullscreenIndex(index)}
        />
        <div>
          <p className="kicker">
            {car.brand} · {car.year}
          </p>
          {vehicleStatus(car) === "RESERVED" && (
            <p className="detail-reserved-status">Reservado · consulta disponibilidad</p>
          )}
          <h2>{car.model}</h2>
          <b>{money(car.price)}</b>
          <p className="spec">
            {car.kilometers.toLocaleString("es-ES")} km　·　{car.fuel}　·　
            {car.power} CV　·　{car.transmission}
          </p>
          <p>{car.description}</p>
          <InterestForm car={car} />
        </div>
      </article>
      {fullscreenIndex !== null && (
        <FullscreenGallery
          images={car.images}
          label={`${car.brand} ${car.model}`}
          startIndex={fullscreenIndex}
          close={() => setFullscreenIndex(null)}
        />
      )}
    </div>
  );
}
const blank = {
  brand: "Volkswagen",
  model: "",
  version: "",
  year: new Date().getFullYear(),
  kilometers: "",
  price: "",
  fuel: "Gasolina",
  power: "",
  transmission: "Manual",
  status: "PUBLISHED",
  description: "",
  images: [fallback],
};
function AdminOverview({ cars }) {
  const count = (status) =>
    cars.filter((vehicle) => vehicleStatus(vehicle) === status).length;
  return (
    <section className="admin-summary" aria-label="Resumen del inventario">
      <article>
        <small>PUBLICADOS</small>
        <b>{count("PUBLISHED")}</b>
        <span>vehículos activos</span>
      </article>
      <article>
        <small>RESERVADOS</small>
        <b>{count("RESERVED")}</b>
        <span>pendientes de entrega</span>
      </article>
      <article>
        <small>BORRADORES</small>
        <b>{count("DRAFT")}</b>
        <span>fichas pendientes de publicar</span>
      </article>
      <article>
        <small>VENDIDOS</small>
        <b>{count("SOLD")}</b>
        <span>histórico del catálogo</span>
      </article>
    </section>
  );
}
function Admin({ cars, refresh, close }) {
  const [token, setToken] = useState(localStorage.token || ""),
    [form, setForm] = useState(),
    [notice, setNotice] = useState(""),
    [query, setQuery] = useState(""),
    [statusFilter, setStatusFilter] = useState("ALL"),
    [brandFilter, setBrandFilter] = useState("ALL"),
    [ageFilter, setAgeFilter] = useState("ALL"),
    [sortBy, setSortBy] = useState("NEWEST"),
    [selectedVehicleIds, setSelectedVehicleIds] = useState([]),
    [newRequestCount, setNewRequestCount] = useState(0),
    [activeTab, setActiveTab] = useState("inventory"),
    [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const filtered = cars
    .filter((v) =>
      (v.brand + " " + v.model + " " + (v.version || "")).toLowerCase().includes(query.toLowerCase()),
    )
    .filter((v) => statusFilter === "ALL" || vehicleStatus(v) === statusFilter)
    .filter((v) => brandFilter === "ALL" || v.brand === brandFilter)
    .filter((v) => {
      const age = stockAge(v);
      if (ageFilter === "ALL") return true;
      if (ageFilter === "DRAFT") return age === null;
      if (ageFilter === "UNDER_30") return age !== null && age < 30;
      if (ageFilter === "30_TO_44") return age !== null && age >= 30 && age < 45;
      return age !== null && age >= 45;
    })
    .sort((a, b) => {
      if (sortBy === "PRICE_LOW") return (a.price || 0) - (b.price || 0);
      if (sortBy === "PRICE_HIGH") return (b.price || 0) - (a.price || 0);
      const aDate = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return sortBy === "OLDEST" ? aDate - bDate : bDate - aDate;
    });
  const loadNewRequestCount = async () => {
    try {
      const [sell, interest] = await Promise.all([
        fetch("/api/sell-requests?deleted=false", { headers }),
        fetch("/api/vehicle-interests?deleted=false", { headers }),
      ]);
      const [sellItems, interestItems] = await Promise.all([
        sell.ok ? sell.json() : [],
        interest.ok ? interest.json() : [],
      ]);
      setNewRequestCount(
        [...sellItems, ...interestItems].filter(
          (lead) => (lead.status || "NEW") === "NEW",
        ).length,
      );
    } catch {
      // The inbox remains available even if its counter cannot refresh briefly.
    }
  };
  useEffect(() => {
    if (!token) return;
    loadNewRequestCount();
    const interval = setInterval(loadNewRequestCount, 20000);
    return () => clearInterval(interval);
  }, [token]);
  async function login(e) {
    e.preventDefault();
    let r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    if (r.ok) {
      let d = await r.json();
      localStorage.token = d.token;
      setToken(d.token);
    } else setNotice("Revisa tus credenciales");
  }
  async function save(e) {
    e.preventDefault();
    const intent = e.nativeEvent.submitter?.value;
    let v = {
      ...form,
      ...(intent === "DRAFT" ? { status: "DRAFT" } : {}),
      ...(intent === "PUBLISHED" ? { status: "PUBLISHED" } : {}),
      year: +form.year,
      kilometers: +form.kilometers,
      price: +form.price,
      power: +form.power,
      images: form.images.filter(Boolean),
    };
    const previous = cars.find((vehicle) => vehicle.id === v.id);
    const becomesPublic = v.status === "PUBLISHED" && vehicleStatus(previous || { status: "DRAFT" }) !== "PUBLISHED";
    if (
      becomesPublic &&
      !confirm("Publicar este vehículo en la web ahora? Será visible para los clientes inmediatamente.")
    )
      return;
    let r = await fetch(API + (v.id ? "/" + v.id : ""), {
      method: v.id ? "PUT" : "POST",
      headers,
      body: JSON.stringify(v),
    });
    if (r.ok) {
      setForm();
      setNotice(becomesPublic ? "Vehículo publicado y visible en la web." : "Vehículo guardado correctamente");
      refresh();
    } else setNotice("No se pudo guardar. La sesión puede haber caducado.");
  }
  async function action(id, path = "", method = "DELETE", message = "¿Confirmar esta acción?", body) {
    if (!confirm(message)) return;
    const response = await fetch(API + "/" + id + path, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.ok) refresh();
    else setNotice("No se pudo completar la acción. Vuelve a iniciar sesión.");
  }
  const toggleVehicleSelection = (id) =>
    setSelectedVehicleIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const bulkUpdateStatus = async (status, label) => {
    if (!selectedVehicleIds.length) return;
    if (!confirm(`${label} ${selectedVehicleIds.length} vehículo(s)?`)) return;
    const responses = await Promise.all(
      selectedVehicleIds.map((id) =>
        fetch(`${API}/${id}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status }),
        }),
      ),
    );
    if (responses.every((response) => response.ok)) {
      setSelectedVehicleIds([]);
      setNotice(`${label} completado.`);
      refresh();
    } else setNotice("No se pudieron actualizar todos los vehículos.");
  };
  const selectAdminTab = (tab) => {
    setActiveTab(tab);
    setMobileSectionsOpen(false);
  };
  if (!token)
    return (
      <div className="login">
        <button onClick={close}>← Volver</button>
        <div>
          <Brand sub="ACCESO PRIVADO" />
          <h1>Administración</h1>
          <form onSubmit={login}>
            <input name="email" placeholder="Email" required />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
            />
            {notice && <p>{notice}</p>}
            <button className="button">
              Entrar <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    );
  return (
    <section className="admin">
      <header>
        <Brand sub="PANEL DE GESTIÓN" />
        <button onClick={close}>Cerrar panel</button>
      </header>
      <div className="admin-mobile-tabs">
        <button
          type="button"
          aria-expanded={mobileSectionsOpen}
          onClick={() => setMobileSectionsOpen((open) => !open)}
        >
          <span>Sección</span>
          <b>{activeTab === "inventory" ? "Inventario" : "Solicitudes"}</b>
          <ChevronDown />
        </button>
        {mobileSectionsOpen && (
          <div role="menu" aria-label="Cambiar sección">
            <button type="button" className={activeTab === "inventory" ? "active" : ""} onClick={() => selectAdminTab("inventory")}>Inventario</button>
            <button type="button" className={activeTab === "requests" ? "active" : ""} onClick={() => selectAdminTab("requests")}>Solicitudes {newRequestCount > 0 && <span className="admin-lead-count">{newRequestCount}</span>}</button>
          </div>
        )}
      </div>
      <nav className="admin-tabs" aria-label="Secciones de administración">
        <button
          type="button"
          className={activeTab === "inventory" ? "active" : ""}
          onClick={() => selectAdminTab("inventory")}
        >
          Inventario
        </button>
        <button
          type="button"
          className={activeTab === "requests" ? "active" : ""}
          onClick={() => selectAdminTab("requests")}
        >
          Solicitudes {newRequestCount > 0 && <span className="admin-lead-count">{newRequestCount}</span>}
        </button>
      </nav>
      <section className="inventory-overview persistent-overview" aria-label="Resumen del inventario">
        <div>
          <p className="kicker">RESUMEN</p>
          <h2>Resumen de inventario</h2>
        </div>
        <AdminOverview cars={cars} />
      </section>
      {activeTab === "inventory" ? <>
      <div className="admin-section-heading ahead">
        <div>
          <p className="kicker">INVENTARIO</p>
          <h2>Vehículos</h2>
        </div>
        <button
          className="button"
          onClick={() => {
            setNotice("");
            setForm({ ...blank, images: [fallback] });
          }}
        >
          <Plus /> Añadir vehículo
        </button>
      </div>
      {notice && <p className="notice">{notice}</p>}
      <div className="admin-tools">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por marca o modelo"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="ALL">Todos los estados</option>
          {Object.entries(VEHICLE_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          aria-label="Filtrar por marca"
        >
          <option value="ALL">Todas las marcas</option>
          {[...new Set(cars.map((vehicle) => vehicle.brand))].sort().map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          aria-label="Filtrar por antigüedad"
        >
          <option value="ALL">Cualquier antigüedad</option>
          <option value="UNDER_30">Menos de 30 días</option>
          <option value="30_TO_44">30–44 días</option>
          <option value="45_PLUS">45 días o más</option>
          <option value="DRAFT">Sin publicar</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar inventario"
        >
          <option value="NEWEST">Más recientes primero</option>
          <option value="OLDEST">Más antiguos primero</option>
          <option value="PRICE_LOW">Precio más bajo</option>
          <option value="PRICE_HIGH">Precio más alto</option>
        </select>
        <span>{filtered.length} resultados</span>
      </div>
      {selectedVehicleIds.length > 0 && (
        <div className="bulk-actions" role="status">
          <b>{selectedVehicleIds.length} seleccionados</b>
          <button type="button" onClick={() => bulkUpdateStatus("RESERVED", "Marcar como reservados")}>Reservar</button>
          <button type="button" onClick={() => bulkUpdateStatus("PUBLISHED", "Publicar")}>Publicar</button>
          <button type="button" onClick={() => bulkUpdateStatus("DRAFT", "Retirar de la web")}>Retirar</button>
          <button type="button" className="bulk-cancel" onClick={() => setSelectedVehicleIds([])}>Cancelar</button>
        </div>
      )}
      {form && (
        <VehicleForm
          vehicle={form}
          setVehicle={setForm}
          save={save}
          cancel={() => setForm()}
          refresh={refresh}
          token={token}
        />
      )}
      <div className="adminlist">
        {filtered.map((v) => {
          const missing = vehicleReadiness(v), age = stockAge(v), isSold = vehicleStatus(v) === "SOLD", isReserved = vehicleStatus(v) === "RESERVED";
          return <div key={v.id}>
            <label className="admin-select">
              <input
                type="checkbox"
                checked={selectedVehicleIds.includes(v.id)}
                onChange={() => toggleVehicleSelection(v.id)}
                aria-label={`Seleccionar ${v.brand} ${v.model}`}
              />
            </label>
            <Gallery images={v.images} small />
            <p>
              <b>
                {v.brand} {v.model}
              </b>
              <small>
                {money(v.price)} · {VEHICLE_STATUSES[vehicleStatus(v)]} ·{" "}
                {v.images?.length || 0} fotos
              </small>
              <small className="vehicle-admin-health">
                {age !== null && (
                  <span>
                    {age} días en stock{age >= 45 ? " · Revisar precio" : ""}
                  </span>
                )}
                <span>{missing.length ? `Falta: ${missing.join(", ")}` : "Ficha lista"}</span>
              </small>
            </p>
            <div className="admin-actions">
              <button
                className="edit-vehicle"
                aria-label={`Editar ${v.brand} ${v.model}`}
                onClick={() => {
                  setNotice("");
                  setForm({
                    ...v,
                    images: v.images?.length ? v.images : [fallback],
                  });
                }}
              >
                <Edit3 /> Editar ficha
              </button>
              {!isSold && <button
                className={isReserved ? "remove-reservation" : "mark-reserved"}
                aria-label={isReserved ? `Quitar reserva de ${v.brand} ${v.model}` : `Marcar ${v.brand} ${v.model} como reservado`}
                onClick={() => action(
                  v.id,
                  "/status",
                  "PATCH",
                  isReserved
                    ? `¿Quitar la reserva de ${v.brand} ${v.model}? Volverá a mostrarse como publicado.`
                    : `¿Marcar ${v.brand} ${v.model} como reservado? Seguirá visible, indicando que está reservado.`,
                  { status: isReserved ? "PUBLISHED" : "RESERVED" },
                )}
              >
                <Check /> {isReserved ? "Quitar reserva" : "Marcar reservado"}
              </button>}
              <button
                className={isSold ? "reactivate-vehicle" : "mark-sold"}
                aria-label={isSold ? `Volver a publicar ${v.brand} ${v.model}` : `Marcar ${v.brand} ${v.model} como vendido`}
                onClick={() => action(
                  v.id,
                  "/sold",
                  "PATCH",
                  isSold
                    ? `¿Volver a publicar ${v.brand} ${v.model}?`
                    : `¿Marcar ${v.brand} ${v.model} como vendido? Se retirará del catálogo público.`,
                )}
              >
                <CheckCircle /> {isSold ? "Volver a publicar" : "Marcar vendido"}
              </button>
              <button
                className="delete-vehicle"
                aria-label={`Eliminar ${v.brand} ${v.model}`}
                onClick={() => action(v.id, "", "DELETE", `¿Eliminar ${v.brand} ${v.model}? Esta acción no se puede deshacer.`)}
              >
                <Trash2 /> Eliminar
              </button>
            </div>
          </div>;
        })}
      </div>
      </> : <LeadInbox token={token} onLeadsChanged={loadNewRequestCount} />}
    </section>
  );
}
function LeadInbox({ token, onLeadsChanged }) {
  const [sellLeads, setSellLeads] = useState([]),
    [interests, setInterests] = useState([]),
    [selectedPhone, setSelectedPhone] = useState(""),
    [previewImage, setPreviewImage] = useState(""),
    [view, setView] = useState("active"),
    [statusFilter, setStatusFilter] = useState("ALL"),
    [leadTypeView, setLeadTypeView] = useState("SELL"),
    [dueOnly, setDueOnly] = useState(false),
    [managedLead, setManagedLead] = useState(null),
    [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };
  const load = async (minimumFeedbackMs = 0) => {
    const startedAt = Date.now();
    setLoading(true);
    try {
      const [sell, interest] = await Promise.all([
        fetch(`/api/sell-requests?deleted=${view === "trash"}`, { headers }),
        fetch(`/api/vehicle-interests?deleted=${view === "trash"}`, { headers }),
      ]);
      if (sell.ok) setSellLeads(await sell.json());
      if (interest.ok) setInterests(await interest.json());
      onLeadsChanged?.();
    } finally {
      const remainingFeedback = minimumFeedbackMs - (Date.now() - startedAt);
      if (remainingFeedback > 0)
        await new Promise((resolve) => setTimeout(resolve, remainingFeedback));
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [view]);
  const updateLead = async (kind, id, update) => {
    const payload = Object.fromEntries(
      Object.entries(update).map(([key, value]) => [
        key,
        value === "" && (key.endsWith("At") || key.endsWith("Text"))
          ? null
          : value,
      ]),
    );
    const response = await fetch(`/api/${kind}/${id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      await load();
      return true;
    }
    return false;
  };
  const anonymizeLead = async (kind, id) => {
    if (
      !confirm(
        "Se eliminarán los datos personales de este contacto. ¿Continuar?",
      )
    )
      return;
    const response = await fetch(`/api/${kind}/${id}/anonymize`, {
      method: "DELETE",
      headers,
    });
    if (response.ok) load();
  };
  const moveToTrash = async (kind, id) => {
    if (!confirm("La solicitud se moverá a la papelera. Podrás restaurarla después.")) return;
    const response = await fetch(`/api/${kind}/${id}`, { method: "DELETE", headers });
    if (response.ok) {
      await load();
      return true;
    }
    return false;
  };
  const restoreLead = async (kind, id) => {
    const response = await fetch(`/api/${kind}/${id}/restore`, { method: "PATCH", headers });
    if (response.ok) load();
  };
  const permanentlyDeleteLead = async (kind, id) => {
    if (!confirm("Eliminar definitivamente esta solicitud y sus fotos asociadas. Esta acción no se puede deshacer.")) return;
    const response = await fetch(`/api/${kind}/${id}/permanently`, {
      method: "DELETE",
      headers,
    });
    if (response.ok) load();
  };
  const when = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  const allLeads = [
    ...sellLeads.map((lead) => ({
      ...lead,
      kind: "sell-requests",
      type: "Tasación",
    })),
    ...interests.map((lead) => ({
      ...lead,
      kind: "vehicle-interests",
      type: "Compra",
    })),
  ];
  const reminders = allLeads
    .filter((lead) => lead.nextActionAt)
    .sort((a, b) => new Date(a.nextActionAt) - new Date(b.nextActionAt))
    .slice(0, 5);
  const history = selectedPhone
    ? allLeads.filter((lead) => lead.phone === selectedPhone)
    : [];
  const matchesLeadFilter = (lead) =>
    (statusFilter === "ALL" || (lead.status || "NEW") === statusFilter) &&
    (!dueOnly || (lead.nextActionAt && new Date(lead.nextActionAt) <= new Date()));
  const visibleSellLeads = sellLeads.filter(matchesLeadFilter);
  const visibleInterests = interests.filter(matchesLeadFilter);
  const newLeadCount = allLeads.filter((lead) => (lead.status || "NEW") === "NEW").length;
  const dueLeadCount = allLeads.filter(
    (lead) => lead.nextActionAt && new Date(lead.nextActionAt) <= new Date(),
  ).length;
  return (
    <section className="lead-inbox">
      <div className="admin-section-heading lead-heading">
        <div>
          <p className="kicker">CONTACTOS RECIBIDOS</p>
          <h2>Solicitudes</h2>
        </div>
        <button
          type="button"
          className={loading ? "is-loading" : ""}
          onClick={() => load(1400)}
          disabled={loading}
        >
          <span className="refresh-spinner" aria-hidden="true" />
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>
      <div className="lead-tools">
        <div className="lead-view-tabs" role="tablist" aria-label="Vista de solicitudes">
          <button
            type="button"
            className={view === "active" ? "active" : ""}
            onClick={() => { setView("active"); setSelectedPhone(""); setDueOnly(false); }}
          >
            Activas
          </button>
          <button
            type="button"
            className={view === "trash" ? "active" : ""}
            onClick={() => { setView("trash"); setSelectedPhone(""); setDueOnly(false); }}
          >
            Papelera
          </button>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => { setStatusFilter(event.target.value); setDueOnly(false); }}
          aria-label="Filtrar solicitudes por estado"
        >
          <option value="ALL">Todos los estados</option>
          {Object.entries(LEAD_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <small>{visibleSellLeads.length + visibleInterests.length} solicitudes</small>
      </div>
      <div className="lead-category-tabs" role="tablist" aria-label="Tipo de solicitudes">
        <button
          type="button"
          className={leadTypeView === "SELL" ? "active" : ""}
          onClick={() => setLeadTypeView("SELL")}
        >
          Quieren venderte un coche <span>{visibleSellLeads.length}</span>
        </button>
        <button
          type="button"
          className={leadTypeView === "INTEREST" ? "active" : ""}
          onClick={() => setLeadTypeView("INTEREST")}
        >
          Interesados en el stock <span>{visibleInterests.length}</span>
        </button>
      </div>
      {view === "active" && (
        <section className="lead-work-queue" aria-label="Atajos de trabajo">
          <div>
            <p className="kicker">COLA DE TRABAJO</p>
            <b>¿Qué quieres revisar?</b>
          </div>
          <button
            type="button"
            className={statusFilter === "NEW" && !dueOnly ? "active" : ""}
            onClick={() => { setStatusFilter("NEW"); setDueOnly(false); }}
          >
            <span>Nuevas por atender</span>
            <small>{newLeadCount} sin gestionar</small>
          </button>
          <button
            type="button"
            className={dueOnly ? "active" : ""}
            onClick={() => { setStatusFilter("ALL"); setDueOnly(true); }}
          >
            <span>Tareas de seguimiento</span>
            <small>{dueLeadCount} vencidas o para hoy</small>
          </button>
          <button
            type="button"
            className={statusFilter === "ALL" && !dueOnly ? "active" : ""}
            onClick={() => { setStatusFilter("ALL"); setDueOnly(false); }}
          >
            Ver todas
          </button>
        </section>
      )}
      {reminders.length > 0 && (
        <section className="lead-reminders">
          <b>Próximos pasos</b>
          {reminders.map((lead) => (
            <button
              key={`${lead.kind}-${lead.id}`}
              onClick={() => setSelectedPhone(lead.phone)}
            >
              <span>{when(lead.nextActionAt)}</span>
              {lead.nextActionText || `Contactar con ${lead.name}`}
            </button>
          ))}
        </section>
      )}
      {selectedPhone && (
        <section className="contact-history">
          <div>
            <b>Historial de {selectedPhone}</b>
            <button onClick={() => setSelectedPhone("")}>Cerrar</button>
          </div>
          {history.map((lead) => (
            <p key={`${lead.kind}-${lead.id}`}>
              <span>{lead.type}</span> · {lead.source || lead.vehicleName} ·{" "}
              {when(lead.createdAt)} · {LEAD_STATUSES[lead.status || "NEW"]}
            </p>
          ))}
        </section>
      )}
      <div className="lead-columns single">
        {leadTypeView === "SELL" && (
        <div>
          <h3>
            Quieren venderte un coche <small>{visibleSellLeads.length}</small>
          </h3>
          {visibleSellLeads.length === 0 ? (
            <p className="empty-lead">No hay solicitudes en esta vista.</p>
          ) : (
            visibleSellLeads.map((lead) => (
              <article className={lead.read ? "read" : ""} key={lead.id}>
                <div>
                  <b>
                    {lead.brand} {lead.model}
                  </b>
                  {lead.version && <small>{lead.version}</small>}
                  <small>
                    {lead.year || "Año no indicado"} ·{" "}
                    {lead.kilometers
                      ? `${lead.kilometers.toLocaleString("es-ES")} km`
                      : "Km no indicados"}{" "}
                    · {when(lead.createdAt)}
                  </small>
                  <span
                    className={`lead-status ${(lead.status || "NEW").toLowerCase()}`}
                  >
                    {LEAD_STATUSES[lead.status || "NEW"]}
                  </span>
                  {lead.priority === "HIGH" && (
                    <span className="lead-priority">Prioridad alta</span>
                  )}
                </div>
                <p>
                  {lead.name} · <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </p>
                <small className="lead-source">
                  {lead.source || "Vende tu coche"}
                  {lead.sourceDevice ? ` · ${lead.sourceDevice}` : ""}
                </small>
                <div className="lead-actions">
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hola ${lead.name}, hemos recibido tu solicitud para valorar el ${lead.brand} ${lead.model}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    className="lead-manage-open"
                    onClick={() => setManagedLead({ lead, kind: "sell-requests", type: "Tasación" })}
                  >
                    Gestionar solicitud
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        )}
        {leadTypeView === "INTEREST" && (
        <div>
          <h3>
            Interesados en el stock <small>{visibleInterests.length}</small>
          </h3>
          {visibleInterests.length === 0 ? (
            <p className="empty-lead">
              No hay solicitudes en esta vista.
            </p>
          ) : (
            visibleInterests.map((lead) => (
              <article className={lead.read ? "read" : ""} key={lead.id}>
                <div>
                  <b>{lead.vehicleName}</b>
                  <small>
                    {money(lead.vehiclePrice)} · {when(lead.createdAt)}
                  </small>
                  <span
                    className={`lead-status ${(lead.status || "NEW").toLowerCase()}`}
                  >
                    {LEAD_STATUSES[lead.status || "NEW"]}
                  </span>
                  {lead.priority === "HIGH" && (
                    <span className="lead-priority">Prioridad alta</span>
                  )}
                </div>
                <p>
                  {lead.name} · <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </p>
                <small className="lead-source">
                  {lead.source || `Anuncio: ${lead.vehicleName}`}
                  {lead.sourceDevice ? ` · ${lead.sourceDevice}` : ""}
                </small>
                <div className="lead-actions">
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hola ${lead.name}, te contactamos por el ${lead.vehicleName}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    className="lead-manage-open"
                    onClick={() => setManagedLead({ lead, kind: "vehicle-interests", type: "Compra" })}
                  >
                    Gestionar solicitud
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        )}
      </div>
      {managedLead && (
        <LeadDrawer
          entry={managedLead}
          close={() => setManagedLead(null)}
          updateLead={updateLead}
          anonymizeLead={anonymizeLead}
          showHistory={() => setSelectedPhone(managedLead.lead.phone)}
          deletedView={view === "trash"}
          moveToTrash={async (kind, id) => {
            const moved = await moveToTrash(kind, id);
            if (!moved) return false;
            setManagedLead(null);
            setStatusFilter("ALL");
            setDueOnly(false);
            setView("trash");
            return true;
          }}
          restoreLead={restoreLead}
          permanentlyDeleteLead={permanentlyDeleteLead}
          previewImage={setPreviewImage}
        />
      )}
      {previewImage && (
        <div className="lead-photo-modal" onClick={() => setPreviewImage("")}>
          <img src={previewImage} alt="Foto del vehículo enviado" />
        </div>
      )}
    </section>
  );
}
function LeadDrawer({
  entry,
  close,
  updateLead,
  anonymizeLead,
  showHistory,
  deletedView,
  moveToTrash,
  restoreLead,
  permanentlyDeleteLead,
  previewImage,
}) {
  const { lead, kind, type } = entry;
  const subject = lead.vehicleName || `${lead.brand} ${lead.model}`;
  return (
    <div className="lead-drawer-backdrop" onClick={close}>
      <aside className="lead-drawer" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="kicker">{type.toUpperCase()}</p>
            <h2>{subject}</h2>
          </div>
          <button type="button" onClick={close} aria-label="Cerrar solicitud">
            <X />
          </button>
        </header>
        <section className="lead-drawer-contact">
          <b>{lead.name}</b>
          <a href={`tel:${lead.phone}`}>{lead.phone}</a>
          {lead.email && <a href={`mailto:${lead.email}`}>{lead.email}</a>}
          <small>{lead.source || subject}</small>
        </section>
        <section className="lead-quick-summary" aria-label="Resumen de la solicitud">
          <div>
            <small>Estado</small>
            <b>{LEAD_STATUSES[lead.status || "NEW"]}</b>
          </div>
          <div>
            <small>Próximo paso</small>
            <b>{lead.nextActionText || (lead.nextActionAt ? "Seguimiento programado" : "Sin programar")}</b>
          </div>
          {kind === "sell-requests" && (
            <div>
              <small>Vehículo</small>
              <b>{[lead.version, lead.year, lead.kilometers ? `${lead.kilometers.toLocaleString("es-ES")} km` : ""].filter(Boolean).join(" · ") || "Datos pendientes"}</b>
            </div>
          )}
          {lead.images?.length > 0 && (
            <div>
              <small>Fotos</small>
              <b>{lead.images.length} adjuntas</b>
            </div>
          )}
        </section>
        {(lead.description || lead.message) && (
          <section className="lead-drawer-message">
            <b>Mensaje recibido</b>
            <p>{lead.description || lead.message}</p>
          </section>
        )}
        {lead.images?.length > 0 && (
          <section className="lead-drawer-images">
            <b>Fotos enviadas</b>
            <div>
              {lead.images.map((image) => (
                <button key={image} type="button" onClick={() => previewImage(image)}>
                  <img src={image} alt="Vehículo a valorar" />
                </button>
              ))}
            </div>
          </section>
        )}
        <LeadManagement
          lead={lead}
          kind={kind}
          updateLead={updateLead}
          anonymizeLead={anonymizeLead}
          showHistory={showHistory}
          deletedView={deletedView}
          moveToTrash={moveToTrash}
          restoreLead={restoreLead}
          permanentlyDeleteLead={permanentlyDeleteLead}
        />
      </aside>
    </div>
  );
}
function LeadManagement({
  lead,
  kind,
  updateLead,
  anonymizeLead,
  showHistory,
  deletedView,
  moveToTrash,
  restoreLead,
  permanentlyDeleteLead,
}) {
  const fromLead = () => ({
    status: lead.status || "NEW",
    priority: lead.priority || "NORMAL",
    adminNote: lead.adminNote || "",
    nextActionAt: lead.nextActionAt
      ? String(lead.nextActionAt).slice(0, 16)
      : "",
    nextActionText: lead.nextActionText || "",
    appointmentAt: lead.appointmentAt
      ? String(lead.appointmentAt).slice(0, 16)
      : "",
    appointmentNote: lead.appointmentNote || "",
  });
  const [draft, setDraft] = useState(fromLead);
  const [template, setTemplate] = useState("received");
  const [saved, setSaved] = useState(false);
  useEffect(() => setDraft(fromLead()), [lead.id, lead.updatedAt]);
  const change = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const templates = {
    received: `Hola ${lead.name}, hemos recibido tu solicitud. Te contactaremos enseguida.`,
    photos: `Hola ${lead.name}, ¿puedes enviarnos alguna foto adicional para valorar mejor la solicitud?`,
    appointment: `Hola ${lead.name}, podemos proponerte una cita para revisar el vehículo. ¿Qué día te va bien?`,
  };
  const saveFollowUp = async () => {
    const didSave = await updateLead(kind, lead.id, draft);
    if (!didSave) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };
  if (deletedView)
    return (
      <section className="lead-archive-actions">
        <div>
          <b>Solicitud en papelera</b>
          <small>Restáurala si quieres que vuelva a las solicitudes activas.</small>
        </div>
        <button type="button" className="restore-lead" onClick={() => restoreLead(kind, lead.id)}>
          Restaurar solicitud
        </button>
        <details>
          <summary>Eliminar o anonimizar</summary>
          <div>
            <button type="button" className="anonymize" onClick={() => anonymizeLead(kind, lead.id)}>Anonimizar datos</button>
            <button type="button" className="permanent-delete" onClick={() => permanentlyDeleteLead(kind, lead.id)}>Eliminar definitivamente</button>
          </div>
        </details>
      </section>
    );
  return (
    <div className="lead-management">
      <div className="lead-management-row">
        <label>
          Estado
          <select
            value={draft.status}
            onChange={(e) => change("status", e.target.value)}
          >
            {Object.entries(LEAD_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Prioridad
          <select
            value={draft.priority}
            onChange={(e) => change("priority", e.target.value)}
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">Alta</option>
          </select>
        </label>
      </div>
      <label>
        Próxima acción
        <input
          type="datetime-local"
          value={draft.nextActionAt}
          onChange={(e) => change("nextActionAt", e.target.value)}
        />
      </label>
      <input
        value={draft.nextActionText}
        onChange={(e) => change("nextActionText", e.target.value)}
        placeholder="Ej. Llamar para cerrar tasación"
      />
      <label>
        Cita prevista
        <input
          type="datetime-local"
          value={draft.appointmentAt}
          onChange={(e) => change("appointmentAt", e.target.value)}
        />
      </label>
      <input
        value={draft.appointmentNote}
        onChange={(e) => change("appointmentNote", e.target.value)}
        placeholder="Lugar o detalles de la cita"
      />
      <textarea
        value={draft.adminNote}
        onChange={(e) => change("adminNote", e.target.value)}
        placeholder="Nota privada: llamada, precio acordado, cita…"
      />
      <div className="lead-template">
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          aria-label="Respuesta rápida"
        >
          <option value="received">Confirmar recepción</option>
          <option value="photos">Pedir más fotos</option>
          <option value="appointment">Proponer cita</option>
        </select>
        <a
          href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(templates[template])}`}
          target="_blank"
          rel="noreferrer"
        >
          Abrir WhatsApp
        </a>
      </div>
      <div className="lead-primary-actions">
        <button type="button" className="save-followup" onClick={saveFollowUp}>
          Guardar cambios
        </button>
        <button type="button" className="history-lead" onClick={showHistory}>
          Ver historial del contacto
        </button>
      </div>
      {saved && <p className="lead-save-confirmation">Cambios guardados correctamente.</p>}
      <section className="lead-archive-actions">
        <div>
          <b>Archivar esta solicitud</b>
          <small>Se cerrará esta ficha y la verás inmediatamente en la Papelera.</small>
        </div>
        <button type="button" className="move-lead-trash" onClick={() => moveToTrash(kind, lead.id)}>
          Mover a la papelera
        </button>
        <details>
          <summary>Opciones de privacidad</summary>
          <div><button type="button" className="anonymize" onClick={() => anonymizeLead(kind, lead.id)}>Anonimizar datos personales</button></div>
        </details>
      </section>
    </div>
  );
}
function VehicleReadiness({ vehicle }) {
  const missing = vehicleReadiness(vehicle);
  return (
    <section className={`vehicle-readiness ${missing.length ? "incomplete" : "complete"}`}>
      <div>
        <b>{missing.length ? "Ficha por completar" : "Ficha lista para publicar"}</b>
        <small>
          {missing.length
            ? `Revisa: ${missing.join(", ")}.`
            : "Contiene la información esencial para presentar el vehículo."}
        </small>
      </div>
    </section>
  );
}
function VehicleHistory({ vehicle, token }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (!vehicle.id) return setEvents([]);
    fetch(`${API}/${vehicle.id}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      if (response.ok) setEvents(await response.json());
    });
  }, [vehicle.id, token]);
  if (!vehicle.id) return null;
  return (
    <section className="vehicle-history wide">
      <b>Historial reciente</b>
      {events.length ? (
        <div>
          {events.map((event) => (
            <p key={event.id}>
              <span>{new Date(event.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
              {event.detail}
            </p>
          ))}
        </div>
      ) : (
        <small>Los próximos cambios de precio, estado y fotografías aparecerán aquí.</small>
      )}
    </section>
  );
}
function VehiclePublishing({ vehicle, setVehicle, token }) {
  const [notice, setNotice] = useState("");
  const publicationFor = (channel) =>
    vehicle.publications?.find((item) => item.channel === channel);
  const statusText = (publication) => {
    if (!publication || publication.state === "NOT_CONFIGURED")
      return "Sin configurar";
    if (publication.state === "PENDING_CONFIGURATION")
      return "Pendiente de conectar";
    return publication.state === "DISABLED" ? "No incluir" : publication.state;
  };
  async function toggle(channel, requested) {
    const response = await fetch(
      `${API}/${vehicle.id}/publications/${channel}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requested }),
      },
    );
    if (!response.ok) {
      setNotice("No se pudo guardar este canal. Vuelve a iniciar sesión.");
      return;
    }
    const updated = await response.json();
    setVehicle((current) => ({
      ...current,
      publications: [
        ...(current.publications || []).filter(
          (item) => item.channel !== channel,
        ),
        updated,
      ],
    }));
    setNotice(
      requested
        ? "Este vehículo se enviará a este portal cuando la integración esté conectada."
        : "Este vehículo no se enviará a este portal.",
    );
  }
  if (!vehicle.id)
    return (
      <section className="publication-manager wide">
        <div>
          <b>Canales de publicación</b>
          <small>
            Guarda primero el vehículo. Después podrás decidir en qué portales
            se preparará para publicar.
          </small>
        </div>
      </section>
    );
  return (
    <section className="publication-manager wide">
      <div>
        <b>Canales de publicación</b>
        <small>
          La web se actualiza al guardar. Los portales se activarán cuando
          conectemos sus cuentas profesionales.
        </small>
      </div>
      <article className="publication-website">
        <span>Esta web</span>
        <b>{VEHICLE_STATUSES[vehicleStatus(vehicle)]}</b>
      </article>
      {Object.entries(PUBLICATION_CHANNELS).map(([channel, label]) => {
        const publication = publicationFor(channel);
        return (
          <label className="publication-channel" key={channel}>
            <span>
              <b>{label}</b>
              <small>{statusText(publication)}</small>
            </span>
            <input
              type="checkbox"
              checked={Boolean(publication?.requested)}
              onChange={(event) => toggle(channel, event.target.checked)}
            />
            <em>Preparar publicación</em>
          </label>
        );
      })}
      {notice && <p>{notice}</p>}
    </section>
  );
}
function VehicleForm({ vehicle: v, setVehicle, save, cancel, refresh, token }) {
  const change = (k, val) => setVehicle({ ...v, [k]: val });
  useEffect(() => {
    requestAnimationFrame(() =>
      document
        .querySelector(".editor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, [v.id]);
  return (
    <div className="editor">
      <div className="form-title">
        <div>
          <p className="kicker">
            {v.id ? "EDITAR VEHÍCULO" : "NUEVO VEHÍCULO"}
          </p>
          <h2>{v.id ? `${v.brand} ${v.model}` : "Ficha de vehículo"}</h2>
        </div>
        <button onClick={cancel}>
          <X />
        </button>
      </div>
      <VehicleReadiness vehicle={v} />
      <form onSubmit={save}>
        <label>
          Marca
          <select
            value={v.brand}
            onChange={(e) => change("brand", e.target.value)}
          >
            {brands.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Modelo
          <input
            required
            value={v.model}
            placeholder="Ej. Golf GTI"
            onChange={(e) => change("model", e.target.value)}
          />
        </label>
        <label>
          Versión / acabado
          <input
            value={v.version || ""}
            placeholder="Ej. 1.6 TDI Advance"
            onChange={(e) => change("version", e.target.value)}
          />
        </label>
        <label>
          Año
          <input
            required
            type="number"
            min="1950"
            max="2035"
            value={v.year}
            onChange={(e) => change("year", e.target.value)}
          />
        </label>
        <label>
          Kilómetros
          <input
            required
            type="number"
            min="0"
            value={v.kilometers}
            onChange={(e) => change("kilometers", e.target.value)}
          />
        </label>
        <label>
          Precio (€)
          <input
            required
            type="number"
            min="0"
            value={v.price}
            onChange={(e) => change("price", e.target.value)}
          />
        </label>
        <label>
          Potencia (CV)
          <input
            required
            type="number"
            min="1"
            value={v.power}
            onChange={(e) => change("power", e.target.value)}
          />
        </label>
        <label>
          Combustible
          <select
            value={v.fuel}
            onChange={(e) => change("fuel", e.target.value)}
          >
            {[
              "Gasolina",
              "Diésel",
              "Híbrido",
              "Híbrido enchufable",
              "Eléctrico",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Cambio
          <select
            value={v.transmission}
            onChange={(e) => change("transmission", e.target.value)}
          >
            <option>Manual</option>
            <option>Automático</option>
          </select>
        </label>
        <label>
          Estado del anuncio
          <select
            value={vehicleStatus(v)}
            onChange={(e) => change("status", e.target.value)}
          >
            {Object.entries(VEHICLE_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {vehicleStatus(v) === "PUBLISHED" && (
          <p className="publish-confirmation wide">
            Al pulsar “Publicar ahora”, esta ficha será visible inmediatamente en la web.
          </p>
        )}
        <label className="wide">
          Descripción
          <textarea
            value={v.description || ""}
            placeholder="Estado, equipamiento, garantía…"
            onChange={(e) => change("description", e.target.value)}
          />
        </label>
        <VehiclePublishing vehicle={v} setVehicle={setVehicle} token={token} />
        <VehiclePhotos vehicle={v} setVehicle={setVehicle} refresh={refresh} />
        <VehicleHistory vehicle={v} token={token} />
        <div className="form-actions">
          <button type="submit" name="saveMode" value="DRAFT" className="save-draft">
            Guardar borrador
          </button>
          <button type="submit" name="saveMode" value="save">
            Guardar cambios
          </button>
          <button type="submit" name="saveMode" value="PUBLISHED" className="button">
            Publicar ahora <Check />
          </button>
          <button type="button" onClick={cancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
function PhotoDock() {
  const [cars, setCars] = useState([]),
    [id, setId] = useState(""),
    [files, setFiles] = useState([]),
    [message, setMessage] = useState(""),
    [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = setInterval(
      () => setVisible(!!localStorage.token && location.hash === "#admin"),
      500,
    );
    fetch(API)
      .then((r) => r.json())
      .then((x) => {
        setCars(x);
        setId(x[0]?.id || "");
      });
    return () => clearInterval(check);
  }, []);
  async function upload() {
    if (!id || !files.length) return;
    setMessage("Subiendo fotografías…");
    try {
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const r = await fetch(`${API}/${id}/images`, {
          method: "POST",
          headers: { Authorization: "Bearer " + localStorage.token },
          body: data,
        });
        if (!r.ok) throw Error();
      }
      setMessage(
        `${files.length} fotografía(s) añadida(s). El catálogo se actualizará en unos segundos.`,
      );
      setFiles([]);
    } catch {
      setMessage(
        "No se pudieron subir las fotografías. Vuelve a iniciar sesión e inténtalo de nuevo.",
      );
    }
  }
  if (!visible) return null;
  return (
    <aside className="photo-dock">
      <div>
        <Upload />
        <span>
          <b>Subir fotos desde el ordenador</b>
          <small>Selecciona el vehículo y una o varias imágenes.</small>
        </span>
        <button onClick={() => setVisible(false)}>
          <X />
        </button>
      </div>
      <select value={id} onChange={(e) => setId(e.target.value)}>
        {cars.map((v) => (
          <option value={v.id} key={v.id}>
            {v.brand} {v.model}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      {files.length > 0 && (
        <small>{files.length} archivo(s) seleccionado(s)</small>
      )}
      <button className="button" onClick={upload}>
        Subir fotografías
      </button>
      {message && <p>{message}</p>}
    </aside>
  );
}
function VehiclePhotos({ vehicle: v, setVehicle, refresh }) {
  const [files, setFiles] = useState([]),
    [message, setMessage] = useState(""),
    [dragIndex, setDragIndex] = useState();
  async function saveImages(images, successMessage) {
    const response = await fetch(`${API}/${v.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
      body: JSON.stringify({ ...v, images }),
    });
    if (!response.ok)
      return setMessage("No se pudo guardar. Vuelve a iniciar sesión.");
    const updated = await response.json();
    setVehicle((current) => ({ ...current, images: updated.images }));
    refresh();
    setMessage(successMessage);
  }
  function move(index, direction) {
    const images = [...v.images],
      target = index + direction;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    saveImages(images, "Orden de fotografías guardado.");
  }
  function moveToCover(index) {
    if (!index) return;
    const images = [...v.images],
      [image] = images.splice(index, 1);
    images.unshift(image);
    saveImages(images, "Foto de portada actualizada.");
  }
  function dropAt(index) {
    if (dragIndex === undefined || dragIndex === index) return;
    const images = [...v.images],
      [image] = images.splice(dragIndex, 1);
    images.splice(index, 0, image);
    setDragIndex();
    saveImages(images, "Orden de fotografías guardado.");
  }
  async function upload() {
    if (!files.length) return;
    setMessage("Subiendo fotos…");
    try {
      let images = [...v.images];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const response = await fetch(`${API}/${v.id}/images`, {
          method: "POST",
          headers: { Authorization: "Bearer " + localStorage.token },
          body: data,
        });
        if (!response.ok) throw Error();
        images = (await response.json()).images;
      }
      setVehicle((current) => ({ ...current, images }));
      refresh();
      setFiles([]);
      setMessage("Fotografías añadidas. Puedes ordenarlas abajo.");
    } catch {
      setMessage("Error al subir. Vuelve a iniciar sesión.");
    }
  }
  if (!v.id)
    return (
      <section className="photo-manager">
        <div>
          <ImagePlus />
          <span>
            <b>Fotografías</b>
            <small>
              Guarda primero el vehículo para añadir fotos desde tu ordenador.
            </small>
          </span>
        </div>
      </section>
    );
  return (
    <section className="photo-manager">
      <div>
        <ImagePlus />
        <span>
          <b>
            Fotos de {v.brand} {v.model}
          </b>
          <small>
            Estas fotos pertenecen únicamente a este vehículo. La primera será
            la portada.
          </small>
        </span>
      </div>
      <div className="photo-sort">
        {v.images?.map((src, i) => (
          <div
            key={src + i}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragEnd={() => setDragIndex()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropAt(i)}
          >
            <img src={src} alt="" />
            <span>
              {i === 0 ? "Portada" : `Foto ${i + 1} · arrastra para ordenar`}
            </span>
            <button
              type="button"
              className="photo-cover"
              aria-label="Usar como portada"
              title="Usar como portada"
              disabled={!i}
              onClick={() => moveToCover(i)}
            >
              ★
            </button>
            <button
              type="button"
              aria-label="Subir foto"
              disabled={!i}
              onClick={() => move(i, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Bajar foto"
              disabled={i === v.images.length - 1}
              onClick={() => move(i, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              aria-label="Eliminar foto"
              onClick={() =>
                confirm("¿Eliminar esta fotografía?") &&
                saveImages(
                  v.images.filter((_, n) => n !== i),
                  "Fotografía eliminada.",
                )
              }
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      {files.length > 0 && <small>{files.length} foto(s) preparadas</small>}
      <button type="button" className="button" onClick={upload}>
        <Upload /> Subir fotos
      </button>
      {message && <p>{message}</p>}
    </section>
  );
}
function PrivateRoute() {
  useEffect(() => {
    const wipe = () => localStorage.removeItem("token"),
      open = () => {
        if (location.hash === "#admin") {
          wipe();
          requestAnimationFrame(() =>
            document.querySelector(".private")?.click(),
          );
        }
      };
    open();
    addEventListener("hashchange", open);
    addEventListener("beforeunload", wipe);
    return () => {
      removeEventListener("hashchange", open);
      removeEventListener("beforeunload", wipe);
    };
  }, []);
  return <App />;
}
createRoot(document.getElementById("root")).render(<PrivateRoute />);
