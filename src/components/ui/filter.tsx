import { useState } from "react";
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  COLOR_TYPES,
  CAR_BODY_TYPES,
  DRIVE_TYPES,
  TECHNICAL_CONDITIONS,
  CURRENCY_TYPES,
  VEHICLE_TYPES,
  MOTORCYCLE_TYPES,
  TRAILER_TYPES,
  BOAT_TYPES,
  AIRCRAFT_TYPES,
  type VehicleFilters,
} from "@/models/vehicle";

const pages = [
  "Базові дані",
  "Характеристики",
  "Двигун і трансмісія",
  "Фінанси та стан",
  "Додаткові",
];

interface FilterProps {
  onSearch?: (filters: Partial<VehicleFilters>) => void;
}

export default function Filter({ onSearch }: FilterProps) {
  const [activePage, setActivePage] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState<Partial<VehicleFilters>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const resetFilters = () => {
    setFilters({});
    onSearch?.({});
  };

  // --- SVG ICONS ---
  const icons = [
    (active: boolean) => (
      <svg
        className={active ? "text-blue-600" : "text-gray-400"}
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 17v-4.5A2.5 2.5 0 0 1 5.5 10h13A2.5 2.5 0 0 1 21 12.5V17a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="7.5"
          cy="16.5"
          r="1.5"
          fill={active ? "#2563eb" : "#d1d5db"}
        />
        <circle
          cx="16.5"
          cy="16.5"
          r="1.5"
          fill={active ? "#2563eb" : "#d1d5db"}
        />
      </svg>
    ),
    (active: boolean) => (
      <svg
        className={active ? "text-blue-600" : "text-gray-400"}
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="4"
          y="7"
          width="16"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="8" cy="16" r="1" fill={active ? "#2563eb" : "#d1d5db"} />
        <circle cx="16" cy="16" r="1" fill={active ? "#2563eb" : "#d1d5db"} />
      </svg>
    ),
    (active: boolean) => (
      <svg
        className={active ? "text-blue-600" : "text-gray-400"}
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="4"
          y="7"
          width="16"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="8"
          y="11"
          width="8"
          height="2"
          rx="1"
          fill={active ? "#2563eb" : "#d1d5db"}
        />
      </svg>
    ),
    (active: boolean) => (
      <svg
        className={active ? "text-blue-600" : "text-gray-400"}
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="4"
          y="7"
          width="16"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="10"
          y="9"
          width="4"
          height="6"
          rx="1"
          fill={active ? "#2563eb" : "#d1d5db"}
        />
      </svg>
    ),
    (active: boolean) => (
      <svg
        className={active ? "text-blue-600" : "text-gray-400"}
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="4"
          y="7"
          width="16"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="2"
          fill={active ? "#2563eb" : "#d1d5db"}
        />
      </svg>
    ),
  ];

  // --- РЕНДЕР ПОЛІВ ДЛЯ ВСІХ СТОРІНОК ---
  const renderPageFields = (pageIndex: number) => {
    switch (pageIndex) {
      case 0: // Базові дані
        return (
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Марка</label>
              <select
                name="brand"
                value={filters.brand || ""}
                onChange={handleChange}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                <option value="bmw">BMW</option>
                <option value="audi">Audi</option>
                <option value="mercedes">Mercedes</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="toyota">Toyota</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Регіон</label>
              <select
                name="location"
                value={filters.location || ""}
                onChange={handleChange}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                <option value="kyiv">Київ</option>
                <option value="lviv">Львів</option>
                <option value="odesa">Одеса</option>
                <option value="kharkiv">Харків</option>
                <option value="dnipro">Дніпро</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Рік</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="year_min"
                  value={filters.year_min || ""}
                  onChange={handleChange}
                  placeholder="Від"
                  className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                  style={{ width: "40%", minWidth: 0, flex: "1 1 0%" }}
                />
                <input
                  type="number"
                  name="year_max"
                  value={filters.year_max || ""}
                  onChange={handleChange}
                  placeholder="До"
                  className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                  style={{ width: "40%", minWidth: 0, flex: "1 1 0%" }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Коробка передач</label>
              <select
                name="transmission"
                value={filters.transmission?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    transmission: [e.target.value as any],
                  }))
                }
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {TRANSMISSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Модель</label>
              <input
                type="text"
                name="model"
                value={filters.model?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, model: [e.target.value] }))
                }
                placeholder="пошук"
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Паливо</label>
              <select
                name="fuel_type"
                value={filters.fuel_type?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fuel_type: [e.target.value as any],
                  }))
                }
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Ціна, $</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="price_min"
                  value={filters.price_min || ""}
                  onChange={handleChange}
                  placeholder="Від"
                  className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                  style={{ width: "40%", minWidth: 0, flex: "1 1 0%" }}
                />
                <input
                  type="number"
                  name="price_max"
                  value={filters.price_max || ""}
                  onChange={handleChange}
                  placeholder="До"
                  className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                  style={{ width: "40%", minWidth: 0, flex: "1 1 0%" }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => onSearch?.(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-sm font-medium transition-colors flex items-center justify-center w-[90%] mt-1 h-9"
                style={{ borderRadius: 0 }}
              >
                <svg
                  className="mr-2"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 20L17 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Пошук
              </button>
            </div>
          </div>
        );

      case 1: // Характеристики
        return (
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Пробіг (км)</label>
              <input
                type="number"
                name="mileage"
                value={filters.mileage || ""}
                onChange={handleChange}
                placeholder="Обрати"
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Колір</label>
              <select
                name="color"
                value={filters.color?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    color: [e.target.value as any],
                  }))
                }
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {COLOR_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Тип кузова</label>
              <select
                name="body_type"
                value={filters.body_type?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    body_type: [e.target.value as any],
                  }))
                }
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {CAR_BODY_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => onSearch?.(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-sm font-medium transition-colors flex items-center justify-center w-[90%] mt-1 h-9"
                style={{ borderRadius: 0 }}
              >
                <svg
                  className="mr-2"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 20L17 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Пошук
              </button>
            </div>
          </div>
        );

      case 2: // Двигун і трансмісія
        return (
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Об'єм (л)</label>
              <input
                type="number"
                name="engine_volume"
                value={filters.engine_volume || ""}
                onChange={handleChange}
                placeholder="Обрати"
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Потужність (к.с.)</label>
              <input
                type="number"
                name="engine_power"
                value={filters.engine_power || ""}
                onChange={handleChange}
                placeholder="Обрати"
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Привід</label>
              <select
                name="drive_type"
                value={filters.drive_type || ""}
                onChange={handleChange}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {DRIVE_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => onSearch?.(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-sm font-medium transition-colors flex items-center justify-center w-[90%] mt-1 h-9"
                style={{ borderRadius: 0 }}
              >
                <svg
                  className="mr-2"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 20L17 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Пошук
              </button>
            </div>
          </div>
        );

      case 3: // Фінанси та стан
        return (
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Валюта</label>
              <select
                name="currency"
                value={filters.currency || ""}
                onChange={handleChange}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {CURRENCY_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Стан</label>
              <select
                name="technical_condition"
                value={filters.technical_condition || ""}
                onChange={handleChange}
                className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-9"
                style={{ width: "90%" }}
              >
                <option value="">Обрати</option>
                {TECHNICAL_CONDITIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Розмитнений</label>
              <div className="flex items-center gap-2 p-2 border border-gray-300" style={{ height: "36px" }}>
                <input
                  type="checkbox"
                  name="is_custom_cleared"
                  checked={filters.is_custom_cleared || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Так</span>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => onSearch?.(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-sm font-medium transition-colors flex items-center justify-center w-[90%] mt-1 h-9"
                style={{ borderRadius: 0 }}
              >
                <svg
                  className="mr-2"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 20L17 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Пошук
              </button>
            </div>
          </div>
        );

      case 4: // Додаткові
        return (
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 w-full">
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Кухня</label>
              <div className="flex items-center gap-2 p-2 border border-gray-300" style={{ height: "36px" }}>
                <input
                  type="checkbox"
                  name="has_kitchen"
                  checked={filters.has_kitchen || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Так</span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-sm mb-1">Ванна кімната</label>
              <div className="flex items-center gap-2 p-2 border border-gray-300" style={{ height: "36px" }}>
                <input
                  type="checkbox"
                  name="has_bathroom"
                  checked={filters.has_bathroom || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Так</span>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => onSearch?.(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 text-sm font-medium transition-colors flex items-center justify-center w-[90%] mt-1 h-9"
                style={{ borderRadius: 0 }}
              >
                <svg
                  className="mr-2"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 20L17 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Пошук
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex bg-white shadow-sm border border-gray-200 p-4 mt-4"
      style={{
        borderRadius: 0,
        minHeight: showAll ? "100%" : "280px",
        height: showAll ? "auto" : "280px",
        alignItems: showAll ? "stretch" : "initial",
      }}
    >
      {/* Sidebar з іконками */}
      <div
        className="flex flex-col justify-stretch"
        style={{
          height: "100%",
          background: "#f5f7fa",
          width: "56px",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginTop: "-16px",
          marginLeft: "-16px",
        }}
      >
        {pages.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActivePage(idx);
              setShowAll(false);
            }}
            className={`flex items-center justify-center flex-1 w-full border-0 transition-colors ${
              activePage === idx && !showAll
                ? "bg-white shadow"
                : "bg-[#f5f7fa] hover:bg-gray-200"
            }`}
            style={{
              borderRadius: 0,
              minHeight: "56px",
              width: "100%",
              padding: 0,
            }}
          >
            <img 
              src="/locales/images/car.png" 
              alt={p}
              className="h-6 w-6"
            />
          </button>
        ))}
      </div>
      {/* Основна частина */}
      <div className="flex-1 pl-6 flex flex-col">
        <div className={`flex-1 ${showAll ? "flex flex-col h-full" : ""}`}>
          {showAll ? (
            <div className="flex flex-col h-full justify-between w-full">
              <div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Тип транспорту */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Тип транспорту</label>
                    <select
                      name="vehicle_type"
                      value={filters.vehicle_type || ""}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі типи</option>
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Марка */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Марка</label>
                    <input
                      type="text"
                      name="brand"
                      value={filters.brand || ""}
                      onChange={handleChange}
                      placeholder="Введіть марку"
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Модель */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Модель</label>
                    <input
                      type="text"
                      name="model"
                      value={filters.model?.[0] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, model: [e.target.value] }))
                      }
                      placeholder="Введіть модель"
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Рік випуску */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Рік випуску</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="year_min"
                        value={filters.year_min || ""}
                        onChange={handleChange}
                        placeholder="Від"
                        className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                      />
                      <input
                        type="number"
                        name="year_max"
                        value={filters.year_max || ""}
                        onChange={handleChange}
                        placeholder="До"
                        className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Ціна */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Ціна</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="price_min"
                        value={filters.price_min || ""}
                        onChange={handleChange}
                        placeholder="Від"
                        className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                      />
                      <input
                        type="number"
                        name="price_max"
                        value={filters.price_max || ""}
                        onChange={handleChange}
                        placeholder="До"
                        className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Валюта */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Валюта</label>
                    <select
                      name="currency"
                      value={filters.currency || ""}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі валюти</option>
                      {CURRENCY_TYPES.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Паливо */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Тип палива</label>
                    <select
                      name="fuel_type"
                      value={filters.fuel_type?.[0] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          fuel_type: [e.target.value as any],
                        }))
                      }
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі типи</option>
                      {FUEL_TYPES.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Коробка передач */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Коробка передач</label>
                    <select
                      name="transmission"
                      value={filters.transmission?.[0] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          transmission: [e.target.value as any],
                        }))
                      }
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі типи</option>
                      {TRANSMISSION_TYPES.map((transmission) => (
                        <option key={transmission} value={transmission}>
                          {transmission}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Колір */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Колір</label>
                    <select
                      name="color"
                      value={filters.color?.[0] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          color: [e.target.value as any],
                        }))
                      }
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі кольори</option>
                      {COLOR_TYPES.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Тип кузова */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Тип кузова</label>
                    <select
                      name="body_type"
                      value={filters.body_type?.[0] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          body_type: [e.target.value as any],
                        }))
                      }
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі типи</option>
                      {CAR_BODY_TYPES.map((body) => (
                        <option key={body} value={body}>
                          {body}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Привід */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Тип приводу</label>
                    <select
                      name="drive_type"
                      value={filters.drive_type || ""}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі типи</option>
                      {DRIVE_TYPES.map((drive) => (
                        <option key={drive} value={drive}>
                          {drive}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Пробіг */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Пробіг (км)</label>
                    <input
                      type="number"
                      name="mileage"
                      value={filters.mileage || ""}
                      onChange={handleChange}
                      placeholder="Макс. пробіг"
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Об'єм двигуна */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Об'єм двигуна (л)</label>
                    <input
                      type="number"
                      name="engine_volume"
                      value={filters.engine_volume || ""}
                      onChange={handleChange}
                      placeholder="Мін. об'єм"
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Потужність */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Потужність (к.с.)</label>
                    <input
                      type="number"
                      name="engine_power"
                      value={filters.engine_power || ""}
                      onChange={handleChange}
                      placeholder="Мін. потужність"
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Технічний стан */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Технічний стан</label>
                    <select
                      name="technical_condition"
                      value={filters.technical_condition || ""}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі стани</option>
                      {TECHNICAL_CONDITIONS.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Регіон */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Регіон</label>
                    <select
                      name="location"
                      value={filters.location || ""}
                      onChange={handleChange}
                      className="border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Всі регіони</option>
                      <option value="kyiv">Київ</option>
                      <option value="lviv">Львів</option>
                      <option value="odesa">Одеса</option>
                      <option value="kharkiv">Харків</option>
                      <option value="dnipro">Дніпро</option>
                    </select>
                  </div>

                  {/* Чекбокси */}
                  <div className="flex flex-col">
                    <label className="font-bold text-sm mb-1">Додаткові опції</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_custom_cleared"
                          checked={filters.is_custom_cleared || false}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">Розмитнений</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_kitchen"
                          checked={filters.has_kitchen || false}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">Є кухня</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="has_bathroom"
                          checked={filters.has_bathroom || false}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">Є ванна кімната</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Кнопка пошуку для розширеного пошуку */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => onSearch?.(filters)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-colors"
                >
                  Застосувати фільтри
                </button>
              </div>
            </div>
          ) : (
            renderPageFields(activePage)
          )}
        </div>
        {/* Кнопки під фільтрами */}
        <div className="flex flex-row justify-end items-center gap-6 mt-2">
          <button
            onClick={resetFilters}
            className="text-gray-600 hover:text-gray-800 hover:underline px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ borderRadius: 0 }}
          >
            Скинути
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 hover:underline px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ borderRadius: 0 }}
          >
            {showAll ? "Звичайний пошук" : "Розширений пошук"}
          </button>
        </div>
      </div>
    </div>
  );
}
