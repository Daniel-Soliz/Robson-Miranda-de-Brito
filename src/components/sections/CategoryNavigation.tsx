import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Camera, HeartHandshake, Images, Mail } from 'lucide-react';

const pages = [
  { title: 'Portfólio', detail: 'Histórias e registros', path: '/portfolio', Icon: Images, index: '01' },
  { title: 'Serviços', detail: 'Experiências e pacotes', path: '/servicos', Icon: Camera, index: '02' },
  { title: 'Sobre', detail: 'A visão por trás das lentes', path: '/sobre', Icon: HeartHandshake, index: '03' },
  { title: 'Agenda', detail: 'Consulte uma data', path: '/agenda', Icon: CalendarDays, index: '04' },
  { title: 'Contato', detail: 'Converse sobre sua ideia', path: '/contato', Icon: Mail, index: '05' },
];

export const CategoryNavigation: React.FC = () => (
  <section id="explorar" aria-labelledby="explorar-titulo" className="bg-[#08080A] border-y border-white/5 px-5vw py-16 sm:py-20">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9 sm:mb-12">
        <div>
          <span className="label-editorial">EXPLORE POR CATEGORIA</span>
          <h2 id="explorar-titulo" className="mt-3 font-cormorant text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-light">
            Encontre o que <span className="italic text-[#D4B679]">procura.</span>
          </h2>
        </div>
        <p className="text-[#9A958D] text-sm max-w-xs font-inter leading-relaxed">
          Navegue diretamente para cada área, sem precisar percorrer uma página interminável.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {pages.map(({ title, detail, path, Icon, index }) => (
          <Link key={path} to={path} className="group min-w-0 flex flex-col justify-between gap-7 sm:gap-12 p-4 sm:p-6 min-h-[176px] sm:min-h-[215px] rounded-[2px] bg-[#101013] border border-[#F2EEE8]/10 hover:bg-[#17171A] hover:border-[#D4B679]/65 transition-all duration-300 focus-visible:outline-[#D4B679]">
            <div className="flex justify-between items-start">
              <Icon size={21} strokeWidth={1.3} className="text-[#D4B679]" aria-hidden="true" />
              <span className="font-mono text-[10px] text-[#77736F]">{index}</span>
            </div>
            <div>
              <h3 className="font-cormorant font-light text-2xl sm:text-3xl text-[#FAF7F2] flex items-center gap-1.5">
                {title}<ArrowUpRight size={15} className="text-[#D4B679] opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </h3>
              <p className="font-inter text-[11px] leading-snug mt-1.5 text-[#9A958D]">{detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
