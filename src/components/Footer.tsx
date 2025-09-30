import React from 'react';

const NAV_LINKS = [
  {
    heading: 'Авто',
    links: [
      { label: 'Купити авто', href: '#' },
      { label: 'Продати авто', href: '#' },
      { label: 'Нові авто', href: '#' },
      { label: 'Вживані авто', href: '#' },
      { label: 'Електромобілі', href: '#' },
      { label: 'Авто з США / Європи', href: '#' },
    ],
  },
  {
    heading: 'Компанія',
    links: [
      { label: 'Про нас', href: '#' },
      { label: 'Питання та відповіді (FAQ)', href: '#' },
      { label: 'Контакти', href: '#' },
      { label: 'Партнерство', href: '#' },
    ],
  },
  {
    heading: 'Підтримка',
    links: [
      { label: 'Служба підтримки', href: '#' },
      { label: 'Як подати оголошення', href: '#' },
      { label: 'Правила користування', href: '#' },
      { label: 'Безпека угод', href: '#' },
    ],
  },
];

const MESSENGERS = [
  {
    label: 'Messenger',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M12 2C6.48 2 2 6.02 2 11.1c0 2.7 1.13 5.13 3.13 6.93v3.07c0 .41.47.65.8.4l2.73-2.18c.44.12.9.22 1.34.28.61.08 1.23.12 1.87.12 5.52 0 10-4.02 10-9.1S17.52 2 12 2Zm.13 13.1-2.1-2.23-4.13 2.23 5.13-5.6 2.1 2.23 4.13-2.23-5.13 5.6Z"
        />
      </svg>
    ),
    href: '#',
  },
  {
    label: 'Telegram',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M21.05 3.52 3.94 10.36c-1.34.52-1.33 1.25-.24 1.58l4.17 1.3 1.6 5.13c.21.67.38.93.78.93.4 0 .56-.15.77-.67l2.15-5.1 4.47 4.13c.82.72 1.41.35 1.61-.67l2.91-13.07c.23-1.04-.38-1.5-1.11-1.07Z"
        />
      </svg>
    ),
    href: '#',
  },
  {
    label: 'Viber',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M17.472 2.5H6.528A4.03 4.03 0 0 0 2.5 6.528v10.944A4.03 4.03 0 0 0 6.528 21.5h10.944A4.03 4.03 0 0 0 21.5 17.472V6.528A4.03 4.03 0 0 0 17.472 2.5Zm-5.472 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm0-12.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
        />
      </svg>
    ),
    href: '#',
  },
  {
    label: 'Phone',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.61a1 1 0 0 1-1 1C7.61 21 3 16.39 3 11a1 1 0 0 1 1-1h3.61a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"
        />
      </svg>
    ),
    href: '#',
  },
];

const Footer: React.FC = () => (
  <footer className="bg-[#0066cc] text-white pt-10 pb-6" role="contentinfo">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-8">
      <div className="flex-1">
        <div className="mb-8 flex items-center">
          <img src="/assets/images/logo.png" alt="AutoRia - Купівля та продаж автомобілів" className="h-12 w-auto" />
        </div>
        <nav aria-label="Footer navigation">
          <div className="flex flex-col sm:flex-row gap-8">
            {NAV_LINKS.map((col) => (
              <section key={col.heading} className="mb-6 sm:mb-0 min-w-[150px]">
                <h3 className="font-bold text-lg mb-3">{col.heading}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="hover:underline hover:text-blue-200 transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      </div>

      <section className="flex-1 flex flex-col items-start md:items-end">
        <div className="w-full md:w-auto">
          <h3 className="font-bold text-xl mb-1">Додаток Turbosell</h3>
          <p className="mb-4 text-sm text-blue-100">все для купівлі та продажу авто у вашому смартфоні</p>
          <div className="flex gap-3 mb-4 flex-wrap">
            <a
              href="#"
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-gray-800 transition"
              aria-label="Download on the App Store"
            >
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M17.564 13.568c-.02-2.07 1.693-3.06 1.77-3.105-0.967-1.413-2.47-1.607-2.998-1.627-1.277-.13-2.493.747-3.142.747-.648 0-1.646-.728-2.71-.708-1.393.02-2.684.81-3.4 2.06-1.456 2.522-.372 6.25 1.045 8.295.693 1.01 1.516 2.145 2.6 2.104 1.048-.04 1.444-.677 2.71-.677 1.266 0 1.62.677 2.71.657 1.12-.02 1.826-1.03 2.51-2.04.796-1.16 1.124-2.29 1.143-2.35-.025-.012-2.19-.84-2.21-3.33zm-2.13-6.08c.57-.69.96-1.65.85-2.61-.82.03-1.81.55-2.4 1.24-.53.6-.99 1.57-.82 2.5.87.07 1.77-.44 2.37-1.13z" />
              </svg>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-xs">Download on the</span>
                <span className="font-semibold text-sm">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-gray-800 transition"
              aria-label="Get it on Google Play"
            >
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M3.6 2.2c-.4.2-.6.6-.6 1.1v17.4c0 .5.2.9.6 1.1.4.2.9.2 1.3-.1l11.2-8.7-12.5-9.8c-.4-.3-.9-.3-1.3-.1zm16.7 8.2-2.8-2.2-2.7 2.1 2.7 2.1 2.8-2zm-2.8 2.7-2.7 2.1 2.7 2.1 2.8-2.2-2.8-2zm-13.9 7.5c-.4.3-.4.8 0 1.1.2.2.5.2.7 0l12.5-9.8-1.2-.9-12 9.6zm13.9-7.5 2.8-2.2c.4-.3.4-.8 0-1.1-.2-.2-.5-.2-.7 0l-2.8 2.2 2.7 2.1z" />
              </svg>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-xs">GET IT ON</span>
                <span className="font-semibold text-sm">Google Play</span>
              </span>
            </a>
          </div>
          <div className="flex gap-3">
            {MESSENGERS.map((m) => (
              <a
                key={m.label}
                href={m.href}
                className="bg-blue-500 hover:bg-blue-400 rounded-md p-2 transition"
                aria-label={m.label}
              >
                {m.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  </footer>
);

export default Footer;
